import { z } from 'zod';
import { SlotNameSchema, StorySchema, type Story } from './story.ts';

/**
 * The A2UI face of a story (studio #283 quest 2b), beside the domain the way
 * `team-results-a2ui.ts` stands beside team results (Decided #125). One root
 * `Story` component bound to `/storyView`; the story document itself is the
 * domain's `StorySchema`, drawn by the one renderer. A viewer has no actions:
 * approve, publish and send stay gates in the studio.
 */
export const STORY_CATALOG = 'urn:rebelle:a2ui:story:1';
export const STORY_SURFACE = 'story';
export const STORY_VERSION = 'v0.9.1';

/**
 * Where the story stands when it is shown: a draft nobody has approved, read
 * through the exploration named, or the Library's own. The site never sees
 * this — it draws only what a release carries.
 */
export const StoryStandingSchema = z
  .object({
    draft: z.boolean(),
    exploration: z.string().max(200).nullable(),
    slot: SlotNameSchema.nullable(),
  })
  .strict();
export type StoryStanding = z.infer<typeof StoryStandingSchema>;

export const StoryViewSchema = z.object({ story: StorySchema, standing: StoryStandingSchema }).strict();
export type StoryView = z.infer<typeof StoryViewSchema>;

export const StoryComponentBindingSchema = z
  .object({
    id: z.literal('root'),
    component: z.literal('Story'),
    view: z.object({ path: z.literal('/storyView') }).strict(),
  })
  .strict();
const envelope = { version: z.literal(STORY_VERSION) };
const surfaceId = z.literal(STORY_SURFACE);
export const StoryMessageSchema = z.union([
  z.object({ ...envelope, createSurface: z.object({ surfaceId, catalogId: z.literal(STORY_CATALOG) }).strict() }).strict(),
  z.object({ ...envelope, updateComponents: z.object({ surfaceId, components: z.array(StoryComponentBindingSchema).length(1) }).strict() }).strict(),
  z.object({ ...envelope, updateDataModel: z.object({ surfaceId, path: z.literal('/storyView'), value: StoryViewSchema }).strict() }).strict(),
  z.object({ ...envelope, deleteSurface: z.object({ surfaceId }).strict() }).strict(),
]);
export type StoryMessage = z.infer<typeof StoryMessageSchema>;
export type StorySurfaceState = { created: boolean; componentReady: boolean; view: StoryView | null };
export const emptyStorySurface = (): StorySurfaceState => ({ created: false, componentReady: false, view: null });

/** A bounded catalog renderer, not a general evaluator: only root data replacement
 * and the Story component are supported; no functions, HTML, actions or tool names. */
export function applyStoryMessages(previous: StorySurfaceState, input: unknown): StorySurfaceState {
  const messages = z.array(StoryMessageSchema).min(1).max(32).parse(input);
  let state = previous;
  for (const message of messages) {
    if ('createSurface' in message) { if (state.created) throw new Error('Delete the existing surface before recreating it.'); state = { created: true, componentReady: false, view: null }; continue; }
    if (!state.created) throw new Error('Create the story surface before updating it.');
    if ('deleteSurface' in message) state = emptyStorySurface();
    else if ('updateComponents' in message) state = { ...state, componentReady: true };
    else state = { ...state, view: message.updateDataModel.value };
  }
  return state;
}
export function storyMessages(input: { story: Story; standing: StoryStanding }): StoryMessage[] {
  const view = StoryViewSchema.parse(input);
  return [
    { version: STORY_VERSION, createSurface: { surfaceId: STORY_SURFACE, catalogId: STORY_CATALOG } },
    { version: STORY_VERSION, updateComponents: { surfaceId: STORY_SURFACE, components: [{ id: 'root', component: 'Story', view: { path: '/storyView' } }] } },
    { version: STORY_VERSION, updateDataModel: { surfaceId: STORY_SURFACE, path: '/storyView', value: view } },
  ];
}
