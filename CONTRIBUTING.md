# Contributing to the Node 22 modernisation

Thanks for helping keep the Australian Government Design System components alive. The codebase now lives in the TrueCMS organisation so that support can continue for agencies and vendors that still depend on the legacy GOV.AU packages. This fork modernises the tooling for Node.js 22, replaces the legacy Lerna/npm workflows with pnpm and Changesets, and republishes packages under the `@truecms` scope while mirroring the old names for downstream consumers. The guidelines below describe how to prepare your environment, verify changes, and collaborate through GitHub.

## Before you start

- Install Node.js 22.x. We recommend `nvm` for switching between runtimes:
  ```sh
  nvm install 22
  nvm use 22
  ```
- Enable Corepack so pnpm 9 is available alongside npm 10:
  ```sh
  corepack enable
  corepack prepare pnpm@9 --activate
  ```
- Ensure the following minimum tooling versions:
  - Node.js `>=22.0.0`
  - npm `>=10.0.0`
  - pnpm `>=9.0.0`

## Local verification checklist

Complete the checklist below before opening a pull request or requesting review:

1. Install dependencies and refresh the workspace lockfile:
   ```sh
   pnpm run bootstrap
   ```
2. Build all component packages:
   ```sh
   pnpm run build
   ```
3. Run the full test suite (Jest unit tests + Pa11y accessibility runner):
   ```sh
   pnpm run test
   ```
4. When focusing on a single package, scope commands with pnpm filters, for example:
   ```sh
   pnpm --filter @truecms/buttons run build
   pnpm --filter @truecms/buttons run test
   ```
5. Generate or update a Changeset describing your changes:
   ```sh
   pnpm changeset
   ```
6. Update documentation and changelogs as needed to keep the Node 22 messaging consistent.

## Automated workflows

### Install Check

- File: `.github/workflows/install-check.yml`
- Triggers: `push`, `pull_request`, manual `workflow_dispatch`
- What it does: Installs dependencies with `npm ci`, runs the bootstrap/build/test scripts under Node 22 and the latest LTS, and `npm pack`s every package to validate installability.
- How to run manually:
  - GitHub UI: Actions → "Install Check" → "Run workflow".
  - GitHub CLI: `gh workflow run install-check.yml`.
- Expected outcome: Green checks on your pull request before requesting review. Investigate any tarball installation failures immediately.

### Cloudflare Pages deploy

- File: `.github/workflows/cloudflare-pages.yml`
- Purpose: Builds the documentation site using Node 22, publishing previews for pull requests and production updates on `main`.
- Manual triggers are rarely required, but you can dispatch the workflow for validation via the Actions tab when touching site assets.

### npm release

- File: `.github/workflows/npm-release.yml`
- Purpose: Runs the pnpm build/test pipeline and executes `pnpm run release` (Changesets publish) against the selected npm scope and dist-tag.
- Triggering a dry run:
  1. Navigate to Actions → "npm Release" → "Run workflow".
  2. Leave `dry_run` set to `true` (default) to validate credentials and packaging.
- Triggering a real publish:
  1. Prepare release Changesets and merge them to `main`.
  2. From the Actions tab, run the workflow with `dry_run` set to `false`. Override `npm_scope` or `dist_tag` if needed.
  3. Confirm the job completes within ~15 minutes and that packages appear under the expected scope (`@truecms` by default).
- Secrets: The workflow relies on `NPM_TOKEN_TRUECMS`; contact the maintainers via a private GitHub issue if you require access.

## Pull request expectations

- Link the relevant issue or spec task in your PR description.
- Confirm the local verification checklist and Install Check workflow have passed.
- Include new or updated documentation where the change affects user-facing behaviour (README, package docs, migration notes).
- Await at least one approval before merging. Merges to `main` should occur via squash merges to keep commit history linear.

## Getting help

File a GitHub issue with the `node-22-support` label if you encounter environmental problems. For broader questions about the modernization roadmap or escalation cadence, refer to [`SUPPORT.md`](./SUPPORT.md).
