# Verifying Signatures in Sway

Example of how to verify signatures in Sway

```sway
contract;

use std::hash::*;
use std::ecr::{ec_recover_address, EcRecoverError};
use std::bytes::Bytes;
use std::b512::B512;
use std::constants::ZERO_B256;

abi VerifySignature {
    fn GetMessageHash(to: b256, amount: u64, message: str, nonce: u64) -> b256;
    fn GetEthSignedMessageHash(message_hash: b256) -> b256;
    fn RecoverSigner(eth_signed_message_hash: b256, signature: B512) -> b256;
    fn verify(signer: b256, to: b256, amount: u64, message: str, nonce: u64, signature: B512) -> bool;
    
}

fn GetMessageHash(to: b256, amount: u64, message: str, nonce: u64) -> b256 {
        keccak256({
        let mut bytes = Bytes::new();
        bytes.append(Bytes::from(core::codec::encode(to)));
        bytes.append(Bytes::from(core::codec::encode(amount)));
        bytes.append(Bytes::from(core::codec::encode(message)));
        bytes.append(Bytes::from(core::codec::encode(nonce)));
        bytes
    })
    }

    fn GetEthSignedMessageHash(message_hash: b256) -> b256 {
        keccak256({
        let mut bytes = Bytes::new();
        bytes.append(Bytes::from(core::codec::encode("\x19Fuel Signed Message:\n32")));
        bytes.append(Bytes::from(core::codec::encode(message_hash)));
        bytes
    })
    }

    fn RecoverSigner(eth_signed_message_hash: b256, signature: B512) -> b256 {
        match ec_recover_address(signature, eth_signed_message_hash) {
            Ok(address) => address.bits(),
            Err(_) => ZERO_B256,
        }
    }

impl VerifySignature for Contract {


    fn GetMessageHash(to: b256, amount: u64, message: str, nonce: u64) -> b256{
        ::GetMessageHash(to, amount, message, nonce)
    }

    fn GetEthSignedMessageHash(message_hash: b256) -> b256 {
        ::GetEthSignedMessageHash(message_hash)
    }

    fn RecoverSigner(eth_signed_message_hash: b256, signature: B512) -> b256{
        ::RecoverSigner(eth_signed_message_hash, signature)
    }
    
   fn verify(signer: b256, to: b256, amount: u64, message: str, nonce: u64, signature: B512) -> bool {   
        let MessageHash = GetMessageHash(to, amount, message, nonce);
        let EthSignedMessage = GetEthSignedMessageHash(MessageHash);
        let RecoverSigner = RecoverSigner(EthSignedMessage, signature);
        RecoverSigner == signer
    }
}
```
