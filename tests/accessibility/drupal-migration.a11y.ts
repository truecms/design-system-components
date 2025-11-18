import pa11y from 'pa11y';
import path from 'node:path';
import fs from 'node:fs';

describe('Drupal migration accessibility (fixture)', () => {
  it('reports no serious accessibility issues for the sample theme page', async () => {
    const fixtureRoot = path.resolve(
      process.cwd(),
      'tests/integration/drupal/fixtures/sample-theme',
    );
    const templatePath = path.join(fixtureRoot, 'templates', 'page.html.twig');
    const html = fs.readFileSync(templatePath, 'utf8');

    // Pa11y requires a URL; use a data URL so we can exercise the
    // representative markup without needing a running Drupal instance.
    const encoded = Buffer.from(html, 'utf8').toString('base64');
    const url = `data:text/html;base64,${encoded}`;

    const results = await pa11y(url, {
      includeNotices: false,
      includeWarnings: false,
      runners: ['axe'],
    });

    const seriousIssues = results.issues.filter(
      (issue) => issue.type === 'error',
    );

    expect(seriousIssues).toHaveLength(0);
  });
});

