import clsx from 'clsx';
import {ExternalLinkProps} from '../types';

export function ExternalLink({
  description,
  href,
  title,
  className
}: ExternalLinkProps) {
  return (
    <a
      className={clsx(
        'block rounded-lg border p-6',
        'bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700',
        'transition-colors',
        'hover:border-blue-500 dark:hover:border-blue-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75',
        'hover:bg-blue-50 dark:hover:bg-gray-700',
        className
      )}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <p className="text-xl font-semibold text-gray-900 dark:text-white group">
        {title}{' '}
        <span className="ml-2 inline-block text-blue-600 dark:text-blue-400 transition-transform group-hover:translate-x-1">
          →
        </span>
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  );
}
