import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';

export class EmployeeForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html` <div>Employee Form</div> `;
  }
}

customElements.define('employee-form', EmployeeForm);
