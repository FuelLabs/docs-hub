<script setup>
  import { data } from '../../versions.data'
  const { forc } = data
  const url = `
    https://docs.fuel.network/docs/sway/introduction/
  `
</script>

# Instantiating a script

Similar to contracts and predicates, once you've written a script in Sway and compiled it with `forc build` (read <a :href="url" target="_blank" rel="noreferrer">here</a> for more on how to work with Sway), you'll get the script binary. Using the binary, you can instantiate a `script` as shown in the code snippet below:

```ts\nimport type { BigNumberish } from 'fuels';
import { arrayify, Provider, ReceiptType, ScriptRequest, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { CallTestScript } from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const script = new CallTestScript(wallet);

type MyStruct = {
  arg_one: boolean;
  arg_two: BigNumberish;
};

const scriptRequest = new ScriptRequest(
  CallTestScript.bytecode,
  (myStruct: MyStruct) => {
    const encoded = script.interface.functions.main.encodeArguments([myStruct]);

    return arrayify(encoded);
  },
  (scriptResult) => {
    if (scriptResult.returnReceipt.type === ReceiptType.Revert) {
      throw new Error('Reverted');
    }
    if (scriptResult.returnReceipt.type !== ReceiptType.ReturnData) {
      throw new Error('fail');
    }

    const [decodedResult] = script.interface.functions.main.decodeOutput(
      scriptResult.returnReceipt.data
    );
    return decodedResult;
  }
);\n```

In the [next section](./running-scripts.md), we show how to run a script.
