import { defineConfig, devices } from '@playwright/test';
import { getRuntimeConfig } from './support/config/env';

const { repoRoot, djangoProjectDir, pythonPath, baseURL } = getRuntimeConfig();

export default defineConfig({
  testDir: './tests',
  timeout: 75_000,
  expect: {
    timeout: 8_000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  metadata: {
    repoRoot,
    djangoProjectDir,
    pythonPath
  },
  webServer: {
    command: `"${pythonPath}" manage.py runserver 127.0.0.1:8000`,
    cwd: djangoProjectDir,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
