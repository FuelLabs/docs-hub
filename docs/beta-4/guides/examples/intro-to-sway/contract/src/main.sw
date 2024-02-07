/* ANCHOR: all */
// ANCHOR: contract
contract;
// ANCHOR_END: contract

// ANCHOR: import
use std::{
    auth::msg_sender,
    call_frames::msg_asset_id,
    constants::BASE_ASSET_ID,
    context::{
        msg_amount,
        this_balance,
    },
    token::transfer,
    hash::Hash
};
// ANCHOR_END: import

// ANCHOR: struct
struct Item {
    id: u64,
    price: u64,
    owner: Identity,
    metadata: str[20],
    total_bought: u64,
}
// ANCHOR_END: struct

// ANCHOR: abi
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
// ANCHOR_END: abi

// ANCHOR: storage
storage {
    // counter for total items listed
    item_counter: u64 = 0,

    // ANCHOR: storage_map
    // map of item IDs to Items
    item_map: StorageMap<u64, Item> = StorageMap {},
    // ANCHOR_END: storage_map

    // ANCHOR: storage_option
    // owner of the contract
    owner: Option<Identity> = Option::None,
    // ANCHOR_END: storage_option
}
// ANCHOR_END: storage

// ANCHOR: error_handling
enum InvalidError {
    IncorrectAssetId: AssetId,
    NotEnoughTokens: u64,
    OnlyOwner: Identity,
}
// ANCHOR_END: error_handling

impl SwayStore for Contract {
    // ANCHOR: list_item_parent
    #[storage(read, write)]
    fn list_item(price: u64, metadata: str[20]) {
        
        // ANCHOR: list_item_increment
        // increment the item counter
        storage.item_counter.write(storage.item_counter.try_read().unwrap() + 1);
        // ANCHOR_END: list_item_increment
        
        // ANCHOR: list_item_sender
        // get the message sender
        let sender = msg_sender().unwrap();
        // ANCHOR_END: list_item_sender
        
        // ANCHOR: list_item_new_item
        // configure the item
        let new_item: Item = Item {
            id: storage.item_counter.try_read().unwrap(),
            price: price,
            owner: sender,
            metadata: metadata,
            total_bought: 0,
        };
        // ANCHOR_END: list_item_new_item

        // ANCHOR: list_item_insert
        // save the new item to storage using the counter value
        storage.item_map.insert(storage.item_counter.try_read().unwrap(), new_item);
        // ANCHOR_END: list_item_insert
    }
    // ANCHOR_END: list_item_parent

    // ANCHOR: buy_item_parent
    #[storage(read, write), payable]
    fn buy_item(item_id: u64) {
        // get the asset id for the asset sent
        // ANCHOR: buy_item_asset
        let asset_id = msg_asset_id();
        // ANCHOR_END: buy_item_asset

        // require that the correct asset was sent
        // ANCHOR: buy_item_require_not_base
        require(asset_id == BASE_ASSET_ID, InvalidError::IncorrectAssetId(asset_id));
        // ANCHOR_END: buy_item_require_not_base

        // get the amount of coins sent
        // ANCHOR: buy_item_msg_amount
        let amount = msg_amount();
        // ANCHOR_END: buy_item_msg_amount

        // get the item to buy
        // ANCHOR: buy_item_get_item
        let mut item = storage.item_map.get(item_id).try_read().unwrap();
        // ANCHOR_END: buy_item_get_item

        // require that the amount is at least the price of the item
        // ANCHOR: buy_item_require_ge_amount
        require(amount >= item.price, InvalidError::NotEnoughTokens(amount));
        // ANCHOR_END: buy_item_require_ge_amount

        // ANCHOR: buy_item_require_update_storage
        // update the total amount bought
        item.total_bought += 1;

        // update the item in the storage map
        storage.item_map.insert(item_id, item);
        // ANCHOR_END: buy_item_require_update_storage

        // ANCHOR: buy_item_require_transferring_payment
        // only charge commission if price is more than 0.1 ETH
        if amount > 100_000_000 {
            // keep a 5% commission
            let commission = amount / 20;
            let new_amount = amount - commission;
            // send the payout minus commission to the seller
            transfer(item.owner, asset_id, new_amount);
        } else {
            // send the full payout to the seller
            transfer(item.owner, asset_id, amount);
        }
        // ANCHOR_END: buy_item_require_transferring_payment
    }
    // ANCHOR_END: buy_item_parent

    // ANCHOR: get_item
    #[storage(read)]
    fn get_item(item_id: u64) -> Item {
        // returns the item for the given item_id
        return storage.item_map.get(item_id).try_read().unwrap();
    }
    // ANCHOR_END: get_item

    // ANCHOR: initialize_owner_parent
    #[storage(read, write)]
    fn initialize_owner() -> Identity {
        // ANCHOR: initialize_owner_get_owner
        let owner = storage.owner.try_read().unwrap();
        
        // make sure the owner has NOT already been initialized
        require(owner.is_none(), __to_str_array("owner already initialized"));
        // ANCHOR_END: initialize_owner_get_owner
        
        // ANCHOR: initialize_owner_set_owner
        // get the identity of the sender        
        let sender = msg_sender().unwrap(); 

        // set the owner to the sender's identity
        storage.owner.write(Option::Some(sender));
        // ANCHOR_END: initialize_owner_set_owner
        
        // ANCHOR: initialize_owner_return_owner
        // return the owner
        return sender;
        // ANCHOR_END: initialize_owner_return_owner
    }
    // ANCHOR_END: initialize_owner_parent

    // ANCHOR: withdraw_funds_parent
    #[storage(read)]
    fn withdraw_funds() {
        // ANCHOR: withdraw_funds_set_owner
        let owner = storage.owner.try_read().unwrap();

        // make sure the owner has been initialized
        require(owner.is_some(), __to_str_array("owner not initialized"));
        // ANCHOR_END: withdraw_funds_set_owner
        
        // ANCHOR: withdraw_funds_require_owner
        let sender = msg_sender().unwrap(); 

        // require the sender to be the owner
        require(sender == owner.unwrap(), InvalidError::OnlyOwner(sender));
        // ANCHOR_END: withdraw_funds_require_owner
        
        // ANCHOR: withdraw_funds_require_base_asset
        // get the current balance of this contract for the base asset
        let amount = this_balance(BASE_ASSET_ID);

        // require the contract balance to be more than 0
        require(amount > 0, InvalidError::NotEnoughTokens(amount));
        // ANCHOR_END: withdraw_funds_require_base_asset
        
        // ANCHOR: withdraw_funds_transfer_owner
        // send the amount to the owner
        transfer(owner.unwrap(), BASE_ASSET_ID, amount);
        // ANCHOR_END: withdraw_funds_transfer_owner
    }
    // ANCHOR_END: withdraw_funds_parent

    // ANCHOR: get_count_parent
    #[storage(read)]
    fn get_count() -> u64 {
        return storage.item_counter.try_read().unwrap();
    }
    // ANCHOR_END: get_count_parent
}
/* ANCHOR_END: all */
