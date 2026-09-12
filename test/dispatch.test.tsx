import * as React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { DispatchesFeedDocumentSchema, DispatchPayloadSchema, parseDispatchDraft } from '../src/dispatch.ts';
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

test('the live envelope names its year and day, including an empty day', () => {
  assert.equal(DispatchesFeedDocumentSchema.parse(fixture).day, 3);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({...fixture, records:[]}).success, true);
  const {day, ...dayless} = fixture;
  assert.equal(DispatchesFeedDocumentSchema.safeParse(dayless).success, false);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({...fixture, feed_key:'rebelle_live.dispatches'}).success, false);
  assert.equal(DispatchesFeedDocumentSchema.safeParse({...fixture, feed_key:'rebelle_live.dispatches.2025'}).success, false);
});
