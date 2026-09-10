import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TEAM_RESULTS_CATALOG, TeamResultsComponentSchema, TeamResultsActionSchema } from '../src/team-results-a2ui.ts';
import { TeamResultsSchema } from '../src/team-results.ts';

// Generated validators supply the properties. These entry points are the
// v0.9.1 catalog contract referenced by the official server envelope schema.
const schema = (value: Parameters<typeof zodToJsonSchema>[0]) => {
  const { $schema: _dialect, ...definition } = zodToJsonSchema(value, { $refStrategy: 'none' });
  return definition;
};
writeFileSync(new URL('../dist/team-results-catalog.json', import.meta.url), JSON.stringify({
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: TEAM_RESULTS_CATALOG, catalogId: TEAM_RESULTS_CATALOG,
  title: 'Rebelle team results',
  description: 'Bounded A2UI v0.9.1 catalog: one root TeamResults bound to /teamResults. No functions or other components. The day input resolves its event context using the chosen day; the host fetches and acknowledges the selection. No URL, tool name or HTML may be supplied. Unique days/checkpoints and the cutoff are also checked by the runtime validator.',
  components: { TeamResults: schema(TeamResultsComponentSchema) }, functions: [],
  $defs: {
    anyComponent: { $ref: '#/components/TeamResults' },
    theme: { type: 'object', additionalProperties: false }, anyFunction: false,
    TeamResultsData: schema(TeamResultsSchema), TeamResultsAction: schema(TeamResultsActionSchema),
  },
}, null, 2) + '\n');
