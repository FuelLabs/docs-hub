contract;

use std::{
    block::{
    height,
    block_header_hash,
    },
};

abi MyContract {
    #[storage(read, write)]
    fn coin_flip(guess: bool) -> bool;

    #[storage(read)]
    fn attack_success() -> bool;
}

storage {
    consecutive_wins: u32 = 0,
    last_height: u32 = 0,
}

const FACTOR: u32 = 64943452;

enum Error {
    SameBlock: (),
    HasNotWon: u32,
}

impl MyContract for Contract {
    #[storage(read, write)]
    fn coin_flip(guess: bool) -> bool {
        let current_height = height();
        let last_height = storage.last_height.read();
        if last_height != 0 {
            require(last_height != current_height, Error::SameBlock);
        }
        log(current_height);

        storage.last_height.write(current_height);
        let coin_flip = current_height * FACTOR;
         log(coin_flip);
        let result = coin_flip % 3;
         log(result);
        let side = if result == 1 { true } else { false };

        if side == guess {
            let incremented = storage.consecutive_wins.read() + 1;
            storage.consecutive_wins.write(incremented);
            return true;
        } else {
            storage.consecutive_wins.write(0);
            return false;
        }
    }

    #[storage(read)]
    fn attack_success() -> bool{
        let consecutive_wins = storage.consecutive_wins.read();
        require(consecutive_wins > 9, Error::HasNotWon(consecutive_wins));
        true
    }
}
