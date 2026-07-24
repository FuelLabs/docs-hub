# Documentation update summary

## Why this update was needed

The public installation, Sway, and Forc documentation used one ambiguous
"Stable" or "latest" label for several different concepts. In Fuelup,
`latest` is an alias for the mainnet distribution; it is not the testnet
channel or necessarily the newest upstream compiler. The stable Sway and Forc
books were also older than the current network toolchain without making that
version boundary prominent.

## What changed

- Corrected the installation guide to distinguish `mainnet`, `testnet`,
  `latest`, and `nightly`.
- Removed obsolete literal Fuelup, beta-network, Forc, and Fuel Core output.
- Renamed the default documentation target from Stable/Testnet to Mainnet and
  added a visible pinned-version warning.
- Added a Forc-specific warning that independently released plugins may not
  share the core Forc version and that installed `--help` output is
  authoritative when versions differ.
- Updated the desired network Forc target to `0.70.2`.
- Changed stable Forc generation to require the exact versioned Sway
  `gh-pages` artifact instead of silently using `master`.
- Made the updater fail when the matching generated artifact is unavailable.
- Published the archived status and corrected migration instructions from
  `migrations-and-disclosures` through both documentation submodules.
- Added concise restart, checkpoint, retry, and rollback guidance for stateful
  migrations.
- Corrected the documented nightly-update schedule to match automation.

## Publication dependency

Sway's `v0.70.2` generated book is not yet present on its `gh-pages` branch.
The stable source remains pinned to the internally consistent `v0.69.0` source
and generated command book until that artifact is published. After the Sway
workflow is merged and run with `version=v0.70.2`, run `pnpm docs:update` here
and commit the updated `docs/sway` and `docs/builds/sway` pointers.

The `migrations-and-disclosures` documentation branch must also be pushed
before this branch so both migration gitlinks resolve remotely.

## Validation

- Production Biome lint passed.
- Guides Markdown lint passed.
- Content generation produced 1,056 documents and exercised the exact stable
  and nightly Forc artifact paths.
- All committed changes pass `git diff --check`.
