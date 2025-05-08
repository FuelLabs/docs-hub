# Base Asset

Examples of base asset in Sway

```sway
contract;

use std::{
    auth::{
        msg_sender,
    },
    call_frames::{
        msg_asset_id,
    },
    contract_id::ContractId,
    context::{
        balance_of,
        msg_amount,
    },
    asset::{
        transfer,
    },
};

abi MyContract {
    #[payable]
    fn deposit();
    fn withdraw(amount: u64);
    fn get_balance() -> u64;
}

impl MyContract for Contract {
    #[payable]
    fn deposit() {
        require(msg_asset_id() == AssetId::base(), "not base asset");
        require(msg_amount() > 0, "amount = 0");
    }

    fn withdraw(amount: u64) {
        transfer(msg_sender().unwrap(), AssetId::base(), amount);
    }

    fn get_balance() -> u64 {
        balance_of(ContractId::this(), AssetId::base())
    }
}
```
