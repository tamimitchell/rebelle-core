# design-sync

How design flows from Claude Design into code. This formalizes the loop that
produced the approved Field Glass demo.

## Sources

| Project | URL |
|---|---|
| **Design system (canonical — `ds/` is its export)** | https://claude.ai/design/p/b992548a-8479-40e9-bbce-4bd98128a675?via=share ("Rebelle Rally · Field Glass", the 2026-08 from-scratch rebuild) |
| Old design system (superseded 2026-08-21; `ds/` history ≤462df28 is its export) | https://claude.ai/design/p/4a29d0b6-616d-4dab-81e1-e7917a18c636?via=share |
| Rebelle site design (Home/Team/People pages) | https://claude.ai/design/p/9813cb27-070b-4f63-b438-c993f18f9a29 |
| Rally storytelling experience (Rally Live) | https://claude.ai/design/p/394e50f1-9798-45af-ab07-ff32efc01ba8 |

## The loop

1. Design in Claude Design — the system project holds the shared tokens/components
2. Play/show ideas in `../../prototype/` (the ongoing demo playground, deploys to
   rally-live-prototype.pages.dev)
3. When a surface is approved for build: import via the claude_design MCP
4. Design-system changes → replace `../ds/` with the fresh export →
   `pnpm build:tokens` → commit (every import is a snapshot in git history —
   our local copy of what shipped, since Claude Design is a hosted tool)
5. Surface implementations consume `@rebelle/core` tokens — never re-declare values

## Known import gotchas (from the 2026-07 prototype import)

- The Design API caps file reads at **256 KB** — large images arrive truncated.
  Match them back to full-res originals (filename/EXIF); originals live in
  `../../media/originals/`. Keep filenames identical so `.dc.html` files stay untouched.
- Google Fonts registered by token CSS may need a font-loading shim when deployed
  (see prototype `support.js` tail).
- Full substitution history: `../../prototype/README.md`.

## The voice cards

`12-voice/` is the seven **12 · Voice** cards of the design system, copied verbatim
from the project on 2026-09-11. Cards stay out of `ds/` (the CSS import), so this is
their one committed snapshot; their `../styles.css` link is the project's own layout
and does not resolve here. `../voice.md` is the hand-written distillation consumers
read; when a card changes in the project, replace the snapshot and re-read the
distillation against it.

## The principles cards

`13-principles/` is the three **13 · Principles** cards of the design system,
copied verbatim from the project on 2026-09-21. Same posture as the voice cards:
they stay out of `ds/`, and their `../styles.css` link is the project's own and
does not resolve here. `../principles.md` is the hand-written distillation builders
read — the laws with their litmus, the pre-flight and its test, the three depths,
and the layer Tami set on top; when a card changes in the project, replace the
snapshot and re-read the distillation against it.

## The map sheet cards

`18-map-sheets/` is the three **18 · Map Sheets** cards of the design system, copied
verbatim from the project on 2026-09-16, with `the-thinking.md`, the short write-up of
why the live map is paper, written for Emily. Same posture as the voice cards: they
stay out of `ds/`, and their `../styles.css` and `../assets/maps/` links are the
project's own and do not resolve here. The styles the cards describe are code, not
CSS: `rebelle-site` `src/lib/map-grounds.js` builds Atlas and Terrain Paper from the
tokens at runtime, and the clips carry them written out as JSON.
