contract;

abi MyContract {
    #[storage(write)]
    fn unlock(password: b256);

    #[storage(read)]
    fn attack_success() -> bool;
}

storage {
    locked: bool = true,
}

configurable {
    PASSWORD: b256 = 0x0000000000000000000000000000000000000000000000000000000000000000,
}

enum Error {
    PasswordNotSet: (),
    WrongPassword: (),
}

impl MyContract for Contract {
    #[storage(write)]
    fn unlock(password: b256) {
        require(
            PASSWORD != 0x0000000000000000000000000000000000000000000000000000000000000000,
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
