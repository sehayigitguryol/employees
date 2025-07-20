import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import './employee-form.js';

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
      <base-layout>
        <employee-form></employee-form>
      </base-layout>
    `;
  }
}

customElements.define('employee-create', EmployeeCreate);
