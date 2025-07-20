import {LitElement, html, css} from 'lit';

export class EmployeeForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
      }
    `;
  }

  render() {
    return html`
      <h1>Employee Form Page</h1>
      <p>This is the employee form page</p>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
