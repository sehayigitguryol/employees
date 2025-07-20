import {LitElement, html, css} from 'lit';
import './base-layout.js';
import {store} from '../store/ReduxProvider.js';
import {selectEmployeeById} from '../store/employeesSlice.js';

export class EmployeeEdit extends LitElement {
  static get properties() {
    return {
      employeeId: {type: String},
      employee: {type: Object},
      loading: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.employeeId = '';
    this.employee = null;
    this.loading = true;
    this._getEmployeeId();
  }

  _getEmployeeId() {
    // Get the current path from the URL
    const path = window.location.pathname;
    // Extract the ID from the path /edit/:id
    const match = path.match(/^\/edit\/(.+)$/);
    if (match) {
      this.employeeId = match[1];
      console.log('Employee ID:', this.employeeId);
      this._checkEmployeeExists();
    } else {
      this._redirectTo404();
    }
  }

  _checkEmployeeExists() {
    // Get current state from store
    const state = store.getState();
    const employee = selectEmployeeById(state, this.employeeId);

    // Find employee by ID
    this.employee = employee;

    if (this.employee) {
      console.log('Employee found:', this.employee);
      this.loading = false;
    } else {
      console.log('Employee not found, redirecting to 404');
      this._redirectTo404();
    }
  }

  _redirectTo404() {
    // Navigate to 404 page
    window.location.href = '/404';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <base-layout title="Loading...">
          <p>Loading employee...</p>
        </base-layout>
      `;
    }

    if (!this.employee) {
      return html`
        <base-layout title="Employee Not Found">
          <p>Employee not found. Redirecting...</p>
        </base-layout>
      `;
    }

    return html`
      <base-layout title="Edit Employee">
        <p>
          Editing employee: ${this.employee.firstName} ${this.employee.lastName}
        </p>
        <p>Employee ID: ${this.employeeId}</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-edit', EmployeeEdit);
