import {LitElement, html, css} from 'lit';
import {store} from '../../store/index.js';
import {
  selectPaginatedEmployees,
  selectLoading,
  selectError,
} from '../../store/employeesSlice.js';
import {i18nStore} from '../../store/i18n-store.js';
import '../../components/employee-card.js';
import '../../components/pagination.js';

export class CardView extends LitElement {
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
      }

      .card-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
      }

      @media (min-width: 768px) {
        .card-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .card-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .error {
        text-align: center;
        padding: 2rem;
        color: #d32f2f;
        background: #ffebee;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .empty {
        text-align: center;
        padding: 2rem;
        color: #666;
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

    // Get initial state immediately
    const initialState = store.getState();
    this.employees = selectPaginatedEmployees(initialState);
    this.loading = selectLoading(initialState);
    this.error = selectError(initialState);

    // Force initial render
    this.requestUpdate();

    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.employees = selectPaginatedEmployees(state);
      this.loading = selectLoading(state);
      this.error = selectError(state);
    });

    // Subscribe to language changes
    this.languageUnsubscribe = i18nStore.subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
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
      <div class="card-grid">
        ${this.employees.map(
          (employee) => html`
            <employee-card .employee=${employee}></employee-card>
          `
        )}
      </div>
      <app-pagination></app-pagination>
    `;
  }
}

customElements.define('card-view', CardView);
