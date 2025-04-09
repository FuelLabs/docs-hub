# Storage Map

Examples of storage map in Sway

```sway
contract;

use std::{
    hash::Hash,
    auth::msg_sender
};

// StorageMap
// - basic (insert, read, update, remove)
// - nested

abi MyContract {
    #[storage(read, write)]
    fn basic_examples();

    #[storage(read, write)]
    fn nested_examples();
}

storage {
    balance_of: StorageMap<Identity, u64> = StorageMap {},
    allowance: StorageMap<(Identity, Identity), u64> = StorageMap {},
}

const ADDR: b256 = 0x1000000000000000000000000000000000000000000000000000000000000000;

impl MyContract for Contract {
    #[storage(read, write)]
    fn basic_examples() {
        let sender = msg_sender().unwrap();

        // Insert
        storage.balance_of.insert(sender, 123);
        // Read
        let bal = storage.balance_of.get(sender).try_read().unwrap_or(0);
        // Update
        storage.balance_of.insert(sender, bal + 1);
        // Remove
        storage.balance_of.remove(sender);
    }

    #[storage(read, write)]
    fn nested_examples() {
        let sender = msg_sender().unwrap();
        let spender = Identity::Address(Address::from(ADDR));

        // Read
        let val = storage.allowance.get((sender, spender)).try_read().unwrap_or(0);
        // Insert / update
        storage.allowance.insert((sender, spender), val + 1);
        // Remove
        storage.allowance.remove((sender, spender));
    }
}
```
