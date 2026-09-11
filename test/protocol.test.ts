import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { teamResultsMessages, selectTeamResultsDay } from '../src/team-results-a2ui.ts';
import { TeamResultsSchema } from '../src/team-results.ts';
import { storyMessages } from '../src/story-a2ui.ts';
const json = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
test('wire messages and catalog link against the official v0.9.1 schemas', () => {
  const ajv = new Ajv2020({ strict: false }); addFormats(ajv);
  ajv.addSchema(json('./protocol/v0.9.1/common.json'));
  ajv.addSchema(json('../dist/team-results-catalog.json'), 'https://a2ui.org/specification/v0_9/catalog.json');
  const server = ajv.compile(json('./protocol/v0.9.1/server.json'));
  const client = ajv.compile(json('./protocol/v0.9.1/client.json'));
  const data = TeamResultsSchema.parse({ schema_version: '1', rally_year: 2025, team_number: '178', day: 6,
    driver: '', navigator: '', source: { kind: 'replay', at: '2025-10-16T00:00:00Z' }, available_days: [6,7], results: [] });
  for (const message of teamResultsMessages(data)) assert(server(message), JSON.stringify(server.errors));
  assert(client(selectTeamResultsDay(data, 7)), JSON.stringify(client.errors));
  const invalid = structuredClone(teamResultsMessages(data)[1]);
  if ('updateComponents' in invalid) (invalid.updateComponents.components[0] as any).component = 'HTML';
  assert(!server(invalid));
});
test('story wire messages and catalog link against the official v0.9.1 schemas', () => {
  const ajv = new Ajv2020({ strict: false }); addFormats(ajv);
  ajv.addSchema(json('./protocol/v0.9.1/common.json'));
  ajv.addSchema(json('../dist/story-catalog.json'), 'https://a2ui.org/specification/v0_9/catalog.json');
  const server = ajv.compile(json('./protocol/v0.9.1/server.json'));
  const { id: _id, version_id: _versionId, ...story } = json('./fixtures/release-placements.json').placements[0].story;
  const messages = storyMessages({ story, standing: { draft: true, exploration: 'rally week', slot: { key: 'site:home-feature', label: 'Home page, after the follow band' } } });
  for (const message of messages) assert(server(message), JSON.stringify(server.errors));
  const invalid = structuredClone(messages[1]);
  if ('updateComponents' in invalid) (invalid.updateComponents.components[0] as any).component = 'HTML';
  assert(!server(invalid));
});
