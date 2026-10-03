import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEFAULT_BAND, PARTNER_TIERS, PartnersFeedDocumentSchema, balancedColumns, bandRows, logoWidth, partnersOf } from '../src/partners.ts';
import { PartnersBand } from '../src/ui/partners.tsx';

// Emitted by the studio's writer (studio `spec/fixtures/feeds/rebelle_partners_feed.json`, #414).
const fixture = JSON.parse(readFileSync(new URL('./fixtures/partners.json', import.meta.url), 'utf8'));
const partners = partnersOf(PartnersFeedDocumentSchema.parse(fixture)).partners;
const band = DEFAULT_BAND;
const head = { kicker: 'Partners', lineA: 'Powered by', lineB: 'the best.' };

test('bandRows draws a row for each level with a mark to show, top level first, each with its dark mark or its white one', () => {
  const rows = bandRows(partners);
  assert.deepEqual(rows.map((row) => [row.tier, row.logos.map((logo) => logo.key)]), [
    ['gold', ['pennzoil']],
    ['silver-oem', ['bmw']],
    ['supplier', ['hest']],
  ]);
  const [pennzoil, mini] = partners;
  assert.equal(rows[0].logos[0].src, pennzoil.logos.dark?.url);
  assert.equal(rows[0].logos[0].href, 'https://www.pennzoil.com/');
  assert.equal(rows[1].logos[0].src, mini.logos.white?.url);
});

test('bandRows keeps the levels in order whatever order the partners arrive in', () => {
  assert.deepEqual(bandRows([...partners].reverse()).map((row) => row.tier), ['gold', 'silver-oem', 'supplier']);
});

test('bandRows gives each row as many marks a line as it has, up to its level\'s most', () => {
  assert.deepEqual(bandRows(partners)[0].columns, { wide: 1, mid: 1, narrow: 1 });
  const nine = Array.from({ length: 9 }, (_, index) => ({ ...partners[3], key: `supplier-${index}` }));
  assert.deepEqual(bandRows(nine)[0].columns, { wide: 9, mid: 5, narrow: 3 });
});

test('bandRows links a partner without a site to the fallback, and leaves out one with nothing to draw on glass', () => {
  const [first, second] = partners;
  const unlinked = { ...first, link: null };
  const markless = { ...second, logos: { ...second.logos, white: null, dark: null } };
  const [row] = bandRows([unlinked, markless]);
  assert.equal(row.logos.length, 1);
  assert.equal(row.logos[0].href, '/partners');
  assert.equal(bandRows([unlinked], { fallbackHref: '/home/partners/' })[0].logos[0].href, '/home/partners/');
});

test('balancedColumns shares a level that wraps evenly across its lines', () => {
  assert.equal(balancedColumns(6, 5), 3);
  assert.equal(balancedColumns(5, 3), 3);
  assert.equal(balancedColumns(4, 3), 2);
  assert.equal(balancedColumns(9, 5), 5);
  assert.equal(balancedColumns(4, 6), 4);
});

test('logoWidth gives every logo in a row the same area, capped at the row maximum', () => {
  const mark = (width?: number, height?: number) => ({ url: '/images/x/640', alt: 'x', width, height });
  assert.equal(logoWidth(mark(2000, 1000), 'silver'), Math.round(Math.sqrt(3250 * 2)));
  assert.equal(logoWidth(mark(1000, 100), 'silver'), 152);
  assert.equal(logoWidth(mark(1000, 1000), 'supplier'), Math.round(Math.sqrt(735)));
  assert.equal(logoWidth(mark(1000, 100), 'supplier'), 73);
  assert.equal(logoWidth(mark(), 'silver'), Math.round(Math.sqrt(3250 * 3)), 'a mark without its pixels reads as a three-to-one wordmark');
  for (const shape of [mark(1000, 1000), mark(1000, 100)]) {
    const widths = PARTNER_TIERS.map((tier) => logoWidth(shape, tier));
    assert.deepEqual(widths, [...widths].sort((a, b) => b - a), 'each level no larger than the one above it');
  }
});

test('PartnersBand draws the head, the link and a row a level, each mark carrying its partner\'s key', () => {
  const html = renderToStaticMarkup(
    <PartnersBand partners={partners} head={head} link={{ href: '/partners', label: 'Meet our partners' }} photo={{ src: '/images/p/1920', alt: 'Mountains' }} />,
  );
  assert.match(html, /<section class="photo-ground rr-partners" aria-labelledby="partners-title">/);
  assert.match(html, /<h2 id="partners-title">Powered by<em>the best\.<\/em><\/h2>/);
  assert.match(html, /<a class="rr-link rr-partners__link" href="\/partners"><span>Meet our partners<\/span>/);
  assert.deepEqual([...html.matchAll(/rr-partners__row--([\w-]+)/g)].map((match) => match[1]), ['gold', 'silver-oem', 'supplier']);
  assert.deepEqual([...html.matchAll(/data-partner="([\w-]+)"/g)].map((match) => match[1]), ['pennzoil', 'bmw', 'hest']);
  assert.match(html, /style="--cols-wide:1;--cols-mid:1;--cols-narrow:1;--cell:412px"/);
  assert.match(html, /alt="Mountains"/);
});

test('PartnersBand without partners keeps its head and link and draws no panel', () => {
  const html = renderToStaticMarkup(<PartnersBand partners={[]} head={head} link={{ href: '/partners', label: 'Meet our partners' }} />);
  assert.match(html, /Powered by/);
  assert.doesNotMatch(html, /rr-partners__glass/);
  assert.doesNotMatch(html, /<img/);
});

test('bandRows scales each mark by its level\'s size and its own band_scale, and widens the level\'s cell with it', () => {
  const [plain] = bandRows(partners);
  const [doubled] = bandRows(partners, { band: { ...band, sizes: { ...band.sizes, gold: 200 } } });
  const mark = partners[0].logos.dark!;
  assert.equal(plain.logos[0].width, logoWidth(mark, 'gold'));
  assert.equal(doubled.logos[0].width, logoWidth(mark, 'gold', 2));
  assert.ok(Math.abs(doubled.logos[0].width - plain.logos[0].width * 2) <= 1, 'twice the size, rounded once');
  assert.equal(plain.cell, 412);
  assert.equal(doubled.cell, 772);
  const nudged = partners.map((each) => (each.key === 'pennzoil' ? { ...each, band_scale: 150 } : each));
  assert.equal(bandRows(nudged)[0].logos[0].width, logoWidth(mark, 'gold', 1.5));
  assert.equal(bandRows(nudged, { band: { ...band, sizes: { ...band.sizes, gold: 200 } } })[0].logos[0].width, logoWidth(mark, 'gold', 3), 'a level\'s size and a nudge multiply');
  assert.equal(bandRows(nudged)[0].cell, 592, 'a nudged mark widens its row\'s cell');
  assert.equal(bandRows(nudged.map((each) => ({ ...each, band_scale: 50 })))[0].cell, 412, 'a smaller mark leaves the level\'s cell');
});

test('bandRows in white draws the white mark where a partner has one, else its dark one', () => {
  const [pennzoil] = partners;
  const [colored] = bandRows(partners);
  const [white] = bandRows(partners, { band: { ...band, logo_style: 'white' } });
  assert.equal(colored.logos[0].src, pennzoil.logos.dark?.url);
  assert.equal(white.logos[0].src, pennzoil.logos.white?.url);
  const darkOnly = { ...pennzoil, logos: { ...pennzoil.logos, white: null } };
  assert.equal(bandRows([darkOnly], { band: { ...band, logo_style: 'white' } })[0].logos[0].src, pennzoil.logos.dark?.url);
});

test('PartnersBand sets each row\'s cell from its level\'s size, and a scaled mark\'s --scale for the narrow caps', () => {
  const html = renderToStaticMarkup(<PartnersBand band={{ ...band, sizes: { ...band.sizes, gold: 150 } }} head={head} partners={partners} />);
  assert.match(html, /--cell:592px/);
  assert.match(html, /<li style="--scale:1.5"><a class="rr-partners__mark" href="[^"]*" data-partner="pennzoil">/);
  assert.match(renderToStaticMarkup(<PartnersBand head={head} partners={partners} />), /<li><a class="rr-partners__mark" href="[^"]*" data-partner="pennzoil">/, 'no --scale at the defaults');
});
