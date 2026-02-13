import { getDrupalMigrationSnapshots } from './drupalMigrationService';
import { getReactMigrationSnapshots } from './reactMigrationService';

export interface MigrationValidationResult {
  ok: boolean;
  differences: string[];
}

export function validateDrupalMigration(
  fixtureRoot?: string,
): MigrationValidationResult {
  const { baseline, unified } = getDrupalMigrationSnapshots(
    fixtureRoot,
  );

  const differences: string[] = [];

  if (baseline.html !== unified.html) {
    differences.push('HTML structure differs between baseline and unified output.');
  }

  if (baseline.cssFileNames.join('|') !== unified.cssFileNames.join('|')) {
    differences.push('CSS filenames differ between baseline and unified output.');
  }

  if (baseline.publicPaths.join('|') !== unified.publicPaths.join('|')) {
    differences.push('Public paths differ between baseline and unified output.');
  }

  return {
    ok: differences.length === 0,
    differences,
  };
}

export function validateReactMigration(
  fixtureRoot?: string,
): MigrationValidationResult {
  const { baseline, unified } = getReactMigrationSnapshots(
    fixtureRoot,
  );

  const differences: string[] = [];

  if (baseline.html !== unified.html) {
    differences.push('React-rendered HTML differs between baseline and unified output.');
  }

  if (baseline.cssFileNames.join('|') !== unified.cssFileNames.join('|')) {
    differences.push('React CSS filenames differ between baseline and unified output.');
  }

  if (baseline.publicPaths.join('|') !== unified.publicPaths.join('|')) {
    differences.push('React public paths differ between baseline and unified output.');
  }

  return {
    ok: differences.length === 0,
    differences,
  };
}

