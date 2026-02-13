#!/usr/bin/env node

/**
 * Compare bundle sizes between a baseline (current Pancake-based outputs)
 * and the unified design system outputs.
 *
 * This script is intentionally simple and file-based so it can be wired into
 * `npm`/`pnpm` scripts and CI. It reads a JSON report with entries of the form:
 *
 *   {
 *     "bundles": [
 *       { "id": "drupal-core-css", "type": "css", "size_bytes": 12345 },
 *       { "id": "drupal-core-js",  "type": "js",  "size_bytes": 23456 },
 *       ...
 *     ]
 *   }
 *
 * and computes the total size for baseline and unified outputs across a
 * representative set of bundles.
 *
 * Usage (convention):
 *   node scripts/metrics/compare-bundle-size.mjs \
 *     --baseline reports/bundles-baseline.json \
 *     --unified  reports/bundles-unified.json \
 *     --cap 0.3
 *
 * Exit codes:
 *   0 = within cap
 *   1 = over cap or invalid input
 */

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = { cap: 0.3 };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (!val || val.startsWith('--')) {
      continue;
    }
    if (key === '--baseline') args.baseline = val;
    if (key === '--unified') args.unified = val;
    if (key === '--cap') args.cap = Number(val);
  }
  return args;
}

function readReport(filePath) {
  const abs = path.resolve(filePath);
  const raw = fs.readFileSync(abs, 'utf8');
  const json = JSON.parse(raw);
  if (!json || !Array.isArray(json.bundles)) {
    throw new Error(`Invalid report format in ${abs} (expected { bundles: [] })`);
  }
  return json.bundles;
}

function totalSize(bundles) {
  return bundles.reduce((sum, b) => sum + (Number(b.size_bytes) || 0), 0);
}

function main() {
  const { baseline, unified, cap } = parseArgs(process.argv);

  if (!baseline || !unified) {
    console.error('Usage: compare-bundle-size.mjs --baseline <file> --unified <file> [--cap <ratio>]');
    process.exit(1);
  }

  try {
    const baselineBundles = readReport(baseline);
    const unifiedBundles = readReport(unified);

    const baselineTotal = totalSize(baselineBundles);
    const unifiedTotal = totalSize(unifiedBundles);

    if (baselineTotal <= 0) {
      throw new Error('Baseline total size must be > 0');
    }

    const growth = (unifiedTotal - baselineTotal) / baselineTotal;
    const growthPct = growth * 100;

    console.log(`Baseline total: ${baselineTotal} bytes`);
    console.log(`Unified total:  ${unifiedTotal} bytes`);
    console.log(`Growth:         ${growthPct.toFixed(2)}%`);
    console.log(`Cap:            ${(cap * 100).toFixed(2)}%`);

    if (growth <= cap) {
      console.log('Result: within cap');
      process.exit(0);
    }

    console.error('Result: exceeds cap');
    process.exit(1);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
