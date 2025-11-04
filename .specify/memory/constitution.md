<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - V. Documentation & Release Transparency → V. Documentation, Release Transparency & CI Migration
- Added principles:
  - VI. Platform Compatibility & Stewardship
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ updated
  - .specify/templates/spec-template.md — ✅ updated
  - .specify/templates/tasks-template.md — ✅ updated
- Follow-up TODOs: None
-->

# TrueCMS Design System Components Constitution

## Core Principles

### I. Node 22 Runtime Baseline
- **MUST** declare `engines.node >= 22.0.0` in every package manifest and keep CI matrices on Node 22 + the latest LTS.
- **MUST** execute `pnpm run bootstrap`, `pnpm run build`, and `pnpm run test` under Node 22 before merge or release.
- **MUST NOT** introduce runtime or tooling dependencies that break Node 22 support without an approved rollback or mitigation plan.
Rationale: The modernization program guarantees long-term operability on Node 22, preventing regressions for supported agencies.

### II. Packaging Continuity & Namespace Stewardship
- **MUST** publish packages under the `@truecms` scope and mirror required `@gov.au/*` dist-tags until a deprecation path is ratified.
- **MUST** provide semver-consistent entry points and document any breaking changes with migration guides prior to release.
- **SHOULD** supply metadata and README notes that guide legacy consumers to the maintained packages.
Rationale: Namespace stewardship maintains trust with existing users while enabling the TrueCMS modernization strategy.

### III. Test & Accessibility Discipline
- **MUST** land Jest unit tests, Pa11y accessibility checks, and smoke tests for every new or modified component before implementation merges.
- **MUST** follow a test-first workflow where suites are authored and fail prior to writing production code.
- **MUST** keep automated checks (local and CI) green; blockers require remediation plans documented in the associated spec or task file.
Rationale: Enforcing comprehensive testing preserves accessibility and reliability commitments inherited from the original GOV.AU design system.

### IV. Dependency Hygiene & Security Readiness
- **MUST** resolve `pnpm audit --prod`/`npm audit --production` findings to zero known vulnerabilities before shipping.
- **MUST** replace legacy Pancake-era packages with maintained `@truecms/*` equivalents or document exceptions with an owner and due date.
- **MUST** capture dependency upgrades and security notes in Changesets and release documentation.
Rationale: Proactive dependency maintenance keeps the component suite safe for government adoption and compliant with security baselines.

### V. Documentation, Release Transparency & CI Migration
- **MUST** update README files, specs, and changelogs whenever behaviour, tooling, or support policy changes.
- **MUST** ship through GitHub Actions workflows (superseding CircleCI) using Changesets-driven release jobs, executing dry runs for validation when required.
- **SHOULD** annotate releases with verification evidence (Install Check logs, accessibility reports) and record CI migration status to aid downstream audits.
Rationale: Transparent documentation and modern CI pipelines ensure agencies can audit changes and adopt updates confidently while tracking the CircleCI → GitHub Actions migration.

### VI. Platform Compatibility & Stewardship
- **MUST** maintain compatibility with modern npm tooling (v10+) and ensure packages interoperate with Drupal 11 environments, documenting tested integration paths.
- **MUST** plan and track remediation work when upstream dependency shifts threaten Drupal 11 or npm compatibility, including fallbacks or migration guides.
- **SHOULD** publish compatibility matrices and sample implementations that demonstrate TrueCMS packages functioning within supported CMS ecosystems.
Rationale: Stewardship of the design system requires sustained support for agencies deploying on Drupal 11 and modern Node/npm stacks.

## Operational Standards

- pnpm 9 (via Corepack) is the authoritative package manager; do not commit `package-lock.json` or use plain `npm install`. Pancake tooling now runs via pnpm—inspect legacy npm scripts and migrate them where gaps remain.
- Maintain `.nvmrc` and `package.json` `engines` fields at Node 22, keep GitHub Actions workflows aligned with this baseline as CircleCI jobs are decommissioned, and require contributors to run `nvm use 22` from the repository root before executing scripts so local shells honour the pinned runtime.
- Keep `pnpm-lock.yaml` current—regenerate after dependency updates and commit alongside Changesets.
- Store release readiness evidence (Install Check, audit logs, Pa11y results) alongside specs within `specs/` when relevant.
- Ensure GitHub Actions steps emit structured logs and upload artefacts named `{job}-{step}.json` (e.g. `install-check-audit-report.json`, `install-check-pack-summary.json`) so audit, Pa11y, and pack verification outputs can be referenced during reviews and incident response.
- Archive replacements for any `@gov.au/pancake-*` modules within `@truecms/pancake-*` and document migration notes, including Drupal 11 integration examples.

## Delivery Workflow

1. Draft or update the feature spec using the templates in `specs/[###-feature-name]/`, capturing constitution checks up front.
2. Record Node 22, testing, dependency, CI migration, and compatibility gates in `plan.md` under the Constitution Check section before research starts.
3. Create tasks in `tasks.md` that schedule Jest, Pa11y, GitHub Actions validation, audit remediation, and documentation updates before implementation tickets.
4. Validate locally with `pnpm run bootstrap`, `pnpm run build`, `pnpm run test`, and `pnpm audit --prod`; attach logs to the spec folder when escalations occur.
5. Use Changesets to document user-facing changes and trigger the GitHub Actions–based npm Release workflow (dry run first, then publish) once checks are green.
6. Mirror updates to README, docs, and support guides—including Drupal 11 compatibility notes—before requesting maintainer approval.

## Governance

- This constitution supersedes previous project workflows; all contributors and reviewers enforce compliance in code review and CI.
- Amendments require a documented proposal (issue or spec update), review by two maintainers, and consensus recorded before merge.
- Versioning follows semantic rules: MAJOR for principle changes, MINOR for new principles/sections, PATCH for clarifications.
- Compliance reviews happen at least once per quarter and during every release candidate; findings must be tracked in `specs/` checklists.
- Exceptions must include an owner, expiration date, and remediation plan filed in the relevant spec or task artefact.

**Version**: 1.1.0 | **Ratified**: 2025-11-02 | **Last Amended**: 2025-11-02
