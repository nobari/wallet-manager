import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import {clsx} from 'clsx';
import {Inter} from 'next/font/google';
import {routing, Locale} from '../../i18n/routing';
import {Providers} from '@/providers';
import './styles.css';
import {Header} from '@/features/layout';

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

const inter = Inter({subsets: ['latin']});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
  const {locale} = await props.params;

  const t = await getTranslations({locale, namespace: 'IndexPage'});

  return {
    title: t('title'),
    description: t('description')
  } as Metadata;
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html className="h-full" lang={locale} suppressHydrationWarning>
      {/* flex h-full flex-col  */}
      <body
        className={clsx(
          inter.className,
          'antialiased min-h-screen transition-colors'
        )}
      >
        <Providers messages={messages} locale={locale as Locale}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
