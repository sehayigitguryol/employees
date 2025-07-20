import {LitElement, html, css} from 'lit';

export class BaseLayout extends LitElement {
  static get properties() {
    return {
      title: {type: String},
      actions: {type: Array},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 100vh;
      }

      .header {
        background: #ff6101;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .nav a {
        color: white;
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .nav a:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .main {
        padding: 2rem;
        background-color: #f0f0f0;
        min-height: calc(100vh - 80px);
        box-sizing: border-box;
      }

      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          text-align: center;
        }

        .nav {
          justify-content: center;
          width: 100%;
        }

        .nav a {
          font-size: 0.9rem;
          padding: 0.4rem;
        }

        .main {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        .nav {
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav a {
          text-align: center;
          width: 100%;
        }

        .language {
          justify-content: center;
        }
      }
    `;
  }

  render() {
    return html`
      <header class="header">
        <div>Employee Management</div>
        <nav class="nav">
          <a href="/">Employees</a>
          <a href="/create">Add New</a>
          <div>Language</div>
        </nav>
      </header>
      <main class="main">
        <div>
          <h2>${this.title}</h2>
        </div>
        <slot></slot>
      </main>
    `;
  }
}

customElements.define('base-layout', BaseLayout);
