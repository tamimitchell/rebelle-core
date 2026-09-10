import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ReleaseArtifactSchema, RELEASE_ARTIFACT_VERSION } from '../src/schemas.ts';
import { STORY_COMPONENTS, SlotNameSchema, StorySchema, StoryPlacementSchema, asOfLabel } from '../src/story.ts';

// The cross-repo contract: the studio's build emits it, the site's slot reader
// parses it, and this file is the copy every consumer pins.
const artifact = JSON.parse(readFileSync(new URL('./fixtures/release-placements.json', import.meta.url), 'utf8'));
const placement = artifact.placements[0];
// The story as a reader is shown it — a placement adds the ids the release pinned.
const { id: _id, version_id: _versionId, ...story } = placement.story;

test('the shared fixture is a release artifact carrying one story in one slot', () => {
  const parsed = ReleaseArtifactSchema.parse(artifact);
  assert.equal(parsed.schema_version, RELEASE_ARTIFACT_VERSION);
  assert.equal(parsed.placements.length, 1);
  assert.equal(parsed.placements[0].slot, 'site:home-feature');
  assert.deepEqual(parsed.placements[0].story.telling.map((part) => part.component), ['Paragraph', 'Standings', 'Paragraph']);
  assert.deepEqual(STORY_COMPONENTS, ['Paragraph', 'Standings']);
});

test('an artifact under the previous version or with an unknown key is refused, not read partially', () => {
  assert(!ReleaseArtifactSchema.safeParse({ ...artifact, schema_version: '1' }).success);
  const { placements: _placements, ...withoutPlacements } = artifact;
  assert(!ReleaseArtifactSchema.safeParse(withoutPlacements).success);
  assert(!ReleaseArtifactSchema.safeParse({ ...artifact, extra: true }).success);
});

test('a slot holds one story', () => {
  const doubled = { ...artifact, placements: [placement, { ...placement, story: { ...placement.story, id: '1b4e28ba-2fa1-4d4f-8e4b-1a2b3c4d5e6f' } }] };
  const result = ReleaseArtifactSchema.safeParse(doubled);
  assert(!result.success);
  assert.deepEqual(result.error.issues.map((issue) => issue.path), [['placements']]);
});

test('a story is data all the way down: unknown components, blank text and markup-shaped fields are refused', () => {
  assert(StorySchema.safeParse(story).success);
  assert(!StorySchema.safeParse(placement.story).success, 'the ids belong to the placement');
  assert(!StorySchema.safeParse({ ...story, telling: [{ component: 'Html', content: { html: '<p>hi</p>' } }] }).success);
  assert(!StorySchema.safeParse({ ...story, telling: [{ component: 'Paragraph', content: { text: '   ' } }] }).success);
  assert(!StorySchema.safeParse({ ...story, telling: [{ component: 'Paragraph', content: { text: 'fine', html: '<b>no</b>' } }] }).success);
  assert(!StorySchema.safeParse({ ...story, telling: [] }).success);
  assert(!StorySchema.safeParse({ ...story, as_of: '2026-10-10 14:02' }).success);
  assert(!StorySchema.safeParse({ ...story, slot: 'site:home-feature' }).success, 'where a story stands is the studio\'s and the placement\'s, never the story\'s');
});

test('standings rows are a snapshot: numeric team strings, one to ten rows, ties allowed', () => {
  const rows = story.telling[1].content.rows;
  const standings = (next: unknown[]) => StorySchema.safeParse({ ...story, telling: [{ component: 'Standings', content: { rows: next } }] }).success;
  assert(standings(rows));
  assert(standings([{ ...rows[0], position: 1 }, { ...rows[1], position: 1 }]));
  assert(!standings([]));
  assert(!standings(Array.from({ length: 11 }, () => rows[0])));
  assert(!standings([{ ...rows[0], team_number: 129 }]));
  assert(!standings([{ ...rows[0], points: 1188.5 }]));
});

test('a placement pins the object and the version the release froze', () => {
  assert(StoryPlacementSchema.safeParse(placement).success);
  assert(!StoryPlacementSchema.safeParse({ ...placement, slot: 'home feature' }).success);
  assert(!StoryPlacementSchema.safeParse({ ...placement, story: { ...placement.story, version_id: 'latest' } }).success);
  for (const slot of ['site:home-feature', 'app:today', 'site:teams-feature']) assert(SlotNameSchema.safeParse(slot).success, slot);
  for (const slot of ['site:', 'Site:Home', 'site:home_feature', 'home-feature', 'site::home']) assert(!SlotNameSchema.safeParse(slot).success, slot);
});

test('the as-of label reads the story\'s own offset and never the reader\'s zone', () => {
  assert.equal(asOfLabel('2026-10-10T14:02:00-07:00'), '10 Oct 2026, 14:02');
  assert.equal(asOfLabel('2026-10-10T21:02:00Z'), '10 Oct 2026, 21:02');
  assert.equal(asOfLabel('not a time'), 'not a time');
});
