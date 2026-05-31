import pa11y from 'pa11y';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

describe('Drupal migration accessibility (fixture)', () => {
  it('reports no serious accessibility issues for the sample theme page', async () => {
    const fixtureRoot = path.resolve(
      process.cwd(),
      'tests/integration/drupal/fixtures/sample-theme',
    );
    const templatePath = path.join(fixtureRoot, 'templates', 'page.html.twig');
    const html = fs.readFileSync(templatePath, 'utf8');
    const htmlFixtureDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'drupal-migration-a11y-'),
    );
    const htmlFixturePath = path.join(htmlFixtureDir, 'page.html');
    const renderedHtml = html.replace(/\{#.*?#\}\s*/s, '');

    // Pa11y requires a real HTML document URL. Opening the raw Twig file makes
    // Chromium render the source text inside <pre>, which produces unrelated
    // contrast failures.
    expect(html).toContain('au-header');

    try {
      fs.writeFileSync(htmlFixturePath, renderedHtml, 'utf8');
      const url = pathToFileURL(htmlFixturePath).toString();

      const results = await pa11y(url, {
        includeNotices: false,
        includeWarnings: false,
        runners: ['axe'],
        chromeLaunchConfig: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      });

      const seriousIssues = results.issues.filter(
        (issue) =>
          issue.type === 'error' &&
          issue.code !== 'document-title' &&
          issue.code !== 'html-has-lang',
      );

      expect(seriousIssues).toHaveLength(0);
    }
    finally {
      fs.rmSync(htmlFixtureDir, { recursive: true, force: true });
    }
  });
});
