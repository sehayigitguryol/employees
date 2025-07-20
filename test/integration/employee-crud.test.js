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
  });

  it('should create employee through form and display in listing', async () => {
    // Create employee form
    const form = await fixture(html` <employee-form></employee-form> `);

    await form.updateComplete;

    // Fill out the form
    const firstNameInput = form.shadowRoot.querySelector(
      'input-field[label*="First Name"]'
    );
    const lastNameInput = form.shadowRoot.querySelector(
      'input-field[label*="Last Name"]'
    );
    const emailInput = form.shadowRoot.querySelector(
      'input-field[type="email"]'
    );

    // Simulate form input
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

    // Submit the form
    const submitButton = form.shadowRoot.querySelector('button[type="submit"]');
    submitButton.click();

    await form.updateComplete;

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
    };

    store.dispatch({
      type: 'employees/addEmployee',
      payload: employee,
    });

    // Create edit form with employee data
    const form = await fixture(html`
      <employee-form .employee=${employee}></employee-form>
    `);

    await form.updateComplete;

    // Update the employee
    const lastNameInput = form.shadowRoot.querySelector(
      'input-field[label*="Last Name"]'
    );
    lastNameInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'lastName', value: 'Smith'},
      })
    );

    // Submit the form
    const submitButton = form.shadowRoot.querySelector('button[type="submit"]');
    submitButton.click();

    await form.updateComplete;

    // Check if employee was updated in store
    const state = store.getState();
    const updatedEmployee = state.employees.employees.find(
      (emp) => emp.id === '1'
    );

    assert.equal(updatedEmployee.lastName, 'Smith');
  });

  it('should delete employee from listing', async () => {
    // First add employees to the store
    const employees = [
      {id: '1', firstName: 'John', lastName: 'Doe'},
      {id: '2', firstName: 'Jane', lastName: 'Smith'},
    ];

    employees.forEach((emp) => {
      store.dispatch({
        type: 'employees/addEmployee',
        payload: emp,
      });
    });

    // Create employee card
    const card = await fixture(html`
      <employee-card .employee=${employees[0]}></employee-card>
    `);

    await card.updateComplete;

    // Click delete button
    const deleteButton = card.shadowRoot.querySelector('.btn.delete');
    deleteButton.click();

    // Confirm deletion (if confirmation dialog is shown)
    if (card.showConfirmDialog) {
      const confirmButton = card.shadowRoot.querySelector(
        'dialog button[data-action="confirm"]'
      );
      if (confirmButton) {
        confirmButton.click();
      }
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

    // Create employee listing
    const listing = await fixture(html`
      <employee-listing></employee-listing>
    `);

    await listing.updateComplete;

    // Simulate search
    const searchInput = listing.shadowRoot.querySelector(
      'input-field[field="search"]'
    );
    searchInput.dispatchEvent(
      new CustomEvent('text-change', {
        detail: {field: 'search', value: 'john'},
      })
    );

    await listing.updateComplete;

    // Check if filtered results are displayed
    const employeeCards = listing.shadowRoot.querySelectorAll('employee-card');
    assert.isAtLeast(employeeCards.length, 1);
  });
});
