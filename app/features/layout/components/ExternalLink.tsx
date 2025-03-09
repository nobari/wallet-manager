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
        'inline-block rounded-md border border-gray-700 p-8',
        'transition-colors hover:border-gray-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75',
        'hover:bg-gray-800/30 dark:hover:bg-gray-700/30',
        className
      )}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <p className="text-xl font-semibold text-white group">
        {title}{' '}
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
          →
        </span>
      </p>
      <p className="mt-2 max-w-[250px] text-gray-400">{description}</p>
    </a>
  );
}
