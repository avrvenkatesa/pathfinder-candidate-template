import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Only discover tests in this folder…
  testDir: 'tests/e2e',
  // …and only these files are tests
  testMatch: /.*\.e2e\.spec\.ts$/,

  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4000',
  },

  // Start the API that tests hit
  webServer: {
    command: 'npm run dev:api',                 // this sets PORT=4000
    url: 'http://localhost:4000/health',        // wait for health
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
