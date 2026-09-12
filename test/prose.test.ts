import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseProse, serializeProse, escapeProseText, proseLinkAllowed } from '../src/prose.ts';
import { StoryComponentSchema } from '../src/story.ts';

for (const source of [
  '### The day\n\nSeveral **bold** and *italic* words, with [a link](https://example.com/a?b=c "Title").\n\n#### A detail\n\nAnother paragraph.',
  '3. Three\n\n   A second paragraph.\n\n   - Nested **one**\n   - Nested two\n\n4. Four',
  'Literal \\*stars\\*, <script>alert("hello")</script> &amp; entities.\nA soft break.\\\nA hard break.',
  '***Both***, **bold with *italic* inside**, *italic with **bold** inside*.',
  '[email](mailto:info@example.com) and [escaped](https://example.com/a\\(b\\)).',
]) {
  test(`semantic round trip: ${source.slice(0, 40)}`, () => {
    const original = parseProse(source);
    assert.deepEqual(parseProse(serializeProse(original)), original);
  });
}

test('Paragraph conversion is an explicit escape, including literal HTML and Markdown', () => {
  const literal = '*words* <b>bold?</b> &copy; [link](https://example.com)';
  assert.deepEqual(parseProse(escapeProseText(literal)), [{ type: 'paragraph', children: [{ type: 'text', text: literal }] }]);
  assert.equal(StoryComponentSchema.parse({ component: 'Paragraph', content: { text: literal } }).content.text, literal);
});

test('web and email destinations are explicit; execution and credential URLs refuse', () => {
  for (const href of ['https://example.com/a', 'http://example.com', 'mailto:info@example.com']) assert.equal(proseLinkAllowed(href), true);
  for (const href of ['javascript:alert(1)', 'data:text/html,x', '//example.com', '/relative', 'https://user:secret@example.com', 'https://example.com\\@evil.com', 'https://example.com\n']) assert.equal(proseLinkAllowed(href), false);
  for (const href of ['javascript:alert(1)', 'data:text/html,x', 'https://user:secret@example.com']) assert.throws(() => parseProse(`[link](<${href}>)`), /Links must/);
});

test('headings cannot compete with the host and story headline', () => {
  for (const level of [1, 2, 5, 6]) assert.throws(() => parseProse(`${'#'.repeat(level)} Heading`), /H3 or H4/);
});
