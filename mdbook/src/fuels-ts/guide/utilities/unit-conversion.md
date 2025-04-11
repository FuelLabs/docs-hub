# Unit conversion

Internally, we use [Arbitrary-precision](https://mathworld.wolfram.com/ArbitraryPrecision.html) arithmetic (also known as Big Number arithmetic) to allow for the handling of large numbers and different assets.

On the Fuel network, we work with 9 decimals to represent amounts under a unit. This differs from chain to chain, so it is important to know the number of decimals used on the chain you are working with.

> Note: The package [`@fuels/assets`](https://www.npmjs.com/package/@fuels/assets) provides a list of assets and their decimals.

Below we will go over some common use cases for unit conversion.

Using our `BN` class we can instantiate these numbers.

```ts\nconst myBigNumberOne = '100000000';

const resultOne = new BN('100000000').toString();\n```

Or using our `bn` utility function.

```ts\nconst resultTwo = bn('100000000').toString();\n```

## Contract calls

Generally, we will need to convert `u64` and `u256` numbers to a `BN` object when passing them to a Sway program from JavaScript. More information on this can be found [here](../types/numbers.md).

```ts\n// Let's deploy a contract that has a function that takes a u64 as input
const provider = new Provider(LOCAL_NETWORK_URL);

const wallet = await Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployedContract = await new EchoValuesFactory(wallet).deploy();
const { contract } = await deployedContract.waitForResult();

const MAX_U64 = bn('18446744073709551615');

const { waitForResult } = await contract.functions.echo_u64(MAX_U64).call();
const { value } = await waitForResult();\n```

> Note: If a contract call returns a number that is too large to be represented as a JavaScript number, you can convert it to a string using the `toString` method instead of `toNumber`.

## Parsing

Parsing string-represented numbers (from user input) has never been easier, than using the `parseUnits` function.

```ts\nconst resultThree = bn.parseUnits('0.000000001').toString();\n```

We can parse large numbers.

```ts\nconst myBigNumberFour = '100100000000000';
const resultFour = bn.parseUnits('100100').toString();\n```

Or numbers formatted for human readability.

```ts\nconst myBigNumberFive = '100100000200001';

const resultFive = bn.parseUnits('100,100.000200001').toString();\n```

We can also parse numbers in other units of measure.

```ts\nconst myBigNumberSix = '1000000000';

const resultSix = bn.parseUnits('1', DECIMAL_GWEI).toString();\n```

## Formatting

We can format common units of measure using the `format` function.

In the following example, we format a BigNumber representation of one Gwei, into units for the Fuel network (with 3 decimal place precision).

```ts\nconst myBigNumberSeven = '1.000';
const oneGwei = bn('1000000000');

const resultSeven = oneGwei.format();\n```

We can also format numbers in other units of measure by specifying the `units` variable.

```ts\nconst myBigNumberEight = '2.000';

const twoGwei = bn('2000000000');

const resultEight = twoGwei.format({ units: DECIMAL_GWEI });\n```

A `precision` variable will allow for the formatting of numbers with a specific number of decimal places.

```ts\nconst oneDecimalGwei = '1.0';

const formattedGwei = oneGwei.format({ precision: 1 });\n```

### Format units

The `formatUnits` function is a lesser alternative to the `format` function, as it will maintain the same precision as the input value.

```ts\nconst myFormattedGwei = '1.000000000';

const formattedUnitsGwei = oneGwei.formatUnits();\n```

We can also format numbers in other units of measure by specifying the `units` variable.

```ts\nconst myFormattedKwei = '1.000000000000000';

const oneKwei = bn('1000000000000000');

const formattedUnitsKwei = oneKwei.formatUnits(DECIMAL_KWEI);\n```

## See also

- [Sway Numbers](../types/numbers.md)

## Full Example

For the full example of unit conversion see the snippet below:

```ts\nimport { BN, DECIMAL_GWEI, DECIMAL_KWEI, bn, Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { EchoValuesFactory } from '../../../typegend/contracts/EchoValuesFactory';

// #region instantiation-1
const myBigNumberOne = '100000000';

const resultOne = new BN('100000000').toString();

// #endregion instantiation-1

const myBigNumberTwo = '100000000';

// #region instantiation-2

const resultTwo = bn('100000000').toString();
// #endregion instantiation-2

// #region contract-calls-1

// Let's deploy a contract that has a function that takes a u64 as input
const provider = new Provider(LOCAL_NETWORK_URL);

const wallet = await Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployedContract = await new EchoValuesFactory(wallet).deploy();
const { contract } = await deployedContract.waitForResult();

const MAX_U64 = bn('18446744073709551615');

const { waitForResult } = await contract.functions.echo_u64(MAX_U64).call();
const { value } = await waitForResult();

// #endregion contract-calls-1

const myBigNumberThree = '1';

// #region parse-units-1
const resultThree = bn.parseUnits('0.000000001').toString();
// #endregion parse-units-1

// #endregion parse-units-1

// #region parse-units-2
const myBigNumberFour = '100100000000000';
const resultFour = bn.parseUnits('100100').toString();
// #endregion parse-units-2

// #endregion parse-units-3

// #region parse-units-3
const myBigNumberFive = '100100000200001';

const resultFive = bn.parseUnits('100,100.000200001').toString();
// #endregion parse-units-3

// #endregion parse-units-4

// #region parse-units-4
const myBigNumberSix = '1000000000';

const resultSix = bn.parseUnits('1', DECIMAL_GWEI).toString();
// #endregion parse-units-4

// #region format-1
const myBigNumberSeven = '1.000';
const oneGwei = bn('1000000000');

const resultSeven = oneGwei.format();
// #endregion format-1

// #region format-2
const myBigNumberEight = '2.000';

const twoGwei = bn('2000000000');

const resultEight = twoGwei.format({ units: DECIMAL_GWEI });
// #endregion format-2

// #region format-3
const oneDecimalGwei = '1.0';

const formattedGwei = oneGwei.format({ precision: 1 });
// #endregion format-3

// #region format-units-1
const myFormattedGwei = '1.000000000';

const formattedUnitsGwei = oneGwei.formatUnits();
// #endregion format-units-1

// #region format-units-2
const myFormattedKwei = '1.000000000000000';

const oneKwei = bn('1000000000000000');

const formattedUnitsKwei = oneKwei.formatUnits(DECIMAL_KWEI);
// #endregion format-units-2\n```
