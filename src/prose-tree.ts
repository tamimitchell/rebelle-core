import { readFileSync } from 'node:fs';
import { parseProse } from './prose.ts';

// Core's parser for a host that renders outside JavaScript: the studio's email
// reads each Prose part's tree from here, so no second Markdown dialect exists.
const input: unknown = JSON.parse(readFileSync(0, 'utf8'));
if (!Array.isArray(input) || input.length > 60 || input.some(value => typeof value !== 'string' || value.length > 12000)) {
  throw new Error('Invalid prose tree request');
}
const trees = input.map(markdown => {
  try { return parseProse(markdown); }
  catch { return null; }
});
process.stdout.write(JSON.stringify(trees));
