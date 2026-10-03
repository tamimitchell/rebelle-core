import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SponsorLogosSchema, SponsorSchema } from '../src/dispatch.ts';
import { DEFAULT_BAND, DEFAULT_PARTNERS_PAGE, PARTNER_TIERS, PartnerSchema, PartnersFeedDocumentSchema, partnersOf } from '../src/partners.ts';

// Emitted by the studio's writer (studio `spec/fixtures/feeds/rebelle_partners_feed.json`, #414).
const fixture = JSON.parse(readFileSync(new URL('./fixtures/partners.json', import.meta.url), 'utf8'));
// Schema 3: the band's settings and each partner's band_scale (studio #638).
const third = JSON.parse(readFileSync(new URL('./fixtures/partners.v3.json', import.meta.url), 'utf8'));
// Schema 4: the Partners page's words and each partner's profile (studio #641).
const fourth = JSON.parse(readFileSync(new URL('./fixtures/partners.v4.json', import.meta.url), 'utf8'));
const partner = fourth.records[0].payload;
const withRecords = (records: unknown[]) => ({ ...fourth, records });

test('the partners document parses: level by level, in order, each with three marks or null', () => {
  const document = PartnersFeedDocumentSchema.parse(fixture);
  assert.deepEqual(PARTNER_TIERS, ['gold', 'silver-oem', 'silver', 'bronze', 'supplier']);
  assert.deepEqual([...new Set(document.records.map((record) => record.payload.tier))], ['gold', 'silver-oem', 'supplier']);
  const positions = document.records.map((record) => record.payload.position);
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.deepEqual(Object.keys(document.records[0].payload.logos), ['white', 'color', 'dark']);
});

test('a tier outside the levels, a missing mark or a stray day is refused', () => {
  assert.equal(PartnerSchema.safeParse({ ...partner, tier: 'partner' }).success, false, 'the two rows before the levels');
  assert.equal(PartnerSchema.safeParse({ ...partner, tier: 'Silver OEM' }).success, false, 'a level by its key, not its name');
  assert.equal(PartnerSchema.safeParse({ ...partner, tier: null }).success, false);
  assert.equal(PartnerSchema.safeParse({ ...partner, logos: { white: null, color: null } }).success, false, 'all three marks are named');
  assert.equal(PartnerSchema.safeParse({ ...partner, presents: [{ rally_year: 2026, day: 8 }] }).success, false, 'no day rides in this feed');
  assert.equal(PartnerSchema.safeParse({ ...partner, position: 0 }).success, false);
});

test('each partner is listed once, in its place, in either schema', () => {
  const [first, second] = fourth.records;
  assert.equal(PartnersFeedDocumentSchema.safeParse(withRecords([second, first])).success, false, 'out of order');
  assert.equal(PartnersFeedDocumentSchema.safeParse(withRecords([first, { ...second, payload: { ...second.payload, position: first.payload.position } }])).success, false, 'a shared place');
  assert.equal(PartnersFeedDocumentSchema.safeParse(withRecords([first, { ...second, payload: { ...second.payload, key: first.payload.key } }])).success, false, 'a partner twice');
  const [older, next] = fixture.records;
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...fixture, records: [next, older] }).success, false, 'out of order in schema 2');
});

test('the rally days sponsor keeps its two marks: a dark mark there is still refused', () => {
  const white = partner.logos.white;
  assert.equal(SponsorLogosSchema.safeParse({ white, color: null, dark: null }).success, false);
  const { position: _position, band_scale: _scale, profile: _profile, ...sponsor } = partner;
  assert.equal(SponsorSchema.safeParse(sponsor).success, false);
  assert.equal(SponsorSchema.safeParse({ ...sponsor, logos: { white, color: null } }).success, true);
});

test('schema 3 carries the band\'s settings and each partner\'s band_scale; schema 2 reads as the defaults', () => {
  const read = partnersOf(PartnersFeedDocumentSchema.parse(third));
  assert.deepEqual(read.band, { logo_style: 'white', sizes: { gold: 150, 'silver-oem': 115, silver: 95, bronze: 80, supplier: 70 } });
  assert.deepEqual(read.partners.map((each) => each.band_scale), [100, 100, 100, 140]);

  const older = partnersOf(PartnersFeedDocumentSchema.parse(fixture));
  assert.deepEqual(older.band, DEFAULT_BAND);
  assert.ok(older.partners.every((each) => each.band_scale === 100));
});

test('a band setting or a band_scale outside 50 to 200, or a schema 2 record carrying one, is refused', () => {
  assert.equal(PartnerSchema.safeParse({ ...partner, band_scale: 49 }).success, false);
  assert.equal(PartnerSchema.safeParse({ ...partner, band_scale: 201 }).success, false);
  assert.equal(PartnerSchema.safeParse({ ...partner, band_scale: 1.5 }).success, false);
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...third, band: { ...third.band, logo_style: 'black' } }).success, false);
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...third, band: { ...third.band, sizes: { ...third.band.sizes, gold: 300 } } }).success, false);
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...third, band: undefined }).success, false, 'schema 3 names its band');
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...fixture, band: third.band }).success, false, 'schema 2 has no band');
  const [first] = fixture.records;
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...fixture, records: [{ ...first, payload: { ...first.payload, band_scale: 100 } }] }).success, false, 'a schema 2 record has no band_scale');
});

test('schema 4 carries the page\'s words and each partner\'s profile; older schemas read as WordPress\'s words and no profiles', () => {
  const read = partnersOf(PartnersFeedDocumentSchema.parse(fourth));
  assert.deepEqual(read.page, { lead: 'All Rebelle Rally partners are deeply vetted for authenticity and quality.' });
  assert.deepEqual(read.partners.map((each) => each.profile), ['Pennzoil is an all-encompassing partner of the Rebelle Rally ecosystem.', null, null, null]);
  assert.equal(read.partners[0].blurb, null, 'the profile is its own field, not the blurb');

  for (const older of [third, fixture]) {
    const { page, partners } = partnersOf(PartnersFeedDocumentSchema.parse(older));
    assert.deepEqual(page, DEFAULT_PARTNERS_PAGE);
    assert.ok(partners.every((each) => each.profile === null));
  }
});

test('a profile or a lead that is empty or too long, or a schema 3 document carrying either, is refused', () => {
  assert.equal(PartnerSchema.safeParse({ ...partner, profile: '' }).success, false);
  assert.equal(PartnerSchema.safeParse({ ...partner, profile: 'x'.repeat(1201) }).success, false);
  assert.equal(PartnerSchema.safeParse({ ...partner, profile: 'x'.repeat(1200) }).success, true);
  assert.equal(PartnerSchema.safeParse({ ...partner, profile: undefined }).success, false, 'a profile is named, null when there is none');
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...fourth, page: { lead: '' } }).success, false);
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...fourth, page: { lead: 'x'.repeat(601) } }).success, false);
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...fourth, page: undefined }).success, false, 'schema 4 names its page');
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...third, page: fourth.page }).success, false, 'schema 3 has no page');
  const [first] = third.records;
  assert.equal(PartnersFeedDocumentSchema.safeParse({ ...third, records: [{ ...first, payload: { ...first.payload, profile: null } }] }).success, false, 'a schema 3 record has no profile');
});
