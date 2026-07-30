# @rebelle/core

The contracts repo: data schemas + design tokens + the design-sync pipeline.
Everything that must mean the same thing across site, studio, and the apps.

## What's here

- `src/schemas.ts` — Zod content schemas (Team, Dispatch, DayStanding). Zod is the
  source of truth: types via `z.infer<>`, never separate interfaces.
- `ds/` — the committed **Claude Design export** (tokens + component bundle).
  This is a snapshot of the canonical design system:
  https://claude.ai/design/p/4a29d0b6-616d-4dab-81e1-e7917a18c636?via=share
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
