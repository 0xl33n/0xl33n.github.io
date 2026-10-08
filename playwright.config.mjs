import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the production static export (out/), served the
 * way GitHub Pages serves it. Build first with the same NEXT_PUBLIC_SITE_URL:
 *
 *   npm run build && npm run test:e2e
 */
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4173');
const basePath = siteUrl.pathname.replace(/\/+$/, '');
const baseURL = `http://localhost:4173${basePath}/`;

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/serve-static.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
