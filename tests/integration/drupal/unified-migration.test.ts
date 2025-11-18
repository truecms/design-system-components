import path from 'node:path';

import {
  validateDrupalMigration as validateSnapshots,
  type MigrationSnapshot,
} from '../helpers/migrationValidation';
import {
  getDrupalMigrationSnapshots,
} from '../../../src/lib/migration/drupalMigrationService';
import {
  validateDrupalMigration as validateViaApi,
} from '../../../src/lib/migration/api';

describe('Drupal unified package migration', () => {
  const fixtureRoot = path.resolve(
    process.cwd(),
    'tests/integration/drupal/fixtures/sample-theme',
  );

  it('produces identical HTML, CSS filenames, and public paths', () => {
    const { baseline, unified } = getDrupalMigrationSnapshots(fixtureRoot);

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
}
);

