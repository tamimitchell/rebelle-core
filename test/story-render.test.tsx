import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { StoryPart } from '../src/ui/story.tsx';

test('the reader interprets only Prose; Paragraph and raw HTML stay literal', () => {
  assert.equal(renderToStaticMarkup(<StoryPart part={{ component: 'Paragraph', content: { text: '*words*' } }} />), '<p class="rr-story__paragraph">*words*</p>');
  const html = renderToStaticMarkup(<StoryPart part={{ component: 'Prose', content: { markdown: '**words** <script>alert(1)</script>' } }} />);
  assert.match(html, /<strong>words<\/strong>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script/);
});

test('Figure resolves image identity through the host and escapes captions and alt', () => {
  const html = renderToStaticMarkup(<StoryPart part={{ component: 'Figure', content: { image_id: '11111111-1111-4111-8111-111111111111', alt: 'A "car"', caption: '<b>Caption</b>' } }} media={{ imageUrl: (id, width) => `https://example.com/images/${id}/${width}` }} />);
  assert.match(html, /https:\/\/example.com\/images\/11111111-1111-4111-8111-111111111111\/960/);
  assert.match(html, /A &quot;car&quot;/);
  assert.match(html, /&lt;b&gt;Caption&lt;\/b&gt;/);
});

test('Film has a usable link in an MCP host that cannot embed', () => {
  const part = { component: 'Film' as const, content: { provider: 'youtube' as const, video_id: 'k4FNP7tL1Xg', title: 'The webcast' } };
  const linked = renderToStaticMarkup(<StoryPart part={part} />);
  assert.doesNotMatch(linked, /iframe/);
  assert.match(linked, /watch\?v=k4FNP7tL1Xg/);
  const embedded = renderToStaticMarkup(<StoryPart part={part} media={{ embedFilms: true }} />);
  assert.match(embedded, /youtube-nocookie.com\/embed\/k4FNP7tL1Xg/);
  assert.match(embedded, /title="The webcast"/);
});
