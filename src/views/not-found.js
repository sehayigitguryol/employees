import {LitElement, html, css} from 'lit';

export class NotFound extends LitElement {
  static get styles() {
    return css`
      .not-found {
        text-align: center;
        padding: 2rem;
      }
    `;
  }

  render() {
    return html`
      <div class="not-found">
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Go back to homepage</a>
      </div>
    `;
  }
}

customElements.define('not-found', NotFound);
