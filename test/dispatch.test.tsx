import * as React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { DispatchesFeedDocumentSchema, DispatchPayloadSchema, MarkSchema, SPONSOR_LOCKUPS, SponsorSchema, dispatchArchiveKey, parseDispatchDraft } from '../src/dispatch.ts';
import { DispatchView, SponsorLockup } from '../src/ui/dispatch.tsx';
const fixture = JSON.parse(readFileSync(new URL('./fixtures/dispatches.json', import.meta.url), 'utf8'));
const records = DispatchesFeedDocumentSchema.parse(fixture).records;
test('the Studio schema-2 writer fixture draws all six operational kinds', () => {
  assert.deepEqual(records.map(row => row.payload.kind), ['update','gallery','quote','checkpoint','video','video','recap']);
  for (const row of records) {
    const before = JSON.stringify(row.payload);
    const html = renderToStaticMarkup(<DispatchView dispatch={row.payload} />);
    assert.ok(html.includes('live-entry'));
    assert.ok(!html.includes('authorship'));
    assert.equal(JSON.stringify(row.payload), before);
  }
  const quote = renderToStaticMarkup(<DispatchView dispatch={records[2].payload} />);
  assert.ok(quote.includes('Sabrina Howells, #172'));
  const recap = renderToStaticMarkup(<DispatchView dispatch={records.find(row => row.payload.kind === 'recap')!.payload} />);
  assert.ok(recap.includes('The plot twist'));
  assert.ok(recap.includes('OPEN · THE STORY'));
  assert.ok(recap.includes('ALL TEAMS IN CAMP'));
});
test('a quote is the navy band: the star, its words in one pair of marks, and who said it', () => {
  const quote = records[2].payload;
  const typed = renderToStaticMarkup(<DispatchView dispatch={quote} />);
  assert.ok(typed.includes('<article class="live-entry live-entry--quote navy-flat">'));
  assert.ok(typed.includes('<figure class="rr-quote on-dark live-entry__quote"><span class="rr-star live-entry__star" aria-hidden="true"></span><blockquote>“Now she hands me a roadbook full of pictures and says find this mountain.”</blockquote><cite>Sabrina Howells, #172</cite></figure>'));
  const transcribed = renderToStaticMarkup(<DispatchView dispatch={{ ...quote, text: 'What is a road? What is a topo line?' }} />);
  assert.ok(transcribed.includes('<blockquote>“What is a road? What is a topo line?”</blockquote>'));
  const partner = renderToStaticMarkup(<DispatchView dispatch={{ ...quote, source: 'sponsor', sponsor: 'pirelli' }} />);
  assert.ok(partner.includes('live-entry--partner'));
  assert.ok(!partner.includes('live-entry--quote'));
  assert.ok(partner.includes('<blockquote>'));
});
test('a closed day\'s archive parses with the live document\'s shape, and its key has to name the document\'s day', () => {
  assert.equal(dispatchArchiveKey(2026, 3), 'rebelle_live.dispatches.2026.day3');
  const archive = { ...fixture, feed_key: dispatchArchiveKey(2026, fixture.day) };
  assert.equal(DispatchesFeedDocumentSchema.safeParse(archive).success, true);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({ ...archive, day: fixture.day === 0 ? 1 : 0 }).success, false);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({ ...fixture, feed_key: 'rebelle_live.dispatches.2025' }).success, false);
  for (const key of ['rebelle_live.dispatches.2026.day9', 'rebelle_live.dispatches.2026.day03', 'rebelle_live.dispatches.2026.day', 'rebelle_live.dispatches.day3']) {
    assert.equal(DispatchesFeedDocumentSchema.safeParse({ ...fixture, feed_key: key }).success, false, key);
  }
});
test('nullable fields normalize at the draft boundary, while the wire stays strict', () => {
  const minimal = { posted_at:'2026-09-12T12:00:00Z', source:'hq', kind:'update', text:'Fixture', day:0, authorship:'human' };
  assert.equal(DispatchPayloadSchema.safeParse(minimal).success, false);
  assert.equal(parseDispatchDraft(minimal).photos, null);
  assert.throws(() => parseDispatchDraft({...minimal, telling:[]}));
});
test('photo resolution never falls back to an outbound URL in a private preview', () => {
  const dispatch = records[1].payload;
  const missing = renderToStaticMarkup(<DispatchView dispatch={dispatch} photoUrl={() => null} />);
  assert.ok(missing.includes('Photograph unavailable'));
  assert.ok(missing.includes('Regine Trias'));
  assert.ok(!missing.includes('<img'));
  assert.ok(!missing.includes('media.rebellerally.com'));
  const loaded = renderToStaticMarkup(<DispatchView dispatch={dispatch} photoUrl={() => 'data:image/jpeg;base64,/9j/'} />);
  assert.ok(loaded.includes('data:image/jpeg;base64,/9j/'));
});
test('text is literal, generated authorship stays private, and unsafe URLs refuse', () => {
  const dispatch = {...records[0].payload, text:'<script>alert(1)</script> **literal**', authorship:'ai-assisted' as const};
  const html = renderToStaticMarkup(<DispatchView dispatch={dispatch} />);
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('**literal**'));
  assert.ok(!html.includes('ai-assisted'));
  for (const url of ['javascript:alert(1)', 'data:image/svg+xml,<svg/>', '//other.example/image']) {
    assert.throws(() => parseDispatchDraft({...dispatch, photos:[{url,credit:'Fixture'}]}));
  }
});
test('video placeholders stay useful without a media request', () => {
  const dispatch = {...records[4].payload, video:{provider:'hosted' as const, video_id:null, title:'A fixture clip', duration:81}};
  const html = renderToStaticMarkup(<DispatchView dispatch={dispatch} />);
  assert.ok(html.includes('A fixture clip'));
  assert.ok(html.includes('1:21'));
  assert.ok(html.includes('Coming soon'));
  assert.ok(!html.includes('<iframe') && !html.includes('<video'));
});

test('a reader can open YouTube clips in its media pane; previews retain the external link', () => {
  const video = {provider:'youtube' as const, video_id:'7hq77WoZA-w', title:'Morning show', duration:null};
  const dispatch = {...records[4].payload, video};
  const preview = renderToStaticMarkup(<DispatchView dispatch={dispatch} />);
  assert.ok(preview.includes('href="https://www.youtube.com/watch?v=7hq77WoZA-w"'));
  assert.ok(preview.includes('target="_blank"'));
  const reader = renderToStaticMarkup(<DispatchView dispatch={dispatch} onOpenVideo={() => {}} />);
  assert.ok(reader.includes('<button type="button" class="live-entry__link">Watch video'));
  assert.ok(!reader.includes('youtube.com/watch'));
  for (const video_id of [null, undefined]) {
    const placeholder = renderToStaticMarkup(<DispatchView dispatch={{...dispatch, video:{...video, video_id}}} onOpenVideo={() => {}} />);
    assert.ok(placeholder.includes('Coming soon'));
    assert.ok(!placeholder.includes('Watch video'));
  }
});

test('the live envelope names its year and day, including an empty day', () => {
  assert.equal(DispatchesFeedDocumentSchema.parse(fixture).day, 3);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({...fixture, records:[]}).success, true);
  const {day, ...dayless} = fixture;
  assert.equal(DispatchesFeedDocumentSchema.safeParse(dayless).success, false);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({...fixture, feed_key:'rebelle_live.dispatches'}).success, false);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({...fixture, feed_key:'rebelle_live.dispatches.2025'}).success, false);
});

test('a sponsor is a key on the wire, and every sponsor dispatch is a partner card', () => {
  const base = {...records[0].payload, source:'sponsor' as const};
  for (const word of ['BILSTEIN', 'jiffy lube', 'jiffy_lube', '-ford', 'ford-', '']) {
    assert.equal(DispatchPayloadSchema.safeParse({...base, sponsor: word}).success, false, word);
  }
  const drawn = renderToStaticMarkup(<DispatchView dispatch={{...base, sponsor:'bilstein'}} />);
  assert.ok(drawn.includes('live-entry--partner live-brand--bilstein'));
  assert.ok(drawn.includes('>BILSTEIN<') && drawn.includes('PARTNER'));
  const plain = renderToStaticMarkup(<DispatchView dispatch={{...base, sponsor:'storyteller-overland'}} />);
  assert.ok(plain.includes('live-entry--partner') && !plain.includes('live-brand--'));
  assert.ok(plain.includes('STORYTELLER OVERLAND') && plain.includes('PARTNER'));
  const hq = renderToStaticMarkup(<DispatchView dispatch={{...base, source:'hq', sponsor:'bilstein'}} />);
  assert.ok(hq.includes('live-brand--bilstein') && !hq.includes('live-entry--partner') && !hq.includes('PARTNER'));
});
test('a host holding the roster names the chip and says which lockup it wears', () => {
  const base = {...records[0].payload, source:'sponsor' as const};
  const named = renderToStaticMarkup(<DispatchView dispatch={{...base, sponsor:'warner-ineos'}}
    sponsorFor={(key) => ({ key, name: 'INEOS Grenadier', lockup_key: null })} />);
  assert.ok(named.includes('INEOS GRENADIER') && !named.includes('WARNER INEOS'));
  const relabelled = renderToStaticMarkup(<DispatchView dispatch={{...base, sponsor:'stryten-energy'}}
    sponsorFor={(key) => ({ key, name: 'Stryten Energy', lockup_key: 'stryten' })} />);
  assert.ok(relabelled.includes('live-entry--partner live-brand--stryten') && relabelled.includes('>STRYTEN<'));
  const unknown = renderToStaticMarkup(<DispatchView dispatch={{...base, sponsor:'bilstein'}} sponsorFor={() => null} />);
  assert.ok(unknown.includes('live-brand--bilstein'));
  assert.deepEqual(Object.keys(SPONSOR_LOCKUPS).length, 9);
});
const white = { url: '/images/7c1f4b0e-2f2a-4c3e-9a1d-0b5e6f7a8c9d/640', alt: 'Ford', width: 2000, height: 750 };
const color = { url: '/images/9d8c7b6a-5f4e-4d3c-8b2a-1c0d9e8f7a6b/640', alt: 'Ford' };
test('a sponsor row on the wire is strict, its link is an http(s) address, and a schema-3 row reads as no marks', () => {
  const row = { key:'ford', name:'Ford', lockup_key:null, tier:'Presenting', blurb:null, link:'https://www.ford.com/', logos: { white, color } };
  assert.deepEqual(SponsorSchema.parse(row), row);
  const { logos: _, ...three } = row;
  assert.deepEqual(SponsorSchema.parse(three), { ...three, logos: { white: null, color: null } });
  assert.deepEqual(SponsorSchema.parse({ ...three, logos: { white: null, color } }).logos, { white: null, color });
  assert.equal(SponsorSchema.safeParse({...row, key:'Ford'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, link:'javascript:alert(1)'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, lockup_key:'Jiffy Lube'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, logo:'x'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, name:''}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, logos: { white }}).success, false, 'both marks are named, each a mark or null');
  assert.equal(SponsorSchema.safeParse({...row, logos: { white, color, black: null }}).success, false);
  assert.equal(MarkSchema.safeParse({ ...color, width: 800 }).success, false, 'the pixels come as a pair');
  assert.equal(MarkSchema.safeParse({ ...color, width: 0, height: 0 }).success, false);
  assert.equal(MarkSchema.safeParse({ ...color, url: '//evil.example/mark.png' }).success, false);
  assert.equal(MarkSchema.safeParse({ ...color, url: '/\\evil.example/mark.png' }).success, false);
  assert.equal(MarkSchema.safeParse({ ...color, url: 'https://rebellerally.com/mark.png' }).success, false, 'a mark is the site\'s own image route');
  assert.equal(MarkSchema.safeParse({ ...color, url: '/images/9d8c7b6a-5f4e-4d3c-8b2a-1c0d9e8f7a6b/641' }).success, false, 'at a declared width');
  assert.equal(MarkSchema.safeParse({ ...color, alt: '' }).success, false);
  assert.equal(MarkSchema.safeParse({ ...color, alt: 'x'.repeat(201) }).success, false, 'the alt is capped, and the studio writes the name');
  assert.equal(MarkSchema.safeParse({ ...color, alt: 'x'.repeat(200) }).success, true);
  // The same hole on a photo's address: "/\\host" is "//host" to a browser.
  assert.equal(DispatchPayloadSchema.safeParse({ ...records[0].payload, photos: [{ url: '/\\evil.example/a.jpg', credit: 'x' }] }).success, false);
  assert.equal(DispatchPayloadSchema.safeParse({ ...records[0].payload, photos: [{ url: '/photos/a.jpg', credit: 'x' }] }).success, true);
});
test('the white mark keeps the brand ground only where the brand names it dark', () => {
  const css = readFileSync(new URL('../src/ui/dispatch.css', import.meta.url), 'utf8');
  const grounded = [...css.matchAll(/\.live-brand--([a-z-]+)\s*\{[^}]*--live-mark-ground/g)].map((m) => m[1]).sort();
  assert.deepEqual(grounded, ['baja-designs', 'jiffy-lube', 'stryten']);
  assert.match(css, /\.live-lockup--mark \{ background-color: var\(--live-mark-ground, var\(--navy\)\); \}/);
});
test('a badge wears the white mark on a dark ground, presented by wears the colour mark on a plate, and one mark falls back to the other', () => {
  const ford = { key: 'ford', name: 'Ford', lockup_key: null, logos: { white, color } };
  const badge = renderToStaticMarkup(<SponsorLockup sponsor={ford} />);
  assert.ok(badge.includes('class="live-lockup live-lockup--mark"') && badge.includes(`src="${white.url}"`) && badge.includes('width="2000" height="750"'), badge);
  assert.ok(!badge.includes(color.url));
  const presented = renderToStaticMarkup(<SponsorLockup sponsor={ford} variant="presented-by" size="strip" />);
  assert.ok(presented.includes('live-lockup live-lockup--presented-by live-lockup--strip') && presented.includes(`src="${color.url}"`) && presented.includes('alt="Ford"'), presented);
  assert.ok(!presented.includes('width='), 'an SVG mark carries no pixels');
  const drawn = renderToStaticMarkup(<SponsorLockup sponsor={{ key: 'bilstein', name: 'Bilstein', logos: { white, color: null } }} variant="presented-by" />);
  assert.ok(drawn.includes('live-lockup live-lockup--mark live-brand--bilstein') && drawn.includes(white.url), 'no colour mark: the white one on the brand ground');
  const colourOnly = renderToStaticMarkup(<SponsorLockup sponsor={{ key: 'bilstein', name: 'Bilstein', logos: { white: null, color } }} />);
  assert.ok(colourOnly.includes('>BILSTEIN<') && !colourOnly.includes('<img'), 'a badge never wears the colour mark');
  const chip = renderToStaticMarkup(<SponsorLockup sponsor={{ key: 'jeep', name: 'Jeep', logos: { white: null, color: null } }} variant="presented-by" />);
  assert.ok(chip.includes('rr-chip rr-chip--neutral') && chip.includes('JEEP'));
  const base = {...records[0].payload, source:'sponsor' as const, sponsor: 'ford'};
  const card = renderToStaticMarkup(<DispatchView dispatch={base} sponsorFor={() => ford} />);
  assert.ok(card.includes('live-entry--partner') && card.includes('class="live-lockup live-lockup--mark"') && card.includes(white.url), card);
});
