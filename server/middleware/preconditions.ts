import type { Request, Response, NextFunction } from "express";

const isWeak = (t: string) => t.startsWith('W/"');
const stripWeak = (t: string) => (isWeak(t) ? t.slice(2) : t);
const isQuoted = (t: string) => /^".*"$/.test(t);
const quote = (s: string) => (isQuoted(s) ? s : `"${s}"`);

export function normalizeStrongETag(tag: string): string {
  const noWeak = stripWeak(tag.trim());
  return quote(noWeak.replace(/^"+|"+$/g, ""));
}

export function parseIfMatchHeader(h?: string | null): { star: boolean; tags: string[] } {
  if (!h) return { star: false, tags: [] };
  const raw = h.trim();
  if (raw === "*") return { star: true, tags: [] };
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return { star: false, tags: parts.map(normalizeStrongETag) };
}

export function setETag(res: Response, tag: string) {
  res.set("ETag", normalizeStrongETag(tag));
}

export function requireIfMatch(req: Request, res: Response, next: NextFunction) {
  const h = req.header("if-match");
  const parsed = parseIfMatchHeader(h);
  if (!h || (!parsed.star && parsed.tags.length === 0)) {
    return res.status(428).json({
      error: "precondition_required",
      message: "If-Match header is required for this operation",
    });
  }
  res.locals.ifMatch = parsed;
  next();
}

export function preconditionMatches(
  currentTag: string | (() => string | Promise<string>)
) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    const provided = res.locals.ifMatch as ReturnType<typeof parseIfMatchHeader>;
    if (provided?.star) return next();
    const expectedRaw = typeof currentTag === "function" ? await currentTag() : currentTag;
    const expected = normalizeStrongETag(expectedRaw);
    const ok = provided.tags.some((t) => normalizeStrongETag(t) === expected);
    if (!ok) {
      return res.status(412).json({
        error: "precondition_failed",
        message: "If-Match does not match the current representation",
      });
    }
    next();
  };
}

export function etagFromVersion(v: number): string {
  return `"${v}"`;
}
