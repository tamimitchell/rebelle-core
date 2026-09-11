import { build } from 'esbuild';
await build({ entryPoints: ['src/prose-validator.ts'], bundle: true, platform: 'node', target: 'node22', format: 'esm', outfile: 'dist/prose-validator.mjs' });
