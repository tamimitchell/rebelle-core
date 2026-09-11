// Publishes dist/register.json — every class the design system defines and
// every custom property it sets, read off dist/system.css — so a consumer that
// has to know what a design-system class *is* reads a list core generated
// rather than parsing CSS on its own (Decided #125: one source of component
// identity, everything outward generated from it). Runs after build-tokens.
import { readFileSync, writeFileSync } from 'node:fs';
import { classes, tokens, uncommented } from '../src/stylesheet.ts';

const css = uncommented(readFileSync(new URL('../dist/system.css', import.meta.url), 'utf8'));

writeFileSync(new URL('../dist/register.json', import.meta.url), JSON.stringify({
  source: 'dist/system.css',
  classes: classes(css).sort(),
  tokens: tokens(css),
}, null, 2) + '\n');
