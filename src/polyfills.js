if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: 'development',
    },
  };
}

// Initialize i18next
import './i18n.js';
