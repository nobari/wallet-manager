'use client';

import {TabGroup, TabList, Tab, TabPanel, TabPanels} from '@headlessui/react';
import clsx from 'clsx';
import {WalletTabsProps} from '../types';
import {WalletInfo} from './WalletInfo';
import {WalletSend} from './WalletSend';
import {WalletTransactions} from './WalletTransactions';
import {useTranslations} from 'next-intl';

export function WalletTabs({
  wallet,
  balance,
  isLoading,
  onSend,
  transactionRefreshTrigger = 0
}: WalletTabsProps) {
  const t = useTranslations('wallet');

  return (
    <TabGroup>
      <TabList className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1 mb-6">
        <Tab
          className={({selected}) =>
            clsx(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
              selected
                ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-800/[0.12] hover:text-gray-900 dark:hover:text-white'
            )
          }
        >
          {t('details.walletInfo')}
        </Tab>
        <Tab
          className={({selected}) =>
            clsx(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
              selected
                ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-800/[0.12] hover:text-gray-900 dark:hover:text-white'
            )
          }
        >
          {t('details.send.title')}
        </Tab>
        <Tab
          className={({selected}) =>
            clsx(
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
              selected
                ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-800/[0.12] hover:text-gray-900 dark:hover:text-white'
            )
          }
        >
          {t('details.transactions.title')}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          className={clsx(
            'rounded-xl p-3',
            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
          )}
        >
          <WalletInfo wallet={wallet} balance={balance} />
        </TabPanel>
        <TabPanel
          className={clsx(
            'rounded-xl p-3',
            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
          )}
        >
          <WalletSend isLoading={isLoading} onSend={onSend} />
        </TabPanel>
        <TabPanel
          className={clsx(
            'rounded-xl p-3',
            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
          )}
        >
          <WalletTransactions
            wallet={wallet}
            refreshTrigger={transactionRefreshTrigger}
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
