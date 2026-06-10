/**
 * Drupal-facing asset manifest for the unified design system.
 *
 * Reads emitted CSS filenames from the Vite build manifest at
 * packages/unified-design-system/dist/build-manifest.json.
 *
 * If the manifest is missing, functions throw a clear error telling the
 * developer to run `pnpm run build:unified` first.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface DrupalCssBundle {
  id: string;
  fileName: string;
  publicPath: string;
}

const SAMPLE_THEME_CSS_BASE_PATH = '/themes/custom/sample_theme/css/';

const MANIFEST_PATH = path.resolve(
  __dirname,
  '../../packages/unified-design-system/dist/build-manifest.json',
);

interface BuildManifest {
  css: string[];
  js: string[];
  generatedAt: null;
}

function readBuildManifest(): BuildManifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(
      `Build manifest not found at ${MANIFEST_PATH}. ` +
        'Run `pnpm run build:unified` first.',
    );
  }
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  return JSON.parse(raw) as BuildManifest;
}

export function getDrupalCssFileNames(): string[] {
  const manifest = readBuildManifest();
  // css entries are relative paths like "css/govau-theme.css" — return bare filenames
  return manifest.css.map((p) => path.basename(p));
}

/**
 * Returns public paths for a given prefix, e.g. "/apps/sample-app/css".
 */
export function getCssPublicPaths(prefix: string): string[] {
  return getDrupalCssFileNames().map((fileName) => `${prefix}/${fileName}`);
}

export function getDrupalCssPublicPaths(): string[] {
  return getCssPublicPaths(SAMPLE_THEME_CSS_BASE_PATH.replace(/\/$/, ''));
}

const BUNDLE_IDS: Record<string, string> = {
  'govau-theme.css': 'theme',
  'govau-components.css': 'components',
};

/**
 * Returns structured bundle descriptors derived from the real build manifest.
 * Reads the manifest on every call — do not call at module initialisation time.
 */
export function getDrupalCssBundleList(): DrupalCssBundle[] {
  return getDrupalCssFileNames().map((fileName) => ({
    id: BUNDLE_IDS[fileName] ?? fileName.replace(/\.css$/, ''),
    fileName,
    publicPath: `${SAMPLE_THEME_CSS_BASE_PATH}${fileName}`,
  }));
}

/**
 * Named export kept for API compatibility.
 * Reads the manifest lazily on first element access via a getter.
 */
export const drupalCssBundles: DrupalCssBundle[] = (() => {
  let cached: DrupalCssBundle[] | null = null;
  return new Proxy([] as DrupalCssBundle[], {
    get(_, prop: string | symbol) {
      if (cached === null) {
        cached = getDrupalCssBundleList();
      }
      return (cached as unknown as Record<string | symbol, unknown>)[prop];
    },
  });
})();
