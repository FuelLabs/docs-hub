library;

pub enum State {
    Uninitialized: (),
    Initialized: Identity,
    Revoked: (),
}

abi Fuelnaut
 {
    fn get_bytecode_root(id: ContractId) -> b256;

    #[storage(read, write)]
    fn register_level(bytecode_root: b256) -> u64;

    #[storage(read, write)]
    fn create_instance(instance: ContractId, level_id: u64);

    #[storage(read, write)]
    fn create_instance_with_configurables(
        instance: ContractId,
        level_id: u64,
        bytecode_input: Vec<u8>,
        configurables: Vec<(u64, Vec<u8>)>
    );

    // #[storage(write)]
    fn verify_instance_with_configurables(bytecode_input: Vec<u8>, configurables: Vec<(u64, Vec<u8>)>);

    #[storage(read, write)]
    fn complete_instance(address: Address, level_id: u64);

    #[storage(read)]
    fn get_level(index: u64) -> b256;

    #[storage(read)]
    fn get_instance_contract(address: Address, instance_id: u64) -> (ContractId, bool);

    #[storage(read)]
    fn get_total_number_of_levels() -> u64;

    #[storage(read)]
    fn get_all_levels_status(address: Address) -> Vec<Option<bool>>;

    #[storage(read)]
    fn owner() -> State;

    #[storage(read, write)]
    fn my_constructor();

    #[storage(read, write)]
    fn transfer_contract_ownership(new_owner: Identity);

    fn verify_bytecode_test(bytecode_input: Vec<u8>);
}
