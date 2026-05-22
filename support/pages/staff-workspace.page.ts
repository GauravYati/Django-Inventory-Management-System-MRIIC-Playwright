import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class StaffWorkspacePage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/inventory/');
  }

  row(itemName: string) {
    return this.page.locator('.inventory-row', { hasText: itemName });
  }

  borrowRow(requesterName: string) {
    return this.page.locator('.borrow-admin-row', { hasText: requesterName });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Manage research lab inventory' })).toBeVisible();
  }

  async openAddResource(): Promise<void> {
    await this.page.getByRole('link', { name: /Add Resource/i }).click();
  }

  async editResource(itemName: string): Promise<void> {
    await this.page.getByLabel(`Edit ${itemName}`).click();
  }

  async updateResourceRow(itemName: string, options: { quantity: number; featured?: boolean }): Promise<void> {
    const row = this.row(itemName);
    await row.getByLabel('Quantity').fill(String(options.quantity));
    if (options.featured !== undefined) {
      await row.getByLabel('Featured').setChecked(options.featured);
    }
    await row.getByRole('button', { name: /Save/i }).click();
  }

  async searchInventory(query: string): Promise<void> {
    const toolbar = this.page.locator('.admin-toolbar');
    await toolbar.locator('#inventory-search').fill(query);
    await toolbar.getByRole('button', { name: /Search/i }).click();
  }

  async deleteResource(itemName: string): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept());
    await this.page.getByLabel(`Delete ${itemName}`).click();
  }

  async approveBorrow(requesterName: string): Promise<void> {
    await this.borrowRow(requesterName).getByRole('button', { name: 'Approve' }).click();
  }

  async rejectBorrow(requesterName: string): Promise<void> {
    await this.borrowRow(requesterName).getByRole('button', { name: 'Reject' }).click();
  }

  async markReturned(requesterName: string): Promise<void> {
    await this.borrowRow(requesterName).getByRole('button', { name: 'Mark returned' }).click();
  }
}
