# Signatures in predicates example

This is a more involved example where the predicate accepts three signatures and matches them to three predefined public keys. The `ec_recover_address` function is used to recover the public key from the signatures. If two of the three extracted public keys match the predefined public keys, the funds can be spent. Note that the signature order has to match the order of the predefined public keys.

```rust,ignore
predicate;

use std::{b512::B512, constants::ZERO_B256, ecr::ec_recover_address, inputs::input_predicate_data};

fn extract_public_key_and_match(signature: B512, expected_public_key: b256) -> u64 {
    if let Result::Ok(pub_key_sig) = ec_recover_address(signature, ZERO_B256)
    {
        if pub_key_sig == Address::from(expected_public_key) {
            return 1;
        }
    }

    0
}

fn main(signatures: [B512; 3]) -> bool {
    let public_keys = [
        0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0,
        0x14df7c7e4e662db31fe2763b1734a3d680e7b743516319a49baaa22b2032a857,
        0x3ff494fb136978c3125844625dad6baf6e87cdb1328c8a51f35bda5afe72425c,
    ];

    let mut matched_keys = 0;

    matched_keys = extract_public_key_and_match(signatures[0], public_keys[0]);
    matched_keys = matched_keys + extract_public_key_and_match(signatures[1], public_keys[1]);
    matched_keys = matched_keys + extract_public_key_and_match(signatures[2], public_keys[2]);

    matched_keys > 1
}
```

Let's use the SDK to interact with the predicate. First, let's create three wallets with specific keys. Their hashed public keys are already hard-coded in the predicate. Then we create the receiver wallet, which we will use to spend the predicate funds.

```rust,ignore
let secret_key1: SecretKey =
            "0x862512a2363db2b3a375c0d4bbbd27172180d89f23f2e259bac850ab02619301".parse()?;

        let secret_key2: SecretKey =
            "0x37fa81c84ccd547c30c176b118d5cb892bdb113e8e80141f266519422ef9eefd".parse()?;

        let secret_key3: SecretKey =
            "0x976e5c3fa620092c718d852ca703b6da9e3075b9f2ecb8ed42d9f746bf26aafb".parse()?;

        let mut wallet = WalletUnlocked::new_from_private_key(secret_key1, None);
        let mut wallet2 = WalletUnlocked::new_from_private_key(secret_key2, None);
        let mut wallet3 = WalletUnlocked::new_from_private_key(secret_key3, None);
        let mut receiver = WalletUnlocked::new_random(None);
```

Next, let's add some coins, start a provider and connect it with the wallets.

```rust,ignore
let asset_id = AssetId::zeroed();
        let num_coins = 32;
        let amount = 64;
        let initial_balance = amount * num_coins;
        let all_coins = [&wallet, &wallet2, &wallet3, &receiver]
            .iter()
            .flat_map(|wallet| {
                setup_single_asset_coins(wallet.address(), asset_id, num_coins, amount)
            })
            .collect::<Vec<_>>();

        let provider = setup_test_provider(all_coins, vec![], None, None).await?;

        [&mut wallet, &mut wallet2, &mut wallet3, &mut receiver]
            .iter_mut()
            .for_each(|wallet| {
                wallet.set_provider(provider.clone());
            });
```

Now we can use the predicate abigen to create a predicate encoder instance for us. To spend the funds now locked in the predicate, we must provide two out of three signatures whose public keys match the ones we defined in the predicate. In this example, the signatures are generated from an array of zeros.

```rust,ignore
abigen!(Predicate(
            name = "MyPredicate",
            abi = "e2e/sway/predicates/signatures/out/release/signatures-abi.json"
        ));

        let predicate_data = MyPredicateEncoder::default().encode_data(signatures)?;
        let code_path = "../../e2e/sway/predicates/signatures/out/release/signatures.bin";

        let predicate: Predicate = Predicate::load_from(code_path)?
            .with_provider(provider)
            .with_data(predicate_data);
```

Next, we transfer some assets from a wallet to the created predicate. We also confirm that the funds are indeed transferred.

```rust,ignore
let amount_to_predicate = 500;

        wallet
            .transfer(
                predicate.address(),
                amount_to_predicate,
                asset_id,
                TxPolicies::default(),
            )
            .await?;

        let predicate_balance = predicate.get_asset_balance(&asset_id).await?;
        assert_eq!(predicate_balance, amount_to_predicate);
```

We can use the `transfer` method from the [Account](../accounts.md) trait to transfer the assets. If the predicate data is correct, the `receiver` wallet will get the funds, and we will verify that the amount is correct.

```rust,ignore
let amount_to_receiver = 300;
        predicate
            .transfer(
                receiver.address(),
                amount_to_receiver,
                asset_id,
                TxPolicies::default(),
            )
            .await?;

        let receiver_balance_after = receiver.get_asset_balance(&asset_id).await?;
        assert_eq!(initial_balance + amount_to_receiver, receiver_balance_after);
```
