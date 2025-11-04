# Changesets

This repository now uses [Changesets](https://github.com/changesets/changesets) to track version bumps and release notes.

- Run `pnpm changeset` to create an entry describing the change.
- Run `pnpm run prepare:version` on the release branch to apply queued changesets and update package versions.
- Run `pnpm run release` after CI passes to publish updated packages to npm.
