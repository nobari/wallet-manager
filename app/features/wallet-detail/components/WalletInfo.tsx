'use client';

import {useTranslations} from 'next-intl';
import {WalletInfoProps} from '../types';
import {CopyToClipboard} from '@/features/common';

export function WalletInfo({wallet, balance}: WalletInfoProps) {
  const t = useTranslations('wallet');

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('details.address')}
        </p>
        <div className="flex items-center mt-1">
          <p className="font-mono break-all text-gray-900 dark:text-white mr-2">
            {wallet.address}
          </p>
          <CopyToClipboard text={wallet.address} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('details.balance')}
        </p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          {balance ?? 0} {t('details.satoshis')}
        </p>
      </div>
    </div>
  );
}
