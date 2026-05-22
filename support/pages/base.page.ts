import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get nav() {
    return this.page.locator('nav.app-navbar');
  }

  async searchFromNavbar(query: string): Promise<void> {
    await this.nav.getByRole('searchbox', { name: 'Search inventory' }).fill(query);
    await this.nav.getByRole('button', { name: /Search/i }).click();
  }

  async logout(): Promise<void> {
    await this.nav.getByRole('button', { name: 'Logout' }).click();
  }
}
