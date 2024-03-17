contract;

mod fuelnaut;

use std::{
    call_frames::contract_id,
    constants::ZERO_B256,
    external::bytecode_root,
    hash::Hash,
    storage::storage_vec::*,
};
use fuelnaut::*;
use src5::{State};
use ownership::*;
use bytecode::*;

storage {
    owner: State = State::Uninitialized,
    /// vector of all of the registered levels
    registered_levels: StorageVec<b256> = StorageVec {},
    /// mapping of all of the level instances and if they have been completed (ContractId, bool) to their respective player addresses + the index of the level in registered_levels (Address, u64)
    instances: StorageMap<(Address, u64), (ContractId, bool)> = StorageMap::<(Address, u64), (ContractId, bool)> {},
    verified_configurable_instances: StorageMap<ContractId, bool> = StorageMap::<ContractId, bool> {},
}

enum Error {
    InvalidBytecodeRoot: (),
    HasNotCompletedLevel: (),
}

abi ContractInstance {
	#[storage(read)]
    fn attack_success() -> bool;
}

fn check_success(instance_id: b256) -> bool {
    let x = abi(ContractInstance, instance_id);
    x.attack_success()
}

impl Fuelnaut for Contract {
    fn get_bytecode_root(id: ContractId) -> b256 {
        let root_contract = bytecode_root(id);
        root_contract
    }

    /// this function registers a challenge level of the fuelnaut game
    /// it takes a ContractId of the level to register
    /// and returns the index where the level is stored in the registered_levels vector
    #[storage(read, write)]
    fn register_level(bytecode_root: b256) -> u64 {
        only_owner();
        // Only the contract's owner may reach this line.
        storage.registered_levels.push(bytecode_root);
        storage.registered_levels.len() - 1
    }

    /// this function takes the ContractId of a newly deployed instance
    /// and registers the instance to the sender's player
    /// if there is no player for the sender, it creates a new player
    /// if the sender is a contract, it reverts
    /// the ContractId of the instance is verified to match the registered level bytecode
    #[storage(read, write)]
    fn create_instance(instance: ContractId, level_id: u64) {
        let sender = msg_sender().unwrap();
        if let Identity::Address(address) = sender {
            // verify the contractId of the instance matches the registered level bytecode
            let registered_bytecode_root = storage.registered_levels.get(level_id).unwrap().read();
            let instance_root = bytecode_root(instance);
            require(registered_bytecode_root == instance_root, Error::InvalidBytecodeRoot);
           
            // store the instance
            storage.instances.insert((address, level_id), (instance, false));
        } else {
            revert(0);
        }
    }

    #[storage(read, write)]
    fn create_instance_with_configurables(instance: ContractId, level_id: u64, bytecode_input: Vec<u8>, configurables: Vec<(u64, Vec<u8>)>) {
        let sender = msg_sender().unwrap();
        if let Identity::Address(address) = sender {
            let registered_bytecode_root = storage.registered_levels.get(level_id).unwrap().read();
            let mut bytecode = bytecode_input;

            // VERIFY THE INTANCE CONTRACT ID MATCHES THE BYTECODE & CONFIGURABLES
            verify_contract_bytecode_with_configurables(instance, bytecode, configurables);

            // // VERIFY BYTECODE ROOT MATCHES THE REGISTERED LEVEL
            let computed_root = compute_bytecode_root(bytecode_input);
            require(registered_bytecode_root == computed_root, Error::InvalidBytecodeRoot);
           
            // store the instance
            storage.instances.insert((address, level_id), (instance, false));
        } else {
            revert(0);
        }
    }

    // #[storage(write)]
    fn verify_instance_with_configurables(bytecode_input: Vec<u8>, configurables: Vec<(u64, Vec<u8>)>) {
        let mut bytecode = bytecode_input;
            // GET BYTECODE ROOT WITH CONFIGURABLES
            let root = compute_bytecode_root_with_configurables(bytecode, configurables);
    }

    #[storage(read, write)]
    fn complete_instance(address: Address, level_id: u64){
        let (instance, _completed) = storage.instances.get((address, level_id)).try_read().unwrap();
        let instance_b256: b256 = instance.into();
        let has_completed = check_success(instance_b256);
        require(has_completed, Error::HasNotCompletedLevel);
        storage.instances.insert((address, level_id), (instance, true));
    }

    #[storage(read)]
    fn get_level(index: u64) -> b256 {
        storage.registered_levels.get(index).unwrap().read()
    }

    #[storage(read)]
    fn get_instance_contract(address: Address, instance_id: u64) -> (ContractId, bool) {
        storage.instances.get((address, instance_id)).try_read().unwrap()
    }

    #[storage(read)]
    fn get_total_number_of_levels() -> u64{
        storage.registered_levels.len()
    }

    /// returns a vector of bool options representing the statuses of each level
    /// if the option is None, the level has not been started
    /// if the option is Some(true), the level has been completed
   /// if the option is Some(false), the level has been started but not completed
    #[storage(read)]
    fn get_all_levels_status(address: Address) -> Vec<Option<bool>>{
        let number_of_levels = storage.registered_levels.len();
        let mut counter = 0;
        let mut level_statuses = Vec::new();

        while counter < number_of_levels {
            let instance_result = storage.instances.get((address, counter)).try_read();
            if instance_result.is_some() {
                let (_instance, completed) = instance_result.unwrap();
                if completed {
                    level_statuses.push(Option::Some(true));
                } else {
                    level_statuses.push(Option::Some(false));
                }
            } else {
                level_statuses.push(Option::None);
            }
            counter = counter + 1;
        }

        level_statuses
    }

    #[storage(read)]
    fn owner() -> State {
        storage.owner.read()
    }

    #[storage(read, write)]
    fn my_constructor() {
        let sender = msg_sender().unwrap();
       match sender {
			Identity::Address => initialize_ownership(sender),
			_ => revert(222),
		};
    }

    #[storage(read, write)]
    fn transfer_contract_ownership(new_owner: Identity) {
        transfer_ownership(new_owner);
    }
}
