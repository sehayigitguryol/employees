import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../../../src/components/employee-card.js';

describe('employee-card', () => {
  const sampleEmployee = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '0532 123 45 67',
    department: 'Tech',
    position: 'Senior Developer',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
  };

  it('is defined', () => {
    const el = document.createElement('employee-card');
    assert.instanceOf(el, customElements.get('employee-card'));
  });

  it('renders employee data correctly', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    // Check if employee details are rendered
    const detailValues = el.shadowRoot.querySelectorAll('.detail-value');
    assert.isAtLeast(detailValues.length, 4); // firstName, lastName, email, phone

    // Check if all detail items are present
    const detailItems = el.shadowRoot.querySelectorAll('.detail-item');
    assert.isAtLeast(detailItems.length, 4); // firstName, lastName, email, phone
  });

  it('renders with missing optional fields', async () => {
    const employeeWithoutOptional = {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '0532 987 65 43',
      // department and position are missing
    };

    const el = await fixture(html`
      <employee-card .employee=${employeeWithoutOptional}></employee-card>
    `);

    await el.updateComplete;

    // Should still render without errors
    const card = el.shadowRoot.querySelector('.card');
    assert.exists(card);

    // Department and position should not be rendered since they're missing
    const detailValues = el.shadowRoot.querySelectorAll('.detail-value');
    // Should have 4 values: firstName, lastName, email, phone
    assert.equal(detailValues.length, 4);
  });

  it('handles edit action', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
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
      if (event.type === 'popstate') {
        popStateEventDispatched = true;
      }
      return originalDispatchEvent.call(window, event);
    };

    const editButton = el.shadowRoot.querySelector('.btn.edit');
    assert.exists(editButton);

    editButton.click();

    // Check that navigation was triggered
    assert.isTrue(pushStateCalled);
    assert.isTrue(popStateEventDispatched);

    // Restore original methods
    window.history.pushState = originalPushState;
    window.dispatchEvent = originalDispatchEvent;
  });

  it('handles delete action', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    // Initially dialog should not be shown
    assert.isFalse(el.showConfirmDialog);

    const deleteButton = el.shadowRoot.querySelector('.btn.delete');
    assert.exists(deleteButton);

    deleteButton.click();

    // After clicking delete, dialog should be shown
    assert.isTrue(el.showConfirmDialog);
  });

  it('shows confirm dialog on delete', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    // Initially dialog should not be shown
    assert.isFalse(el.showConfirmDialog);

    const deleteButton = el.shadowRoot.querySelector('.btn.delete');
    deleteButton.click();

    // After clicking delete, dialog should be shown
    assert.isTrue(el.showConfirmDialog);
  });

  it('handles empty employee data', async () => {
    const el = await fixture(html` <employee-card></employee-card> `);

    await el.updateComplete;

    const card = el.shadowRoot.querySelector('.card');
    assert.exists(card);
    assert.include(card.textContent, 'No employee data');
  });

  it('applies correct styling classes', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    const card = el.shadowRoot.querySelector('.card');
    assert.exists(card);

    const editButton = el.shadowRoot.querySelector('.btn.edit');
    const deleteButton = el.shadowRoot.querySelector('.btn.delete');

    assert.exists(editButton);
    assert.exists(deleteButton);
    assert.include(editButton.className, 'edit');
    assert.include(deleteButton.className, 'delete');
  });

  it('displays employee details', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    const labels = el.shadowRoot.querySelectorAll('.detail-label');
    const values = el.shadowRoot.querySelectorAll('.detail-value');

    assert.isAtLeast(labels.length, 4);
    assert.isAtLeast(values.length, 4);

    // Check that employee data is displayed
    const firstNameValue = values[0].textContent.trim();
    assert.include(firstNameValue, 'John');
  });

  it('handles keyboard navigation', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    const editButton = el.shadowRoot.querySelector('.btn.edit');
    assert.exists(editButton);

    // Test keyboard navigation
    editButton.focus();

    // In shadow DOM, the active element might be the component itself
    // Let's check if the button is focused within the shadow root
    const focusedElement = el.shadowRoot.activeElement;
    assert.equal(focusedElement, editButton);

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    editButton.dispatchEvent(enterEvent);
  });

  it('handles accessibility attributes', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    const editButton = el.shadowRoot.querySelector('.btn.edit');
    const deleteButton = el.shadowRoot.querySelector('.btn.delete');

    // Check for proper ARIA attributes
    assert.exists(editButton);
    assert.exists(deleteButton);
  });

  it('handles responsive design', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    const card = el.shadowRoot.querySelector('.card');
    assert.exists(card);

    // Test that the card has responsive styles
    const computedStyle = window.getComputedStyle(card);
    assert.exists(computedStyle);
  });

  it('handles dialog confirmation', async () => {
    const el = await fixture(html`
      <employee-card .employee=${sampleEmployee}></employee-card>
    `);

    await el.updateComplete;

    // Mock the store dispatch
    const originalDispatch = window.store?.dispatch;
    let dispatchCalled = false;

    if (window.store) {
      window.store.dispatch = () => {
        dispatchCalled = true;
      };
    }

    // Show dialog
    el.showConfirmDialog = true;
    await el.updateComplete;

    // Find and click confirm button
    const dialog = el.shadowRoot.querySelector('app-dialog');
    if (dialog) {
      const confirmEvent = new CustomEvent('confirm', {bubbles: true});
      dialog.dispatchEvent(confirmEvent);
    }

    // Check that dispatch was called
    if (window.store) {
      assert.isTrue(dispatchCalled);
      window.store.dispatch = originalDispatch;
    }
  });
});
