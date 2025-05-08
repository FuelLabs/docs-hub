# Native Parameter Types

Below you can find examples of how to convert between common native Sway program input and output types:

- [`Address`](#address)
- [`ContractId`](#contractid)
- [`Identity`](#identity)
- [`AssetId`](#assetid)

## `Address`

### `AddressInput`

To pass an `Address` as an input parameter to a Sway program, you can define the input as shown below:

```typescript\nconst address = Address.fromRandom();
const addressInput = { bits: address.toB256() };\n```
### `AddressOutput`

For a Sway program that returns an `Address` type, you can convert the returned value to an `Address` type in `fuels` as shown below:

```typescript\nconst addressOutput = response1.value;
const addressFromOutput: Address = new Address(addressOutput.bits);\n```
## `ContractId`

### `ContractIdInput`

To pass a `ContractId` as an input parameter to a Sway program, you can define the input as shown below:

```typescript\nconst contractId =
  '0x7296ff960b5eb86b5f79aa587d7ebe1bae147c7cac046a16d062fbd7f3a753ec';
const contractIdInput = { bits: contractId };\n```
### `ContractIdOutput`

For a Sway program that returns a `ContractId` type, you can convert the returned value to a `string` as shown below:

```typescript\nconst contractIdOutput = response.value;
const contractIdFromOutput: string = contractIdOutput.bits;\n```
## `Identity`

### `IdentityInput`

To pass an `Identity` as an input parameter to a Sway program, you can define the input as shown below:

For an address:

```typescript\nconst address = Address.fromRandom();
const addressInput = { bits: address.toB256() };
const addressIdentityInput = { Address: addressInput };\n```
For a contract:

```typescript\nconst contractId =
  '0x7296ff960b5eb86b5f79aa587d7ebe1bae147c7cac046a16d062fbd7f3a753ec';
const contractIdInput = { bits: contractId.toString() };
const contractIdentityInput = { ContractId: contractIdInput };\n```
### `IdentityOutput`

For a Sway program that returns an `Identity` type, you can convert the returned value to an `Address` or `string` as shown below:

For an address:

```typescript\nconst response = await contract.functions.identity(addressIdentityInput).get();

const identityFromOutput: IdentityOutput = response.value;
const addressStringFromOutput: AddressOutput =
  identityFromOutput.Address as AddressOutput;
const addressFromOutput = new Address(addressStringFromOutput.bits);\n```
For a contract:

```typescript\nconst response = await contract.functions.identity(contractIdentityInput).get();

const identityFromOutput2: IdentityOutput = response.value;
const contractIdOutput = identityFromOutput2.ContractId as ContractIdOutput;
const contractIdFromOutput = contractIdOutput.bits;\n```
## `AssetId`

### `AssetIdInput`

To pass an `AssetId` as an input parameter to a Sway program, you can define the input as shown below:

```typescript\nconst assetId =
  '0x0cfabde7bbe58d253cf3103d8f55d26987b3dc4691205b9299ac6826c613a2e2';
const assetIdInput = { bits: assetId };\n```
### `AssetIdOutput`

For a Sway program that returns an `AssetId` type, you can convert the returned value to a `string` as shown below:

```typescript\nconst assetIdOutput = response5.value;
const assetIdFromOutput: string = assetIdOutput.bits;\n```