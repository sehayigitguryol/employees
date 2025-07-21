import {LitElement, html, css} from 'lit';
import './icon-button.js';
import './button.js';
import './dialog.js';
import {i18nStore} from '../store/i18n-store.js';
import {store as importedStore} from '../store/index.js';
import {removeEmployee} from '../store/employeesSlice.js';

function getStore() {
  return window.store || importedStore;
}

export class EmployeeTable extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
      showConfirmDialog: {type: Boolean},
      employeeToDelete: {type: Object},
    };
  }

  static get styles() {
    return css`
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
      @media (max-width: 600px) {
        th,
        td {
          padding: 0.4rem 0.2rem;
          font-size: 0.78rem;
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
    `;
  }

  constructor() {
    super();
    this.employees = [];
    this.showConfirmDialog = false;
    this.employeeToDelete = null;
    this.languageUnsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.languageUnsubscribe = i18nStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
  }

  _handleEdit(employee) {
    window.history.pushState(null, '', `/edit/${employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleDelete(employee) {
    this.employeeToDelete = employee;
    this.showConfirmDialog = true;
    this.requestUpdate();
  }

  _handleCancelDelete() {
    this.showConfirmDialog = false;
    this.employeeToDelete = null;
    this.requestUpdate();
  }

  _handleConfirmDelete() {
    if (this.employeeToDelete) {
      getStore().dispatch(removeEmployee(this.employeeToDelete.id));
    }
    this.showConfirmDialog = false;
    this.employeeToDelete = null;
    this.requestUpdate();
  }

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`<div class="empty">
        ${i18nStore.translate('message.no.employees')}
      </div>`;
    }
    return html`
      <div class="table-responsive">
        <table id="employee-table">
          <thead>
            <tr>
              <th>${i18nStore.translate('employee.details.firstName')}</th>
              <th>${i18nStore.translate('employee.details.lastName')}</th>
              <th>
                ${i18nStore.translate('employee.details.dateOfEmployment')}
              </th>
              <th>${i18nStore.translate('employee.details.dateOfBirth')}</th>
              <th>${i18nStore.translate('employee.details.phone')}</th>
              <th>${i18nStore.translate('employee.details.email')}</th>
              <th>${i18nStore.translate('employee.details.department')}</th>
              <th>${i18nStore.translate('employee.details.position')}</th>
              <th>${i18nStore.translate('employee.details.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(
              (emp) => html`
                <tr id="employee-row-${emp.id}">
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.dateOfEmployment}</td>
                  <td>${emp.dateOfBirth}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td class="actions">
                    <icon-button
                      id="edit-btn-${emp.id}"
                      icon="mdi:pencil"
                      title="${i18nStore.translate('actions.edit')}"
                      @click=${() => this._handleEdit(emp)}
                    ></icon-button>
                    <icon-button
                      id="delete-btn-${emp.id}"
                      icon="mdi:delete"
                      title="${i18nStore.translate('actions.delete')}"
                      @click=${() => this._handleDelete(emp)}
                    ></icon-button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
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

customElements.define('employee-table', EmployeeTable);
