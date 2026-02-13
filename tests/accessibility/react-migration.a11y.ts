import pa11y from 'pa11y';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

describe('React migration accessibility (fixture)', () => {
  it('reports no serious accessibility issues for the sample app page', async () => {
    const fixtureRoot = path.resolve(
      process.cwd(),
      'tests/integration/react/fixtures/sample-app',
    );
    const htmlPath = path.join(fixtureRoot, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Pa11y requires a URL; use a file: URL so we can exercise
    // representative markup without needing a running React app.
    expect(html).toContain('au-header');
    const url = pathToFileURL(htmlPath).toString();

    const results = await pa11y(url, {
      includeNotices: false,
      includeWarnings: false,
      runners: ['axe'],
      chromeLaunchConfig: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    const seriousIssues = results.issues.filter(
      (issue) => issue.type === 'error',
    );

    expect(seriousIssues).toHaveLength(0);
  });
});
