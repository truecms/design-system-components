import type { Config } from 'jest';

export interface MigrationSnapshot {
  html: string;
  cssFileNames: string[];
  publicPaths: string[];
}

export interface MigrationValidationResult {
  ok: boolean;
  differences: string[];
}

/**
 * Validate that Drupal migration preserved HTML structure, CSS filenames,
 * and public paths between a baseline (Pancake) and unified output.
 */
export function validateDrupalMigration(
  baseline: MigrationSnapshot,
  unified: MigrationSnapshot,
): MigrationValidationResult {
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

/**
 * Validate React migration where only import paths are allowed to change.
 * HTML, classes, and behaviour should remain equivalent.
 */
export function validateReactMigration(
  baseline: MigrationSnapshot,
  unified: MigrationSnapshot,
): MigrationValidationResult {
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

// Jest config import kept to signal this file is intended for Jest-based tests.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _jestConfig: Config | undefined = undefined;
