import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { PartnersFeedDocumentSchema, partnersOf, type Partner } from '../src/partners.ts';
import { PartnerProfiles, PartnerRoster, PartnersHero } from '../src/ui/partners-page.tsx';

// Schema 4 (studio #641): Pennzoil is Gold with a profile; MINI and Synchrony Silver OEM; HEST a supplier.
const fourth = JSON.parse(readFileSync(new URL('./fixtures/partners.v4.json', import.meta.url), 'utf8'));
const { partners, page } = partnersOf(PartnersFeedDocumentSchema.parse(fourth));
const [pennzoil, mini, synchrony, hest] = partners;
const gold = (key: string, extra: Partial<Partner> = {}): Partner => ({ ...pennzoil, key, name: key, ...extra });

test('the hero draws the page\'s name, its lead where an editor can find it, and what it is given above the heading', () => {
  const html = renderToStaticMarkup(
    <PartnersHero lineA="Our" lineB="Partners" lead={page.lead}>
      <nav>crumbs</nav>
    </PartnersHero>,
  );
  assert.match(html, /<h1 id="partners-title">Our<em>Partners<\/em><\/h1>/);
  assert.match(html, /<p class="rr-pp-hero__lead" data-field="lead">All Rebelle Rally partners/);
  assert.ok(html.indexOf('<nav>crumbs</nav>') < html.indexOf('<h1'));
});

test('each Gold partner gets a profile: its color logo on paper, its name, its profile and a door to its site in a new tab', () => {
  const html = renderToStaticMarkup(<PartnerProfiles partners={partners} />);
  assert.equal((html.match(/<article /g) ?? []).length, 1, 'only Gold partners have profiles');
  assert.match(html, /<article class="rr-pp-profile terrain tp-worn rr-pp--paper" aria-labelledby="partner-pennzoil" data-partner="pennzoil">/);
  assert.ok(html.includes(`src="${pennzoil.logos.color?.url}"`));
  assert.match(html, /<h3 id="partner-pennzoil">Pennzoil<\/h3><p>Pennzoil is an all-encompassing partner/);
  assert.match(html, /<a class="rr-btn rr-btn--md rr-btn--primary rr-g-terrain" href="https:\/\/www.pennzoil.com\/" target="_blank" rel="noopener">Visit Pennzoil <span aria-hidden="true">↗<\/span><\/a>/);
});

test('the profiles alternate paper and navy, a navy one drawing the dark-ground logo', () => {
  const html = renderToStaticMarkup(<PartnerProfiles partners={[gold('one'), gold('two'), gold('three')]} />);
  assert.deepEqual([...html.matchAll(/rr-pp--(paper|navy)/g)].map((match) => match[1]), ['paper', 'navy', 'paper']);
  assert.ok(html.includes(`src="${pennzoil.logos.dark?.url}"`));
  assert.match(html, /class="rr-btn rr-btn--md rr-btn--primary" href/, 'on navy the primary is the cyan one');
});

test('a partner without a profile or a site keeps its name and its logo, unlinked', () => {
  const html = renderToStaticMarkup(<PartnerProfiles partners={[gold('quiet', { profile: null, link: null })]} />);
  assert.doesNotMatch(html, /<p>/);
  assert.doesNotMatch(html, /Visit|href=/);
  assert.match(html, /<span class="rr-pp-mark" data-partner="quiet"><img /);
  assert.match(renderToStaticMarkup(<PartnerRoster partners={[{ ...hest, link: null }]} />), /<span class="rr-pp-mark" data-partner="hest">/);
  assert.equal(renderToStaticMarkup(<PartnerProfiles partners={[mini, hest]} />), '', 'no Gold partners, no section');
});

test('the roster draws every level after Gold, a row each, carrying on the alternation from the profiles', () => {
  const html = renderToStaticMarkup(<PartnerRoster partners={partners} />);
  assert.deepEqual([...html.matchAll(/rr-pp-level--([a-z-]+) [a-z -]*rr-pp--(paper|navy)/g)].map((match) => [match[1], match[2]]), [
    ['silver-oem', 'navy'],
    ['supplier', 'paper'],
  ]);
  assert.doesNotMatch(html, /data-partner="pennzoil"/);
  assert.match(html, /data-partner="bmw"/);
  assert.doesNotMatch(html, /<h3/, 'the levels are not named, as on WordPress');
});

test('on paper the roster draws a color logo, puts a logo with no color version on a navy plate, and skips a partner with no logo', () => {
  const colored = { ...mini, logos: { ...mini.logos, color: pennzoil.logos.color } };
  const colorless = { ...hest, tier: 'silver-oem' as const };
  const html = renderToStaticMarkup(<PartnerRoster partners={[colored, synchrony, colorless]} />);
  assert.match(html, /rr-pp-level--silver-oem terrain/, 'with no Gold partners, the first row is paper');
  assert.ok(html.includes(`src="${pennzoil.logos.color?.url}"`));
  assert.match(html, /<li class="rr-pp-plate"><a class="rr-pp-mark" href="https:\/\/hest.com\/"/);
  assert.doesNotMatch(html, /data-partner="synchrony"/);
});

test('on navy a partner with only a color logo keeps it, on a paper plate, and a level with nothing to draw takes no row', () => {
  const colorOnly = { ...mini, tier: 'supplier' as const, logos: { white: null, dark: null, color: pennzoil.logos.color } };
  const blank = { ...synchrony, tier: 'silver' as const };
  const html = renderToStaticMarkup(<PartnerRoster partners={[{ ...hest, tier: 'bronze' as const }, blank, colorOnly]} />);
  assert.deepEqual([...html.matchAll(/rr-pp-level--([a-z-]+) [a-z -]*rr-pp--(paper|navy)/g)].map((match) => [match[1], match[2]]), [
    ['bronze', 'paper'],
    ['supplier', 'navy'],
  ]);
  assert.match(html, /<li class="rr-pp-plate"><a class="rr-pp-mark" href="https:\/\/www.miniusa.com\/" data-partner="bmw"/);
});

test('the roster shares a wrapping level evenly, sizes logos as WordPress did, and takes each partner\'s own nudge', () => {
  const nine = Array.from({ length: 9 }, (_, index) => ({ ...hest, key: `supplier-${index}` }));
  const html = renderToStaticMarkup(<PartnerRoster partners={nine} />);
  assert.match(html, /--cols-wide:5;--cols-mid:3;--cols-narrow:3/);
  const width = (partner: Partner) => Number(renderToStaticMarkup(<PartnerRoster partners={[partner]} />).match(/width="(\d+)"/)?.[1]);
  const square = { url: '/images/x/640', alt: 'x', width: 1000, height: 1000 };
  const wordmark = { url: '/images/x/640', alt: 'x', width: 4000, height: 400 };
  assert.equal(width({ ...hest, tier: 'bronze', band_scale: 100, logos: { white: square, color: square, dark: null } }), Math.round(Math.sqrt(17000)), 'a square bronze logo covers the level\'s area');
  assert.equal(width({ ...hest, tier: 'bronze', band_scale: 100, logos: { white: wordmark, color: wordmark, dark: null } }), 200, 'a long wordmark stops at the level\'s widest');
  assert.equal(width({ ...hest, tier: 'bronze', band_scale: 150, logos: { white: square, color: square, dark: null } }), Math.round(Math.sqrt(17000) * 1.5));
});

test('a Gold logo fills its column, as WordPress\'s did, unless it would stand taller than the column allows', () => {
  const at = (mark: { width: number; height: number }) =>
    Number(renderToStaticMarkup(<PartnerProfiles partners={[gold('g', { logos: { ...pennzoil.logos, color: { url: '/images/g/640', alt: 'g', ...mark } } })]} />).match(/width="(\d+)"/)?.[1]);
  assert.equal(at({ width: 2000, height: 1134 }), 500);
  assert.equal(at({ width: 1000, height: 1000 }), 300);
});

test('the hero marks the film\'s place for the page to play, and draws none without one', () => {
  const html = renderToStaticMarkup(<PartnersHero lead={page.lead} lineA="Our" video={{ vimeo: '886564623', start: 20, end: 60 }} />);
  assert.match(html, /<div class="rr-pp-hero__video" aria-hidden="true" data-vimeo="886564623" data-start="20" data-end="60"><\/div>/);
  assert.doesNotMatch(renderToStaticMarkup(<PartnersHero lead={page.lead} lineA="Our" />), /rr-pp-hero__video|iframe/);
});
