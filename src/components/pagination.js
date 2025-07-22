import {LitElement, html, css} from 'lit';
import {store} from '../store/index.js';
import {setPage, selectFilteredEmployees} from '../store/employeesSlice.js';

export class Pagination extends LitElement {
  static properties = {
    total: {type: Number},
    page: {type: Number},
    size: {type: Number},
  };

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      gap: 12px;
    }

    .pagination button {
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination .ellipsis {
      color: #999;
      font-weight: bold;
      padding: 0 8px;
    }

    @media (max-width: 768px) {
      .pagination {
        gap: 8px;
      }

      .pagination button {
        padding: 6px 10px;
        font-size: 12px;
      }
    }
  `;

  constructor() {
    super();
    this.total = 0;
    this.page = 1;
    this.size = 3;
  }

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.page = state.employees.filters.page;
      this.size = state.employees.filters.size;
      this.total = selectFilteredEmployees(state).length;
      this.requestUpdate();
    });

    const initialState = store.getState();
    this.page = initialState.employees.filters.page;
    this.size = initialState.employees.filters.size;
    this.total = selectFilteredEmployees(initialState).length;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  _handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      store.dispatch(setPage(newPage));
    }
  }

  _generatePageNumbers() {
    const totalPages = this.totalPages;
    const currentPage = this.page;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }

  get totalPages() {
    return Math.ceil(this.total / this.size);
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    const pages = this._generatePageNumbers();

    return html`
      <div class="pagination">
        <button
          @click=${() => this._handlePageChange(this.page - 1)}
          ?disabled=${this.page <= 1}
        >
          <iconify-icon icon="mdi:chevron-left" width="16" />
        </button>

        ${pages.map((pageNum) => {
          const isSelected = Number(pageNum) === this.page;

          return pageNum === '...'
            ? html`<span class="ellipsis">...</span>`
            : html`
                <button
                  @click=${() => this._handlePageChange(Number(pageNum))}
                  style=${isSelected
                    ? 'background: #ff6101; color: white; border-radius: 50%; width: 32px; height: 32px; padding: 0;'
                    : ''}
                >
                  ${pageNum}
                </button>
              `;
        })}

        <button
          @click=${() => this._handlePageChange(this.page + 1)}
          ?disabled=${this.page >= this.totalPages}
        >
          <iconify-icon icon="mdi:chevron-right" width="16" />
        </button>
      </div>
    `;
  }
}

customElements.define('app-pagination', Pagination);
