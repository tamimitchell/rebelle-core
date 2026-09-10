import { z } from 'zod';

/**
 * ── A STORY ────────────────────────────────────────────────────────────────
 *
 * The studio's composed, timely piece for one slot on a surface (studio #275,
 * #283): a bounded composition of catalog components over records, frozen as
 * of a stated time. It is data all the way down — nothing in a story is
 * markup, and `ui/story.tsx` is the one trusted renderer every surface wears.
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

// ── The catalog, v1: two components ─────────────────────────────────────────
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

export const StoryComponentSchema = z.discriminatedUnion('component', [
  z.object({ component: z.literal('Paragraph'), content: ParagraphContentSchema }).strict(),
  z.object({ component: z.literal('Standings'), content: StandingsContentSchema }).strict(),
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
