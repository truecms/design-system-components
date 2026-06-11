import path from 'node:path';

import {
  validateReactMigration as validateSnapshots,
  type MigrationSnapshot,
} from '../helpers/migrationValidation';
import {
  getReactMigrationSnapshots,
} from '../../../src/lib/migration/reactMigrationService';
import {
  validateReactMigration as validateViaApi,
} from '../../../src/lib/migration/api';
import { ensureUnifiedBuild } from '../helpers/ensureBuild';

describe('React unified package migration', () => {
  beforeAll(() => {
    ensureUnifiedBuild();
  });

  const fixtureRoot = path.resolve(
    process.cwd(),
    'tests/integration/react/fixtures/sample-app',
  );

  it('produces identical HTML, CSS filenames, and public paths', () => {
    const { baseline, unified } = getReactMigrationSnapshots(fixtureRoot);

    const result = validateSnapshots(
      baseline as MigrationSnapshot,
      unified as MigrationSnapshot,
    );

    expect(result.ok).toBe(true);
    expect(result.differences).toHaveLength(0);
  });

  it('validates migration via the public API helper', () => {
    const result = validateViaApi(fixtureRoot);

    expect(result.ok).toBe(true);
    expect(result.differences).toHaveLength(0);
  });
});

