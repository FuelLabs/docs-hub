# Connectors

Fuel Wallet Connectors offer a standardized interface to integrate multiple wallets with your DApps, simplifying wallet integration and ensuring smooth user interactions.

## Fuel Connectors

`Fuel Connectors` are a set of standardized interfaces that provide a way to interact with various wallets and services. They offer a consistent way to interact with different wallets and services, allowing developers to focus on building their applications rather than worrying about wallet integration.

To build your own wallet integration, you can create a custom connector that extends the abstract [`FuelConnector`](DOCS_API_URL/classes/_fuel_ts_account.FuelConnector.html) class. This interface provides a set of methods and events that allow you to interact with the wallet and handle various operations such as connecting, disconnecting, signing messages, and sending transactions.

```ts\nclass MyWalletConnector extends FuelConnector\n```

### Properties

The `FuelConnector` abstract class provides several properties that should be implemented to provide information about the connector.

#### `name`

The `name` property is simply a `string` on the connector that serves as an identifier and will be displayed to the end-user when selecting a connector.

```ts\npublic override name: string = 'My Wallet Connector';\n```

### `external`

The `external` property is simply a `boolean` that indicates when a connector is external or not.
Connectors are considered external, or non-native, when they do not support the Fuel Network (e.g. `Solana`, `WalletConnect`).

#### `metadata`

The `metadata` property on the connector provides additional information about the connector. This information will be displayed to the end-user when selecting a connector. The following is the structure of the `metadata` object:

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/types/connector-metadata.ts' -->

##### `install`

The `metadata.install` property (_required_) is used to provide information about how to install the connector.

The `install` object requires three properties:

- `action` (_required_) - a `string` that will contain an action string that will be displayed to the user (e.g. "Install").

- `link` (_required_) - a `string` that will contain a URL that will be opened when the user clicks the action.

- `description` (_required_) - a `string` that will contain a description of the installation process.

```ts\ninstall: {
    action: 'Install',
    description: 'Install the My Wallet Connector',
    link: 'https://example.com/install',
  },\n```

##### `image`

The `metadata.image` property (_optional_) provides an image that will be displayed to the end-user when selecting a connector. The image will be a URL to the image to be displayed (this can be an inline data URI, encoded in base64).

```ts\nimage: 'https://example.com/image.png',\n```

You can even define a `light` and `dark` theme for the image by providing an object with the `light` and `dark` keys (these will take a similar URI as above).

```ts\nimage: {
    light: 'https://example.com/light.png',
    dark: 'https://example.com/dark.png',
  },\n```

### Events

The `FuelConnector` class provides a number of events that enable developers to listen for changes in the connector state. As part of implementing a custom connector, you can emit these events to notify the consumer dApp of changes.

#### `accounts`

The `accounts` event is emitted every time a connector's accounts change. The event data is an array of `string` addresses available on the network.

```ts\nconst accounts: Array<string> = ['0x1234567890abcdef'];

    this.emit(this.events.accounts, accounts);\n```

#### `connectors`

The `connectors` event is emitted when the connectors are initialized. The event data is an array of [`FuelConnector`](DOCS_API_URL/classes/_fuel_ts_account.FuelConnector.html) objects available on the network.

```ts\nconst connectors: Array<FuelConnector> = [new MyWalletConnector()];

    this.emit(this.events.connectors, connectors);\n```

#### `currentConnector`

The `currentConnector` event is emitted every time the current connector changes. The event data is a [`FuelConnector`](DOCS_API_URL/classes/_fuel_ts_account.FuelConnector.html) object that is currently connected.

```ts\nconst currentConnector: FuelConnector = new MyWalletConnector();

    this.emit(this.events.currentConnector, currentConnector);\n```

#### `currentAccount`

The `currentAccount` event is emitted every time the current account changes. The event data is a string containing the current account address.

```ts\nconst currentAccount: string = '0x1234567890abcdef';

    this.emit(this.events.currentAccount, currentAccount);\n```

#### `connection`

The `connection` event is emitted every time the connection status changes. The event data is a `boolean` value that is `true` if the connection is established and `false` otherwise.

```ts\nconst connection: boolean = true;

    this.emit(this.events.connection, connection);\n```

#### `networks`

The `networks` event is emitted every time the network changes. The event data will be a [`Network`](DOCS_API_URL/types/_fuel_ts_account.Network.html) object containing the current network information.

```ts\nconst network: Network = {
      chainId: 1,
      url: 'https://example.com/rpc',
    };

    this.emit(this.events.networks, network);\n```

#### `currentNetwork`

The `currentNetwork` event is emitted every time the current network changes. The event data will be a [`Network`](DOCS_API_URL/types/_fuel_ts_account.Network.html) object containing the current network information.

```ts\nconst currentNetwork: Network = {
      chainId: 1,
      url: 'https://example.com/rpc',
    };

    this.emit(this.events.currentNetwork, currentNetwork);\n```

#### `assets`

The `assets` event is emitted every time the assets change. The event data will be an array of [`Asset`](DOCS_API_URL/types/_fuel_ts_account.Asset.html) objects available on the network.

```ts\nconst assets: Array<Asset> = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'https://assets.fuel.network/providers/eth.svg',
        networks: [
          {
            type: 'ethereum',
            chainId: 11155111,
            decimals: 18,
          },
        ],
      },
    ];

    this.emit(this.events.assets, assets);\n```

#### `abis`

The `abis` event is emitted every time an ABI is added to a connector. The event data will be an array of [`FuelABI`](DOCS_API_URL/types/_fuel_ts_account.FuelABI.html) object.

```ts\nconst assets: Array<Asset> = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'https://assets.fuel.network/providers/eth.svg',
        networks: [
          {
            type: 'ethereum',
            chainId: 11155111,
            decimals: 18,
          },
        ],
      },
    ];

    this.emit(this.events.assets, assets);\n```

### Methods

The `FuelConnector` abstract class provides a number of methods that _can_ be implemented to perform various functions. Not all the methods are required to be implemented; if you choose not to implement a given method, then just don't include it in your connector.

#### `ping`

The `ping` method is used to check if the connector is available and connected.

It will return a promise that resolves to `true` if the connector is available and connected; otherwise, it will resolve to `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `version`

The `version` method is used to get the current supported version of the connector. It returns a promise that resolves to an object containing the `app` and `network` versions.

The returned version strings can be in a range of formats:

- Caret Ranges (e.g. `^1.2.3`)
- Tilde Ranges (e.g. `~1.2.3`)
- Exact Versions (e.g. `1.2.3`)

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `isConnected`

The `isConnected` method informs if the connector is currently connected.

It will return a promise that resolves to `true` if the connector is established and currently connected; otherwise, it will return `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `connect`

The `connect` method initiates the current connectors authorization flow if a connection has not already been made.

It will return a promise that resolves to `true` if the connection has been established successfully, or `false` if the user has rejected it.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `disconnect`

The `disconnect` method revokes the authorization of the current connector (provided by the `connect` methods).

It will return a promise that resolves to `true` if the disconnection is successful; otherwise, it will resolve to `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `accounts`

The `accounts` method should return a list of all the accounts for the current connection.

It returns a promise that resolves to an array of addresses, pointing to the accounts currently available on the network.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `currentAccount`

The `currentAccount` method will return the default account address if it's authorized with the connection.

It will return a promise to resolve the issue to an address, or if the account is not authorized for the connection, it will return `null`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `signMessage`

The `signMessage` method initiates the sign message flow for the current connection.

It requires two arguments:

- `address` (`string`)
- `message` (`string`)

Providing the message signing flow is successful, it will return the message signature (as a `string`).

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `sendTransaction`

The `signTransaction` method initiates the send transaction flow for the current connection.

It requires two arguments:

- `address` (`string`)
- `transaction` ([`TransactionRequestLike`](DOCS_API_URL/types/_fuel_ts_account.TransactionRequestLike.html))

It will return the transaction signature (as a `string`) if it is successfully signed.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `assets`

The `assets` method returns a list of all the assets available for the current connection.

It will return a promise that will resolve to an array of assets (see [`Asset`](DOCS_API_URL/types/_fuel_ts_account.Asset.html)) that are available on the network.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `addAsset`

The `addAsset` method adds asset metadata to the connector.

It requires a single argument:

- `asset` ([`Asset`](DOCS_API_URL/types/_fuel_ts_account.Asset.html))

It returns a promise that resolves to `true` if the asset is successfully added; otherwise, it resolves to `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `addAssets`

The `addAssets` method adds multiple asset metadata to the connector.

It requires a single argument:

- `assets` (an Array of [`Asset`](DOCS_API_URL/types/_fuel_ts_account.Asset.html)).

Returns a promise that resolves to `true` if the assets are successfully added; otherwise, resolves to `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `addNetwork`

The `addNetwork` method starts the add network flow for the current connection.

It requires a single argument:

- `networkUrl` (`string`)

Returns a promise that resolves to `true` if the network is successfully added; otherwise, `false`.

It should throw an error if the network is not available or the network already exists.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `networks`

The `networks` method returns a list of all the networks available for the current connection.

Returns a promise that resolves to an array of available networks (see [`Network`](DOCS_API_URL/types/_fuel_ts_account.Network.html)).

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `currentNetwork`

The `currentNetwork` method will return the current network that is connected.

It will return a promise that will resolve to the current network (see [`Network`](DOCS_API_URL/types/_fuel_ts_account.Network.html)).

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `selectNetwork`

The `selectNetwork` method requests the user to select a network for the current connection.

It requires a single argument:

- `network` ([`Network`](DOCS_API_URL/types/_fuel_ts_account.Network.html))

You call this method with either the `providerUrl` or `chainId` to select the network.

It will return a promise that resolves to `true` if the network is successfully selected; otherwise, it will return `false`.

It should throw an error if the network is not available or the network does _not_ exist.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `addABI`

The `addABI` method adds ABI information about a contract to the connector. This operation does not require an authorized connection.

It requires two arguments:

- `contractId` (`string`)
- `abi` ([`FuelABI`](DOCS_API_URL/types/_fuel_ts_account.FuelABI.html)).

It will return a promise that will resolve to `true` if the ABI is successfully added; otherwise `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `getABI`

The `getABI` method is used to get the ABI information that is sorted about a contract.

It requires a single argument:

- `contractId` (`string`)

Returns a promise that resolves to the ABI information (as a [`FuelABI`](DOCS_API_URL/types/_fuel_ts_account.FuelABI.html)) or `null` if the data is unavailable.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

#### `hasABI`

The `hasABI` method checks if the ABI information is available for a contract.

It requires a single argument:

- `contractId` (`string`)

Returns a promise that resolves to `true` if the ABI information is available; otherwise `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel-connector.ts' -->

## Connectors Manager

The TS SDK exports the `Fuel` class, which serves as the connectors manager. This class provides the interface for interacting with the TS SDK and the broader Fuel ecosystem.

It can be instantiated as follows:

```ts\nconst sdk = new Fuel();

/*
	Awaits for initialization to mitigate potential race conditions
	derived from the async nature of instantiating a connector.
*/
await sdk.init();\n```

> [!NOTE] Note
> We recommend initializing the Fuel class with the `init` method to avoid any potential race conditions that may arise from the async nature of instantiating a connector.

### Options

Several options can be passed to the `Fuel` connector manager:

- [`connectors`](#connectors)
- [`storage`](#storage)
- [`targetObject`](#targetobject)

#### `connectors`

The `connectors` option provides a list of connectors with which the `Fuel` connector manager can interact. The manager interacts with the connectors, which in turn handle communication with the respective wallet. You can find a list of all the connectors in our [`FuelLabs/fuel-connectors`](https://github.com/FuelLabs/fuel-connectors).

Below, we initialize the manager using the `defaultConnectors` method which provides an array of all the default connectors available in the `fuel-connectors` package. It's being mocked here for the purposes of this example, but you can provide your own custom connectors. Supplying the `devMode` flag as `true` will enable the development wallet for the connectors (to install visit our [wallet documentation](https://docs.fuel.network/docs/wallet/install/)).

```ts\nimport { Fuel, FuelConnector } from 'fuels';

class WalletConnector extends FuelConnector {
  public override name: string = 'My Wallet Connector';
}

const defaultConnectors = (_opts: {
  devMode: boolean;
}): Array<FuelConnector> => [new WalletConnector()];

const sdkDevMode = await new Fuel({
  connectors: defaultConnectors({
    devMode: true,
  }),
}).init();\n```

#### `storage`

The `storage` is used internally to store the current connector state. It can be overridden by passing an instance that extends the `StorageAbstract` class.

```ts\nimport { Fuel, MemoryStorage } from 'fuels';

const sdkWithMemoryStorage = await new Fuel({
  storage: new MemoryStorage(),
}).init();\n```

The default behavior will use `LocalStorage` if the `window` is available:

```ts\nimport { Fuel, LocalStorage } from 'fuels';

const window = {
  localStorage: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  } as unknown as Storage,
};

const sdkWithLocalStorage = await new Fuel({
  storage: new LocalStorage(window.localStorage),
}).init();\n```

#### `targetObject`

The `targetObject` provides a target with which the `Fuel` manager can interact. Used for registering events and can be overridden as follows:

```ts\nimport { Fuel } from 'fuels';
import type { TargetObject } from 'fuels';

const emptyWindow = {} as unknown as TargetObject;

const targetObject: TargetObject = emptyWindow || document;

const sdkWithTargetObject = await new Fuel({
  targetObject,
}).init();\n```

### Methods

The `Fuel` manager provides several methods to interact with the Manager:

#### All methods from connectors

The `Fuel` manager provides all the [methods](#methods) available from the connected connectors. Thus, you can interact with the current connector as if you were interacting with the `Fuel` manager directly.

If no current connector is available or connected, it will throw an error.

#### `connectors`

The `connectors` method gets the current list of _installed_ and _connected_ connectors.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `getConnector`

The `getConnector` method resolves a connector by its name. This is useful for finding a specific connector with which to interact. If the connector is not found, it will return `null`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `hasConnector`

The `hasConnector` method will return `true` under the following conditions:

- There is a current connector that is connected.
- A connector is connected within two seconds of calling the method.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `selectConnector`

The `selectConnector` method accepts a connector name and will return `true` when it is _available_ and _connected_. Otherwise, if not found or unavailable, it will return `false`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `currentConnector`

The `currentConnector` method will return the current connector that is connected or if one is available and connected, otherwise it'll return `null` or `undefined`.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `getWallet`

The `getWallet` method accepts an address (string or instance) as the first parameter and a provider or network as the second parameter. It will return an `Account` instance for the given address (providing it is valid).

The provider or network will default to the current network if not provided. When a provider cannot be resolved, it will throw an [`INVALID_PROVIDER`](../errors/index.md) error.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `clean`

The `clean` method removes all the data currently stored in the [`storage`](#storage) instance.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `unsubscribe`

The `unsubscribe` method removes all currently registered event listeners.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

#### `destroy`

The `destroy` method unsubscribes from all the event listeners and clears the storage.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/connectors/fuel.ts' -->

## Learning Resources

For a deeper understanding of `Fuel Connectors` and how to start using them in your projects, consider the following resources:

- [**Fuel Connectors Wiki**](https://github.com/FuelLabs/fuel-connectors/wiki) - read about what a `Fuel Connector` is and how it works.
- [**Fuel Connectors Guide**](https://docs.fuel.network/docs/wallet/dev/connectors/) - find out how to set up and use connectors.
- [**GitHub Repository**](https://github.com/FuelLabs/fuel-connectors) - explore different connector implementations.
