import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import {i18nStore} from '../store/i18n-store.js';

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
      <base-layout title="${i18nStore.translate('employee.create.title')}">
        <p>${i18nStore.translate('employee.create.description')}</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-create', EmployeeCreate);
