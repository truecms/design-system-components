#!/usr/bin/env node

/**
 * migrate-pancake.js
 *
 * Replaces legacy @gov.au Pancake package references with the @truecms scope
 * across package manifests and supporting configuration files.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages');
const AUDS_CONFIG = path.join(REPO_ROOT, 'auds.json');

const GOV_SCOPE = '@gov.au';
const TRUECMS_SCOPE = '@truecms';

function toTrueCms(name) {
  if (!name || typeof name !== 'string') return name;
  if (!name.startsWith(`${GOV_SCOPE}/pancake`)) return name;

  if (name === `${GOV_SCOPE}/pancake`) {
    return `${TRUECMS_SCOPE}/pancake`;
  }

  const suffix = name.slice(`${GOV_SCOPE}/pancake-`.length);
  return `${TRUECMS_SCOPE}/pancake-${suffix}`;
}

function migrateDependencies(pkgJson) {
  let mutated = false;

  ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach((section) => {
    const deps = pkgJson[section];
    if (!deps || typeof deps !== 'object') return;

    for (const originalName of Object.keys(deps)) {
      const desiredName = toTrueCms(originalName);
      if (desiredName === originalName) continue;

      if (deps[desiredName]) {
        // Preserve the highest version string if both scopes are present.
        const versions = new Set([deps[desiredName], deps[originalName]].filter(Boolean));
        deps[desiredName] = Array.from(versions).sort().pop();
      } else {
        deps[desiredName] = deps[originalName];
      }
      delete deps[originalName];
      mutated = true;
    }
  });

  return mutated;
}

function migrateStringValues(value) {
  if (Array.isArray(value)) {
    let changed = false;
    for (let idx = 0; idx < value.length; idx++) {
      const current = value[idx];
      const next = migrateStringValues(current);
      if (next !== current) {
        value[idx] = next;
        changed = true;
      }
    }
    return changed ? value : value;
  }

  if (value && typeof value === 'object') {
    let changed = false;
    for (const key of Object.keys(value)) {
      const result = migrateStringValues(value[key]);
      if (result !== value[key]) {
        value[key] = result;
        changed = true;
      }
    }
    return changed ? value : value;
  }

  const updated = toTrueCms(value);
  return updated;
}

function migratePackageJson(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const pkgJson = JSON.parse(original);

  const before = JSON.stringify(pkgJson);

  const depsChanged = migrateDependencies(pkgJson);

  // Walk pancake configuration objects to swap string values.
  if (pkgJson.pancake) {
    migrateStringValues(pkgJson.pancake);
  }

  let after = JSON.stringify(pkgJson);

  if (after === before) {
    return false;
  }

  // Ensure file uses two-space indentation and trailing newline.
  fs.writeFileSync(filePath, JSON.stringify(pkgJson, null, 2) + '\n');
  return depsChanged || after !== before;
}

function migrateJsonFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(original);

  const before = JSON.stringify(data);
  migrateStringValues(data);
  const after = JSON.stringify(data);

  if (after === before) {
    return false;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  return true;
}

function main() {
  const touched = [];

  const packageJsons = [];
  packageJsons.push(path.join(REPO_ROOT, 'package.json'));
  if (fs.existsSync(PACKAGES_DIR)) {
    for (const entry of fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pkgPath = path.join(PACKAGES_DIR, entry.name, 'package.json');
      if (fs.existsSync(pkgPath)) {
        packageJsons.push(pkgPath);
      }
    }
  }

  for (const file of packageJsons) {
    if (migratePackageJson(file)) {
      touched.push(path.relative(REPO_ROOT, file));
    }
  }

  if (fs.existsSync(AUDS_CONFIG) && migrateJsonFile(AUDS_CONFIG)) {
    touched.push(path.relative(REPO_ROOT, AUDS_CONFIG));
  }

  if (touched.length === 0) {
    console.log('No Pancake references needed migration.');
    return;
  }

  console.log('Migrated Pancake references in:');
  for (const file of touched) {
    console.log(` - ${file}`);
  }
}

main();
