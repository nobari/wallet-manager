'use client';

import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from 'next-themes';
import {getMessages} from 'next-intl/server';
import {Locale} from '../i18n/routing';

export function Providers({
  children,
  messages,
  locale
}: {
  children: React.ReactNode;
  messages: Awaited<ReturnType<typeof getMessages>>;
  locale: Locale;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
