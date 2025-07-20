import {LitElement, html, css} from 'lit';

export class EmployeeListing extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
      }
      a {
        color: #007bff;
        text-decoration: none;
        margin-right: 15px;
      }
      a:hover {
        text-decoration: underline;
      }
    `;
  }

  render() {
    return html`
      <h1>Employee Listing Page</h1>
      <p>This is the employee listing page</p>
      <nav>
        <a href="/">Home</a>
        <a href="/create">Create Employee</a>
        <a href="/edit/123">Edit Employee</a>
      </nav>
    `;
  }
}

customElements.define('employee-listing', EmployeeListing);
