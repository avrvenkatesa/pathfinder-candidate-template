// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,            // provide describe/it/expect as globals
    environment: "node",      // default, but explicit is nice
    include: ["tests/**/*.spec.ts"]
  }
});
