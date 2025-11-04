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

function ensureParentDirectory(filePath) {
  const directory = path.dirname(filePath);
  if (!directory || directory === '.' || directory === '/') {
    return;
  }

  fs.mkdirSync(directory, { recursive: true });
}

function formatReportLines(results) {
  const lines = [];

  for (const result of results) {
    const summary = `${result.pkgName}: ${result.status.toUpperCase()}`;
    lines.push(summary);

    if (result.status === 'passed') {
      continue;
    }

    if (result.missing.length > 0) {
      lines.push('  Missing in actual build:');
      result.missing.forEach((file) => lines.push(`    - ${file}`));
    }

    if (result.unexpected.length > 0) {
      lines.push('  Unexpected files produced:');
      result.unexpected.forEach((file) => lines.push(`    - ${file}`));
    }

    if (result.mismatched.length > 0) {
      lines.push('  File content mismatches:');
      result.mismatched.forEach((file) => lines.push(`    - ${file}`));
    }
  }

  return lines;
}

function parseArgs(argv) {
  const options = {
    reportPath: process.env.BUNDLE_PARITY_REPORT_PATH,
    logPath: process.env.BUNDLE_PARITY_LOG_PATH
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--report' && argv[index + 1]) {
      options.reportPath = argv[index + 1];
      index += 1;
    } else if (token === '--log' && argv[index + 1]) {
      options.logPath = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

function main(options = parseArgs(process.argv.slice(2))) {
  const results = TARGET_PACKAGES.map((pkgName) => {
    const report = comparePackage(pkgName);
    const status =
      report.missing.length === 0 &&
      report.unexpected.length === 0 &&
      report.mismatched.length === 0
        ? 'passed'
        : 'failed';

    return {
      ...report,
      status
    };
  });

  if (options.reportPath) {
    ensureParentDirectory(options.reportPath);
    fs.writeFileSync(options.reportPath, JSON.stringify(results, null, 2));
  }

  if (options.logPath) {
    ensureParentDirectory(options.logPath);
    fs.writeFileSync(
      options.logPath,
      `${formatReportLines(results).join('\n')}\n`
    );
  }

  const failures = results.filter((result) => result.status !== 'passed');

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

module.exports = {
  comparePackage,
  parseArgs,
  formatReportLines,
  main
};
