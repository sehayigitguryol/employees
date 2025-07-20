import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';

export class EmployeeForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 20px;
      }

      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #ff6101;
        margin: 0;
      }

      .view-tabs {
        display: flex;
        align-items: center;
      }
    `;
  }

  render() {
    return html`
      <base-layout title="">
        <div class="header">
          <h1 class="page-title">Employee List</h1>
          <div class="view-tabs">
            <tabs-component></tabs-component>
          </div>
        </div>
      </base-layout>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
