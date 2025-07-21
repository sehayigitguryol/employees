import {LitElement, html, css} from 'lit';
import 'iconify-icon';

export class IconButton extends LitElement {
  static get properties() {
    return {
      icon: {type: String},
      size: {type: String},
      color: {type: String},
      id: {type: String},
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
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 8px;
        background: none;
        cursor: pointer;
        transition: color 0.2s ease;
        color: #666;
      }

      .icon-button:hover {
        color: #007bff;
        /* No border or background on hover */
      }

      iconify-icon {
        width: 18px;
        height: 18px;
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
    this.dispatchEvent(new Event('click', {bubbles: true, composed: true}));
  }

  render() {
    return html`
      <button
        class="icon-button"
        @click="${this._handleClick}"
        title="${this.icon}"
        id="${this.id}"
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
