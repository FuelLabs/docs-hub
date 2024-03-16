contract;

abi MyContract {
    #[storage(write)]
    fn unlock(password: u64);

    #[storage(read)]
    fn attack_success() -> bool;
}

storage {
    locked: bool = true,
}

configurable {
    PASSWORD: u64 = 0,
}

enum Error {
    PasswordNotSet: (),
    WrongPassword: (),
}

impl MyContract for Contract {
    #[storage(write)]
    fn unlock(password: u64) {
        require(
            PASSWORD != 0,
            Error::PasswordNotSet,
        );
        require(PASSWORD == password, Error::WrongPassword);
        storage.locked.write(false);
    }

    #[storage(read)]
    fn attack_success() -> bool {
        let locked = storage.locked.read();
        require(locked == false, 333);
        true
    }
}
