'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {WalletTransactionsProps} from '../types';
import {blockchainApiUrl, blockchainExplorerUrl} from '@/config/env';

interface Transaction {
  txid: string;
  time: number;
  amount: number;
  fee: number;
  type: 'sent' | 'received';
  confirmations: number;
  status: 'confirmed' | 'pending';
}

// Blockstream API transaction interface
interface BlockstreamTx {
  txid: string;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_time?: number;
  };
  fee: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey_address: string;
      value: number;
    };
    sequence: number;
  }>;
  vout: Array<{
    scriptpubkey_address: string;
    value: number;
  }>;
}

export function WalletTransactions({
  wallet,
  refreshTrigger = 0
}: WalletTransactionsProps) {
  const t = useTranslations('wallet');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);

  // Determine explorer URL based on network
  const explorerBaseUrl = `${blockchainExplorerUrl}/tx/`;

  // Function to manually refresh transactions
  const handleRefresh = () => {
    setManualRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!wallet?.address) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch transactions from Blockstream API
        const apiUrl = `${blockchainApiUrl}/address/${wallet.address}/txs`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const txData: BlockstreamTx[] = await response.json();

        // Process and transform the transaction data
        const processedTransactions: Transaction[] = txData
          .slice(0, 10)
          .map((tx) => {
            // Determine if this is a sent or received transaction
            let type: 'sent' | 'received' = 'received';
            let amount = 0;

            // Check if wallet address is in inputs (sending)
            const isInputFromWallet = tx.vin.some(
              (input) => input.prevout.scriptpubkey_address === wallet.address
            );

            // Check if wallet address is in outputs (receiving)
            const outputToWallet = tx.vout.find(
              (output) => output.scriptpubkey_address === wallet.address
            );

            if (isInputFromWallet) {
              type = 'sent';
              // Calculate amount sent (sum of outputs not going back to wallet)
              amount = tx.vout
                .filter(
                  (output) => output.scriptpubkey_address !== wallet.address
                )
                .reduce((sum, output) => sum + output.value, 0);
            } else if (outputToWallet) {
              type = 'received';
              amount = outputToWallet.value;
            }

            // Convert from satoshis to BTC
            amount = amount / 100000000;

            return {
              txid: tx.txid,
              time: tx.status.block_time || Math.floor(Date.now() / 1000),
              amount,
              fee: tx.fee / 100000000, // Convert from satoshis to BTC
              type,
              confirmations: tx.status.confirmed ? 1 : 0, // Simplified, in real app would calculate based on current block height
              status: tx.status.confirmed ? 'confirmed' : 'pending'
            };
          });

        setTransactions(processedTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);

        // Fallback to mock data if API fails
        const mockTransactions: Transaction[] = Array.from(
          {length: 10},
          (_, i) => {
            const isReceived = Math.random() > 0.5;
            const amount = Math.floor(Math.random() * 1000000) / 100000000;
            const daysAgo = i * 2;
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            return {
              txid: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
              time: date.getTime() / 1000,
              amount: amount,
              fee: isReceived
                ? 0
                : Math.floor(Math.random() * 10000) / 100000000,
              type: isReceived ? 'received' : 'sent',
              confirmations: Math.floor(Math.random() * 100) + 1,
              status: 'confirmed'
            };
          }
        );

        setTransactions(mockTransactions);
        setError(t('details.transactions.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [
    wallet?.address,
    t,
    blockchainApiUrl,
    refreshTrigger,
    manualRefreshTrigger
  ]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          {t('details.transactions.usingMockData')}
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>{t('details.transactions.noTransactions')}</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('details.transactions.title')}
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={clsx(
            'inline-flex items-center px-3 m-2 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md',
            'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          )}
        >
          <ArrowPathIcon
            className={clsx('h-4 w-4 mr-1', isLoading && 'animate-spin')}
          />
          {t('details.transactions.refresh')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t('details.transactions.type')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t('details.transactions.date')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t('details.transactions.amount')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t('details.transactions.status')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t('details.transactions.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((tx) => (
              <tr
                key={tx.txid}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span
                      className={clsx(
                        'flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center',
                        tx.type === 'received'
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      )}
                    >
                      {tx.type === 'received' ? (
                        <ArrowDownIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpIcon className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                      {tx.type === 'received'
                        ? t('details.transactions.received')
                        : t('details.transactions.sent')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(tx.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={clsx(
                      'text-sm font-medium',
                      tx.type === 'received'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {tx.type === 'received' ? '+' : '-'}
                    {tx.amount.toFixed(8)} BTC
                  </span>
                  {tx.type === 'sent' && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('details.transactions.fee')}: {tx.fee.toFixed(8)} BTC
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={clsx(
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      tx.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    )}
                  >
                    {tx.status === 'confirmed'
                      ? `${t('details.transactions.confirmed')} (${tx.confirmations})`
                      : t('details.transactions.pending')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`${explorerBaseUrl}${tx.txid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                  >
                    {t('details.transactions.viewExplorer')}
                    <ArrowTopRightOnSquareIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
