import { defineConfig } from "@playwright/test";

// Keep HOST/PORT in one place and reuse for baseURL + webServer
const HOST = process.env.HOST ?? "127.0.0.1"; // Playwright reaches this host
const PORT = Number(process.env.PORT ?? 4000);
const BASE_URL = process.env.PW_BASE_URL ?? `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: BASE_URL,
  },
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  webServer: {
    // Start the API for E2E; use env so this works cross-platform (Windows-safe)
    command: "npm run dev:api",
    url: `${BASE_URL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      HOST,              // passed to server/index.ts
      PORT: String(PORT) // passed to server/index.ts
    }
  }
});
