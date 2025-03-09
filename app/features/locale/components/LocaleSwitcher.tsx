import {useLocale, useTranslations} from 'next-intl';
import {routing} from '@/i18n/routing';
import {LocaleSwitcherProps} from '../types';
import {LocaleSwitcherSelect} from './LocaleSwitcherSelect';

export function LocaleSwitcher({className}: LocaleSwitcherProps) {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  const options = routing.locales.map((cur) => ({
    value: cur,
    label: t('locale', {locale: cur})
  }));

  return (
    <LocaleSwitcherSelect
      options={options}
      defaultValue={locale}
      label={t('label')}
      className={className}
    />
  );
}
