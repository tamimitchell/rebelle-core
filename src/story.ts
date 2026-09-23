import { z } from 'zod';
import { parseProse } from './prose.ts';

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
    name: text(120),
    /** The total as it stood at `as_of`, after penalties — a snapshot, never recomputed. */
    points: z.number().int(),
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
export const FigureContentSchema = z.object({
  image_id: z.string().uuid(), alt: text(1000), caption: text(1000).optional(),
}).strict();
export type FigureContent = z.infer<typeof FigureContentSchema>;

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

export const StoryComponentSchema = z.discriminatedUnion('component', [
  z.object({ component: z.literal('Paragraph'), content: ParagraphContentSchema }).strict(),
  z.object({ component: z.literal('Standings'), content: StandingsContentSchema }).strict(),
  z.object({ component: z.literal('Prose'), content: ProseContentSchema }).strict(),
  z.object({ component: z.literal('Quote'), content: QuoteContentSchema }).strict(),
  z.object({ component: z.literal('Figure'), content: FigureContentSchema }).strict(),
  z.object({ component: z.literal('Video'), content: VideoContentSchema }).strict(),
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

/** A video's length as a clock reads it: 81 seconds is "1:21", an hour and more "1:02:03". */
export function durationLabel(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const pad = (value: number) => String(value).padStart(2, '0');
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = whole % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`;
}
