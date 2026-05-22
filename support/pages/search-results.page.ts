import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SearchResultsPage extends BasePage {
  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Search/i })).toBeVisible();
  }

  async expectItemVisible(itemName: string): Promise<void> {
    await expect(this.page.locator('.product-card', { hasText: itemName })).toBeVisible();
  }
}
