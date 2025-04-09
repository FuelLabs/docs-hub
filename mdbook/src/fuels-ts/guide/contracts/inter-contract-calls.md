# Inter-Contract Calls with the SDK

This guide explains how to use the SDK to execute a contract call where one contract interacts with another contract. We will use a simple scenario involving a `SimpleToken` contract and a `TokenDepositor` contract.

## `SimpleToken` and `TokenDepositor` Contracts

In this example, we have a `SimpleToken` contract representing a basic token contract capable of holding balances for different addresses. We also have a `TokenDepositor` contract that deposits tokens into the `SimpleToken` contract.

### Contract: `SimpleToken`

Here's a simple token contract that allows holding balances:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/simple-token/src/main.sw' -->

### Contract: `TokenDepositor`

The `TokenDepositor` contract imports the `SimpleToken` contract and calls its `deposit` function to deposit tokens:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/token-depositor/src/main.sw' -->

## Inter-contract calls using the SDK

Once both contracts are deployed, we can use the SDK to make the `TokenDepositor` contract to call the `SimpleToken` contract.

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { SimpleTokenFactory, TokenDepositorFactory } from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const { waitForResult: waitForSimpleToken } =
  await SimpleTokenFactory.deploy(wallet);

const { contract: simpleToken } = await waitForSimpleToken();

const { waitForResult: waitForTokenDepositor } =
  await TokenDepositorFactory.deploy(wallet);

const { contract: tokenDepositor } = await waitForTokenDepositor();

const amountToDeposit = 70;
const call1 = await simpleToken.functions
  .get_balance(wallet.address.toB256())
  .call();

const { value: initialBalance } = await call1.waitForResult();

const call2 = await tokenDepositor.functions
  .deposit_to_simple_token(simpleToken.id.toB256(), amountToDeposit)
  .addContracts([simpleToken])
  .call();

await call2.waitForResult();

const call3 = await simpleToken.functions
  .get_balance(wallet.address.toB256())
  .call();

const { value: finalBalance } = await call3.waitForResult();\n```

Pay attention to the method `addContracts` called by the `TokenDepositor` contract. This method accepts an array of instances of deployed contracts. Without calling this method, the inter-contract call will not work.
