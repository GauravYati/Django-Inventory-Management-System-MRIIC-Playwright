import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.nav).toContainText('MRIIC');
  }

  async openInventory(): Promise<void> {
    await this.page.locator('#mainNav').getByRole('link', { name: 'Inventory' }).click();
  }
}
