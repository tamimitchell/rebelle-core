# CLAUDE.md — @rebelle/core

The contracts repo for the Rebelle ecosystem (see `../README.md` for the umbrella map).

Rules:

- **`ds/` is a generated import** from the canonical Claude Design project
  (b992548a-8479-40e9-bbce-4bd98128a675, "Rebelle Rally · Field Glass" — the
  2026-08 from-scratch rebuild; the old project 4a29d0b6… is superseded) —
  never hand-edit it. Design changes happen in Claude Design, then get
  re-imported (see `design-sync/README.md`). The import is the CSS layer +
  the assets that CSS references; cards, uploads and licensed fonts stay out.
- **`dist/` is generated but committed** (consumers use git deps, no build step).
  After replacing `ds/`: `pnpm build:tokens`, commit both. Two CSS outputs:
  `tokens.css` (brand-wide tokens only) and `system.css` (tokens + the six
  grounds + the `.rr-*` component register + document laws — what a web
  surface imports). ⚠️ The 0.2.0 import renamed the token vocabulary
  (`--rr-*`/`--accent`/`--space-*` → `--navy`/`--cyan`/`--sp-*`…): consumers
  pinned before 462df28 must migrate names when they bump.
- **Schemas are Zod** — types via `z.infer<>`, never separate interfaces.
  Schema changes ripple to site/studio/apps: bump consumers deliberately.
- **The scoring contract is `api/v1/results.php`** — measured, not assumed
  (2026-08-01). `api/standings.php` and `api/daily_scores.php` still respond and
  need no params, which makes them an easy wrong turn: they ignore `?rally=`/
  `?day=`, and serve **rid=10 (2024) hardcoded mock data**. Both production
  consumers — the broadcast overlay and the site — ship against v1. Model v1.
- Real brand: navy `#0d213d` + cyan `#189fda`; red/gold are sponsor-lockup-only.
