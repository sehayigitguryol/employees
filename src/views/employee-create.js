import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import {t} from '../i18n.js';

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
      <base-layout title="${t('employee.create.title')}">
        <p>${t('employee.create.description')}</p>
      </base-layout>
    `;
  }
}

customElements.define('employee-create', EmployeeCreate);
