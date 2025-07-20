import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';

export class EmployeeCreate extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      <base-layout title="Employee Create Page">
        <p>This is the employee create page</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-create', EmployeeCreate);
