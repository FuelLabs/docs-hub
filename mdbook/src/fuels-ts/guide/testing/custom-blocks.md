# Custom Blocks

You can force-produce blocks using the `produceBlocks` helper to achieve an arbitrary block height. This is especially useful when you want to do some testing regarding transaction maturity.

```ts\nimport { DateTime } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';

using launched = await launchTestNode();
const { provider } = launched;
const block = await provider.getBlock('latest');
if (!block) {
  throw new Error('No latest block');
}
const { time: timeLastBlockProduced } = block;

const producedBlockHeight = await provider.produceBlocks(3);

const producedBlock = await provider.getBlock(producedBlockHeight.toNumber());

const oldest = DateTime.fromTai64(timeLastBlockProduced);
const newest = DateTime.fromTai64(producedBlock!.time);
// newest >= oldest\n```

# Blocks With Custom Timestamps

You can also produce blocks with a custom block time using the `produceBlocks` helper by specifying the second optional parameter.

```ts\nusing launchedWithCustomTimestamp = await launchTestNode();
const { provider: providerWithCustomTimestamp } = launchedWithCustomTimestamp;

const latestBlock = await providerWithCustomTimestamp.getBlock('latest');
if (!latestBlock) {
  throw new Error('No latest block');
}
const latestBlockTimestamp = DateTime.fromTai64(
  latestBlock.time
).toUnixMilliseconds();
const newBlockHeight = await providerWithCustomTimestamp.produceBlocks(
  3,
  latestBlockTimestamp + 1000
);\n```

# Full Example

For a full example, see the following file:
```ts\n// #region produce-blocks
import { DateTime } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';

using launched = await launchTestNode();
const { provider } = launched;
const block = await provider.getBlock('latest');
if (!block) {
  throw new Error('No latest block');
}
const { time: timeLastBlockProduced } = block;

const producedBlockHeight = await provider.produceBlocks(3);

const producedBlock = await provider.getBlock(producedBlockHeight.toNumber());

const oldest = DateTime.fromTai64(timeLastBlockProduced);
const newest = DateTime.fromTai64(producedBlock!.time);
// newest >= oldest
// #endregion produce-blocks

// #region produceBlocks-custom-timestamp
using launchedWithCustomTimestamp = await launchTestNode();
const { provider: providerWithCustomTimestamp } = launchedWithCustomTimestamp;

const latestBlock = await providerWithCustomTimestamp.getBlock('latest');
if (!latestBlock) {
  throw new Error('No latest block');
}
const latestBlockTimestamp = DateTime.fromTai64(
  latestBlock.time
).toUnixMilliseconds();
const newBlockHeight = await providerWithCustomTimestamp.produceBlocks(
  3,
  latestBlockTimestamp + 1000
);

// #endregion produceBlocks-custom-timestamp\n```
