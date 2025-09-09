import express, { type Request, type Response, type NextFunction } from "express";

export const app = express();
app.use(express.json());

// Request log (helps see if /health is reached)
app.use((req, _res, next) => {
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

// --- Health endpoint (what Playwright waits on) ---
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// --- Demo item routes (optional; your tests use these) ---
type Item = { id: string; value: string; version: number };
let item: Item = { id: "item-1", value: "hello", version: 1 };
export function __resetDemoItem() {
  item = { id: "item-1", value: "hello", version: 1 };
}
const etagFromVersion = (v: number) => `"${v}"`;
const currentTag = () => etagFromVersion(item.version);

function normalizeStrongETag(tag: string): string {
  const t = tag.trim().replace(/^W\//, "");
  return /^".*"$/.test(t) ? t : `"${t.replace(/^"+|"+$/g, "")}"`;
}
function parseIfMatchHeader(h?: string | null): { star: boolean; tags: string[] } {
  if (!h) return { star: false, tags: [] };
  const raw = h.trim();
  if (raw === "*") return { star: true, tags: [] };
  return { star: false, tags: raw.split(",").map(s => normalizeStrongETag(s)) };
}

app.get("/item", (_req, res) => {
  res.set("ETag", currentTag());
  res.json({ id: item.id, value: item.value, version: item.version });
});

app.put("/item", (req, res, next) => {
  const parsed = parseIfMatchHeader(req.header("if-match"));
  if (!req.header("if-match") || (!parsed.star && parsed.tags.length === 0)) {
    return res.status(428).json({ error: "precondition_required", message: "If-Match header is required for this operation" });
  }
  (res.locals as any).ifMatch = parsed;
  next();
}, (req, res, next) => {
  const provided = (res.locals as any).ifMatch as ReturnType<typeof parseIfMatchHeader>;
  if (provided.star) return next();
  const expected = normalizeStrongETag(currentTag());
  const ok = provided.tags.some(t => normalizeStrongETag(t) === expected);
  if (!ok) {
    return res.status(412).json({ error: "precondition_failed", message: "If-Match does not match the current representation" });
  }
  next();
}, (req, res) => {
  if (typeof req.body?.value === "string") item.value = req.body.value;
  item.version += 1;
  res.set("ETag", currentTag());
  res.status(200).json({ ok: true, version: item.version });
});

// 404 handler so curl doesn’t see an empty socket close
app.use((req, res) => {
  res.status(404).json({ error: "not_found", path: req.url });
});

// Central error handler to avoid empty replies on exceptions
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err);
  if (res.headersSent) return;
  res.status(500).json({ error: "internal_error" });
});
