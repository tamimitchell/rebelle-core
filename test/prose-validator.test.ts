import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { parseProse } from '../src/prose.ts';

const cases = ['### Heading\n\n**Bold** [web](https://example.com)', '1. First\n   - Nested', '<b>literal</b>', '# Unsupported', '[unsafe](javascript:alert(1))', '[email](mailto:info@example.com)'];
test('the committed Rails validator matches the reader parser', () => {
  const expected = cases.map(value => { try { parseProse(value); return null; } catch (error) { return (error as Error).message; } });
  const result = spawnSync(process.execPath, [new URL('../dist/prose-validator.mjs', import.meta.url).pathname], { input: JSON.stringify(cases), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), expected);
});
