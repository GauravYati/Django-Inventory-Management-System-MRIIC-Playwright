const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const screenshotDir = path.join(rootDir, 'artifacts', 'screenshots');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8000';

fs.mkdirSync(screenshotDir, { recursive: true });

async function capture(page, name) {
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await capture(page, '01-home');

  await page.goto(`${baseURL}/products/`, { waitUntil: 'networkidle' });
  await capture(page, '02-inventory-catalog');

  await page.goto(`${baseURL}/search-inventory/?q=Pw%20oscilloscope`, { waitUntil: 'networkidle' });
  await capture(page, '03-search-results');

  const detailsLink = page.locator('.product-card', { hasText: 'Pw oscilloscope' }).getByRole('link', { name: 'View details' });
  if (await detailsLink.count()) {
    await detailsLink.first().click();
    await page.waitForLoadState('networkidle');
    await capture(page, '04-item-detail');
  }

  await page.goto(`${baseURL}/admin-login/`, { waitUntil: 'networkidle' });
  await capture(page, '05-staff-login');

  await page.getByLabel('Username').fill('pw_staff');
  await page.getByLabel('Password').fill('PwStaffPass123!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');
  await page.goto(`${baseURL}/inventory/`, { waitUntil: 'networkidle' });
  await capture(page, '06-staff-workspace');

  await page.goto(`${baseURL}/add-inventory/`, { waitUntil: 'networkidle' });
  await capture(page, '07-add-resource');

  const reportPath = path.join(rootDir, 'playwright-report', 'index.html');
  if (fs.existsSync(reportPath)) {
    await page.goto(`file://${reportPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
    await capture(page, '08-playwright-html-report');
  }

  await browser.close();
  console.log(`Screenshots saved to ${screenshotDir}`);
})();
