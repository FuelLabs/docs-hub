
# Versions

There are two version sets of the docs available in the `docs-hub`: `testnet`(the default version), and `nightly`.

- The default version set is compatible with the `latest` toolchain and testnet.
- The `nightly` version set reflects the latest releases on GitHub. These versions may not be compatible with each other.

## Updating the Nightly Versions

There is a Github action that runs every Monday and Thursday at 12:00 UTC to update the `nightly` versions of the docs.

You can also update the nightly versions locally by running the command below:

```sh
pnpm docs:update:nightly
```

The `nightly` versions should be kept at the latest release on GitHub for each tool.

## Updating the Default Versions

To change the default versions, update the [`src/config/versions.json`](https://github.com/FuelLabs/docs-hub/blob/master/src/config/versions.json) file and run this command:

```sh
pnpm docs:update
```

This command will both update the the default versions to match the configuration file and make sure the nightly versions are updated.

Here is how to decide what default versions to use:

- The Sway & `forc` versions should match what is on the `latest` toolchain.
- The version of the wallet SDK should match the version of the Fuel Wallet extension if it is compatible with the `latest` toolchain. If the extension is not yet compatible, use the latest release that is compatible.
- The version of the Rust SDK should be the latest release that is compatible with the default version of `forc`.
- The version of the TypeScript SDK should be the latest release that is compatible with the default version of `forc` and the Fuel wallet.
- The version of the GraphQL API and Specs books should reflect the version of `fuel-core` used in the latest testnet. These books currently do not have regular releases.
