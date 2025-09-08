import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run unit/integration tests under server/** (adjust as you like)
    include: [
      'server/**/*.spec.ts',
      'server/**/*.test.ts'
    ],
    // Make sure Vitest does NOT try to load Playwright tests
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
      'dist/**',
      '.git/**',
      '.github/**'
    ],
    globals: false,
    environment: 'node'
  }
});
