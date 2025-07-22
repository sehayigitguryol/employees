import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';
import '../components/input-field.js';
import {store as importedStore} from '../store/index.js';
import {setPage, setSize, setSearchText} from '../store/employeesSlice.js';
import './list/list-view.js';
import './list/card-view.js';
import {i18nStore} from '../store/i18n-store.js';

// Get store dynamically to use window.store for testing, fall back to imported store
function getStore() {
  return window.store || importedStore;
}

export class EmployeeListing extends LitElement {
  static get properties() {
    return {
      selectedTab: {type: Number},
      searchValue: {type: String},
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

      .side-section {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .search-container {
        min-width: 250px;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0; // 0 = list view, 1 = card view
    this.searchValue = '';
  }

  connectedCallback() {
    super.connectedCallback();

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

    getStore().dispatch(setSize(this.selectedTab === 0 ? 10 : 6));
    getStore().dispatch(setPage(1));

    this.requestUpdate();
  }

  _handleSearchChange(event) {
    this.searchValue = event.detail.value;
    getStore().dispatch(setSearchText(this.searchValue));
    getStore().dispatch(setPage(1));
  }

  render() {
    return html`
      <base-layout title="${i18nStore.translate('employee.list.title')}">
        <div class="header">
          <h1 class="page-title">
            ${i18nStore.translate('employee.list.title')}
          </h1>
          <div class="side-section">
            <div class="search-container">
              <input-field
                id="search"
                field="search"
                .value="${this.searchValue}"
                placeholder="${i18nStore.translate('employee.list.search')}"
                @text-change="${this._handleSearchChange}"
              ></input-field>
            </div>
            <tabs-component
              .activeTab=${this.selectedTab}
              @tab-changed="${this._handleTabChanged}"
            ></tabs-component>
          </div>
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
