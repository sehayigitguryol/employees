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
        <h1>404 ${this._t('not.found.title')}</h1>
        <p>${this._t('not.found.message')}</p>
        <a href="/">${this._t('not.found.back')}</a>
      </div>
    `;
  }
}

customElements.define('not-found', NotFound);
