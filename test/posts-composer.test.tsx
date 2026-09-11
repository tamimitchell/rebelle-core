import assert from 'node:assert/strict';
import test from 'node:test';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PostPayloadSchema, PostsFeedDocumentSchema } from '../src/schemas.ts';
import { PostView } from '../src/ui/post.tsx';

const legacy = { kind: 'news' as const, date: '2026-07-24', category: 'News', headline: 'A post', dek: 'The introduction', body: '**literal** <b>body</b>', link: 'https://example.com/original/' };
const post = { ...legacy, body: null, link: null, slug: 'a-post', published_at: '2026-07-24T12:04:11Z', telling: [{ component: 'Prose' as const, content: { markdown: 'A **composed** article.' } }] };
const record = { id: '00000000-0000-4000-8000-000000000001', version_id: '00000000-0000-4000-8000-000000000002' };
test('old and new feed envelopes coexist, without admitting new records under the old version', () => {
  const old = { contract_version: '1', feed_key: 'system.posts', record_type_key: 'system.post', record_schema_version: '2', sent_at: post.published_at, records: [{ ...record, schema_version: '2', payload: legacy }] };
  assert.ok(PostsFeedDocumentSchema.safeParse(old).success);
  assert.ok(PostsFeedDocumentSchema.safeParse({ ...old, contract_version: '2', record_schema_version: '3', records: [...old.records, { ...record, schema_version: '3', payload: post }] }).success);
  assert.equal(PostsFeedDocumentSchema.safeParse({ ...old, records: [{ ...record, schema_version: '3', payload: post }] }).success, false);
});
test('article metadata and bounds are required, review-only material is refused at the public edge', () => {
  assert.ok(PostPayloadSchema.safeParse(post).success);
  assert.equal(PostPayloadSchema.safeParse({ ...post, slug: undefined }).success, false);
  assert.equal(PostPayloadSchema.safeParse({ ...post, sources: [{ label: 'private' }] }).success, false);
  assert.ok(PostPayloadSchema.safeParse({ ...post, telling: Array(60).fill(post.telling[0]) }).success);
  assert.equal(PostPayloadSchema.safeParse({ ...post, telling: Array(61).fill(post.telling[0]) }).success, false);
});
test('article renderer shares composed prose and keeps a legacy body literal', () => {
  assert.match(renderToStaticMarkup(<PostView post={post} />), /<strong>composed<\/strong>/);
  const html = renderToStaticMarkup(<PostView post={legacy} />);
  assert.match(html, /\*\*literal\*\* &lt;b&gt;body&lt;\/b&gt;/);
  assert.doesNotMatch(html, /<strong>|<b>/);
});
