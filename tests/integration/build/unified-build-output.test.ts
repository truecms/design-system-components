import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

describe('unified build output', () => {
  const rootDir = path.resolve(process.cwd());
  const distDir = path.join(
    rootDir,
    'packages',
    'unified-design-system',
    'dist',
  );

  beforeAll(() => {
    execSync('pnpm -s run build:unified', {
      cwd: rootDir,
      stdio: 'pipe',
    });
  });

  it('emits JS and CSS bundles for the unified package', () => {
    const expectedFiles = [
      path.join(distDir, 'js', 'components.js'),
      path.join(distDir, 'js', 'drupal.js'),
      path.join(distDir, 'css', 'govau-theme.css'),
      path.join(distDir, 'css', 'govau-components.css'),
      path.join(distDir, 'js', 'components.d.ts'),
    ];

    expectedFiles.forEach((filePath) => {
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
