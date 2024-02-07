# Intro to Sway for JS Devs

If you know JavaScript, you can quickly learn to build full-stack dapps, or decentralized applications, on Fuel with Sway. Once you learn some Sway fundamentals, you'll be ready to start building your own dapp.

## TLDR

A Sway contract for a decentralized Amazon-like marketplace.

Make sure you have the Rust and Fuel toolchains installed. Install the beta-3 toolchain distribution and set it as your default.

You can build the Sway contract with `forc build`.

To run the tests in `harness.rs`, use `cargo test`. To print to the console from the tests, use `cargo test -- --nocapture`.

## What is Sway?

Sway is a strongly-typed programming language based on Rust used to write smart contracts on the Fuel blockchain. It inherits Rust's performance, control, and safety to use in a blockchain virtual machine environment optimized for gas costs and contract safety. 

Sway is backed by a powerful compiler and toolchain that work to abstract away complexities and ensure that your code is working, safe, and performant. 

Part of what makes Sway so unique is the fantastic suite of tools surrounding it that help you turn a contract into a full-stack dapp:

- 📚 Sway Standard Library: A native library of helpful types and methods.

- 🧰 Forc: The Fuel toolbox that helps you build, deploy, and manage your Sway projects.

- 🧑‍🔧 Fuelup: The official Fuel toolchain manager helps you install and manage versions. 

- 🦀 Fuels Rust SDK: Test and interact with your Sway contract with Rust.

- ⚡ Fuels Typescript SDK: Test and interact with your Sway contract with TypeScript.

- 🔭 Fuel Indexer: Make your own indexer to organize and query on-chain data.

## Dev Setup

Before diving into any Sway code, ensure you have installed the following dependencies.

Start by installing the [Fuel toolchain](https://github.com/FuelLabs/fuelup).

Install the beta-3 toolchain distribution and set it as your default with:

```bash
$ fuelup toolchain install beta-3
$ fuelup default beta-3
```

You can check to see the current toolchain version installed by running the following:

```bash
$ fuelup show
```

Next, add the [Sway extension](https://marketplace.visualstudio.com/items?itemName=FuelLabs.sway-vscode-plugin) to your VS Code.

If you want to be able to run tests in Rust, install the [Rust toolchain](https://www.rust-lang.org/tools/install) as well.

## Writing a Contract

> This example uses the `beta-3` toolchain, which is version `0.35.3` of `forc` and version `0.17.3` of `fuel-core`.

Let's make a Sway contract for an online marketplace like Amazon, where sellers can list products, buyers can buy them, and the marketplace takes a cut of each purchase.

Part of what makes smart contracts so powerful is that they are immutable and permissionless. This means that unless you build a function to remove an item or block certain users, no one will be able to delist any item or deny any users. Likewise, if we hard-code a commission amount in the contract, no one can ever change the commission taken for products. 

On top of this, anyone can interact with the contract. This means that anyone can make a frontend for your contract without permission, and contracts can interact with any number of frontends.

We can start by creating a new folder called `sway-store`, and making a new contract called `sway-store-contract`. 

```bash
$ mkdir sway-store
$ cd sway-store
$ forc new contract
```

Open up the `contract` folder in VS Code, and inside the `src` folder you should see a file called `main.sw`. This is where you will write your Sway contract. You can delete everything in this file.

The first line of the file is specially reserved to let the compiler know if we are writing a contract, script, predicate, or library. To define the file as a contract, use the `contract` keyword.

```rust
contract;
```

### Imports

The Sway standard library provides several utility types and methods we can use in our contract. To import a library, you can use the `use` keyword and `::`, also called a namespace qualifier, to chain library names like this:

```rust
// imports the msg_sender function from the std library
use std::auth::msg_sender;
```

You can also group together imports using curly brackets:

```rust
use std::{
    auth::msg_sender,
    storage::StorageVec,
}
```

For this contract, here is what needs to be imported:

```rust
use std::{
    auth::msg_sender,
    call_frames::msg_asset_id,
    constants::BASE_ASSET_ID,
    context::{
        msg_amount,
        this_balance,
    },
    token::transfer,
};
```

We'll go through what each of these imports does as we use them later.

### Item Struct

Struct is short for structure, which is a data structure similar to an object in JavaScript. You define a struct with the `struct` keyword and define the fields of a struct inside curly brackets.

The core of our program is the ability to list, sell, and get `items`.

Let's define the `Item` type as shown below:

```rust
struct Item {
    id: u64,
    price: u64,
    owner: Identity,
    metadata: str[20],
    total_bought: u64,
}
```

The item struct will hold an ID, price, the owner's identity, a string for a URL or identifier where off-chain data about the item is stored (such as the description and photos), and a total bought counter to keep track of the total number of purchases.

#### Types

The `Item` struct uses three types: `u64`, `str[20]`, and `Identity`.

`u64`: a 64-bit unsigned integer

In Sway, there are four native types of numbers:
- `u8`: an 8-bit unsigned integer
- `u16` a 16-bit unsigned integer
- `u32` a 32-bit unsigned integer
- `u64`: a 64-bit unsigned integer

An unsigned integer means there is no `+` or `-` sign, so the value is always positive. `u64` is the default type used for numbers in Sway. To use other number types, for example [`u256`](https://github.com/FuelLabs/sway/blob/master/sway-lib-std/src/u256.sw) or [signed integers](https://github.com/FuelLabs/sway-libs/tree/master/sway_libs/src/signed_integers), you must import them from a library.

In JavaScript, there are two types of integers: a number and a BigInt. The main difference between these types is that BigInt can store a much larger value. Similarly, each number type for Sway has different values for the largest number that can be stored.

`str[20]`: a string with exactly 20 characters. All strings in Sway must have a fixed length. 

`Identity`: an enum type that represents either a user's `Address` or a `ContractId`. We already imported this type from the standard library earlier.

### ABI

Next, we will define our ABI. ABI stands for application binary interface. In a Sway contract, it's an outline of all of the functions in the contract. For each function, you must specify its name, input types, return types, and level of storage access. 

Our contract's ABI will look like this:

```rust
abi SwayStore {
    // a function to list an item for sale
    // takes the price and metadata as args
    #[storage(read, write)]
    fn list_item(price: u64, metadata: str[20]);

    // a function to buy an item
    // takes the item id as the arg
    #[storage(read, write), payable]
    fn buy_item(item_id: u64);

    // a function to get a certain item
    #[storage(read)]
    fn get_item(item_id: u64) -> Item;

    // a function to set the contract owner
    #[storage(read, write)]
    fn initialize_owner() -> Identity;

    // a function to withdraw contract funds
    #[storage(read)]
    fn withdraw_funds();

    // return the number of items listed
    #[storage(read)]
    fn get_count() -> u64;
}
``` 

#### Functions

A function is defined with the `fn` keyword. Sway uses snake case, so instead of naming a function `myFunction`, you would use `my_function`.

You must define the return type using a skinny arrow if the function returns anything. If there are any parameters, the types must also be defined for those. Semicolons are *required* at the end of each line.

If any function reads from or writes to storage, you must define that level of access above the function with either `#[storage(read)]` or `#[storage(read, write)]`.

If you expect funds to be sent when a function is called, like the `buy_item` function, you must use the `#[payable]` annotation.

### Storage Block

Next, we can add the storage block. The storage block is where you can store any state variables in your contract that you want to be persistent. Any Sway primitive type can be stored in the storage block.

Any variables declared inside a function and not saved in the storage block will be destroyed when the function finishes executing.

```rust
storage {
    // counter for total items listed
    item_counter: u64 = 0,
    // map of item IDs to Items
    item_map: StorageMap<u64, Item> = StorageMap {},
    // owner of the contract
    owner: Option<Identity> = Option::None,
}
```

The first variable we have stored is `item_counter`, a number initialized to 0. You can use this counter to track the total number of items listed.

#### StorageMap

A StorageMap is a special type that allows you to save key-value pairs inside a storage block. 

To define a storage map, you must specify the type for the key and value. For example, below, the type for the key is `u64`, and the type for the value is an `Item` struct.

```rust
item_map: StorageMap<u64, Item> = StorageMap{}
```

Here, we are saving a mapping of the item's ID to the Item struct. With this, we can look up information about an item with the ID. 

#### Options

Here we are setting the variable `owner` as a variable that could be `None` or could store an `Identity`.

```rust
owner: Option<Identity> = Option::None
```

If you want a value to be null or undefined under certain conditions, you can use an `Option` type, which is an enum that can be either `Some(value)` or `None`. The keyword `None` represents that no value exists, while the keyword `Some` means there is some value stored.

### Error Handling

Enumerations, or enums, are a type that can be one of several variations. In our contract, we can use an enum to create custom errors to handle errors in a function. 

```rust
enum InvalidError {
    IncorrectAssetId: ContractId,
    NotEnoughTokens: u64,
    OnlyOwner: Identity,
}
```

In our contract, we can expect there to be some different situations where we want to throw an error and prevent the transaction from executing: 
1. Someone could try to pay for an item with the wrong currency.
2. Someone could try to buy an item without having enough coins.
3. Someone could try to withdraw funds from the contract who isn't the owner. 

We can define the return types for each error. For the `IncorrectAssetId` error we can return the asset id sent, which is a `ContractId` type. For the `NotEnoughTokens` variation, we can return the number of coins by defining the return type as a `u64`. For the `OnlyOwner` Error, we can use the Identity of the message sender. 

### Contract Functions

Finally, we can write our contract functions. Copy and paste the ABI from earlier. The functions in the contract *must* match the ABI, or the compiler will throw an error. Replace the semicolons at the end of each function with curly brackets, and change `abi SwayStore` to `impl SwayStore for Contract` as shown below:

```rust
impl SwayStore for Contract {
    #[storage(read, write)]
    fn list_item(price: u64, metadata: str[20]){
        
    }

    #[storage(read, write), payable]
    fn buy_item(item_id: u64) {
        
    }

    #[storage(read)]
    fn get_item(item_id: u64) -> Item {
        
    }

    #[storage(read, write)]
    fn initialize_owner() -> Identity {
        
    }

    #[storage(read)]
    fn withdraw_funds(){
        
    }

    #[storage(read)]
    fn get_count() -> u64{
 
    }
}
```

### Listing an item

Our first function allows sellers to list an item for sale. They can set the item's price and a string that points to some externally-stored data about the item. 

```rust
#[storage(read, write)]
fn list_item(price: u64, metadata: str[20]) {
    // increment the item counter
    storage.item_counter += 1;
    //  get the message sender
    let sender = msg_sender().unwrap();
    // configure the item
    let new_item: Item = Item {
        id: storage.item_counter,
        price: price,
        owner: sender,
        metadata: metadata,
        total_bought: 0,
    };
    // save the new item to storage using the counter value
    storage.item_map.insert(storage.item_counter, new_item);
}
```

#### Updating storage

The first step is incrementing the `item_counter` from storage so we can use it as the item's ID. 

```rust
storage.item_counter += 1;
```

#### Getting the message sender

Next, we can get the `Identity` of the account listing the item.

To define a variable in Sway, you can use `let` or `const`. Types must be declared where they cannot be inferred by the compiler.

To get the `Identity`, you can use the `msg_sender` function imported from the standard library. This function returns a `Result`, which is an enum type that is either OK or an error. The `Result` type is used when a value that could potentially be an error is expected.

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

The `msg_sender` function returns a `Result` that is either an `Identity` or an `AuthError` in the case of an error.

```rust
let sender = msg_sender().unwrap();
```

To access the inner returned value, you can use the `unwrap` method, which returns the inner value if the `Result` is OK, and panics if the result is an error.

#### Creating a new item

We can create a new item using the `Item` struct. Use the `item_counter` value from storage for the ID, set the price and metadata as the input parameters, and set `total_bought` to 0. 

Because the `owner` field requires a type `Identity`, you can use the sender value returned from `msg_sender()`.

```rust
let new_item: Item = Item {
    id: storage.item_counter,
    price: price,
    owner: sender,
    metadata: metadata,
    total_bought: 0,
};
```

#### Updating a StorageMap

Finally, you can add the item to the `item_map` in the storage using the `insert` method. You can use the same ID for the key and set the item as the value.

```rust
storage.item_map.insert(storage.item_counter, new_item);
```

### Buying an item

Next, we want buyers to be able to buy an item that has been listed, which means we will need to:
- accept the item ID as a function parameter
- make sure the buyer is paying the right price and using the right coins
- increment the `total_bought` count for the item
- transfer the cost of the item to the seller minus some fee that the contract will keep

```rust
#[storage(read, write), payable]
fn buy_item(item_id: u64) {
    // get the asset id for the asset sent
    let asset_id = msg_asset_id();
    // require that the correct asset was sent
    require(asset_id == BASE_ASSET_ID, InvalidError::IncorrectAssetId(asset_id));

    // get the amount of coins sent
    let amount = msg_amount();

    // get the item to buy
    let mut item = storage.item_map.get(item_id).unwrap();

    // require that the amount is at least the price of the item
    require(amount >= item.price, InvalidError::NotEnoughTokens(amount));

    // update the total amount bought
    item.total_bought += 1;
    // update the item in the storage map
    storage.item_map.insert(item_id, item);

    // only charge commission if price is more than 0.1 ETH
    if amount > 100_000_000 {
        // keep a 5% commission
        let commission = amount / 20;
        let new_amount = amount - commission;
        // send the payout minus commission to the seller
        transfer(new_amount, asset_id, item.owner);
    } else {
        // send the full payout to the seller
        transfer(amount, asset_id, item.owner);
    }
}
```

#### Verifying payment

We can use the `msg_asset_id` function imported from the standard library to get the asset ID of the coins being sent in the transaction. 

```rust
let asset_id = msg_asset_id();
```

Then, we can use a `require` statement to assert that the asset sent is the right one.

A `require` statement takes two arguments: a condition and a value that gets logged if the condition is false. If false, the entire transaction will be reverted, and no changes will be applied. 

Here the condition is that the `asset_id` must be equal to the `BASE_ASSET_ID`, which is the default asset used for the base blockchain that we imported from the standard library.
 
If the asset is any different, or, for example, someone tries to buy an item with another coin, we can throw the custom error that we defined earlier and pass in the `asset_id`.

```rust
require(asset_id == BASE_ASSET_ID, InvalidError::IncorrectAssetId(asset_id));
```

Next, we can use the `msg_amount` function from the standard library to get the number of coins sent from the buyer.

```rust
let amount = msg_amount();
```

To check that this amount isn't less than the item's price, we need to look up the item details using the `item_id` parameter.

To get a value for a particular key in a storage map, we can use the `get` method and pass in the key value. This method returns a `Result` type, so we can use the `unwrap` method here to access the item value. 

```rust
let mut item = storage.item_map.get(item_id).unwrap();
```

By default, all variables are immutable in Sway for both `let` and `const`. However, if you want to change the value of any variable, you have to declare it as mutable with the `mut` keyword. Because we'll update the item's `total_bought` value later, we need to define it as mutable.

We also want to require that the number of coins sent to buy the item isn't less than the item's price.

```rust
require(amount >= item.price, InvalidError::NotEnoughTokens(amount));
```
#### Updating storage

We can increment the value for the item's `total_bought` field and then re-insert it into the `item_map`. This will overwrite the previous value with the updated item.

```rust
item.total_bought += 1;
storage.item_map.insert(item_id, item);
```

#### Transferring payment

Finally, we can transfer the payment to the seller. It's always best to transfer assets after all storage updates have been made to avoid [re-entrancy attacks](https://fuellabs.github.io/sway/v0.32.1/book/blockchain-development/calling_contracts.html).

We can subtract a fee for items that meet a certain price threshold using a conditional `if` statement. `if` statements in Sway don't use parentheses around the conditions, but otherwise look the same as in JavaScript.

```rust
if amount > 100_000_000 {
    let commission = amount / 20;
    let new_amount = amount - commission;
    transfer(new_amount, asset_id, item.owner);
} else {
    transfer(amount, asset_id, item.owner);
}
```

In the if-condition above, we check if the amount sent exceeds 100,000,000. To visually separate a large number like `100000000`, we can use an underscore, like `100_000_000`. If the base asset for this contract is ETH, this would be equal to 0.1 ETH. 

If the amount exceeds 0.1 ETH, we calculate a commission and subtract that from the amount.

We can use the `transfer` function to send the amount to the item owner. The `transfer` function is imported from the standard library and takes three arguments: the number of coins to transfer, the asset ID of the coins, and an Identity to send the coins to. 

### Get an item

To get the details for an item, we can create a read-only function that returns the `Item` struct for a given item ID.

```rust
 #[storage(read)]
fn get_item(item_id: u64) -> Item {
    storage.item_map.get(item_id).unwrap()
}
```

To return a value in a function, you can either use the `return` keyword just as you would in JavaScript or omit the semicolon in the last line to return that line.

```rust
fn my_function(num: u64) -> u64{
    // returning the num variable
    num
    
    // this would also work:
    // return num;
}
```

### Initialize the owner

To make sure we are setting the owner `Identity` correctly, instead of hard-coding it, we can use this function to set the owner from a wallet.

```rust
#[storage(read, write)]
fn initialize_owner() -> Identity {
    let owner = storage.owner;
    // make sure the owner has NOT already been initialized
    require(owner.is_none(), "owner already initialized");
    // get the identity of the sender
    let sender = msg_sender().unwrap(); 
    // set the owner to the sender's identity
    storage.owner = Option::Some(sender);
    // return the owner
    sender
}
```

Because we only want to be able to call this function once (right after the contract is deployed), we'll require that the owner value still needs be `None`. To do that, we can use the `is_none` method, which checks if an Option type is `None`. 

```rust
let owner = storage.owner;
require(owner.is_none(), "owner already initialized");
```

To set the `owner` as the message sender, we'll need to convert the `Result` type to an `Option` type.

```rust
let sender = msg_sender().unwrap(); 
storage.owner = Option::Some(sender);
```

Last, we'll return the message sender's `Identity`.

```rust
sender
```

### Withdraw funds

The `withdraw_funds` function allows the owner to withdraw the funds that the contract has accrued.

```rust
#[storage(read)]
fn withdraw_funds() {
    let owner = storage.owner;
    // make sure the owner has been initialized
    require(owner.is_some(), "owner not initialized");
    let sender = msg_sender().unwrap(); 
    // require the sender to be the owner
    require(sender == owner.unwrap(), InvalidError::OnlyOwner(sender));

    // get the current balance of this contract for the base asset
    let amount = this_balance(BASE_ASSET_ID);

    // require the contract balance to be more than 0
    require(amount > 0, InvalidError::NotEnoughTokens(amount));
    // send the amount to the owner
    transfer(amount, BASE_ASSET_ID, owner.unwrap());
}
```

First, we'll ensure that the owner has been initalized to some address.

```rust
let owner = storage.owner;
require(owner.is_some(), InvalidError::OwnerNotInitialized);
```

Next, we will require that the person trying to withdraw the funds is the owner.

```rust
let sender = msg_sender().unwrap();  
require(sender == owner.unwrap(), InvalidError::OnlyOwner(sender));
```

We can also ensure that there are funds to send using the `this_balance` function from the standard library, which returns the balance of this contract.

```rust
let amount = this_balance(BASE_ASSET_ID);
require(amount > 0, InvalidError::NotEnoughTokens(amount));
```

Finally, we will transfer the balance of the contract to the owner.

```rust
transfer(amount, BASE_ASSET_ID, owner.unwrap());
```

### Get the project count

The last function we need to add is the `get_count` function, which is a simple getter function to return the `item_counter` variable in storage.

```rust
#[storage(read)]
fn get_count() -> u64 {
    storage.item_counter
}
```

### Building the contract

You can compile your contract by running `forc build` in the contract folder. And that's it! You just wrote an entire contract in Sway 💪🛠🔥🚀🎉😎🌴✨.

To format your contract, run `forc fmt`.

## Testing the contract

You can see the complete code for this contract plus example tests using the Rust SDK in this repo.

To generate your own test template in Rust, you can use `cargo-generate`:

```
cargo install cargo-generate
cargo generate --init fuellabs/sway templates/sway-test-rs --name contract
```

To run the tests in `harness.rs`, use `cargo test`. To print to the console from the tests, use `cargo test -- --nocapture`.

## Deploying the contract

You can find the instructions to deploy this contract in the official Fuel developer quickstart: https://fuelbook.fuel.network/master/quickstart/smart-contract.html#deploy-the-contract

Make sure to deploy with the `--random-salt` flag, as this contract has been deployed.

Once your contract is deployed, save your contract ID to use in the frontend.

## Building the Frontend

### Setup

Initialize a new React app with TypeScript in the same parent folder as your contract using the command below.

```shell
npx create-react-app frontend --template typescript
```

Next, install the fuels Typescript and wallet SDKs in the frontend folder and generate types from your contract with `fuels typegen`.

```shell
cd frontend
npm install fuels @fuel-wallet/sdk
npx fuels typegen -i ../contract/out/debug/*-abi.json -o ./src/contracts
```

In the `tsconfig.json` file, add the line below in the `compilerOptions` object to add the Fuel wallet type on the window object.

```json
"types": ["@fuel-wallet/sdk"],
```

Open the `src/App.tsx` file, and replace the boilerplate code with the template below:

```tsx
import { useState, useEffect, useMemo } from "react";
import { WalletLocked } from "fuels";
import { ContractAbi__factory } from "./contracts"
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Sway Marketplace</h1>
      </header>
    </div>
  );
}

export default App;
```

Finally, copy and paste the CSS code below in your `App.css` file to add some simple styling.

```css
.App {
  text-align: center;
}

nav > ul {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-inline-start: 0;
}

nav > ul > li {
  cursor: pointer;
}

.form-control{
  text-align: left;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 400px;
}

.form-control > input {
  margin-bottom: 1rem;
}

.form-control > button {
  cursor: pointer;
  background: #054a9f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 20px;
}

.items-container{
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1rem 0;
}

.item-card{
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  max-width: 300px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.active-tab{
  border-bottom: 4px solid #77b6d8;
}

button {
  cursor: pointer;
  background: #054a9f;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 20px;
  color: white;
}
```

### Connecting to the contract

At the top of the file, add your contract ID as a constant.

```tsx
const CONTRACT_ID = "0x..."
``` 

Next, create a new folder in the `src` folder called `hooks`, and copy and paste the `useFuel.tsx` and `useIsConnected.tsx` hooks from the example in this repo. You can also find them in the [offical wallet docs](https://wallet.fuel.network/docs/react/).

In `App.tsx`, import both of these hooks.

```tsx
import { useIsConnected } from "./hooks/useIsConnected";
import { useFuel } from "./hooks/useFuel";
```

In the `App` function, we can call these hooks like this:

```tsx
const [fuel] = useFuel();
const [isConnected] = useIsConnected();
```

Now we can check if the user has the fuel wallet installed and check if it's connected. 

If the user doesn't have the `fuel` object in their window, we know that they don't have the Fuel wallet extention installed.
If they have it installed, we can then check if the wallet is connected.

```tsx
{fuel ? (
    <div>
        {isConnected ? (
            <div>Connected!</div>
        ) : (
            <div>
                <button onClick={() => fuel.connect()}>Connect Wallet</button>
            </div>
        )}
    </div>
    ) : (
    <div>
        Download the{" "}
        <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://wallet.fuel.network/"
        >
        Fuel Wallet
        </a>{" "}
        to use the app.
    </div>
)}
```

Next, let's add a state variable called `wallets` with the `useState` hook, which will have the type `WalletLocked`.

You can think of a locked wallet as a user wallet you can't sign transactions for, and an unlocked wallet as a wallet where you have the private key and are able to sign transactions.

```tsx
const [wallet, setWallet] = useState<WalletLocked>();
```

We can then use the `useEffect` hook below to get the connected wallet account.

```tsx
useEffect(() => {
    async function getAccounts() {
      const currentAccount = await fuel.currentAccount();
      const tempWallet = await fuel.getWallet(currentAccount)
      setWallet(tempWallet)
    }
    if (fuel) getAccounts();
  }, [fuel]);
```

Next, we can use the `useMemo` hook to connect to our contract with the connected wallet.

```tsx
 const contract = useMemo(() => {
    if (fuel && wallet) {
      const contract = ContractAbi__factory.connect(CONTRACT_ID, wallet);
      return contract;
    }
    return null;
  }, [fuel, wallet]);
```

Now we have our contract connection ready. You can console log the contract here to make sure this is working correctly.

### UI

In our app we're going to have two tabs: one to see all of the items listed for sale, and one to list a new item for sale.

Let's add another state variable called `active` that we can use to toggle between our tabs. We can set the default tab to show all listed items.

```tsx
const [active, setActive] = useState<'all-items' | 'list-item'>('all-items');
```

Below the header, add a nav section to toggle between the two options.

```tsx
<nav>
    <ul>
        <li
        className={active === 'all-items' ? "active-tab" : ""}
        onClick={() => setActive('all-items')}
        >
        See All Items
        </li>
        <li
        className={active === 'list-item' ? "active-tab" : ""}
        onClick={() => setActive('list-item')}
        >
        List an Item
        </li>
    </ul>
</nav>
```

Next we can create our components to show and list items.

### Listing an Item

Create a new folder in the `src` folder called `components`, and create a file there component called `ListItem.tsx`.

At the top of the file, import the `useState` hook from `react`, the generated contract ABI from the `contracts` folder, and `bn` (big number) type from `fuels`.

```tsx
import { useState } from "react";
import { ContractAbi } from "../contracts";
import { bn } from "fuels";
```

This component will take the contract we made in `App.tsx` as a prop, so let's create an interface for the component.

```tsx
interface ListItemsProps {
  contract: ContractAbi | null;
}
```

We can set up the template for the function like this.

```tsx
export default function ListItem({contract}: ListItemsProps){
    return (
        <div>
            <h2>List an Item</h2>
        </div>
    )
}
```

To list an item, we'll create a form where the user can input the metadata string and price for the item they want to list. 
Let's start by adding some state variables for the `metadata` and `price`. We can also add a `status` variable to track the submit status.

```tsx
const [metadata, setMetadata] = useState<string>("");
const [price, setPrice] = useState<string>("0");
const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');
```

Under the heading, add the code below for the form:

```tsx
{status === 'none' &&
    <form onSubmit={handleSubmit}>
        <div className="form-control">
            <label htmlFor="metadata">Item Metadata:</label>
            <input 
                id="metadata" 
                type="text" 
                pattern="\w{20}" 
                title="The metatdata must be 20 characters"
                required 
                onChange={(e) => setMetadata(e.target.value)}
            />
        </div>

        <div className="form-control">
            <label htmlFor="price">Item Price:</label>
            <input
                id="price"
                type="number"
                required
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                onChange={(e) => {
                    setPrice(e.target.value);
                }}
                />
        </div>

        <div className="form-control">
            <button type="submit">List item</button>
        </div>
    </form>
}

{status === 'success' && <div>Item successfully listed!</div>}
{status === 'error' && <div>Error listing item. Please try again.</div>}
{status === 'loading' && <div>Listing item...</div>}
```

Finally, we need to add the `handleSubmit` function. 
We can use the contract prop to call the `list_item` function and pass in the `price` and `metadata` from the form.

```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setStatus('loading')
    if(contract !== null){
        try {
            const priceInput = bn.parseUnits(price.toString());
            await contract.functions.list_item(priceInput, metadata).call();
            setStatus('success')
        } catch (e) {
            console.log("ERROR:", e);
            setStatus('error')
        }
    } else {
        console.log("ERROR: Contract is null");
    }
}
```

Now that we have this component, let's add it to our `App.tsx` file and try it out.

Import the `ListItem` component at the top of the file.
Then, replace where it says `Connected!` with the code below:

```tsx
{active === 'all-items' && <div>All Items</div>}
{active === 'list-item' && <ListItem contract={contract} />}
```

Now, try listing an item to make sure this works. 
You should see the message `Item successfully listed!`.

### Show All Items

Next, let's create a new file called `AllItems.tsx` in the `components` folder.

Copy and paste the template code below for this component:

```tsx
import { useState, useEffect } from "react";
import { ContractAbi } from "../contracts";
import { ItemOutput } from "../contracts/ContractAbi";

interface AllItemsProps {
  contract: ContractAbi | null;
}
export default function AllItems({ contract }: AllItemsProps) {
    return (
        <div>
            <h2>All Items</h2>
        </div>
    )
}
```

Here we can get the item count to see how many items are listed, and then loop through each of them to get the item details.

First, let's create some state variables to store the number of items listed, an array of the item details, and the loading status.

```tsx
const [itemCount, setItemCount] = useState<number>(0);
const [items, setItems] = useState<ItemOutput[]>([]);
const [status, setStatus] = useState<'success' | 'loading' | 'error'>('loading');
```

Next, let's fetch the items in a `useEffect` hook.
Because these are read-only functions, we can simulate a dry-run of the transaction by using the `get` method instead of `call` so the user doesn't have to sign anything.

```tsx
useEffect(() => {
    async function getAllItems() {
      if (contract !== null) {
        try {
          let { value } = await contract.functions.get_count().get();
          let formattedValue = parseFloat(value.format()) * 1_000_000_000;
          setItemCount(formattedValue);
          let max = formattedValue + 1;
          let tempItems = [];
          for(let i=1; i < max; i++){
            let resp = await contract.functions.get_item(i).get();
            tempItems.push(resp.value);
          }
          setItems(tempItems);
          setStatus('success');
        } catch (e) {
          setStatus('error');
          console.log("ERROR:", e);
        }
      }
    }
    getAllItems();
  }, [contract]);
```

If the item count is greater than `0` and we are able to successfully load the items, we can map through them and display an item card.

The item card will show the item details and a buy button to buy that item, so we'll need to pass the contract and the item as props.

```tsx
{status === 'success' &&
<div>
    {itemCount === 0 ? (
    <div>Uh oh! No items have been listed yet</div>
    ) : (
    <div>
        <div>Total items: {itemCount}</div>
        <div className="items-container">
            {items.map((item) => (
                <ItemCard key={item.id.format()} contract={contract} item={item}/>
            ))}
        </div>
    </div>
    )}
</div>
}
{status === 'error' && <div>Something went wrong, try reloading the page.</div>}
{status === 'loading' && <div>Loading...</div>}
```

### Item Card

Now let's create the item card component. 
Create a new file called `ItemCard.tsx` in the components folder, and copy and paste the template code below.

```tsx
import { useState } from "react";
import { ItemOutput } from "../contracts/ContractAbi";
import { ContractAbi } from "../contracts";

interface ItemCardProps {
    contract: ContractAbi | null;
    item: ItemOutput;
}

export default function ItemCard({ item, contract }: ItemCardProps) {
    return (
        <div className="item-card">
        </div>
    )
}
```

Add a `status` variable to track the status of the buy button.

```tsx
const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');
```

Then add the item details and status messages to the card.

```tsx
<div className="item-card">
    <div>Id: {parseFloat(item.id.format()) * 1_000_000_000}</div>
    <div>Metadata: {item.metadata}</div>
    <div>Price: {parseFloat(item.price.format())} ETH</div>
    <div>Total Bought: {parseFloat(item.total_bought.format()) * 1_000_000_000}</div>
    {status === 'success' && <div>Purchased ✅</div>}
    {status === 'error' && <div>Something went wrong ❌</div>}
    {status === 'none' &&  <button onClick={handleBuyItem}>Buy Item</button>}
    {status === 'loading' && <div>Buying item...</div>}
</div>
```

Create a new async function called `handleBuyItem`.
Because this function is payable and transfers coins to the item owner, we'll need to do a couple special things here.

Whenever we call any function that uses the transfer or mint functions in Sway, we have to append the matching number of variable outputs to the call with the `txParams` method. Because the `buy_item` function just transfers assets to the item owner, the number of variable outputs is `1`.

Next, because this function is payable and the user needs to transfer the price of the item, we'll use the `callParams` method to forward the amount. With Fuel you can transfer any type of asset, so we need to specify both the amount and the asset ID.

```tsx
const assetId = "0x0000000000000000000000000000000000000000000000000000000000000000"

async function handleBuyItem() {
    if (contract !== null) {
        setStatus('loading')
        try {
        await contract.functions.buy_item(item.id)
        .txParams({ variableOutputs: 1 })
        .callParams({
            forward: [item.price, assetId],
            })
        .call()
        setStatus("success");
        } catch (e) {
        console.log("ERROR:", e);
        }
    }
}
```

Go back to `AllItems.tsx` and import the `ItemCard` component we just made.

Finally, in `App.tsx`, import the `AllItems` component and replace `{active === 'all-items' && <div>All Items</div>}` with the line below:

```tsx
{active === 'all-items' && <AllItems contract={contract} />}
```

Now you should be able to see and buy all of the items listed in your contract.

And that's it for the frontend! You just created a whole dapp on Fuel! 

## Keep building on Fuel

Ready to keep building? You can dive deeper into Sway and Fuel in the resources below:

📘 [Read the Sway Book](https://fuellabs.github.io/sway)

✨ [Build a frontend with the TypeScript SDK](https://fuellabs.github.io/fuels-ts/)

🦀 [Write tests with the Rust SDK](https://rust.fuel.network/master/)

🔧 [Learn how to use Fuelup](https://install.fuel.network/latest)

🏃‍ [Follow the Fuel Quickstart](https://fuelbook.fuel.network/master/quickstart/developer-quickstart.html)

📖 [See Example Sway Applications](https://github.com/FuelLabs/sway-applications)

⚡️ [Learn about Fuel](https://fuelbook.fuel.network/)

🐦 [Follow Sway Language on Twitter](https://twitter.com/SwayLang)

👾 [Join the Fuel Discord](https://discord.com/invite/xfpK4Pe)

❓ [Ask questions in the Fuel Forum](https://forum.fuel.network/)
