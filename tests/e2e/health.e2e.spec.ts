import { test, expect } from '@playwright/test';

test('GET /health returns { ok: true }', async ({ request }) => {
  const res = await request.get('/health'); // baseURL is set in config
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});
