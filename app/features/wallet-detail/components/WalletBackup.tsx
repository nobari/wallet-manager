'use client';

import {useTranslations} from 'next-intl';
import {WalletBackupProps} from '../types';
import {CopyToClipboard} from '@/features/common';

export function WalletBackup({wallet}: WalletBackupProps) {
  const t = useTranslations('wallet');

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('details.backup.privateKeyWarning')}
        </p>
        <CopyToClipboard text={wallet.privateKey} tooltipPosition="left" />
      </div>
      <p className="font-mono break-all text-sm mt-2 text-gray-900 dark:text-gray-300">
        {wallet.privateKey}
      </p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('details.backup.mnemonicWarning')}
        </p>
        <CopyToClipboard text={wallet.mnemonic} tooltipPosition="left" />
      </div>
      <p className="font-mono break-all text-sm mt-2 text-gray-900 dark:text-gray-300">
        {wallet.mnemonic}
      </p>
    </div>
  );
}
