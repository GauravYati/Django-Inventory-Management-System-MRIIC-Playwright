import { expect } from '@playwright/test';
import { staffUser } from '../django';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/admin-login/');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Staff Login' })).toBeVisible();
  }

  async login(username = staffUser.username, password = staffUser.password): Promise<void> {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async loginAsStaff(): Promise<void> {
    await this.goto();
    await this.login();
    await expect(this.nav).toContainText('Manage');
  }
}
