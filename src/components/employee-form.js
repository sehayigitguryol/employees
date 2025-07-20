import {LitElement, html, css} from 'lit';
import './base-layout.js';

export class EmployeeForm extends LitElement {
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
        <h1>Employee Form Page</h1>
        <p>This is the employee form page</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
