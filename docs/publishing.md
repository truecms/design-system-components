# Publishing @truecms Packages

This document outlines how releases are produced for the design system components and the safeguards required to keep the npm channel healthy.

## Prerequisites

- Node.js 22 (`nvm use 22` locally) and pnpm 9+
- GitHub Actions secret `NPM_TOKEN_TRUECMS` containing an npm Access Token with publish rights to the `@truecms` scope
- Changesets entry for every change destined for release
- Clean working tree (`pnpm install --frozen-lockfile` succeeds without modifications)

## Release Workflow Overview

1. Merge approved pull requests into `main`.
2. Run `pnpm changeset` to create or update release notes.
3. Commit and push the changeset file, then open a pull request.
4. Once merged, trigger the **npm Release** workflow from the Actions tab or tag a version (`git tag vX.Y.Z && git push --tags`).

The workflow performs the following checks automatically:

- Installs dependencies using Node 22 and pnpm
- Builds packages and runs the full test suite
- Executes `pnpm run build:site-dist` to ensure documentation assets still build
- Audits production dependencies and fails on any vulnerability
- Publishes via Changesets with provenance metadata when the npm token is present

## Manual Publish (Fallback)

If GitHub Actions is unavailable, a maintainer can publish locally:

```bash
nvm use 22
pnpm install --frozen-lockfile
pnpm run build
pnpm run test
pnpm run build:site-dist
pnpm audit --prod
pnpm changeset version
pnpm install --frozen-lockfile
pnpm run release
```

Ensure `NPM_TOKEN_TRUECMS` is available in the environment before running `pnpm run release`.

## Secrets and Provenance

- `NPM_TOKEN_TRUECMS` must be configured at the repository level; the workflows explicitly fail if it is missing.
- Package provenance is enabled by exporting `NPM_CONFIG_PROVENANCE=true`, allowing npm to record the GitHub workflow context used for the publication.

## Post-Release Checklist

- Verify the publish summary in the workflow logs to confirm each package version incremented as expected.
- Run `pnpm outdated` locally to ensure no unexpected regressions remain.
- Notify consumers via the release notes channel (`#design-system-releases` on Slack) and update any dependent repositories.
