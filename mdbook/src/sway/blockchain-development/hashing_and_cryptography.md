# Hashing and Cryptography

The Sway standard library provides easy access to a selection of cryptographic hash functions (`sha256` and EVM-compatible `keccak256`), and EVM-compatible `secp256k1`-based signature recovery operations.

## Hashing

```sway
```sway\nscript;

use std::hash::*;

impl Hash for Location {
    fn hash(self, ref mut state: Hasher) {
        match self {
            Location::Earth => {
                0_u8.hash(state);
            }
            Location::Mars => {
                1_u8.hash(state);
            }
        }
    }
}

impl Hash for Stats {
    fn hash(self, ref mut state: Hasher) {
        self.strength.hash(state);
        self.agility.hash(state);
    }
}

impl Hash for Person {
    fn hash(self, ref mut state: Hasher) {
        self.name.hash(state);
        self.age.hash(state);
        self.alive.hash(state);
        self.location.hash(state);
        self.stats.hash(state);
        self.some_tuple.hash(state);
        self.some_array.hash(state);
        self.some_b256.hash(state);
    }
}

const VALUE_A = 0x9280359a3b96819889d30614068715d634ad0cf9bba70c0f430a8c201138f79f;

enum Location {
    Earth: (),
    Mars: (),
}

struct Person {
    name: str,
    age: u64,
    alive: bool,
    location: Location,
    stats: Stats,
    some_tuple: (bool, u64),
    some_array: [u64; 2],
    some_b256: b256,
}

struct Stats {
    strength: u64,
    agility: u64,
}

fn main() {
    let zero = b256::min();
    // Use the generic sha256 to hash some integers
    let sha_hashed_u8 = sha256(u8::max());
    let sha_hashed_u16 = sha256(u16::max());
    let sha_hashed_u32 = sha256(u32::max());
    let sha_hashed_u64 = sha256(u64::max());

    // Or hash a b256
    let sha_hashed_b256 = sha256(VALUE_A);

    // You can hash booleans too
    let sha_hashed_bool = sha256(true);

    // Strings are not a problem either
    let sha_hashed_str = sha256("Fastest Modular Execution Layer!");

    // Tuples of any size work too
    let sha_hashed_tuple = sha256((true, 7));

    // As do arrays
    let sha_hashed_array = sha256([4, 5, 6]);

    // Enums work too
    let sha_hashed_enum = sha256(Location::Earth);

    // Complex structs are not a problem
    let sha_hashed_struct = sha256(Person {
        name: "John",
        age: 9000,
        alive: true,
        location: Location::Mars,
        stats: Stats {
            strength: 10,
            agility: 9,
        },
        some_tuple: (true, 8),
        some_array: [17, 76],
        some_b256: zero,
    });

    log(sha_hashed_u8);
    log(sha_hashed_u16);
    log(sha_hashed_u32);
    log(sha_hashed_u64);
    log(sha_hashed_b256);
    log(sha_hashed_bool);
    log(sha_hashed_str);
    log(sha_hashed_tuple);
    log(sha_hashed_array);
    log(sha_hashed_enum);
    log(sha_hashed_struct);

    // Use the generic keccak256 to hash some integers
    let keccak_hashed_u8 = keccak256(u8::max());
    let keccak_hashed_u16 = keccak256(u16::max());
    let keccak_hashed_u32 = keccak256(u32::max());
    let keccak_hashed_u64 = keccak256(u64::max());

    // Or hash a b256
    let keccak_hashed_b256 = keccak256(VALUE_A);

    // You can hash booleans too
    let keccak_hashed_bool = keccak256(true);

    // Strings are not a problem either
    let keccak_hashed_str = keccak256("Fastest Modular Execution Layer!");

    // Tuples of any size work too
    let keccak_hashed_tuple = keccak256((true, 7));

    // As do arrays
    let keccak_hashed_array = keccak256([4, 5, 6]);

    // Enums work too
    let keccak_hashed_enum = keccak256(Location::Earth);

    // Complex structs are not a problem
    let keccak_hashed_struct = keccak256(Person {
        name: "John",
        age: 9000,
        alive: true,
        location: Location::Mars,
        stats: Stats {
            strength: 10,
            agility: 9,
        },
        some_tuple: (true, 8),
        some_array: [17, 76],
        some_b256: zero,
    });

    log(keccak_hashed_u8);
    log(keccak_hashed_u16);
    log(keccak_hashed_u32);
    log(keccak_hashed_u64);
    log(keccak_hashed_b256);
    log(keccak_hashed_bool);
    log(keccak_hashed_str);
    log(keccak_hashed_tuple);
    log(keccak_hashed_array);
    log(keccak_hashed_enum);
    log(keccak_hashed_struct);
}\n```
```

## Cryptographic Signature Recovery and Verification

Fuel supports 3 asymmetric cryptographic signature schemes; `Secp256k1`, `Secp256r1`, and `Ed25519`.

### Public Key Recovery

Given a `Signature` and a sign `Message`, you can recover a `PublicKey`.

```sway
```sway\nscript;

fn main() {}

use std::{
    crypto::{
        ed25519::*,
        message::*,
        public_key::*,
        secp256k1::*,
        secp256r1::*,
        signature::*,
    },
    hash::{
        Hash,
        sha256,
    },
    vm::evm::evm_address::EvmAddress,
};

fn public_key_recovery() {
    // ANCHOR: public_key_recovery
    // Secp256rk1 Public Key Recovery
    let secp256k1_signature: Signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered public key pair.
    let secp256k1_public_key = secp256k1_signature.recover(signed_message);
    assert(secp256k1_public_key.is_ok());
    assert(
        secp256k1_public_key
            .unwrap() == PublicKey::from((
            0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
            0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
        )),
    );

    // Secp256r1 Public Key Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A recovered public key pair.
    let secp256r1_public_key = secp256r1_signature.recover(signed_message);
    assert(secp256r1_public_key.is_ok());
    assert(
        secp256r1_public_key
            .unwrap() == PublicKey::from((
            0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
            0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
        )),
    );
    // ANCHOR_END: public_key_recovery
}

fn address_recovery() {
    // ANCHOR: address_recovery
    // Secp256k1 Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered Fuel address.
    let secp256k1_address = secp256k1_signature.address(signed_message);
    assert(secp256k1_address.is_ok());
    assert(
        secp256k1_address
            .unwrap() == Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881),
    );

    // Secp256r1 Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered Fuel address.
    let secp256r1_address = secp256r1_signature.address(signed_message);
    assert(secp256r1_address.is_ok());
    assert(
        secp256r1_address
            .unwrap() == Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a),
    );

    // ANCHOR_END: address_recovery
}

fn evm_address_recovery() {
    // ANCHOR: evm_address_recovery
    // Secp256k1 EVM Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_evm_address = secp256k1_signature.evm_address(signed_message);
    assert(secp256k1_evm_address.is_ok());
    assert(
        secp256k1_evm_address
            .unwrap() == EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb),
    );

    // Secp256r1 EVM Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_evm_address = secp256r1_signature.evm_address(signed_message);
    assert(secp256r1_evm_address.is_ok());
    assert(
        secp256r1_evm_address
            .unwrap() == EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a),
    );
    // ANCHOR_END: evm_address_recovery
}

fn signature_verification() {
    // ANCHOR: signature_verification
    // Secp256k1 Signature Verification
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let secp256k1_public_key = PublicKey::from((
        0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
        0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified public key
    let secp256k1_verified = secp256k1_signature.verify(secp256k1_public_key, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Signature Verification
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let secp256r1_public_key = PublicKey::from((
        0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
        0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
    ));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A verified public key 
    let secp256r1_verified = secp256r1_signature.verify(secp256r1_public_key, signed_message);
    assert(secp256r1_verified.is_ok());

    // Ed25519 Signature Verification
    let ed25519_public_key = PublicKey::from(0x314fa58689bbe1da2430517de2d772b384a1c1d2e9cb87e73c6afcf246045b10);
    let ed25519_signature = Signature::Ed25519(Ed25519::from((
        0xf38cef9361894be6c6e0eddec28a663d099d7ddff17c8077a1447d7ecb4e6545,
        0xf5084560039486d3462dd65a40c80a74709b2f06d450ffc5dc00345c6b2cdd00,
    )));
    let hashed_message = Message::from(sha256(b256::zero()));
    // A verified public key  
    let ed25519_verified = ed25519_signature.verify(ed25519_public_key, hashed_message);
    assert(ed25519_verified.is_ok());
    // ANCHOR_END: signature_verification
}

fn address_verification() {
    // ANCHOR: address_verification
    // Secp256k1 Address Verification
    let secp256k1_address = Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881);
    let secp256k1_signature = Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified address
    let secp256k1_verified = secp256k1_signature.verify_address(secp256k1_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_address = Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A verified address
    let secp256r1_verified = secp256r1_signature.verify_address(secp256r1_address, signed_message);
    assert(secp256r1_verified.is_ok());

    // ANCHOR_END: address_verification
}

fn evm_address_verification() {
    // ANCHOR: evm_address_verification
    // Secp256k1 Address Verification
    let secp256k1_evm_address = EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb);
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_verified = secp256k1_signature.verify_evm_address(secp256k1_evm_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_evm_address = EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_verified = secp256r1_signature.verify_evm_address(secp256r1_evm_address, signed_message);
    assert(secp256r1_verified.is_ok());
    // ANCHOR_END: evm_address_verification
}\n```
```

### Signed Message Address Recovery

Given a `Signature` and signed `Message`, you can recover a Fuel `Address`.

```sway
```sway\nscript;

fn main() {}

use std::{
    crypto::{
        ed25519::*,
        message::*,
        public_key::*,
        secp256k1::*,
        secp256r1::*,
        signature::*,
    },
    hash::{
        Hash,
        sha256,
    },
    vm::evm::evm_address::EvmAddress,
};

fn public_key_recovery() {
    // ANCHOR: public_key_recovery
    // Secp256rk1 Public Key Recovery
    let secp256k1_signature: Signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered public key pair.
    let secp256k1_public_key = secp256k1_signature.recover(signed_message);
    assert(secp256k1_public_key.is_ok());
    assert(
        secp256k1_public_key
            .unwrap() == PublicKey::from((
            0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
            0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
        )),
    );

    // Secp256r1 Public Key Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A recovered public key pair.
    let secp256r1_public_key = secp256r1_signature.recover(signed_message);
    assert(secp256r1_public_key.is_ok());
    assert(
        secp256r1_public_key
            .unwrap() == PublicKey::from((
            0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
            0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
        )),
    );
    // ANCHOR_END: public_key_recovery
}

fn address_recovery() {
    // ANCHOR: address_recovery
    // Secp256k1 Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered Fuel address.
    let secp256k1_address = secp256k1_signature.address(signed_message);
    assert(secp256k1_address.is_ok());
    assert(
        secp256k1_address
            .unwrap() == Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881),
    );

    // Secp256r1 Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered Fuel address.
    let secp256r1_address = secp256r1_signature.address(signed_message);
    assert(secp256r1_address.is_ok());
    assert(
        secp256r1_address
            .unwrap() == Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a),
    );

    // ANCHOR_END: address_recovery
}

fn evm_address_recovery() {
    // ANCHOR: evm_address_recovery
    // Secp256k1 EVM Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_evm_address = secp256k1_signature.evm_address(signed_message);
    assert(secp256k1_evm_address.is_ok());
    assert(
        secp256k1_evm_address
            .unwrap() == EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb),
    );

    // Secp256r1 EVM Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_evm_address = secp256r1_signature.evm_address(signed_message);
    assert(secp256r1_evm_address.is_ok());
    assert(
        secp256r1_evm_address
            .unwrap() == EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a),
    );
    // ANCHOR_END: evm_address_recovery
}

fn signature_verification() {
    // ANCHOR: signature_verification
    // Secp256k1 Signature Verification
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let secp256k1_public_key = PublicKey::from((
        0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
        0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified public key
    let secp256k1_verified = secp256k1_signature.verify(secp256k1_public_key, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Signature Verification
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let secp256r1_public_key = PublicKey::from((
        0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
        0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
    ));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A verified public key 
    let secp256r1_verified = secp256r1_signature.verify(secp256r1_public_key, signed_message);
    assert(secp256r1_verified.is_ok());

    // Ed25519 Signature Verification
    let ed25519_public_key = PublicKey::from(0x314fa58689bbe1da2430517de2d772b384a1c1d2e9cb87e73c6afcf246045b10);
    let ed25519_signature = Signature::Ed25519(Ed25519::from((
        0xf38cef9361894be6c6e0eddec28a663d099d7ddff17c8077a1447d7ecb4e6545,
        0xf5084560039486d3462dd65a40c80a74709b2f06d450ffc5dc00345c6b2cdd00,
    )));
    let hashed_message = Message::from(sha256(b256::zero()));
    // A verified public key  
    let ed25519_verified = ed25519_signature.verify(ed25519_public_key, hashed_message);
    assert(ed25519_verified.is_ok());
    // ANCHOR_END: signature_verification
}

fn address_verification() {
    // ANCHOR: address_verification
    // Secp256k1 Address Verification
    let secp256k1_address = Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881);
    let secp256k1_signature = Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified address
    let secp256k1_verified = secp256k1_signature.verify_address(secp256k1_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_address = Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A verified address
    let secp256r1_verified = secp256r1_signature.verify_address(secp256r1_address, signed_message);
    assert(secp256r1_verified.is_ok());

    // ANCHOR_END: address_verification
}

fn evm_address_verification() {
    // ANCHOR: evm_address_verification
    // Secp256k1 Address Verification
    let secp256k1_evm_address = EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb);
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_verified = secp256k1_signature.verify_evm_address(secp256k1_evm_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_evm_address = EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_verified = secp256r1_signature.verify_evm_address(secp256r1_evm_address, signed_message);
    assert(secp256r1_verified.is_ok());
    // ANCHOR_END: evm_address_verification
}\n```
```

#### Signed Message EVM Address Recovery

Recovery of EVM addresses is also supported.

```sway
```sway\nscript;

fn main() {}

use std::{
    crypto::{
        ed25519::*,
        message::*,
        public_key::*,
        secp256k1::*,
        secp256r1::*,
        signature::*,
    },
    hash::{
        Hash,
        sha256,
    },
    vm::evm::evm_address::EvmAddress,
};

fn public_key_recovery() {
    // ANCHOR: public_key_recovery
    // Secp256rk1 Public Key Recovery
    let secp256k1_signature: Signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered public key pair.
    let secp256k1_public_key = secp256k1_signature.recover(signed_message);
    assert(secp256k1_public_key.is_ok());
    assert(
        secp256k1_public_key
            .unwrap() == PublicKey::from((
            0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
            0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
        )),
    );

    // Secp256r1 Public Key Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A recovered public key pair.
    let secp256r1_public_key = secp256r1_signature.recover(signed_message);
    assert(secp256r1_public_key.is_ok());
    assert(
        secp256r1_public_key
            .unwrap() == PublicKey::from((
            0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
            0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
        )),
    );
    // ANCHOR_END: public_key_recovery
}

fn address_recovery() {
    // ANCHOR: address_recovery
    // Secp256k1 Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered Fuel address.
    let secp256k1_address = secp256k1_signature.address(signed_message);
    assert(secp256k1_address.is_ok());
    assert(
        secp256k1_address
            .unwrap() == Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881),
    );

    // Secp256r1 Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered Fuel address.
    let secp256r1_address = secp256r1_signature.address(signed_message);
    assert(secp256r1_address.is_ok());
    assert(
        secp256r1_address
            .unwrap() == Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a),
    );

    // ANCHOR_END: address_recovery
}

fn evm_address_recovery() {
    // ANCHOR: evm_address_recovery
    // Secp256k1 EVM Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_evm_address = secp256k1_signature.evm_address(signed_message);
    assert(secp256k1_evm_address.is_ok());
    assert(
        secp256k1_evm_address
            .unwrap() == EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb),
    );

    // Secp256r1 EVM Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_evm_address = secp256r1_signature.evm_address(signed_message);
    assert(secp256r1_evm_address.is_ok());
    assert(
        secp256r1_evm_address
            .unwrap() == EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a),
    );
    // ANCHOR_END: evm_address_recovery
}

fn signature_verification() {
    // ANCHOR: signature_verification
    // Secp256k1 Signature Verification
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let secp256k1_public_key = PublicKey::from((
        0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
        0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified public key
    let secp256k1_verified = secp256k1_signature.verify(secp256k1_public_key, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Signature Verification
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let secp256r1_public_key = PublicKey::from((
        0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
        0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
    ));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A verified public key 
    let secp256r1_verified = secp256r1_signature.verify(secp256r1_public_key, signed_message);
    assert(secp256r1_verified.is_ok());

    // Ed25519 Signature Verification
    let ed25519_public_key = PublicKey::from(0x314fa58689bbe1da2430517de2d772b384a1c1d2e9cb87e73c6afcf246045b10);
    let ed25519_signature = Signature::Ed25519(Ed25519::from((
        0xf38cef9361894be6c6e0eddec28a663d099d7ddff17c8077a1447d7ecb4e6545,
        0xf5084560039486d3462dd65a40c80a74709b2f06d450ffc5dc00345c6b2cdd00,
    )));
    let hashed_message = Message::from(sha256(b256::zero()));
    // A verified public key  
    let ed25519_verified = ed25519_signature.verify(ed25519_public_key, hashed_message);
    assert(ed25519_verified.is_ok());
    // ANCHOR_END: signature_verification
}

fn address_verification() {
    // ANCHOR: address_verification
    // Secp256k1 Address Verification
    let secp256k1_address = Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881);
    let secp256k1_signature = Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified address
    let secp256k1_verified = secp256k1_signature.verify_address(secp256k1_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_address = Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A verified address
    let secp256r1_verified = secp256r1_signature.verify_address(secp256r1_address, signed_message);
    assert(secp256r1_verified.is_ok());

    // ANCHOR_END: address_verification
}

fn evm_address_verification() {
    // ANCHOR: evm_address_verification
    // Secp256k1 Address Verification
    let secp256k1_evm_address = EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb);
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_verified = secp256k1_signature.verify_evm_address(secp256k1_evm_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_evm_address = EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_verified = secp256r1_signature.verify_evm_address(secp256r1_evm_address, signed_message);
    assert(secp256r1_verified.is_ok());
    // ANCHOR_END: evm_address_verification
}\n```
```

### Public Key Signature Verification

Given a `Signature`, `PublicKey`, and `Message`, you can verify that the message was signed using the public key.

```sway
```sway\nscript;

fn main() {}

use std::{
    crypto::{
        ed25519::*,
        message::*,
        public_key::*,
        secp256k1::*,
        secp256r1::*,
        signature::*,
    },
    hash::{
        Hash,
        sha256,
    },
    vm::evm::evm_address::EvmAddress,
};

fn public_key_recovery() {
    // ANCHOR: public_key_recovery
    // Secp256rk1 Public Key Recovery
    let secp256k1_signature: Signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered public key pair.
    let secp256k1_public_key = secp256k1_signature.recover(signed_message);
    assert(secp256k1_public_key.is_ok());
    assert(
        secp256k1_public_key
            .unwrap() == PublicKey::from((
            0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
            0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
        )),
    );

    // Secp256r1 Public Key Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A recovered public key pair.
    let secp256r1_public_key = secp256r1_signature.recover(signed_message);
    assert(secp256r1_public_key.is_ok());
    assert(
        secp256r1_public_key
            .unwrap() == PublicKey::from((
            0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
            0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
        )),
    );
    // ANCHOR_END: public_key_recovery
}

fn address_recovery() {
    // ANCHOR: address_recovery
    // Secp256k1 Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered Fuel address.
    let secp256k1_address = secp256k1_signature.address(signed_message);
    assert(secp256k1_address.is_ok());
    assert(
        secp256k1_address
            .unwrap() == Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881),
    );

    // Secp256r1 Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered Fuel address.
    let secp256r1_address = secp256r1_signature.address(signed_message);
    assert(secp256r1_address.is_ok());
    assert(
        secp256r1_address
            .unwrap() == Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a),
    );

    // ANCHOR_END: address_recovery
}

fn evm_address_recovery() {
    // ANCHOR: evm_address_recovery
    // Secp256k1 EVM Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_evm_address = secp256k1_signature.evm_address(signed_message);
    assert(secp256k1_evm_address.is_ok());
    assert(
        secp256k1_evm_address
            .unwrap() == EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb),
    );

    // Secp256r1 EVM Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_evm_address = secp256r1_signature.evm_address(signed_message);
    assert(secp256r1_evm_address.is_ok());
    assert(
        secp256r1_evm_address
            .unwrap() == EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a),
    );
    // ANCHOR_END: evm_address_recovery
}

fn signature_verification() {
    // ANCHOR: signature_verification
    // Secp256k1 Signature Verification
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let secp256k1_public_key = PublicKey::from((
        0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
        0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified public key
    let secp256k1_verified = secp256k1_signature.verify(secp256k1_public_key, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Signature Verification
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let secp256r1_public_key = PublicKey::from((
        0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
        0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
    ));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A verified public key 
    let secp256r1_verified = secp256r1_signature.verify(secp256r1_public_key, signed_message);
    assert(secp256r1_verified.is_ok());

    // Ed25519 Signature Verification
    let ed25519_public_key = PublicKey::from(0x314fa58689bbe1da2430517de2d772b384a1c1d2e9cb87e73c6afcf246045b10);
    let ed25519_signature = Signature::Ed25519(Ed25519::from((
        0xf38cef9361894be6c6e0eddec28a663d099d7ddff17c8077a1447d7ecb4e6545,
        0xf5084560039486d3462dd65a40c80a74709b2f06d450ffc5dc00345c6b2cdd00,
    )));
    let hashed_message = Message::from(sha256(b256::zero()));
    // A verified public key  
    let ed25519_verified = ed25519_signature.verify(ed25519_public_key, hashed_message);
    assert(ed25519_verified.is_ok());
    // ANCHOR_END: signature_verification
}

fn address_verification() {
    // ANCHOR: address_verification
    // Secp256k1 Address Verification
    let secp256k1_address = Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881);
    let secp256k1_signature = Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified address
    let secp256k1_verified = secp256k1_signature.verify_address(secp256k1_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_address = Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A verified address
    let secp256r1_verified = secp256r1_signature.verify_address(secp256r1_address, signed_message);
    assert(secp256r1_verified.is_ok());

    // ANCHOR_END: address_verification
}

fn evm_address_verification() {
    // ANCHOR: evm_address_verification
    // Secp256k1 Address Verification
    let secp256k1_evm_address = EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb);
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_verified = secp256k1_signature.verify_evm_address(secp256k1_evm_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_evm_address = EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_verified = secp256r1_signature.verify_evm_address(secp256r1_evm_address, signed_message);
    assert(secp256r1_verified.is_ok());
    // ANCHOR_END: evm_address_verification
}\n```
```

### Address Signature Verification

Given a `Signature`, `Address`, and `Message`, you can verify that the message was signed by the address.

```sway
```sway\nscript;

fn main() {}

use std::{
    crypto::{
        ed25519::*,
        message::*,
        public_key::*,
        secp256k1::*,
        secp256r1::*,
        signature::*,
    },
    hash::{
        Hash,
        sha256,
    },
    vm::evm::evm_address::EvmAddress,
};

fn public_key_recovery() {
    // ANCHOR: public_key_recovery
    // Secp256rk1 Public Key Recovery
    let secp256k1_signature: Signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered public key pair.
    let secp256k1_public_key = secp256k1_signature.recover(signed_message);
    assert(secp256k1_public_key.is_ok());
    assert(
        secp256k1_public_key
            .unwrap() == PublicKey::from((
            0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
            0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
        )),
    );

    // Secp256r1 Public Key Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A recovered public key pair.
    let secp256r1_public_key = secp256r1_signature.recover(signed_message);
    assert(secp256r1_public_key.is_ok());
    assert(
        secp256r1_public_key
            .unwrap() == PublicKey::from((
            0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
            0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
        )),
    );
    // ANCHOR_END: public_key_recovery
}

fn address_recovery() {
    // ANCHOR: address_recovery
    // Secp256k1 Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered Fuel address.
    let secp256k1_address = secp256k1_signature.address(signed_message);
    assert(secp256k1_address.is_ok());
    assert(
        secp256k1_address
            .unwrap() == Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881),
    );

    // Secp256r1 Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered Fuel address.
    let secp256r1_address = secp256r1_signature.address(signed_message);
    assert(secp256r1_address.is_ok());
    assert(
        secp256r1_address
            .unwrap() == Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a),
    );

    // ANCHOR_END: address_recovery
}

fn evm_address_recovery() {
    // ANCHOR: evm_address_recovery
    // Secp256k1 EVM Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_evm_address = secp256k1_signature.evm_address(signed_message);
    assert(secp256k1_evm_address.is_ok());
    assert(
        secp256k1_evm_address
            .unwrap() == EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb),
    );

    // Secp256r1 EVM Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_evm_address = secp256r1_signature.evm_address(signed_message);
    assert(secp256r1_evm_address.is_ok());
    assert(
        secp256r1_evm_address
            .unwrap() == EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a),
    );
    // ANCHOR_END: evm_address_recovery
}

fn signature_verification() {
    // ANCHOR: signature_verification
    // Secp256k1 Signature Verification
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let secp256k1_public_key = PublicKey::from((
        0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
        0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified public key
    let secp256k1_verified = secp256k1_signature.verify(secp256k1_public_key, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Signature Verification
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let secp256r1_public_key = PublicKey::from((
        0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
        0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
    ));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A verified public key 
    let secp256r1_verified = secp256r1_signature.verify(secp256r1_public_key, signed_message);
    assert(secp256r1_verified.is_ok());

    // Ed25519 Signature Verification
    let ed25519_public_key = PublicKey::from(0x314fa58689bbe1da2430517de2d772b384a1c1d2e9cb87e73c6afcf246045b10);
    let ed25519_signature = Signature::Ed25519(Ed25519::from((
        0xf38cef9361894be6c6e0eddec28a663d099d7ddff17c8077a1447d7ecb4e6545,
        0xf5084560039486d3462dd65a40c80a74709b2f06d450ffc5dc00345c6b2cdd00,
    )));
    let hashed_message = Message::from(sha256(b256::zero()));
    // A verified public key  
    let ed25519_verified = ed25519_signature.verify(ed25519_public_key, hashed_message);
    assert(ed25519_verified.is_ok());
    // ANCHOR_END: signature_verification
}

fn address_verification() {
    // ANCHOR: address_verification
    // Secp256k1 Address Verification
    let secp256k1_address = Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881);
    let secp256k1_signature = Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified address
    let secp256k1_verified = secp256k1_signature.verify_address(secp256k1_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_address = Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A verified address
    let secp256r1_verified = secp256r1_signature.verify_address(secp256r1_address, signed_message);
    assert(secp256r1_verified.is_ok());

    // ANCHOR_END: address_verification
}

fn evm_address_verification() {
    // ANCHOR: evm_address_verification
    // Secp256k1 Address Verification
    let secp256k1_evm_address = EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb);
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_verified = secp256k1_signature.verify_evm_address(secp256k1_evm_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_evm_address = EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_verified = secp256r1_signature.verify_evm_address(secp256r1_evm_address, signed_message);
    assert(secp256r1_verified.is_ok());
    // ANCHOR_END: evm_address_verification
}\n```
```

#### EVM Address Signature Verification

Recovery of EVM addresses verification is also supported.

```sway
```sway\nscript;

fn main() {}

use std::{
    crypto::{
        ed25519::*,
        message::*,
        public_key::*,
        secp256k1::*,
        secp256r1::*,
        signature::*,
    },
    hash::{
        Hash,
        sha256,
    },
    vm::evm::evm_address::EvmAddress,
};

fn public_key_recovery() {
    // ANCHOR: public_key_recovery
    // Secp256rk1 Public Key Recovery
    let secp256k1_signature: Signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered public key pair.
    let secp256k1_public_key = secp256k1_signature.recover(signed_message);
    assert(secp256k1_public_key.is_ok());
    assert(
        secp256k1_public_key
            .unwrap() == PublicKey::from((
            0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
            0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
        )),
    );

    // Secp256r1 Public Key Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A recovered public key pair.
    let secp256r1_public_key = secp256r1_signature.recover(signed_message);
    assert(secp256r1_public_key.is_ok());
    assert(
        secp256r1_public_key
            .unwrap() == PublicKey::from((
            0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
            0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
        )),
    );
    // ANCHOR_END: public_key_recovery
}

fn address_recovery() {
    // ANCHOR: address_recovery
    // Secp256k1 Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A recovered Fuel address.
    let secp256k1_address = secp256k1_signature.address(signed_message);
    assert(secp256k1_address.is_ok());
    assert(
        secp256k1_address
            .unwrap() == Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881),
    );

    // Secp256r1 Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered Fuel address.
    let secp256r1_address = secp256r1_signature.address(signed_message);
    assert(secp256r1_address.is_ok());
    assert(
        secp256r1_address
            .unwrap() == Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a),
    );

    // ANCHOR_END: address_recovery
}

fn evm_address_recovery() {
    // ANCHOR: evm_address_recovery
    // Secp256k1 EVM Address Recovery
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_evm_address = secp256k1_signature.evm_address(signed_message);
    assert(secp256k1_evm_address.is_ok());
    assert(
        secp256k1_evm_address
            .unwrap() == EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb),
    );

    // Secp256r1 EVM Address Recovery
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_evm_address = secp256r1_signature.evm_address(signed_message);
    assert(secp256r1_evm_address.is_ok());
    assert(
        secp256r1_evm_address
            .unwrap() == EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a),
    );
    // ANCHOR_END: evm_address_recovery
}

fn signature_verification() {
    // ANCHOR: signature_verification
    // Secp256k1 Signature Verification
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    )));
    let secp256k1_public_key = PublicKey::from((
        0x41a55558a3486b6ee3878f55f16879c0798afd772c1506de44aba90d29b6e65c,
        0x341ca2e0a3d5827e78d838e35b29bebe2a39ac30b58999e1138c9467bf859965,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified public key
    let secp256k1_verified = secp256k1_signature.verify(secp256k1_public_key, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Signature Verification
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876712afadbff382e1bf31c44437823ed761cc3600d0016de511ac,
        0x44ac566bd156b4fc71a4a4cb2655d3da360c695edb27dc3b64d621e122fea23d,
    )));
    let secp256r1_public_key = PublicKey::from((
        0xd6ea577a54ae42411fbc78d686d4abba2150ca83540528e4b868002e346004b2,
        0x62660ecce5979493fe5684526e8e00875b948e507a89a47096bc84064a175452,
    ));
    let signed_message = Message::from(0x1e45523606c96c98ba970ff7cf9511fab8b25e1bcd52ced30b81df1e4a9c4323);
    // A verified public key 
    let secp256r1_verified = secp256r1_signature.verify(secp256r1_public_key, signed_message);
    assert(secp256r1_verified.is_ok());

    // Ed25519 Signature Verification
    let ed25519_public_key = PublicKey::from(0x314fa58689bbe1da2430517de2d772b384a1c1d2e9cb87e73c6afcf246045b10);
    let ed25519_signature = Signature::Ed25519(Ed25519::from((
        0xf38cef9361894be6c6e0eddec28a663d099d7ddff17c8077a1447d7ecb4e6545,
        0xf5084560039486d3462dd65a40c80a74709b2f06d450ffc5dc00345c6b2cdd00,
    )));
    let hashed_message = Message::from(sha256(b256::zero()));
    // A verified public key  
    let ed25519_verified = ed25519_signature.verify(ed25519_public_key, hashed_message);
    assert(ed25519_verified.is_ok());
    // ANCHOR_END: signature_verification
}

fn address_verification() {
    // ANCHOR: address_verification
    // Secp256k1 Address Verification
    let secp256k1_address = Address::from(0x02844f00cce0f608fa3f0f7408bec96bfd757891a6fda6e1fa0f510398304881);
    let secp256k1_signature = Secp256k1::from((
        0x61f3caf4c0912cec69ff0b226638d397115c623a7f057914d48a7e4daf1cf6d8,
        0x2555de81cd3a40382d3d64eb1c77e463eea5a76d65ec85f283e0b3d568352678,
    ));
    let signed_message = Message::from(0xa13f4ab54057ce064d3dd97ac3ff30ed704e73956896c03650fe59b1a561fe15);
    // A verified address
    let secp256k1_verified = secp256k1_signature.verify_address(secp256k1_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_address = Address::from(0xb4a5fabee8cc852084b71f17107e9c18d682033a58967027af0ab01edf2f9a6a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0xbd0c9b8792876713afa8bf3383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A verified address
    let secp256r1_verified = secp256r1_signature.verify_address(secp256r1_address, signed_message);
    assert(secp256r1_verified.is_ok());

    // ANCHOR_END: address_verification
}

fn evm_address_verification() {
    // ANCHOR: evm_address_verification
    // Secp256k1 Address Verification
    let secp256k1_evm_address = EvmAddress::from(0x0000000000000000000000000ec44cf95ce5051ef590e6d420f8e722dd160ecb);
    let secp256k1_signature = Signature::Secp256k1(Secp256k1::from((
        0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c,
        0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d,
    )));
    let signed_message = Message::from(0xee45573606c96c98ba970ff7cf9511f1b8b25e6bcd52ced30b89df1e4a9c4323);
    // A recovered EVM address.
    let secp256k1_verified = secp256k1_signature.verify_evm_address(secp256k1_evm_address, signed_message);
    assert(secp256k1_verified.is_ok());

    // Secp256r1 Address Verification
    let secp256r1_evm_address = EvmAddress::from(0x000000000000000000000000408eb2d97ef0beda0a33848d9e052066667cb00a);
    let secp256r1_signature = Signature::Secp256r1(Secp256r1::from((
        0x62CDC20C0AB6AA7B91E63DA9917792473F55A6F15006BC99DD4E29420084A3CC,
        0xF4D99AF28F9D6BD96BDAAB83BFED99212AC3C7D06810E33FBB14C4F29B635414,
    )));
    let signed_message = Message::from(0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    // A recovered EVM address.
    let secp256r1_verified = secp256r1_signature.verify_evm_address(secp256r1_evm_address, signed_message);
    assert(secp256r1_verified.is_ok());
    // ANCHOR_END: evm_address_verification
}\n```
```
