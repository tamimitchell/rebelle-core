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
  assert.match(site, /<media-controller[^>]*><video slot="media" src="\/videos\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f"/);
  assert.match(site, /<media-play-button/);
  assert.doesNotMatch(site, /poster=/);
  assert.match(site, /<figcaption>Day 3 &quot;course&quot; flyover<\/figcaption>/);
  assert.doesNotMatch(site, /youtube/);
  const elsewhere = renderToStaticMarkup(<StoryPart part={part} media={{ videoUrl: (id) => ({ source: `https://media.example.com/${id}.mp4`, poster: `https://media.example.com/${id}.jpg` }) }} />);
  assert.match(elsewhere, /src="https:\/\/media.example.com\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f.mp4" poster="https:\/\/media.example.com\/5a0d8f2e-6b3c-4e1a-9f7d-2c4b6a8e0d1f.jpg"/);
  const captioned = renderToStaticMarkup(<StoryPart part={part} media={{ videoUrl: () => ({ source: '/videos/example', captions: { source: '/videos/example/captions', language: 'en', label: 'Reviewed English' }, aspectRatio: '720 / 1280' }) }} />);
  assert.match(captioned, /<track kind="captions" src="\/videos\/example\/captions" srcLang="en" label="Reviewed English" default=""\/>/);
  assert.match(captioned, /aspect-ratio:720 \/ 1280/);
  const none = renderToStaticMarkup(<StoryPart part={part} media={{ videoUrl: () => undefined, embedVideos: true }} />);
  assert.doesNotMatch(none, /<video/);
  assert.match(none, /<p role="status">Video unavailable<\/p><figcaption>Day 3 &quot;course&quot; flyover<\/figcaption>/);
});

test('a map draws a still of its towns, counts itself in words, and lists every town with the fields a live map reads', () => {
  const html = renderToStaticMarkup(<StoryPart part={{ component: 'Map', content: { caption: 'Where <the> field comes from', places: [
    { name: 'Anchorage', region: 'Alaska', country: 'United States', latitude: 61.216313, longitude: -149.894852, years: [2018, 2021, 2026] },
    { name: "Antibes", region: "Provence-Alpes-Côte d'Azur", country: 'France', latitude: 43.580418, longitude: 7.125102, years: [2017] },
    { name: 'Gustavia', region: null, country: 'Saint Barthélemy', latitude: 17.8962, longitude: -62.8498, years: [] },
  ] } }} />);
  assert.match(html, /^<figure class="rr-story__map" data-rr-map="">/);
  assert.match(html, /<path class="rr-story__map-land" d="M/);
  assert.equal(html.match(/<circle /g)?.length, 3);
  assert.match(html, /<circle class="rr-story__map-dot" cx="30.11" cy="28.78" r="1.1"><\/circle>/);
  assert.match(html, /Where &lt;the&gt; field comes from/);
  assert.match(html, /3 towns · 3 countries · 2017–2026/);
  assert.match(html, /<li data-latitude="61.216313" data-longitude="-149.894852" data-years="2018 2021 2026" data-name="Anchorage" data-region="Alaska" data-country="United States"><span class="rr-story__map-town">Anchorage, Alaska<\/span><span class="rr-story__map-years"> · 2018, 2021, 2026<\/span><\/li>/);
  assert.match(html, /<li data-latitude="17.8962" data-longitude="-62.8498" data-years="" data-name="Gustavia" data-country="Saint Barthélemy"><span class="rr-story__map-town">Gustavia, Saint Barthélemy<\/span><\/li>/);
  assert.doesNotMatch(html, /rr-story__map-routes/, 'no routes, no route list');
  assert.doesNotMatch(html, /<script/);
});

test('a map lists each route a day at a time, with each camp and the day\'s greens on the item', () => {
  const place = { name: 'Clarkdale', region: 'Arizona', country: 'United States', latitude: 34.77, longitude: -112.06, years: [2023] };
  const html = renderToStaticMarkup(<StoryPart part={{ component: 'Map', content: { places: [place], routes: [{ year: 2023, days: [
    { day: 1, camp: { name: 'Mammoth Lakes', latitude: 37.694, longitude: -118.759 }, greens: [{ latitude: 37.7918, longitude: -118.9341 }, { latitude: 37.827, longitude: -118.9171 }] },
    { day: 2, camp: { name: 'Gold <Point>', latitude: 37.3545, longitude: -117.365 }, greens: [] },
  ] }] } }} />);
  assert.match(html, /<details class="rr-story__map-routes"><summary>Every route<\/summary><p class="rr-story__map-route">2023 · 2 days · 2 greens<\/p><ol data-route-year="2023">/);
  assert.match(html, /<li data-day="1" data-latitude="37.694" data-longitude="-118.759" data-greens="-118.9341,37.7918 -118.9171,37.827">Day 1 · Mammoth Lakes<\/li>/);
  assert.match(html, /<li data-day="2" data-latitude="37.3545" data-longitude="-117.365" data-greens="">Day 2 · Gold &lt;Point&gt;<\/li>/);
});
