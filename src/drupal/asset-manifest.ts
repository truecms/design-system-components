/**
 * Drupal-facing asset manifest for the unified design system.
 *
 * This manifest captures the CSS bundle filenames and public paths
 * that Drupal themes expect so that the Vite build can be wired to
 * emit assets under the same names used by the legacy GovAU bundles.
 */

export interface DrupalCssBundle {
  id: string;
  fileName: string;
  publicPath: string;
}

const SAMPLE_THEME_CSS_BASE_PATH = '/themes/custom/sample_theme/css/';

export const drupalCssBundles: DrupalCssBundle[] = [
  {
    id: 'theme',
    fileName: 'govau-theme.css',
    publicPath: `${SAMPLE_THEME_CSS_BASE_PATH}govau-theme.css`,
  },
  {
    id: 'components',
    fileName: 'govau-components.css',
    publicPath: `${SAMPLE_THEME_CSS_BASE_PATH}govau-components.css`,
  },
];

export function getDrupalCssFileNames(): string[] {
  return drupalCssBundles.map((bundle) => bundle.fileName);
}

export function getDrupalCssPublicPaths(): string[] {
  return drupalCssBundles.map((bundle) => bundle.publicPath);
}
