# Script With Configurable

In the same way as [contracts](../contracts/configurable-constants.md) and [predicates](../predicates/configurable-constants.md), Scripts also support configurable constants. This feature enables dynamic adjustment of certain values within your scripts.

Configurable constants are fairly straightforward to add and set in your scripts.

Let's consider the following script:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/script-sum/src/main.sw' -->

In this script, `AMOUNT` is a configurable constant with a default value of `10`. The main function returns the sum of the `inputted_amount` and the configurable constant `AMOUNT`.

To change the value of the `AMOUNT` constant, we can use the `setConfigurableConstants` method as shown in the following example:

```ts\nconst provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const script = new Script(ScriptSum.bytecode, ScriptSum.abi, wallet);

const configurableConstants = {
  AMOUNT: 81,
};

script.setConfigurableConstants(configurableConstants);

const inputtedValue = 10;

const { waitForResult } = await script.functions.main(inputtedValue).call();
const { value } = await waitForResult();

const expectedTotal = inputtedValue + configurableConstants.AMOUNT;\n```

In this example, we're setting a new value `81` for the `AMOUNT` constant. We then call the main function with an inputted value of `10`.

The expectation is that the script will return the sum of the inputted value and the new value of `AMOUNT`.

This way, configurable constants in scripts allow for more flexibility and dynamic behavior during execution.

## Full Example

For a full example, see below:

```ts\nimport { Script, BN, Wallet, Provider } from 'fuels';

import { WALLET_PVT_KEY, LOCAL_NETWORK_URL } from '../../../env';
import { ScriptSum } from '../../../typegend/scripts/ScriptSum';

// #region script-with-configurable-contants-2
const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const script = new Script(ScriptSum.bytecode, ScriptSum.abi, wallet);

const configurableConstants = {
  AMOUNT: 81,
};

script.setConfigurableConstants(configurableConstants);

const inputtedValue = 10;

const { waitForResult } = await script.functions.main(inputtedValue).call();
const { value } = await waitForResult();

const expectedTotal = inputtedValue + configurableConstants.AMOUNT;

// #endregion script-with-configurable-contants-2

const argument = 10;
const expected = 20;

// #region preparing-scripts
const myMainScript = new Script(ScriptSum.bytecode, ScriptSum.abi, wallet);

const tx = myMainScript.functions.main(argument);

// Set the call parameters
tx.callParams({ gasLimit: 7500 });

// Get the entire transaction request prior to
const txRequest = await tx.getTransactionRequest();

// Get the transaction ID
const txId = await tx.getTransactionId();

// Retrieve the value of the call and the actual gas used
const { waitForResult: waitForActualGasUsed } = await tx.call();
const { value: valueOfActualGasUsed, gasUsed: gasUsedOfActualGasUsed } =
  await waitForActualGasUsed();
// #endregion preparing-scripts\n```
