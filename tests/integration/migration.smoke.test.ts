import {
  validateDrupalMigration,
  validateReactMigration,
} from './helpers/migrationValidation';

describe('migration validation smoke checks', () => {
  it('flags Drupal differences when HTML, CSS names, or paths drift', () => {
    const result = validateDrupalMigration(
      {
        html: '<main class="baseline"></main>',
        cssFileNames: ['govau-theme.css', 'govau-components.css'],
        publicPaths: ['/themes/custom/sample_theme/css/govau-theme.css'],
      },
      {
        html: '<main class="migrated"></main>',
        cssFileNames: ['govau-theme.v2.css'],
        publicPaths: ['/themes/custom/sample_theme/css/govau-theme.v2.css'],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.differences).toHaveLength(3);
  });

  it('flags React differences when migration changes output unexpectedly', () => {
    const result = validateReactMigration(
      {
        html: '<div class="baseline"></div>',
        cssFileNames: ['react-app.css'],
        publicPaths: ['/apps/sample-app/css/react-app.css'],
      },
      {
        html: '<div class="migrated"></div>',
        cssFileNames: ['react-app-v2.css'],
        publicPaths: ['/apps/sample-app/css/react-app-v2.css'],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.differences).toHaveLength(3);
  });
});
