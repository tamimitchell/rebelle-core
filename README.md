# @rebelle/core

The contracts repo: data schemas + design tokens + the design-sync pipeline.
Everything that must mean the same thing across site, studio, and the apps.

## What's here

- `src/schemas.ts` — Zod content schemas (Team, Dispatch, DayStanding). Zod is the
  source of truth: types via `z.infer<>`, never separate interfaces.
- `ds/` — the committed **Claude Design export**: the CSS layer plus the assets
  that CSS references. This is a snapshot of the canonical design system,
  "Rebelle Rally · Field Glass":
  https://claude.ai/design/p/b992548a-8479-40e9-bbce-4bd98128a675?via=share
  Never hand-edit — re-import and replace.
- `dist/` — generated outputs, committed so consumers need no build step:
  `tokens.css` (site/studio) and `RebelleTokens.swift` (ios-app).
- `scripts/build-tokens.mjs` — the codegen. Run `pnpm build:tokens` after any
  `ds/` re-import.
- `design-sync/` — the import pipeline conventions.

## Consuming

Web (site/studio):

```jsonc
// package.json — private repo, so git auth is needed: run `gh auth setup-git` once
"dependencies": { "@rebelle/core": "github:tamimitchell/rebelle-core" }
```

iOS: drop `dist/RebelleTokens.swift` into the Xcode project for now; a proper
`Package.swift` (SwiftPM) gets added when ios-app starts. Android: a Compose
color output gets added to the codegen when android-app starts.

## Shared team results

`@rebelle/core/team-results` owns the validated view model. `ui/team-results`
provides its React/Preact-compatible presentation without fetching or authority.
`team-results-a2ui` and `ui/team-results-surface` implement a deliberately bounded
[A2UI v0.9.1](https://a2ui.org/specification/v0.9.1-a2ui/) catalog: one `root`
`TeamResults`, binding `/teamResults`, whole-value data updates, and `select_day`.
The component emits the selected year/team/day as action context. Hosts validate
that action and resolve the data source; generated UI cannot name a URL or tool.
This is not a general basic-catalog renderer or an agent inference service.

Public adapters supply only delivered records (`published` or historical `replay`).
Studio supplies `studio` evidence, including the saved record and revision. Each
host must reject the other source kind. The source label never means a saved
Studio score has been published. Day points are the supplied official total;
checkpoint totals do not reconstruct penalties or sporting decisions.

`pnpm build:catalog` generates `dist/team-results-catalog.json` from the same Zod
validators. Commit the generated catalog with contract changes. `pnpm test`
checks lifecycle, validation, cutoff and scoring semantics. New catalog semantics
require a new catalog ID. The optional React peer is needed only by UI consumers;
Preact consumers use their normal React compatibility alias.
