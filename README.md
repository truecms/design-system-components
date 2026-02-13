# GOV.AU Design System Components (Node 22 modernisation)

> This repository is a modernisation fork of the Australian Government Design System components. The upstream service was decommissioned in 2020; to keep long-running programmes unblocked we migrated the code to the TrueCMS GitHub organisation, continue to publish under the new `@truecms` npm scope, and mirror the legacy `@gov.au/*` tags so existing consumers remain supported.

This migration allows the maintainers to provide funded support for agencies and vendors who still rely on the original component APIs. Active development now happens in the open under the TrueCMS banner, but compatibility guarantees, accessibility goals, and public licensing remain unchanged.

## Documentation & previews

- Production preview site: <https://design-system-components.truecms.com.au/>
- Pull requests trigger Cloudflare preview builds linked from the Checks tab.
- Contributor guides live under [`docs/`](./docs/) with focused walkthroughs for publishing, Drupal integration, and migration steps.
- The unified GovAU design system migration (Vite/Tailwind/React) is tracked under [`specs/001-proceed-task-context/`](./specs/001-proceed-task-context/) with a planning quickstart in [`specs/001-proceed-task-context/quickstart.md`](./specs/001-proceed-task-context/quickstart.md) and a target-state spec in [`docs/todo/gov-design-system-target-spec.txt`](./docs/todo/gov-design-system-target-spec.txt).

## Quick AI-assisted GovCMS migration

Use these prompts in your coding assistant to run the legacy `@gov.au/*` to `@truecms/*` upgrade workflow.

- `Codex`
  ```text
  Fetch and follow instructions from https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/main/docs/installation/codex/INSTALL.md
  ```
- `Claude Code`
  ```text
  Fetch and follow instructions from https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/main/docs/installation/claude/INSTALL.md
  ```
- `OpenCode`
  ```text
  Fetch and follow instructions from https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/main/docs/installation/opencode/INSTALL.md
  ```
- `Cursor`
  ```text
  Fetch and follow instructions from https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/main/docs/installation/cursor/INSTALL.md
  ```

If you are testing before merge (for example from `feature/d11`), replace `main` in each URL with your branch name.

## Runtime requirements

| Tool    | Minimum | Recommended |
|---------|---------|-------------|
| Node.js | 22.0.0  | 22.x (Active LTS) |
| npm     | 10.0.0  | 10.x bundled with Node 22 |
| pnpm    | 9.0.0   | 9.12.x via Corepack |

Earlier Node releases are no longer supported. Automated workflows and published packages declare these engine constraints to prevent accidental installs on unsupported runtimes.

## Local development

1. Use `nvm` (or your preferred version manager) to select Node 22:
   ```sh
   nvm install 22
   nvm use 22
   ```
2. Enable Corepack so pnpm 9 is available:
   ```sh
   corepack enable
   corepack prepare pnpm@9 --activate
   ```
3. Install workspace dependencies and refresh the lockfile:
   ```sh
   pnpm run bootstrap
   ```
4. Build the component suites:
   ```sh
   pnpm run build
   ```
5. Execute the full verification sweep (Jest unit tests, Pa11y accessibility, helper smoke tests, and bundle parity checks):
   ```sh
   pnpm run test
   ```
6. For targeted component checks you can scope commands, for example `pnpm --filter @truecms/buttons run build`.

All scripts assume Node 22. Running them under earlier versions will emit `EBADENGINE` warnings or fail during dependency installation.

## Automation workflows

| Workflow | Location | Trigger | Purpose |
|----------|----------|---------|---------|
| Install Check | `.github/workflows/install-check.yml` | `push`, `pull_request`, `workflow_dispatch` | Thin orchestration workflow that runs the shared quality gates for Node 22 and latest LTS install sweeps, plus a dry-run release validation stage. |
| Reusable Quality Gates | `.github/workflows/reusable-quality-gates.yml` | `workflow_call` | Shared CI unit for install/build/test/site-dist/audit/tarball-install verification, performance summaries, and artifact upload. |
| npm Release | `.github/workflows/npm-release.yml` | `workflow_dispatch`, `release`, `push` tags | Two-stage release pipeline: reusable quality-gate validation followed by npm publish with Changesets and provenance. |

Refer to [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details on invoking these workflows manually during reviews.

## Release process

Releases are orchestrated with Changesets and pnpm:

1. Collect changes using `pnpm changeset` and merge the generated markdown files.
2. When ready to publish, trigger the **npm Release** workflow from the GitHub Actions tab. Supply `dry_run=false` once a release candidate is approved, or keep the default `true` for validation.
3. The workflow first runs release quality gates, then executes publish via `pnpm run release` (Changesets) under the selected scope.
4. Release artefacts are mirrored to the legacy `@gov.au/*` names via npm dist-tags so downstream teams can opt in at their own pace.

## Unified design system migration (Vite/Tailwind/React)

In addition to keeping the existing component packages healthy on Node 22, this repository now hosts the unified GovAU design system migration work:

- **Specification and plan**: `specs/001-proceed-task-context/spec.md`, `specs/001-proceed-task-context/plan.md`, `specs/001-proceed-task-context/research.md`.
- **Target-state architecture**: `docs/todo/gov-design-system-target-spec.txt`.
- **Planning quickstart**: `specs/001-proceed-task-context/quickstart.md`.

Two in-repo fixtures exercise the Drupal and React migration paths:

- Drupal sample theme: `tests/integration/drupal/fixtures/sample-theme/`
- React sample app: `tests/integration/react/fixtures/sample-app/`

Once Jest is wired to the new TypeScript tests, you can run the design-system specific checks with:

```sh
pnpm test:design-system   # Unified Jest + integration/a11y tests
pnpm test:migrations      # Drupal and React migration suites
pnpm test:bundle-size     # 30% payload cap enforcement
```

These commands are intended to gate the unified `@truecms/design-system` package without changing public HTML, CSS class names, or behaviour for existing Drupal and React consumers.

## Drupal 11 compatibility

Maintaining parity with Drupal 11 sites is a project requirement. The [`docs/drupal.md`](./docs/drupal.md) smoke guide documents the verification routine we run before each release: rebuild components on Node 22, publish local tarballs with pnpm, install them into a Drupal 11 sandbox, and manually exercise canonical pages (navigation, accordions, alerts, tables). Workflow issues that threaten Drupal compatibility are triaged with the same urgency as Node runtime regressions.

## Support and escalation

Open issues or questions on the [GitHub issue tracker](https://github.com/truecms/design-system-components/issues). The modernization maintainers triage Node compatibility reports twice weekly and follow the escalation path documented in [`SUPPORT.md`](./SUPPORT.md) to keep FR-005 monitoring requirements in place.

## Repository layout

- `packages/` – component packages, each with its own README and CHANGELOG.
- `scripts/` – build helpers for Sass/PostCSS, accessibility automation, and migration tooling.
- `.github/workflows/` – Install Check orchestration, reusable quality gates, and npm Release pipelines.
- `specs/001-already-began-task/` – design artefacts driving the original Node 22 modernisation initiative (plan, research, tasks, and checklists).
- `specs/001-proceed-task-context/` – feature spec, plan, research, tasks, and checklists for the unified design system migration.
- `docs/` – platform-specific guides such as Drupal integration, publishing, and migration from the legacy namespace.

For additional implementation context, see [`docs/wiki/node-22-modernisation.md`](./docs/wiki/node-22-modernisation.md) and the research log in `specs/001-already-began-task/research.md` for the Node 22 work, and `specs/001-proceed-task-context/research.md` together with `docs/todo/gov-design-system-target-spec.txt` for the unified design system migration.
