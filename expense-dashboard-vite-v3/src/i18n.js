import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import he from './locales/he/translation.json';
import en from './locales/en/translation.json';

function setDocumentDirAndLang(lng) {
  const dir = lng === 'he' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: { translation: he },
      en: { translation: en },
    },
    lng: 'he',
    fallbackLng: 'he',
    supportedLngs: ['he', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

i18n.on('languageChanged', setDocumentDirAndLang);
setDocumentDirAndLang(i18n.language || 'he');

export default i18n;
