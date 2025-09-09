import { test, expect } from "@playwright/test";

test("ETag / If-Match flow", async ({ request, baseURL }) => {
  const r1 = await request.get(`${baseURL}/item`);
  expect(r1.status()).toBe(200);
  const etag1 = r1.headers()["etag"];
  expect(etag1).toBeTruthy();

  const r428 = await request.put(`${baseURL}/item`, { data: { value: "x" } });
  expect(r428.status()).toBe(428);

  const r412 = await request.put(`${baseURL}/item`, {
    headers: { "If-Match": '"nope"' },
    data: { value: "x" },
  });
  expect(r412.status()).toBe(412);

  // wildcard
  const okWildcard = await request.put(`${baseURL}/item`, {
    headers: { "If-Match": "*" },
    data: { value: "wild" },
  });
  expect(okWildcard.status()).toBe(200);

  // weak tag equivalent
  const r2 = await request.get(`${baseURL}/item`);
  const etag2 = r2.headers()["etag"]!;
  const weak = `W/${etag2}`;
  const okWeak = await request.put(`${baseURL}/item`, {
    headers: { "If-Match": weak },
    data: { value: "weak-ok" },
  });
  expect(okWeak.status()).toBe(200);

  // list
  const r3 = await request.get(`${baseURL}/item`);
  const etag3 = r3.headers()["etag"]!;
  const okList = await request.put(`${baseURL}/item`, {
    headers: { "If-Match": `"nope", ${etag3}` },
    data: { value: "list-ok" },
  });
  expect(okList.status()).toBe(200);

  // tag changes each update
  const r4 = await request.get(`${baseURL}/item`);
  const etag4 = r4.headers()["etag"]!;
  expect(etag4).not.toBe(etag2);
});
