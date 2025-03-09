'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import toast from 'react-hot-toast';
import {useWalletStore} from '@/lib/store';
import {
  getBalance,
  createTransaction,
  broadcastTransaction
} from '@/lib/bitcoin';
import {
  WalletSelector,
  WalletHeader,
  WalletTabs,
  WalletBackup
} from './components';

export default function WalletDetails() {
  const t = useTranslations('wallet');

  const {
    wallets,
    selectedWalletIndex,
    selectWallet,
    balances,
    setBalance,
    renameWallet,
    removeWallet
  } = useWalletStore((state) => ({
    wallets: state.wallets,
    selectedWalletIndex: state.selectedWalletIndex,
    selectWallet: state.selectWallet,
    balances: state.balances,
    setBalance: state.setBalance,
    renameWallet: state.renameWallet,
    removeWallet: state.removeWallet
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState(0);

  const selectedWallet =
    selectedWalletIndex !== null ? wallets[selectedWalletIndex] : null;

  useEffect(() => {
    if (selectedWallet?.address) {
      fetchBalance(selectedWallet.address);
    }
  }, [selectedWallet?.address]);

  useEffect(() => {
    if (selectedWallet) {
      setNewName(selectedWallet.name);
    }
  }, [selectedWallet]);

  const handleRename = () => {
    if (!selectedWallet || !newName.trim() || selectedWalletIndex === null)
      return;
    renameWallet(selectedWalletIndex, newName.trim());
    setIsRenaming(false);
    toast.success(t('messages.renameSuccess'));
  };

  const cancelRename = () => {
    setNewName(selectedWallet?.name || '');
    setIsRenaming(false);
  };

  const fetchBalance = async (address: string) => {
    try {
      const newBalance = await getBalance(address);
      setBalance(address, newBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error(t('messages.balanceError'));
    }
  };

  const handleSend = async (recipientAddress: string, amount: string) => {
    if (!selectedWallet || !recipientAddress || !amount) return;

    try {
      setIsLoading(true);

      // Convert amount to satoshis (smallest unit in Bitcoin)
      const amountSats = parseInt(amount);

      if (isNaN(amountSats) || amountSats <= 0) {
        throw new Error('Invalid amount');
      }

      const txHex = await createTransaction(
        selectedWallet.address,
        recipientAddress,
        amountSats,
        selectedWallet.privateKey
      );

      console.log('Transaction created:', txHex);

      // Broadcast the transaction to the network
      const txid = await broadcastTransaction(txHex);
      console.log('Transaction broadcast successfully, txid:', txid);

      toast.success(t('messages.transactionSuccess'));

      // Refresh balance and transaction list
      await fetchBalance(selectedWallet.address);
      setTransactionRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error creating or broadcasting transaction:', error);

      // Handle specific error messages
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('dust')) {
        toast.error('Amount too small (dust)');
      } else if (errorMessage.includes('Insufficient funds')) {
        toast.error('Insufficient funds to complete this transaction');
      } else {
        toast.error(t('messages.transactionError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (wallets.length === 0) {
    return null;
  }

  return (
    <div>
      <WalletSelector
        wallets={wallets}
        selectedWalletIndex={selectedWalletIndex}
        onSelectWallet={selectWallet}
        onRefreshBalance={fetchBalance}
        onRemoveWallet={removeWallet}
      />

      {selectedWallet ? (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
          <WalletHeader
            wallet={selectedWallet}
            balance={balances[selectedWallet.address]}
            isRenaming={isRenaming}
            newName={newName}
            onRename={handleRename}
            onCancelRename={cancelRename}
            onStartRenaming={() => setIsRenaming(true)}
            onNameChange={setNewName}
          />

          <WalletTabs
            wallet={selectedWallet}
            balance={balances[selectedWallet.address]}
            isLoading={isLoading}
            onSend={handleSend}
            transactionRefreshTrigger={transactionRefreshTrigger}
          />

          <WalletBackup wallet={selectedWallet} />
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
          <p className="text-gray-700 dark:text-gray-300">
            {t('details.noWalletSelected')}
          </p>
        </div>
      )}
    </div>
  );
}
