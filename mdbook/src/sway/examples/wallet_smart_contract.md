# Wallet Smart Contract

The ABI declaration is a separate project from your ABI implementation. The project structure for the code should be organized as follows with the `wallet_abi` treated as an external library:

```sh
.
├── wallet_abi
│   ├── Forc.toml
│   └── src
│       └── main.sw
└── wallet_smart_contract
    ├── Forc.toml
    └── src
        └── main.sw
```

It's also important to specify the source of the dependency within the project's `Forc.toml` file when using external libraries. Inside the `wallet_smart_contract` project, it requires a declaration like this:

```sh
[dependencies]
wallet_abi = { path = "../wallet_abi/" }
```

## ABI Declaration

```sway
library;

// ANCHOR: abi
abi Wallet {
    // ANCHOR: receive_funds
    #[storage(read, write), payable]
    fn receive_funds();
    // ANCHOR_END: receive_funds

    // ANCHOR: send_funds
    #[storage(read, write)]
    fn send_funds(amount_to_send: u64, recipient_address: Address);
    // ANCHOR_END: send_funds
}
// ANCHOR: abi
```

## ABI Implementation

```sway
contract;

use std::{asset::transfer, call_frames::msg_asset_id, context::msg_amount};

// ANCHOR: abi_import
use wallet_abi::Wallet;
// ANCHOR_END: abi_import
const OWNER_ADDRESS = Address::from(0x8900c5bec4ca97d4febf9ceb4754a60d782abbf3cd815836c1872116f203f861);

storage {
    balance: u64 = 0,
}

// ANCHOR: abi_impl
impl Wallet for Contract {
    #[storage(read, write), payable]
    fn receive_funds() {
        if msg_asset_id() == AssetId::base() {
            // If we received the base asset then keep track of the balance.
            // Otherwise, we're receiving other native assets and don't care
            // about our balance of coins.
            storage.balance.write(storage.balance.read() + msg_amount());
        }
    }

    #[storage(read, write)]
    fn send_funds(amount_to_send: u64, recipient_address: Address) {
        let sender = msg_sender().unwrap();
        match sender {
            Identity::Address(addr) => assert(addr == OWNER_ADDRESS),
            _ => revert(0),
        };

        let current_balance = storage.balance.read();
        assert(current_balance >= amount_to_send);

        storage.balance.write(current_balance - amount_to_send);

        // Note: `transfer()` is not a call and thus not an
        // interaction. Regardless, this code conforms to
        // checks-effects-interactions to avoid re-entrancy.
        transfer(
            Identity::Address(recipient_address),
            AssetId::base(),
            amount_to_send,
        );
    }
}
// ANCHOR_END: abi_impl
```
