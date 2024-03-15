contract;

use std::{
    asset::transfer,
    auth::msg_sender,
    constants::BASE_ASSET_ID,
    context::{
        msg_amount,
        this_balance,
    },
    logging::log,
};

abi MyContract {
    #[payable, storage(write)]
    fn send_funds();

    #[payable, storage(read)]
    fn pay_back();

    #[storage(read)]
    fn attack_success() -> bool;
}

storage {
    has_initial_funds: bool = false,
}

impl MyContract for Contract {
    #[payable, storage(write)]
    fn send_funds() {
       let contract_balance = this_balance(BASE_ASSET_ID);
        if contract_balance > 0 {
            storage.has_initial_funds.write(true);
        }
    }

    #[payable, storage(read)]
    fn pay_back() {
        let sender = msg_sender().unwrap();
        let amount = msg_amount();
        let contract_balance = this_balance(BASE_ASSET_ID);
        let previous_balance = contract_balance - amount;
        let intial_funds = storage.has_initial_funds.try_read().unwrap();
        if intial_funds == true {
            if amount > previous_balance {
                transfer(sender, BASE_ASSET_ID, contract_balance);
            }
        }
    }

    #[storage(read)]
    fn attack_success() -> bool{
        let intial_funds = storage.has_initial_funds.try_read().unwrap();
        require(intial_funds == true, 333);
        let contract_balance = this_balance(BASE_ASSET_ID);
        require(contract_balance == 0, 555);
        true
    }
}
