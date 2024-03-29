# Class: AbstractAccount

[@fuel-ts/interfaces](/api/Interfaces/index.md).AbstractAccount

## Hierarchy

- **`AbstractAccount`**

## Constructors

### constructor

• **new AbstractAccount**(): [`AbstractAccount`](/api/Interfaces/AbstractAccount.md)

#### Returns

[`AbstractAccount`](/api/Interfaces/AbstractAccount.md)

## Properties

### address

• `Abstract` **address**: [`AbstractAddress`](/api/Interfaces/AbstractAddress.md)

#### Defined in

[index.ts:51](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packag/api/src/index.ts#L51)

___

### provider

• `Abstract` **provider**: `unknown`

#### Defined in

[index.ts:52](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packag/api/src/index.ts#L52)

## Methods

### fund

▸ **fund**(`transactionRequest`, `quantities`, `fee`): `Promise`&lt;`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `any` |
| `quantities` | `any` |
| `fee` | `any` |

#### Returns

`Promise`&lt;`void`\>

#### Defined in

[index.ts:56](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packag/api/src/index.ts#L56)

___

### getResourcesToSpend

▸ **getResourcesToSpend**(`quantities`, `options?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `quantities` | `any`[] |
| `options?` | `any` |

#### Returns

`any`

#### Defined in

[index.ts:53](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packag/api/src/index.ts#L53)

___

### sendTransaction

▸ **sendTransaction**(`transactionRequest`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `any` |

#### Returns

`any`

#### Defined in

[index.ts:54](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packag/api/src/index.ts#L54)

___

### simulateTransaction

▸ **simulateTransaction**(`transactionRequest`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `any` |

#### Returns

`any`

#### Defined in

[index.ts:55](https://github.com/FuelLabs/fuels-ts/blob/c431eaba/packag/api/src/index.ts#L55)
