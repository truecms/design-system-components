import pa11y from 'pa11y';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

describe('Drupal migration accessibility (fixture)', () => {
  it('reports no serious accessibility issues for the sample theme page', async () => {
    const fixtureRoot = path.resolve(
      process.cwd(),
      'tests/integration/drupal/fixtures/sample-theme',
    );
    const templatePath = path.join(fixtureRoot, 'templates', 'page.html.twig');
    const html = fs.readFileSync(templatePath, 'utf8');

    // Pa11y requires a URL; use a file: URL pointing at the Twig
    // template so we can exercise representative markup without a
    // running Drupal instance.
    expect(html).toContain('au-header');
    const url = pathToFileURL(templatePath).toString();

    const results = await pa11y(url, {
      includeNotices: false,
      includeWarnings: false,
      runners: ['axe'],
    });

    const seriousIssues = results.issues.filter(
      (issue) =>
        issue.type === 'error' &&
        issue.code !== 'document-title' &&
        issue.code !== 'html-has-lang',
    );

    expect(seriousIssues).toHaveLength(0);
  });
});
