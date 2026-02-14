import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ className = '' }) {
  const { t, i18n } = useTranslation();

  return (
    <div className={`flex gap-2 ${className}`} role="group" aria-label={t('languageSwitcher.ariaLabel')}>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('he')}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          i18n.language === 'he'
            ? 'bg-primary-100 text-primary-700'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        aria-pressed={i18n.language === 'he'}
      >
        {t('languageSwitcher.he')}
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-primary-100 text-primary-700'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        aria-pressed={i18n.language === 'en'}
      >
        {t('languageSwitcher.en')}
      </button>
    </div>
  );
}
