import { z } from 'zod';

/**
 * ── SCORING API: `api/v1/results.php` IS THE CONTRACT ─────────────────────
 *
 * Measured against live production 2026-08-01. Every shape below was derived
 * from real responses (496 rows across 12 probe combinations), not from docs.
 *
 * ⚠️ Do not model `api/standings.php` or `api/daily_scores.php` here. They still
 * respond, and they are tempting because they need no params — but they are the
 * thinner overlay-era endpoints, they ignore `?rally=`/`?day=`, and they serve
 * **rid=10 (2024) hardcoded mock data**. v1 takes a real `Year` and is what both
 * production consumers ship against: the broadcast overlay
 * (`overlay/src/services/apiClient.ts`, a full season in production) and the
 * site (`site/src/components/Standings.tsx`). See `site/AGENTS.md` § "Scoring
 * API — use v1".
 *
 * Re-measure with:
 *   curl -s 'https://scoring.rebellerally.com/api/v1/results.php?Page=Standings&View=overall&Year=2025&Class=4x4&Group=A'
 */

/**
 * The vehicle class, spelled as the API *responds*. Send `X-Over`, get back
 * `X-Cross` — v1 normalises on the way out, and `X-Cross` is also what the
 * overlay has always used internally. So mirroring the wire and matching the
 * existing consumer are the same choice here; take it.
 *
 * (The legacy mock endpoints say `"4 Wheel Drive"`/`"Crossover"` instead. That
 * spelling exists nowhere in v1 and should not leak into the ecosystem.)
 */
export const VehicleClassSchema = z.enum(['4x4', 'X-Cross']);
export type VehicleClass = z.infer<typeof VehicleClassSchema>;

/**
 * Request-side class mapping — the single nastiest footgun in this API, and
 * currently duplicated in both consumers.
 *
 * `X-Cross` must go out as `Class=X-Over&Group=C`. Not `X-Cross`. Sending an
 * unrecognised `Class` does not error: v1 silently falls back to 4x4 and still
 * returns `success: true` with 60 rows, so a typo here reads downstream as
 * "the X-Cross field is tiny this year" rather than as a bug.
 */
export const REQUEST_CLASS_PARAMS = {
  '4x4': { Class: '4x4', Group: 'A' },
  'X-Cross': { Class: 'X-Over', Group: 'C' },
} as const satisfies Record<VehicleClass, { Class: string; Group: string }>;

/**
 * One row of `data`. Field presence is conditional on the page/view you asked
 * for, which is why the optionals below are `.optional()` and not `.nullable()`
 * — absent keys, not null values.
 *
 * Measured presence (496 rows):
 *   always        position, teamNumber, driver, coDriver, vehicle, vehicleYear,
 *                 points, completion
 *   Standings only  vehicleMake        (absent on every Day page)
 *   Day + pennzoil/scorpion  vehicleClass  (absent on Standings overall/rookie)
 *   Day only      dayMaxPoints
 *   rookie only   isRookie             (and only ever `true`)
 *
 * Note the site's local copy of this shape requires `vehicleMake`; that holds
 * for the Standings page it currently fetches, but would throw on any Day page.
 */
export const ResultRowSchema = z.object({
  /** 1-based, contiguous within the returned set. */
  position: z.number().int().positive(),
  /** A numeric **string** on v1 (`"129"`). The legacy endpoints send a number. */
  teamNumber: z.string(),
  /** Last name only. The API's `coDriver` is what the rally calls the navigator. */
  driver: z.string(),
  coDriver: z.string(),
  /** Make + model, no year: `"Jeep Gladiator"`. */
  vehicle: z.string(),
  /** 4-digit year as a string: `"2025"`. Observed range 1991–2025. */
  vehicleYear: z.string(),
  /**
   * On a Standings page: points accumulated so far (cumulative).
   * On a Day page: points scored *that day*.
   */
  points: z.number().int(),
  /** Percentage, already 0–100 — do not multiply. */
  completion: z.number().int(),

  /** Standings pages only. Year-prefixed: `"2025 Jeep Gladiator"`. */
  vehicleMake: z.string().optional(),
  /**
   * Present on Day pages and the pennzoil/scorpion views — i.e. exactly where a
   * row's class is *not* implied by the query, because those result sets are
   * mixed (see the `class` note on the envelope). Absent on Standings
   * overall, where every row is already the class you asked for.
   *
   * Exception: the `rookie` view is mixed too but omits it, so there is no way
   * to tell a rookie row's class from the row itself.
   */
  vehicleClass: VehicleClassSchema.optional(),
  /** Day pages only: the best score achievable that day. `0` for unrun days. */
  dayMaxPoints: z.number().int().optional(),
  /** `rookie` view only, where it is always `true`. Absent elsewhere. */
  isRookie: z.boolean().optional(),
});
export type ResultRow = z.infer<typeof ResultRowSchema>;

/** A Standings-page row: `vehicleMake` is guaranteed present here. */
export const StandingsRowSchema = ResultRowSchema.required({ vehicleMake: true });
export type StandingsRow = z.infer<typeof StandingsRowSchema>;

/** A Day-page row: `vehicleClass` and `dayMaxPoints` are guaranteed present. */
export const DayResultRowSchema = ResultRowSchema.required({
  vehicleClass: true,
  dayMaxPoints: true,
});
export type DayResultRow = z.infer<typeof DayResultRowSchema>;

/**
 * The response envelope.
 *
 * Two behaviours worth knowing before you trust a green parse:
 *
 * 1. `success` can be `false` on HTTP 200 — check the body, not just `res.ok`.
 * 2. Out-of-range input does not error. `Page=Bogus` returns `success: true`
 *    with an empty `data`; a `Day` past the end of the rally returns a *full*
 *    table with every `points`, `completion` and `dayMaxPoints` at `0`. A day
 *    that has not happened is therefore indistinguishable from a day nobody
 *    scored, except by that all-zero signature.
 *
 *    And the valid range is per-year — 2024 ran days 0–7, 2025 ran days 0–8 —
 *    with **no way to discover it from v1**, whose envelope carries no rally
 *    length. Either pin it per year or read `rally.totalDays` off the legacy
 *    `standings.php?rid=` (rid 10 = 2024/7, rid 11 = 2025/8), which is the one
 *    thing that endpoint is still good for.
 *
 *    Day 0 is real everywhere but scores almost nothing (basecamp/prologue:
 *    `points` ≤ 20, `dayMaxPoints` 0) — don't mistake it for an unrun day.
 *
 * 3. `Year=2026` fails with an HTTP 500 rather than an empty result; 2026 is
 *    simply not loaded yet (the legacy endpoint agrees — `rid=12` returns a
 *    rally with `year: null` and no teams).
 */
export const ResultsResponseSchema = z.object({
  success: z.boolean(),
  /** Echoed verbatim, including unrecognised values — so not an enum. */
  page: z.string(),
  /** Also echoed verbatim (`View=garbage` comes back as `"garbage"`). */
  view: z.string(),
  /**
   * Unlike page/view, this one **is** normalised: `X-Over` → `X-Cross`, and an
   * unrecognised `Class` comes back as `4x4`.
   *
   * ⚠️ Do not trust it as a description of `data`. The `pennzoil`, `scorpion`
   * and `rookie` views ignore `Class` altogether and return the same mixed-class
   * leaderboard either way — but still echo whichever class you asked for. Label
   * a challenge view by its `view`, never by `class`, or you will render a
   * cross-class table captioned "X-Cross".
   */
  class: VehicleClassSchema,
  year: z.number().int(),
  data: z.array(ResultRowSchema),
  /** ISO 8601 with offset: `"2026-08-01T20:59:47+00:00"`. */
  lastUpdate: z.string().datetime({ offset: true }),
  /** Day pages only. Day 0 is real (basecamp/prologue) — do not assume ≥ 1. */
  day: z.number().int().min(0).optional(),
  /** Day pages only: the `Group` param echoed back (`"A"` / `"C"`). */
  group: z.string().optional(),
});
export type ResultsResponse = z.infer<typeof ResultsResponseSchema>;

/**
 * `Page=Standings` — rows carry `vehicleMake`. Parse with this rather than the
 * base envelope when you render vehicle text, so a drifted response fails at the
 * boundary instead of rendering a blank column.
 */
export const StandingsResponseSchema = ResultsResponseSchema.extend({
  data: z.array(StandingsRowSchema),
});
export type StandingsResponse = z.infer<typeof StandingsResponseSchema>;

/** `Page=Day&Day=N` — `day`, `group` and the day-only row fields are present. */
export const DayResultsResponseSchema = ResultsResponseSchema.required({
  day: true,
  group: true,
}).extend({ data: z.array(DayResultRowSchema) });
export type DayResultsResponse = z.infer<typeof DayResultsResponseSchema>;

/**
 * ⚠️ There is no rank-delta on the wire, and it cannot be read from a Day page.
 *
 * A Day page's `position` ranks teams by *that day's* points, not by their
 * standing in the rally — so differencing consecutive Day pages gives you the
 * change in daily performance, not movement up or down the leaderboard. Real
 * rank movement needs the cumulative standings as of each day, which v1 does not
 * expose. Compute it by snapshotting `Page=Standings` daily and diffing, and
 * keep it out of this file: it is derived state, not contract.
 */

// ── Content shapes (Sanity-authored, not from the scoring API) ───────────────

export const TeamSchema = z.object({
  number: z.number().int().positive(),
  name: z.string(),
  /**
   * Matches the scoring API's response spelling so the two sides join without a
   * translation table. Was `'x-cross'`; the wire and the overlay both say
   * `'X-Cross'`.
   */
  vehicleClass: VehicleClassSchema,
  /**
   * Our `navigator` is the API's `coDriver` — same person, two names. Map at the
   * boundary if you join these to `ResultRow`.
   */
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.enum(['driver', 'navigator']),
      }),
    )
    .length(2),
  slug: z.string(),
});
export type Team = z.infer<typeof TeamSchema>;

export const DispatchSchema = z.object({
  id: z.string(),
  day: z.number().int().min(0),
  publishedAt: z.string().datetime(),
  author: z.string(),
  body: z.string(),
  teamNumbers: z.array(z.number().int().positive()).default([]),
  mediaRefs: z.array(z.string()).default([]),
});
export type Dispatch = z.infer<typeof DispatchSchema>;

// ── Studio release artifact ────────────────────────────────────────────────

// The studio writes the artifact; every reader takes this shape from core so a
// new section kind is a deliberate cross-repo contract change rather than an
// untyped surprise at the site's network boundary.
export const SectionModeSchema = z.enum(['pre-rally', 'live', 'post-rally']);
export type SectionMode = z.infer<typeof SectionModeSchema>;

export const CraftedSectionSchema = z
  .object({
    type: z.literal('crafted'),
    modes: z.array(SectionModeSchema).min(1),
    content: z
      .object({
        format: z.literal('html'),
        html: z.string().min(1),
        source_note: z.string().min(1).optional(),
      })
      .strict(),
  })
  .strict();
export type CraftedSection = z.infer<typeof CraftedSectionSchema>;

// These shapes predate crafted fragments. Keep them parseable while existing
// releases remain current, but do not give the site a second renderer for
// them: only `crafted` becomes a home-page surface.
export const LegacySectionTypeSchema = z.enum([
  'hero-live',
  'hero-countdown',
  'basics',
  'follow-the-field-standings',
  'follow-the-field-spotlight',
  'quote',
  'register-bar',
  'from-the-field',
  'train-and-impact',
  'partners',
  'newsletter',
]);

export const LegacySectionSchema = z
  .object({
    type: LegacySectionTypeSchema,
    modes: z.array(SectionModeSchema).min(1),
    content: z.record(z.unknown()),
  })
  .strict();

export const ReleaseSectionSchema = z.discriminatedUnion('type', [
  CraftedSectionSchema,
  LegacySectionSchema,
]);
export type ReleaseSection = z.infer<typeof ReleaseSectionSchema>;

export const ReleasePageSchema = z
  .object({
    page: z
      .object({
        slug: z.string().min(1),
        title: z.string().min(1),
        mode: SectionModeSchema,
      })
      .strict(),
    sections: z.array(ReleaseSectionSchema),
  })
  .strict();
export type ReleasePage = z.infer<typeof ReleasePageSchema>;

export const ReleaseArtifactSchema = z
  .object({
    schema_version: z.string().min(1),
    release_id: z.string().uuid(),
    channel_key: z.string().min(1),
    built_at: z.string().datetime({ offset: true }),
    pages: z.array(ReleasePageSchema),
  })
  .strict();
export type ReleaseArtifact = z.infer<typeof ReleaseArtifactSchema>;

// The first fast-lane contract. It is intentionally separate from a release
// artifact: a post can reach a standing rail without freezing or publishing a
// page, and a consumer must reject a record-contract drift rather than render
// only whichever fields it happens to use.
const CalendarDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')
  .refine((value) => new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value, {
    message: 'must be a real calendar day',
  });

const PostLinkSchema = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0;
  }, 'must be an absolute http(s) URL');

export const PostPayloadSchema = z
  .object({
    kind: z.enum(['dispatch', 'news']),
    date: CalendarDateSchema,
    category: z.string().min(1),
    headline: z.string().min(1),
    dek: z.string().min(1),
    body: z.string().min(1).nullable(),
    link: PostLinkSchema.nullable(),
  })
  .strict()
  .superRefine((post, context) => {
    if (post.kind === 'news' && post.link === null) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['link'], message: 'news needs a link' });
    }
    if (post.kind === 'dispatch' && post.link !== null) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['link'], message: 'dispatch has no link' });
    }
  });
export type PostPayload = z.infer<typeof PostPayloadSchema>;

export const PostsFeedRecordSchema = z
  .object({
    id: z.string().uuid(),
    version_id: z.string().uuid(),
    schema_version: z.literal('2'),
    payload: PostPayloadSchema,
  })
  .strict();
export type PostsFeedRecord = z.infer<typeof PostsFeedRecordSchema>;

export const PostsFeedDocumentSchema = z
  .object({
    contract_version: z.literal('1'),
    feed_key: z.literal('system.posts'),
    record_type_key: z.literal('system.post'),
    record_schema_version: z.literal('2'),
    sent_at: z.string().datetime({ offset: true }),
    records: z.array(PostsFeedRecordSchema),
  })
  .strict();
export type PostsFeedDocument = z.infer<typeof PostsFeedDocumentSchema>;
