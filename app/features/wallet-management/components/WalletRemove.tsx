'use client';

import {useState} from 'react';
import {useWalletStore} from '@/lib/store';
import toast from 'react-hot-toast';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';
import {WalletRemoveProps} from '../types';

export function WalletRemove({className}: WalletRemoveProps) {
  const t = useTranslations('wallet');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {wallets, removeWallet} = useWalletStore((state) => ({
    wallets: state.wallets,
    removeWallet: state.removeWallet
  }));

  const handleRemoveWallet = async () => {
    if (selectedIndex === null) return;

    try {
      setIsLoading(true);
      removeWallet(selectedIndex);
      toast.success(t('messages.removeSuccess'));
      setShowConfirmation(false);
      setSelectedIndex(null);
    } catch (error) {
      console.error('Error removing wallet:', error);
      toast.error(t('messages.removeError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6',
        className
      )}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {t('remove.title')}
      </h2>

      {!showConfirmation ? (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('remove.description')}
          </p>

          {wallets.length === 0 ? (
            <p className="text-amber-600 dark:text-amber-400 italic">
              {t('remove.noWallets')}
            </p>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('remove.selectWallet')}
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={selectedIndex === null ? '' : selectedIndex}
                onChange={(e) =>
                  setSelectedIndex(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">{t('remove.selectOption')}</option>
                {wallets.map((wallet, index) => (
                  <option key={wallet.address} value={index}>
                    {wallet.name} ({wallet.address.substring(0, 8)}...
                    {wallet.address.substring(wallet.address.length - 8)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowConfirmation(true)}
            disabled={
              selectedIndex === null || isLoading || wallets.length === 0
            }
          >
            {t('remove.button')}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400 font-medium">
              {t('remove.warning')}
            </p>
            <p className="text-red-600 dark:text-red-300 mt-2">
              {t('remove.confirmText')}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md transition-colors"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              {t('remove.cancel')}
            </button>
            <button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              onClick={handleRemoveWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>{t('remove.removing')}</span>
              ) : (
                <span>{t('remove.confirm')}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
