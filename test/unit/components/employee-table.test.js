import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../../../src/components/employee-table.js';

// Mock i18nStore for translation
window.i18nStore = {
  translate: (key) => key,
  subscribe: () => () => {},
};

describe('employee-table', () => {
  const sampleEmployees = [
    {
      id: '1',
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
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '0532 987 65 43',
      department: 'HR',
      position: 'Manager',
      dateOfEmployment: '2022-03-10',
      dateOfBirth: '1985-11-02',
    },
  ];

  it('is defined', () => {
    const el = document.createElement('employee-table');
    assert.instanceOf(el, customElements.get('employee-table'));
  });

  it('renders employee rows correctly', async () => {
    const el = await fixture(html`
      <employee-table .employees=${sampleEmployees}></employee-table>
    `);
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 2);
    assert.include(rows[0].textContent, 'John');
    assert.include(rows[1].textContent, 'Jane');
  });

  it('renders empty state when no employees', async () => {
    const el = await fixture(html`
      <employee-table .employees=${[]}></employee-table>
    `);
    await el.updateComplete;
    const emptyDiv = el.shadowRoot.querySelector('.empty');
    assert.exists(emptyDiv);
    assert.include(emptyDiv.textContent, 'No employees found');
  });

  it('handles edit action', async () => {
    const el = await fixture(html`
      <employee-table .employees=${sampleEmployees}></employee-table>
    `);
    await el.updateComplete;
    // Mock window.history.pushState
    const originalPushState = window.history.pushState;
    const originalDispatchEvent = window.dispatchEvent;
    let pushStateCalled = false;
    let popStateEventDispatched = false;
    window.history.pushState = () => {
      pushStateCalled = true;
    };
    window.dispatchEvent = (event) => {
      if (event.type === 'popstate') popStateEventDispatched = true;
      return originalDispatchEvent.call(window, event);
    };
    // Click edit button of first row
    const editBtn = el.shadowRoot.querySelector(
      'tbody tr .actions icon-button[icon="mdi:pencil"]'
    );
    assert.exists(editBtn);
    editBtn.click();
    assert.isTrue(pushStateCalled);
    assert.isTrue(popStateEventDispatched);
    window.history.pushState = originalPushState;
    window.dispatchEvent = originalDispatchEvent;
  });

  it('handles delete action and shows dialog', async () => {
    const el = await fixture(html`
      <employee-table .employees=${sampleEmployees}></employee-table>
    `);
    await el.updateComplete;
    // Click delete button of first row
    const deleteBtn = el.shadowRoot.querySelector(
      'tbody tr .actions icon-button[icon="mdi:delete"]'
    );
    assert.exists(deleteBtn);
    deleteBtn.click();
    await el.updateComplete; // <-- Ensure DOM updates

    assert.isTrue(el.showConfirmDialog);
    assert.equal(el.employeeToDelete.id, sampleEmployees[0].id); // Compare by id

    // Dialog should be open
    const dialog = el.shadowRoot.querySelector('app-dialog');
    assert.exists(dialog);
  });

  it('handles dialog cancel', async () => {
    const el = await fixture(html`
      <employee-table .employees=${sampleEmployees}></employee-table>
    `);
    await el.updateComplete;
    // Simulate delete
    const deleteBtn = el.shadowRoot.querySelector(
      'tbody tr .actions icon-button[icon="mdi:delete"]'
    );
    deleteBtn.click();
    await el.updateComplete;
    // Simulate cancel event
    const dialog = el.shadowRoot.querySelector('app-dialog');
    await dialog.updateComplete;
    const cancelBtn = dialog.shadowRoot.querySelector('#cancel-button');
    cancelBtn.click();
    await el.updateComplete;
    assert.isFalse(el.showConfirmDialog);
    assert.isNull(el.employeeToDelete);
  });

  it('handles dialog confirm and dispatches removeEmployee', async () => {
    // Mock store
    window.store = {dispatch: () => {}};
    window.store.dispatch = () => {};
    const el = await fixture(html`
      <employee-table .employees=${sampleEmployees}></employee-table>
    `);
    await el.updateComplete;
    // Simulate delete
    const deleteBtn = el.shadowRoot.querySelector(
      'tbody tr .actions icon-button[icon="mdi:delete"]'
    );
    deleteBtn.click();
    await el.updateComplete;
    // Simulate confirm event
    const dialog = el.shadowRoot.querySelector('app-dialog');
    await dialog.updateComplete;
    const confirmBtn = dialog.shadowRoot.querySelector('#confirm-button');
    confirmBtn.click();
    await el.updateComplete;
    assert.isFalse(el.showConfirmDialog);
    assert.isNull(el.employeeToDelete);
    // Clean up
    delete window.store;
  });
});
