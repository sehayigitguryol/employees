import {LitElement, html, css} from 'lit';
import 'iconify-icon';

export class IconButton extends LitElement {
  static get properties() {
    return {
      icon: {type: String},
      size: {type: String},
      color: {type: String},
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .icon-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #666;
      }

      .icon-button:hover {
        border-color: #007bff;
        color: #007bff;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
      }

      iconify-icon {
        width: 20px;
        height: 20px;
      }
    `;
  }

  constructor() {
    super();
    this.icon = 'mdi:pencil';
    this.size = '20px';
    this.color = 'currentColor';
  }

  _handleClick() {
    this.dispatchEvent(
      new CustomEvent('icon-click', {
        detail: {
          icon: this.icon,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <button
        class="icon-button"
        @click="${this._handleClick}"
        title="${this.icon}"
      >
        <iconify-icon
          icon="${this.icon}"
          width="${this.size}"
          height="${this.size}"
          style="color: ${this.color};"
        ></iconify-icon>
      </button>
    `;
  }
}

customElements.define('icon-button', IconButton);
