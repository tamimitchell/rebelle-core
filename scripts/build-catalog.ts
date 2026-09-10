import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TEAM_RESULTS_CATALOG, TeamResultsComponentSchema, TeamResultsActionSchema } from '../src/team-results-a2ui.ts';
import { TeamResultsSchema } from '../src/team-results.ts';

// Generated from the same validators the renderer uses. Refinements (unique
// days/checkpoints and the cutoff) remain enforced by the runtime validator.
const schema = zodToJsonSchema(TeamResultsComponentSchema, { name: 'TeamResults', $refStrategy: 'none' });
writeFileSync(new URL('../dist/team-results-catalog.json', import.meta.url), JSON.stringify({
  ...schema, $id: TEAM_RESULTS_CATALOG, catalogId: TEAM_RESULTS_CATALOG,
  title: 'Rebelle team results',
  description: 'Bounded A2UI v0.9.1 catalog: one root TeamResults component bound to /teamResults. No functions or other components. Day selection emits select_day with rally_year, team_number and the chosen day; the host resolves data and authority.',
  definitions: { ...schema.definitions,
    TeamResultsData: zodToJsonSchema(TeamResultsSchema, { $refStrategy: 'none' }),
    TeamResultsAction: zodToJsonSchema(TeamResultsActionSchema, { $refStrategy: 'none' }),
  },
}, null, 2) + '\n');
