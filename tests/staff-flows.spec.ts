import { expect, test } from '@playwright/test';
import { resetTestData, testCategories, testItems } from '../support/django';
import { ItemDetailPage, LoginPage, ResourceFormPage, StaffWorkspacePage } from '../support/pages';

test.beforeEach(() => {
  resetTestData();
});

test('staff routes redirect guests to staff login and reject invalid credentials', async ({ page }) => {
  const login = new LoginPage(page);

  await page.goto('/inventory/');
  await expect(page).toHaveURL(/\/admin-login\//);
  await login.expectLoaded();

  await login.login('wrong-user', 'wrong-password');
  await expect(page.getByRole('alert')).toContainText('Invalid username or password.');
});

test('staff can log in and log out', async ({ page }) => {
  const login = new LoginPage(page);
  const workspace = new StaffWorkspacePage(page);

  await login.loginAsStaff();
  await workspace.nav.getByRole('link', { name: 'Manage' }).click();
  await workspace.expectLoaded();

  await workspace.logout();
  await expect(page.getByRole('alert')).toContainText('You have successfully logged out.');
  await expect(workspace.nav).toContainText('Staff Login');
});

test('staff can add a category and create a new inventory resource', async ({ page }, testInfo) => {
  const login = new LoginPage(page);
  const form = new ResourceFormPage(page);
  const workspace = new StaffWorkspacePage(page);

  await login.loginAsStaff();
  await page.goto('/add-inventory/');

  const categoryName = `PW New Category ${Date.now()}`;
  await form.addCategory(categoryName);
  await expect(page.getByRole('alert')).toContainText(`Category "${categoryName}" added.`);

  const itemName = `Pw added resource ${Date.now()}`;
  await form.createResource(
    {
      name: itemName,
      category: categoryName,
      quantity: 7,
      featured: true,
      description: 'Created by Playwright automation.',
      tags: 'playwright, automation'
    },
    testInfo
  );

  await expect(page).toHaveURL(/\/inventory\//);
  await expect(page.getByRole('alert')).toContainText(`"${itemName}" has been added to inventory.`);
  await expect(workspace.row(itemName)).toBeVisible();
});

test('staff can edit a resource record', async ({ page }) => {
  const login = new LoginPage(page);
  const workspace = new StaffWorkspacePage(page);
  const form = new ResourceFormPage(page);

  await login.loginAsStaff();
  await workspace.goto();
  await workspace.editResource(testItems.oscilloscope);
  await expect(page.getByRole('heading', { name: `Edit ${testItems.oscilloscope}` })).toBeVisible();
  await form.updateResource({ quantity: 9, description: 'Updated by Playwright automation.' });

  await expect(page.getByRole('alert')).toContainText(`"${testItems.oscilloscope}" updated.`);
  await expect(workspace.row(testItems.oscilloscope).getByLabel('Quantity')).toHaveValue('9');
});

test('staff can update quantity, toggle featured, search, and delete resources', async ({ page }) => {
  const login = new LoginPage(page);
  const workspace = new StaffWorkspacePage(page);

  await login.loginAsStaff();
  await workspace.goto();

  await workspace.updateResourceRow(testItems.sensorKit, { quantity: 11, featured: true });
  await expect(page.getByRole('alert')).toContainText(`"${testItems.sensorKit}" updated.`);
  await expect(workspace.row(testItems.sensorKit).getByLabel('Quantity')).toHaveValue('11');

  await workspace.searchInventory('Delete Target');
  await expect(page.locator('.inventory-row')).toHaveCount(1);
  await expect(workspace.row(testItems.deleteTarget)).toBeVisible();

  await workspace.deleteResource(testItems.deleteTarget);
  await expect(page.getByRole('alert')).toContainText(`"${testItems.deleteTarget}" deleted.`);
  await expect(workspace.row(testItems.deleteTarget)).toHaveCount(0);
});

test('staff can approve a borrow request and mark it returned', async ({ page }) => {
  const detail = new ItemDetailPage(page);
  const login = new LoginPage(page);
  const workspace = new StaffWorkspacePage(page);

  await detail.gotoFromCatalog(testItems.oscilloscope);
  await detail.submitBorrowRequest({
    name: 'Borrow Approval Student',
    email: 'borrow-approval@example.com',
    quantity: 2,
    purpose: 'Approval workflow test'
  });

  await login.loginAsStaff();
  await workspace.goto();
  const requestRow = workspace.borrowRow('Borrow Approval Student');
  await expect(requestRow).toContainText('Pending');
  await workspace.approveBorrow('Borrow Approval Student');
  await expect(page.getByRole('alert')).toContainText(`Approved borrow request for "${testItems.oscilloscope}".`);
  await expect(workspace.row(testItems.oscilloscope).getByLabel('Quantity')).toHaveValue('3');

  const approvedRow = workspace.borrowRow('Borrow Approval Student');
  await expect(approvedRow).toContainText('Approved');
  await workspace.markReturned('Borrow Approval Student');
  await expect(page.getByRole('alert')).toContainText(`Marked "${testItems.oscilloscope}" as returned.`);
  await expect(workspace.row(testItems.oscilloscope).getByLabel('Quantity')).toHaveValue('5');
});

test('staff can reject a pending borrow request', async ({ page }) => {
  const detail = new ItemDetailPage(page);
  const login = new LoginPage(page);
  const workspace = new StaffWorkspacePage(page);

  await detail.gotoFromCatalog(testItems.sensorKit);
  await detail.submitBorrowRequest({
    name: 'Borrow Reject Student',
    email: 'borrow-reject@example.com',
    quantity: 1,
    purpose: 'Rejection workflow test'
  });

  await login.loginAsStaff();
  await workspace.goto();
  await workspace.rejectBorrow('Borrow Reject Student');

  await expect(page.getByRole('alert')).toContainText(`Rejected borrow request for "${testItems.sensorKit}".`);
  await expect(workspace.borrowRow('Borrow Reject Student')).toHaveCount(0);
});
