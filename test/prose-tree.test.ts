import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { parseProse } from '../src/prose.ts';

const cases = ['### Heading\n\n**Bold** [web](https://example.com)', '1. First\n   - Nested', '<b>literal</b>', '# Unsupported', '[unsafe](javascript:alert(1))'];
const tree = (input: string) => spawnSync(process.execPath, [new URL('../dist/prose-tree.mjs', import.meta.url).pathname], { input, encoding: 'utf8' });

test('the committed tree bundle gives the reader parser\'s tree, and null where it refuses', () => {
  const expected = cases.map(value => { try { return parseProse(value); } catch { return null; } });
  const result = tree(JSON.stringify(cases));
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), expected);
});

test('the tree bundle takes a bounded post', () => {
  assert.equal(tree(JSON.stringify(Array(60).fill('A paragraph.'))).status, 0);
  assert.notEqual(tree(JSON.stringify(Array(61).fill('A paragraph.'))).status, 0);
});
