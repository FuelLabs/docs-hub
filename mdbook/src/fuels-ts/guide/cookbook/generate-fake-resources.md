# Generate Fake Resources

When working with an unfunded account, you can generate fake resources to perform a dry-run on your transactions. This is useful for testing purposes without the need for real funds.

Below is an example script that returns the value `1337`. You can use fake resources to execute a dry-run of this script and obtain the returned value.

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/return-script/src/main.sw' -->

To execute a dry-run, use the `Provider.dryRun` method. Ensure you set the `utxo_validation` flag to true, as this script uses fake UTXOs:

```ts\nimport type { TransactionResultReturnDataReceipt } from 'fuels';
import {
  bn,
  Provider,
  ReceiptType,
  ScriptTransactionRequest,
  Wallet,
} from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { ReturnScript } from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const baseAssetId = await provider.getBaseAssetId();

const transactionRequest = new ScriptTransactionRequest({
  gasLimit: bn(62_000),
  maxFee: bn(60_000),
  script: ReturnScript.bytecode,
});

const resources = wallet.generateFakeResources([
  {
    amount: bn(100_000),
    assetId: baseAssetId,
  },
]);

transactionRequest.addResources(resources);

const dryrunResult = await provider.dryRun(transactionRequest);

const returnReceipt = dryrunResult.receipts.find(
  (receipt) => receipt.type === ReceiptType.ReturnData
) as TransactionResultReturnDataReceipt;

const { data: returnedValue } = returnReceipt;\n```

By setting `utxo_validation` to `true`, you can successfully execute the dry-run and retrieve the returned value from the script without requiring actual funds.
