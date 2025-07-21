import {LitElement, html, css} from 'lit';

export class Dialog extends LitElement {
  static properties = {
    open: {type: Boolean, reflect: true},
    title: {type: String},
    description: {type: String},
    confirmText: {type: String},
    cancelText: {type: String},
    loading: {type: Boolean},
  };

  static styles = css`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
    }

    .dialog-overlay[open] {
      opacity: 1;
      visibility: visible;
    }

    .dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      width: 90%;
      padding: 24px;
    }

    .dialog-title {
      margin: 0 0 12px 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .dialog-description {
      margin: 0 0 24px 0;
      color: #666;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    @media (max-width: 480px) {
      .dialog-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.description = '';
    this.confirmText = 'Confirm';
    this.cancelText = 'Cancel';
    this.loading = false;
  }

  render() {
    return html`
      <div
        class="dialog-overlay"
        ?open=${this.open}
        @click=${this._handleOverlayClick}
      >
        <div class="dialog" @click=${this._handleDialogClick}>
          ${this.title ? html`<h2 class="dialog-title">${this.title}</h2>` : ''}
          ${this.description
            ? html`<p class="dialog-description">${this.description}</p>`
            : ''}

          <div class="dialog-actions">
            <app-button
              variant="secondary"
              @click=${this._handleCancel}
              ?disabled=${this.loading}
              id="cancel-button"
            >
              ${this.cancelText}
            </app-button>
            <app-button
              variant="primary"
              @click=${this._handleConfirm}
              ?disabled=${this.loading}
              id="confirm-button"
            >
              ${this.loading ? 'Loading...' : this.confirmText}
            </app-button>
          </div>
        </div>
      </div>
    `;
  }

  _handleOverlayClick(e) {
    if (e.target.classList.contains('dialog-overlay')) {
      this._handleCancel();
    }
  }

  _handleDialogClick(e) {
    e.stopPropagation();
  }

  _handleCancel() {
    if (this.loading) return;

    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleConfirm() {
    if (this.loading) return;

    this.dispatchEvent(
      new CustomEvent('confirm', {
        bubbles: true,
        composed: true,
      })
    );
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  setLoading(loading) {
    this.loading = loading;
  }
}

customElements.define('app-dialog', Dialog);
