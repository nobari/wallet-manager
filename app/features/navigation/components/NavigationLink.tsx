'use client';

import clsx from 'clsx';
import {useSelectedLayoutSegment} from 'next/navigation';
import {Link} from '../../../i18n/navigation';
import {NavigationLinkProps} from '../types';

export function NavigationLink({href, ...rest}: NavigationLinkProps) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'inline-block px-2 py-3 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75',
        'rounded-md',
        isActive
          ? 'text-white bg-gray-800 dark:bg-gray-700'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/30 dark:hover:bg-gray-800/30'
      )}
      href={href}
      {...rest}
    />
  );
}
