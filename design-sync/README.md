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
