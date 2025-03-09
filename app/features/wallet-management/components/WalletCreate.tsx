'use client';

import {useState} from 'react';
import {generateWallet} from '@/lib/bitcoin';
import {useWalletStore} from '@/lib/store';
import toast from 'react-hot-toast';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';
import {WalletCreateProps} from '../types';

export function WalletCreate({className}: WalletCreateProps) {
  const t = useTranslations('wallet');

  const [isLoading, setIsLoading] = useState(false);
  const [useNewMnemonic, setUseNewMnemonic] = useState(false);
  const {wallets, addWallet} = useWalletStore((state) => ({
    wallets: state.wallets,
    addWallet: state.addWallet
  }));

  const handleCreateWallet = async () => {
    try {
      setIsLoading(true);
      const existingMnemonic = wallets[0]?.mnemonic;
      const newWallet = await generateWallet(
        useNewMnemonic ? undefined : existingMnemonic,
        useNewMnemonic ? 0 : wallets.length
      );
      addWallet(newWallet);
      toast.success(t('messages.createSuccess'));
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error(t('messages.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors',
        className
      )}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('create.title')}
      </h2>
      {wallets.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="text-gray-700 dark:text-gray-300 mb-2 block">
              {t('create.mnemonicOptions')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500"
                  checked={!useNewMnemonic}
                  onChange={() => setUseNewMnemonic(false)}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('create.useExisting', {
                    count: wallets.length,
                    plural: wallets.length === 1 ? '' : 's'
                  })}
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500"
                  checked={useNewMnemonic}
                  onChange={() => setUseNewMnemonic(true)}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('create.useNew')}
                </span>
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {useNewMnemonic
              ? t('create.newMnemonicDesc')
              : t('create.existingMnemonicDesc')}
          </p>
        </>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {t('create.firstWallet')}
        </p>
      )}
      <button
        onClick={handleCreateWallet}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? t('create.creating') : t('create.button')}
      </button>
    </div>
  );
}
