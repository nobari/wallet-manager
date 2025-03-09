'use client';

import {useState} from 'react';
import {ClipboardDocumentIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface PasteFromClipboardProps {
  onPaste: (text: string) => void;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export function PasteFromClipboard({
  onPaste,
  className = '',
  iconSize = 'md',
  tooltipPosition = 'top'
}: PasteFromClipboardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pasteStatus, setPasteStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onPaste(text);
        setPasteStatus('success');
        setTimeout(() => {
          setPasteStatus('idle');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to paste text: ', error);
      setPasteStatus('error');
      setTimeout(() => {
        setPasteStatus('idle');
      }, 2000);
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

  const getTooltipText = () => {
    switch (pasteStatus) {
      case 'success':
        return 'Pasted!';
      case 'error':
        return 'Failed to paste';
      default:
        return 'Paste from clipboard';
    }
  };

  return (
    <div className={clsx('relative inline-flex items-center', className)}>
      <button
        onClick={handlePaste}
        className={clsx(
          'inline-flex items-center gap-1.5 p-1.5 rounded-full',
          'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          'transition-colors'
        )}
        aria-label="Paste from clipboard"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <ClipboardDocumentIcon className={iconClasses[iconSize]} />
      </button>

      {showTooltip && (
        <div
          className={clsx(
            'absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm',
            'dark:bg-gray-700',
            'whitespace-nowrap',
            tooltipClasses[tooltipPosition],
            pasteStatus === 'error' ? 'bg-red-600 dark:bg-red-700' : '',
            pasteStatus === 'success' ? 'bg-green-600 dark:bg-green-700' : ''
          )}
        >
          {getTooltipText()}
        </div>
      )}
    </div>
  );
}
