'use client';

import {PencilIcon, CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {WalletHeaderProps} from '../types';

export function WalletHeader({
  wallet,
  balance,
  isRenaming,
  newName,
  onRename,
  onCancelRename,
  onStartRenaming,
  onNameChange
}: WalletHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {isRenaming ? (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              id="wallet-name"
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              className={clsx(
                'w-full text-2xl font-bold bg-transparent border-b-2 border-blue-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-sm px-1',
                'text-gray-900 dark:text-white transition-all'
              )}
              autoFocus
              aria-label="Rename wallet"
            />
          </div>
          <div className="flex space-x-1">
            <button
              onClick={onRename}
              disabled={!newName.trim()}
              className={clsx(
                'p-1.5 rounded-full',
                'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30',
                'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50',
                'transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent'
              )}
              aria-label="Confirm rename"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onCancelRename}
              className={clsx(
                'p-1.5 rounded-full',
                'text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30',
                'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
                'transition-colors'
              )}
              aria-label="Cancel rename"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {wallet.name}
          </h2>
          <button
            onClick={onStartRenaming}
            className={clsx(
              'p-1.5 rounded-full',
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
              'transition-colors'
            )}
            aria-label="Rename wallet"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="text-xl font-semibold text-gray-900 dark:text-white">
        {balance !== undefined ? (
          <span>{balance} BTC</span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            Loading balance...
          </span>
        )}
      </div>
    </div>
  );
}
