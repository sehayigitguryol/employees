import {LitElement, html, css} from 'lit';

export class ListView extends LitElement {
  render() {
    return html`<div>List View</div>`;
  }
}

customElements.define('list-view', ListView);
