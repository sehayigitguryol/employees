import {store} from './index.js';
import {setEmployees, selectEmployees} from './employeesSlice.js';

// Generate sample employee data
function generateSampleEmployees(count = 30) {
  const firstNames = [
    'John',
    'Jane',
    'Mike',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Lisa',
    'James',
    'Maria',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Wilson',
    'Anderson',
  ];
  const positions = ['Junior', 'Medior', 'Senior'];
  const departments = ['Tech', 'Analytics', 'Marketing', 'Sales'];

  const phone = '0532 123 45 67';
  const dateOfEmployment = '2023-01-15';

  const employees = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];

    // Generate birth date
    const birthYear = 1985 + Math.floor(Math.random() * 20); // 1985-2004
    const birthMonth = String(1 + Math.floor(Math.random() * 12)).padStart(
      2,
      '0'
    );
    const birthDay = String(1 + Math.floor(Math.random() * 28)).padStart(
      2,
      '0'
    );

    employees.push({
      id: `emp-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone,
      position,
      department,
      dateOfEmployment,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
    });
  }

  return employees;
}

export function initializeStore() {
  console.log('Initializing store');
  // Only initialize with sample data if employees array is empty
  const currentState = store.getState();
  const currentEmployees = selectEmployees(currentState);

  if (currentEmployees.length === 0) {
    const sampleEmployees = generateSampleEmployees(30);
    store.dispatch(setEmployees(sampleEmployees));
  }
}
