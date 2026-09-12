import { z } from 'zod';

const HttpUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  }, 'must be an absolute http(s) URL');

export const DISPATCH_SOURCES = ['hq', 'media', 'fans', 'sponsor', 'team'] as const;

/** A sponsor's key, as the studio's Sponsors table spells it: what a dispatch carries and a reader joins on. */
export const SPONSOR_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SponsorKeySchema = z.string().regex(SPONSOR_KEY, 'a sponsor key is lowercase words joined by hyphens');

/**
 * The lockups the reader draws, keyed the way a sponsor's key is spelled. A
 * sponsor whose `lockup_key` names none of these wears a plain chip; the
 * drawings live in `ui/dispatch.css`, one `live-brand--*` class each.
 */
export const SPONSOR_LOCKUPS: Readonly<Record<string, string>> = {
  pirelli: 'PIRELLI',
  bilstein: 'BILSTEIN',
  iridium: 'iridium',
  'jiffy-lube': 'JIFFY LUBE',
  stryten: 'STRYTEN',
  synchrony: 'SYNCHRONY',
  'baja-designs': 'BAJA DESIGNS',
  yeti: 'YETI',
  pennzoil: 'PENNZOIL',
};

/** One sponsor as the rally days document embeds it beside the day it presents (studio #306 quest 3). */
export const SponsorSchema = z
  .object({
    key: SponsorKeySchema,
    name: z.string().min(1).max(120),
    lockup_key: SponsorKeySchema.nullable(),
    tier: z.string().min(1).max(120).nullable(),
    blurb: z.string().min(1).max(600).nullable(),
    link: HttpUrlSchema.nullable(),
  })
  .strict();
export type Sponsor = z.infer<typeof SponsorSchema>;
export const DISPATCH_KINDS = ['update', 'gallery', 'quote', 'checkpoint', 'video', 'recap'] as const;
export const DISPATCH_PANELS = ['tracker', 'media', 'strategy', 'score'] as const;
/** Readers never see the provider word: it picks the URL template and the id shape. */
export const VIDEO_PROVIDERS = ['youtube', 'hosted'] as const;
/** Carried on every dispatch, shown to no reader (studio #306). */
export const AUTHORSHIP = ['human', 'ai-assisted', 'ai-drafted'] as const;

export type DispatchSource = (typeof DISPATCH_SOURCES)[number];
export type DispatchPanel = (typeof DISPATCH_PANELS)[number];

const TeamNumberSchema = z.string().regex(/^\d+$/, 'team numbers are digit strings');

/**
 * Photo URLs are fetched automatically on render — no click stands between a
 * payload value and a network request — so they get the same discipline as
 * `link`, plus the same-origin path form the fixture actually uses. A single
 * leading slash is a path on this origin; "//host" is protocol-relative and
 * escapes it, so it is refused (Linden/Selvage, PR round).
 */
const PhotoUrlSchema = z
  .string()
  .min(1)
  .refine((value) => {
    if (value.startsWith('/')) return !value.startsWith('//');
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'must be a same-origin path or an absolute http(s) URL');

const StatPairSchema = z.object({ label: z.string().min(1), value: z.string().min(1) }).strict();

/** The stat card: kicker and title ride inside it, over up to three pairs (the site clamps). */
const StatsSchema = z
  .object({
    kicker: z.string().min(1).nullable().optional(),
    title: z.string().min(1).nullable().optional(),
    pairs: z.array(StatPairSchema).min(1),
  })
  .strict();

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * The clip a video post carries. `video_id` is checked per provider, the way
 * the studio checks it at save: a YouTube id, or a hosted clip's media id. A
 * null id is the placeholder block, drawn from title and duration.
 */
const VideoSchema = z
  .object({
    provider: z.enum(VIDEO_PROVIDERS),
    video_id: z.string().min(1).nullable().optional(),
    title: z.string().min(1).max(200),
    duration: z.number().int().min(1).nullable().optional(),
  })
  .strict()
  .superRefine((video, context) => {
    if (video.video_id == null) return;
    const shaped = video.provider === 'youtube' ? YOUTUBE_ID.test(video.video_id) : z.string().uuid().safeParse(video.video_id).success;
    if (!shaped) context.addIssue({ code: z.ZodIssueCode.custom, path: ['video_id'], message: `not a ${video.provider} id` });
  });

const MomentSchema = z.object({ dispatch_id: z.string().uuid(), label: z.string().min(1).max(120) }).strict();

export const DispatchPayloadSchema = z
  .object({
    posted_at: z.string().datetime({ offset: true }),
    source: z.enum(DISPATCH_SOURCES),
    kind: z.enum(DISPATCH_KINDS),
    text: z.string().min(1),
    day: z.number().int().min(0).max(8),
    panel: z.enum(DISPATCH_PANELS).nullable(),
    teams: z.array(TeamNumberSchema).nullable(),
    sponsor: SponsorKeySchema.nullable(),
    stats: StatsSchema.nullable(),
    photos: z.array(z.object({ url: PhotoUrlSchema, credit: z.string().min(1) }).strict()).nullable(),
    link: HttpUrlSchema.nullable(),
    attribution: z.string().min(1).max(200).nullable(),
    authorship: z.enum(AUTHORSHIP),
    video: VideoSchema.nullable(),
    moments: z.array(MomentSchema).max(12).nullable(),
    story: z.string().uuid().nullable(),
  })
  .strict()
  // The kind decides what rides with it, as the studio's own shape does: a
  // quote names who said it, a video post carries its clip and nothing else
  // does, only a recap carries moments.
  .superRefine((payload, context) => {
    if (payload.kind === 'quote' && payload.attribution === null) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['attribution'], message: 'a quote names who said it' });
    }
    if ((payload.kind === 'video') !== (payload.video !== null)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['video'], message: 'a video post carries its clip, and only a video post does' });
    }
    if (payload.kind !== 'recap' && payload.moments !== null) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['moments'], message: 'only a recap carries moments' });
    }
  });
export type DispatchPayload = z.infer<typeof DispatchPayloadSchema>;

const feedRecord = <Payload extends z.ZodTypeAny>(payload: Payload) =>
  z
    .object({
      id: z.string().uuid(),
      version_id: z.string().uuid(),
      schema_version: z.literal('2'),
      payload,
    })
    .strict();

/**
 * The live document's key carries its rally year; a closed day's archive is
 * the same document under the live key plus `.day<n>` (studio Decided #139).
 */
const DISPATCH_FEED_KEY = /^rebelle_live\.dispatches\.(\d{4})(?:\.day([0-8]))?$/;

/** A closed day's archive key, as the studio derives it. */
export const dispatchArchiveKey = (rallyYear: number, day: number): string => `rebelle_live.dispatches.${rallyYear}.day${day}`;

/**
 * One live document per rally year, its key carrying the year, holding the
 * day that is live (studio Decided #135), and one archive per closed day
 * under the archive key, holding that day (Decided #139) — one shape, so a
 * reader parses both with it. `day` is what the shell reads as the live day;
 * a document without one is a contract failure, not a day to guess from the
 * records. The studio refuses a record from another day at send; the replay
 * fixtures still hold a whole rally in one document, so the shape does not
 * refuse that here.
 */
export const DispatchesFeedDocumentSchema = z
  .object({
    contract_version: z.literal('1'),
    feed_key: z.string().regex(DISPATCH_FEED_KEY, 'the dispatch feed key carries its rally year, and an archive its day'),
    record_type_key: z.literal('rebelle_live.dispatch'),
    record_schema_version: z.literal('2'),
    sent_at: z.string().datetime({ offset: true }),
    rally_year: z.number().int().min(1900).max(9999),
    day: z.number().int().min(0).max(8),
    records: z.array(feedRecord(DispatchPayloadSchema)),
  })
  .strict()
  .superRefine((document, context) => {
    const [, year, day] = DISPATCH_FEED_KEY.exec(document.feed_key) ?? [];
    if (Number(year) !== document.rally_year) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['feed_key'], message: 'the feed key names a different year than the document' });
    }
    if (day !== undefined && Number(day) !== document.day) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['feed_key'], message: 'the archive key names a different day than the document' });
    }
  });
export type DispatchesFeedDocument = z.infer<typeof DispatchesFeedDocumentSchema>;
export type DispatchRecord = DispatchesFeedDocument['records'][number];

/** Studio may omit nullable fields. Normalize only at the reader boundary. */
export function parseDispatchDraft(value: unknown): DispatchPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return DispatchPayloadSchema.parse(value);
  return DispatchPayloadSchema.parse({ panel: null, teams: null, sponsor: null, stats: null,
    photos: null, link: null, attribution: null, video: null, moments: null, story: null, ...value });
}
