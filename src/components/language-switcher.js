import {LitElement, html, css} from 'lit';
import {i18nStore} from '../store/i18n-store.js';

export class LanguageSwitcher extends LitElement {
  static get properties() {
    return {
      currentLanguage: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .language-switcher {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .language-switcher:hover {
        border-color: #ff6101;
      }

      .flag {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .language-text {
        font-size: 14px;
        color: #333;
      }
    `;
  }

  constructor() {
    super();
    this.currentLanguage = i18nStore.getLanguage();
  }

  async _toggleLanguage() {
    const newLang = this.currentLanguage === 'en' ? 'tr' : 'en';
    await i18nStore.changeLanguage(newLang);
    this.currentLanguage = i18nStore.getLanguage();
  }

  render() {
    return html`
      <div class="language-switcher" @click="${this._toggleLanguage}">
        <div class="flag">${this.currentLanguage === 'en' ? '🇺🇸' : '🇹🇷'}</div>
        <span class="language-text"
          >${i18nStore.translate(`language.${this.currentLanguage}`)}</span
        >
      </div>
    `;
  }
}

customElements.define('language-switcher', LanguageSwitcher);
