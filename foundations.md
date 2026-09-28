# Rebelle Rally — foundations

The visual foundations in words, distilled from the **01 · Grounds**,
**10 · Color** and **11 · Type** cards of the Field Glass design system (Claude
Design project `b992548a…`, snapshots in
[`design-sync/01-grounds/`](design-sync/01-grounds/),
[`design-sync/10-color/`](design-sync/10-color/) and
[`design-sync/11-type/`](design-sync/11-type/)). `ds/` and `dist/system.css`
are these decisions as CSS; this is the same decisions for a reader, each with
the token that carries it. Each ground's full contract is its own `ds/`
section, 02 to 07. What is official and what is derived is
[`canon.md`](canon.md).

## Grounds, not backgrounds

A section never picks a background colour; it changes ground.

| Ground | What it is |
|---|---|
| **Navy Ground** | The default: the desert at dusk. Gradients run darker — never flat, never cold black. |
| **Photo Ground** | Full-bleed photography under a directional scrim; it may deepen into Navy. The photograph keeps at least 60% clear. |
| **Field Glass** | The instrument layer floating over content — never the content itself. |
| **Terrain Paper** | The field notebook: warm uncoated stock with tooth, navy ink, cyan as precise annotation. Never glassy. |
| **Roadbook Paper** ✅ | The working page, adopted and shipping in the live scoring tool: cool white, dense tabular data, hairline rules. |
| **Broadcast On-Air** | The origin: slightly transparent panels (about 80%), never blurred, a deep-inset ring. Red means on-air here and nowhere else. |

## The laws that cross all of them

These always win, on every channel and every ground.

| # | Law | |
|---|---|---|
| 01 | **One earned cyan per band** | Cyan means live, active, you, focus. Spend it, don't spray it. |
| 02 | **Sponsor colour is lockup-only** | Contained in the badge; never recolour the wordmark or the navy frame. |
| 03 | **Hard cuts between grounds** | Paint changes on a clean seam. The one sanctioned dissolve: photography may fall into a ground. |
| 04 | **Linework is the texture** | Topo contours, waves, isolines, compass star, survey ticks — quiet, in each ground's own ink. Never the signal. |
| 05 | **Legibility is the hard floor** | Contrast of at least 4.5:1 after every blur, scrim and texture. Desert sun is the accessibility spec. |
| 06 | **Lineage flows one way** | Broadcast → Field Glass. Glass and blur never backport onto the air. |

## Colour

**Four are official ◆**, Pantone-specified: navy `--navy` `#0D213D` (Pantone
289 C), cyan `--cyan` `#189FDA` (Pantone 299 C), white `--white` (the ink on
every dark ground) and black `--black` (reproduction only, never a ground).
Everything past those four is derived 🟡 and carries its mark.

- **The warm desert family 🟡** — one ramp, bone to umber (`--desert-bone`,
  `--desert-sand` the Terrain sheet, `--desert-dune` the accent,
  `--desert-rock`, `--desert-taupe`, `--desert-ink`, `--desert-umber`).
  **Cyan reports, warm tells:** a band picks one accent and holds it. Cyan is
  live, measured, instrument; warm is story, people, history. Only two steps
  set type: `--desert-dune` on dark and `--desert-ink` on sand, through
  `--label-tan-on-dark` and `--label-brown-on-paper`.
- **Five coloured states, and five is the ceiling 🟡:** selected
  (`--selected-wash`), live (`--cyan-shield`), cleared (`--gain`), penalty
  (`--loss`), caution (`--caution`). Stale is deliberately colourless.
- **Two reds, and they are not interchangeable.** `--delta-down` `#DF1F26` is
  the shipped ▼ mark; `--loss` `#C9262C` is deeper, for fills. And `--on-air`
  `#FF0000` means *we are on air* — it appears nowhere off the broadcast.
- **The interaction ramp:** hover lifts on dark grounds and deepens on paper;
  press always deepens (`--cyan-lift` · `--cyan-press`, `--navy-lift` ·
  `--navy-press`, `--loss-lift` · `--loss-press`).

**Two ink registers, not six palettes.** Every dark ground (Navy, Photo, Field
Glass) shares one ink and every paper ground (Terrain, Roadbook) shares the
other, so a colour is chosen by register, not by ground:

| Job | Dark grounds | Paper grounds |
|---|---|---|
| Body text | `--white` | `--ink` |
| Label | `--label-on-dark` | `--label-on-paper` |
| The accent | `--cyan-shield` | `--label-cyan-on-paper` |
| Warm alternative | `--label-tan-on-dark` | `--label-brown-on-paper` |
| Rule hairline | `--hairline-inverse` | `--hairline` |

Every semantic has a paper twin, and the twin is darker (`--gain-on-paper`,
`--loss-on-paper`, `--caution-on-paper`): on navy the hue is the fill; on paper
it becomes a wash and a dark ink carries the contrast. **On-Air is the
exception, and it subtracts:** no warm accent, no caution, no controls, no
faint labels — the air has one second to be read.

**The label floor.** Faint is a line weight, not a text colour: `--white-faint`
and `--ink-faint` draw rules and ticks, and fail as type. Cyan may mark a label
on paper but never set it (2.4:1 on sand): use `--label-cyan-on-paper`, and
move the cyan to the rule or the dot beside it. De-emphasize by removing the
accent, never by lowering opacity — pending is simply not cyan.

## Type

Four faces, each standing in for something:

| Face | Token | Job |
|---|---|---|
| **Display** — Oswald, standing in for Tungsten (not web licensed) | `--font-display` | Motorsport caps: every heading, label and data figure |
| **Body** — Inter, tabular numerals | `--font-body` | All reading copy, interface and long-form alike. Never uppercase, never tracked. |
| **Wordmark serif** — Cormorant Garamond | `--font-wordmark` | The editorial echo of the mark, in the quote band only: a whole band with air on all four sides, at most once per page, never UI. |
| **Mono** — IBM Plex Mono, 400 only | `--font-mono` | Instrument labels and stamps, never sentences |

The usage rules:

1. Oswald is always uppercase, except data figures.
2. Oswald always carries tracking; never 0, except data figures.
3. Inter is never uppercase and never tracked.
4. Articles read at 18px with a line height of 1.7 — never at interface 14px.
5. Every column of digits is tabular.
6. Mono is for labels and stamps, never sentences.
7. Cormorant Garamond at most once per page.
8. Links never set their own font family; they inherit.
9. Display line heights go below 1.0 by design. Don't "fix" them.

Retired: Arimo, Open Sans, Open Sans Condensed and Roboto, and the weights 300
and 700 (both faces top out at 600). Tungsten itself lives in
`--font-broadcast`, for on-air tooling only. The engraved REBELLE wordmark is
logo artwork, never typeset.

## Where the sources differ

- The Four faces and Visual foundations cards give the wordmark serif "pull
  quotes only"; the Quote band card narrows it to a whole band, never a pull
  quote in a column. This file follows the Quote band card, the specific one.
