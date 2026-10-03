import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SponsorLogosSchema, SponsorSchema } from '../src/dispatch.ts';
import { PARTNER_TIERS, PartnerSchema, PartnersFeedDocumentSchema } from '../src/partners.ts';

// Emitted by the studio's writer (studio `spec/fixtures/feeds/rebelle_partners_feed.json`, #414).
const fixture = JSON.parse(readFileSync(new URL('./fixtures/partners.json', import.meta.url), 'utf8'));
const partner = fixture.records[0].payload;
const withRecords = (records: unknown[]) => ({ ...fixture, records });

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

test('each partner is listed once, in its place', () => {
  const [first, second] = fixture.records;
  assert.equal(PartnersFeedDocumentSchema.safeParse(withRecords([second, first])).success, false, 'out of order');
  assert.equal(PartnersFeedDocumentSchema.safeParse(withRecords([first, { ...second, payload: { ...second.payload, position: first.payload.position } }])).success, false, 'a shared place');
  assert.equal(PartnersFeedDocumentSchema.safeParse(withRecords([first, { ...second, payload: { ...second.payload, key: first.payload.key } }])).success, false, 'a partner twice');
});

test('the rally days sponsor keeps its two marks: a dark mark there is still refused', () => {
  const white = partner.logos.white;
  assert.equal(SponsorLogosSchema.safeParse({ white, color: null, dark: null }).success, false);
  const { position: _position, ...sponsor } = partner;
  assert.equal(SponsorSchema.safeParse(sponsor).success, false);
  assert.equal(SponsorSchema.safeParse({ ...sponsor, logos: { white, color: null } }).success, true);
});
