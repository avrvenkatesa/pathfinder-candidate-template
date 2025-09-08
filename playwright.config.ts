import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4000',
  },
  webServer: {
    command: 'npm run dev:api',
    url: 'http://localhost:4000/health',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
