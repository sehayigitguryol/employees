// Browser polyfills for testing
window.process = {
  env: {
    NODE_ENV: 'test',
  },
  version: 'test',
  versions: {
    node: 'test',
  },
  platform: 'browser',
  nextTick: (fn) => setTimeout(fn, 0),
};

// Polyfill for global Buffer if needed
if (typeof window.Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: () => false,
  };
}

// Polyfill for global process.nextTick if needed
if (typeof window.process.nextTick === 'undefined') {
  window.process.nextTick = (fn) => setTimeout(fn, 0);
}

// Mock router outlet for tests
if (!document.getElementById('outlet')) {
  const outlet = document.createElement('div');
  outlet.id = 'outlet';
  document.body.appendChild(outlet);
}

// Mock window.history for tests
if (!window.history.pushState) {
  window.history.pushState = () => {};
}

if (!window.history.back) {
  window.history.back = () => {};
}

// Mock window.dispatchEvent for tests
if (!window.dispatchEvent) {
  window.dispatchEvent = () => {};
}
