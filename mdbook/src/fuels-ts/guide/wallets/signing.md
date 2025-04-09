# Signing

## Signing Messages

Signing messages with a wallet is a fundamental security practice in a blockchain environment. It can be used to verify ownership and ensure the integrity of data.

Here's how to use the `wallet.signMessage` method to sign messages (as string):

```ts\nimport { hashMessage, Signer, WalletUnlocked } from 'fuels';

const wallet = WalletUnlocked.generate();

const message: string = 'my-message';
const signedMessage = await wallet.signMessage(message);
// Example output: 0x277e1461cbb2e6a3250fa8c490221595efb3f4d66d43a4618d1013ca61ca56ba

const hashedMessage = hashMessage(message);
// Example output: 0x40436501b686546b7c660bb18791ac2ae35e77fbe2ac977fc061922b9ec83766

const recoveredAddress = Signer.recoverAddress(hashedMessage, signedMessage);
// Example output: Address {
//   b256Address: '0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f'
// }\n```

The `signMessage` method internally:

- Hashes the message (via `hashMessage`)
- Signs the hashed message using the wallet's private key
- Returns the signature as a hex string

The `hashMessage` helper will:

- Performs a SHA-256 hash on the UTF-8 encoded message.

The `recoverAddress` method from the `Signer` class will take the hashed message and the signature to recover the signer's address. This confirms that the signature was created by the holder of the private key associated with that address, ensuring the authenticity and integrity of the signed message.

## Signing Personal Message

We can also sign arbitrary data, not just strings. This is possible by passing an object containing the `personalSign` property to the `hashMessage` and `signMessage` methods:

```ts\nconst message: string | Uint8Array = Uint8Array.from([0x01, 0x02, 0x03]);
const signedMessage = await wallet.signMessage({ personalSign: message });
// Example output: 0x0ca4ca2a01003d076b4044e38a7ca2443640d5fb493c37e28c582e4f2b47ada7

const hashedMessage = hashMessage({ personalSign: message });
// Example output: 0x862e2d2c46b1b52fd65538c71f7ef209ee32f4647f939283b3dd2434cc5320c5\n```

The primary difference between this [personal message signing](#signing-personal-message) and [message signing](#signing-messages) is the underlying hashing format.

To format the message, we use a similar approach to a [EIP-191](https://eips.ethereum.org/EIPS/eip-191):

```console
\x19Fuel Signed Message:\n<message length><message>
```

> **Note**: We still hash using `SHA-256`, unlike Ethereum's [EIP-191](https://eips.ethereum.org/EIPS/eip-191) which uses `Keccak-256`.

## Signing Transactions

Signing a transaction involves using your wallet to sign the transaction ID (also known as [transaction hash](https://docs.fuel.network/docs/specs/identifiers/transaction-id/)) to authorize the use of your resources. Here's how it works:

1. `Generate a Signature`: Using the wallet to create a signature based on the transaction ID.

2. `Using the Signature on the transaction`: Place the signature in the transaction's `witnesses` array. Each Coin / Message input should have a matching `witnessIndex`. This index indicates your signature's location within the `witnesses` array.

3. `Security Mechanism`: The transaction ID is derived from the transaction bytes (excluding the `witnesses`). If the transaction changes, the ID changes, making any previous signatures invalid. This ensures no unauthorized changes can be made after signing.

The following code snippet exemplifies how a Transaction can be signed:

```ts\nimport {
  Address,
  Provider,
  ScriptTransactionRequest,
  Signer,
  Wallet,
} from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);
const sender = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const receiverAddress = Address.fromRandom();

const request = new ScriptTransactionRequest({
  gasLimit: 10000,
});

request.addCoinOutput(receiverAddress, 1000, await provider.getBaseAssetId());

await request.estimateAndFund(sender);

const signedTransaction = await sender.signTransaction(request);
const transactionId = request.getTransactionId(await provider.getChainId());

const recoveredAddress = Signer.recoverAddress(
  transactionId,
  signedTransaction
);

request.updateWitnessByOwner(recoveredAddress, signedTransaction);

const tx = await provider.sendTransaction(request);
await tx.waitForResult();\n```

Similar to the sign message example, the previous code used `Signer.recoverAddress` to get the wallet's address from the transaction ID and the signed data.

When using your wallet to submit a transaction with `wallet.sendTransaction()`, the SDK already handles these steps related to signing the transaction and adding the signature to the `witnesses` array. Because of that, you can skip this in most cases:

```ts\nimport { Address, Provider, ScriptTransactionRequest, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);
const sender = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const receiverAddress = Address.fromRandom();

const request = new ScriptTransactionRequest({
  gasLimit: 10000,
});

request.addCoinOutput(receiverAddress, 1000, await provider.getBaseAssetId());

await request.estimateAndFund(sender);

const tx = await sender.sendTransaction(request);
await tx.waitForResult();\n```
