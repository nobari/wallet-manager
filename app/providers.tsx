'use client';

import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from 'next-themes';
import {getMessages} from 'next-intl/server';
import {Locale} from '../i18n/routing';
import {ThemeInitializer, ThemeReset} from '@/features/theme';
import {useEffect, useState} from 'react';

export function Providers({
  children,
  messages,
  locale,
  fontClass
}: {
  children: React.ReactNode;
  messages: Awaited<ReturnType<typeof getMessages>>;
  locale: Locale;
  fontClass: string;
}) {
  // Only render ThemeProvider on the client to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after a small delay to ensure ThemeReset has run
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Apply font and other classes to body only on client side
  useEffect(() => {
    if (mounted) {
      // Apply the font class and other styling classes to the body
      document.body.classList.add(fontClass, 'antialiased', 'min-h-screen');
    }

    return () => {
      // Clean up when component unmounts
      document.body.classList.remove(fontClass, 'antialiased', 'min-h-screen');
    };
  }, [mounted, fontClass]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {/* ThemeReset runs immediately to remove any theme classes */}
      <ThemeReset />

      {mounted ? (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="bitcoin-wallet-theme"
        >
          <ThemeInitializer />
          {children}
        </ThemeProvider>
      ) : (
        // During SSR and before hydration, render without ThemeProvider
        children
      )}
    </NextIntlClientProvider>
  );
}
