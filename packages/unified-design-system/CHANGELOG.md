# @truecms/design-system

## 1.1.0

### Minor Changes

- c7b0708: Expand the unified design-system package so a GovCMS UI-Kit consumer can install a single `@truecms/design-system` dependency and still resolve the full Drupal starter theme package surface during build and tarball install verification. Also broaden the Drupal CSS entrypoints to build from source dependency entrypoints in a clean checkout.

## 1.0.0

### Major Changes

- Major release for modern-stack migration and upstream package refactoring baseline.

### Minor Changes

- 5c50990: Introduce the unified Vite-based GovAU design system package that produces React components and Drupal-compatible CSS bundles from a single build, and wire npm release workflows so the unified package can be built, tested, and published alongside existing component packages.

### Patch Changes

- Updated dependencies
  - @truecms/accordion@9.0.0
  - @truecms/buttons@5.0.0
  - @truecms/header@6.0.0
