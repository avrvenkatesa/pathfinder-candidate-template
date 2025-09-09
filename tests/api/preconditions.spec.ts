import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app, __resetDemoItem } from "../../server/app.js";

describe("ETag / If-Match preconditions", () => {
  beforeEach(() => {
    __resetDemoItem();
  });

  it("GET /item returns strong ETag", async () => {
    const res = await request(app).get("/item");
    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty("etag");
    const etag = res.headers["etag"];
    expect(/^".+"$/.test(etag)).toBe(true);
  });

  it("PUT /item without If-Match → 428", async () => {
    const res = await request(app).put("/item").send({ value: "x" });
    expect(res.status).toBe(428);
  });

  it("PUT /item with wrong If-Match → 412", async () => {
    const res = await request(app)
      .put("/item")
      .set("If-Match", '"bogus"')
      .send({ value: "x" });
    expect(res.status).toBe(412);
  });

  it('PUT /item with If-Match: * succeeds', async () => {
    const res = await request(app)
      .put("/item")
      .set("If-Match", "*")
      .send({ value: "wildcard" });
    expect(res.status).toBe(200);
  });

  it("PUT /item with list matches any", async () => {
    const g1 = await request(app).get("/item");
    const etag1 = g1.headers["etag"] as string;

    const res = await request(app)
      .put("/item")
      .set("If-Match", `"nope", ${etag1}`)
      .send({ value: "ok" });
    expect(res.status).toBe(200);
  });

  it("PUT /item with weak tag equivalent succeeds", async () => {
    const g = await request(app).get("/item");
    const strong = g.headers["etag"] as string;
    const weak = `W/${strong}`;
    const res = await request(app)
      .put("/item")
      .set("If-Match", weak)
      .send({ value: "updated" });
    expect(res.status).toBe(200);
  });

  it("ETag changes after successful update; stale tag fails later", async () => {
    const g1 = await request(app).get("/item");
    const etag1 = g1.headers["etag"] as string;

    const ok = await request(app)
      .put("/item")
      .set("If-Match", etag1)
      .send({ value: "updated" });
    expect(ok.status).toBe(200);

    const g2 = await request(app).get("/item");
    const etag2 = g2.headers["etag"] as string;
    expect(etag2).not.toBe(etag1);

    const stale = await request(app)
      .put("/item")
      .set("If-Match", etag1)
      .send({ value: "again" });
    expect(stale.status).toBe(412);
  });
});
