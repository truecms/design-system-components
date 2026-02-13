import fs from 'node:fs';
import path from 'node:path';

import type { Bundle, Consumer } from './drupalModels';
import { createBundle, createConsumer } from './drupalModels';
import { getDrupalCssFileNames, getDrupalCssPublicPaths } from '../../drupal/asset-manifest';

export interface MigrationSnapshot {
  html: string;
  cssFileNames: string[];
  publicPaths: string[];
}

export interface DrupalMigrationSnapshots {
  baseline: MigrationSnapshot;
  unified: MigrationSnapshot;
}

const DEFAULT_FIXTURE_ROOT = path.resolve(
  process.cwd(),
  'tests/integration/drupal/fixtures/sample-theme',
);

const BASELINE_SNAPSHOT_FILE = 'baseline-snapshot.json';
const TEMPLATE_RELATIVE_PATH = path.join('templates', 'page.html.twig');

function readBaselineSnapshot(
  fixtureRoot: string = DEFAULT_FIXTURE_ROOT,
): { cssFileNames: string[]; publicPaths: string[] } {
  const snapshotPath = path.join(fixtureRoot, BASELINE_SNAPSHOT_FILE);

  const raw = fs.readFileSync(snapshotPath, 'utf8');
  const parsed = JSON.parse(raw) as { cssFileNames: string[]; publicPaths: string[] };

  return parsed;
}

function readTemplateHtml(fixtureRoot: string = DEFAULT_FIXTURE_ROOT): string {
  const templatePath = path.join(fixtureRoot, TEMPLATE_RELATIVE_PATH);
  return fs.readFileSync(templatePath, 'utf8');
}

export function getDrupalMigrationSnapshots(
  fixtureRoot: string = DEFAULT_FIXTURE_ROOT,
): DrupalMigrationSnapshots {
  const baselineMeta = readBaselineSnapshot(fixtureRoot);
  const html = readTemplateHtml(fixtureRoot);

  const baseline: MigrationSnapshot = {
    html,
    cssFileNames: baselineMeta.cssFileNames,
    publicPaths: baselineMeta.publicPaths,
  };

  const unified: MigrationSnapshot = {
    html,
    cssFileNames: getDrupalCssFileNames(),
    publicPaths: getDrupalCssPublicPaths(),
  };

  return { baseline, unified };
}

export function createDrupalConsumerFromSnapshot(
  id: string,
  name: string,
  designSystemVersion: string,
  migrationStatus: 'baseline' | 'migrated',
  snapshot: MigrationSnapshot,
): Consumer {
  const bundles: Bundle[] = snapshot.cssFileNames.map((fileName, index) =>
    createBundle({
      id: `${id}-css-${index}`,
      type: 'css',
      fileName,
      publicPath: snapshot.publicPaths[index] ?? '',
    }),
  );

  return createConsumer({
    id,
    name,
    designSystemVersion,
    migrationStatus,
    bundles,
  });
}

