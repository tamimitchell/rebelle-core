import { build } from 'esbuild';
const node = { bundle: true, platform: 'node', target: 'node22', format: 'esm' };
await build({ ...node, entryPoints: ['src/prose-validator.ts'], outfile: 'dist/prose-validator.mjs' });
await build({ ...node, entryPoints: ['src/prose-tree.ts'], outfile: 'dist/prose-tree.mjs' });
