import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ReleaseArtifactSchema, RELEASE_ARTIFACT_VERSION } from '../src/schemas.ts';
import { STORY_COMPONENTS, SlotNameSchema, StoryComponentSchema, StorySchema, StoryPlacementSchema, asOfLabel, durationLabel, mapFigures, placeLabel, routeFigures, videoUrls } from '../src/story.ts';

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
  assert.deepEqual(parsed.placements[0].story.telling.map((part) => part.component), ['Paragraph', 'Standings', 'Paragraph', 'Prose', 'Quote', 'Figure', 'Video', 'Video', 'Map', 'Photos']);
  assert.deepEqual(STORY_COMPONENTS, ['Paragraph', 'Standings', 'Prose', 'Quote', 'Figure', 'Photos', 'Video', 'Map']);
});

test('an artifact under the previous version or with an unknown key is refused, not read partially', () => {
  assert(!ReleaseArtifactSchema.safeParse({ ...artifact, schema_version: '2' }).success);
  assert(!ReleaseArtifactSchema.safeParse({ ...artifact, pages: [] }).success, 'pages left the artifact with studio #275');
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
  assert(standings([{ ...rows[0], crew: 'Laura Wanlass / Teralin Petereit', vehicle: '2025 Ford Ranger Raptor' }]));
  assert(!standings([{ ...rows[0], crew: 'x'.repeat(121) }]));
  assert(standings([{ ...rows[0], completion: 97 }]));
  assert(!standings([{ ...rows[0], completion: 101 }]));
});

test('a map carries towns and their years, never a person, and is bounded like any snapshot', () => {
  const places = story.telling[8].content.places;
  const map = (next: unknown[], extra: object = {}) => StoryComponentSchema.safeParse({ component: 'Map', content: { places: next, ...extra } }).success;
  assert(map(places));
  assert(map(places, { caption: 'Where the field comes from' }));
  assert(!map([]));
  assert(!map(Array.from({ length: 1001 }, () => places[0])));
  assert(!map([{ ...places[0], person: 'A Rebelle' }]), 'a town names no one');
  assert(!map([{ ...places[0], latitude: 91 }]));
  assert(!map([{ ...places[0], longitude: -181 }]));
  assert(!map([{ ...places[0], years: [2021, 2018] }]), 'years ascend');
  assert(!map([{ ...places[0], years: [2021, 2021] }]), 'years do not repeat');
  assert(!map([{ ...places[0], years: [2015] }]), 'the first Rebelle was 2016');
  assert(!map([{ ...places[0], name: '  ' }]));
  assert(!map([{ ...places[0], region: undefined }]), 'a town with no region says null');
  assert(!map(places, { html: '<b>no</b>' }));
});

test('a map may carry past routes, camp to camp a day at a time, bounded and in order', () => {
  const { places, routes } = story.telling[8].content;
  const [route] = routes;
  const [day] = route.days;
  const map = (next: unknown) => StoryComponentSchema.safeParse({ component: 'Map', content: { places, routes: next } }).success;
  const withDays = (days: unknown[]) => [{ ...route, days }];
  assert(map(routes));
  assert(map([]));
  assert(map(withDays([{ ...day, greens: [] }])), 'a day may have no greens');
  assert(map(withDays([{ ...day, camp: { ...day.camp, name: null } }])), 'a camp no one named says null');
  assert(!map(withDays([{ ...day, camp: { latitude: day.camp.latitude, longitude: day.camp.longitude } }])), 'an unnamed camp says so');
  assert(map(Array.from({ length: 20 }, (_, index) => ({ ...route, year: 2016 + index }))));
  assert(!map(Array.from({ length: 21 }, (_, index) => ({ ...route, year: 2016 + index }))));
  assert(!map([route, route]), 'one route a year');
  assert(!map([{ ...route, year: 2024 }, route]), 'routes ascend by year');
  assert(!map([{ ...route, year: 2015 }]), 'the first rally was 2016');
  assert(!map(withDays([])), 'a route has a day');
  assert(!map(withDays([route.days[1], route.days[0]])), 'days ascend');
  assert(!map(withDays([day, day])), 'days do not repeat');
  assert(!map(withDays([{ ...day, day: 0 }])), 'the Prologue is not a route day');
  assert(!map(withDays([{ ...day, day: 11 }])));
  assert(!map(withDays([{ ...day, greens: Array.from({ length: 41 }, () => day.greens[0]) }])));
  assert(!map(withDays([{ ...day, camp: { ...day.camp, name: '  ' } }])));
  assert(!map(withDays([{ ...day, camp: { ...day.camp, name: 'x'.repeat(61) } }])));
  assert(!map(withDays([{ ...day, camp: { ...day.camp, latitude: 91 } }])));
  assert(!map(withDays([{ ...day, greens: [{ ...day.greens[0], longitude: 181 }] }])));
  assert(!map(withDays([{ ...day, team_number: '129' }])), 'a route names no team');
  assert(!map(withDays([{ ...day, greens: [{ ...day.greens[0], team: 'A Rebelle' }] }])), 'a green names no one');
  assert(!map([{ ...route, kind: 'self-camp' }]));
  assert.deepEqual(routeFigures(route), { days: 7, greens: 26 });
});

test('a town is named with its state at home and its country abroad, and a map counts itself', () => {
  const content = story.telling[8].content;
  assert.deepEqual(content.places.map(placeLabel), ['Anchorage, Alaska', 'Antibes, France', 'Gustavia, Saint Barthélemy']);
  assert.deepEqual(mapFigures(content), { towns: 3, countries: 3, years: [2017, 2018, 2021, 2026] });
});

test('a state or a country on its own is named once, and a town that shares its state\'s name keeps both', () => {
  const at = { latitude: 0, longitude: 0, years: [] };
  assert.equal(placeLabel({ name: 'Maryland', region: null, country: 'United States', ...at }), 'Maryland');
  assert.equal(placeLabel({ name: 'France', region: null, country: 'France', ...at }), 'France');
  assert.equal(placeLabel({ name: 'New York', region: 'New York', country: 'United States', ...at }), 'New York, New York');
});

test('a placement pins the object and the version the release froze', () => {
  assert(StoryPlacementSchema.safeParse(placement).success);
  assert(!StoryPlacementSchema.safeParse({ ...placement, slot: 'home feature' }).success);
  assert(!StoryPlacementSchema.safeParse({ ...placement, story: { ...placement.story, version_id: 'latest' } }).success);
  for (const slot of ['site:home-feature', 'app:today', 'site:teams-feature']) assert(SlotNameSchema.safeParse(slot).success, slot);
  for (const slot of ['site:', 'Site:Home', 'site:home_feature', 'home-feature', 'site::home']) assert(!SlotNameSchema.safeParse(slot).success, slot);
});

test('a video\'s id is held to its provider\'s shape, and an address is built only from that validated pair', () => {
  const youtube = { provider: 'youtube' as const, video_id: 'k4FNP7tL1Xg', title: 'Lexus webcast' };
  const hosted = { provider: 'hosted' as const, video_id: '5A0D8F2E-6B3C-4E1A-9F7D-2C4B6A8E0D1F', title: 'Day 3 course flyover', duration: 81 };
  const accepts = (content: unknown) => StoryComponentSchema.safeParse({ component: 'Video', content }).success;
  assert(accepts(youtube));
  assert(accepts(hosted));
  assert(accepts({ ...youtube, duration: 3600 }));
  assert.deepEqual(videoUrls(youtube), { provider: 'youtube', watch: 'https://www.youtube.com/watch?v=k4FNP7tL1Xg', embed: 'https://www.youtube-nocookie.com/embed/k4FNP7tL1Xg' });
  assert.deepEqual(videoUrls(hosted), { provider: 'hosted', source: '/videos/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f' });
  const refused = [
    // Each provider's id shape refuses the other's, and anything else that is eleven characters or UUID-shaped.
    { ...youtube, video_id: hosted.video_id }, { ...hosted, video_id: youtube.video_id },
    { ...youtube, video_id: 'k4FNP7tL1X' }, { ...youtube, video_id: 'k4FNP7tL1Xgg' }, { ...youtube, video_id: 'k4FNP7 L1Xg' }, { ...youtube, video_id: '../arbitrary' },
    { ...hosted, video_id: '5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1' }, { ...hosted, video_id: '../5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f' },
    { ...youtube, provider: 'vimeo' }, { ...youtube, provider: undefined }, { ...youtube, src: 'https://example.com' },
    { ...youtube, duration: 0 }, { ...youtube, duration: 1.5 }, { ...youtube, duration: 86401 },
  ];
  for (const content of refused) {
    assert.equal(accepts(content), false, JSON.stringify(content));
    assert.throws(() => videoUrls(content as never), JSON.stringify(content));
  }
  assert.equal(StoryComponentSchema.safeParse({ component: 'Film', content: youtube }).success, false, 'Film is gone, not aliased');
});

test('a duration reads as a clock', () => {
  assert.equal(durationLabel(81), '1:21');
  assert.equal(durationLabel(5), '0:05');
  assert.equal(durationLabel(3723), '1:02:03');
});

test('the as-of label reads the story\'s own offset and never the reader\'s zone', () => {
  assert.equal(asOfLabel('2026-10-10T14:02:00-07:00'), '10 Oct 2026, 14:02');
  assert.equal(asOfLabel('2026-10-10T21:02:00Z'), '10 Oct 2026, 21:02');
  assert.equal(asOfLabel('not a time'), 'not a time');
});

test('a photo set holds two to twenty photographs, each once and each with its alt (#40)', () => {
  const set = story.telling[9].content;
  const photos = (next: unknown[]) => StoryComponentSchema.safeParse({ component: 'Photos', content: { ...set, photos: next } }).success;
  const one = set.photos[0];
  const numbered = (count: number) => Array.from({ length: count }, (_, index) => ({ ...one, image_id: `6f1a2b3c-4d5e-4f60-8a71-${String(index).padStart(12, '0')}` }));
  assert(photos(set.photos.slice(0, 2)), 'two');
  assert(photos(numbered(20)), 'twenty');
  assert(!photos(set.photos.slice(0, 1)), 'one is a Figure');
  assert(!photos(numbered(21)), 'twenty-one');
  assert(!photos([one, { ...one, image_id: one.image_id.toUpperCase() }]), 'the same photograph twice');
  assert(!photos([one, { ...set.photos[1], alt: ' ' }]), 'a blank alt');
  assert(!StoryComponentSchema.safeParse({ component: 'Photos', content: { ...set, html: '<b>no</b>' } }).success, 'an unknown key');
});

test('a Figure may carry a web address to open when tapped, and a photograph in a set may not', () => {
  const figure = (content: Record<string, unknown>) => StoryComponentSchema.safeParse({ component: 'Figure', content: { image_id: '11111111-1111-4111-8111-111111111111', alt: 'Flags', ...content } }).success;
  assert(figure({}), 'no link');
  assert(figure({ link: 'https://jiffylube.egifter.com/' }), 'an https address');
  assert(!figure({ link: 'javascript:alert(1)' }), 'a script');
  assert(!figure({ link: 'mailto:hi@example.com' }), 'an email address');
  assert(!figure({ link: '/teams/2026/' }), 'a relative address');
  const set = story.telling[9].content;
  assert(!StoryComponentSchema.safeParse({ component: 'Photos', content: { ...set, photos: set.photos.map((photo: object) => ({ ...photo, link: 'https://example.com/' })) } }).success, 'a set photograph');
});
