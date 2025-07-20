import {Router} from '@vaadin/router';
import './components/employee-listing.js';
import './components/employee-form.js';

const routes = [
  {
    path: '/',
    component: 'employee-listing',
  },
  {
    path: '/create',
    component: 'employee-form',
  },
  {
    path: '/edit/:id',
    component: 'employee-form',
  },
];

const router = new Router();
router.setRoutes(routes);

// Initialize the router
router.setOutlet(document.getElementById('outlet'));

export default router;
