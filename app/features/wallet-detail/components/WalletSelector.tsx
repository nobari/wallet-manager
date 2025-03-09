'use client';

import {Fragment, useState} from 'react';
import {
  Listbox,
  ListboxButton,
  Transition,
  ListboxOptions,
  ListboxOption
} from '@headlessui/react';
import {
  ChevronDownIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';
import {WalletSelectorProps} from '../types';

export function WalletSelector({
  wallets,
  selectedWalletIndex,
  onSelectWallet,
  onRefreshBalance,
  onRemoveWallet
}: WalletSelectorProps) {
  const t = useTranslations('wallet');
  const selectedWallet =
    selectedWalletIndex !== null ? wallets[selectedWalletIndex] : null;

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [walletToRemove, setWalletToRemove] = useState<number | null>(null);

  const handleRemoveClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWalletToRemove(index);
    setShowRemoveConfirmation(true);
  };

  const handleConfirmRemove = () => {
    if (walletToRemove !== null) {
      onRemoveWallet(walletToRemove);
      setShowRemoveConfirmation(false);
      setWalletToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
    setWalletToRemove(null);
  };

  return (
    <div className="mb-6 flex items-center space-x-4">
      <div className="relative w-64">
        <Listbox value={selectedWalletIndex} onChange={onSelectWallet}>
          <div className="relative">
            <ListboxButton
              className={clsx(
                'relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'border border-gray-300 dark:border-gray-600',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500',
                'transition-colors'
              )}
            >
              <span className="block truncate">
                {selectedWalletIndex !== null
                  ? wallets[selectedWalletIndex].name
                  : t('details.selectWallet')}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                className={clsx(
                  'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1',
                  'bg-white dark:bg-gray-700 text-base shadow-lg ring-1 ring-black ring-opacity-5',
                  'focus:outline-none sm:text-sm',
                  'transition-colors'
                )}
              >
                {wallets.map((wallet, index) => (
                  <ListboxOption
                    key={wallet.address}
                    className={({active}) =>
                      clsx(
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                        active
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      )
                    }
                    value={index}
                  >
                    {({selected, active}) => (
                      <>
                        <span
                          className={clsx(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal'
                          )}
                        >
                          {wallet.name}
                        </span>
                        {selected ? (
                          <span
                            className={clsx(
                              'absolute inset-y-0 left-0 flex items-center pl-3',
                              active
                                ? 'text-blue-600 dark:text-blue-300'
                                : 'text-blue-600 dark:text-blue-300'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        <button
                          onClick={(e) => handleRemoveClick(index, e)}
                          className={clsx(
                            'absolute inset-y-0 right-0 flex items-center pr-3',
                            active
                              ? 'text-blue-600 dark:text-blue-300'
                              : 'text-gray-400 dark:text-gray-500',
                            'hover:text-red-600 dark:hover:text-red-400'
                          )}
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>

      {selectedWallet && (
        <button
          type="button"
          onClick={() => onRefreshBalance(selectedWallet.address)}
          className={clsx(
            'inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md',
            'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-offset-gray-900',
            'transition-colors'
          )}
        >
          {t('details.refreshBalance')}
        </button>
      )}

      {/* Remove Wallet Confirmation Dialog */}
      {showRemoveConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon
                      className="h-6 w-6 text-red-600 dark:text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {t('remove.title')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('remove.confirmText')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-red-700 dark:hover:bg-red-800"
                  onClick={handleConfirmRemove}
                >
                  {t('remove.confirm')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelRemove}
                >
                  {t('remove.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
