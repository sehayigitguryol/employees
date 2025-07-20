export const sampleEmployees = [
  {
    id: 'emp-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '0532 123 45 67',
    department: 'Tech',
    position: 'Senior Developer',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
  },
  {
    id: 'emp-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '0532 987 65 43',
    department: 'HR',
    position: 'HR Manager',
    dateOfEmployment: '2022-08-10',
    dateOfBirth: '1985-12-03',
  },
  {
    id: 'emp-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@company.com',
    phone: '0532 555 12 34',
    department: 'Marketing',
    position: 'Marketing Specialist',
    dateOfEmployment: '2023-03-22',
    dateOfBirth: '1992-07-15',
  },
  {
    id: 'emp-4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@company.com',
    phone: '0532 444 56 78',
    department: 'Tech',
    position: 'Frontend Developer',
    dateOfEmployment: '2023-06-05',
    dateOfBirth: '1995-03-10',
  },
  {
    id: 'emp-5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@company.com',
    phone: '0532 333 90 12',
    department: 'Sales',
    position: 'Sales Representative',
    dateOfEmployment: '2022-11-18',
    dateOfBirth: '1988-09-25',
  },
];

export const invalidEmployee = {
  firstName: '',
  lastName: '',
  email: 'invalid-email',
  phone: 'invalid-phone',
  dateOfBirth: 'invalid-date',
  dateOfEmployment: 'future-date',
  department: '',
  position: '',
};

export const validEmployeeForm = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '0532 123 45 67',
  dateOfBirth: '1990-05-20',
  dateOfEmployment: '2023-01-15',
  department: 'Tech',
  position: 'Senior Developer',
};

export const partialEmployeeForm = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  // Missing other required fields
};

export const largeEmployeeDataset = Array.from({length: 100}, (_, index) => ({
  id: `emp-${index + 1}`,
  firstName: `Employee${index + 1}`,
  lastName: 'Test',
  email: `employee${index + 1}@company.com`,
  phone: `0532 ${String(index + 1).padStart(3, '0')} ${String(
    index + 1
  ).padStart(2, '0')} ${String(index + 1).padStart(2, '0')}`,
  department: ['Tech', 'HR', 'Marketing', 'Sales', 'Analytics'][index % 5],
  position: ['Junior', 'Medior', 'Senior'][index % 3],
  dateOfEmployment: '2023-01-15',
  dateOfBirth: `199${Math.floor(index / 10)}-${String(
    (index % 12) + 1
  ).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
}));

export const searchTestEmployees = [
  {
    id: 'search-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '0532 123 45 67',
    department: 'Tech',
    position: 'Developer',
  },
  {
    id: 'search-2',
    firstName: 'Jane',
    lastName: 'Johnson',
    email: 'jane.johnson@company.com',
    phone: '0532 987 65 43',
    department: 'HR',
    position: 'Manager',
  },
  {
    id: 'search-3',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@company.com',
    phone: '0532 555 12 34',
    department: 'Marketing',
    position: 'Specialist',
  },
  {
    id: 'search-4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@company.com',
    phone: '0532 444 56 78',
    department: 'Tech',
    position: 'Developer',
  },
];

export const departmentTestEmployees = [
  {
    id: 'dept-1',
    firstName: 'Tech',
    lastName: 'Employee1',
    email: 'tech1@company.com',
    phone: '0532 111 11 11',
    department: 'Tech',
    position: 'Developer',
  },
  {
    id: 'dept-2',
    firstName: 'Tech',
    lastName: 'Employee2',
    email: 'tech2@company.com',
    phone: '0532 222 22 22',
    department: 'Tech',
    position: 'Developer',
  },
  {
    id: 'dept-3',
    firstName: 'HR',
    lastName: 'Employee1',
    email: 'hr1@company.com',
    phone: '0532 333 33 33',
    department: 'HR',
    position: 'Manager',
  },
  {
    id: 'dept-4',
    firstName: 'Marketing',
    lastName: 'Employee1',
    email: 'marketing1@company.com',
    phone: '0532 444 44 44',
    department: 'Marketing',
    position: 'Specialist',
  },
];

export const paginationTestEmployees = Array.from({length: 50}, (_, index) => ({
  id: `page-${index + 1}`,
  firstName: `Page${index + 1}`,
  lastName: 'Test',
  email: `page${index + 1}@company.com`,
  phone: `0532 ${String(index + 1).padStart(3, '0')} ${String(
    index + 1
  ).padStart(2, '0')} ${String(index + 1).padStart(2, '0')}`,
  department: 'Tech',
  position: 'Developer',
  dateOfEmployment: '2023-01-15',
  dateOfBirth: '1990-01-01',
}));
