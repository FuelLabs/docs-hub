# Decoding

Be sure to read the [prerequisites](./index.md#prerequisites-for-decodingencoding) to decoding.

Decoding is done via the [`ABIDecoder`](https://docs.rs/fuels/latest/fuels/core/codec/struct.ABIDecoder.html):

```rust,ignore
use fuels::{
            core::{
                codec::ABIDecoder,
                traits::{Parameterize, Tokenizable},
            },
            macros::{Parameterize, Tokenizable},
            types::Token,
        };

        #[derive(Parameterize, Tokenizable)]
        struct MyStruct {
            field: u64,
        }

        let bytes: &[u8] = &[0, 0, 0, 0, 0, 0, 0, 101];

        let token: Token = ABIDecoder::default().decode(&MyStruct::param_type(), bytes)?;

        let _: MyStruct = MyStruct::from_token(token)?;
```

First into a [`Token`](https://docs.rs/fuels/latest/fuels/types/enum.Token.html), then via the [`Tokenizable`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Tokenizable.html) trait, into the desired type.

If the type came from [`abigen!`](../abigen/index.md) (or uses the [`::fuels::macros::TryFrom`](https://docs.rs/fuels/latest/fuels/macros/derive.TryFrom.html) derivation) then you can also use `try_into` to convert bytes into a type that implements both [`Parameterize`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Parameterize.html) and [`Tokenizable`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Tokenizable.html):

```rust,ignore
use fuels::macros::{Parameterize, Tokenizable, TryFrom};

        #[derive(Parameterize, Tokenizable, TryFrom)]
        struct MyStruct {
            field: u64,
        }

        let bytes: &[u8] = &[0, 0, 0, 0, 0, 0, 0, 101];

        let _: MyStruct = bytes.try_into()?;
```

Under the hood, [`try_from_bytes`](https://docs.rs/fuels/latest/fuels/core/codec/fn.try_from_bytes.html) is being called, which does what the preceding example did.

## Configuring the decoder

The decoder can be configured to limit its resource expenditure:

```rust,ignore
use fuels::core::codec::ABIDecoder;

        ABIDecoder::new(DecoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
```

<!-- TODO: Add a link once a release is made -->
<!-- https://docs.rs/fuels/latest/fuels/core/codec/struct.DecoderConfig.html -->
For an explanation of each configuration value visit the `DecoderConfig`.

<!-- TODO: add a link once a release is made -->
<!-- https://docs.rs/fuels/latest/fuels/core/codec/struct.DecoderConfig.html -->
The default values for the `DecoderConfig` are:

```rust,ignore
impl Default for DecoderConfig {
    fn default() -> Self {
        Self {
            max_depth: 45,
            max_tokens: 10_000,
        }
    }
}
```

## Configuring the decoder for contract/script calls

You can also configure the decoder used to decode the return value of the contract method:

```rust,ignore
let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .with_decoder_config(DecoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .call()
            .await?;
```

The same method is available for script calls.
