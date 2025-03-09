import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import {ECPairFactory} from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import {BIP32Factory} from 'bip32';
import {bitcoinNetwork as networkName, blockchainApiUrl} from '@/config/env';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const network =
  networkName === 'mainnet'
    ? bitcoin.networks.bitcoin
    : bitcoin.networks.testnet;

interface UTXO {
  txid: string;
  vout: number;
  value: number;
}

export interface WalletDetails {
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic: string;
  accountIndex: number;
  name: string;
}

export const generateWallet = async (
  existingMnemonic?: string,
  accountIndex: number = 0
): Promise<WalletDetails> => {
  // Generate or use existing mnemonic
  const mnemonic = existingMnemonic || bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Generate HD wallet from seed
  const root = bip32.fromSeed(seed, network);
  const path = `m/44'/0'/${accountIndex}'/0/0`;
  const keyPair = root.derivePath(path);

  const {address} = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(keyPair.publicKey),
    network
  });

  return {
    address: address!,
    privateKey: Buffer.from(keyPair.privateKey!).toString('hex'),
    publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
    mnemonic,
    accountIndex,
    name: `Wallet ${accountIndex + 1}`
  };
};

export const getBalance = async (address: string): Promise<number> => {
  try {
    const response = await fetch(`${blockchainApiUrl}/address/${address}/utxo`);
    const utxos = (await response.json()) as UTXO[];
    return utxos.reduce((acc: number, utxo: UTXO) => acc + utxo.value, 0);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
};

export const createTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKey: string
) => {
  try {
    // Fetch UTXOs
    const response = await fetch(
      `${blockchainApiUrl}/address/${fromAddress}/utxo`
    );
    const utxos = await response.json();

    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
      network
    });
    const psbt = new bitcoin.Psbt({network});

    // Define dust threshold (546 satoshis for standard transactions)
    const DUST_THRESHOLD = 546;

    // Add inputs
    let totalInput = 0;
    for (const utxo of utxos) {
      // Fetch transaction hex
      const txResponse = await fetch(`${blockchainApiUrl}/tx/${utxo.txid}/hex`);
      const txHex = await txResponse.text();

      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: Buffer.from(txHex, 'hex')
      });

      totalInput += utxo.value;

      // Break if we have enough inputs to cover the amount plus fees
      if (totalInput >= amount + 1000) break;
    }

    // Make sure we have enough funds
    if (totalInput < amount + DUST_THRESHOLD) {
      throw new Error('Insufficient funds to complete this transaction');
    }

    // Calculate fee (simplified fee calculation)
    const fee = 1000;

    // Add output for recipient
    if (amount >= DUST_THRESHOLD) {
      psbt.addOutput({
        address: toAddress,
        value: amount
      });
    } else {
      throw new Error(
        `Amount is below dust threshold (${DUST_THRESHOLD} satoshis)`
      );
    }

    // Add change output if necessary
    const changeAmount = totalInput - amount - fee;
    if (changeAmount >= DUST_THRESHOLD) {
      psbt.addOutput({
        address: fromAddress,
        value: changeAmount
      });
    } else if (changeAmount > 0) {
      // If change is positive but below dust threshold, add it to the fee
      // This effectively means we're not creating a change output
      console.log(
        `Change amount (${changeAmount}) below dust threshold, adding to fee`
      );
    }

    // Sign all inputs
    psbt.signAllInputs(keyPair);
    psbt.finalizeAllInputs();

    // Get transaction hex
    const tx = psbt.extractTransaction();
    return tx.toHex();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const broadcastTransaction = async (txHex: string): Promise<string> => {
  try {
    const response = await fetch(`${blockchainApiUrl}/tx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: txHex
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to broadcast transaction: ${errorText}`);
    }

    // The API typically returns the transaction ID (txid) on success
    const txid = await response.text();
    return txid;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw error;
  }
};
