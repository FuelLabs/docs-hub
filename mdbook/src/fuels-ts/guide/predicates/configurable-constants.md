# Predicate With Configurable Constants

Predicates, much like [contracts](../contracts/configurable-constants.md) and [scripts](../scripts/configurable-constants.md), also supports configurable constants. This enables Predicates to suit specific use cases and enhance their functionality.

## Example: Asset Transfer Validation

Let's consider an example where a predicate is used to validate an asset transfer. In this case, the transfer will only be executed if the recipient's address is on a pre-approved whitelist.

The following snippet illustrates how this could be implemented:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/whitelisted-address-predicate/src/main.sw' -->

In this example, you'll notice the use of a configurable constant named `WHITELISTED`. This constant has a default value that represents the default approved address.

## Modifying The Whitelist

If there is a need to whitelist another address, the `WHITELISTED` constant can be easily updated. The following snippet demonstrates how to set a new value for the `WHITELISTED` constant and to make the predicate execute the transfer:

```ts\nimport { Wallet, Provider } from 'fuels';

import {
  LOCAL_NETWORK_URL,
  WALLET_ADDRESS,
  WALLET_PVT_KEY_2,
} from '../../../../env';
import { WhitelistedAddressPredicate } from '../../../../typegend/predicates/WhitelistedAddressPredicate';

const provider = new Provider(LOCAL_NETWORK_URL);
const baseAssetId = await provider.getBaseAssetId();

const whitelisted = Wallet.fromAddress(WALLET_ADDRESS, provider);
const sender = Wallet.fromPrivateKey(WALLET_PVT_KEY_2, provider);
const recipient = Wallet.generate({ provider });

const configurable = { WHITELISTED: whitelisted.address.toB256() };

// Instantiate predicate with configurable constants
const predicate = new WhitelistedAddressPredicate({
  provider,
  data: [configurable.WHITELISTED],
  configurableConstants: configurable,
});

// Transferring funds to the predicate
const tx1 = await sender.transfer(predicate.address, 200_000, baseAssetId, {
  gasLimit: 1000,
});

await tx1.waitForResult();

const amountToTransfer = 100;

// Transferring funds from the predicate to destination if predicate returns true
const tx2 = await predicate.transfer(
  recipient.address,
  amountToTransfer,
  baseAssetId,
  {
    gasLimit: 1000,
  }
);

await tx2.waitForResult();\n```

By ensuring that the updated `WHITELISTED` address matches the intended recipient's address, the predicate will validate the transfer successfully.

## Default Whitelist Address

In scenarios where the default whitelisted address is already the intended recipient, there's no need to update the `WHITELISTED` constant. The predicate will validate the transfer based on the default value. Here's how this scenario might look:

```ts\nimport { Wallet, Provider } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { WhitelistedAddressPredicate } from '../../../../typegend/predicates/WhitelistedAddressPredicate';

const provider = new Provider(LOCAL_NETWORK_URL);
const baseAssetId = await provider.getBaseAssetId();

const sender = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const recipient = Wallet.generate({ provider });

// Instantiate predicate without configurable constants (will use the address defined in Sway)
const predicate = new WhitelistedAddressPredicate({
  provider,
  data: ['0xa703b26833939dabc41d3fcaefa00e62cee8e1ac46db37e0fa5d4c9fe30b4132'],
});

// Transferring funds to the predicate
const tx1 = await sender.transfer(predicate.address, 200_000, baseAssetId, {
  gasLimit: 1000,
});

await tx1.waitForResult();

const amountToTransfer = 100;

// Transferring funds from the predicate to destination if predicate returns true
const tx2 = await predicate.transfer(
  recipient.address,
  amountToTransfer,
  baseAssetId,
  {
    gasLimit: 1000,
  }
);

await tx2.waitForResult();\n```

This ability to configure constants within predicates provides a flexible mechanism for customizing their behavior, thereby enhancing the robustness and versatility of our asset transfer process.

It's important to note that these customizations do not directly modify the original predicate. The address of a predicate is a hash of its bytecode. Any change to the bytecode, including altering a constant value, would generate a different bytecode, and thus a different hash. This leads to the creation of a new predicate with a new address.

This doesn't mean that we're changing the behavior of the original predicate. Instead, we're creating a new predicate with a different configuration.

Therefore, while configurable constants do indeed enhance the flexibility and robustness of predicates, it is achieved by creating new predicates with different configurations, rather than altering the behavior of existing ones.
