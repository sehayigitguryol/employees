/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {fromRollup} from '@web/dev-server-rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  nodeResolve: true,
  preserveSymlinks: true,
  plugins: [fromRollup(nodeResolve), fromRollup(replace)],
  // Add this configuration for SPA routing
  appIndex: 'index.html',
  // This tells the server to serve index.html for all routes
  historyApiFallback: true,
};
