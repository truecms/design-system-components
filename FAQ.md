# Frequently asked questions

> These FAQs reflect the Node.js 22 modernisation of the GOV.AU Design System component library.

## Modernisation overview

### What changed in the Node 22 release?
- Node.js `>=22.0.0` is now the baseline runtime for development, CI, and published packages.
- The toolchain now relies on Dart Sass (`sass` npm package) instead of the deprecated `node-sass` bindings.
- Workspace management moved to pnpm with Changesets orchestrating version bumps and releases.
- Automated workflows were rebuilt: Install Check validates installs and packaging, Cloudflare Pages handles site deployments, and the npm Release workflow publishes to the `@truecms` scope while mirroring the legacy `@gov.au/*` tags.

### Where can I find the release notes?
Head to the package CHANGELOGs under `packages/*/CHANGELOG.md`. The modernization release includes a dedicated entry describing the runtime changes, dependency upgrades, and migration guidance for each component.

### Where can I preview the documentation site?
Visit <https://design-system-components.truecms.com.au/>. Cloudflare Pages also generates per-pull-request preview links that appear in the GitHub Checks tab.

## Compatibility and testing

### Which Node versions do you test against?
We support Node.js `>=22.0.0`. The Install Check workflow runs against Node 22.x and the latest LTS release to catch regressions early. Results are recorded in the Compatibility Test Matrix section of `specs/001-modernise-library-run/research.md`.

### Do I need pnpm as well as npm?
Yes. pnpm 9 drives local workflows and release automation. npm 10 is only used inside the Install Check workflow to verify that packages still install cleanly with the registry defaults. Follow the setup steps in [`README.md`](./README.md#local-development) to activate pnpm via Corepack.

### How do I migrate from Node 20?
See the "Migration guidance" section of [`SUPPORT.md`](./SUPPORT.md). In short: hold on the `node20-hold` dist-tag, upgrade your hosts to Node 22, run `pnpm install` and the standard build/test commands, then roll the upgrade through your environments.

## Releases and workflows

### How are releases published now?
Releases are coordinated through Changesets. Maintainers create Changesets for each change set, merge them, and trigger the **npm Release** GitHub Action (`.github/workflows/npm-release.yml`). The workflow installs dependencies with pnpm, runs the build and test scripts, and executes `pnpm run release` to publish packages to the configured scope (default `@truecms`).

### Can I run the release workflow in dry-run mode?
Yes. The workflow-dispatch input `dry_run` defaults to `true`. Run the workflow from the Actions tab without changing the input to validate credentials, or set it to `false` once you are ready to publish.

### How do I track what the Install Check workflow does?
Install Check lives at `.github/workflows/install-check.yml`. It installs dependencies via `npm ci`, runs `npm run bootstrap`, `npm run build`, `npm run test`, and packages every component with `npm pack`. If any tarball installation fails, the job logs which package needs remediation.

## Troubleshooting

### Install Check failed while installing tarballs. What now?
Check the workflow logs for the package name. Re-run the tarball steps locally under Node 22:
```sh
nvm use 22
corepack enable
npm run bootstrap
npm run build
node scripts/pack-verify.js # or rerun the failing npm pack command
```
Update the affected package (often a lingering dependency that is not Node 22 compatible) and push a fix.

### I still see references to `node-sass`. Is that expected?
No. All maintained documentation and packages now use Dart Sass. If you find an outdated reference in package docs, raise an issue or submit a pull request so it can be removed. The modernization checklist in `specs/001-modernise-library-run/checklists/package-docs.md` tracks the cleanup effort.

Still stuck? Open an issue with logs and the Node version you are using so the maintainers can help.
