import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // We are building a small set of entrypoints for the unified package:
    // - React components barrel
    // - Drupal CSS bundles
    rollupOptions: {
      input: {
        components: 'src/components/index.ts',
        drupal: 'src/drupal/index.ts',
        drupalTheme: 'src/styles/drupal/govau-theme.css',
        drupalComponents: 'src/styles/drupal/govau-components.css',
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
