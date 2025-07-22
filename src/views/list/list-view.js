import {LitElement, html, css} from 'lit';
import {store as importedStore} from '../../store/index.js';
import {
  selectPaginatedEmployees,
  selectLoading,
  selectError,
} from '../../store/employeesSlice.js';
import {i18nStore} from '../../store/i18n-store.js';
import '../../components/button.js';
import '../../components/icon-button.js';
import '../../components/employee-table.js';
import '../../components/pagination.js';

// Get store dynamically to use window.store for testing, fall back to imported store
function getStore() {
  return window.store || importedStore;
}

export class ListView extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
      loading: {type: Boolean},
      error: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }
      .table-responsive {
        width: 100%;
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        background: white;
        border-radius: 8px;
        overflow: hidden;
      }
      th,
      td {
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid #eee;
        text-align: left;
        font-size: 0.95rem;
        min-height: 44px;
        height: 44px;
        vertical-align: middle;
      }
      td {
        white-space: nowrap;
      }
      /* Responsive table, no truncation */
      @media (max-width: 600px) {
        th,
        td {
          padding: 0.4rem 0.2rem;
          font-size: 0.78rem;
          /* Let text wrap or overflow naturally */
        }
      }
      @media (max-width: 400px) {
        th,
        td {
          padding: 0.25rem 0.1rem;
          font-size: 0.68rem;
        }
      }
      th {
        background: #f8f8f8;
        font-weight: 600;
      }
      tr:last-child td {
        border-bottom: none;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      .loading,
      .error,
      .empty {
        text-align: center;
        padding: 2rem;
        color: #666;
      }
      .error {
        color: #d32f2f;
        background: #ffebee;
        border-radius: 8px;
        margin: 1rem 0;
      }
    `;
  }

  constructor() {
    super();
    this.employees = [];
    this.loading = false;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const initialState = getStore().getState();
    this.employees = selectPaginatedEmployees(initialState);
    this.loading = selectLoading(initialState);
    this.error = selectError(initialState);
    this.requestUpdate();
    this.unsubscribe = getStore().subscribe(() => {
      const state = getStore().getState();
      this.employees = selectPaginatedEmployees(state);
      this.loading = selectLoading(state);
      this.error = selectError(state);
      this.requestUpdate();
    });

    this.languageUnsubscribe = i18nStore.subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) this.unsubscribe();
    if (this.languageUnsubscribe) this.languageUnsubscribe();
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">
        ${i18nStore.translate('message.loading')}
      </div>`;
    }
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }
    if (!this.employees || this.employees.length === 0) {
      return html`<div class="empty">
        ${i18nStore.translate('message.no.employees')}
      </div>`;
    }
    return html`
      <employee-table .employees=${this.employees} />
      <app-pagination />
    `;
  }
}

customElements.define('list-view', ListView);
