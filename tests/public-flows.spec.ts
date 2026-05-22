import { expect, test } from '@playwright/test';
import { resetTestData, testCategories, testItems } from '../support/django';
import { HomePage, InventoryCatalogPage, ItemDetailPage, SearchResultsPage } from '../support/pages';

test.beforeEach(() => {
  resetTestData();
});

test('student can browse inventory, filter by category, search, and open details', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new InventoryCatalogPage(page);
  const searchResults = new SearchResultsPage(page);
  const detail = new ItemDetailPage(page);

  await home.goto();
  await home.expectLoaded();
  await home.openInventory();
  await catalog.expectLoaded();
  await expect(page.locator('.product-card').first()).toBeVisible();

  await catalog.filterByCategory(testCategories.electronics);
  await catalog.expectItemVisible(testItems.oscilloscope);
  await catalog.expectItemHidden(testItems.sensorKit);

  await catalog.searchFromNavbar('sensor');
  await searchResults.expectLoaded();
  await searchResults.expectItemVisible(testItems.sensorKit);

  await detail.gotoFromCatalog(testItems.oscilloscope);
  await detail.expectBorrowFormVisible();
});

test('student sees empty-state messaging for blank and unmatched searches', async ({ page }) => {
  await page.goto('/search-inventory/?q=');
  await expect(page.getByText('Use the search bar to find an item, category, or tag.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No items found' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(0);

  await page.goto('/search-inventory/?q=definitely-not-a-lab-resource');
  await expect(page.getByText('Showing results for "definitely-not-a-lab-resource".')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No items found' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(0);
});

test('student can submit a borrow request from a resource detail page', async ({ page }) => {
  const detail = new ItemDetailPage(page);
  await detail.gotoFromCatalog(testItems.oscilloscope);

  await detail.submitBorrowRequest({
    name: 'Playwright Student',
    email: 'student@example.com',
    quantity: 2,
    purpose: 'Prototype testing'
  });

  await expect(page.getByRole('alert')).toContainText('Borrow request submitted');
  await expect(page.getByRole('heading', { name: testItems.oscilloscope })).toBeVisible();
});

test('student cannot submit a borrow request with an invalid email', async ({ page }) => {
  const detail = new ItemDetailPage(page);
  await detail.gotoFromCatalog(testItems.oscilloscope);

  await page.getByLabel('Name').fill('Invalid Borrow Student');
  await page.getByLabel('Email').fill('invalid-email');
  await page.getByLabel('Quantity').fill('1');
  await page.getByLabel('Purpose').fill('Browser validation test');
  await page.getByRole('button', { name: /Submit request/i }).click();

  const emailValidationMessage = await page
    .getByLabel('Email')
    .evaluate((input: HTMLInputElement) => input.validationMessage);

  expect(emailValidationMessage).not.toBe('');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('student sees a clear validation message when borrow quantity exceeds stock', async ({ page }) => {
  const detail = new ItemDetailPage(page);
  await detail.gotoFromCatalog(testItems.sensorKit);

  await detail.submitBorrowRequest({
    name: 'Playwright Student',
    email: 'student@example.com',
    quantity: 99,
    purpose: 'Large workshop'
  });

  await expect(page.getByRole('alert')).toContainText('Only 3 unit(s) are currently available.');
});
