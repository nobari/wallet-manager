'use client';

import {useState} from 'react';
import {generateWallet} from '@/lib/bitcoin';
import {useWalletStore} from '@/lib/store';
import toast from 'react-hot-toast';
import * as bip39 from 'bip39';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';
import {WalletImportProps} from '../types';

export function WalletImport({className}: WalletImportProps) {
  const t = useTranslations('wallet');

  const [mnemonic, setMnemonic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {wallets, addWallet} = useWalletStore((state) => ({
    wallets: state.wallets,
    addWallet: state.addWallet
  }));

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mnemonic.trim()) return;

    try {
      setIsLoading(true);

      // Validate mnemonic
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error(t('messages.invalidMnemonic'));
      }

      // Check if mnemonic already exists
      const existingWallet = wallets.some(
        (w) => w.mnemonic === mnemonic.trim()
      );
      if (existingWallet) {
        const confirmImport = window.confirm(
          'This mnemonic is already in use. Would you like to generate an additional wallet from this mnemonic?'
        );
        if (!confirmImport) {
          toast(t('messages.importCancelled'), {
            icon: 'ℹ️'
          });
          return;
        }
      }

      // Import wallet
      const wallet = await generateWallet(mnemonic, wallets.length);

      // Verify it's not a duplicate address
      if (wallets.some((w) => w.address === wallet.address)) {
        throw new Error(t('messages.duplicateAddress'));
      }

      addWallet(wallet);
      setMnemonic('');
      toast.success(t('messages.importSuccess'));
    } catch (error) {
      console.error('Error importing wallet:', error);
      toast.error(
        error instanceof Error ? error.message : t('messages.importError')
      );
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
        {t('import.title')}
      </h2>
      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label className="block text-gray-900 dark:text-gray-200 mb-2">
            {t('import.mnemonicLabel')}
          </label>
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            className="w-full p-2 border rounded h-24 font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
            placeholder={t('import.mnemonicPlaceholder')}
            required
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('import.mnemonicDesc')}
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading || !mnemonic.trim()}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('import.importing') : t('import.button')}
        </button>
      </form>
    </div>
  );
}
