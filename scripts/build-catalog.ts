import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TEAM_RESULTS_CATALOG, TeamResultsComponentSchema, TeamResultsActionSchema } from '../src/team-results-a2ui.ts';
import { TeamResultsSchema } from '../src/team-results.ts';
import { STORY_CATALOG, StoryComponentBindingSchema, StoryViewSchema } from '../src/story-a2ui.ts';

// Generated validators supply the properties. These entry points are the
// v0.9.1 catalog contract referenced by the official server envelope schema.
const schema = (value: Parameters<typeof zodToJsonSchema>[0]) => {
  const { $schema: _dialect, ...definition } = zodToJsonSchema(value, { $refStrategy: 'none' });
  return definition;
};
const write = (name: string, catalog: object) =>
  writeFileSync(new URL(`../dist/${name}-catalog.json`, import.meta.url), JSON.stringify({ $schema: 'https://json-schema.org/draft/2020-12/schema', ...catalog }, null, 2) + '\n');

write('team-results', {
  $id: TEAM_RESULTS_CATALOG, catalogId: TEAM_RESULTS_CATALOG,
  title: 'Rebelle team results',
  description: 'Bounded A2UI v0.9.1 catalog: one root TeamResults bound to /teamResults. No functions or other components. The day input resolves its event context using the chosen day; the host fetches and acknowledges the selection. No URL, tool name or HTML may be supplied. Unique days/checkpoints and the cutoff are also checked by the runtime validator.',
  components: { TeamResults: schema(TeamResultsComponentSchema) }, functions: [],
  $defs: {
    anyComponent: { $ref: '#/components/TeamResults' },
    theme: { type: 'object', additionalProperties: false }, anyFunction: false,
    TeamResultsData: schema(TeamResultsSchema), TeamResultsAction: schema(TeamResultsActionSchema),
  },
});

write('story', {
  $id: STORY_CATALOG, catalogId: STORY_CATALOG,
  title: 'Rebelle story',
  description: 'Bounded A2UI v0.9.1 catalog: one root Story bound to /storyView, a read-only view of a story document and where it stands. No functions, actions or other components; the story is drawn by the shared renderer, and nothing in it is HTML, a URL or a tool name.',
  components: { Story: schema(StoryComponentBindingSchema) }, functions: [],
  $defs: {
    anyComponent: { $ref: '#/components/Story' },
    theme: { type: 'object', additionalProperties: false }, anyFunction: false,
    StoryViewData: schema(StoryViewSchema),
  },
});
