import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';
import {store} from '../store/index.js';
import {setPage, setSize} from '../store/employeesSlice.js';
import './list/list-view.js';
import './list/card-view.js';
import {i18nStore} from '../store/i18n-store.js';

export class EmployeeListing extends LitElement {
  static get properties() {
    return {
      selectedTab: {type: Number},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
      }

      .page-title {
        color: #ff6101;
        margin: 0;
      }

      .content {
        margin-top: 20px;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0; // 0 = list view, 1 = card view
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

  _handleTabChanged(event) {
    this.selectedTab = event.detail.activeTab;

    // Reset page to 1 when view changes
    store.dispatch(setSize(this.selectedTab === 0 ? 10 : 6));
    store.dispatch(setPage(1));

    this.requestUpdate(); // Force re-render
  }

  render() {
    return html`
      <base-layout title="${i18nStore.translate('employee.list.title')}">
        <div class="header">
          <h1 class="page-title">
            ${i18nStore.translate('employee.list.title')}
          </h1>
          <tabs-component
            .activeTab=${this.selectedTab}
            @tab-changed="${this._handleTabChanged}"
          ></tabs-component>
        </div>

        <div class="content">
          ${this.selectedTab === 0
            ? html`<list-view></list-view>`
            : html`<card-view></card-view>`}
        </div>
      </base-layout>
    `;
  }
}

customElements.define('employee-listing', EmployeeListing);
