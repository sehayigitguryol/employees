import {Router} from '@vaadin/router';
import './views/employee-listing.js';
import './views/employee-create.js';
import './views/employee-edit.js';
import './views/not-found.js';
import './store/index.js';
import {initializeStore} from './store/init.js';

const routes = [
  {
    path: '/',
    component: 'employee-listing',
  },
  {
    path: '/create',
    component: 'employee-create',
  },
  {
    path: '/edit/:id',
    component: 'employee-edit',
  },
  {
    path: '/404',
    component: 'not-found',
  },
  {
    path: '(.*)',
    component: 'not-found',
  },
];

const router = new Router();
router.setRoutes(routes);

// Only initialize router and store if we're not in a test environment
if (typeof window !== 'undefined' && window.process?.env?.NODE_ENV !== 'test') {
  // Initialize the router
  router.setOutlet(document.getElementById('outlet'));

  // Initialize store only once when app starts
  initializeStore();
}

export default router;
