# CLAUDE.md — @rebelle/core

The contracts repo for the Rebelle ecosystem (see `../README.md` for the umbrella map).

Rules:

- **`ds/` is a generated import** from the canonical Claude Design project
  (4a29d0b6-616d-4dab-81e1-e7917a18c636) — never hand-edit it. Design changes
  happen in Claude Design, then get re-imported (see `design-sync/README.md`).
- **`dist/` is generated but committed** (consumers use git deps, no build step).
  After replacing `ds/`: `pnpm build:tokens`, commit both.
- **Schemas are Zod** — types via `z.infer<>`, never separate interfaces.
  Schema changes ripple to site/studio/apps: bump consumers deliberately.
- **The scoring contract is `api/v1/results.php`** — measured, not assumed
  (2026-08-01). `api/standings.php` and `api/daily_scores.php` still respond and
  need no params, which makes them an easy wrong turn: they ignore `?rally=`/
  `?day=`, and serve **rid=10 (2024) hardcoded mock data**. Both production
  consumers — the broadcast overlay and the site — ship against v1. Model v1.
- Real brand: navy `#0d213d` + cyan `#189fda`; red/gold are sponsor-lockup-only.
