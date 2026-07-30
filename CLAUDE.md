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
- Real brand: navy `#0d213d` + cyan `#189fda`; red/gold are sponsor-lockup-only.
