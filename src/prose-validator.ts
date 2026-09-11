import { readFileSync } from 'node:fs';
import { parseProse } from './prose.ts';

const input: unknown = JSON.parse(readFileSync(0, 'utf8'));
if (!Array.isArray(input) || input.length > 12 || input.some(value => typeof value !== 'string' || value.length > 12000)) {
  throw new Error('Invalid prose validation request');
}
const errors = input.map(markdown => {
  try { parseProse(markdown); return null; }
  catch (error) { return error instanceof Error ? error.message : 'Unsupported prose'; }
});
process.stdout.write(JSON.stringify(errors));
