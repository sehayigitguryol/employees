import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json' with {type: 'json'};
import trTranslations from './locales/tr.json' with {type: 'json'};

const resources = {
  en: {
    translation: enTranslations,
  },
  tr: {
    translation: trTranslations,
  },
};

i18next.use(LanguageDetector).init({
  resources,
  fallbackLng: 'tr',
  debug: false,
  detection: {
    lookupHtmlLang: true,
    lookupQuerystring: false,
    lookupCookie: false,
    lookupLocalStorage: false,
    lookupSessionStorage: false,
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    order: ['htmlTag', 'navigator', 'path', 'subdomain'],
    caches: ['localStorage'],
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;

export function getCurrentLanguage() {
  return i18next.language;
}

export function changeLanguage(lng) {
  return i18next.changeLanguage(lng);
}

export function t(key, options = {}) {
  return i18next.t(key, options);
}
