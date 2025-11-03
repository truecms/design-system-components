'use strict';

/**
 * pack-workspace-tarballs.js
 *
 * Packs every non-private workspace package into a tarball using pnpm and
 * writes the artefacts to the provided destination (defaults to dist/tarballs).
 * This centralises the logic that previously lived inside CI workflows so that
 * developers have a single, reusable entry point locally and in automation.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEFAULT_DESTINATION = path.join('dist', 'tarballs');

const resolveWorkspaceEntries = (workspaceDir) => {
  const listJson = execSync('pnpm list --recursive --depth -1 --json', {
    cwd: workspaceDir
  }).toString();

  const entries = JSON.parse(listJson);
  const resolvedWorkspace = path.resolve(workspaceDir);

  return entries.filter((entry) => {
    if (!entry.path) {
      return false;
    }

    if (entry.private === true) {
      return false;
    }

    return path.resolve(entry.path) !== resolvedWorkspace;
  });
};

const packWorkspaceTarballs = ({
  workspaceDir = process.cwd(),
  destination = DEFAULT_DESTINATION,
  stdio = 'inherit'
} = {}) => {
  const resolvedWorkspace = path.resolve(workspaceDir);
  const outputDir = path.resolve(resolvedWorkspace, destination);

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const packages = resolveWorkspaceEntries(resolvedWorkspace);

  if (packages.length === 0) {
    throw new Error('No publishable workspace packages were found.');
  }

  const metadata = packages.map((pkg) => {
    const packageJsonPath = path.join(pkg.path, 'package.json');
    const { name, version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!name || !version) {
      throw new Error(`Package at ${pkg.path} is missing name or version in package.json`);
    }

    const safeName = name.startsWith('@') ? name.slice(1).replace('/', '-') : name;
    const tarballFile = `${safeName}-${version}.tgz`;
    const tarballPath = path.join(outputDir, tarballFile);

    process.stdout.write(`Packing ${name}\n`);
    execSync(`pnpm pack --pack-destination "${outputDir}"`, {
      cwd: pkg.path,
      stdio
    });

    if (!fs.existsSync(tarballPath)) {
      throw new Error(`Expected tarball ${tarballFile} was not generated for ${name}`);
    }

    return {
      name,
      version,
      tarballFile,
      tarballPath
    };
  });

  const tarballs = metadata.map((entry) => entry.tarballFile);

  if (tarballs.length === 0) {
    throw new Error('No tarballs were produced by pnpm pack');
  }

  return {
    destination: outputDir,
    tarballs,
    packages: metadata
  };
};

const parseArgs = (args) => {
  const result = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (token === '--destination' || token === '--dest' || token === '-d') {
      result.destination = args[index + 1];
      index += 1;
    }
  }

  return result;
};

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const { destination, tarballs } = packWorkspaceTarballs({
      destination: options.destination,
      stdio: 'inherit'
    });

    console.log(`Generated ${tarballs.length} tarball(s) in ${destination}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  packWorkspaceTarballs
};
