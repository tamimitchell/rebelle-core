import type { StorySurfaceState } from '../story-a2ui.ts';
import { StoryView, type StoryMedia } from './story.tsx';

/** Maps this catalog's one registered component to trusted UI code. Where the
 * story stands is the host's line to draw, above the story, in its own words. */
export function StorySurface({ state, media }: { state: StorySurfaceState; media?: StoryMedia }) {
  if (!state.created || !state.componentReady || !state.view) return null;
  return <StoryView story={state.view.story} media={media} />;
}
