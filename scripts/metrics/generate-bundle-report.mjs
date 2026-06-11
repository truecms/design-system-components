#!/usr/bin/env node

/**
 * Generate a bundle size report from the real build output in
 * packages/unified-design-system/dist/.
 *
 * Reads build-manifest.json (produced by `pnpm run build:unified`) to find
 * the emitted files, measures their sizes, and writes a JSON report in the
 * format that compare-bundle-size.mjs expects.
 *
 * Usage:
 *   node scripts/metrics/generate-bundle-report.mjs \
 *     --out reports/bundles-unified.json
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DIST_DIR = path.join(ROOT_DIR, 'packages/unified-design-system/dist');
const MANIFEST_PATH = path.join(DIST_DIR, 'build-manifest.json');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--out' && argv[i + 1]) {
      args.out = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function main() {
  const { out } = parseArgs(process.argv);

  if (!out) {
    console.error('Usage: generate-bundle-report.mjs --out <file>');
    process.exit(1);
  }

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Build manifest not found at ${MANIFEST_PATH}. Run \`pnpm run build:unified\` first.`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const allRelPaths = [...(manifest.css || []), ...(manifest.js || [])];

  const bundles = allRelPaths.map((relPath) => {
    const absPath = path.join(DIST_DIR, relPath);
    const size_bytes = fs.existsSync(absPath) ? fs.statSync(absPath).size : 0;
    const ext = path.extname(relPath).replace('.', '');
    return {
      id: relPath,
      type: ext === 'js' ? 'js' : 'css',
      size_bytes,
    };
  });

  const report = { bundles };
  const outAbs = path.resolve(out);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, JSON.stringify(report, null, 2) + '\n', 'utf8');

  console.log(`Wrote ${bundles.length} bundle entries to ${outAbs}`);
  bundles.forEach((b) => console.log(`  ${b.id}: ${b.size_bytes} bytes`));
}

main();
