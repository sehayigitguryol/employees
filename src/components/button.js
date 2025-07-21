import {LitElement, html, css} from 'lit';

export class AppButton extends LitElement {
  static get properties() {
    return {
      id: {type: String},
      variant: {type: String},
      disabled: {type: Boolean, reflect: true},
      type: {type: String},
    };
  }

  static get styles() {
    return css`
      button {
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
        justify-content: center;
        gap: 0.375rem;
        white-space: nowrap;
      }
      button:hover:not(:disabled) {
        border-color: #999;
        color: #333;
        background: #f8f8f8;
      }
      button.primary {
        background: white;
        border-color: #1976d2;
        color: #1976d2;
      }
      button.primary:hover:not(:disabled) {
        background: #e3f2fd;
        border-color: #1565c0;
        color: #1565c0;
      }
      button.secondary {
        color: #d32f2f;
        border-color: #d32f2f;
        background: white;
      }
      button.secondary:hover:not(:disabled) {
        background: #ffebee;
        border-color: #c62828;
        color: #c62828;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      @media (max-width: 1024px) {
        button {
          padding: 0.35rem 0.625rem;
          font-size: 0.7rem;
        }
      }
      @media (max-width: 768px) {
        button {
          padding: 0.3rem 0.5rem;
          font-size: 0.65rem;
          gap: 0.25rem;
        }
      }
      @media (max-width: 480px) {
        button {
          padding: 0.25rem 0.375rem;
          font-size: 0.6rem;
          gap: 0.2rem;
        }
      }
      @media (min-width: 1200px) {
        button {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          gap: 0.5rem;
        }
      }
      .icon-container {
        display: grid;
        place-items: center;
      }
    `;
  }

  render() {
    return html`
      <button
        id="${this.id}"
        class="${this.variant || ''}"
        ?disabled="${this.disabled}"
        type="${this.type || 'button'}"
        @click="${this._handleClick}"
      >
        <div class="icon-container">
          <slot name="icon"></slot>
        </div>
        <slot></slot>
      </button>
    `;
  }

  _handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    if (this.type === 'submit') {
      // Find the closest form and submit it
      const form =
        this.closest('form') || this.getRootNode().host?.closest?.('form');
      if (form) {
        e.preventDefault();
        form.requestSubmit ? form.requestSubmit() : form.submit();
      }
    }
  }
}

customElements.define('app-button', AppButton);
