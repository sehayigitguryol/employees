import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';
import '../components/input-field.js';
import '../components/select-field.js';
import '../components/dialog.js';
import '../components/button.js';
import {i18nStore} from '../store/i18n-store.js';
import {store as importedStore} from '../store/ReduxProvider.js';
import {
  setForm,
  resetForm,
  selectForm,
  addEmployee,
  updateEmployee,
} from '../store/employeesSlice.js';
import {validateEmployeeForm} from '../utils/validation.js';

// Get store dynamically to use window.store for testing, fall back to imported store
function getStore() {
  return window.store || importedStore;
}

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
    console.log('🔧 Initializing form with employee:', this.employee);
    // Dispatch the appropriate action based on whether we're editing or creating
    if (this.employee) {
      getStore().dispatch(setForm(this.employee));
      this.isCreate = false;
      console.log('🔧 Form set to edit mode');
    } else {
      getStore().dispatch(resetForm());
      this.isCreate = true;
      console.log('🔧 Form set to create mode');
    }

    // Get state after dispatching
    const newState = getStore().getState();

    // Subscribe to form changes
    this._unsubscribe = getStore().subscribe(() => {
      const state = getStore().getState();
      this.formData = selectForm(state);
      this.requestUpdate();
    });

    // Set initial form data immediately
    this.formData = selectForm(newState);
    console.log('🔧 Initial form data:', this.formData);
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

      console.log('🔧 Updating form field:', field, 'to:', value);
      console.log('🔧 Updated form data:', updatedForm);
      getStore().dispatch(setForm(updatedForm));
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
    console.log('🔧 Submitting form');
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

      // Simulate API call - remove the timeout for testing
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('🔧 Dispatching addEmployee with formData:', this.formData);
      console.log(
        '🔧 Using store:',
        getStore() === window.store ? 'window.store' : 'importedStore'
      );
      console.log('🔧 Form isCreate:', this.isCreate);
      console.log('🔧 Form employee:', this.employee);
      if (this.isCreate) {
        console.log('🔧 Creating new employee');
        getStore().dispatch(addEmployee(this.formData));
      } else {
        console.log('🔧 Updating existing employee');
        getStore().dispatch(updateEmployee(this.formData));
      }

      // Show success message or redirect

      // Reset form and navigate to employee list
      getStore().dispatch(resetForm());
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      alert(i18nStore.translate('error.saving'));
    } finally {
      this.shadowRoot.getElementById('confirmDialog').setLoading(false);
    }
  }

  _handleCancel() {
    getStore().dispatch(resetForm());
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
              id="firstName"
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
              id="lastName"
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
              id="dateOfBirth"
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
              id="email"
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
              id="phone"
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
              id="dateOfEmployment"
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
              id="department"
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
              id="position"
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
            <app-button
              type="button"
              variant="secondary"
              id="cancel-button"
              @click="${this._handleCancel}"
            >
              <span slot="icon">
                <iconify-icon icon="mdi:cancel" width="16"></iconify-icon>
              </span>
              ${i18nStore.translate('actions.cancel')}
            </app-button>
            <app-button type="submit" variant="primary" id="save-button">
              <span slot="icon">
                <iconify-icon
                  icon="${this.employee ? 'mdi:content-save' : 'mdi:plus'}"
                  width="16"
                ></iconify-icon>
              </span>
              ${this.employee
                ? i18nStore.translate('actions.save')
                : i18nStore.translate('employee.list.create')}
            </app-button>
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
