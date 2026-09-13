import * as React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { DispatchesFeedDocumentSchema, DispatchPayloadSchema, SPONSOR_LOCKUPS, SponsorSchema, dispatchArchiveKey, parseDispatchDraft } from '../src/dispatch.ts';
import { DispatchView } from '../src/ui/dispatch.tsx';
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
test('a sponsor row on the wire is strict and its link is an http(s) address', () => {
  const row = { key:'ford', name:'Ford', lockup_key:null, tier:'Presenting', blurb:null, link:'https://www.ford.com/' };
  assert.deepEqual(SponsorSchema.parse(row), row);
  assert.equal(SponsorSchema.safeParse({...row, key:'Ford'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, link:'javascript:alert(1)'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, lockup_key:'Jiffy Lube'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, logo:'x'}).success, false);
  assert.equal(SponsorSchema.safeParse({...row, name:''}).success, false);
});
