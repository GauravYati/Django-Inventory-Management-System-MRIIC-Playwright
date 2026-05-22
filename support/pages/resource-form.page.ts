import { TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { djangoProjectDir } from '../django';
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

  async createResource(resource: ResourceInput, testInfo: TestInfo): Promise<void> {
    await this.page.getByLabel('Resource name').fill(resource.name);
    await this.page.getByLabel('Categories').selectOption({ label: resource.category });
    await this.page.getByLabel('Resource image').setInputFiles(await createPngFixture(testInfo));
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

async function createPngFixture(testInfo: TestInfo): Promise<string> {
  const pngPath = testInfo.outputPath(`resource-${Date.now()}.png`);
  const sourceImage = path.join(djangoProjectDir, 'mriic', 'static', 'mriic', 'logo2.png');
  fs.copyFileSync(sourceImage, pngPath);
  return pngPath;
}
