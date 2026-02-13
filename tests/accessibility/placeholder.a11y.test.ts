import fs from 'node:fs';
import path from 'node:path';

describe('accessibility fixture integrity', () => {
  it('keeps fixture documents with required structural accessibility markers', () => {
    const drupalFixture = path.resolve(
      process.cwd(),
      'tests/integration/drupal/fixtures/sample-theme/templates/page.html.twig',
    );
    const reactFixture = path.resolve(
      process.cwd(),
      'tests/integration/react/fixtures/sample-app/index.html',
    );

    const drupalHtml = fs.readFileSync(drupalFixture, 'utf8');
    const reactHtml = fs.readFileSync(reactFixture, 'utf8');

    expect(drupalHtml).toContain('<header');
    expect(drupalHtml).toContain('aria-label=');
    expect(reactHtml).toContain('<main');
    expect(reactHtml).toContain('lang="en"');
  });
});
