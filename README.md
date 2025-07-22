# Employee Management App

A modern web application for managing employees, built with Lit, Redux Toolkit, and Web Components. Features include employee CRUD operations, search, filtering, pagination, and internationalization (English/Turkish).

---

## Features

- **Employee Listing**: View employees in table or card view
- **Search & Filter**: Search employees by name, department, etc.
- **Pagination**: Navigate through large employee lists
- **Employee CRUD**: Create, edit, and delete employees
- **Form Validation**: Robust validation for employee data
- **Internationalization**: English and Turkish support with language switcher
- **Responsive UI**: Works on desktop and mobile

## Tech Stack

- [Lit](https://lit.dev/) (Web Components)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vaadin Router](https://vaadin.com/router)
- [i18next](https://www.i18next.com/) (i18n)
- [date-fns](https://date-fns.org/) (date utilities)
- [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) (testing)
- [@open-wc/testing](https://open-wc.org/docs/testing/)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run serve
```

- Open [http://localhost:8000/dev/index.html](http://localhost:8000/dev/index.html) in your browser.

### 3. Build (if needed)

No build step is required for the app itself. (Rollup is only used for docs bundling, which is not relevant to this app.)

## Project Structure

```
/ (root)
├── src/
│   ├── components/         # UI components (table, card, dialog, etc.)
│   ├── store/              # Redux slices and store setup
│   ├── views/              # Page views (listing, create, edit, etc.)
│   ├── i18n.js             # i18next setup
│   ├── locales/            # en.json, tr.json translations
│   ├── router.js           # App routing
│   └── utils/              # Utility functions (validation, etc.)
├── test/                   # Unit, integration, e2e tests
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/           # Sample test data
├── dev/index.html          # Main HTML entry for development
├── package.json
└── README.md
```

## Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- **Unit tests:**
  ```bash
  npm run test:unit
  ```
- **Integration tests:**
  ```bash
  npm run test:integration
  ```
- **E2E tests:**
  ```bash
  npm run test:e2e
  ```
- **Test coverage:**
  ```bash
  npm run test:coverage
  ```
- **Watch mode:**
  ```bash
  npm run test:watch
  ```

See `test/README.md` for detailed testing strategy and examples.

## Linting & Formatting

- **Lint:**
  ```bash
  npm run lint
  ```
- **Format:**
  ```bash
  npm run format
  ```

## Internationalization (i18n)

- English and Turkish translations in `src/locales/en.json` and `src/locales/tr.json`
- Language switcher in the app header
- Uses [i18next](https://www.i18next.com/) for translation

## Contributing

1. Fork the repo and create your branch
2. Make your changes and add tests
3. Run lint and tests before submitting a PR

## License

BSD-3-Clause

---

**Note:** The static site in `docs/` and `docs-src/` is a leftover from the LitElement starter and is not relevant to this app. Focus development and documentation on the Employee Management features above.
