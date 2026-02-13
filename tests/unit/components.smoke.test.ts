import fs from 'node:fs';
import path from 'node:path';

describe('unified React exports', () => {
  it('re-exports legacy-compatible component entry points', () => {
    const compatExportsPath = path.resolve(
      process.cwd(),
      'src/components/compat/legacyExports.tsx',
    );
    const barrelPath = path.resolve(process.cwd(), 'src/components/index.ts');

    const compatExportsSource = fs.readFileSync(compatExportsPath, 'utf8');
    const barrelSource = fs.readFileSync(barrelPath, 'utf8');

    expect(compatExportsSource).toContain('AUbutton');
    expect(compatExportsSource).toContain('AUaccordion');
    expect(compatExportsSource).toContain('AUheader');
    expect(compatExportsSource).toContain('AUheaderBrand');
    expect(barrelSource).toContain("export * from './compat/legacyExports'");
  });
});
