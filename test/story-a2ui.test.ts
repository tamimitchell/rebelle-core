import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STORY_CATALOG, STORY_VERSION, applyStoryMessages, emptyStorySurface, storyMessages, type StoryStanding } from '../src/story-a2ui.ts';

const artifact = JSON.parse(readFileSync(new URL('./fixtures/release-placements.json', import.meta.url), 'utf8'));
const { id: _id, version_id: _versionId, ...story } = artifact.placements[0].story;
const draft: StoryStanding = { draft: true, exploration: 'rally week', slot: { key: 'site:home-feature', label: 'Home page, after the follow band' } };
const canon: StoryStanding = { draft: false, exploration: null, slot: null };

test('a story view round-trips through the bounded surface', () => {
  const messages = storyMessages({ story, standing: draft });
  assert.equal(messages.length, 3);
  let state = applyStoryMessages(emptyStorySurface(), messages.slice(0, 2));
  assert.deepEqual(state, { created: true, componentReady: true, view: null });
  state = applyStoryMessages(state, messages.slice(2));
  assert.deepEqual(state.view, { story, standing: draft });
  state = applyStoryMessages(state, storyMessages({ story, standing: canon }).slice(2));
  assert.equal(state.view?.standing.draft, false);
  assert.throws(() => applyStoryMessages(state, messages), /Delete/);
  assert.deepEqual(applyStoryMessages(state, [{ version: STORY_VERSION, deleteSurface: { surfaceId: 'story' } }]), emptyStorySurface());
});

test('refuses unknown catalogs, components, bindings, versions and stories atomically', () => {
  const mutations: ((m: any[]) => void)[] = [
    (m) => { m[0].createSurface.catalogId = 'evil'; },
    (m) => { m[1].updateComponents.components[0].component = 'HTML'; },
    (m) => { m[1].updateComponents.components.push({ id: 'second', component: 'Story', view: { path: '/storyView' } }); },
    (m) => { m[1].updateComponents.components[0].view.path = '/elsewhere'; },
    (m) => { m[2].version = 'v1.0.0'; },
    (m) => { m[2].updateDataModel.value.story.telling = [{ component: 'Html', content: { text: '<b>' } }]; },
    (m) => { m[2].updateDataModel.value.story.telling = []; },
    (m) => { m[2].updateDataModel.value.standing.slot = 'site:home-feature'; },
    (m) => { m[2].updateDataModel.value.standing.slot = { key: 'not a slot', label: 'Home page' }; },
    (m) => { m[2].updateDataModel.value.standing.slot = { key: 'site:home-feature', label: ' ' }; },
    (m) => { m[2].updateDataModel.value.standing.action = 'approve'; },
    (m) => { m[2].updateDataModel.value.onClick = 'approve'; },
  ];
  for (const mutate of mutations) {
    const state = emptyStorySurface();
    const messages = structuredClone(storyMessages({ story, standing: draft }));
    mutate(messages);
    assert.throws(() => applyStoryMessages(state, messages));
    assert.deepEqual(state, emptyStorySurface());
  }
  assert.throws(() => applyStoryMessages(emptyStorySurface(), storyMessages({ story, standing: draft }).slice(2)), /Create/);
  assert.throws(() => storyMessages({ story: { ...story, headline: '' }, standing: draft }));
});

test('published catalog has the runtime identity and the view definition', () => {
  const catalog = JSON.parse(readFileSync(new URL('../dist/story-catalog.json', import.meta.url), 'utf8'));
  assert.equal(catalog.catalogId, STORY_CATALOG);
  assert.equal(catalog.$id, STORY_CATALOG);
  assert.deepEqual(Object.keys(catalog.components), ['Story']);
  assert.deepEqual(catalog.functions, []);
  assert.equal(catalog.$defs.anyFunction, false);
  assert.deepEqual(catalog.$defs.StoryViewData.required, ['story', 'standing']);
  assert.deepEqual(Object.keys(catalog.$defs.StoryViewData.properties.story.properties), ['headline', 'summary', 'as_of', 'telling']);
});
