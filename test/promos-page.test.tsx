import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { PromosFeedDocumentSchema } from '../src/promos.ts';
import { PromoBand, PromosHero, PromoSheet } from '../src/ui/promos-page.tsx';

const fixture = PromosFeedDocumentSchema.parse(JSON.parse(readFileSync(new URL('./fixtures/promos.v1.json', import.meta.url), 'utf8')));
const [giftCard, hat, shop] = fixture.records.map(({ payload }) => payload);
const photo = { src: '/images/3b9d05f2-2136-43aa-8626-fd9759e7b4a4/1920', alt: 'Mountains' };

test('the hero draws the page\'s heading, what it is given above it, and the first offer beside it', () => {
  const html = renderToStaticMarkup(
    <PromosHero lineA="Rebelle Rally" lineB="Promos" promo={giftCard} photo={photo}>
      <nav>crumbs</nav>
    </PromosHero>,
  );
  assert.match(html, /<h1 id="promos-title">Rebelle Rally <em>Promos<\/em><\/h1>/);
  assert.ok(html.indexOf('<nav>crumbs</nav>') < html.indexOf('<h1'));
  assert.ok(html.indexOf('<h1') < html.indexOf('data-promo="1"'));
  assert.match(html, /<img src="\/images\/3b9d05f2[^"]+" sizes="100vw" fetchPriority="high" alt="Mountains"\/>/);
});

test('a sponsor\'s offer opens on its mark for a dark ground, linked to its site in a new tab', () => {
  const html = renderToStaticMarkup(<PromoSheet promo={giftCard} />);
  assert.match(html, /^<div class="fgi fgi--settle rr-promo" data-promo="1"><a class="rr-promo__mark" href="https:\/\/www.jiffylube.com\/" target="_blank" rel="noopener"><img src="\/images\/bf62abeb-[^"]+" alt="Jiffy Lube" width="145" height="97"/);
});

test('every mark covers about the same area, and a long wordmark stops at 240 wide', () => {
  const white = { ...giftCard.sponsor!.logos.white!, width: 2560, height: 605 };
  const wide = { ...giftCard, sponsor: { ...giftCard.sponsor!, logos: { ...giftCard.sponsor!.logos, white } } };
  assert.match(renderToStaticMarkup(<PromoSheet promo={wide} />), /alt="Jiffy Lube" width="240" height="57"/);
});

test('the words keep WordPress\'s bold code and its link, and the line and button follow', () => {
  const html = renderToStaticMarkup(<PromoSheet promo={giftCard} />);
  assert.match(html, /purchase a \$100 <a href="https:\/\/www.jiffylube.com\/" target="_blank" rel="noopener"><strong>Jiffy Lube<\/strong><\/a> Gift Card for \$70 using promo code <strong>REBELLE2026<\/strong> through/);
  assert.match(html, /<p class="rr-promo__valid">Offer valid through 10\/31\/2026.<\/p>/);
  assert.match(html, /<a class="rr-btn rr-btn--primary rr-btn--lg rr-promo__go" href="https:\/\/jiffylube.egifter.com\/" target="_blank" rel="noopener">Shop Now <span aria-hidden="true">↗<\/span><\/a>/);
});

test('an offer with no sponsor opens on its heading, and a link to the Rebelle stays in the tab with →', () => {
  const html = renderToStaticMarkup(<PromoSheet promo={shop} />);
  assert.match(html, /<h2 class="rr-promo__heading">Rebelle Shop<\/h2>/);
  assert.match(html, /<a href="https:\/\/wp.rebellerally.com\/shop\/">Rebelle shop<\/a>/);
  assert.match(html, /href="https:\/\/wp.rebellerally.com\/shop\/">Visit the Shop <span aria-hidden="true">→<\/span><\/a>/);
});

test('a sponsor with only a color mark draws it on a plate, and one with no mark draws its name', () => {
  const colorOnly = { ...hat, sponsor: { ...hat.sponsor!, logos: { white: null, dark: null, color: hat.sponsor!.logos.color } } };
  assert.match(renderToStaticMarkup(<PromoSheet promo={colorOnly} />), /class="rr-promo__mark rr-promo__mark--plated"/);
  const noMark = { ...hat, sponsor: { ...hat.sponsor!, logos: { white: null, dark: null, color: null } } };
  assert.match(renderToStaticMarkup(<PromoSheet promo={noMark} />), /<h2 class="rr-promo__heading">Jiffy Lube<\/h2>/);
});

test('a later offer is a band over its own photograph, named for who it is from', () => {
  const html = renderToStaticMarkup(<PromoBand promo={hat} photo={{ src: '/images/50bc8657-e859-4fbd-88ba-3c9982dc62e7/1920', alt: 'Dunes' }} />);
  assert.match(html, /^<section class="rr-promo-band" aria-label="Jiffy Lube"><div class="photo-ground rr-promo-band__ground"><img src="\/images\/50bc8657[^"]+" sizes="100vw" loading="lazy" decoding="async" alt="Dunes"\/>/);
  assert.match(html, /<p class="rr-promo__valid">Offer valid through 8\/20\/2027.<\/p>/);
});
