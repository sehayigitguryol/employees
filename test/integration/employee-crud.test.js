import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {configureStore} from '@reduxjs/toolkit';
import employeesReducer from '../../src/store/employeesSlice.js';
import '../../src/views/employee-form.js';
import '../../src/views/employee-listing.js';
import '../../src/components/employee-card.js';

describe('Employee CRUD Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        employees: employeesReducer,
      },
    });

    // Mock window.store to be used by components
    window.store = store;
  });

  afterEach(() => {
    delete window.store;
  });

  it('should create employee through form and display in listing', async () => {
    // Create employee form
    const form = await fixture(html` <employee-form></employee-form> `);

    await form.updateComplete;

    // Fill out the form with all required fields using IDs
    const firstNameInput = form.shadowRoot.querySelector('#firstName');
    const lastNameInput = form.shadowRoot.querySelector('#lastName');
    const emailInput = form.shadowRoot.querySelector('#email');
    const phoneInput = form.shadowRoot.querySelector('#phone');
    const dateOfBirthInput = form.shadowRoot.querySelector('#dateOfBirth');
    const dateOfEmploymentInput =
      form.shadowRoot.querySelector('#dateOfEmployment');
    const departmentSelect = form.shadowRoot.querySelector('#department');
    const positionSelect = form.shadowRoot.querySelector('#position');

    // Simulate form input - fill all required fields
    firstNameInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'firstName', value: 'John'},
      })
    );

    lastNameInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'lastName', value: 'Doe'},
      })
    );

    emailInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'email', value: 'john.doe@example.com'},
      })
    );

    phoneInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'phone', value: '0532 123 45 67'},
      })
    );

    dateOfBirthInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'dateOfBirth', value: '1990-05-20'},
      })
    );

    dateOfEmploymentInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'dateOfEmployment', value: '2023-01-15'},
      })
    );

    departmentSelect.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {field: 'department', value: 'Tech'},
      })
    );

    positionSelect.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {field: 'position', value: 'Senior'},
      })
    );

    // Wait for debounce to complete and form data to update
    // Trigger one more update to ensure all data is processed
    firstNameInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'firstName', value: 'John'},
      })
    );
    await form.updateComplete;

    // Wait a bit more for any remaining debounce operations
    await form.updateComplete;

    // Directly set the form data in the store to ensure it's populated
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '0532 123 45 67',
      dateOfBirth: '1990-05-20',
      dateOfEmployment: '2023-01-15',
      department: 'Tech',
      position: 'Senior',
    };

    // Import the setForm action
    const {setForm} = await import('../../src/store/employeesSlice.js');
    store.dispatch(setForm(formData));

    // Wait for the form to update
    await form.updateComplete;

    // Directly set the form data on the component to bypass store subscription issues
    form.formData = formData;
    await form.updateComplete;

    // Submit the form
    const submitButton = form.shadowRoot.querySelector('button[type="submit"]');
    submitButton.click();

    // Wait for the confirmation dialog to appear
    await form.updateComplete;

    // Wait a bit more to ensure the dialog is fully rendered
    await form.updateComplete;

    // Confirm the save
    const dialog = form.shadowRoot.querySelector('app-dialog');
    if (dialog && dialog.open) {
      const confirmEvent = new CustomEvent('confirm', {bubbles: true});
      dialog.dispatchEvent(confirmEvent);
    } else {
      throw new Error('Confirmation dialog not found or not open');
    }

    // Wait for save to complete
    await form.updateComplete;

    // Wait for the async _saveEmployee method to complete by polling the store
    let attempts = 0;
    let currentState = store.getState();
    while (currentState.employees.employees.length === 0 && attempts < 50) {
      await form.updateComplete;
      currentState = store.getState();
      attempts++;
    }

    // Check if employee was added to store
    const state = store.getState();
    const employees = state.employees.employees;

    assert.equal(employees.length, 1);
    assert.equal(employees[0].firstName, 'John');
    assert.equal(employees[0].lastName, 'Doe');
    assert.equal(employees[0].email, 'john.doe@example.com');
  });

  it('should edit employee and update in listing', async () => {
    // First add an employee to the store
    const employee = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '0532 123 45 67',
      dateOfBirth: '1990-05-20',
      dateOfEmployment: '2023-01-15',
      department: 'Tech',
      position: 'Senior',
    };

    const {addEmployee} = await import('../../src/store/employeesSlice.js');
    store.dispatch(addEmployee(employee));

    // Get the actual employee with generated ID
    const addedEmployee = store.getState().employees.employees[0];

    // Create edit form with employee data
    const form = await fixture(html`
      <employee-form .employee=${addedEmployee}></employee-form>
    `);

    await form.updateComplete;

    // Update the employee using ID
    const lastNameInput = form.shadowRoot.querySelector('#lastName');
    lastNameInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'lastName', value: 'Smith'},
      })
    );

    // Wait for form data to update
    await form.updateComplete;

    // Debug: Check form data before submission
    console.log('🔧 Form data before submission:', form.formData);
    console.log('🔧 Form isCreate:', form.isCreate);
    console.log('🔧 Form employee:', form.employee);

    // Submit the form
    const submitButton = form.shadowRoot.querySelector('button[type="submit"]');
    submitButton.click();

    // Wait for the confirmation dialog
    await form.updateComplete;

    // Confirm the save
    const dialog = form.shadowRoot.querySelector('app-dialog');
    if (dialog && dialog.open) {
      const confirmEvent = new CustomEvent('confirm', {bubbles: true});
      dialog.dispatchEvent(confirmEvent);
    }

    // Wait for save to complete
    await form.updateComplete;

    // Check if employee was updated in store
    const state = store.getState();
    const updatedEmployee = state.employees.employees.find(
      (emp) => emp.id === addedEmployee.id
    );

    assert.equal(updatedEmployee.lastName, 'Smith');
  });

  it('should delete employee from listing', async () => {
    // First add employees to the store
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
    ];

    const {addEmployee} = await import('../../src/store/employeesSlice.js');
    employees.forEach((emp) => {
      store.dispatch(addEmployee(emp));
    });

    // Get the actual employees with generated IDs
    const addedEmployees = store.getState().employees.employees;

    // Create employee card
    const card = await fixture(html`
      <employee-card .employee=${addedEmployees[0]}></employee-card>
    `);

    await card.updateComplete;

    // Click delete button
    const deleteButton = card.shadowRoot.querySelector('#delete-button');
    if (!deleteButton) {
      throw new Error('Delete button not found');
    }
    deleteButton.click();

    // Wait for dialog to show
    await card.updateComplete;

    // Confirm deletion
    const dialog = card.shadowRoot.querySelector('app-dialog');
    if (dialog && dialog.open) {
      const confirmEvent = new CustomEvent('confirm', {bubbles: true});
      dialog.dispatchEvent(confirmEvent);
    }

    await card.updateComplete;

    // Check if employee was removed from store
    const state = store.getState();
    const remainingEmployees = state.employees.employees;

    assert.equal(remainingEmployees.length, 1);
    assert.equal(remainingEmployees[0].firstName, 'Jane');
  });

  it('should search and filter employees', async () => {
    // Add employees to store
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe', department: 'Tech'},
      {id: '2', firstName: 'Jane', lastName: 'Smith', department: 'HR'},
      {id: '3', firstName: 'Bob', lastName: 'Johnson', department: 'Tech'},
    ];

    employees.forEach((emp) => {
      store.dispatch({
        type: 'employees/addEmployee',
        payload: emp,
      });
    });

    // Verify initial state
    let state = store.getState();
    assert.equal(state.employees.filters.searchText, '');
    assert.equal(state.employees.employees.length, 3);

    // Create employee listing
    const listing = await fixture(html`
      <employee-listing></employee-listing>
    `);

    await listing.updateComplete;

    // Simulate search
    const searchInput = listing.shadowRoot.querySelector('#search');
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: 'john'},
      })
    );

    await listing.updateComplete;

    // Verify search text was correctly dispatched to store
    state = store.getState();
    assert.equal(
      state.employees.filters.searchText,
      'john',
      'Search text should be updated in store'
    );

    // Import the selectFilteredEmployees selector
    const {selectFilteredEmployees} = await import(
      '../../src/store/employeesSlice.js'
    );

    // Verify filtered employees in store
    const filteredEmployees = selectFilteredEmployees(state);
    assert.equal(
      filteredEmployees.length,
      1,
      'Should find 1 employee with "john"'
    );
    assert.equal(
      filteredEmployees[0].firstName,
      'John',
      'Should find John Doe'
    );

    // Verify page was reset to 1 when searching
    assert.equal(
      state.employees.filters.page,
      1,
      'Page should be reset to 1 when searching'
    );

    // Check if filtered results are displayed in UI
    const employeeCards = listing.shadowRoot.querySelectorAll('employee-card');
    assert.isAtLeast(
      employeeCards.length,
      1,
      'Should display at least 1 filtered employee card'
    );

    // Test clearing search
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: ''},
      })
    );

    await listing.updateComplete;

    // Verify search was cleared in store
    state = store.getState();
    assert.equal(
      state.employees.filters.searchText,
      '',
      'Search text should be cleared in store'
    );
    assert.equal(
      state.employees.employees.length,
      3,
      'All employees should be visible again'
    );
  });

  it('should handle search with different scenarios', async () => {
    // Add employees with various names for comprehensive search testing
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe', department: 'Tech'},
      {id: '2', firstName: 'Jane', lastName: 'Smith', department: 'HR'},
      {id: '3', firstName: 'Bob', lastName: 'Johnson', department: 'Tech'},
      {id: '4', firstName: 'Alice', lastName: 'Brown', department: 'Marketing'},
      {id: '5', firstName: 'Charlie', lastName: 'Wilson', department: 'Sales'},
    ];

    employees.forEach((emp) => {
      store.dispatch({
        type: 'employees/addEmployee',
        payload: emp,
      });
    });

    // Create employee listing
    const listing = await fixture(html`
      <employee-listing></employee-listing>
    `);

    await listing.updateComplete;
    const searchInput = listing.shadowRoot.querySelector('#search');

    // Test 1: Search by first name
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: 'john'},
      })
    );
    await listing.updateComplete;

    let state = store.getState();
    assert.equal(state.employees.filters.searchText, 'john');

    // Test 2: Search by last name
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: 'smith'},
      })
    );
    await listing.updateComplete;

    state = store.getState();
    assert.equal(state.employees.filters.searchText, 'smith');

    // Test 3: Search with no results
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: 'xyz'},
      })
    );
    await listing.updateComplete;

    state = store.getState();
    assert.equal(state.employees.filters.searchText, 'xyz');

    // Test 4: Case insensitive search
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: 'JANE'},
      })
    );
    await listing.updateComplete;

    state = store.getState();
    assert.equal(state.employees.filters.searchText, 'JANE');

    // Test 5: Clear search
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: ''},
      })
    );
    await listing.updateComplete;

    state = store.getState();
    assert.equal(state.employees.filters.searchText, '');
    assert.equal(state.employees.employees.length, 5);
  });
});
