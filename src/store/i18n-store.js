import {t, changeLanguage, getCurrentLanguage} from '../i18n.js';

class I18nStore {
  constructor() {
    this.subscribers = [];
    this.currentLanguage = getCurrentLanguage();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback());
  }

  async changeLanguage(lang) {
    await changeLanguage(lang);
    this.currentLanguage = getCurrentLanguage();
    document.documentElement.lang = lang;
    this.notify();
  }

  translate(key, options = {}) {
    return t(key, options);
  }

  getLanguage() {
    return this.currentLanguage;
  }
}

export const i18nStore = new I18nStore();

// Export convenience function
export const translate = (key, options = {}) =>
  i18nStore.translate(key, options);
