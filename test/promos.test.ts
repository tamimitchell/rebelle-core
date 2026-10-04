import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { currentPromos, pacificDay, PromosFeedDocumentSchema, validLine } from '../src/promos.ts';

// WordPress's two Jiffy Lube offers (wp.rebellerally.com/promos/, 2026-10-04) and a headed one with no sponsor.
const fixture = JSON.parse(readFileSync(new URL('./fixtures/promos.v1.json', import.meta.url), 'utf8'));
const withPayload = (index: number, change: Record<string, unknown>) => {
  const document = structuredClone(fixture);
  Object.assign(document.records[index].payload, change);
  return document;
};

test('the fixture reads, its offers in their order', () => {
  const document = PromosFeedDocumentSchema.parse(fixture);
  assert.deepEqual(document.records.map(({ payload }) => payload.position), [1, 2, 3]);
  assert.equal(document.records[2].payload.sponsor, null);
  assert.equal(document.records[2].payload.heading, 'Rebelle Shop');
});

test('an offer with no sponsor needs a heading', () => {
  const result = PromosFeedDocumentSchema.safeParse(withPayload(2, { heading: null }));
  assert.equal(result.success, false);
  assert.match(JSON.stringify(result.error?.issues), /an offer without a sponsor has a heading/);
});

test('a button links over https, an end date is a real day, and each place is taken once', () => {
  assert.equal(PromosFeedDocumentSchema.safeParse(withPayload(0, { button: { label: 'Shop Now', href: 'http://jiffylube.egifter.com/' } })).success, false);
  assert.equal(PromosFeedDocumentSchema.safeParse(withPayload(0, { ends_on: '2026-02-30' })).success, false);
  assert.equal(PromosFeedDocumentSchema.safeParse(withPayload(0, { ends_on: '10/31/2026' })).success, false);
  assert.equal(PromosFeedDocumentSchema.safeParse(withPayload(1, { position: 1 })).success, false);
});

test('a photo is a studio image, and nothing else rides in an offer', () => {
  assert.equal(PromosFeedDocumentSchema.safeParse(withPayload(0, { photo: { id: 'mountains.jpg', alt: 'Mountains' } })).success, false);
  assert.equal(PromosFeedDocumentSchema.safeParse(withPayload(0, { shown: true })).success, false);
});

test('an offer shows through its end date and is gone the day after', () => {
  const document = PromosFeedDocumentSchema.parse(fixture);
  const shown = (day: string) => currentPromos(document, day).map(({ position }) => position);
  assert.deepEqual(shown('2026-10-04'), [1, 2, 3]);
  assert.deepEqual(shown('2026-10-31'), [1, 2, 3]);
  assert.deepEqual(shown('2026-11-01'), [2, 3]);
  assert.deepEqual(shown('2027-08-21'), []);
});

test('the day turns over at midnight Pacific, not UTC', () => {
  assert.equal(pacificDay(new Date('2026-11-01T06:59:00Z')), '2026-10-31');
  assert.equal(pacificDay(new Date('2026-11-01T07:00:00Z')), '2026-11-01');
});

test('the valid line reads as WordPress wrote it', () => {
  assert.equal(validLine('2026-10-31'), 'Offer valid through 10/31/2026.');
  assert.equal(validLine('2027-08-20'), 'Offer valid through 8/20/2027.');
});
