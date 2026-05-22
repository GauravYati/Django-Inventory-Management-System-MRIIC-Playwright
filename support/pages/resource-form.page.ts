import path from 'path';
import { BasePage } from './base.page';

export type ResourceInput = {
  name: string;
  category: string;
  quantity: number;
  featured: boolean;
  description: string;
  tags: string;
};

export class ResourceFormPage extends BasePage {
  async addCategory(categoryName: string): Promise<void> {
    await this.page.locator('.category-panel').getByPlaceholder('Category name').fill(categoryName);
    await this.page.locator('.category-panel').getByRole('button', { name: 'Save Category' }).click();
  }

  async createResource(resource: ResourceInput): Promise<void> {
    await this.page.getByLabel('Resource name').fill(resource.name);
    await this.page.getByLabel('Categories').selectOption({ label: resource.category });
    await this.page.getByLabel('Resource image').setInputFiles(resourceImageFixturePath);
    await this.page.getByLabel('Available quantity').fill(String(resource.quantity));
    await this.page.locator('input[name="featured"]').setChecked(resource.featured, { force: true });
    await this.page.getByLabel('Description').fill(resource.description);
    await this.page.getByLabel('Tags').fill(resource.tags);
    await this.page.getByRole('button', { name: 'Add Resource' }).click();
  }

  async updateResource(resource: Pick<ResourceInput, 'quantity' | 'description'>): Promise<void> {
    await this.page.getByLabel('Available quantity').fill(String(resource.quantity));
    await this.page.getByLabel('Description').fill(resource.description);
    await this.page.getByRole('button', { name: 'Save Resource' }).click();
  }
}

export const resourceImageFixturePath = path.resolve(__dirname, '..', '..', 'tests', 'fixtures', 'images', 'hammer.jpg');
