import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';
import '../components/input-field.js';
import '../components/select-field.js';
import '../components/dialog.js';
import {i18nStore} from '../store/i18n-store.js';
import {store} from '../store/ReduxProvider.js';
import {
  setForm,
  resetForm,
  selectForm,
  addEmployee,
  updateEmployee,
} from '../store/employeesSlice.js';
import {validateEmployeeForm} from '../utils/validation.js';
import router from '../router.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employee: {type: Object, required: false},
    formData: {type: Object},
    validationErrors: {type: Object},
    showPrompt: {type: Boolean},
    showConfirmDialog: {type: Boolean},
    isCreate: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
    }

    .form-container {
      margin: 0 auto;
      padding: 2rem;
    }

    .form-fields {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .btn-primary:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    .btn-secondary {
      background: white;
      color: #666;
      border-color: #ddd;
    }

    .btn-secondary:hover {
      background: #f8f8f8;
      border-color: #999;
    }

    .validation-error {
      color: #d32f2f;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }

    .field-error {
      border-color: #d32f2f !important;
    }

    .validation-summary {
      background: #ffebee;
      border: 1px solid #ffcdd2;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #c62828;
    }

    .validation-summary h3 {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .validation-summary ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .validation-summary li {
      margin-bottom: 0.25rem;
    }

    @media (min-width: 768px) {
      .form-fields {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
    }
  `;

  constructor() {
    super();
    this.employee = null;
    this.formData = null;
    this.validationErrors = {};
    this.showPrompt = false;
    this.showConfirmDialog = false;
    this._debounceTimeout = null;
    this.isCreate = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initializeForm();
    this.languageUnsubscribe = i18nStore.subscribe(() => {
      this.requestUpdate();
    });
  }

  _initializeForm() {
    // Dispatch the appropriate action based on whether we're editing or creating
    if (this.employee) {
      store.dispatch(setForm(this.employee));
      this.isCreate = false;
    } else {
      store.dispatch(resetForm());
      this.isCreate = true;
    }

    // Get state after dispatching
    const newState = store.getState();

    // Subscribe to form changes
    this._unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.formData = selectForm(state);
      this.requestUpdate();
    });

    // Set initial form data immediately
    this.formData = selectForm(newState);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }
  }

  _updateFormField(field, value) {
    // Clear validation error for this field when user starts typing
    if (this.validationErrors && this.validationErrors[field]) {
      const newErrors = {...this.validationErrors};
      delete newErrors[field];
      this.validationErrors = newErrors;
    }

    // Only update if the value has actually changed
    if (this.formData && this.formData[field] !== value) {
      const updatedForm = {
        ...this.formData,
        [field]: value,
      };

      store.dispatch(setForm(updatedForm));
    }
  }

  _handleFieldChange(e) {
    const {value, field} = e.detail;

    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }

    this._debounceTimeout = setTimeout(() => {
      this._updateFormField(field, value);
    }, 300);
  }

  _validateForm() {
    return validateEmployeeForm(this.formData);
  }

  async _handleSubmit(e) {
    e.preventDefault();

    // Validate the form
    const errors = this._validateForm();
    this.validationErrors = errors;

    if (Object.keys(errors).length > 0) {
      this.requestUpdate();
      return;
    }

    // Show confirmation dialog instead of saving immediately
    this.showConfirmDialog = true;
    this.requestUpdate();
  }

  _handleConfirmSave() {
    this.showConfirmDialog = false;
    this._saveEmployee();
  }

  _handleCancelSave() {
    this.showConfirmDialog = false;
  }

  async _saveEmployee() {
    try {
      // Set loading state
      this.shadowRoot.getElementById('confirmDialog').setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (this.isCreate) {
        store.dispatch(addEmployee(this.formData));
      } else {
        store.dispatch(updateEmployee(this.formData));
      }

      // Show success message or redirect

      // Reset form and navigate to employee list
      store.dispatch(resetForm());
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      alert(i18nStore.translate('error.saving'));
    } finally {
      this.shadowRoot.getElementById('confirmDialog').setLoading(false);
    }
  }

  _handleCancel() {
    // Reset form and navigate back
    store.dispatch(resetForm());
    window.history.back();
  }

  render() {
    // Handle case where formData is not yet available
    if (!this.formData) {
      return html`<div>${i18nStore.translate('message.loading')}</div>`;
    }

    const hasValidationErrors = Object.keys(this.validationErrors).length > 0;

    return html`
      <div class="form-container">
        <form @submit="${this._handleSubmit}">
          <div class="form-fields">
            <input-field
              label="${i18nStore.translate('employee.details.firstName')}"
              field="firstName"
              .value="${this.formData.firstName || ''}"
              placeholder="${i18nStore.translate('employee.details.firstName')}"
              required
              ?error="${!!this.validationErrors.firstName}"
              @text-change="${this._handleFieldChange}"
            >
            </input-field>
            <input-field
              label="${i18nStore.translate('employee.details.lastName')}"
              field="lastName"
              .value="${this.formData.lastName || ''}"
              placeholder="${i18nStore.translate('employee.details.lastName')}"
              required
              ?error="${!!this.validationErrors.lastName}"
              @text-change="${this._handleFieldChange}"
            >
            </input-field>

            <input-field
              label="${i18nStore.translate('employee.details.dateOfBirth')}"
              field="dateOfBirth"
              .value="${this.formData.dateOfBirth || ''}"
              placeholder="${i18nStore.translate(
                'employee.details.dateOfBirth'
              )}"
              required
              type="date"
              ?error="${!!this.validationErrors.dateOfBirth}"
              @text-change="${this._handleFieldChange}"
            >
            </input-field>

            <input-field
              label="${i18nStore.translate('employee.details.email')}"
              field="email"
              .value="${this.formData.email || ''}"
              placeholder="${i18nStore.translate('employee.details.email')}"
              required
              type="email"
              ?error="${!!this.validationErrors.email}"
              @text-change="${this._handleFieldChange}"
            >
            </input-field>

            <input-field
              label="${i18nStore.translate('employee.details.phone')}"
              field="phone"
              .value="${this.formData.phone || ''}"
              placeholder="${i18nStore.translate('employee.details.phone')}"
              required
              type="tel"
              ?error="${!!this.validationErrors.phone}"
              @text-change="${this._handleFieldChange}"
            >
            </input-field>
            <input-field
              label="${i18nStore.translate(
                'employee.details.dateOfEmployment'
              )}"
              field="dateOfEmployment"
              .value="${this.formData.dateOfEmployment || ''}"
              placeholder="${i18nStore.translate(
                'employee.details.dateOfEmployment'
              )}"
              required
              type="date"
              ?error="${!!this.validationErrors.dateOfEmployment}"
              @text-change="${this._handleFieldChange}"
            >
            </input-field>
            <select-field
              label="${i18nStore.translate('employee.details.department')}"
              field="department"
              .value="${this.formData.department || ''}"
              placeholder="${i18nStore.translate(
                'employee.details.department'
              )}"
              required
              .options="${['Tech', 'Analytics', 'HR', 'Marketing', 'Sales']}"
              ?error="${!!this.validationErrors.department}"
              @select-change="${this._handleFieldChange}"
            >
            </select-field>

            <select-field
              label="${i18nStore.translate('employee.details.position')}"
              field="position"
              .value="${this.formData.position || ''}"
              placeholder="${i18nStore.translate('employee.details.position')}"
              required
              .options="${['Junior', 'Medior', 'Senior']}"
              ?error="${!!this.validationErrors.position}"
              @select-change="${this._handleFieldChange}"
            >
            </select-field>
          </div>

          ${hasValidationErrors
            ? html`
                <div class="validation-summary">
                  <h3>${i18nStore.translate('validation.title')}</h3>
                  <ul>
                    ${Object.values(this.validationErrors).map(
                      (error) => html`
                        <li>
                          ${i18nStore.translate(error.key, {
                            ...error.params,
                            field: error.params?.field
                              ? i18nStore.translate(error.params.field)
                              : error.params?.field,
                          })}
                        </li>
                      `
                    )}
                  </ul>
                </div>
              `
            : ''}

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="${this._handleCancel}"
            >
              ${i18nStore.translate('actions.cancel')}
            </button>
            <button type="submit" class="btn btn-primary">
              ${this.employee
                ? i18nStore.translate('actions.save')
                : i18nStore.translate('employee.list.create')}
            </button>
          </div>
        </form>
      </div>

      <app-dialog
        id="confirmDialog"
        title="${this.employee
          ? i18nStore.translate('dialog.saveEmployee.title')
          : i18nStore.translate('dialog.createEmployee.title')}"
        description="${this.employee
          ? i18nStore.translate('dialog.saveEmployee.description')
          : i18nStore.translate('dialog.createEmployee.description')}"
        confirm-text="${i18nStore.translate('actions.save')}"
        cancel-text="${i18nStore.translate('actions.cancel')}"
        ?open=${this.showConfirmDialog}
        @cancel=${this._handleCancelSave}
        @confirm=${this._handleConfirmSave}
      ></app-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
