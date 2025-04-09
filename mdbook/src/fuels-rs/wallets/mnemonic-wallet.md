# Creating a wallet from mnemonic phrases

A mnemonic phrase is a cryptographically-generated sequence of words that's used to derive a private key. For instance: `"oblige salon price punch saddle immune slogan rare snap desert retire surprise";` would generate the address `0xdf9d0e6c6c5f5da6e82e5e1a77974af6642bdb450a10c43f0c6910a212600185`.

In addition to that, we also support [Hierarchical Deterministic Wallets](https://www.ledger.com/academy/crypto/what-are-hierarchical-deterministic-hd-wallets) and [derivation paths](https://thebitcoinmanual.com/articles/btc-derivation-path/). You may recognize the string `"m/44'/60'/0'/0/0"` from somewhere; that's a derivation path. In simple terms, it's a way to derive many wallets from a single root wallet.

The SDK gives you two wallets from mnemonic instantiation methods: one that takes a derivation path (`Wallet::new_from_mnemonic_phrase_with_path`) and one that uses the default derivation path, in case you don't want or don't need to configure that (`Wallet::new_from_mnemonic_phrase`).

Here's how you can create wallets with both mnemonic phrases and derivation paths:

```rust,ignore
use fuels::prelude::*;

        let phrase =
            "oblige salon price punch saddle immune slogan rare snap desert retire surprise";

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        // Create first account from mnemonic phrase.
        let _wallet = WalletUnlocked::new_from_mnemonic_phrase_with_path(
            phrase,
            Some(provider.clone()),
            "m/44'/1179993420'/0'/0/0",
        )?;

        // Or with the default derivation path
        let wallet = WalletUnlocked::new_from_mnemonic_phrase(phrase, Some(provider))?;

        let expected_address = "fuel17x9kg3k7hqf42396vqenukm4yf59e5k0vj4yunr4mae9zjv9pdjszy098t";

        assert_eq!(wallet.address().to_string(), expected_address);
```
