# Class: Provider

[@fuel-ts/providers](/api/Providers/index.md).Provider

A provider for connecting to a node

## Properties

### cache

• `Optional` **cache**: `MemoryCache`

#### Defined in

[packages/providers/src/provider.ts:232](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L232)

___

### operations

• **operations**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dryRun` | (`variables`: `Exact`&lt;{ `encodedTransaction`: `string` ; `utxoValidation?`: `InputMaybe`&lt;`boolean`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlDryRunMutation`\> |
| `estimatePredicates` | (`variables`: `Exact`&lt;{ `encodedTransaction`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlEstimatePredicatesQuery`\> |
| `getBalance` | (`variables`: `Exact`&lt;{ `assetId`: `string` ; `owner`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBalanceQuery`\> |
| `getBalances` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `filter`: `GqlBalanceFilterInput` ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBalancesQuery`\> |
| `getBlock` | (`variables?`: `Exact`&lt;{ `blockHeight?`: `InputMaybe`&lt;`string`\> ; `blockId?`: `InputMaybe`&lt;`string`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBlockQuery`\> |
| `getBlockWithTransactions` | (`variables?`: `Exact`&lt;{ `blockHeight?`: `InputMaybe`&lt;`string`\> ; `blockId?`: `InputMaybe`&lt;`string`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBlockWithTransactionsQuery`\> |
| `getBlocks` | (`variables?`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBlocksQuery`\> |
| `getChain` | (`variables?`: `Exact`&lt;{ `[key: string]`: `never`;  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetChainQuery`\> |
| `getCoin` | (`variables`: `Exact`&lt;{ `coinId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetCoinQuery`\> |
| `getCoins` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `filter`: `GqlCoinFilterInput` ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetCoinsQuery`\> |
| `getCoinsToSpend` | (`variables`: `Exact`&lt;{ `excludedIds?`: `InputMaybe`&lt;`GqlExcludeInput`\> ; `owner`: `string` ; `queryPerAsset`: `GqlSpendQueryElementInput` \| `GqlSpendQueryElementInput`[]  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetCoinsToSpendQuery`\> |
| `getContract` | (`variables`: `Exact`&lt;{ `contractId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetContractQuery`\> |
| `getContractBalance` | (`variables`: `Exact`&lt;{ `asset`: `string` ; `contract`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetContractBalanceQuery`\> |
| `getMessageProof` | (`variables`: `Exact`&lt;{ `commitBlockHeight?`: `any` ; `commitBlockId?`: `InputMaybe`&lt;`string`\> ; `messageId`: `any` ; `transactionId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetMessageProofQuery`\> |
| `getMessageStatus` | (`variables`: `Exact`&lt;{ `nonce`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetMessageStatusQuery`\> |
| `getMessages` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\> ; `owner`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetMessagesQuery`\> |
| `getNodeInfo` | (`variables?`: `Exact`&lt;{ `[key: string]`: `never`;  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetNodeInfoQuery`\> |
| `getTransaction` | (`variables`: `Exact`&lt;{ `transactionId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionQuery`\> |
| `getTransactionWithReceipts` | (`variables`: `Exact`&lt;{ `transactionId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionWithReceiptsQuery`\> |
| `getTransactions` | (`variables?`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionsQuery`\> |
| `getTransactionsByOwner` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\> ; `owner`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionsByOwnerQuery`\> |
| `getVersion` | (`variables?`: `Exact`&lt;{ `[key: string]`: `never`;  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetVersionQuery`\> |
| `produceBlocks` | (`variables`: `Exact`&lt;{ `blocksToProduce`: `string` ; `startTimestamp?`: `any`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlProduceBlocksMutation`\> |
| `submit` | (`variables`: `Exact`&lt;{ `encodedTransaction`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlSubmitMutation`\> |

#### Defined in

[packages/providers/src/provider.ts:231](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L231)

___

### options

• **options**: [`ProviderOptions`](/api/Providers/index.md#provideroptions) = `{}`

Additional options for the provider

#### Defined in

[packages/providers/src/provider.ts:253](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L253)

___

### url

• **url**: `string`

GraphQL endpoint of the Fuel node

#### Defined in

[packages/providers/src/provider.ts:252](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L252)

___

### chainInfoCache

▪ `Private` `Static` **chainInfoCache**: `ChainInfoCache` = `{}`

#### Defined in

[packages/providers/src/provider.ts:239](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L239)

___

### nodeInfoCache

▪ `Private` `Static` **nodeInfoCache**: `NodeInfoCache` = `{}`

#### Defined in

[packages/providers/src/provider.ts:240](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L240)

## Methods

### call

▸ **call**(`transactionRequestLike`, `utxoValidation?`): `Promise`&lt;[`CallResult`](/api/Providers/index.md#callresult)\>

Executes a transaction without actually submitting it to the chain.

If the transaction is missing any dependencies,
the transaction will be mutated and those dependencies will be added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionRequestLike` | [`TransactionRequestLike`](/api/Providers/index.md#transactionrequestlike) | The transaction request object. |
| `utxoValidation` | [`ProviderCallParams`](/api/Providers/index.md#providercallparams) | Additional provider call parameters. |

#### Returns

`Promise`&lt;[`CallResult`](/api/Providers/index.md#callresult)\>

A promise that resolves to the call result object.

#### Defined in

[packages/providers/src/provider.ts:519](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L519)

___

### connect

▸ **connect**(`url`, `options?`): `Promise`&lt;`void`\>

Updates the URL for the provider and fetches the consensus parameters for the new URL, if needed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options?` | [`ProviderOptions`](/api/Providers/index.md#provideroptions) |

#### Returns

`Promise`&lt;`void`\>

#### Defined in

[packages/providers/src/provider.ts:317](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L317)

___

### createOperations

▸ **createOperations**(`url`, `options?`): `Object`

Create GraphQL client and set operations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL of the Fuel node |
| `options` | [`ProviderOptions`](/api/Providers/index.md#provideroptions) | Additional options for the provider |

#### Returns

`Object`

The operation SDK object

| Name | Type |
| :------ | :------ |
| `dryRun` | (`variables`: `Exact`&lt;{ `encodedTransaction`: `string` ; `utxoValidation?`: `InputMaybe`&lt;`boolean`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlDryRunMutation`\> |
| `estimatePredicates` | (`variables`: `Exact`&lt;{ `encodedTransaction`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlEstimatePredicatesQuery`\> |
| `getBalance` | (`variables`: `Exact`&lt;{ `assetId`: `string` ; `owner`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBalanceQuery`\> |
| `getBalances` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `filter`: `GqlBalanceFilterInput` ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBalancesQuery`\> |
| `getBlock` | (`variables?`: `Exact`&lt;{ `blockHeight?`: `InputMaybe`&lt;`string`\> ; `blockId?`: `InputMaybe`&lt;`string`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBlockQuery`\> |
| `getBlockWithTransactions` | (`variables?`: `Exact`&lt;{ `blockHeight?`: `InputMaybe`&lt;`string`\> ; `blockId?`: `InputMaybe`&lt;`string`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBlockWithTransactionsQuery`\> |
| `getBlocks` | (`variables?`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetBlocksQuery`\> |
| `getChain` | (`variables?`: `Exact`&lt;{ `[key: string]`: `never`;  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetChainQuery`\> |
| `getCoin` | (`variables`: `Exact`&lt;{ `coinId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetCoinQuery`\> |
| `getCoins` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `filter`: `GqlCoinFilterInput` ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetCoinsQuery`\> |
| `getCoinsToSpend` | (`variables`: `Exact`&lt;{ `excludedIds?`: `InputMaybe`&lt;`GqlExcludeInput`\> ; `owner`: `string` ; `queryPerAsset`: `GqlSpendQueryElementInput` \| `GqlSpendQueryElementInput`[]  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetCoinsToSpendQuery`\> |
| `getContract` | (`variables`: `Exact`&lt;{ `contractId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetContractQuery`\> |
| `getContractBalance` | (`variables`: `Exact`&lt;{ `asset`: `string` ; `contract`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetContractBalanceQuery`\> |
| `getMessageProof` | (`variables`: `Exact`&lt;{ `commitBlockHeight?`: `any` ; `commitBlockId?`: `InputMaybe`&lt;`string`\> ; `messageId`: `any` ; `transactionId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetMessageProofQuery`\> |
| `getMessageStatus` | (`variables`: `Exact`&lt;{ `nonce`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetMessageStatusQuery`\> |
| `getMessages` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\> ; `owner`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetMessagesQuery`\> |
| `getNodeInfo` | (`variables?`: `Exact`&lt;{ `[key: string]`: `never`;  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetNodeInfoQuery`\> |
| `getTransaction` | (`variables`: `Exact`&lt;{ `transactionId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionQuery`\> |
| `getTransactionWithReceipts` | (`variables`: `Exact`&lt;{ `transactionId`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionWithReceiptsQuery`\> |
| `getTransactions` | (`variables?`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionsQuery`\> |
| `getTransactionsByOwner` | (`variables`: `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\> ; `owner`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetTransactionsByOwnerQuery`\> |
| `getVersion` | (`variables?`: `Exact`&lt;{ `[key: string]`: `never`;  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlGetVersionQuery`\> |
| `produceBlocks` | (`variables`: `Exact`&lt;{ `blocksToProduce`: `string` ; `startTimestamp?`: `any`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlProduceBlocksMutation`\> |
| `submit` | (`variables`: `Exact`&lt;{ `encodedTransaction`: `string`  }\>, `requestHeaders?`: `HeadersInit`) => `Promise`&lt;`GqlSubmitMutation`\> |

#### Defined in

[packages/providers/src/provider.ts:359](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L359)

___

### estimatePredicates

▸ **estimatePredicates**(`transactionRequest`): `Promise`&lt;[`TransactionRequest`](/api/Providers/index.md#transactionrequest)\>

Verifies whether enough gas is available to complete transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionRequest` | [`TransactionRequest`](/api/Providers/index.md#transactionrequest) | The transaction request object. |

#### Returns

`Promise`&lt;[`TransactionRequest`](/api/Providers/index.md#transactionrequest)\>

A promise that resolves to the estimated transaction request object.

#### Defined in

[packages/providers/src/provider.ts:542](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L542)

___

### estimateTxDependencies

▸ **estimateTxDependencies**(`transactionRequest`): `Promise`&lt;`void`\>

Will dryRun a transaction and check for missing dependencies.

If there are missing variable outputs,
`addVariableOutputs` is called on the transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionRequest` | [`TransactionRequest`](/api/Providers/index.md#transactionrequest) | The transaction request object. |

#### Returns

`Promise`&lt;`void`\>

A promise.

#### Defined in

[packages/providers/src/provider.ts:579](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L579)

___

### fetchChain

▸ **fetchChain**(): `Promise`&lt;[`ChainInfo`](/api/Providers/index.md#chaininfo)\>

Fetches the `chainInfo` for the given node URL.

#### Returns

`Promise`&lt;[`ChainInfo`](/api/Providers/index.md#chaininfo)\>

ChainInfo object

#### Defined in

[packages/providers/src/provider.ts:430](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L430)

___

### fetchChainAndNodeInfo

▸ **fetchChainAndNodeInfo**(): `Promise`&lt;{ `chain`: [`ChainInfo`](/api/Providers/index.md#chaininfo) ; `nodeInfo`: [`NodeInfo`](/api/Providers/index.md#nodeinfo)  }\>

Fetches both the chain and node information, saves it to the cache, and return it.

#### Returns

`Promise`&lt;{ `chain`: [`ChainInfo`](/api/Providers/index.md#chaininfo) ; `nodeInfo`: [`NodeInfo`](/api/Providers/index.md#nodeinfo)  }\>

NodeInfo and Chain

#### Defined in

[packages/providers/src/provider.ts:328](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L328)

___

### fetchNode

▸ **fetchNode**(): `Promise`&lt;[`NodeInfo`](/api/Providers/index.md#nodeinfo)\>

Returns the chain information.

#### Returns

`Promise`&lt;[`NodeInfo`](/api/Providers/index.md#nodeinfo)\>

NodeInfo object

#### Defined in

[packages/providers/src/provider.ts:408](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L408)

___

### getBalance

▸ **getBalance**(`owner`, `assetId`): `Promise`&lt;`BN`\>

Returns the balance for the given owner for the given asset ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `owner` | [`AbstractAddress`](/api/Interfaces/AbstractAddress.md) | The address to get coins for. |
| `assetId` | `BytesLike` | The asset ID of coins to get. |

#### Returns

`Promise`&lt;`BN`\>

A promise that resolves to the balance.

#### Defined in

[packages/providers/src/provider.ts:978](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L978)

___

### getBalances

▸ **getBalances**(`owner`, `paginationArgs?`): `Promise`&lt;[`CoinQuantity`](/api/Providers/index.md#coinquantity)[]\>

Returns balances for the given owner.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `owner` | [`AbstractAddress`](/api/Interfaces/AbstractAddress.md) | The address to get coins for. |
| `paginationArgs?` | `CursorPaginationArgs` | Pagination arguments. |

#### Returns

`Promise`&lt;[`CoinQuantity`](/api/Providers/index.md#coinquantity)[]\>

A promise that resolves to the balances.

#### Defined in

[packages/providers/src/provider.ts:998](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L998)

___

### getBlock

▸ **getBlock**(`idOrHeight`): `Promise`&lt;``null`` \| [`Block`](/api/Providers/index.md#block)\>

Returns block matching the given ID or height.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idOrHeight` | `string` \| `number` | ID or height of the block. |

#### Returns

`Promise`&lt;``null`` \| [`Block`](/api/Providers/index.md#block)\>

A promise that resolves to the block.

#### Defined in

[packages/providers/src/provider.ts:834](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L834)

___

### getBlockNumber

▸ **getBlockNumber**(): `Promise`&lt;`BN`\>

Returns the block number.

#### Returns

`Promise`&lt;`BN`\>

A promise that resolves to the block number

#### Defined in

[packages/providers/src/provider.ts:398](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L398)

___

### getBlockWithTransactions

▸ **getBlockWithTransactions**(`idOrHeight`): `Promise`&lt;``null`` \| [`Block`](/api/Providers/index.md#block) & { `transactions`: `Partial`&lt;`Omit`&lt;`TransactionScript`, ``"type"``\>\> & `Partial`&lt;`Omit`&lt;`TransactionCreate`, ``"type"``\>\> & `Partial`&lt;`Omit`&lt;`TransactionMint`, ``"type"``\>\> & { `type`: [`TransactionType`](/api/Providers/TransactionType.md)  }[]  }\>

Returns block matching the given ID or type, including transaction data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idOrHeight` | `string` \| `number` | ID or height of the block. |

#### Returns

`Promise`&lt;``null`` \| [`Block`](/api/Providers/index.md#block) & { `transactions`: `Partial`&lt;`Omit`&lt;`TransactionScript`, ``"type"``\>\> & `Partial`&lt;`Omit`&lt;`TransactionCreate`, ``"type"``\>\> & `Partial`&lt;`Omit`&lt;`TransactionMint`, ``"type"``\>\> & { `type`: [`TransactionType`](/api/Providers/TransactionType.md)  }[]  }\>

A promise that resolves to the block.

#### Defined in

[packages/providers/src/provider.ts:888](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L888)

___

### getBlocks

▸ **getBlocks**(`params`): `Promise`&lt;[`Block`](/api/Providers/index.md#block)[]\>

Returns all the blocks matching the given parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Exact`&lt;{ `after?`: `InputMaybe`&lt;`string`\> ; `before?`: `InputMaybe`&lt;`string`\> ; `first?`: `InputMaybe`&lt;`number`\> ; `last?`: `InputMaybe`&lt;`number`\>  }\> | The parameters to query blocks. |

#### Returns

`Promise`&lt;[`Block`](/api/Providers/index.md#block)[]\>

A promise that resolves to the blocks.

#### Defined in

[packages/providers/src/provider.ts:869](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L869)

___

### getChain

▸ **getChain**(): [`ChainInfo`](/api/Providers/index.md#chaininfo)

Returns the cached chainInfo for the current URL.

#### Returns

[`ChainInfo`](/api/Providers/index.md#chaininfo)

#### Defined in

[packages/providers/src/provider.ts:273](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L273)

___

### getChainId

▸ **getChainId**(): `number`

Returns the chain ID

#### Returns

`number`

A promise that resolves to the chain ID number

#### Defined in

[packages/providers/src/provider.ts:444](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L444)

___

### getCoins

▸ **getCoins**(`owner`, `assetId?`, `paginationArgs?`): `Promise`&lt;[`Coin`](/api/Providers/index.md#coin)[]\>

Returns coins for the given owner.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `owner` | [`AbstractAddress`](/api/Interfaces/AbstractAddress.md) | The address to get coins for |
| `assetId?` | `BytesLike` | The asset ID of coins to get |
| `paginationArgs?` | `CursorPaginationArgs` | Pagination arguments |

#### Returns

`Promise`&lt;[`Coin`](/api/Providers/index.md#coin)[]\>

#### Defined in

[packages/providers/src/provider.ts:728](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L728)

___

### getContract

▸ **getContract**(`contractId`): `Promise`&lt;``null`` \| [`ContractResult`](/api/Providers/index.md#contractresult)\>

Get deployed contract with the given ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractId` | `string` | ID of the contract. |

#### Returns

`Promise`&lt;``null`` \| [`ContractResult`](/api/Providers/index.md#contractresult)\>

A promise that resolves to the contract.

#### Defined in

[packages/providers/src/provider.ts:943](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L943)

___

### getContractBalance

▸ **getContractBalance**(`contractId`, `assetId`): `Promise`&lt;`BN`\>

Returns the balance for the given contract for the given asset ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractId` | [`AbstractAddress`](/api/Interfaces/AbstractAddress.md) | The contract ID to get the balance for. |
| `assetId` | `BytesLike` | The asset ID of coins to get. |

#### Returns

`Promise`&lt;`BN`\>

A promise that resolves to the balance.

#### Defined in

[packages/providers/src/provider.ts:958](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L958)

___

### getGasConfig

▸ **getGasConfig**(): `Object`

Returns some helpful parameters related to gas fees.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `gasPerByte` | `BN` |
| `gasPriceFactor` | `BN` |
| `maxGasPerPredicate` | `BN` |
| `maxGasPerTx` | `BN` |
| `minGasPrice` | `BN` |

#### Defined in

[packages/providers/src/provider.ts:301](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L301)

___

### getMessageProof

▸ **getMessageProof**(`transactionId`, `messageId`, `commitBlockId?`, `commitBlockHeight?`): `Promise`&lt;``null`` \| [`MessageProof`](/api/Providers/index.md#messageproof)\>

Returns Message Proof for given transaction id and the message id from MessageOut receipt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The transaction to get message from. |
| `messageId` | `string` | The message id from MessageOut receipt. |
| `commitBlockId?` | `string` | The commit block id. |
| `commitBlockHeight?` | `BN` | The commit block height. |

#### Returns

`Promise`&lt;``null`` \| [`MessageProof`](/api/Providers/index.md#messageproof)\>

A promise that resolves to the message proof.

#### Defined in

[packages/providers/src/provider.ts:1065](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L1065)

___

### getMessageStatus

▸ **getMessageStatus**(`nonce`): `Promise`&lt;[`MessageStatus`](/api/Providers/index.md#messagestatus)\>

Returns Message Proof for given transaction id and the message id from MessageOut receipt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonce` | `string` | The nonce of the message to get status from. |

#### Returns

`Promise`&lt;[`MessageStatus`](/api/Providers/index.md#messagestatus)\>

A promise that resolves to the message status

#### Defined in

[packages/providers/src/provider.ts:1173](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L1173)

___

### getMessages

▸ **getMessages**(`address`, `paginationArgs?`): `Promise`&lt;[`Message`](/api/Providers/index.md#message)[]\>

Returns message for the given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AbstractAddress`](/api/Interfaces/AbstractAddress.md) | The address to get message from. |
| `paginationArgs?` | `CursorPaginationArgs` | Pagination arguments. |

#### Returns

`Promise`&lt;[`Message`](/api/Providers/index.md#message)[]\>

A promise that resolves to the messages.

#### Defined in

[packages/providers/src/provider.ts:1025](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L1025)

___

### getNode

▸ **getNode**(): [`NodeInfo`](/api/Providers/index.md#nodeinfo)

Returns the cached nodeInfo for the current URL.

#### Returns

[`NodeInfo`](/api/Providers/index.md#nodeinfo)

#### Defined in

[packages/providers/src/provider.ts:287](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L287)

___

### getResourcesToSpend

▸ **getResourcesToSpend**(`owner`, `quantities`, `excludedIds?`): `Promise`&lt;[`Resource`](/api/Providers/index.md#resource)[]\>

Returns resources for the given owner satisfying the spend query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `owner` | [`AbstractAddress`](/api/Interfaces/AbstractAddress.md) | The address to get resources for. |
| `quantities` | [`CoinQuantityLike`](/api/Providers/index.md#coinquantitylike)[] | The quantities to get. |
| `excludedIds?` | `ExcludeResourcesOption` | IDs of excluded resources from the selection. |

#### Returns

`Promise`&lt;[`Resource`](/api/Providers/index.md#resource)[]\>

A promise that resolves to the resources.

#### Defined in

[packages/providers/src/provider.ts:763](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L763)

___

### getTransaction

▸ **getTransaction**&lt;`TTransactionType`\>(`transactionId`): `Promise`&lt;``null`` \| `Transaction`&lt;`TTransactionType`\>\>

Get transaction with the given ID.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTransactionType` | `void` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | ID of the transaction. |

#### Returns

`Promise`&lt;``null`` \| `Transaction`&lt;`TTransactionType`\>\>

A promise that resolves to the transaction.

#### Defined in

[packages/providers/src/provider.ts:924](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L924)

___

### getTransactionCost

▸ **getTransactionCost**(`transactionRequestLike`, `forwardingQuantities?`): `Promise`&lt;[`TransactionCost`](/api/Providers/index.md#transactioncost)\>

Returns a transaction cost to enable user
to set gasLimit and also reserve balance amounts
on the the transaction.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `transactionRequestLike` | [`TransactionRequestLike`](/api/Providers/index.md#transactionrequestlike) | `undefined` | The transaction request object. |
| `forwardingQuantities` | [`CoinQuantity`](/api/Providers/index.md#coinquantity)[] | `[]` | - |

#### Returns

`Promise`&lt;[`TransactionCost`](/api/Providers/index.md#transactioncost)\>

A promise that resolves to the transaction cost object.

#### Defined in

[packages/providers/src/provider.ts:659](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L659)

___

### getVersion

▸ **getVersion**(): `Promise`&lt;`string`\>

Returns the version of the connected node.

#### Returns

`Promise`&lt;`string`\>

A promise that resolves to the version string.

#### Defined in

[packages/providers/src/provider.ts:370](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L370)

___

### produceBlocks

▸ **produceBlocks**(`amount`, `startTime?`): `Promise`&lt;`BN`\>

Lets you produce blocks with custom timestamps and the block number of the last block produced.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | The amount of blocks to produce |
| `startTime?` | `number` | The UNIX timestamp to set for the first produced block |

#### Returns

`Promise`&lt;`BN`\>

A promise that resolves to the block number of the last produced block.

#### Defined in

[packages/providers/src/provider.ts:1188](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L1188)

___

### sendTransaction

▸ **sendTransaction**(`transactionRequestLike`): `Promise`&lt;[`TransactionResponse`](/api/Providers/TransactionResponse.md)\>

Submits a transaction to the chain to be executed.

If the transaction is missing any dependencies,
the transaction will be mutated and those dependencies will be added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionRequestLike` | [`TransactionRequestLike`](/api/Providers/index.md#transactionrequestlike) | The transaction request object. |

#### Returns

`Promise`&lt;[`TransactionResponse`](/api/Providers/TransactionResponse.md)\>

A promise that resolves to the transaction response object.

#### Defined in

[packages/providers/src/provider.ts:476](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L476)

___

### simulate

▸ **simulate**(`transactionRequestLike`): `Promise`&lt;[`CallResult`](/api/Providers/index.md#callresult)\>

Executes a signed transaction without applying the states changes
on the chain.

If the transaction is missing any dependencies,
the transaction will be mutated and those dependencies will be added

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionRequestLike` | [`TransactionRequestLike`](/api/Providers/index.md#transactionrequestlike) | The transaction request object. |

#### Returns

`Promise`&lt;[`CallResult`](/api/Providers/index.md#callresult)\>

A promise that resolves to the call result object.

#### Defined in

[packages/providers/src/provider.ts:630](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L630)

___

### clearChainAndNodeCaches

▸ **clearChainAndNodeCaches**(): `void`

#### Returns

`void`

#### Defined in

[packages/providers/src/provider.ts:234](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L234)

___

### create

▸ **create**(`url`, `options?`): `Promise`&lt;[`Provider`](/api/Providers/Provider.md)\>

Creates a new instance of the Provider class. This is the recommended way to initialize a Provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | GraphQL endpoint of the Fuel node |
| `options` | [`ProviderOptions`](/api/Providers/index.md#provideroptions) | Additional options for the provider |

#### Returns

`Promise`&lt;[`Provider`](/api/Providers/Provider.md)\>

#### Defined in

[packages/providers/src/provider.ts:264](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L264)

___

### ensureClientVersionIsSupported

▸ **ensureClientVersionIsSupported**(`nodeInfo`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeInfo` | [`NodeInfo`](/api/Providers/index.md#nodeinfo) |

#### Returns

`void`

#### Defined in

[packages/providers/src/provider.ts:340](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/provider.ts#L340)
