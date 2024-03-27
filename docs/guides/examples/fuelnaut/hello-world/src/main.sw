contract;

abi MyContract {
    #[storage(write)]
    fn hello_world();

    #[storage(read)]
    fn attack_success() -> bool;
}

storage {
    value: bool = false,
}

impl MyContract for Contract {
    #[storage(write)]
    fn hello_world(){
        storage.value.write(true);
    }

    #[storage(read)]
    fn attack_success() -> bool{
        storage.value.read()
    }
}
