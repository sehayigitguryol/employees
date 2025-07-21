import {LitElement, html, css} from 'lit';

export class SelectField extends LitElement {
  static properties = {
    id: {type: String},
    label: {type: String},
    field: {type: String},
    value: {type: String},
    placeholder: {type: String},
    required: {type: Boolean},
    options: {type: Array},
    error: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
    }

    .field-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    .field-label.required::after {
      content: ' *';
      color: #d32f2f;
    }

    .field-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      width: 100%;
      box-sizing: border-box;
      background-color: white;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .field-select:focus {
      outline: none;
      border-color: #007bff;
    }

    .field-select.error {
      border-color: #d32f2f;
    }

    .field-select.error:focus {
      border-color: #d32f2f;
    }

    .field-select option {
      padding: 0.5rem;
    }
  `;

  constructor() {
    super();
    this.id = '';
    this.label = '';
    this.field = '';
    this.value = '';
    this.placeholder = '';
    this.required = false;
    this.options = [];
    this.error = false;
  }

  _handleChange(e) {
    const newValue = e.target.value;
    this.value = newValue;

    this.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {
          value: newValue,
          field: this.field,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="field-container">
        ${this.label
          ? html`
              <label class="field-label ${this.required ? 'required' : ''}">
                ${this.label}
              </label>
            `
          : ''}
        <select
          id=${this.id}
          class="field-select ${this.error ? 'error' : ''}"
          .value="${this.value}"
          ?required="${this.required}"
          @change="${this._handleChange}"
        >
          ${this.placeholder
            ? html`<option value="" disabled selected>
                ${this.placeholder}
              </option>`
            : ''}
          ${this.options.map(
            (option) => html` <option
              value="${option}"
              ?selected="${option === this.value}"
            >
              ${option}
            </option>`
          )}
        </select>
      </div>
    `;
  }
}

customElements.define('select-field', SelectField);
