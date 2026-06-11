import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = path.resolve(__dirname, '../../..');
const MANIFEST_PATH = path.join(
  ROOT_DIR,
  'packages/unified-design-system/dist/build-manifest.json',
);

/**
 * Ensures the unified package has been built by checking for
 * build-manifest.json. If missing, runs `pnpm run build:unified` once.
 * Call this in a `beforeAll` block in any test suite that reads dist output.
 */
export function ensureUnifiedBuild(): void {
  if (!fs.existsSync(MANIFEST_PATH)) {
    execSync('pnpm -s run build:unified', {
      cwd: ROOT_DIR,
      stdio: 'pipe',
      maxBuffer: 64 * 1024 * 1024,
    });
  }
}
