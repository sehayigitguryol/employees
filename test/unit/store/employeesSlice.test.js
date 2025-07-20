import {assert} from '@open-wc/testing';
import {configureStore} from '@reduxjs/toolkit';
import employeesReducer, {
  setEmployees,
  addEmployee,
  updateEmployee,
  removeEmployee,
  setFilters,
  setPage,
  setSize,
  setSearchText,
  setLoading,
  setError,
  resetFilters,
  setForm,
  resetForm,
  selectEmployees,
  selectEmployeeById,
  selectPaginatedEmployees,
  selectLoading,
  selectError,
} from '../../../src/store/employeesSlice.js';

describe('employeesSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        employees: employeesReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState();
    assert.deepEqual(state.employees.employees, []);
    assert.deepEqual(state.employees.filters, {
      page: 1,
      size: 10,
      searchText: '',
    });
    assert.isFalse(state.employees.loading);
    assert.isNull(state.employees.error);
    assert.isNull(state.employees.form);
  });

  it('should handle setEmployees', () => {
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
    ];

    store.dispatch(setEmployees(employees));
    const state = store.getState();

    assert.deepEqual(state.employees.employees, employees);
  });

  it('should handle addEmployee', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    store.dispatch(addEmployee(employee));
    const state = store.getState();

    assert.equal(state.employees.employees.length, 1);
    assert.property(state.employees.employees[0], 'id');
    assert.equal(state.employees.employees[0].firstName, 'John');
    assert.equal(state.employees.employees[0].lastName, 'Doe');
    assert.equal(state.employees.employees[0].email, 'john@example.com');
  });

  it('should handle updateEmployee', () => {
    // First add an employee
    const originalEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };
    store.dispatch(addEmployee(originalEmployee));

    // Then update it
    const updatedEmployee = {
      id: store.getState().employees.employees[0].id,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
    };

    store.dispatch(updateEmployee(updatedEmployee));
    const state = store.getState();

    assert.equal(state.employees.employees.length, 1);
    assert.equal(state.employees.employees[0].lastName, 'Smith');
    assert.equal(state.employees.employees[0].email, 'john.smith@example.com');
  });

  it('should handle removeEmployee', () => {
    // First add employees
    store.dispatch(addEmployee({firstName: 'John', lastName: 'Doe'}));
    store.dispatch(addEmployee({firstName: 'Jane', lastName: 'Smith'}));

    const state = store.getState();
    const employeeId = state.employees.employees[0].id;

    // Remove the first employee
    store.dispatch(removeEmployee(employeeId));
    const newState = store.getState();

    assert.equal(newState.employees.employees.length, 1);
    assert.equal(newState.employees.employees[0].firstName, 'Jane');
  });

  it('should handle setFilters', () => {
    const filters = {
      page: 2,
      size: 20,
      searchText: 'John',
    };

    store.dispatch(setFilters(filters));
    const state = store.getState();

    assert.equal(state.employees.filters.page, 2);
    assert.equal(state.employees.filters.size, 20);
    assert.equal(state.employees.filters.searchText, 'John');
  });

  it('should handle setPage', () => {
    store.dispatch(setPage(3));
    const state = store.getState();

    assert.equal(state.employees.filters.page, 3);
  });

  it('should handle setSize', () => {
    store.dispatch(setSize(25));
    const state = store.getState();

    assert.equal(state.employees.filters.size, 25);
  });

  it('should handle setSearchText', () => {
    store.dispatch(setSearchText('developer'));
    const state = store.getState();

    assert.equal(state.employees.filters.searchText, 'developer');
  });

  it('should handle setLoading', () => {
    store.dispatch(setLoading(true));
    const state = store.getState();

    assert.isTrue(state.employees.loading);
  });

  it('should handle setError', () => {
    const error = 'Failed to load employees';
    store.dispatch(setError(error));
    const state = store.getState();

    assert.equal(state.employees.error, error);
  });

  it('should handle resetFilters', () => {
    // First set some filters
    store.dispatch(
      setFilters({
        page: 5,
        size: 50,
        searchText: 'test',
      })
    );

    // Then reset them
    store.dispatch(resetFilters());
    const state = store.getState();

    assert.deepEqual(state.employees.filters, {
      page: 1,
      size: 10,
      searchText: '',
    });
  });

  it('should handle setForm', () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    store.dispatch(setForm(formData));
    const state = store.getState();

    assert.deepEqual(state.employees.form, formData);
  });

  it('should handle resetForm', () => {
    // First set some form data
    store.dispatch(
      setForm({
        firstName: 'John',
        lastName: 'Doe',
      })
    );

    // Then reset it
    store.dispatch(resetForm());
    const state = store.getState();

    // Should reset to initial form structure
    assert.property(state.employees.form, 'firstName');
    assert.property(state.employees.form, 'lastName');
    assert.property(state.employees.form, 'email');
    assert.property(state.employees.form, 'phone');
    assert.property(state.employees.form, 'position');
    assert.property(state.employees.form, 'department');
    assert.property(state.employees.form, 'dateOfEmployment');
    assert.property(state.employees.form, 'dateOfBirth');
  });

  it('should handle setForm with null', () => {
    store.dispatch(setForm(null));
    const state = store.getState();

    // Should set to initial form structure
    assert.property(state.employees.form, 'firstName');
    assert.property(state.employees.form, 'lastName');
  });
});

describe('employeesSlice selectors', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        employees: employeesReducer,
      },
    });
  });

  it('selectEmployees should return all employees', () => {
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
    ];

    store.dispatch(setEmployees(employees));
    const state = store.getState();

    const result = selectEmployees(state);
    assert.deepEqual(result, employees);
  });

  it('selectEmployeeById should return correct employee', () => {
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
    ];

    store.dispatch(setEmployees(employees));
    const state = store.getState();

    const result = selectEmployeeById(state, '1');
    assert.deepEqual(result, employees[0]);

    const notFound = selectEmployeeById(state, '999');
    assert.isUndefined(notFound);
  });

  it('selectLoading should return loading state', () => {
    store.dispatch(setLoading(true));
    const state = store.getState();

    const result = selectLoading(state);
    assert.isTrue(result);
  });

  it('selectError should return error state', () => {
    const error = 'Test error';
    store.dispatch(setError(error));
    const state = store.getState();

    const result = selectError(state);
    assert.equal(result, error);
  });

  it('selectPaginatedEmployees should return paginated results', () => {
    // Create 15 employees
    const employees = [];
    for (let i = 1; i <= 15; i++) {
      employees.push({
        id: `emp-${i}`,
        firstName: `Employee${i}`,
        lastName: 'Test',
      });
    }

    store.dispatch(setEmployees(employees));
    store.dispatch(setSize(5)); // 5 per page
    store.dispatch(setPage(2)); // Second page

    const state = store.getState();
    const result = selectPaginatedEmployees(state);

    // Should return 5 employees (page 2)
    assert.equal(result.length, 5);
    assert.equal(result[0].firstName, 'Employee6');
    assert.equal(result[4].firstName, 'Employee10');
  });

  it('selectPaginatedEmployees should handle search filtering', () => {
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
      {id: '3', firstName: 'Bob', lastName: 'Johnson'},
      {id: '4', firstName: 'Alice', lastName: 'Williams'},
    ];

    store.dispatch(setEmployees(employees));
    store.dispatch(setSearchText('john')); // Case insensitive search

    const state = store.getState();
    const result = selectPaginatedEmployees(state);

    // Should return employees with 'john' in name
    assert.equal(result.length, 2); // John Doe and Bob Johnson
  });

  it('selectPaginatedEmployees should handle empty search', () => {
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
    ];

    store.dispatch(setEmployees(employees));
    store.dispatch(setSearchText(''));

    const state = store.getState();
    const result = selectPaginatedEmployees(state);

    // Should return all employees when search is empty
    assert.equal(result.length, 2);
  });
});
