import { defineConfig, devices } from '@playwright/test';
import flags from './config/feature-flags';

export default defineConfig({
  testDir: 'tests',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'artifacts/report', open: 'never' }],
  ],
  retries: 0,
  outputDir: 'artifacts/test-results',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(flags.includeMobile ? [{ name: 'mobile-chrome', use: { ...devices['Pixel 7'] } }] : []),
  ],
  use: {
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'off',
  },
});

