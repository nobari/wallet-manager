'use client';

import React, {Fragment, useTransition} from 'react';
import clsx from 'clsx';
import {useParams} from 'next/navigation';
import {Locale} from '@/i18n/routing';
import {usePathname, useRouter} from '@/i18n/navigation';
import {Listbox, Transition} from '@headlessui/react';
import {ChevronDownIcon, CheckIcon} from '@heroicons/react/24/outline';
import {LocaleSwitcherSelectProps} from '../types';

export function LocaleSwitcherSelect({
  options,
  defaultValue,
  label,
  className
}: LocaleSwitcherSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const selectedOption =
    options.find((option) => option.value === defaultValue) || options[0];

  function onSelectChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <div className={clsx('absolute top-2 left-2 w-32 z-10', className)}>
      <Listbox
        value={defaultValue}
        onChange={onSelectChange}
        disabled={isPending}
      >
        <div className="relative">
          <Listbox.Label className="sr-only">{label}</Listbox.Label>
          <Listbox.Button
            className={clsx(
              'relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left',
              'bg-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75',
              isPending && 'opacity-50'
            )}
          >
            <span className="block truncate">{selectedOption?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={clsx(
                'absolute mt-1 max-h-60 w-full overflow-auto rounded-md',
                'bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5',
                'focus:outline-none text-sm'
              )}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({active}) =>
                    clsx(
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                      active
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                    )
                  }
                >
                  {({selected}) => (
                    <>
                      <span
                        className={clsx(
                          'block truncate',
                          selected ? 'font-medium' : 'font-normal'
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
