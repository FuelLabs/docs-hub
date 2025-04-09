# Running a script

Suppose your Sway script `main` function is written using the arguments passed to the `main` function like so:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/script-main-args/src/main.sw' -->

You can still hand code out a solution wrapper using `callScript` utility to call your script with data. However, if you prefer to use the ABI generated from your script, you can use the `ScriptFactory` helper:

```ts\nimport { bn, Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { ScriptMainArgs } from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const foo = 3;

const scriptInstance = new ScriptMainArgs(wallet);

const { waitForResult } = await scriptInstance.functions.main(foo).call();

const { value, logs } = await waitForResult();\n```
