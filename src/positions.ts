import { z } from 'zod';

/**
 * The tracker's public documents, as the positions Worker writes them
 * (rebelle-site `ops/cloudflare/positions/`, site Decided #27): every team's
 * newest public fix, every team's public trail, and one team's trail a fix
 * per line. Positions are a firehose, not studio content — nothing here is a
 * Library shape — and the reader is the site's map island (studio #310).
 *
 * ⚠️ No looser than the writer, no stricter: the Worker files a marker as an
 * integer from 1 to 9999, keeps a fix only when its seven numbers are finite
 * and its coordinates are on the planet, and shows no fix after `as_of`.
 * A document carries no team name; the roster joins on the marker.
 */

export const POSITIONS_STATUSES = ['live', 'closed'] as const;
export type PositionsStatus = (typeof POSITIONS_STATUSES)[number];

/** The car number, the team's whole identity on the wire. */
export const MarkerSchema = z.number().int().min(1).max(9999);

const Instant = z.string().datetime();
const Latitude = z.number().min(-90).max(90);
const Longitude = z.number().min(-180).max(180);
const Finite = z.number().finite();

/** The stamp every public document carries; a dot's age is `as_of − at`. */
export const PositionsStampSchema = z
  .object({
    year: z.number().int().min(1900).max(9999),
    day: z.number().int().min(0).max(8),
    race: z.string().regex(/^[a-z0-9_-]+$/, 'a YB race key'),
    status: z.enum(POSITIONS_STATUSES),
    tick_at: Instant,
    as_of: Instant,
    delay_s: z.number().int().nonnegative(),
  })
  .strict();
export type PositionsStamp = z.infer<typeof PositionsStampSchema>;

/** One public fix: YB's id, the GPS time, and the four numbers the public path allows. */
export const PositionFixSchema = z
  .object({
    id: Finite,
    at: Instant,
    lat: Latitude,
    lon: Longitude,
    alt: Finite,
    cog: Finite,
  })
  .strict();
export type PositionFix = z.infer<typeof PositionFixSchema>;

/** One point of a public trail: unix seconds, then the same four numbers. */
export const TrailPointSchema = z.tuple([z.number().int().nonnegative(), Latitude, Longitude, Finite, Finite]);
export type TrailPoint = z.infer<typeof TrailPointSchema>;

const uniqueMarkers = (teams: { marker: number }[], context: z.RefinementCtx) => {
  const seen = new Set<number>();
  for (const team of teams) {
    if (seen.has(team.marker)) context.addIssue({ code: z.ZodIssueCode.custom, message: `marker ${team.marker} is listed twice` });
    seen.add(team.marker);
  }
};

const notAfterAsOf = (stamp: PositionsStamp, millis: number, context: z.RefinementCtx, path: (string | number)[]) => {
  if (millis > Date.parse(stamp.as_of)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path, message: 'a public fix is never after as_of' });
  }
};

/** `latest.json`: every team's newest public fix, in marker order. */
export const PositionsLatestSchema = PositionsStampSchema.extend({
  /** Fixes the last tick left out for their shape. */
  refused: z.number().int().nonnegative(),
  teams: z.array(PositionFixSchema.extend({ marker: MarkerSchema }).strict()),
})
  .strict()
  .superRefine((document, context) => {
    uniqueMarkers(document.teams, context);
    document.teams.forEach((team, index) => notAfterAsOf(document, Date.parse(team.at), context, ['teams', index, 'at']));
  });
export type PositionsLatest = z.infer<typeof PositionsLatestSchema>;
export type PositionsLatestTeam = PositionsLatest['teams'][number];

/** `trails.json`: every team's public trail, one point per `step_s` seconds. */
export const PositionsTrailsSchema = PositionsStampSchema.extend({
  step_s: z.number().int().positive(),
  teams: z.array(z.object({ marker: MarkerSchema, points: z.array(TrailPointSchema).min(1) }).strict()),
})
  .strict()
  .superRefine((document, context) => {
    uniqueMarkers(document.teams, context);
    document.teams.forEach((team, index) => {
      // A refinement still runs over a trail the array rule already refused.
      const last = team.points.at(-1);
      if (last) notAfterAsOf(document, last[0] * 1000, context, ['teams', index, 'points', team.points.length - 1]);
    });
  });
export type PositionsTrails = z.infer<typeof PositionsTrailsSchema>;
export type PositionsTrail = PositionsTrails['teams'][number];

/** One team's `<marker>.jsonl`, a public fix per line, in fix order. */
export function parsePositionLines(text: string): PositionFix[] {
  return text
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => PositionFixSchema.parse(JSON.parse(line)));
}

export const POSITIONS_DOCUMENTS = ['latest.json', 'trails.json'] as const;
export type PositionsDocument = (typeof POSITIONS_DOCUMENTS)[number];

/**
 * The path under the Worker's `/positions/` for a day's document or one
 * team's file — the canonical spelling, since a padded one is a 404.
 */
export function positionsPath(year: number, day: number, document: PositionsDocument | number): string {
  const name = typeof document === 'number' ? `${MarkerSchema.parse(document)}.jsonl` : document;
  return `${z.number().int().min(1900).max(9999).parse(year)}/${z.number().int().min(0).parse(day)}/${name}`;
}
