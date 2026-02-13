import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

describe('unified prepublish smoke test', () => {
  const rootDir = path.resolve(process.cwd());
  const packageDir = path.join(rootDir, 'packages', 'unified-design-system');

  it('packs unified package tarball with expected distributable files', () => {
    execSync('pnpm -s run build:unified', {
      cwd: rootDir,
      stdio: 'pipe',
    });

    const packDestination = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-pack-'));
    const tarballPath = execSync(
      `pnpm -s pack --pack-destination "${packDestination}"`,
      {
        cwd: packageDir,
        encoding: 'utf8',
      },
    ).trim();

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
  });
});
