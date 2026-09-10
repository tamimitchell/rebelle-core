import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TeamResultsSchema, checkpointCounts } from '../src/team-results.ts';
import { applyTeamResultsMessages, emptyTeamResultsSurface, teamResultsMessages, selectTeamResultsDay, TeamResultsActionSchema, TEAM_RESULTS_CATALOG } from '../src/team-results-a2ui.ts';

const result = TeamResultsSchema.parse({ schema_version: '1', rally_year: 2025, team_number: '178', day: 6,
  driver: 'Driver', navigator: 'Navigator', available_days: [5, 6, 7], source: { kind: 'replay', at: '2025-10-16T12:00:00Z' },
  results: [{ day: 6, points: 180, max_points: 200, ranked: true, record_id: 'score-178-6', revision: 'abc',
    checkpoints: [{ key: 'cp18', label: 'CP18', points: 20, max_points: 20, validity: 2, suffix: 'L' }] }],
});
test('renders progressive component/data messages and replaces data without recreating the surface', () => {
  const messages = teamResultsMessages(result);
  let state = applyTeamResultsMessages(emptyTeamResultsSurface(), messages.slice(0, 2));
  assert.equal(state.results, null);
  state = applyTeamResultsMessages(state, messages.slice(2));
  assert.equal(state.results?.results[0].points, 180); // Use official total, never sum checkpoints.
  const updated = teamResultsMessages({ ...result, day: 7 }).slice(2);
  state = applyTeamResultsMessages(state, updated);
  assert.equal(state.results?.day, 7);
  assert.throws(() => applyTeamResultsMessages(state, messages), /Delete/);
  assert.deepEqual(applyTeamResultsMessages(state, [{ version: 'v0.9.1', deleteSurface: { surfaceId: 'team-results' } }]), emptyTeamResultsSurface());
});
test('refuses unknown catalogs, components, bindings, versions and arbitrary actions atomically', () => {
  for (const mutate of [
    (m: any[]) => { m[0].createSurface.catalogId = 'evil'; },
    (m: any[]) => { m[1].updateComponents.components[0].component = 'HTML'; },
    (m: any[]) => { m[1].updateComponents.components[0].results.path = '/private'; },
    (m: any[]) => { m[0].version = 'v0.8'; },
  ]) {
    const state = emptyTeamResultsSurface(); const messages = structuredClone(teamResultsMessages(result)); mutate(messages);
    assert.throws(() => applyTeamResultsMessages(state, messages)); assert.deepEqual(state, emptyTeamResultsSurface());
  }
  const action = selectTeamResultsDay(result, 5);
  assert.equal(action.action.context.day, 5);
  assert.throws(() => selectTeamResultsDay(result, 8));
  assert.throws(() => TeamResultsActionSchema.parse({ ...action, action: { ...action.action, name: 'publish' } }));
  assert.throws(() => applyTeamResultsMessages(emptyTeamResultsSurface(), teamResultsMessages(result).slice(2)));
});
test('rejects future scores, repeated days/checkpoints, and preserves late green scoring', () => {
  assert(checkpointCounts(result.results[0].checkpoints[0]));
  assert(!checkpointCounts({ ...result.results[0].checkpoints[0], validity: 0 }));
  assert(!checkpointCounts({ ...result.results[0].checkpoints[0], points: 125 }));
  assert.throws(() => TeamResultsSchema.parse({ ...result, day: 5 }));
  assert.throws(() => TeamResultsSchema.parse({ ...result, results: [...result.results, ...result.results] }));
  assert.throws(() => TeamResultsSchema.parse({ ...result, results: [{ ...result.results[0], checkpoints: [...result.results[0].checkpoints, ...result.results[0].checkpoints] }] }));
});
test('published catalog has the runtime identity and data/action definitions', () => {
  const catalog = JSON.parse(readFileSync(new URL('../dist/team-results-catalog.json', import.meta.url), 'utf8'));
  assert.equal(catalog.catalogId, TEAM_RESULTS_CATALOG); assert.equal(catalog.$id, TEAM_RESULTS_CATALOG);
  assert(catalog.definitions.TeamResultsData); assert(catalog.definitions.TeamResultsAction);
});
