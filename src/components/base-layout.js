import {LitElement, html, css} from 'lit';
import './language-switcher.js';
import {i18nStore} from '../store/i18n-store.js';

export class BaseLayout extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 100vh;
      }

      .header {
        background: #ff6101;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .nav a {
        color: white;
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .nav a:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .main {
        padding: 2rem;
        background-color: #f0f0f0;
        min-height: calc(100vh - 80px);
        box-sizing: border-box;
      }

      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          text-align: center;
        }

        .nav {
          justify-content: center;
          width: 100%;
        }

        .nav a {
          font-size: 0.9rem;
          padding: 0.4rem;
        }

        .main {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        .nav {
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav a {
          text-align: center;
          width: 100%;
        }

        .language {
          justify-content: center;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to language changes
    this.unsubscribe = i18nStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return html`
      <header class="header">
        <div>${i18nStore.translate('employee.list.title')}</div>
        <nav class="nav">
          <a href="/">${i18nStore.translate('employee.list.title')}</a>
          <a href="/create">${i18nStore.translate('employee.create.title')}</a>
          <language-switcher></language-switcher>
        </nav>
      </header>
      <main class="main">
        <slot></slot>
      </main>
    `;
  }
}

customElements.define('base-layout', BaseLayout);
