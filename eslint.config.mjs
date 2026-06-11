// ESLint flat config — permissive baseline.
// Philosophy: gate CI on NEW violations of important rules.
// Where existing code pervasively violates a stylistic/legacy rule,
// the rule is turned off or set to 'warn' with a note below.
//
// "Baseline relaxations" block at the bottom of each section explains
// every rule that was relaxed and roughly why.

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // ── Global ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      'packages/*/lib/**',
      'dist/**',
      'site-dist/**',
      'coverage/**',
      // Compiled browser-test fixtures and webpack bundles — not maintained source.
      // EXCEPT packages/*/tests/unit/**/*.spec.js which IS maintained (matched later).
      'packages/*/tests/react/**',
      'packages/*/tests/jquery/**',
      'packages/*/tests/site/**',
      'packages/*/tests/index.html',
      'reports/**',
      'specs/**',
      'docs/**',
      '.codegraph/**',
      'index.html',
      'tests/integration/*/fixtures/**',
      // Template scaffold files — contain placeholder tokens (e.g. AU[-replace-name-])
      // that are intentionally invalid JS syntax. Not linted.
      '.templates/**',
    ],
  },

  // ── Node scripts: scripts/**/*.{js,cjs} and root *.cjs ─────────────────────
  {
    files: ['scripts/**/*.js', 'scripts/**/*.cjs', '*.cjs'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // ── Baseline relaxations for scripts/ ────────────────────────────────
      // no-console: ~30+ uses across build/CI scripts — intentional output
      'no-console': 'off',
      // no-process-exit: used throughout CLI scripts legitimately
      'no-process-exit': 'off',
      // no-unused-vars: Some helpers declare params for API compatibility
      //   or have dead code (e.g. helper.js:verbose param, code var). Warn only.
      'no-unused-vars': 'warn',
      // no-useless-assignment: Some scripts (a11y.js, helper.js) reassign vars
      //   in legacy patterns. Warn only.
      'no-useless-assignment': 'warn',
      // preserve-caught-error: performance-metrics.js wraps errors with context
      //   using `new Error(error.message)` — valid pattern, no `cause` needed.
      'preserve-caught-error': 'off',
    },
  },

  // ── Node scripts: scripts/**/*.mjs (ES modules) ──────────────────────────
  {
    files: ['scripts/**/*.mjs'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // ── Baseline relaxations for scripts/*.mjs ───────────────────────────
      // no-console: ~30+ uses across build/CI scripts — intentional output
      'no-console': 'off',
    },
  },

  // ── Vanilla JS module files: packages/*/src/js/module.js ────────────────
  // These are UMD/script-style files that use `module.exports` / `exports`
  // via a runtime guard: `if(typeof module !== 'undefined') { ... }`.
  // They must be parsed as scripts (not ES modules) so `module` and `exports`
  // are available as browser globals via the UMD pattern.
  {
    files: ['packages/*/src/js/module.js'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.node,
        // Legacy global AU namespace
        AU: 'writable',
        // UMD guard pattern: `if(typeof module !== 'undefined') { module.exports = AU; }`
        module: 'writable',
        exports: 'writable',
      },
    },
    rules: {
      // ── Baseline relaxations for module.js files ─────────────────────────
      // no-var: All module.js files use var extensively — legacy IE-era style.
      'no-var': 'off',
      // no-redeclare: toggleClasses() pattern redeclares vars inside if/else
      //   using var (var hoisting). Quirky but valid legacy pattern.
      'no-redeclare': 'off',
      // no-empty: Intentional empty catch blocks used to stop event propagation
      //   (try { window.event.cancelBubble = true; event.stopPropagation(); } catch(e) {})
      //   ~8 occurrences across accordion, main-nav, side-nav. Pattern is intentional.
      'no-empty': 'off',
      // no-unused-vars: Caught error vars in empty catch blocks. Warn only.
      'no-unused-vars': 'warn',
      // no-useless-assignment: `var height = 0` then overwritten in if/else.
      //   Legacy initialisation pattern.
      'no-useless-assignment': 'off',
    },
  },

  // ── jQuery plugin files: packages/*/src/js/jquery.js ────────────────────
  // These expect $ and jQuery as browser globals injected by the host page.
  {
    files: ['packages/*/src/js/jquery.js'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.jquery,
        // Legacy global AU namespace
        AU: 'writable',
      },
    },
    rules: {
      // ── Baseline relaxations for jquery.js files ─────────────────────────
      // no-var: Legacy IE-era style — intentional.
      'no-var': 'off',
      // no-unused-vars: Warn only (some params unused for API compat).
      'no-unused-vars': 'warn',
    },
  },

  // ── React/JSX source packages: packages/*/src/js/*.js ───────────────────────
  // These are legacy ES5-era class components written before strict tooling.
  {
    files: ['packages/*/src/js/*.js'],
    // Exclude module.js and jquery.js — handled by their own blocks above.
    ignores: ['packages/*/src/js/module.js', 'packages/*/src/js/jquery.js'],
    plugins: {
      react,
    },
    extends: [js.configs.recommended, react.configs.flat.recommended],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Legacy global AU namespace used across vanilla-JS module files
        AU: 'writable',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      // eslint-plugin-react@7.37.5 uses context.getFilename() when version is
      // 'detect', which was removed in ESLint 10. Pin to installed React version
      // to avoid the deprecated API path.
      react: {
        version: '19',
      },
    },
    rules: {
      // ── Baseline relaxations for packages/*/src/js/*.js ──────────────────
      //
      // no-var: All module.js files use var extensively (~100+ occurrences).
      //   Legacy IE-era style, intentional. Not a bug.
      'no-var': 'off',

      // no-redeclare: toggleClasses() in module.js files redeclares oldClass/newClass
      //   inside if/else branches using var (var hoisting). ~8 occurrences across
      //   accordion, animate, main-nav, side-nav. This is a quirky but valid legacy
      //   pattern (not a real bug given var semantics).
      'no-redeclare': 'off',

      // no-unused-vars: Several react.js components destructure props that are
      //   used for side-effects or passed as attributeOptions spread. ~15+
      //   occurrences. Setting to warn so new unused vars are visible.
      'no-unused-vars': 'warn',

      // no-empty: Intentional empty catch blocks used to stop event propagation
      //   in accordion, main-nav, side-nav — a legacy browser-compat pattern.
      //   ~8 occurrences across the package source. Intentional.
      'no-empty': 'off',

      // no-useless-assignment: `var height = 0` then overwritten in if/else.
      //   Legacy pattern used in accordion and main-nav. Not a bug.
      'no-useless-assignment': 'off',

      // react/prop-types: All components declare PropTypes at the bottom, but
      //   the plugin flags certain patterns (e.g. spread ...attributeOptions,
      //   children used from props inside class methods). ~20+ false-positive
      //   flags. Turn off — PropTypes are already declared manually.
      'react/prop-types': 'off',

      // react/display-name: Anonymous functional components (arrow functions
      //   assigned to const) are flagged. ~10 components affected. Legacy style.
      'react/display-name': 'off',

      // react/no-deprecated: Components use componentDidUpdate and other older
      //   lifecycle methods that are valid in React 16/17 but flagged in some
      //   versions. Turn off — these are intentional legacy patterns.
      'react/no-deprecated': 'off',

      // react/react-in-jsx-scope: Not required with React 17+ JSX transform.
      //   The packages do not import React in every file but the build adds it.
      'react/react-in-jsx-scope': 'off',

      // react/no-children-prop: callout and header components pass children as
      //   a prop (children={text}) — legacy pattern from before JSX children.
      //   ~4 occurrences. Intentional API design.
      'react/no-children-prop': 'off',

      // no-extra-boolean-cast: A few occurrences where !!value is used.
      //   Not a bug, just style.
      'no-extra-boolean-cast': 'off',
    },
  },

  // ── Spec / test files (**/*.spec.js, scripts/__tests__/**) ──────────────────
  {
    files: [
      '**/*.spec.js',
      'scripts/__tests__/**/*.js',
    ],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // ── Baseline relaxations for spec files ──────────────────────────────
      // no-unused-vars: Test helpers and fixtures sometimes shadow or define
      //   vars not directly used in assertions.
      'no-unused-vars': 'warn',
      // no-useless-assignment: animate.spec.js uses `i++` inside Array.from
      //   mapper — the increment is intentional but the value is unused.
      'no-useless-assignment': 'warn',
    },
  },

  // ── packages/*/tests/unit/**/*.spec.js ─ JSX-enabled spec files ─────────────
  // Unit specs import React components so need JSX + browser globals too.
  {
    files: ['packages/*/tests/unit/**/*.spec.js'],
    plugins: { react },
    extends: [js.configs.recommended, react.configs.flat.recommended],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      // See note in packages/*/src/js/*.js section about eslint-plugin-react + ESLint 10.
      react: {
        version: '19',
      },
    },
    rules: {
      // ── Baseline relaxations for package unit specs ───────────────────────
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'no-unused-vars': 'warn',
      // no-useless-assignment: animate.spec.js uses `i++` inside Array.from
      //   mapper — the increment is intentional (iteration counter) but the
      //   value itself is unused.
      'no-useless-assignment': 'warn',
    },
  },

  // ── TypeScript source: src/**/*.{ts,tsx}, tests/**/*.ts, vite.config.ts ────
  ...tseslint.config({
    files: ['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.ts', 'vite.config.ts'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      // ── Baseline relaxations for TypeScript ──────────────────────────────
      // @typescript-eslint/no-explicit-any: asset-manifest.ts and compat layer
      //   use `any` for Proxy/generic interop. ~5 occurrences.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }),
]);
