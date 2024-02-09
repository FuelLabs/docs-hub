# Interface: AssembleTransactionSummaryParams

[@fuel-ts/providers](/api/Providers/index.md).AssembleTransactionSummaryParams

## Properties

### abiMap

• `Optional` **abiMap**: [`AbiMap`](/api/Providers/index.md#abimap)

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:32](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L32)

___

### gasPerByte

• **gasPerByte**: `BN`

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:26](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L26)

___

### gasPriceFactor

• **gasPriceFactor**: `BN`

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:27](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L27)

___

### gqlTransactionStatus

• `Optional` **gqlTransactionStatus**: ``null`` \| { `__typename`: ``"FailureStatus"`` ; `block`: { `__typename`: ``"Block"`` ; `id`: `string`  } ; `reason`: `string` ; `time`: `any` ; `type`: ``"FailureStatus"``  } \| { `__typename`: ``"SqueezedOutStatus"`` ; `type`: ``"SqueezedOutStatus"``  } \| { `__typename`: ``"SubmittedStatus"`` ; `time`: `any` ; `type`: ``"SubmittedStatus"``  } \| { `__typename`: ``"SuccessStatus"`` ; `block`: { `__typename`: ``"Block"`` ; `id`: `string`  } ; `programState?`: ``null`` \| { `__typename`: ``"ProgramState"`` ; `data`: `string` ; `returnType`: `GqlReturnType`  } ; `time`: `any` ; `type`: ``"SuccessStatus"``  }

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:30](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L30)

___

### id

• `Optional` **id**: `string`

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:25](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L25)

___

### maxInputs

• **maxInputs**: `BN`

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:33](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L33)

___

### receipts

• **receipts**: `TransactionResultReceipt`[]

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:31](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L31)

___

### transaction

• **transaction**: `Partial`&lt;`Omit`&lt;`TransactionScript`, ``"type"``\>\> & `Partial`&lt;`Omit`&lt;`TransactionCreate`, ``"type"``\>\> & `Partial`&lt;`Omit`&lt;`TransactionMint`, ``"type"``\>\> & { `type`: [`TransactionType`](/api/Providers/TransactionType.md)  }

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:28](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L28)

___

### transactionBytes

• **transactionBytes**: `Uint8Array`

#### Defined in

[packages/providers/src/transaction-summary/assemble-transaction-summary.ts:29](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packages/providers/src/transaction-summary/assemble-transaction-summary.ts#L29)
