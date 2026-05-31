'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { packWorkspaceTarballs } = require('./pack-workspace-tarballs');

const parseArgs = (args) => {
  const options = {
    destination: path.join('dist', 'tarballs'),
    summaryFile: 'pack-summary.json',
    installPrefix: 'verify-all-tarballs'
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    const value = args[index + 1];

    if (token === '--workspace' || token === '-w') {
      options.workspace = value;
      index += 1;
      continue;
    }

    if (token === '--destination' || token === '--dest' || token === '-d') {
      options.destination = value;
      index += 1;
      continue;
    }

    if (token === '--summary-file' || token === '-s') {
      options.summaryFile = value;
      index += 1;
      continue;
    }

    if (token === '--install-prefix' || token === '-p') {
      options.installPrefix = value;
      index += 1;
    }
  }

  return options;
};

const verifyWorkspaceTarballs = ({
  workspaceDir = process.cwd(),
  destination = path.join('dist', 'tarballs'),
  summaryFile = 'pack-summary.json',
  installPrefix = 'verify-all-tarballs',
  runnerTemp = process.env.RUNNER_TEMP || os.tmpdir()
} = {}) => {
  const workspace = path.resolve(workspaceDir);
  const { destination: tarballDir, packages } = packWorkspaceTarballs({
    workspaceDir: workspace,
    destination,
    stdio: 'inherit'
  });

  if (!packages || packages.length === 0) {
    throw new Error('No tarballs found to verify.');
  }

  const installDir = path.join(
    runnerTemp,
    `${installPrefix}-${Date.now().toString(36)}`
  );

  fs.rmSync(installDir, { recursive: true, force: true });
  fs.mkdirSync(installDir, { recursive: true });

  const installPackageJson = {
    name: installPrefix,
    private: true,
    version: '0.0.0',
    dependencies: {},
    pnpm: {
      overrides: {}
    }
  };

  for (const entry of packages) {
    const tarballReference = `file:${entry.tarballPath}`;
    installPackageJson.dependencies[entry.name] = tarballReference;
    installPackageJson.pnpm.overrides[entry.name] = tarballReference;
    installPackageJson.pnpm.overrides[`${entry.name}@${entry.version}`] = tarballReference;
  }

  fs.writeFileSync(
    path.join(installDir, 'package.json'),
    JSON.stringify(installPackageJson, null, 2)
  );

  execSync('npm install --ignore-scripts', { cwd: installDir, stdio: 'inherit' });

  const summary = packages.map((entry) => ({
    tarball: entry.tarballFile,
    package: entry.name,
    installDir: path.relative(workspace, installDir)
  }));

  const summaryPath = path.join(tarballDir, summaryFile);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  return {
    tarballDir,
    installDir,
    summaryPath,
    packages
  };
};

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = verifyWorkspaceTarballs({
      workspaceDir: options.workspace,
      destination: options.destination,
      summaryFile: options.summaryFile,
      installPrefix: options.installPrefix
    });

    console.log(
      `Verified ${result.packages.length} tarball(s); summary written to ${result.summaryPath}`
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  verifyWorkspaceTarballs
};
