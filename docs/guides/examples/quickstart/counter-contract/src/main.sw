/* ANCHOR: all */
// ANCHOR: contract
contract;
// ANCHOR_END: contract

// ANCHOR: storage
storage {
    counter: u64 = 0,
}
// ANCHOR_END: storage

// ANCHOR: abi
abi Counter {
    #[storage(read, write)]
    fn increment();

    #[storage(read)]
    fn count() -> u64;
}
// ANCHOR_END: abi

// ANCHOR: counter-contract
impl Counter for Contract {
    #[storage(read)]
    // ANCHOR: count
    fn count() -> u64 {
        storage.counter.read()
    }
    // ANCHOR_END: count

    #[storage(read, write)]
    // ANCHOR: increment
    fn increment() {
        let incremented = storage.counter.read() + 1;
        storage.counter.write(incremented);
    }
    // ANCHOR_END: increment
}
// ANCHOR_END: counter-contract
/* ANCHOR_END: all */