import fs from 'node:fs';
import path from 'node:path';

import { getDrupalCssFileNames, getCssPublicPaths } from '../../drupal/asset-manifest';

export interface MigrationSnapshot {
  html: string;
  cssFileNames: string[];
  publicPaths: string[];
}

export interface ReactMigrationSnapshots {
  baseline: MigrationSnapshot;
  unified: MigrationSnapshot;
}

const DEFAULT_FIXTURE_ROOT = path.resolve(
  process.cwd(),
  'tests/integration/react/fixtures/sample-app',
);

const BASELINE_SNAPSHOT_FILE = 'baseline-snapshot.json';
const TEMPLATE_RELATIVE_PATH = 'index.html';

function readBaselineSnapshot(
  fixtureRoot: string = DEFAULT_FIXTURE_ROOT,
): { cssFileNames: string[]; publicPaths: string[] } {
  const snapshotPath = path.join(fixtureRoot, BASELINE_SNAPSHOT_FILE);

  const raw = fs.readFileSync(snapshotPath, 'utf8');
  const parsed = JSON.parse(raw) as {
    cssFileNames: string[];
    publicPaths: string[];
  };

  return parsed;
}

function readTemplateHtml(fixtureRoot: string = DEFAULT_FIXTURE_ROOT): string {
  const templatePath = path.join(fixtureRoot, TEMPLATE_RELATIVE_PATH);
  return fs.readFileSync(templatePath, 'utf8');
}

export function getReactMigrationSnapshots(
  fixtureRoot: string = DEFAULT_FIXTURE_ROOT,
): ReactMigrationSnapshots {
  const baselineMeta = readBaselineSnapshot(fixtureRoot);
  const html = readTemplateHtml(fixtureRoot);

  const baseline: MigrationSnapshot = {
    html,
    cssFileNames: baselineMeta.cssFileNames,
    publicPaths: baselineMeta.publicPaths,
  };

  // The unified snapshot reads real emitted CSS from the Vite build manifest.
  // This ensures the test fails if an asset is renamed or dropped in vite.config.ts.
  const unified: MigrationSnapshot = {
    html,
    cssFileNames: getDrupalCssFileNames(),
    publicPaths: getCssPublicPaths('/apps/sample-app/css'),
  };

  return { baseline, unified };
}
