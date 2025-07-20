/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {esbuildPlugin} from '@web/dev-server-esbuild';
import {playwrightLauncher} from '@web/test-runner-playwright';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  testFramework: {
    config: {
      timeout: 3000,
      ui: 'bdd',
    },
  },
  plugins: [
    esbuildPlugin({
      jsx: true,
      jsxImportSource: 'lit',
    }),
  ],
  browsers: [playwrightLauncher({product: 'chromium'})],
  coverage: true,
  setupFiles: ['test/setup/browser-polyfills.js'],
  testRunnerHtml: (testFramework) => `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Employee Management Tests</title>
        <script>
          // Define process before any modules load
          window.process = {
            env: {
              NODE_ENV: 'test'
            },
            version: 'test',
            versions: {
              node: 'test'
            },
            platform: 'browser',
            nextTick: (fn) => setTimeout(fn, 0)
          };
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
};
