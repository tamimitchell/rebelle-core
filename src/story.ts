import { z } from 'zod';
import { parseProse, proseLinkAllowed } from './prose.ts';

/**
 * ── A STORY ────────────────────────────────────────────────────────────────
 *
 * The studio's composed, timely piece for one slot on a surface (studio #275,
 * #283): a bounded composition of catalog components over records, frozen as
 * of a stated time. Prose carries a closed Markdown subset; raw HTML remains
 * literal. `ui/story.tsx` is the one trusted renderer every surface wears.
 * A host executes nothing and styles nothing an author wrote.
 */

/** Text a person wrote: never blank, never longer than its field can carry. */
const text = (max: number) => z.string().max(max).regex(/\S/, 'must not be blank');

/**
 * A slot is `surface:name` — `site:home-feature`. The surface declares it and
 * owns its position; the studio chooses what fills it. The format is shared
 * here; the list of names is the studio's own, hand-edited.
 */
export const SlotNameSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*:[a-z0-9]+(-[a-z0-9]+)*$/, 'a slot is written surface:name');
export type SlotName = z.infer<typeof SlotNameSchema>;

// ── The composed catalog ─────────────────────────────────────────
// Each entry is `{component, content}`. Adding a component is a contract
// change for every renderer and for the studio's write gate, which mirrors
// these shapes by hand; bump consumers deliberately.

/** A paragraph of plain prose. No markup and no links, on purpose. */
export const ParagraphContentSchema = z.object({ text: text(2000) }).strict();

export const StandingsRowSchema = z
  .object({
    /** Ties share a position, so two rows may carry the same one. */
    position: z.number().int().min(1).max(999),
    /** A numeric string, as the scoring API and the roster both spell it. */
    team_number: z.string().regex(/^\d{1,4}$/),
    /** The team's name; on rows written before `crew`, the crew stood here instead. */
    name: text(120),
    /** Driver / navigator, and the vehicle, each drawn in its own column when present. */
    crew: text(120).optional(),
    vehicle: text(120).optional(),
    /** The total as it stood at `as_of`, after penalties — a snapshot, never recomputed. */
    points: z.number().int(),
    /** Share of the points on offer, as scoring prints it beside the total. */
    completion: z.number().int().min(0).max(100).optional(),
  })
  .strict();

/** The leaders as they stood: a caption saying which class or day, then the rows. */
export const StandingsContentSchema = z
  .object({
    caption: text(200).optional(),
    rows: z.array(StandingsRowSchema).min(1).max(10),
  })
  .strict();

/** Formatted prose is additive: Paragraph above remains literal forever. */
export const ProseContentSchema = z.object({
  markdown: text(12000).superRefine((value, context) => {
    try { parseProse(value); }
    catch (error) { context.addIssue({ code: 'custom', message: error instanceof Error ? error.message : 'Unsupported prose' }); }
  }),
}).strict();
export const QuoteContentSchema = z.object({
  text: text(2000), attribution: text(200),
}).strict();
/** A Figure may open a web page when tapped (`link`); a photograph in a set may not. */
export const FigureContentSchema = z.object({
  image_id: z.string().uuid(), alt: text(1000), caption: text(1000).optional(),
  link: z.string().max(2000).refine((href) => /^https?:\/\//i.test(href) && proseLinkAllowed(href), 'an http or https address').optional(),
}).strict();
export type FigureContent = z.infer<typeof FigureContentSchema>;

/**
 * A set of photographs as one part, drawn as one figure (#40). WordPress's
 * carousels come over as sets of up to fifteen, so a set holds two to twenty;
 * a photograph appears in a set once.
 */
export const PhotosContentSchema = z.object({
  photos: z.array(FigureContentSchema.omit({ link: true })).min(2).max(20)
    .refine((photos) => new Set(photos.map((photo) => photo.image_id.toLowerCase())).size === photos.length, 'a photograph appears in a set once'),
  caption: text(1000).optional(),
}).strict();
export type PhotosContent = z.infer<typeof PhotosContentSchema>;

/**
 * A video, by provider: a YouTube clip, or one the site hosts from the
 * studio's media (studio #306). The id's shape and the address template are
 * both chosen by the provider, so nothing but a validated pair ever becomes
 * part of a URL. `duration` is whole seconds, as a dispatch's video carries it.
 */
const video = { title: text(200), duration: z.number().int().min(1).max(86400).optional() };
export const VideoContentSchema = z.discriminatedUnion('provider', [
  z.object({ provider: z.literal('youtube'), video_id: z.string().regex(/^[A-Za-z0-9_-]{11}$/), ...video }).strict(),
  z.object({ provider: z.literal('hosted'), video_id: z.string().uuid(), ...video }).strict(),
]);
export type VideoContent = z.infer<typeof VideoContentSchema>;
export type VideoUrls =
  | { provider: 'youtube'; watch: string; embed: string }
  | { provider: 'hosted'; source: string; poster?: string };

/** One template per provider; a hosted video's default is the site's own route, which a host may stand its own in for. */
export function videoUrls(value: VideoContent): VideoUrls {
  const parsed = VideoContentSchema.parse(value);
  switch (parsed.provider) {
    case 'youtube':
      return { provider: 'youtube', watch: `https://www.youtube.com/watch?v=${parsed.video_id}`, embed: `https://www.youtube-nocookie.com/embed/${parsed.video_id}` };
    case 'hosted': {
      const id = parsed.video_id.toLowerCase();
      return { provider: 'hosted', source: `/videos/${id}` };
    }
  }
}

const ascending = <T>(key: (item: T) => number) => (items: T[]) => items.every((item, index) => index === 0 || key(item) > key(items[index - 1]));
const point = { latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) };

/**
 * A town on a map, and the rally years Rebelles came from it (studio #164):
 * a place, never a person. `years` ascend and do not repeat; a town no year
 * names has none.
 */
export const MapPlaceSchema = z
  .object({
    name: text(120),
    region: text(120).nullable(),
    country: text(120),
    ...point,
    years: z.array(z.number().int().min(2016).max(2100)).max(100).refine(ascending((year: number) => year), 'years must ascend and not repeat'),
  })
  .strict();
export type MapPlace = z.infer<typeof MapPlaceSchema>;

/**
 * A day of a past rally's route: where the teams slept at its end, and the
 * day's greens. Teams choose their own order, so a route runs camp to camp and
 * is never a line anyone drove; a base camp and a night out on their own are
 * both the day's camp (studio #544). A camp no one recorded a name for says
 * null, and is drawn unnamed.
 */
export const RouteDaySchema = z
  .object({
    day: z.number().int().min(1).max(10),
    camp: z.object({ name: text(60).nullable(), ...point }).strict(),
    greens: z.array(z.object(point).strict()).max(40),
  })
  .strict();
export type RouteDay = z.infer<typeof RouteDaySchema>;

/** A past rally, a day at a time from Day 1; the Prologue is not a route day. */
export const MapRouteSchema = z
  .object({
    year: z.number().int().min(2016).max(2100),
    days: z.array(RouteDaySchema).min(1).max(10).refine(ascending((day: RouteDay) => day.day), 'days must ascend and not repeat'),
  })
  .strict();
export type MapRoute = z.infer<typeof MapRouteSchema>;

/**
 * Where Rebelles come from, the towns as they stood at `as_of` — a snapshot, as
 * Standings is — and the routes of past rallies. Which years may carry a route
 * is the studio's to decide; the course stays secret until a rally is over.
 */
export const MapContentSchema = z
  .object({
    caption: text(200).optional(),
    places: z.array(MapPlaceSchema).min(1).max(1000),
    routes: z.array(MapRouteSchema).max(20).refine(ascending((route: MapRoute) => route.year), 'routes must ascend by year and not repeat').optional(),
  })
  .strict();
export type MapContent = z.infer<typeof MapContentSchema>;

export const StoryComponentSchema = z.discriminatedUnion('component', [
  z.object({ component: z.literal('Paragraph'), content: ParagraphContentSchema }).strict(),
  z.object({ component: z.literal('Standings'), content: StandingsContentSchema }).strict(),
  z.object({ component: z.literal('Prose'), content: ProseContentSchema }).strict(),
  z.object({ component: z.literal('Quote'), content: QuoteContentSchema }).strict(),
  z.object({ component: z.literal('Figure'), content: FigureContentSchema }).strict(),
  z.object({ component: z.literal('Photos'), content: PhotosContentSchema }).strict(),
  z.object({ component: z.literal('Video'), content: VideoContentSchema }).strict(),
  z.object({ component: z.literal('Map'), content: MapContentSchema }).strict(),
]);
export type StoryComponent = z.infer<typeof StoryComponentSchema>;

/** The component names, for a menu or a refusal. */
export const STORY_COMPONENTS = StoryComponentSchema.options.map(
  (option) => option.shape.component.value,
) as StoryComponent['component'][];

/**
 * The story a reader is shown. `summary` is the standfirst under the headline
 * and the text a host falls back to when it cannot render the view. `as_of`
 * is the moment the numbers were true; the prose freezes while the scores
 * move on (studio #275 Decided 2).
 */
export const StorySchema = z
  .object({
    headline: text(200),
    summary: text(600),
    as_of: z.string().datetime({ offset: true }),
    telling: z.array(StoryComponentSchema).min(1).max(12),
  })
  .strict();
export type Story = z.infer<typeof StorySchema>;

/**
 * One story standing in one slot, as a release carries it. `id` is the
 * studio's object, `version_id` the frozen version the release pinned.
 */
export const StoryPlacementSchema = z
  .object({
    slot: SlotNameSchema,
    story: StorySchema.extend({ id: z.string().uuid(), version_id: z.string().uuid() }).strict(),
  })
  .strict();
export type StoryPlacement = z.infer<typeof StoryPlacementSchema>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The as-of moment as written in the story's own offset — rally time, never
 * the reader's zone: `2026-10-10T14:02:00-06:00` reads "10 Oct 2026, 14:02".
 * Read off the string rather than a Date so the label is the same on every
 * server and in every browser.
 */
export function asOfLabel(asOf: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(asOf);
  if (!match) return asOf;
  const [, year, month, day, hour, minute] = match;
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}, ${hour}:${minute}`;
}

/**
 * A place as a reader names it: a town with its state or province at home and
 * its country abroad; a state or a country on its own, once.
 */
export function placeLabel(place: MapPlace): string {
  const home = place.country === 'United States' || place.country === 'Canada';
  const within = home ? place.region : place.country === place.name ? null : place.country;
  return within ? `${place.name}, ${within}` : place.name;
}

/** What a map's words say about it, counted from its places and never typed. */
export function mapFigures(content: MapContent): { towns: number; countries: number; years: number[] } {
  return {
    towns: content.places.length,
    countries: new Set(content.places.map((place) => place.country)).size,
    years: [...new Set(content.places.flatMap((place) => place.years))].sort((a, b) => a - b),
  };
}

/** What a route's inset says about it, counted: "7 days · 26 greens". */
export function routeFigures(route: MapRoute): { days: number; greens: number } {
  return { days: route.days.length, greens: route.days.reduce((sum, day) => sum + day.greens.length, 0) };
}

/** A video's length as a clock reads it: 81 seconds is "1:21", an hour and more "1:02:03". */
export function durationLabel(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const pad = (value: number) => String(value).padStart(2, '0');
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = whole % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`;
}
