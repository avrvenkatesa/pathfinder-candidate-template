import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.ts'],
    exclude: [
      'tests/e2e/**',
      '**/*.e2e.spec.ts',
      '**/*.e2e.test.ts',
      'node_modules/**',
      'dist/**',
      '.git/**',
      '.github/**'
    ],
    environment: 'node',
    globals: true   // <-- enable describe/it/expect globals
  }
});
