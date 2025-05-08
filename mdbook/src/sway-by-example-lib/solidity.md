# Solidity

A quick `Solidity` → `Sway` cross reference for the most commonly used items

- block.timestamp
- msg.sender
- etc

If something is missing here you can most likely find it in the Sway STD Library

```sway
contract;

use std::{
    identity::Identity,
    block::{ height, timestamp },
    auth::msg_sender,
    hash::*,
    constants::*,
};

abi SolidityCheatsheet {
    fn get_blocknumber() -> u32;
    fn get_blocktime() -> u64;
    fn get_msg_sender() -> Identity;
    fn get_bytes32() -> b256;
    fn get_hash() -> b256;
    fn get_u256_number() -> u256;
}

impl SolidityCheatsheet for Contract {
    fn get_blocknumber() -> u32 {
        return height(); // block.number equivalent
    }
    
    fn get_blocktime() -> u64 {
        return timestamp(); // block.timestamp equivalent
    }
    
    fn get_msg_sender() -> Identity {
        return msg_sender().unwrap(); // msg.sender equivalent
    }
    
    fn get_bytes32() -> b256 {
        return 45.as_u256().as_b256(); // u64 to u256 to b256
    }
    
    fn get_hash() -> b256 {
        return sha256("Sway is the way"); // hashing of fixed size string
    }

    fn get_u256_number() -> u256 {
        return u256::from((u64::min(), u64::min(), u64::min(), u64::min())); // big number equivalent
    }
}
```
