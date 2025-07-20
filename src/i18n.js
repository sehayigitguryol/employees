import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json' with {type: 'json'};
import trTranslations from './locales/tr.json' with {type: 'json'};

// Translation resources
const resources = {
  en: {
    translation: enTranslations,
  },
  tr: {
    translation: trTranslations,
  },
};

// Initialize i18next
i18next.use(LanguageDetector).init({
  resources,
  fallbackLng: 'tr',
  debug: false,

  // Custom language detection
  detection: {
    // Use the HTML lang attribute
    lookupHtmlLang: true,
    // Fallback to browser language
    lookupQuerystring: false,
    lookupCookie: false,
    lookupLocalStorage: false,
    lookupSessionStorage: false,
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // Order of detection
    order: ['htmlTag', 'navigator', 'path', 'subdomain'],

    // Cache user language
    caches: ['localStorage'],
  },

  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18next;

// Helper function to get current language
export function getCurrentLanguage() {
  return i18next.language;
}

// Helper function to change language
export function changeLanguage(lng) {
  return i18next.changeLanguage(lng);
}

// Helper function to translate
export function t(key, options = {}) {
  return i18next.t(key, options);
}
