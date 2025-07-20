import {LitElement, html, css} from 'lit';
import 'iconify-icon';
import {i18nStore} from '../store/i18n-store.js';

export class Tabs extends LitElement {
  static get properties() {
    return {
      activeTab: {type: Number},
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        gap: 8px;
      }

      button {
        width: 48px;
        height: 48px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        position: relative;
      }

      button:hover {
        border-color: #ff6101;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(255, 97, 1, 0.2);
      }

      button.active {
        border-color: #ff6101;
        background: #fff5f0;
      }

      button.active iconify-icon {
        color: #ff6101;
      }
    `;
  }

  constructor() {
    super();
    this.activeTab = 0;
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

  _handleClick(index) {
    this.activeTab = index;
    this.dispatchEvent(
      new CustomEvent('tab-changed', {
        detail: {activeTab: index},
        bubbles: true,
      })
    );
  }

  render() {
    return html`
      <button
        class="${this.activeTab === 0 ? 'active' : ''}"
        @click="${() => this._handleClick(0)}"
        title="${i18nStore.translate('employee.list.view.list')}"
      >
        <iconify-icon
          icon="mdi:format-list-bulleted"
          width="20px"
          height="20px"
        ></iconify-icon>
      </button>
      <button
        class="${this.activeTab === 1 ? 'active' : ''}"
        @click="${() => this._handleClick(1)}"
        title="${i18nStore.translate('employee.list.view.cards')}"
      >
        <iconify-icon
          icon="mdi:view-grid"
          width="20px"
          height="20px"
        ></iconify-icon>
      </button>
    `;
  }
}

customElements.define('tabs-component', Tabs);
