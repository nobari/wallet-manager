'use client';

import {useState} from 'react';
import {ClipboardDocumentIcon, CheckIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface CopyToClipboardProps {
  text: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export function CopyToClipboard({
  text,
  className = '',
  iconSize = 'md',
  tooltipPosition = 'top'
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      // Hide tooltip after 2.5 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const iconClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const tooltipClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className={clsx('relative inline-flex items-center', className)}>
      <button
        onClick={handleCopy}
        className={clsx(
          'inline-flex items-center gap-1.5 p-1.5 rounded-full',
          'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          'transition-colors'
        )}
        aria-label="Copy to clipboard"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => !copied && setShowTooltip(false)}
      >
        {copied ? (
          <CheckIcon className={iconClasses[iconSize]} />
        ) : (
          <ClipboardDocumentIcon className={iconClasses[iconSize]} />
        )}
      </button>

      {showTooltip && (
        <div
          className={clsx(
            'absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm',
            'dark:bg-gray-700',
            'whitespace-nowrap',
            tooltipClasses[tooltipPosition]
          )}
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </div>
      )}
    </div>
  );
}
