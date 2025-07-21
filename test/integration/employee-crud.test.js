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

    // Fill out the form with all required fields using user-like input
    const firstNameField = form.shadowRoot.querySelector(
      'input-field#firstName'
    );
    const lastNameField = form.shadowRoot.querySelector('input-field#lastName');
    const emailField = form.shadowRoot.querySelector('input-field#email');
    const phoneField = form.shadowRoot.querySelector('input-field#phone');
    const dateOfBirthField = form.shadowRoot.querySelector(
      'input-field#dateOfBirth'
    );
    const dateOfEmploymentField = form.shadowRoot.querySelector(
      'input-field#dateOfEmployment'
    );
    const departmentSelect = form.shadowRoot.querySelector(
      'select-field#department'
    );
    const positionSelect = form.shadowRoot.querySelector(
      'select-field#position'
    );

    // Helper to set value and dispatch input event
    function setInputValue(field, value) {
      field.value = value; // update the property for display
      field.dispatchEvent(
        new CustomEvent('text-change', {
          detail: {field: field.field, value},
          bubbles: true,
          composed: true,
        })
      );
    }

    setInputValue(firstNameField, 'John');
    setInputValue(lastNameField, 'Doe');
    setInputValue(emailField, 'john.doe@example.com');
    setInputValue(phoneField, '0532 123 45 67');
    setInputValue(dateOfBirthField, '1990-05-20');
    setInputValue(dateOfEmploymentField, '2023-01-15');
    await form.updateComplete;

    // For select-field, simulate the select-change event as before
    departmentSelect.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {field: 'department', value: 'Tech'},
        bubbles: true,
        composed: true,
      })
    );
    positionSelect.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {field: 'position', value: 'Senior'},
        bubbles: true,
        composed: true,
      })
    );
    await form.updateComplete;

    // Poll for formData to be updated after all events
    let pollAttempts = 0;
    while (!form.formData.firstName && pollAttempts < 20) {
      await form.updateComplete;
      pollAttempts++;
    }

    // Assert all required fields are present and non-empty
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'dateOfEmployment',
      'department',
      'position',
    ];
    for (const field of requiredFields) {
      if (!form.formData[field]) {
        throw new Error(
          `Required field ${field} is missing or empty in formData`
        );
      }
    }

    // Submit the form
    const formElement = form.shadowRoot.querySelector('form');
    formElement.dispatchEvent(
      new Event('submit', {bubbles: true, cancelable: true, composed: true})
    );
    await form.updateComplete;

    // Wait for the confirmation dialog to appear and be open
    let dialog = form.shadowRoot.querySelector('app-dialog');
    for (let i = 0; i < 10 && (!dialog || !dialog.open); i++) {
      await form.updateComplete;
      dialog = form.shadowRoot.querySelector('app-dialog');
    }
    if (!dialog || !dialog.open)
      throw new Error('Confirmation dialog not found or not open');

    // Confirm the save
    const confirmBtn = dialog.shadowRoot.querySelector('#confirm-button');
    if (!confirmBtn) throw new Error('Confirm button not found');
    confirmBtn.click();
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
    lastNameInput.value = 'Smith';
    lastNameInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'lastName', value: 'Smith'},
        bubbles: true,
        composed: true,
      })
    );

    await form.updateComplete;

    // Submit the form by dispatching a submit event
    const formElement = form.shadowRoot.querySelector('form');
    formElement.dispatchEvent(
      new Event('submit', {bubbles: true, cancelable: true, composed: true})
    );
    await form.updateComplete;

    // Wait for the confirmation dialog to appear and be open
    let dialog = form.shadowRoot.querySelector('app-dialog');
    for (let i = 0; i < 10 && (!dialog || !dialog.open); i++) {
      await form.updateComplete;
      dialog = form.shadowRoot.querySelector('app-dialog');
    }
    if (!dialog || !dialog.open)
      throw new Error('Confirmation dialog not found or not open');

    // Confirm the save
    const confirmBtn = dialog.shadowRoot.querySelector('#confirm-button');
    if (!confirmBtn) throw new Error('Confirm button not found');
    confirmBtn.click();
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
    const deleteButton = card.shadowRoot.querySelector(
      `#delete-button-${addedEmployees[0].id}`
    );
    if (!deleteButton) {
      throw new Error('Delete button not found');
    }
    deleteButton.click();

    // Wait for dialog to show
    await card.updateComplete;

    // Confirm deletion
    const dialog = card.shadowRoot.querySelector('app-dialog');
    if (dialog && dialog.open) {
      await dialog.updateComplete;
      const confirmBtn = dialog.shadowRoot.querySelector('#confirm-button');
      if (!confirmBtn) throw new Error('Confirm button not found');
      confirmBtn.click();
    }

    await card.updateComplete;

    // Check if employee was removed from store
    const state = store.getState();
    const remainingEmployees = state.employees.employees;

    assert.equal(remainingEmployees.length, 1);
    assert.equal(remainingEmployees[0].firstName, 'Jane');
  });

  it('should search and filter employees', (done) => {
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

    fixture(html`<employee-listing></employee-listing>`).then((listing) => {
      // Simulate search
      const searchInput = listing.shadowRoot.querySelector('#search');
      searchInput.dispatchEvent(
        new CustomEvent('text-change', {
          detail: {field: 'search', value: 'john'},
        })
      );

      // Wait for UI to update
      setTimeout(() => {
        const listView = listing.shadowRoot.querySelector('list-view');
        if (!listView) {
          assert.fail('list-view not found in employee-listing');
          done();
          return;
        }
        const employeeTable =
          listView.shadowRoot.querySelector('employee-table');
        assert.isNotNull(
          employeeTable,
          'Should display the employee table in the list view'
        );
        // Check number of employee rows in the table (should be 2 for "john")
        const tbody = employeeTable.shadowRoot.querySelector('tbody');
        const rows = tbody ? tbody.querySelectorAll('tr') : [];
        assert.equal(
          rows.length,
          2,
          'Should display 2 filtered employee rows in the table'
        );
        done();
      }, 100);
    });
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

    fixture(html`<employee-listing></employee-listing>`).then((listing) => {
      listing.updateComplete.then(() => {
        const searchInput = listing.shadowRoot.querySelector('#search');

        // Test 1: Search by first name
        searchInput.dispatchEvent(
          new CustomEvent('text-change', {
            detail: {field: 'search', value: 'john'},
          })
        );
        listing.updateComplete.then(() => {
          let state = store.getState();
          assert.equal(state.employees.filters.searchText, 'john');
        });

        // Test 2: Search by last name
        searchInput.dispatchEvent(
          new CustomEvent('text-change', {
            detail: {field: 'search', value: 'smith'},
          })
        );
        listing.updateComplete.then(() => {
          let state = store.getState();
          assert.equal(state.employees.filters.searchText, 'smith');
        });

        // Test 3: Search with no results
        searchInput.dispatchEvent(
          new CustomEvent('text-change', {
            detail: {field: 'search', value: 'xyz'},
          })
        );
        listing.updateComplete.then(() => {
          let state = store.getState();
          assert.equal(state.employees.filters.searchText, 'xyz');
        });

        // Test 4: Case insensitive search
        searchInput.dispatchEvent(
          new CustomEvent('text-change', {
            detail: {field: 'search', value: 'JANE'},
          })
        );
        listing.updateComplete.then(() => {
          let state = store.getState();
          assert.equal(state.employees.filters.searchText, 'JANE');
        });

        // Test 5: Clear search
        searchInput.dispatchEvent(
          new CustomEvent('text-change', {
            detail: {field: 'search', value: ''},
          })
        );
        listing.updateComplete.then(() => {
          let state = store.getState();
          assert.equal(state.employees.filters.searchText, '');
          assert.equal(state.employees.employees.length, 5);
        });
      });
    });
  });
});
