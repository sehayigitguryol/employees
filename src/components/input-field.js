import {LitElement, html, css} from 'lit';

export class InputField extends LitElement {
  static properties = {
    label: {type: String},
    field: {type: String},
    value: {type: String},
    placeholder: {type: String},
    required: {type: Boolean},
    type: {type: String},
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

    .field-input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    }

    .field-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .field-input.error {
      border-color: #d32f2f;
    }

    .field-input.error:focus {
      border-color: #d32f2f;
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.field = '';
    this.value = '';
    this.placeholder = '';
    this.required = false;
    this.error = false;
  }

  _handleInput(e) {
    const newValue = e.target.value;
    this.value = newValue;

    this.dispatchEvent(
      new CustomEvent('text-change', {
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
        <input
          type=${this.type || 'text'}
          class="field-input ${this.error ? 'error' : ''}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          @input="${this._handleInput}"
        />
      </div>
    `;
  }
}

customElements.define('input-field', InputField);
