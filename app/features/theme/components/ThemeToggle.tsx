'use client';

import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';
import {SunIcon, MoonIcon} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';
import {Switch} from '@headlessui/react';
import clsx from 'clsx';
import {ThemeToggleProps} from '../types';

export function ThemeToggle({className}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();
  const t = useTranslations('theme');
  const isDark = theme === 'dark';

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={clsx('fixed top-4 right-4', className)}>
      <Switch
        checked={isDark}
        onChange={() => setTheme(isDark ? 'light' : 'dark')}
        className={clsx(
          'relative inline-flex h-10 w-16 items-center rounded-full p-1',
          'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
          'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2',
          'focus-visible:ring-blue-500 focus-visible:ring-opacity-75'
        )}
      >
        <span className="sr-only">{isDark ? t('light') : t('dark')}</span>
        <span
          className={clsx(
            'pointer-events-none inline-block h-7 w-7 transform rounded-full',
            'bg-white dark:bg-gray-800 shadow-sm',
            'flex items-center justify-center',
            'transition-transform duration-200 ease-in-out',
            isDark ? 'translate-x-7' : 'translate-x-0'
          )}
        >
          {isDark ? (
            <MoonIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <SunIcon className="h-4 w-4 text-amber-500" />
          )}
        </span>
      </Switch>
    </div>
  );
}
