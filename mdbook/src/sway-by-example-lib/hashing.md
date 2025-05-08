# Hashing with Keccak256

Example of how to compute hash in Sway using Keccak256

```sway
contract;

use std::hash::*;
use std::bytes::Bytes;

abi HashFunction {
    fn hash(_text: str, _num: u64, _addr: b256) -> b256;
    fn collision(_text: str, _anotherText: str) -> b256;
    fn guess(_word: str) -> bool;
}

impl HashFunction for Contract {
    fn hash(_text: str, _num: u64, _addr: b256) -> b256 {
        keccak256({
            let mut bytes = Bytes::new();
            bytes.append(Bytes::from(core::codec::encode(_text)));
            bytes.append(Bytes::from(core::codec::encode(_num)));
            bytes.append(Bytes::from(core::codec::encode(_addr)));
            bytes
        })
    }

    // The collision function is not strictly necessary unless you have a specific use case that requires hashing two strings together. 
    // If your primary goal is to hash individual strings you can remove the collision function.
    fn collision(_text: str, _anotherText: str) -> b256 {
        keccak256({
            let mut bytes = Bytes::new();
            bytes.append(Bytes::from(core::codec::encode(_text)));
            bytes.append(Bytes::from(core::codec::encode(_anotherText)));
            bytes
        })
    }

    fn guess(_word: str) -> bool {
        let answer: b256 = 0x60298f78cc0b47170ba79c10aa3851d7648bd96f2f8e46a19dbc777c36fb0c00;
        keccak256({
            let mut bytes = Bytes::new();
            bytes.append(Bytes::from(core::codec::encode(_word)));
            bytes
        }) == answer
    }
}
```
