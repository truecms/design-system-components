# Migrating from `@gov.au` to `@truecms`

The Digital Transformation Agency (DTA) no longer maintains the Pancake ecosystem. This guide explains how to migrate projects to the new `@truecms` namespace that supersedes DTA packages.

## Why the migration matters

- All future fixes and security patches are published under `@truecms/*`.
- Node 22+ is required; older runtimes will no longer receive compatibility updates.
- The new packages are published from the `@truecms/pancake` monorepo and are distributed through the `@truecms` scope on npm.

## Migration checklist

1. **Pin Node and pnpm versions**
   - Add an `.nvmrc` with `22` and update CI workflows to run against Node `22.x` and `lts/*`.
   - Ensure `package.json` has `"engines": { "node": ">=22.0.0", "pnpm": ">=9.0.0" }`.

2. **Update dependencies**
   - Replace every `@gov.au/...` package reference with the equivalent `@truecms/...` name.
   - Update Pancake tooling dependencies to `@truecms/pancake`, `@truecms/pancake-sass`, `@truecms/pancake-js`, and `@truecms/pancake-json`.
   - Run `pnpm up --latest --recursive` to refresh lockfiles.

3. **Refresh Pancake configuration**
   - Update `pancake` config blocks within each component to reference the new plugin names.
   - Regenerate compiled assets (`pnpm run build`) and confirm no references to `@gov.au` remain in the output bundles.

4. **Verify build and tests**
   - Run the full CI pipeline locally: `pnpm install --frozen-lockfile`, `pnpm run build`, `pnpm run test`, `pnpm run build:site-dist`, and `pnpm audit --prod`.
   - Review accessibility and visual regression results to ensure parity with the legacy scope.

5. **Communicate to consumers**
   - Update README files, changelogs, and support documentation to highlight the namespace change.
   - Inform integrators that the `@gov.au` namespace is deprecated and will no longer receive updates.

## Common pitfalls

- **Mixed scopes**: ensure `pnpm-lock.yaml` does not contain a mix of `@gov.au` and `@truecms` packages after the migration.
- **Workspace links**: within monorepos, prefer `"workspace:*"` dependency specifiers so pnpm does not attempt to fetch unpublished packages.
- **CI secrets**: confirm `NPM_TOKEN_TRUECMS` exists; without it, publish workflows fail during authentication.

## Support

For migration assistance or to report regressions, email `engineering@truecms.com.au` or open an issue in the repository.
