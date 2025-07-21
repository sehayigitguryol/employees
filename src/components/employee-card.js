import {LitElement, html, css} from 'lit';
import {i18nStore} from '../store/i18n-store.js';
import {store as importedStore} from '../store/index.js';
import {removeEmployee} from '../store/employeesSlice.js';
import 'iconify-icon';

// Get store dynamically to use window.store for testing, fall back to imported store
function getStore() {
  return window.store || importedStore;
}

export class EmployeeCard extends LitElement {
  static properties = {
    employee: {type: Object},
    showConfirmDialog: {type: Boolean},
  };

  static styles = css`
    .card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .employee-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-size: 0.75rem;
      color: #666;
      font-weight: 400;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 0.9rem;
      color: #333;
      font-weight: 500;
      line-height: 1.3;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-start;
    }

    .btn {
      padding: 0.375rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      color: #666;
      font-size: 0.75rem;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      white-space: nowrap;
    }

    .btn:hover {
      border-color: #999;
      color: #333;
      background: #f8f8f8;
    }

    .btn.edit {
      color: #1976d2;
      border-color: #1976d2;
    }

    .btn.edit:hover {
      background: #e3f2fd;
      border-color: #1565c0;
      color: #1565c0;
    }

    .btn.delete {
      color: #d32f2f;
      border-color: #d32f2f;
    }

    .btn.delete:hover {
      background: #ffebee;
      border-color: #c62828;
      color: #c62828;
    }

    /* Tablet styles */
    @media (max-width: 1024px) {
      .card {
        padding: 1.25rem;
      }

      .employee-details {
        gap: 0.875rem;
      }

      .detail-label {
        font-size: 0.7rem;
      }

      .detail-value {
        font-size: 0.85rem;
      }

      .btn {
        padding: 0.35rem 0.625rem;
        font-size: 0.7rem;
      }
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .card {
        padding: 1rem;
      }

      .employee-details {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .detail-label {
        font-size: 0.65rem;
        letter-spacing: 0.3px;
      }

      .detail-value {
        font-size: 0.8rem;
      }

      .card-actions {
        gap: 0.5rem;
      }

      .btn {
        padding: 0.3rem 0.5rem;
        font-size: 0.65rem;
        gap: 0.25rem;
      }
    }

    @media (max-width: 480px) {
      .card {
        padding: 0.875rem;
      }

      .employee-details {
        gap: 0.625rem;
        margin-bottom: 1.25rem;
      }

      .detail-label {
        font-size: 0.6rem;
        letter-spacing: 0.25px;
      }

      .detail-value {
        font-size: 0.75rem;
      }

      .card-actions {
        gap: 0.375rem;
      }

      .btn {
        padding: 0.25rem 0.375rem;
        font-size: 0.6rem;
        gap: 0.2rem;
      }
    }

    @media (min-width: 1200px) {
      .card {
        padding: 1.75rem;
      }

      .employee-details {
        gap: 1.25rem;
        margin-bottom: 1.75rem;
      }

      .detail-label {
        font-size: 0.8rem;
        letter-spacing: 0.6px;
      }

      .detail-value {
        font-size: 1rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        gap: 0.5rem;
      }
    }
  `;

  constructor() {
    super();
    this.employee = null;
    this.showConfirmDialog = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to language changes
    this.languageUnsubscribe = i18nStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
  }

  _handleEdit() {
    // Navigate to edit page
    window.history.pushState(null, '', `/edit/${this.employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleDelete() {
    this.showConfirmDialog = true;
    this.requestUpdate();
  }

  _handleCancelDelete() {
    this.showConfirmDialog = false;
  }

  _handleConfirmDelete() {
    this.showConfirmDialog = false;
    console.log('🔧 Deleting employee with ID:', this.employee.id);
    getStore().dispatch(removeEmployee(this.employee.id));
  }

  render() {
    if (!this.employee) {
      return html`<div class="card">No employee data</div>`;
    }

    return html`
      <div class="card">
        <div class="employee-details">
          <div class="detail-item">
            <span class="detail-label">
              ${i18nStore.translate('employee.details.firstName')}
            </span>
            <span class="detail-value"> ${this.employee.firstName} </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              ${i18nStore.translate('employee.details.lastName')}
            </span>
            <span class="detail-value"> ${this.employee.lastName} </span>
          </div>
          <div class="detail-item">
            <span class="detail-label"
              >${i18nStore.translate('employee.details.email')}</span
            >
            <span class="detail-value">${this.employee.email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"
              >${i18nStore.translate('employee.details.phone')}</span
            >
            <span class="detail-value">${this.employee.phone}</span>
          </div>
          ${this.employee.department
            ? html`<div class="detail-item">
                <span class="detail-label"
                  >${i18nStore.translate('employee.details.department')}</span
                >
                <span class="detail-value">${this.employee.department}</span>
              </div>`
            : ''}
          ${this.employee.position
            ? html`<div class="detail-item">
                <span class="detail-label"
                  >${i18nStore.translate('employee.details.position')}</span
                >
                <span class="detail-value">${this.employee.position}</span>
              </div>`
            : ''}
          ${this.employee.dateOfEmployment
            ? html`<div class="detail-item">
                <span class="detail-label"
                  >${i18nStore.translate(
                    'employee.details.dateOfEmployment'
                  )}</span
                >
                <span class="detail-value"
                  >${this.employee.dateOfEmployment}</span
                >
              </div>`
            : ''}
          ${this.employee.dateOfBirth
            ? html`<div class="detail-item">
                <span class="detail-label"
                  >${i18nStore.translate('employee.details.dateOfBirth')}</span
                >
                <span class="detail-value">${this.employee.dateOfBirth}</span>
              </div>`
            : ''}
        </div>

        <div class="card-actions">
          <button class="btn edit" @click="${this._handleEdit}">
            <iconify-icon icon="mdi:pencil" width="16"></iconify-icon>
            ${i18nStore.translate('actions.edit')}
          </button>
          <button
            class="btn delete"
            id="delete-button"
            @click="${this._handleDelete}"
          >
            <iconify-icon icon="mdi:delete" width="16"></iconify-icon>
            ${i18nStore.translate('actions.delete')}
          </button>
        </div>
      </div>

      <app-dialog
        id="confirmDialog"
        title="${i18nStore.translate('dialog.deleteEmployee.title')}"
        description="${i18nStore.translate(
          'dialog.deleteEmployee.description'
        )}"
        confirm-text="${i18nStore.translate('actions.delete')}"
        cancel-text="${i18nStore.translate('actions.cancel')}"
        ?open=${this.showConfirmDialog}
        @cancel=${this._handleCancelDelete}
        @confirm=${this._handleConfirmDelete}
      ></app-dialog>
    `;
  }
}

customElements.define('employee-card', EmployeeCard);
