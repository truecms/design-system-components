#!/usr/bin/env node

/**
 * verify-bundles.js
 *
 * Compares built package outputs against recorded fixtures to ensure that
 * upgrades to tooling or dependencies do not accidentally change published
 * artefacts.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..');
const FIXTURES_ROOT = path.join(
  REPO_ROOT,
  'specs',
  '001-already-began-task',
  'fixtures'
);
const PACKAGES_ROOT = path.join(REPO_ROOT, 'packages');

const TARGET_PACKAGES = ['accordion', 'buttons', 'header'];
const IGNORED_FILENAMES = new Set(['.DS_Store']);

function assertDirectoryExists(dir, label) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(`${label} directory not found: ${dir}`);
  }
}

function listFilesRecursive(baseDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (IGNORED_FILENAMES.has(entry.name)) continue;
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entry.isFile()) {
        files.push(path.relative(baseDir, entryPath));
      }
    }
  }

  walk(baseDir);
  return files.sort();
}

function hashFile(filePath) {
  const contents = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(contents).digest('hex');
}

function comparePackage(pkgName) {
  const expectedDir = path.join(FIXTURES_ROOT, pkgName, 'expected', 'lib');
  const actualDir = path.join(PACKAGES_ROOT, pkgName, 'lib');

  assertDirectoryExists(expectedDir, 'Fixture');
  assertDirectoryExists(actualDir, 'Package lib');

  const report = { pkgName, missing: [], unexpected: [], mismatched: [] };

  const expectedFiles = listFilesRecursive(expectedDir);
  const actualFiles = listFilesRecursive(actualDir);

  const expectedSet = new Set(expectedFiles);
  const actualSet = new Set(actualFiles);

  for (const file of expectedFiles) {
    if (!actualSet.has(file)) {
      report.missing.push(file);
    }
  }

  for (const file of actualFiles) {
    if (!expectedSet.has(file)) {
      report.unexpected.push(file);
    }
  }

  for (const file of expectedFiles) {
    if (!actualSet.has(file)) continue;
    const expectedPath = path.join(expectedDir, file);
    const actualPath = path.join(actualDir, file);
    if (hashFile(expectedPath) !== hashFile(actualPath)) {
      report.mismatched.push(file);
    }
  }

  return report;
}

function main() {
  const failures = [];

  for (const pkgName of TARGET_PACKAGES) {
    const report = comparePackage(pkgName);
    if (
      report.missing.length > 0 ||
      report.unexpected.length > 0 ||
      report.mismatched.length > 0
    ) {
      failures.push(report);
    }
  }

  if (failures.length === 0) {
    console.log('Bundle parity check passed for accordion, buttons, and header.');
    return;
  }

  console.error('Bundle parity differences detected:');
  for (const failure of failures) {
    console.error(`\n[${failure.pkgName}]`);
    if (failure.missing.length > 0) {
      console.error('  Missing in actual build:');
      failure.missing.forEach((file) => console.error(`    - ${file}`));
    }
    if (failure.unexpected.length > 0) {
      console.error('  Unexpected files produced:');
      failure.unexpected.forEach((file) => console.error(`    - ${file}`));
    }
    if (failure.mismatched.length > 0) {
      console.error('  File content mismatches:');
      failure.mismatched.forEach((file) => console.error(`    - ${file}`));
    }
  }

  process.exitCode = 1;
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

