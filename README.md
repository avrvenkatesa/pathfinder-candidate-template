# Pathfinder Candidate Template

[![CI](https://github.com/avrvenkatesa/pathfinder-candidate-template/actions/workflows/ci.yml/badge.svg)](https://github.com/avrvenkatesa/pathfinder-candidate-template/actions/workflows/ci.yml)

This repository is a **minimal Node/Express + Vitest + Playwright** template, set up as a GitHub template repo.  
It’s intended for candidate coding tasks or as a lightweight starting point for new projects.

---

## Features

- **Express app** with `/health` endpoint
- **Vitest unit tests** (runs in CI)
- **Playwright end-to-end tests** (runs in CI, boots API on port 4000)
- **GitHub Actions CI** workflow:
  - `unit` job → runs Vitest
  - `e2e` job → runs Playwright
- **Branch protection rules**:
  - Require PRs before merging
  - Require status checks `CI / unit` and `CI / e2e`
- Configured for both **local dev** and **CI/CD**

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Install dependencies
```bash
npm ci

Run the API locally
npm run dev:api


This will start the Express server on http://localhost:4000
.

Running Tests
Run unit tests
npm test


Vitest will run specs under tests/api/ (and similar), excluding tests/e2e.

Run end-to-end tests
npm run test:e2e


Playwright will:

Start the API on port 4000

Wait for /health to respond

Run tests in tests/e2e/*.e2e.spec.ts

Project Layout
.github/workflows/ci.yml      # CI workflow (unit + e2e jobs)
server/app.ts                 # Express app definition
server/index.ts               # Entry point (boots Express on PORT)
tests/api/health.spec.ts      # Example Vitest unit test
tests/e2e/health.e2e.spec.ts  # Example Playwright e2e test
vitest.config.ts              # Vitest config (excludes e2e)
playwright.config.ts          # Playwright config (uses webServer)

Development Notes

Vitest config (vitest.config.ts) excludes tests/e2e/** so unit tests and e2e tests stay separate.

Playwright config boots the API using npm run dev:api and waits for /health to return 200 OK.

CI job names (unit, e2e) are stable, so branch protection can enforce them.

Next Steps

Add middleware + tests for ETag / If-Match preconditions (HTTP 412/428).

Extend CI with those new tests.

Use this template as a baseline for coding tasks and project scaffolding.

## Candidate Task — Preconditions & Concurrency

### Objective
Implement optimistic concurrency on a demo resource using HTTP preconditions and ETags, with unit and E2E tests enforced by CI.

### Starting Point
- Express app with `/health`, `/item` demo, and robust ETag middleware.
- Unit tests (Vitest + Supertest) and E2E tests (Playwright) scaffolded.
- CI + branch protection require green checks.

### Requirements
1. Extend `/item` to support:
   - `If-None-Match` on `GET /item` → return `304` when tag matches.
   - `DELETE /item` that requires `If-Match` (428/412 rules apply).
2. Add **at least 2** new unit tests and **1** E2E test covering these flows.
3. All tests must pass locally and in CI.

### Constraints
- Strong ETags (quoted) for matching; treat weak tags as equivalent when provided.
- No DB needed (in-memory OK), but structure code so an async tag supplier would work.

### Acceptance Criteria
- `GET /item` returns `304` when `If-None-Match` equals current ETag.
- `DELETE /item` returns:
  - 428 when `If-Match` missing
  - 412 when tag stale
  - 200 when tag matches (and bumps version or recreates item on next GET)
- Tests: passing locally (`npm run test:all`) and in PR CI.

### How to run
```bash
npm run test:api
npm run test:e2e
Evaluation Rubric
Correct HTTP semantics (428/412/304/200): 40%

Test quality and coverage: 30%

Code clarity and extensibility (async-ready, clean middleware): 20%

Git hygiene (small commits, clear messages): 10%