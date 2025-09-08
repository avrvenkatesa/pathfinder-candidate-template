import { test, expect } from '@playwright/test';

test('GET /health returns { ok: true }', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/health`);
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ ok: true });
});
