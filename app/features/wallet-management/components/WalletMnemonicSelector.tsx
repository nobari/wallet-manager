'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {WalletDetails} from '@/lib/bitcoin';
import {CheckIcon} from '@heroicons/react/24/outline';
import {Dialog, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import clsx from 'clsx';
import {useInView} from 'react-intersection-observer';

interface WalletMnemonicSelectorProps {
  wallets: WalletDetails[];
  onSelect: (selectedWallets: WalletDetails[]) => void;
  onCancel: () => void;
  onGenerateMore: () => void;
  isGeneratingMore: boolean;
  isOpen: boolean;
}

export function WalletMnemonicSelector({
  wallets,
  onSelect,
  onCancel,
  onGenerateMore,
  isGeneratingMore,
  isOpen
}: WalletMnemonicSelectorProps) {
  const t = useTranslations('wallet');
  const [selectedWallets, setSelectedWallets] = useState<WalletDetails[]>([]);
  const [mounted, setMounted] = useState(false);

  // Setup intersection observer for infinite scroll
  const {ref: loadMoreRef, inView} = useInView({
    threshold: 0.5,
    rootMargin: '100px'
  });

  // Trigger load more when scrolled to bottom
  useEffect(() => {
    if (inView && !isGeneratingMore) {
      onGenerateMore();
    }
  }, [inView, isGeneratingMore, onGenerateMore]);

  // Prevent hydration mismatch by only rendering on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleWalletSelection = (wallet: WalletDetails) => {
    if (selectedWallets.some((w) => w.address === wallet.address)) {
      setSelectedWallets(
        selectedWallets.filter((w) => w.address !== wallet.address)
      );
    } else {
      setSelectedWallets([...selectedWallets, wallet]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedWallets);
  };

  // Don't render anything until client-side
  if (!mounted) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white p-6 pb-0"
                >
                  {t('create.selectWallets')}
                </Dialog.Title>
                <div className="p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t('create.selectWalletsDesc')}
                  </p>

                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                      {wallets.map((wallet) => (
                        <div
                          key={wallet.address}
                          className={clsx(
                            'border rounded-lg p-4 cursor-pointer transition-colors',
                            selectedWallets.some(
                              (w) => w.address === wallet.address
                            )
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                          )}
                          onClick={() => toggleWalletSelection(wallet)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {wallet.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono break-all">
                                {wallet.address}
                              </p>
                              <div className="mt-2">
                                <h5 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                                  {t('create.mnemonic')}
                                </h5>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-mono break-all">
                                  {wallet.mnemonic}
                                </p>
                              </div>
                            </div>
                            {selectedWallets.some(
                              (w) => w.address === wallet.address
                            ) && (
                              <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                        </div>
                      ))}
                      {/* Infinite scroll trigger element */}
                      <div
                        ref={loadMoreRef}
                        className="flex justify-center py-4"
                      >
                        {isGeneratingMore && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('create.generating')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-row-reverse gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleConfirm}
                    disabled={selectedWallets.length === 0}
                  >
                    {t('create.confirmSelection')}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onCancel}
                  >
                    {t('create.cancel')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
