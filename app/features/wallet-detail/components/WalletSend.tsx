'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';
import {ArrowPathIcon} from '@heroicons/react/24/outline';
import {WalletSendProps} from '../types';
import {PasteFromClipboard} from '@/features/common';

export function WalletSend({isLoading, onSend}: WalletSendProps) {
  const t = useTranslations('wallet');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAddress || !amount) return;

    await onSend(recipientAddress, amount);
    setRecipientAddress('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="recipient-address"
          className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2"
        >
          {t('details.send.recipientLabel')}
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            id="recipient-address"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className={clsx(
              'block w-full rounded-md border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
              'focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500',
              'px-3 py-2 sm:text-sm transition-colors',
              'pr-10'
            )}
            placeholder={t('details.send.recipientPlaceholder')}
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <PasteFromClipboard
              onPaste={(text) => setRecipientAddress(text)}
              tooltipPosition="left"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2"
        >
          {t('details.send.amountLabel')}
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={clsx(
              'block w-full rounded-md border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
              'focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500',
              'px-3 py-2 pr-12 sm:text-sm transition-colors'
            )}
            placeholder="0.0"
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
              BTC
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !recipientAddress || !amount}
          className={clsx(
            'w-full flex justify-center py-2 px-4 border border-transparent',
            'rounded-md shadow-sm text-sm font-medium text-white',
            'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2',
            'focus:ring-offset-2 focus:ring-blue-500 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600'
          )}
        >
          {isLoading ? (
            <span className="flex items-center">
              <ArrowPathIcon
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                aria-hidden="true"
              />
              {t('details.send.sending')}
            </span>
          ) : (
            t('details.send.button')
          )}
        </button>
      </div>
    </form>
  );
}
