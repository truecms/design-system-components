import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const expectedStarterThemePackages = [
  '@truecms/accordion',
  '@truecms/animate',
  '@truecms/body',
  '@truecms/breadcrumbs',
  '@truecms/buttons',
  '@truecms/callout',
  '@truecms/card',
  '@truecms/control-input',
  '@truecms/core',
  '@truecms/cta-link',
  '@truecms/direction-links',
  '@truecms/footer',
  '@truecms/form',
  '@truecms/grid-12',
  '@truecms/header',
  '@truecms/headings',
  '@truecms/inpage-nav',
  '@truecms/keyword-list',
  '@truecms/link-list',
  '@truecms/main-nav',
  '@truecms/page-alerts',
  '@truecms/progress-indicator',
  '@truecms/responsive-media',
  '@truecms/searchbox',
  '@truecms/select',
  '@truecms/side-nav',
  '@truecms/skip-link',
  '@truecms/table',
  '@truecms/tags',
  '@truecms/text-inputs',
];

describe('unified prepublish smoke test', () => {
  const rootDir = path.resolve(process.cwd());
  const packageDir = path.join(rootDir, 'packages', 'unified-design-system');

  it('packs unified package tarball with expected distributable files', () => {
    execSync('pnpm -s run build:unified', {
      cwd: rootDir,
      stdio: 'pipe',
    });

    const packDestination = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-pack-'));
    const packOutput = execSync(
      `pnpm -s pack --pack-destination "${packDestination}"`,
      {
        cwd: packageDir,
        encoding: 'utf8',
      },
    );

    // pnpm can print extra warning lines in CI; keep only the tarball path line.
    const tarballLine = packOutput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .findLast((line) => line.endsWith('.tgz')) || '';
    const tarballPath = path.isAbsolute(tarballLine) ?
      tarballLine :
      path.join(packageDir, tarballLine);

    expect(fs.existsSync(tarballPath)).toBe(true);

    const tarListing = execSync(`tar -tf "${tarballPath}"`, {
      encoding: 'utf8',
    });

    expect(tarListing).toContain('package/dist/js/components.js');
    expect(tarListing).toContain('package/dist/js/drupal.js');
    expect(tarListing).toContain('package/dist/js/components.d.ts');
    expect(tarListing).toContain('package/dist/css/govau-theme.css');
    expect(tarListing).toContain('package/dist/css/govau-components.css');
    expect(tarListing).toContain('package/package.json');

    const installRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-install-'));
    execSync('npm init -y', {
      cwd: installRoot,
      stdio: 'pipe',
    });
    execSync(`npm install --ignore-scripts "${tarballPath}"`, {
      cwd: installRoot,
      stdio: 'pipe',
    });

    expectedStarterThemePackages.forEach((pkg) => {
      const segments = pkg.split('/');
      const packageJsonPath = path.join(
        installRoot,
        'node_modules',
        ...segments,
        'package.json',
      );
      expect(fs.existsSync(packageJsonPath)).toBe(true);
    });
  });
});
