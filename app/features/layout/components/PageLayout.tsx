import {useTranslations} from 'next-intl';
import {PageLayoutProps} from '../types';
import {ExternalLink} from './ExternalLink';

export function PageLayout({children, title}: PageLayoutProps) {
  const t = useTranslations('PageLayout');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {title}
          </h1>
          <div className="text-gray-600 dark:text-gray-400 md:text-lg">
            {children}
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700 md:grid-cols-2 lg:gap-8">
            <ExternalLink
              description={t('links.author.description')}
              href={t('links.author.href')}
              title={t('links.author.title')}
            />
            <ExternalLink
              description={t('links.source.description')}
              href={t('links.source.href')}
              title={t('links.source.title')}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
