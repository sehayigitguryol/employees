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
      <base-layout title="Employee Listing Page">
        <p>This is the employee listing page</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-listing', EmployeeListing);
