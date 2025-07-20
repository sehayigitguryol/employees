import {store} from './index.js';
import {setEmployees} from './employeesSlice.js';

// Sample employee data
const sampleEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-123-4567',
    position: 'Senior',
    department: 'Tech',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1985-03-22',
  },
  {
    id: '694718ed-ec5b-41e9-95a5-eb399a522801',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-234-5678',
    position: 'Medior',
    department: 'Analytics',
    dateOfEmployment: '2022-08-20',
    dateOfBirth: '1990-06-15',
  },
  {
    id: '694718ed-ec5b-41e9-95a5-eb399a512802',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1-555-345-6789',
    position: 'Junior',
    department: 'Tech',
    dateOfEmployment: '2023-03-10',
    dateOfBirth: '1995-11-30',
  },
  {
    id: '694718ed-ec5b-41e9-95a5-eb399a512803',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1-555-456-7890',
    position: 'Senior',
    department: 'Analytics',
    dateOfEmployment: '2022-11-05',
    dateOfBirth: '1988-09-12',
  },
  {
    id: '694718ed-ec5b-41e9-95a5-eb399a512804',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-567-8901',
    position: 'Medior',
    department: 'Analytics',
    dateOfEmployment: '2023-02-28',
    dateOfBirth: '1992-07-25',
  },
];

// Initialize the store with sample data
export function initializeStore() {
  // Set initial employees data
  store.dispatch(setEmployees(sampleEmployees));

  console.log('Redux store initialized with sample employee data');
  console.log('Store state:', store.getState());
}

// Auto-initialize when this module is imported
initializeStore();
