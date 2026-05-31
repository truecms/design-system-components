import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

function emitUnifiedTypeDeclarations() {
  return {
    name: 'emit-unified-type-declarations',
    writeBundle() {
      const outputDir = path.resolve(
        process.cwd(),
        'packages/unified-design-system/dist/js',
      );
      const declarationPath = path.join(outputDir, 'components.d.ts');

      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(
        declarationPath,
        [
          'export declare const AUbutton: any;',
          'export declare const AUaccordion: any;',
          'export declare const AUheader: any;',
          'export declare const AUheaderBrand: any;',
          '',
        ].join('\n'),
        'utf8',
      );
    },
  };
}

export default defineConfig({
  plugins: [emitUnifiedTypeDeclarations()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'legacy-js-api'],
      },
    },
  },
  build: {
    // We are building a small set of entrypoints for the unified package:
    // - React components barrel
    // - Drupal CSS bundles
    rollupOptions: {
      input: {
        components: 'src/components/index.ts',
        drupal: 'src/drupal/index.ts',
        drupalTheme: 'src/styles/drupal/govau-theme.scss',
        drupalComponents: 'src/styles/drupal/govau-components.scss',
      },
      external: [
        'react',
        'react-dom',
        '@truecms/buttons',
        '@truecms/accordion',
        '@truecms/header',
      ],
      output: {
        dir: 'packages/unified-design-system/dist',
        entryFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';

          // Preserve Drupal CSS bundle filenames expected by themes by mapping
          // internal logical entry names to the public bundle names.
          if (name.endsWith('drupalTheme.css')) {
            return 'css/govau-theme.css';
          }
          if (name.endsWith('drupalComponents.css')) {
            return 'css/govau-components.css';
          }

          if (name.endsWith('.css')) {
            return 'css/[name][extname]';
          }

          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
