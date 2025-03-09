'use client';

import {Toaster} from 'react-hot-toast';
import {useTranslations} from 'next-intl';
import {WalletCreate} from '@/features/wallet-management';
import {WalletImport} from '@/features/wallet-management';
import {WalletDetails} from '@/features/wallet-detail';
import {useWalletStore} from '@/lib/store';

export default function Home() {
  const t = useTranslations('wallet');
  const wallets = useWalletStore((state) => state.wallets);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white'
        }}
      />

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {wallets.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WalletCreate />
              <WalletImport />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <WalletCreate />
                  <div className="mt-6">
                    <WalletImport />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <WalletDetails />
                </div>
              </div>
            </>
          )}

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p>
              {t.rich('network.connected', {
                network:
                  process.env.NEXT_PUBLIC_BITCOIN_NETWORK === 'mainnet'
                    ? t('network.mainnet')
                    : t('network.testnet')
              })}
            </p>
            <p className="mt-2">⚠️ {t('details.backup.mnemonicWarning')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
