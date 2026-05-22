import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryCatalogPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/products/');
  }

  async searchForItem(itemName: string): Promise<void> {
    await this.page.goto(`/search-inventory/?q=${encodeURIComponent(itemName)}`);
  }

  card(itemName: string) {
    return this.page.locator('.product-card', { hasText: itemName }).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Lab Inventory' })).toBeVisible();
  }

  async expectItemVisible(itemName: string): Promise<void> {
    await expect(this.card(itemName)).toBeVisible();
  }

  async expectItemHidden(itemName: string): Promise<void> {
    await expect(this.page.locator('.product-card', { hasText: itemName })).toHaveCount(0);
  }

  async filterByCategory(categoryName: string): Promise<void> {
    await this.page.getByLabel(categoryName).check({ force: true });
    await this.page.getByRole('button', { name: /Apply/i }).click();
  }

  async openDetails(itemName: string): Promise<void> {
    await this.expectItemVisible(itemName);
    await this.card(itemName).getByRole('link', { name: 'View details' }).click();
  }
}
