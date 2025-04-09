# Custom Transactions

There may be scenarios where you need to build out transactions that involve multiple program types and assets; this can be done by instantiating a [`ScriptTransactionRequest`](DOCS_API_URL/classes/_fuel_ts_account.ScriptTransactionRequest.html). This class allows you to a append multiple program types and assets to a single transaction.

Consider the following script that transfers multiple assets to a contract:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/script-transfer-to-contract/src/main.sw' -->

This script can be executed by creating a [`ScriptTransactionRequest`](DOCS_API_URL/classes/_fuel_ts_account.ScriptTransactionRequest.html), appending the resource and contract inputs/outputs and then sending the transaction, as follows:

<!-- SNIPPET FILE ERROR: File not found '../../docs/src/guide/scripts/snippets/script-custom-transaction.ts' -->

## Full Example

For a full example, see below:

<!-- SNIPPET FILE ERROR: File not found '../../docs/src/guide/scripts/snippets/script-custom-transaction.ts' -->
