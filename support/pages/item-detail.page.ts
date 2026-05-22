import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { InventoryCatalogPage } from './inventory-catalog.page';

export type BorrowRequestInput = {
  name: string;
  email: string;
  quantity: number;
  purpose: string;
};

export class ItemDetailPage extends BasePage {
  async gotoFromCatalog(itemName: string): Promise<void> {
    const catalog = new InventoryCatalogPage(this.page);
    await catalog.searchForItem(itemName);
    await catalog.openDetails(itemName);
    await this.expectLoaded(itemName);
  }

  async expectLoaded(itemName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: itemName })).toBeVisible();
  }

  async expectBorrowFormVisible(): Promise<void> {
    await expect(this.page.getByText('Quantity available')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Borrow this resource' })).toBeVisible();
  }

  async submitBorrowRequest(request: BorrowRequestInput): Promise<void> {
    await this.page.getByLabel('Name').fill(request.name);
    await this.page.getByLabel('Email').fill(request.email);
    await this.page.getByLabel('Quantity').fill(String(request.quantity));
    await this.page.getByLabel('Purpose').fill(request.purpose);
    await this.page.getByRole('button', { name: /Submit request/i }).click();
  }
}
