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
