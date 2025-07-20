import {LitElement, html, css} from 'lit';
import './base-layout.js';

export class EmployeeListing extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      <base-layout>
        <h1>Employee Listing Page</h1>
        <p>This is the employee listing page</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-listing', EmployeeListing);
