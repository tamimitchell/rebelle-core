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

test('a YouTube video has a usable link in an MCP host that cannot embed, and a player where one can', () => {
  const part = { component: 'Video' as const, content: { provider: 'youtube' as const, video_id: 'k4FNP7tL1Xg', title: 'The webcast', duration: 81 } };
  const linked = renderToStaticMarkup(<StoryPart part={part} />);
  assert.doesNotMatch(linked, /iframe/);
  assert.match(linked, /<a href="https:\/\/www.youtube.com\/watch\?v=k4FNP7tL1Xg">The webcast — watch on YouTube<\/a>/);
  assert.match(linked, /1:21/);
  const embedded = renderToStaticMarkup(<StoryPart part={part} media={{ embedVideos: true }} />);
  assert.match(embedded, /<iframe src="https:\/\/www.youtube-nocookie.com\/embed\/k4FNP7tL1Xg" title="The webcast"/);
});

test('a hosted video is a player at the host\'s address, the site\'s own route by default, and a placeholder where the host has none', () => {
  const part = { component: 'Video' as const, content: { provider: 'hosted' as const, video_id: '5A0D8F2E-6B3C-4E1A-9F7D-2C4B6A8E0D1F', title: 'Day 3 "course" flyover' } };
  const site = renderToStaticMarkup(<StoryPart part={part} />);
  assert.match(site, /<video controls="" preload="metadata" src="\/videos\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f" poster="\/videos\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f\/poster" aria-label="Day 3 &quot;course&quot; flyover">/);
  assert.match(site, /<figcaption>Day 3 &quot;course&quot; flyover<\/figcaption>/);
  assert.doesNotMatch(site, /youtube/);
  const elsewhere = renderToStaticMarkup(<StoryPart part={part} media={{ videoUrl: (id) => ({ source: `https://media.example.com/${id}.mp4`, poster: `https://media.example.com/${id}.jpg` }) }} />);
  assert.match(elsewhere, /src="https:\/\/media.example.com\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f.mp4" poster="https:\/\/media.example.com\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f.jpg"/);
  const none = renderToStaticMarkup(<StoryPart part={part} media={{ videoUrl: () => undefined, embedVideos: true }} />);
  assert.doesNotMatch(none, /<video/);
  assert.match(none, /<p role="status">Video unavailable<\/p><figcaption>Day 3 &quot;course&quot; flyover<\/figcaption>/);
});
