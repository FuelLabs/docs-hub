# Counter

The following is a simple example of a contract which implements a counter. Both the `initialize_counter()` and `increment_counter()` ABI methods return the currently set value.

```bash
forc template --template-name counter my_counter_project
```

```sway
contract;

abi TestContract {
    #[storage(write)]
    fn initialize_counter(value: u64) -> u64;

    #[storage(read, write)]
    fn increment_counter(amount: u64) -> u64;
}

storage {
    counter: u64 = 0,
}

impl TestContract for Contract {
    #[storage(write)]
    fn initialize_counter(value: u64) -> u64 {
        storage.counter.write(value);
        value
    }

    #[storage(read, write)]
    fn increment_counter(amount: u64) -> u64 {
        let incremented = storage.counter.read() + amount;
        storage.counter.write(incremented);
        incremented
    }
}
```

## Build and deploy

The following commands can be used to build and deploy the contract. For a detailed tutorial, refer to [Building and Deploying](https://docs.fuel.network/guides/contract-quickstart/#building-the-contract).

```bash
# Build the contract
forc build

# Deploy the contract
forc deploy --testnet
```
