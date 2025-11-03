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
4. Once merged, trigger the **npm Release** workflow from the Actions tab or tag a version (`git tag vX.Y.Z && git push --tags`). When dispatching manually, confirm the inputs:
   - `npm_scope` defaults to `@truecms` and rarely needs to change.
   - `dist_tag` defaults to `latest`; use `next`, `dev`, or a custom tag to stage releases.
   - `dry_run` defaults to `true`; set to `false` only when you are ready to publish for real.

Pre-release smoke tags ending in `-dev`, `-next`, `-rc`, `-beta`, or `-alpha` automatically map to the appropriate dist-tags and run the publish step in **dry-run mode** unless the repository variable `FORCE_PUBLISH_FROM_TAG` (or `FORCE_PUBLISH`) is set to `true`. This allows maintainers to verify the workflow without contacting npm. When you are ready to publish an actual pre-release, either dispatch the workflow manually with `dry_run=false` or set the repository variable before pushing the tag.

The workflow performs the following checks automatically:

- Installs dependencies using Node 22 and pnpm
- Builds packages and runs the full test suite
- Executes `pnpm run build:site-dist` to ensure documentation assets still build
- Audits production dependencies and fails on any vulnerability
- Publishes via Changesets with provenance metadata when the npm token is present
- Uploads the dry-run summary (`changesets-summary.json`) and packed tarball manifest (`pack-summary.json`) when exercising the install check pipeline

## Dry Run Release Validation

Every pull request also triggers the **Dry run release validation** job inside `install-check.yml`. This job:

- Rebuilds packages, reruns the full test suite, and rebuilds the documentation bundle on Node 22.
- Executes `pnpm run release -- --dry-run` to confirm Changesets can publish without contacting npm.
- Packs every workspace tarball, installs them in a disposable workspace, and records the results in `dist/tarballs/pack-summary.json`.
- Persists `changesets-summary.json` (the raw release plan) and `dist/tarballs/pack-summary.json` as workflow artifacts for auditing.

Download those artifacts from the workflow run to confirm the release plan before tagging.

### Artifact reference

- `install-check-artifacts-<node>`: contains `install-check-audit-report.json`, bundle parity summaries, Pa11y reports for each exercised component, performance metrics, and `dist/tarballs/install-check-pack-summary.json`.
- `dry-run-release-artifacts`: captures `changesets-summary.json`, the aggregate tarball install summary, bundle parity outputs, the Pa11y report bundle, and performance metrics for the dry run pipeline.
- `npm-release-artifacts`: stores the final audit output alongside bundle parity, Pa11y logs, and performance summaries so maintainers can prove what was published.

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
