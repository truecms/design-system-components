/**
 * Runtime models representing Drupal design system consumers and bundles.
 *
 * These mirror the high-level entities described in data-model.md while
 * remaining intentionally lightweight and implementation-agnostic.
 */

export type MigrationStatus = 'baseline' | 'migrated';

export interface Bundle {
  id: string;
  type: 'css' | 'js';
  fileName: string;
  publicPath: string;
  sizeBytes?: number;
}

export interface Consumer {
  id: string;
  name: string;
  designSystemVersion: string;
  migrationStatus: MigrationStatus;
  bundles: Bundle[];
}

export function createBundle(params: Bundle): Bundle {
  return { ...params };
}

export function createConsumer(params: Consumer): Consumer {
  return {
    ...params,
    bundles: [...params.bundles],
  };
}

