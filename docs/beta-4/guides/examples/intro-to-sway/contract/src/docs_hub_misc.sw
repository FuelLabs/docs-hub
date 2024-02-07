/* ANCHOR: all */
// ANCHOR: import_single
use std::auth::msg_sender;
// ANCHOR_END: import_single

// ANCHOR: import_multi
use std::{
	auth::msg_sender,
	storage::StorageVec,
}
// ANCHOR_END: import_multi

// ANCHOR: contract_skeleton
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
// ANCHOR_END: contract_skeleton
/* ANCHOR_END: all */
