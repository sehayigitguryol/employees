import {LitElement, html, css} from 'lit';
import store from './index.js';

export class ReduxProvider extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    return html`
      <div id="redux-provider">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('redux-provider', ReduxProvider);

// Export the store for direct usage in components
export {store};
