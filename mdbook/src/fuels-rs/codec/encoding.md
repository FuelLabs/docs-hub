# Encoding

Be sure to read the [prerequisites](./index.md#prerequisites-for-decodingencoding) to encoding.

Encoding is done via the [`ABIEncoder`](https://docs.rs/fuels/latest/fuels/core/codec/struct.ABIEncoder.html):

```rust,ignore
<!-- MDBOOK-ANCHOR-ERROR: Anchor 'encoding_example' not found in '../../../examples/codec/src/lib.rs' -->
```

There is also a shortcut-macro that can encode multiple types which implement [`Tokenizable`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Tokenizable.html):

```rust,ignore
<!-- MDBOOK-ANCHOR-ERROR: Anchor 'encoding_example_w_macro' not found in '../../../examples/codec/src/lib.rs' -->
```

## Configuring the encoder

The encoder can be configured to limit its resource expenditure:

```rust,ignore
use fuels::core::codec::ABIEncoder;

        ABIEncoder::new(EncoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
```

The default values for the `EncoderConfig` are:

```rust,ignore
impl Default for EncoderConfig {
    fn default() -> Self {
        Self {
            max_depth: 45,
            max_tokens: 10_000,
        }
    }
}
```

## Configuring the encoder for contract/script calls

You can also configure the encoder used to encode the arguments of the contract method:

```rust,ignore
let _ = contract_instance
            .with_encoder_config(EncoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .methods()
            .initialize_counter(42)
            .call()
            .await?;
```

The same method is available for script calls.
