import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { classes, classesIn, isUnscoped, selectors, tokens, uncommented } from '../src/stylesheet.ts';

const sheet = uncommented(`
  /* .commented-out { } */
  :root { --navy: #0D213D; --gap: 4px; }
  .terrain { --ink: var(--navy); background: url("data:image/svg+xml,{}"); }
  .rr-btn, .rr-btn--primary:hover { color: #fff; content: ".not-a-class"; }
  a:not(.rr-btn):hover, p:not(.muted) { color: red; }
  @media (min-width: 40em) { .fgi .k { gap: var(--gap); } h3 { margin: 0; } }
  @keyframes pulse { from { opacity: 0 } to { opacity: 1 } }
  @font-face { font-family: X; src: url('x.woff2'); }
`);

test('reads selectors past strings, url() braces, at-rule preludes and keyframe steps', () => {
  assert.deepEqual(selectors(sheet), [
    ':root', '.terrain', '.rr-btn', '.rr-btn--primary:hover', 'a:not(.rr-btn):hover', 'p:not(.muted)',
    '.fgi .k', 'h3',
  ]);
});

test('names every class a selector carries, exclusions included, and none from a string', () => {
  assert.deepEqual(classes(sheet), ['terrain', 'rr-btn', 'rr-btn--primary', 'muted', 'fgi', 'k']);
  assert.deepEqual(classesIn('a:not(.rr-btn):hover'), ['rr-btn']);
});

test('an unscoped selector carries neither a class nor an id outside a :not()', () => {
  assert.equal(isUnscoped('h3'), true);
  assert.equal(isUnscoped('p:not(.muted)'), true);
  assert.equal(isUnscoped(':root'), true);
  assert.equal(isUnscoped('.fgi .k'), false);
  assert.equal(isUnscoped('#sheet > p'), false);
});

test('a token is a declaration, not a use, and every value it is given is kept', () => {
  assert.deepEqual(tokens(sheet), [
    { name: '--navy', value: '#0D213D' }, { name: '--gap', value: '4px' }, { name: '--ink', value: 'var(--navy)' },
  ]);
});

// dist/ is committed, so a register that lags the stylesheet it was read from
// would ship stale to every consumer; this is what catches a build:tokens run
// that stopped before build:register.
test('the published register is the stylesheet, freshly read', () => {
  const css = uncommented(readFileSync(new URL('../dist/system.css', import.meta.url), 'utf8'));
  const register = JSON.parse(readFileSync(new URL('../dist/register.json', import.meta.url), 'utf8'));
  assert.deepEqual(register.classes, classes(css).sort());
  assert.deepEqual(register.tokens, tokens(css));
  assert(register.classes.includes('rr-btn') && register.classes.includes('terrain'));
  assert(register.tokens.some((token: { name: string; value: string }) => token.name === '--navy' && token.value === '#0D213D'));
});
