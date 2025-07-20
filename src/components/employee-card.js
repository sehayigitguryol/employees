import {LitElement, html, css} from 'lit';
import {i18nStore} from '../store/i18n-store.js';
import {store} from '../store/index.js';
import {removeEmployee} from '../store/employeesSlice.js';
import 'iconify-icon';

export class EmployeeCard extends LitElement {
  static get properties() {
    return {
      employee: {type: Object},
    };
  }

  static get styles() {
    return css`
      .card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
      }

      .btn.edit {
        background: #6366f1;
        color: white;
      }

      .btn.edit:hover {
        background: #5855eb;
        transform: translateY(-1px);
      }

      .btn.delete {
        background: #ff6101;
        color: white;
      }

      .btn.delete:hover {
        background: #e55a00;
        transform: translateY(-1px);
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
          padding: 0.45rem 0.875rem;
          font-size: 0.8rem;
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
          padding: 0.4rem 0.75rem;
          font-size: 0.75rem;
          gap: 0.375rem;
        }
      }

      /* Small mobile styles */
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
          padding: 0.35rem 0.625rem;
          font-size: 0.7rem;
          gap: 0.25rem;
        }
      }

      /* Large desktop styles */
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
          padding: 0.6rem 1.25rem;
          font-size: 0.9rem;
          gap: 0.625rem;
        }
      }
    `;
  }

  constructor() {
    super();
    this.employee = null;
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
    window.location.href = `/edit/${this.employee.id}`;
  }

  _handleDelete() {
    if (confirm(i18nStore.translate('message.confirm.delete'))) {
      // Dispatch delete action to store
      store.dispatch(removeEmployee(this.employee.id));
    }
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
          <button class="btn delete" @click="${this._handleDelete}">
            <iconify-icon icon="mdi:delete" width="16"></iconify-icon>
            ${i18nStore.translate('actions.delete')}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-card', EmployeeCard);
