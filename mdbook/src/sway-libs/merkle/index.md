# Merkle Library

Merkle trees allow for on-chain verification of off-chain data. With the merkle root posted on-chain, the generation of proofs off-chain can provide verifiably true data.

For implementation details on the Merkle Library please see the [Sway Libs Docs](https://fuellabs.github.io/sway-libs/master/sway_libs/merkle/index.html).

## Importing the Merkle Library

In order to use the Merkle Library, Sway Libs must be added to the `Forc.toml` file and then imported into your Sway project. To add Sway Libs as a dependency to the `Forc.toml` file in your project please see the [Getting Started](../getting_started/index.md).

To import the Merkle Library to your Sway Smart Contract, add the following to your Sway file:

```sway
contract;

// ANCHOR: import
use sway_libs::merkle::binary_proof::*;
// ANCHOR_END: import

abi MerkleExample {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool;
}

impl MerkleExample for Contract {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool {
        verify_proof(key, leaf, merkle_root, num_leaves, proof)
    }
}

// ANCHOR: leaf_digest
fn compute_leaf(hashed_data: b256) {
    let leaf: b256 = leaf_digest(hashed_data);
}
// ANCHOR_END: leaf_digest

// ANCHOR: node_digest
fn compute_node(leaf_a: b256, leaf_b: b256) {
    let node: b256 = node_digest(leaf_a, leaf_b);
}
// ANCHOR_END: node_digest

// ANCHOR: process_proof
fn process(key: u64, leaf: b256, num_leaves: u64, proof: Vec<b256>) {
    let merkle_root: b256 = process_proof(key, leaf, num_leaves, proof);
}
// ANCHOR_END: process_proof

// ANCHOR: verify_proof
fn verify(
    merkle_root: b256,
    key: u64,
    leaf: b256,
    num_leaves: u64,
    proof: Vec<b256>,
) {
    assert(verify_proof(key, leaf, merkle_root, num_leaves, proof));
}
// ANCHOR_END: verify_proof
```

## Using the Merkle Proof Library In Sway

Once imported, using the Merkle Proof library is as simple as calling the desired function. Here is a list of function definitions that you may use.

- `leaf_digest()`
- `node_digest()`
- `process_proof()`
- `verify_proof()`

## Basic Functionality

### Computing Leaves and Nodes

The Binary Proof currently allows for you to compute leaves and nodes of a merkle tree given the appropriate hash digest.

To compute a leaf use the `leaf_digest()` function:

```sway
contract;

// ANCHOR: import
use sway_libs::merkle::binary_proof::*;
// ANCHOR_END: import

abi MerkleExample {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool;
}

impl MerkleExample for Contract {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool {
        verify_proof(key, leaf, merkle_root, num_leaves, proof)
    }
}

// ANCHOR: leaf_digest
fn compute_leaf(hashed_data: b256) {
    let leaf: b256 = leaf_digest(hashed_data);
}
// ANCHOR_END: leaf_digest

// ANCHOR: node_digest
fn compute_node(leaf_a: b256, leaf_b: b256) {
    let node: b256 = node_digest(leaf_a, leaf_b);
}
// ANCHOR_END: node_digest

// ANCHOR: process_proof
fn process(key: u64, leaf: b256, num_leaves: u64, proof: Vec<b256>) {
    let merkle_root: b256 = process_proof(key, leaf, num_leaves, proof);
}
// ANCHOR_END: process_proof

// ANCHOR: verify_proof
fn verify(
    merkle_root: b256,
    key: u64,
    leaf: b256,
    num_leaves: u64,
    proof: Vec<b256>,
) {
    assert(verify_proof(key, leaf, merkle_root, num_leaves, proof));
}
// ANCHOR_END: verify_proof
```

To compute a node given two leaves, use the `node_digest()` function:

```sway
contract;

// ANCHOR: import
use sway_libs::merkle::binary_proof::*;
// ANCHOR_END: import

abi MerkleExample {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool;
}

impl MerkleExample for Contract {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool {
        verify_proof(key, leaf, merkle_root, num_leaves, proof)
    }
}

// ANCHOR: leaf_digest
fn compute_leaf(hashed_data: b256) {
    let leaf: b256 = leaf_digest(hashed_data);
}
// ANCHOR_END: leaf_digest

// ANCHOR: node_digest
fn compute_node(leaf_a: b256, leaf_b: b256) {
    let node: b256 = node_digest(leaf_a, leaf_b);
}
// ANCHOR_END: node_digest

// ANCHOR: process_proof
fn process(key: u64, leaf: b256, num_leaves: u64, proof: Vec<b256>) {
    let merkle_root: b256 = process_proof(key, leaf, num_leaves, proof);
}
// ANCHOR_END: process_proof

// ANCHOR: verify_proof
fn verify(
    merkle_root: b256,
    key: u64,
    leaf: b256,
    num_leaves: u64,
    proof: Vec<b256>,
) {
    assert(verify_proof(key, leaf, merkle_root, num_leaves, proof));
}
// ANCHOR_END: verify_proof
```

> **NOTE** Order matters when computing a node.

### Computing the Merkle Root

To compute a Merkle root given a proof, use the `process_proof()` function.

```sway
contract;

// ANCHOR: import
use sway_libs::merkle::binary_proof::*;
// ANCHOR_END: import

abi MerkleExample {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool;
}

impl MerkleExample for Contract {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool {
        verify_proof(key, leaf, merkle_root, num_leaves, proof)
    }
}

// ANCHOR: leaf_digest
fn compute_leaf(hashed_data: b256) {
    let leaf: b256 = leaf_digest(hashed_data);
}
// ANCHOR_END: leaf_digest

// ANCHOR: node_digest
fn compute_node(leaf_a: b256, leaf_b: b256) {
    let node: b256 = node_digest(leaf_a, leaf_b);
}
// ANCHOR_END: node_digest

// ANCHOR: process_proof
fn process(key: u64, leaf: b256, num_leaves: u64, proof: Vec<b256>) {
    let merkle_root: b256 = process_proof(key, leaf, num_leaves, proof);
}
// ANCHOR_END: process_proof

// ANCHOR: verify_proof
fn verify(
    merkle_root: b256,
    key: u64,
    leaf: b256,
    num_leaves: u64,
    proof: Vec<b256>,
) {
    assert(verify_proof(key, leaf, merkle_root, num_leaves, proof));
}
// ANCHOR_END: verify_proof
```

### Verifying a Proof

To verify a proof against a merkle root, use the `verify_proof()` function.

```sway
contract;

// ANCHOR: import
use sway_libs::merkle::binary_proof::*;
// ANCHOR_END: import

abi MerkleExample {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool;
}

impl MerkleExample for Contract {
    fn verify(
        merkle_root: b256,
        key: u64,
        leaf: b256,
        num_leaves: u64,
        proof: Vec<b256>,
    ) -> bool {
        verify_proof(key, leaf, merkle_root, num_leaves, proof)
    }
}

// ANCHOR: leaf_digest
fn compute_leaf(hashed_data: b256) {
    let leaf: b256 = leaf_digest(hashed_data);
}
// ANCHOR_END: leaf_digest

// ANCHOR: node_digest
fn compute_node(leaf_a: b256, leaf_b: b256) {
    let node: b256 = node_digest(leaf_a, leaf_b);
}
// ANCHOR_END: node_digest

// ANCHOR: process_proof
fn process(key: u64, leaf: b256, num_leaves: u64, proof: Vec<b256>) {
    let merkle_root: b256 = process_proof(key, leaf, num_leaves, proof);
}
// ANCHOR_END: process_proof

// ANCHOR: verify_proof
fn verify(
    merkle_root: b256,
    key: u64,
    leaf: b256,
    num_leaves: u64,
    proof: Vec<b256>,
) {
    assert(verify_proof(key, leaf, merkle_root, num_leaves, proof));
}
// ANCHOR_END: verify_proof
```

## Using the Merkle Proof Library with Fuels-rs

To generate a Merkle Tree and corresponding proof for your Sway Smart Contract, use the [Fuel-Merkle](https://github.com/FuelLabs/fuel-vm/tree/master/fuel-merkle) crate.

### Importing Into Your Project

The import the Fuel-Merkle crate, the following should be added to the project's `Cargo.toml` file under `[dependencies]`:

```sway
fuel-merkle = { version = "0.50.0" }
```

> **NOTE** Make sure to use the latest version of the [fuel-merkle](https://crates.io/crates/fuel-merkle) crate.

### Importing Into Your Rust File

The following should be added to your Rust file to use the Fuel-Merkle crate.

```sway
// ANCHOR: import
use fuel_merkle::binary::in_memory::MerkleTree;
// ANCHOR_END: import
use fuels::{prelude::*, types::Bits256};
use sha2::{Digest, Sha256};

pub const LEAF: u8 = 0x00;

// Load abi from json
abigen!(Contract(
    name = "MerkleExample",
    abi = "merkle/out/release/merkle_examples-abi.json"
));

async fn get_contract_instance() -> (MerkleExample<WalletUnlocked>, WalletUnlocked) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./merkle/out/release/merkle_examples.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MerkleExample::new(id, wallet.clone());

    (instance, wallet)
}

#[tokio::test]
async fn rust_setup_example() {
    let (contract_instance, _id) = get_contract_instance().await;

    // ANCHOR: generating_a_tree
    // Create a new Merkle Tree and define leaves
    let mut tree = MerkleTree::new();
    let leaves = [b"A", b"B", b"C"].to_vec();

    // Hash the leaves and then push to the merkle tree
    for datum in &leaves {
        let mut hasher = Sha256::new();
        hasher.update(datum);
        let hash = hasher.finalize();
        tree.push(&hash);
    }
    // ANCHOR_END: generating_a_tree

    // ANCHOR: generating_proof
    // Define the key or index of the leaf you want to prove and the number of leaves
    let key: u64 = 0;

    // Get the merkle root and proof set
    let (merkle_root, proof_set) = tree.prove(key).unwrap();

    // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
    let mut bits256_proof: Vec<Bits256> = Vec::new();
    for itterator in proof_set {
        bits256_proof.push(Bits256(itterator));
    }
    // ANCHOR_END: generating_proof

    // ANCHOR: verify_proof
    // Create the merkle leaf
    let mut leaf_hasher = Sha256::new();
    leaf_hasher.update(leaves[key as usize]);
    let hashed_leaf_data = leaf_hasher.finalize();
    let merkle_leaf = leaf_sum(&hashed_leaf_data);

    // Get the number of leaves or data points
    let num_leaves: u64 = leaves.len() as u64;

    // Call the Sway contract to verify the generated merkle proof
    let result: bool = contract_instance
        .methods()
        .verify(
            Bits256(merkle_root),
            key,
            Bits256(merkle_leaf),
            num_leaves,
            bits256_proof,
        )
        .call()
        .await
        .unwrap()
        .value;
    assert!(result);
    // ANCHOR_END: verify_proof
}

pub fn leaf_sum(data: &[u8]) -> [u8; 32] {
    let mut hash = Sha256::new();

    hash.update([LEAF]);
    hash.update(data);

    hash.finalize().into()
}
```

### Using Fuel-Merkle

#### Generating A Tree

To create a merkle tree using Fuel-Merkle is as simple as pushing your leaves in increasing order.

```sway
// ANCHOR: import
use fuel_merkle::binary::in_memory::MerkleTree;
// ANCHOR_END: import
use fuels::{prelude::*, types::Bits256};
use sha2::{Digest, Sha256};

pub const LEAF: u8 = 0x00;

// Load abi from json
abigen!(Contract(
    name = "MerkleExample",
    abi = "merkle/out/release/merkle_examples-abi.json"
));

async fn get_contract_instance() -> (MerkleExample<WalletUnlocked>, WalletUnlocked) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./merkle/out/release/merkle_examples.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MerkleExample::new(id, wallet.clone());

    (instance, wallet)
}

#[tokio::test]
async fn rust_setup_example() {
    let (contract_instance, _id) = get_contract_instance().await;

    // ANCHOR: generating_a_tree
    // Create a new Merkle Tree and define leaves
    let mut tree = MerkleTree::new();
    let leaves = [b"A", b"B", b"C"].to_vec();

    // Hash the leaves and then push to the merkle tree
    for datum in &leaves {
        let mut hasher = Sha256::new();
        hasher.update(datum);
        let hash = hasher.finalize();
        tree.push(&hash);
    }
    // ANCHOR_END: generating_a_tree

    // ANCHOR: generating_proof
    // Define the key or index of the leaf you want to prove and the number of leaves
    let key: u64 = 0;

    // Get the merkle root and proof set
    let (merkle_root, proof_set) = tree.prove(key).unwrap();

    // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
    let mut bits256_proof: Vec<Bits256> = Vec::new();
    for itterator in proof_set {
        bits256_proof.push(Bits256(itterator));
    }
    // ANCHOR_END: generating_proof

    // ANCHOR: verify_proof
    // Create the merkle leaf
    let mut leaf_hasher = Sha256::new();
    leaf_hasher.update(leaves[key as usize]);
    let hashed_leaf_data = leaf_hasher.finalize();
    let merkle_leaf = leaf_sum(&hashed_leaf_data);

    // Get the number of leaves or data points
    let num_leaves: u64 = leaves.len() as u64;

    // Call the Sway contract to verify the generated merkle proof
    let result: bool = contract_instance
        .methods()
        .verify(
            Bits256(merkle_root),
            key,
            Bits256(merkle_leaf),
            num_leaves,
            bits256_proof,
        )
        .call()
        .await
        .unwrap()
        .value;
    assert!(result);
    // ANCHOR_END: verify_proof
}

pub fn leaf_sum(data: &[u8]) -> [u8; 32] {
    let mut hash = Sha256::new();

    hash.update([LEAF]);
    hash.update(data);

    hash.finalize().into()
}
```

#### Generating And Verifying A Proof

To generate a proof for a specific leaf, you must have the index or key of the leaf. Simply call the prove function:

```sway
// ANCHOR: import
use fuel_merkle::binary::in_memory::MerkleTree;
// ANCHOR_END: import
use fuels::{prelude::*, types::Bits256};
use sha2::{Digest, Sha256};

pub const LEAF: u8 = 0x00;

// Load abi from json
abigen!(Contract(
    name = "MerkleExample",
    abi = "merkle/out/release/merkle_examples-abi.json"
));

async fn get_contract_instance() -> (MerkleExample<WalletUnlocked>, WalletUnlocked) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./merkle/out/release/merkle_examples.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MerkleExample::new(id, wallet.clone());

    (instance, wallet)
}

#[tokio::test]
async fn rust_setup_example() {
    let (contract_instance, _id) = get_contract_instance().await;

    // ANCHOR: generating_a_tree
    // Create a new Merkle Tree and define leaves
    let mut tree = MerkleTree::new();
    let leaves = [b"A", b"B", b"C"].to_vec();

    // Hash the leaves and then push to the merkle tree
    for datum in &leaves {
        let mut hasher = Sha256::new();
        hasher.update(datum);
        let hash = hasher.finalize();
        tree.push(&hash);
    }
    // ANCHOR_END: generating_a_tree

    // ANCHOR: generating_proof
    // Define the key or index of the leaf you want to prove and the number of leaves
    let key: u64 = 0;

    // Get the merkle root and proof set
    let (merkle_root, proof_set) = tree.prove(key).unwrap();

    // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
    let mut bits256_proof: Vec<Bits256> = Vec::new();
    for itterator in proof_set {
        bits256_proof.push(Bits256(itterator));
    }
    // ANCHOR_END: generating_proof

    // ANCHOR: verify_proof
    // Create the merkle leaf
    let mut leaf_hasher = Sha256::new();
    leaf_hasher.update(leaves[key as usize]);
    let hashed_leaf_data = leaf_hasher.finalize();
    let merkle_leaf = leaf_sum(&hashed_leaf_data);

    // Get the number of leaves or data points
    let num_leaves: u64 = leaves.len() as u64;

    // Call the Sway contract to verify the generated merkle proof
    let result: bool = contract_instance
        .methods()
        .verify(
            Bits256(merkle_root),
            key,
            Bits256(merkle_leaf),
            num_leaves,
            bits256_proof,
        )
        .call()
        .await
        .unwrap()
        .value;
    assert!(result);
    // ANCHOR_END: verify_proof
}

pub fn leaf_sum(data: &[u8]) -> [u8; 32] {
    let mut hash = Sha256::new();

    hash.update([LEAF]);
    hash.update(data);

    hash.finalize().into()
}
```

Once the proof has been generated, you may call the Sway Smart Contract's `verify_proof` function:

```sway
// ANCHOR: import
use fuel_merkle::binary::in_memory::MerkleTree;
// ANCHOR_END: import
use fuels::{prelude::*, types::Bits256};
use sha2::{Digest, Sha256};

pub const LEAF: u8 = 0x00;

// Load abi from json
abigen!(Contract(
    name = "MerkleExample",
    abi = "merkle/out/release/merkle_examples-abi.json"
));

async fn get_contract_instance() -> (MerkleExample<WalletUnlocked>, WalletUnlocked) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./merkle/out/release/merkle_examples.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MerkleExample::new(id, wallet.clone());

    (instance, wallet)
}

#[tokio::test]
async fn rust_setup_example() {
    let (contract_instance, _id) = get_contract_instance().await;

    // ANCHOR: generating_a_tree
    // Create a new Merkle Tree and define leaves
    let mut tree = MerkleTree::new();
    let leaves = [b"A", b"B", b"C"].to_vec();

    // Hash the leaves and then push to the merkle tree
    for datum in &leaves {
        let mut hasher = Sha256::new();
        hasher.update(datum);
        let hash = hasher.finalize();
        tree.push(&hash);
    }
    // ANCHOR_END: generating_a_tree

    // ANCHOR: generating_proof
    // Define the key or index of the leaf you want to prove and the number of leaves
    let key: u64 = 0;

    // Get the merkle root and proof set
    let (merkle_root, proof_set) = tree.prove(key).unwrap();

    // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
    let mut bits256_proof: Vec<Bits256> = Vec::new();
    for itterator in proof_set {
        bits256_proof.push(Bits256(itterator));
    }
    // ANCHOR_END: generating_proof

    // ANCHOR: verify_proof
    // Create the merkle leaf
    let mut leaf_hasher = Sha256::new();
    leaf_hasher.update(leaves[key as usize]);
    let hashed_leaf_data = leaf_hasher.finalize();
    let merkle_leaf = leaf_sum(&hashed_leaf_data);

    // Get the number of leaves or data points
    let num_leaves: u64 = leaves.len() as u64;

    // Call the Sway contract to verify the generated merkle proof
    let result: bool = contract_instance
        .methods()
        .verify(
            Bits256(merkle_root),
            key,
            Bits256(merkle_leaf),
            num_leaves,
            bits256_proof,
        )
        .call()
        .await
        .unwrap()
        .value;
    assert!(result);
    // ANCHOR_END: verify_proof
}

pub fn leaf_sum(data: &[u8]) -> [u8; 32] {
    let mut hash = Sha256::new();

    hash.update([LEAF]);
    hash.update(data);

    hash.finalize().into()
}
```
