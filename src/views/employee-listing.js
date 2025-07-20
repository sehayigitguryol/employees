import {LitElement, html, css} from 'lit';
import '../components/base-layout.js';
import '../components/tabs.js';
import {store} from '../store/index.js';
import {setPage, setSize} from '../store/employeesSlice.js';

export class EmployeeListing extends LitElement {
  static get properties() {
    return {
      selectedTab: {type: Number},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .content {
        margin-top: 20px;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0; // 0 = list view, 1 = card view
  }

  _handleTabChanged(event) {
    this.selectedTab = event.detail.activeTab;
    console.log('Selected tab:', this.selectedTab);

    // Reset page to 1 when view changes
    store.dispatch(setSize(this.selectedTab === 0 ? 10 : 12));
    store.dispatch(setPage(1));

    this.requestUpdate(); // Force re-render
  }

  render() {
    return html`
      <base-layout title="Employee List">
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;"
        >
          <h1 style="margin: 0; color: #ff6101;">Employee List</h1>
          <tabs-component
            @tab-changed="${this._handleTabChanged}"
          ></tabs-component>
        </div>

        <div class="content">
          ${this.selectedTab === 0
            ? html`<p>List View Content</p>`
            : html`<p>Card View Content</p>`}
        </div>
      </base-layout>
    `;
  }
}

customElements.define('employee-listing', EmployeeListing);
