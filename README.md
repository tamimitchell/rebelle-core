# @rebelle/core

The contracts repo: data schemas + design tokens + the design-sync pipeline.
Everything that must mean the same thing across site, studio, and the apps.

## What's here

- `src/schemas.ts` — Zod content schemas (Team, Dispatch, DayStanding) and the
  studio's release artifact. Zod is the source of truth: types via `z.infer<>`,
  never separate interfaces.
- `src/story.ts` and `ui/story` — a story: the studio's composed piece for one
  slot on a surface, and the one renderer every surface wears (below).
- `src/positions.ts` — the tracker's public documents as the positions Worker
  writes them (site `ops/cloudflare/positions/`): every team's newest fix,
  every team's trail, one team's day file. `test/fixtures/positions/2024-4/`
  is that Worker's own output for 2024 day 4, fetched, never hand-typed; the
  site keeps byte-identical copies.
- `ds/` — the committed **Claude Design export**: the CSS layer plus the assets
  that CSS references. This is a snapshot of the canonical design system,
  "Rebelle Rally · Field Glass":
  https://claude.ai/design/p/b992548a-8479-40e9-bbce-4bd98128a675?via=share
  Never hand-edit — re-import and replace.
- `voice.md` — how the rally talks: the two voices, the creed, how copy is
  built, what it never writes, display grammar, writing to partners.
  Distilled by hand from the design system's **12 · Voice** cards, whose
  snapshot is `design-sync/12-voice/`. Exported as `@rebelle/core/voice.md`
  for anything that hands a writer or a model the brief.
- `principles.md` — how the rally decides the small calls: the ten laws with
  their litmus, the pre-flight, the three depths, and what the course, the
  competitors and the competition should each feel like. Distilled by hand
  from the design system's **13 · Principles** cards, whose snapshot is
  `design-sync/13-principles/`. Exported as `@rebelle/core/principles.md`
  for anything that hands a builder or a model the brief.
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

## The register

`@rebelle/core/register.json` is generated from `dist/system.css` by
`scripts/build-register.ts` (run by `pnpm build:tokens`): every class the
design system defines and every custom property it sets, with each value. It
is the one list of what a design-system class *is*, for a consumer's lint to
hold its own code against — no consumer parses core's CSS itself.
`@rebelle/core/stylesheet` is the reader that produced it, so a consumer's own
sheets are read the same way. `pnpm test` fails if the committed register lags
the stylesheet.

## Stories

`@rebelle/core/story` owns the story document (studio #275, #283): a headline,
a standfirst, the moment it is a snapshot *as of*, and a telling — an ordered
list of catalog components, each `{component, content}`. v1 has two,
`Paragraph` and `Standings`. A story is data all the way down: no markup, no
styles, no links in prose. `ui/story` is the trusted renderer, React/Preact-
compatible, and inherits its colour from whatever ground the host stands it on;
the host owns position and layout. `ui/story.css` stands on tokens alone, the
`team-results.css` rule, so a story reads the same with or without `system.css`.

A release carries stories as `placements: [{slot, story}]` on
`ReleaseArtifactSchema`; a slot is `surface:name`, one story per slot, and the
artifact's `schema_version` is a literal that bumps whenever its shape does.
`test/fixtures/release-placements.json` is the cross-repo contract: the studio's
build emits it, the site's slot reader parses it, and `pnpm test` pins it here.

Adding a component is a contract change for every renderer and for the studio's
write gate, which mirrors these shapes by hand.

`story-a2ui` and `ui/story-surface` are the story's A2UI face, on the
team-results pattern: one `root` `Story` binding `/storyView`, whose value is
the story document beside where it stands (`draft`, the exploration it is read
through, its `slot` by key and in the studio's own words). A viewer has no actions — approve, publish and send stay
gates in the studio — so the catalog declares none. `pnpm build:catalog`
generates `dist/story-catalog.json` beside the team-results one; both are
linked against the official v0.9.1 schemas by `pnpm test`.

## Composed prose and material (studio #293, quest 1)

`Paragraph` keeps its original literal text. `Prose` adds `{markdown}` with
paragraphs, H3/H4 headings beneath the story's H2 headline, bold, italic, links,
nested ordered/unordered lists and explicit hard breaks. `prose.ts` owns the
markdown-it configuration, internal tree and canonical serializer. Raw HTML
is literal; code, embedded images and blockquotes are not prose nodes. Quotes,
photographs and videos use their own telling entries:

- `Quote`: `{text, attribution}`, both plain text.
- `Figure`: `{image_id, alt, caption?}`, with required descriptive alt text and
  a plain-text caption. Hosts supply image URLs; the site defaults to the
  existing `/images/<id>/960` route. URLs are not authored Figure fields.
- `Video`: `{provider, video_id, title, duration?}` with `provider` `youtube`
  or `hosted` (studio #306). The provider chooses the id's shape — eleven
  letters, digits, underscores or hyphens for YouTube; the studio media file's
  UUID when hosted — and the address template, so `videoUrls` never
  interpolates anything but a validated pair. YouTube: hosts opt into
  embedding with `embedVideos`, and every host keeps a titled watch link.
  Hosted: a `<video>` player at the site's own `/videos/<id>` route with its
  `/poster`, or wherever the host's `videoUrl` points; a host with nowhere to
  point draws a placeholder, as it does for a photograph. `duration` is whole
  seconds. There is no `Film` alias: the studio migrates its stories first.
- `Standings` remains a fixed snapshot with its existing shape.

Link validation allows absolute HTTP(S) and mailto destinations and refuses
credentials, controls, relative addresses and other schemes. The parser also
refuses headings that compete with the host hierarchy. Unsupported imported
WordPress formatting must be reported by the converter before any replacement.
The studio's eight-post source audit documents concrete cases, including missing
alt text, galleries, preformatted text and posts exceeding the story limit.

`pnpm build:catalog` regenerates both catalogs and `dist/prose-validator.mjs`.
Rails invokes this bundled Node 22 validator with one bounded JSON array of
Markdown strings on stdin; stdout is one nullable error per string. It needs no
installed Node dependencies at execution time. The bundle test compares it with
the reader parser. The parser package ships its own TypeScript declarations for consumers.

The release envelope remains version 3: no envelope key or existing component
changes. This additive catalog still requires compatible readers on both site
Workers before publishing new components. Old Paragraph content is never
reinterpreted. Studio stories stamp payload schema 2 for the expanded catalog.

## Operational dispatches

`dispatch` owns the schema-2 dispatch/feed contract moved from the Live page;
`ui/dispatch` and `ui/dispatch.css` own its reader and sponsor badges. These are
operational records, separate from story/post tellings. The Studio writer
fixture is copied into `test/fixtures/dispatches.json` for the shared contract.
Import `system.css` as well as the dispatch stylesheet for chips/cards.

`parseDispatchDraft` fills omitted nullable fields at the preview boundary;
the public feed remains strict. Keep authored payloads unchanged when saving.
Hosts own panel/team navigation, opening photos, recap jumps and story expansion.
A private preview supplies `photoUrl`; returning null shows the credit with an
unavailable state and never falls back to fetching the stored URL. Failed image
loads use the same state. Authorship is validated as data and never rendered.

A dispatch's `sponsor` is the studio's sponsor **key** (`SponsorKeySchema`),
never a printed name. A host holding the roster — the rally days document
embeds each day's presenting sponsors as `SponsorSchema` rows — supplies
`sponsorFor`, and the chip wears the row's name and the lockup its
`lockup_key` names; without one, the key draws a lockup of its own name from
`SPONSOR_LOCKUPS` or its words in a plain chip. Every `source: sponsor`
dispatch is a partner card, tinted by its brand when one is drawn and neutral
otherwise (studio #306 quest 3).

The shared row shows quote attribution, recap labels, video title/duration and
an explicit placeholder for an unassigned clip. A YouTube clip has a watch link;
hosted playback and delivery of a referenced story remain consumer integration
work. The story action enables only when its host supplies an approved story.
Studio expands that story with the existing `StoryView`, at its known version.
