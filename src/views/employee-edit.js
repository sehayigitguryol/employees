import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import {store as importedStore} from '../store/index.js';
import {selectEmployeeById} from '../store/employeesSlice.js';
import './employee-form.js';
import {Router} from '@vaadin/router';

// Get store dynamically to use window.store for testing, fall back to imported store
function getStore() {
  return window.store || importedStore;
}

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
      this._checkEmployeeExists();
    } else {
      this._redirectTo404();
    }
  }

  _checkEmployeeExists() {
    const storeInstance = getStore();
    console.log(
      '[employee-edit] getStore() === window.store:',
      storeInstance === window.store
    );
    console.log(
      '[employee-edit] getStore().getState():',
      storeInstance.getState()
    );
    const employee = selectEmployeeById(
      storeInstance.getState(),
      this.employeeId
    );
    console.log('[employee-edit] selectEmployeeById result:', employee);

    this.employee = employee;

    if (this.employee) {
      this.loading = false;
    } else {
      console.log('Employee not found, redirecting to 404');
      this._redirectTo404();
    }
  }

  _redirectTo404() {
    // SPA navigation to 404 page using Vaadin Router
    Router.go('/404');
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
        <employee-form .employee=${this.employee}></employee-form>
      </base-layout>
    `;
  }
}

customElements.define('employee-edit', EmployeeEdit);
