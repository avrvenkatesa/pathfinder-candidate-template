# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-09-08
### Added
- Minimal Express API with `/health` endpoint (`server/app.ts`, `server/index.ts`).
- Vitest unit test harness and example test (`tests/api/health.spec.ts`).
- Playwright E2E harness with webServer startup and example spec (`tests/e2e/health.e2e.spec.ts`).
- GitHub Actions CI workflow with two stable jobs:
  - `unit` (Vitest)
  - `e2e` (Playwright)
- Branch protection (via ruleset or classic) requiring:
  - Pull requests before merging (solo-dev: approvals = 0)
  - Status checks `CI / unit (pull_request)` and `CI / e2e (pull_request)`
- Project README with setup, run, and test instructions and CI status badge.

### Notes
- Playwright runs API at `PORT=4000` via `npm run dev:api` and waits on `/health`.
- Vitest excludes e2e tests via `vitest.config.ts` to avoid runner conflicts.
## [Unreleased]
- feat: ETag/If-Match preconditions with 428/412 handling (unit + e2e)

