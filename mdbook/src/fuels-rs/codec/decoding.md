# Decoding

Be sure to read the [prerequisites](./index.md#prerequisites-for-decodingencoding) to decoding.

Decoding is done via the [`ABIDecoder`](https://docs.rs/fuels/latest/fuels/core/codec/struct.ABIDecoder.html):

```rust,ignore
#[cfg(test)]
mod tests {
    use fuels::{
        core::codec::{DecoderConfig, EncoderConfig},
        types::errors::Result,
    };

    #[test]
    fn encoding_a_type() -> Result<()> {
        //ANCHOR: encoding_example
        use fuels::{
            core::{codec::ABIEncoder, traits::Tokenizable},
            macros::Tokenizable,
        };

        #[derive(Tokenizable)]
        struct MyStruct {
            field: u64,
        }

        let instance = MyStruct { field: 101 };
        let _encoded: Vec<u8> = ABIEncoder::default().encode(&[instance.into_token()])?;
        //ANCHOR_END: encoding_example

        Ok(())
    }
    #[test]
    fn encoding_via_macro() -> Result<()> {
        //ANCHOR: encoding_example_w_macro
        use fuels::{core::codec::calldata, macros::Tokenizable};

        #[derive(Tokenizable)]
        struct MyStruct {
            field: u64,
        }
        let _: Vec<u8> = calldata!(MyStruct { field: 101 }, MyStruct { field: 102 })?;
        //ANCHOR_END: encoding_example_w_macro

        Ok(())
    }

    #[test]
    fn decoding_example() -> Result<()> {
        // ANCHOR: decoding_example
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
        // ANCHOR_END: decoding_example

        Ok(())
    }

    #[test]
    fn decoding_example_try_into() -> Result<()> {
        // ANCHOR: decoding_example_try_into
        use fuels::macros::{Parameterize, Tokenizable, TryFrom};

        #[derive(Parameterize, Tokenizable, TryFrom)]
        struct MyStruct {
            field: u64,
        }

        let bytes: &[u8] = &[0, 0, 0, 0, 0, 0, 0, 101];

        let _: MyStruct = bytes.try_into()?;
        // ANCHOR_END: decoding_example_try_into

        Ok(())
    }

    #[test]
    fn configuring_the_decoder() -> Result<()> {
        // ANCHOR: configuring_the_decoder

        use fuels::core::codec::ABIDecoder;

        ABIDecoder::new(DecoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
        // ANCHOR_END: configuring_the_decoder

        Ok(())
    }

    #[test]
    fn configuring_the_encoder() -> Result<()> {
        // ANCHOR: configuring_the_encoder
        use fuels::core::codec::ABIEncoder;

        ABIEncoder::new(EncoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
        // ANCHOR_END: configuring_the_encoder

        Ok(())
    }
}
```

First into a [`Token`](https://docs.rs/fuels/latest/fuels/types/enum.Token.html), then via the [`Tokenizable`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Tokenizable.html) trait, into the desired type.

If the type came from [`abigen!`](../abigen/index.md) (or uses the [`::fuels::macros::TryFrom`](https://docs.rs/fuels/latest/fuels/macros/derive.TryFrom.html) derivation) then you can also use `try_into` to convert bytes into a type that implements both [`Parameterize`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Parameterize.html) and [`Tokenizable`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Tokenizable.html):

```rust,ignore
#[cfg(test)]
mod tests {
    use fuels::{
        core::codec::{DecoderConfig, EncoderConfig},
        types::errors::Result,
    };

    #[test]
    fn encoding_a_type() -> Result<()> {
        //ANCHOR: encoding_example
        use fuels::{
            core::{codec::ABIEncoder, traits::Tokenizable},
            macros::Tokenizable,
        };

        #[derive(Tokenizable)]
        struct MyStruct {
            field: u64,
        }

        let instance = MyStruct { field: 101 };
        let _encoded: Vec<u8> = ABIEncoder::default().encode(&[instance.into_token()])?;
        //ANCHOR_END: encoding_example

        Ok(())
    }
    #[test]
    fn encoding_via_macro() -> Result<()> {
        //ANCHOR: encoding_example_w_macro
        use fuels::{core::codec::calldata, macros::Tokenizable};

        #[derive(Tokenizable)]
        struct MyStruct {
            field: u64,
        }
        let _: Vec<u8> = calldata!(MyStruct { field: 101 }, MyStruct { field: 102 })?;
        //ANCHOR_END: encoding_example_w_macro

        Ok(())
    }

    #[test]
    fn decoding_example() -> Result<()> {
        // ANCHOR: decoding_example
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
        // ANCHOR_END: decoding_example

        Ok(())
    }

    #[test]
    fn decoding_example_try_into() -> Result<()> {
        // ANCHOR: decoding_example_try_into
        use fuels::macros::{Parameterize, Tokenizable, TryFrom};

        #[derive(Parameterize, Tokenizable, TryFrom)]
        struct MyStruct {
            field: u64,
        }

        let bytes: &[u8] = &[0, 0, 0, 0, 0, 0, 0, 101];

        let _: MyStruct = bytes.try_into()?;
        // ANCHOR_END: decoding_example_try_into

        Ok(())
    }

    #[test]
    fn configuring_the_decoder() -> Result<()> {
        // ANCHOR: configuring_the_decoder

        use fuels::core::codec::ABIDecoder;

        ABIDecoder::new(DecoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
        // ANCHOR_END: configuring_the_decoder

        Ok(())
    }

    #[test]
    fn configuring_the_encoder() -> Result<()> {
        // ANCHOR: configuring_the_encoder
        use fuels::core::codec::ABIEncoder;

        ABIEncoder::new(EncoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
        // ANCHOR_END: configuring_the_encoder

        Ok(())
    }
}
```

Under the hood, [`try_from_bytes`](https://docs.rs/fuels/latest/fuels/core/codec/fn.try_from_bytes.html) is being called, which does what the preceding example did.

## Configuring the decoder

The decoder can be configured to limit its resource expenditure:

```rust,ignore
#[cfg(test)]
mod tests {
    use fuels::{
        core::codec::{DecoderConfig, EncoderConfig},
        types::errors::Result,
    };

    #[test]
    fn encoding_a_type() -> Result<()> {
        //ANCHOR: encoding_example
        use fuels::{
            core::{codec::ABIEncoder, traits::Tokenizable},
            macros::Tokenizable,
        };

        #[derive(Tokenizable)]
        struct MyStruct {
            field: u64,
        }

        let instance = MyStruct { field: 101 };
        let _encoded: Vec<u8> = ABIEncoder::default().encode(&[instance.into_token()])?;
        //ANCHOR_END: encoding_example

        Ok(())
    }
    #[test]
    fn encoding_via_macro() -> Result<()> {
        //ANCHOR: encoding_example_w_macro
        use fuels::{core::codec::calldata, macros::Tokenizable};

        #[derive(Tokenizable)]
        struct MyStruct {
            field: u64,
        }
        let _: Vec<u8> = calldata!(MyStruct { field: 101 }, MyStruct { field: 102 })?;
        //ANCHOR_END: encoding_example_w_macro

        Ok(())
    }

    #[test]
    fn decoding_example() -> Result<()> {
        // ANCHOR: decoding_example
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
        // ANCHOR_END: decoding_example

        Ok(())
    }

    #[test]
    fn decoding_example_try_into() -> Result<()> {
        // ANCHOR: decoding_example_try_into
        use fuels::macros::{Parameterize, Tokenizable, TryFrom};

        #[derive(Parameterize, Tokenizable, TryFrom)]
        struct MyStruct {
            field: u64,
        }

        let bytes: &[u8] = &[0, 0, 0, 0, 0, 0, 0, 101];

        let _: MyStruct = bytes.try_into()?;
        // ANCHOR_END: decoding_example_try_into

        Ok(())
    }

    #[test]
    fn configuring_the_decoder() -> Result<()> {
        // ANCHOR: configuring_the_decoder

        use fuels::core::codec::ABIDecoder;

        ABIDecoder::new(DecoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
        // ANCHOR_END: configuring_the_decoder

        Ok(())
    }

    #[test]
    fn configuring_the_encoder() -> Result<()> {
        // ANCHOR: configuring_the_encoder
        use fuels::core::codec::ABIEncoder;

        ABIEncoder::new(EncoderConfig {
            max_depth: 5,
            max_tokens: 100,
        });
        // ANCHOR_END: configuring_the_encoder

        Ok(())
    }
}
```

<!-- TODO: Add a link once a release is made -->
<!-- https://docs.rs/fuels/latest/fuels/core/codec/struct.DecoderConfig.html -->
For an explanation of each configuration value visit the `DecoderConfig`.

<!-- TODO: add a link once a release is made -->
<!-- https://docs.rs/fuels/latest/fuels/core/codec/struct.DecoderConfig.html -->
The default values for the `DecoderConfig` are:

```rust,ignore
mod bounded_decoder;
mod decode_as_debug_str;

use std::io::Read;

use crate::{
    codec::abi_decoder::{
        bounded_decoder::BoundedDecoder, decode_as_debug_str::decode_as_debug_str,
    },
    types::{errors::Result, param_types::ParamType, Token},
};

#[derive(Debug, Clone, Copy)]
pub struct DecoderConfig {
    /// Entering a struct, array, tuple, enum or vector increases the depth. Decoding will fail if
    /// the current depth becomes greater than `max_depth` configured here.
    pub max_depth: usize,
    /// Every decoded Token will increase the token count. Decoding will fail if the current
    /// token count becomes greater than `max_tokens` configured here.
    pub max_tokens: usize,
}

// ANCHOR: default_decoder_config
impl Default for DecoderConfig {
    fn default() -> Self {
        Self {
            max_depth: 45,
            max_tokens: 10_000,
        }
    }
}
// ANCHOR_END: default_decoder_config

#[derive(Default)]
pub struct ABIDecoder {
    pub config: DecoderConfig,
}

impl ABIDecoder {
    pub fn new(config: DecoderConfig) -> Self {
        Self { config }
    }

    /// Decodes `bytes` following the schema described in `param_type` into its respective `Token`.
    ///
    /// # Arguments
    ///
    /// * `param_type`: The `ParamType` of the type we expect is encoded
    ///                  inside `bytes`.
    /// * `bytes`:       The bytes to be used in the decoding process.
    /// # Examples
    ///
    /// ```
    /// use fuels_core::codec::ABIDecoder;
    /// use fuels_core::traits::Tokenizable;
    /// use fuels_core::types::param_types::ParamType;
    ///
    /// let decoder = ABIDecoder::default();
    ///
    /// let token = decoder.decode(&ParamType::U64,  [0, 0, 0, 0, 0, 0, 0, 7].as_slice()).unwrap();
    ///
    /// assert_eq!(u64::from_token(token).unwrap(), 7u64);
    /// ```
    pub fn decode(&self, param_type: &ParamType, mut bytes: impl Read) -> Result<Token> {
        BoundedDecoder::new(self.config).decode(param_type, &mut bytes)
    }

    /// Same as `decode` but decodes multiple `ParamType`s in one go.
    /// # Examples
    /// ```
    /// use fuels_core::codec::ABIDecoder;
    /// use fuels_core::types::param_types::ParamType;
    /// use fuels_core::types::Token;
    ///
    /// let decoder = ABIDecoder::default();
    /// let data = [7, 8];
    ///
    /// let tokens = decoder.decode_multiple(&[ParamType::U8, ParamType::U8], data.as_slice()).unwrap();
    ///
    /// assert_eq!(tokens, vec![Token::U8(7), Token::U8(8)]);
    /// ```
    pub fn decode_multiple(
        &self,
        param_types: &[ParamType],
        mut bytes: impl Read,
    ) -> Result<Vec<Token>> {
        BoundedDecoder::new(self.config).decode_multiple(param_types, &mut bytes)
    }

    /// Decodes `bytes` following the schema described in `param_type` into its respective debug
    /// string.
    ///
    /// # Arguments
    ///
    /// * `param_type`: The `ParamType` of the type we expect is encoded
    ///                  inside `bytes`.
    /// * `bytes`:       The bytes to be used in the decoding process.
    /// # Examples
    ///
    /// ```
    /// use fuels_core::codec::ABIDecoder;
    /// use fuels_core::types::param_types::ParamType;
    ///
    /// let decoder = ABIDecoder::default();
    ///
    /// let debug_string = decoder.decode_as_debug_str(&ParamType::U64,  [0, 0, 0, 0, 0, 0, 0, 7].as_slice()).unwrap();
    /// let expected_value = 7u64;
    ///
    /// assert_eq!(debug_string, format!("{expected_value}"));
    /// ```
    pub fn decode_as_debug_str(
        &self,
        param_type: &ParamType,
        mut bytes: impl Read,
    ) -> Result<String> {
        let token = BoundedDecoder::new(self.config).decode(param_type, &mut bytes)?;
        decode_as_debug_str(param_type, &token)
    }

    pub fn decode_multiple_as_debug_str(
        &self,
        param_types: &[ParamType],
        mut bytes: impl Read,
    ) -> Result<Vec<String>> {
        let token = BoundedDecoder::new(self.config).decode_multiple(param_types, &mut bytes)?;
        token
            .into_iter()
            .zip(param_types)
            .map(|(token, param_type)| decode_as_debug_str(param_type, &token))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use std::vec;

    use ParamType::*;

    use super::*;
    use crate::{
        constants::WORD_SIZE,
        to_named,
        traits::Parameterize,
        types::{errors::Error, param_types::EnumVariants, StaticStringToken, U256},
    };

    #[test]
    fn decode_multiple_uint() -> Result<()> {
        let types = vec![
            ParamType::U8,
            ParamType::U16,
            ParamType::U32,
            ParamType::U64,
            ParamType::U128,
            ParamType::U256,
        ];

        let data = [
            255, // u8
            255, 255, // u16
            255, 255, 255, 255, // u32
            255, 255, 255, 255, 255, 255, 255, 255, // u64
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, // u128
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, // u256
        ];

        let decoded = ABIDecoder::default().decode_multiple(&types, data.as_slice())?;

        let expected = vec![
            Token::U8(u8::MAX),
            Token::U16(u16::MAX),
            Token::U32(u32::MAX),
            Token::U64(u64::MAX),
            Token::U128(u128::MAX),
            Token::U256(U256::MAX),
        ];
        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_bool() -> Result<()> {
        let types = vec![ParamType::Bool, ParamType::Bool];
        let data = [1, 0];

        let decoded = ABIDecoder::default().decode_multiple(&types, data.as_slice())?;

        let expected = vec![Token::Bool(true), Token::Bool(false)];

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_b256() -> Result<()> {
        let data = [
            213, 87, 156, 70, 223, 204, 127, 24, 32, 112, 19, 230, 91, 68, 228, 203, 78, 44, 34,
            152, 244, 172, 69, 123, 168, 248, 39, 67, 243, 30, 147, 11,
        ];

        let decoded = ABIDecoder::default().decode(&ParamType::B256, data.as_slice())?;

        assert_eq!(decoded, Token::B256(data));

        Ok(())
    }

    #[test]
    fn decode_string_array() -> Result<()> {
        let types = vec![ParamType::StringArray(23), ParamType::StringArray(5)];
        let data = [
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, //This is a full sentence
            72, 101, 108, 108, 111, // Hello
        ];

        let decoded = ABIDecoder::default().decode_multiple(&types, data.as_slice())?;

        let expected = vec![
            Token::StringArray(StaticStringToken::new(
                "This is a full sentence".into(),
                Some(23),
            )),
            Token::StringArray(StaticStringToken::new("Hello".into(), Some(5))),
        ];

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_string_slice() -> Result<()> {
        let data = [
            0, 0, 0, 0, 0, 0, 0, 23, // [length]
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, //This is a full sentence
        ];

        let decoded = ABIDecoder::default().decode(&ParamType::StringSlice, data.as_slice())?;

        let expected = Token::StringSlice(StaticStringToken::new(
            "This is a full sentence".into(),
            None,
        ));

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_string() -> Result<()> {
        let data = [
            0, 0, 0, 0, 0, 0, 0, 23, // [length]
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, //This is a full sentence
        ];

        let decoded = ABIDecoder::default().decode(&ParamType::String, data.as_slice())?;

        let expected = Token::String("This is a full sentence".to_string());

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_tuple() -> Result<()> {
        let param_type = ParamType::Tuple(vec![ParamType::U32, ParamType::Bool]);
        let data = [
            0, 0, 0, 255, //u32
            1,   //bool
        ];

        let result = ABIDecoder::default().decode(&param_type, data.as_slice())?;

        let expected = Token::Tuple(vec![Token::U32(255), Token::Bool(true)]);

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn decode_array() -> Result<()> {
        let types = vec![ParamType::Array(Box::new(ParamType::U8), 2)];
        let data = [255, 42];

        let decoded = ABIDecoder::default().decode_multiple(&types, data.as_slice())?;

        let expected = vec![Token::Array(vec![Token::U8(255), Token::U8(42)])];
        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_struct() -> Result<()> {
        // struct MyStruct {
        //     foo: u8,
        //     bar: bool,
        // }

        let data = [1, 1];

        let param_type = ParamType::Struct {
            name: "".to_string(),
            fields: to_named(&[ParamType::U8, ParamType::Bool]),
            generics: vec![],
        };

        let decoded = ABIDecoder::default().decode(&param_type, data.as_slice())?;

        let expected = Token::Struct(vec![Token::U8(1), Token::Bool(true)]);

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_bytes() -> Result<()> {
        let data = [0, 0, 0, 0, 0, 0, 0, 7, 255, 0, 1, 2, 3, 4, 5];

        let decoded = ABIDecoder::default().decode(&ParamType::Bytes, data.as_slice())?;

        let expected = Token::Bytes([255, 0, 1, 2, 3, 4, 5].to_vec());

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_raw_slice() -> Result<()> {
        let data = [0, 0, 0, 0, 0, 0, 0, 7, 255, 0, 1, 2, 3, 4, 5];

        let decoded = ABIDecoder::default().decode(&ParamType::RawSlice, data.as_slice())?;

        let expected = Token::RawSlice([255, 0, 1, 2, 3, 4, 5].to_vec());

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_enum() -> Result<()> {
        // enum MyEnum {
        //     x: u32,
        //     y: bool,
        // }

        let types = to_named(&[ParamType::U32, ParamType::Bool]);
        let inner_enum_types = EnumVariants::new(types)?;
        let types = vec![ParamType::Enum {
            name: "".to_string(),
            enum_variants: inner_enum_types.clone(),
            generics: vec![],
        }];

        let data = [
            0, 0, 0, 0, 0, 0, 0, 0, // discriminant
            0, 0, 0, 42, // u32
        ];

        let decoded = ABIDecoder::default().decode_multiple(&types, data.as_slice())?;

        let expected = vec![Token::Enum(Box::new((0, Token::U32(42), inner_enum_types)))];
        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn decode_nested_struct() -> Result<()> {
        // struct Foo {
        //     x: u16,
        //     y: Bar,
        // }
        //
        // struct Bar {
        //     a: bool,
        //     b: u8[2],
        // }

        let fields = to_named(&[
            ParamType::U16,
            ParamType::Struct {
                name: "".to_string(),
                fields: to_named(&[
                    ParamType::Bool,
                    ParamType::Array(Box::new(ParamType::U8), 2),
                ]),
                generics: vec![],
            },
        ]);
        let nested_struct = ParamType::Struct {
            name: "".to_string(),
            fields,
            generics: vec![],
        };

        let data = [0, 10, 1, 1, 2];

        let decoded = ABIDecoder::default().decode(&nested_struct, data.as_slice())?;

        let my_nested_struct = vec![
            Token::U16(10),
            Token::Struct(vec![
                Token::Bool(true),
                Token::Array(vec![Token::U8(1), Token::U8(2)]),
            ]),
        ];

        assert_eq!(decoded, Token::Struct(my_nested_struct));

        Ok(())
    }

    #[test]
    fn decode_comprehensive() -> Result<()> {
        // struct Foo {
        //     x: u16,
        //     y: Bar,
        // }
        //
        // struct Bar {
        //     a: bool,
        //     b: u8[2],
        // }

        // fn: long_function(Foo,u8[2],b256,str[3],str)

        // Parameters
        let fields = to_named(&[
            ParamType::U16,
            ParamType::Struct {
                name: "".to_string(),
                fields: to_named(&[
                    ParamType::Bool,
                    ParamType::Array(Box::new(ParamType::U8), 2),
                ]),
                generics: vec![],
            },
        ]);
        let nested_struct = ParamType::Struct {
            name: "".to_string(),
            fields,
            generics: vec![],
        };

        let u8_arr = ParamType::Array(Box::new(ParamType::U8), 2);
        let b256 = ParamType::B256;

        let types = [nested_struct, u8_arr, b256];

        let bytes = [
            0, 10, // u16
            1,  // bool
            1, 2, // array[u8;2]
            1, 2, // array[u8;2]
            213, 87, 156, 70, 223, 204, 127, 24, 32, 112, 19, 230, 91, 68, 228, 203, 78, 44, 34,
            152, 244, 172, 69, 123, 168, 248, 39, 67, 243, 30, 147, 11, // b256
        ];

        let decoded = ABIDecoder::default().decode_multiple(&types, bytes.as_slice())?;

        // Expected tokens
        let foo = Token::Struct(vec![
            Token::U16(10),
            Token::Struct(vec![
                Token::Bool(true),
                Token::Array(vec![Token::U8(1), Token::U8(2)]),
            ]),
        ]);

        let u8_arr = Token::Array(vec![Token::U8(1), Token::U8(2)]);

        let b256 = Token::B256([
            213, 87, 156, 70, 223, 204, 127, 24, 32, 112, 19, 230, 91, 68, 228, 203, 78, 44, 34,
            152, 244, 172, 69, 123, 168, 248, 39, 67, 243, 30, 147, 11,
        ]);

        let expected: Vec<Token> = vec![foo, u8_arr, b256];

        assert_eq!(decoded, expected);

        Ok(())
    }

    #[test]
    fn enums_with_all_unit_variants_are_decoded_from_one_word() -> Result<()> {
        let data = [0, 0, 0, 0, 0, 0, 0, 1];
        let types = to_named(&[ParamType::Unit, ParamType::Unit]);
        let enum_variants = EnumVariants::new(types)?;
        let enum_w_only_units = ParamType::Enum {
            name: "".to_string(),
            enum_variants: enum_variants.clone(),
            generics: vec![],
        };

        let result = ABIDecoder::default().decode(&enum_w_only_units, data.as_slice())?;

        let expected_enum = Token::Enum(Box::new((1, Token::Unit, enum_variants)));
        assert_eq!(result, expected_enum);

        Ok(())
    }

    #[test]
    fn out_of_bounds_discriminant_is_detected() -> Result<()> {
        let data = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2];
        let types = to_named(&[ParamType::U64]);
        let enum_variants = EnumVariants::new(types)?;
        let enum_type = ParamType::Enum {
            name: "".to_string(),
            enum_variants,
            generics: vec![],
        };

        let result = ABIDecoder::default().decode(&enum_type, data.as_slice());

        let error = result.expect_err("should have resulted in an error");

        let expected_msg = "discriminant `1` doesn't point to any variant: ";
        assert!(matches!(error, Error::Other(str) if str.starts_with(expected_msg)));

        Ok(())
    }

    #[test]
    pub fn division_by_zero() {
        let param_type = Vec::<[u16; 0]>::param_type();
        let result = ABIDecoder::default().decode(&param_type, [].as_slice());
        assert!(matches!(result, Err(Error::IO(_))));
    }

    #[test]
    pub fn multiply_overflow_enum() {
        let result = ABIDecoder::default().decode(
            &Enum {
                name: "".to_string(),
                enum_variants: EnumVariants::new(to_named(&[
                    Array(Box::new(Array(Box::new(RawSlice), 8)), usize::MAX),
                    B256,
                    B256,
                    B256,
                    B256,
                    B256,
                    B256,
                    B256,
                    B256,
                    B256,
                    B256,
                ]))
                .unwrap(),
                generics: vec![U16],
            },
            [].as_slice(),
        );

        assert!(matches!(result, Err(Error::IO(_))));
    }

    #[test]
    pub fn multiply_overflow_arith() {
        let mut param_type: ParamType = U16;
        for _ in 0..50 {
            param_type = Array(Box::new(param_type), 8);
        }
        let result = ABIDecoder::default().decode(
            &Enum {
                name: "".to_string(),
                enum_variants: EnumVariants::new(to_named(&[param_type])).unwrap(),
                generics: vec![U16],
            },
            [].as_slice(),
        );
        assert!(matches!(result, Err(Error::IO(_))));
    }

    #[test]
    pub fn capacity_overflow() {
        let result = ABIDecoder::default().decode(
            &Array(Box::new(Array(Box::new(Tuple(vec![])), usize::MAX)), 1),
            [].as_slice(),
        );
        assert!(matches!(result, Err(Error::Codec(_))));
    }

    #[test]
    pub fn stack_overflow() {
        let mut param_type: ParamType = U16;
        for _ in 0..13500 {
            param_type = Vector(Box::new(param_type));
        }
        let result = ABIDecoder::default().decode(&param_type, [].as_slice());
        assert!(matches!(result, Err(Error::IO(_))));
    }

    #[test]
    pub fn capacity_malloc() {
        let param_type = Array(Box::new(U8), usize::MAX);
        let result = ABIDecoder::default().decode(&param_type, [].as_slice());
        assert!(matches!(result, Err(Error::IO(_))));
    }

    #[test]
    fn max_depth_surpassed() {
        const MAX_DEPTH: usize = 2;
        let config = DecoderConfig {
            max_depth: MAX_DEPTH,
            ..Default::default()
        };
        let msg = format!("depth limit `{MAX_DEPTH}` reached while decoding. Try increasing it");
        // for each nested enum so that it may read the discriminant
        let data = [0; MAX_DEPTH * WORD_SIZE];

        [nested_struct, nested_enum, nested_tuple, nested_array]
            .iter()
            .map(|fun| fun(MAX_DEPTH + 1))
            .for_each(|param_type| {
                assert_decoding_failed_w_data(config, &param_type, &msg, data.as_slice());
            })
    }

    #[test]
    fn depth_is_not_reached() {
        const MAX_DEPTH: usize = 3;
        const ACTUAL_DEPTH: usize = MAX_DEPTH - 1;

        // enough data to decode 2*ACTUAL_DEPTH enums (discriminant + u8 = 2*WORD_SIZE)
        let data = [0; 2 * ACTUAL_DEPTH * (WORD_SIZE * 2)];
        let config = DecoderConfig {
            max_depth: MAX_DEPTH,
            ..Default::default()
        };

        [nested_struct, nested_enum, nested_tuple, nested_array]
            .into_iter()
            .map(|fun| fun(ACTUAL_DEPTH))
            .map(|param_type| {
                // Wrapping everything in a structure so that we may check whether the depth is
                // decremented after finishing every struct field.
                ParamType::Struct {
                    name: "".to_string(),
                    fields: to_named(&[param_type.clone(), param_type]),
                    generics: vec![],
                }
            })
            .for_each(|param_type| {
                ABIDecoder::new(config)
                    .decode(&param_type, data.as_slice())
                    .unwrap();
            })
    }

    #[test]
    fn too_many_tokens() {
        let config = DecoderConfig {
            max_tokens: 3,
            ..Default::default()
        };
        {
            let data = [0; 3 * WORD_SIZE];
            let inner_param_types = vec![ParamType::U64; 3];
            for param_type in [
                ParamType::Struct {
                    name: "".to_string(),
                    fields: to_named(&inner_param_types),
                    generics: vec![],
                },
                ParamType::Tuple(inner_param_types.clone()),
                ParamType::Array(Box::new(ParamType::U64), 3),
            ] {
                assert_decoding_failed_w_data(
                    config,
                    &param_type,
                    "token limit `3` reached while decoding. Try increasing it",
                    &data,
                );
            }
        }
        {
            let data = [0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 3];

            assert_decoding_failed_w_data(
                config,
                &ParamType::Vector(Box::new(ParamType::U8)),
                "token limit `3` reached while decoding. Try increasing it",
                &data,
            );
        }
    }

    #[test]
    fn token_count_is_being_reset_between_decodings() {
        // given
        let config = DecoderConfig {
            max_tokens: 3,
            ..Default::default()
        };

        let param_type = ParamType::Array(Box::new(ParamType::StringArray(0)), 2);

        let decoder = ABIDecoder::new(config);
        decoder.decode(&param_type, [].as_slice()).unwrap();

        // when
        let result = decoder.decode(&param_type, [].as_slice());

        // then
        result.expect("element count to be reset");
    }

    fn assert_decoding_failed_w_data(
        config: DecoderConfig,
        param_type: &ParamType,
        msg: &str,
        data: &[u8],
    ) {
        let decoder = ABIDecoder::new(config);

        let err = decoder.decode(param_type, data);

        let Err(Error::Codec(actual_msg)) = err else {
            panic!("expected a `Codec` error. Got: `{err:?}`");
        };

        assert_eq!(actual_msg, msg);
    }

    fn nested_struct(depth: usize) -> ParamType {
        let fields = if depth == 1 {
            vec![]
        } else {
            to_named(&[nested_struct(depth - 1)])
        };

        ParamType::Struct {
            name: "".to_string(),
            fields,
            generics: vec![],
        }
    }

    fn nested_enum(depth: usize) -> ParamType {
        let fields = if depth == 1 {
            to_named(&[ParamType::U8])
        } else {
            to_named(&[nested_enum(depth - 1)])
        };

        ParamType::Enum {
            name: "".to_string(),
            enum_variants: EnumVariants::new(fields).unwrap(),
            generics: vec![],
        }
    }

    fn nested_array(depth: usize) -> ParamType {
        let field = if depth == 1 {
            ParamType::U8
        } else {
            nested_array(depth - 1)
        };

        ParamType::Array(Box::new(field), 1)
    }

    fn nested_tuple(depth: usize) -> ParamType {
        let fields = if depth == 1 {
            vec![ParamType::U8]
        } else {
            vec![nested_tuple(depth - 1)]
        };

        ParamType::Tuple(fields)
    }
}
```

## Configuring the decoder for contract/script calls

You can also configure the decoder used to decode the return value of the contract method:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::{collections::HashSet, time::Duration};

    use fuels::{
        core::codec::{encode_fn_selector, ABIFormatter, DecoderConfig, EncoderConfig},
        crypto::SecretKey,
        prelude::{LoadConfiguration, NodeConfig, StorageConfiguration},
        programs::debug::ScriptType,
        test_helpers::{ChainConfig, StateConfig},
        types::{
            errors::{transaction::Reason, Result},
            Bits256,
        },
    };
    use rand::Rng;

    #[tokio::test]
    async fn instantiate_client() -> Result<()> {
        // ANCHOR: instantiate_client
        use fuels::prelude::{FuelService, Provider};

        // Run the fuel node.
        let server = FuelService::start(
            NodeConfig::default(),
            ChainConfig::default(),
            StateConfig::default(),
        )
        .await?;

        // Create a client that will talk to the node created above.
        let client = Provider::from(server.bound_address()).await?;
        assert!(client.healthy().await?);
        // ANCHOR_END: instantiate_client
        Ok(())
    }

    #[tokio::test]
    async fn deploy_contract() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract
        // This helper will launch a local node and provide a test wallet linked to it
        let wallet = launch_provider_and_get_wallet().await?;

        // This will load and deploy your contract binary to the chain so that its ID can
        // be used to initialize the instance
        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR_END: deploy_contract

        Ok(())
    }

    #[tokio::test]
    async fn setup_program_test_example() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract_setup_macro_short
        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: deploy_contract_setup_macro_short

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_cost_estimation
        let contract_instance = MyContract::new(contract_id, wallet);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: contract_call_cost_estimation

        let expected_gas = 2816;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_parameters() -> std::result::Result<(), Box<dyn std::error::Error>> {
        use fuels::{prelude::*, tx::StorageSlot, types::Bytes32};
        use rand::prelude::{Rng, SeedableRng, StdRng};

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");

        // ANCHOR: deploy_with_parameters
        // Optional: Add `Salt`
        let rng = &mut StdRng::seed_from_u64(2322u64);
        let salt: [u8; 32] = rng.gen();

        // Optional: Configure storage
        let key = Bytes32::from([1u8; 32]);
        let value = Bytes32::from([2u8; 32]);
        let storage_slot = StorageSlot::new(key, value);
        let storage_configuration =
            StorageConfiguration::default().add_slot_overrides([storage_slot]);
        let configuration = LoadConfiguration::default()
            .with_storage_configuration(storage_configuration)
            .with_salt(salt);

        // Optional: Configure deployment parameters
        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            configuration,
        )?
        .deploy(&wallet, tx_policies)
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        // ANCHOR_END: deploy_with_parameters

        assert_ne!(contract_id_1, contract_id_2);

        // ANCHOR: use_deployed_contract
        // This will generate your contract's methods onto `MyContract`.
        // This means an instance of `MyContract` will have access to all
        // your contract's methods that are running on-chain!
        // ANCHOR: abigen_example
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        // ANCHOR_END: abigen_example

        // This is an instance of your contract which you can use to make calls to your functions
        let contract_instance = MyContract::new(contract_id_2, wallet);

        let response = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call() // Perform the network call
            .await?;

        assert_eq!(42, response.value);

        let response = contract_instance
            .methods()
            .increment_counter(10)
            .call()
            .await?;

        assert_eq!(52, response.value);
        // ANCHOR_END: use_deployed_contract

        // ANCHOR: submit_response_contract
        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .submit()
            .await?;

        tokio::time::sleep(Duration::from_millis(500)).await;
        let value = response.response().await?.value;

        // ANCHOR_END: submit_response_contract
        assert_eq!(42, value);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_multiple_wallets() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallets =
            launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None).await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallets[0], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");
        let contract_instance_1 = MyContract::new(contract_id_1, wallets[0].clone());

        let response = contract_instance_1
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default().with_salt([1; 32]),
        )?
        .deploy(&wallets[1], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        let contract_instance_2 = MyContract::new(contract_id_2, wallets[1].clone());

        let response = contract_instance_2
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call()
            .await?;

        assert_eq!(42, response.value);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn contract_tx_and_call_params() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR: tx_policies
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();

        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let response = contract_methods
            .initialize_counter(42) // Our contract method
            .with_tx_policies(tx_policies) // Chain the tx policies
            .call() // Perform the contract call
            .await?; // This is an async call, `.await` it.
                     // ANCHOR_END: tx_policies

        // ANCHOR: tx_policies_default
        let response = contract_methods
            .initialize_counter(42)
            .with_tx_policies(TxPolicies::default())
            .call()
            .await?;
        // ANCHOR_END: tx_policies_default

        // ANCHOR: call_parameters
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let tx_policies = TxPolicies::default();

        // Forward 1_000_000 coin amount of base asset_id
        // this is a big number for checking that amount can be a u64
        let call_params = CallParameters::default().with_amount(1_000_000);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_parameters

        // ANCHOR: call_parameters_default
        let response = contract_methods
            .initialize_counter(42)
            .call_params(CallParameters::default())?
            .call()
            .await?;
        // ANCHOR_END: call_parameters_default
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn token_ops_tests() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/token_ops/out/release/token_ops-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/token_ops/out/release/token_ops\
        .bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();
        // ANCHOR: simulate
        // you would mint 100 coins if the transaction wasn't simulated
        let counter = contract_methods
            .mint_coins(100)
            .simulate(Execution::Realistic)
            .await?;
        // ANCHOR_END: simulate

        {
            let contract_id = contract_id.clone();
            // ANCHOR: simulate_read_state
            // you don't need any funds to read state
            let balance = contract_methods
                .get_balance(contract_id, AssetId::zeroed())
                .simulate(Execution::StateReadOnly)
                .await?
                .value;
            // ANCHOR_END: simulate_read_state
        }

        let response = contract_methods.mint_coins(1_000_000).call().await?;
        // ANCHOR: variable_outputs
        let address = wallet.address();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());

        // withdraw some tokens to wallet
        let response = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await?;
        // ANCHOR_END: variable_outputs
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn dependency_estimation() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let called_contract_id: ContractId = Contract::load_from(
            "../../e2e/sway/contracts/lib_contract/out/release/lib_contract.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?
        .into();

        let bin_path =
            "../../e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller.bin";
        let caller_contract_id = Contract::load_from(bin_path, LoadConfiguration::default())?
            .deploy(&wallet, TxPolicies::default())
            .await?;

        let contract_methods =
            MyContract::new(caller_contract_id.clone(), wallet.clone()).methods();

        // ANCHOR: dependency_estimation_fail
        let address = wallet.address();
        let amount = 100;

        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .call()
            .await;

        assert!(matches!(
            response,
            Err(Error::Transaction(Reason::Reverted { .. }))
        ));
        // ANCHOR_END: dependency_estimation_fail

        // ANCHOR: dependency_estimation_manual
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .with_contract_ids(&[called_contract_id.into()])
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation_manual

        let asset_id = caller_contract_id.asset_id(&Bits256::zeroed());
        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, amount);

        // ANCHOR: dependency_estimation
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
            .determine_missing_contracts(Some(2))
            .await?
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation

        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, 2 * amount);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn get_contract_outputs() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deployed_contracts
        abigen!(Contract(
            name = "MyContract",
            // Replace with your contract ABI.json path
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        let wallet_original = launch_provider_and_get_wallet().await?;

        let wallet = wallet_original.clone();
        // Your bech32m encoded contract ID.
        let contract_id: Bech32ContractId =
            "fuel1vkm285ypjesypw7vhdlhnty3kjxxx4efckdycqh3ttna4xvmxtfs6murwy".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // You can now use the `connected_contract_instance` just as you did above!
        // ANCHOR_END: deployed_contracts

        let wallet = wallet_original;
        // ANCHOR: deployed_contracts_hex
        let contract_id: ContractId =
            "0x65b6a3d081966040bbccbb7f79ac91b48c635729c59a4c02f15ae7da999b32d3".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // ANCHOR_END: deployed_contracts_hex

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn call_params_gas() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: call_params_gas
        // Set the transaction `gas_limit` to 1_000_000 and `gas_forwarded` to 4300 to specify that
        // the contract call transaction may consume up to 1_000_000 gas, while the actual call may
        // only use 4300 gas
        let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
        let call_params = CallParameters::default().with_gas_forwarded(4300);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_params_gas
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_example() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: multi_call_prepare
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);
        // ANCHOR_END: multi_call_prepare

        // ANCHOR: multi_call_build
        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);
        // ANCHOR_END: multi_call_build
        let multi_call_handler_tmp = multi_call_handler.clone();

        // ANCHOR: multi_call_values
        let (counter, array): (u64, [u64; 2]) = multi_call_handler.call().await?.value;
        // ANCHOR_END: multi_call_values

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: multi_contract_call_response
        let response = multi_call_handler.call::<(u64, [u64; 2])>().await?;
        // ANCHOR_END: multi_contract_call_response

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: submit_response_multicontract
        let submitted_tx = multi_call_handler.submit().await?;
        tokio::time::sleep(Duration::from_millis(500)).await;
        let (counter, array): (u64, [u64; 2]) = submitted_tx.response().await?.value;
        // ANCHOR_END: submit_response_multicontract

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: multi_call_cost_estimation
        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);

        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = multi_call_handler
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: multi_call_cost_estimation

        let expected_gas = 4402;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn connect_wallet() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let config = WalletsConfig::new(Some(2), Some(1), Some(DEFAULT_COIN_AMOUNT));
        let mut wallets = launch_custom_provider_and_get_wallets(config, None, None).await?;
        let wallet_1 = wallets.pop().unwrap();
        let wallet_2 = wallets.pop().unwrap();

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet_1, TxPolicies::default())
        .await?;

        // ANCHOR: connect_wallet
        // Create contract instance with wallet_1
        let contract_instance = MyContract::new(contract_id, wallet_1.clone());

        // Perform contract call with wallet_2
        let response = contract_instance
            .with_account(wallet_2) // Connect wallet_2
            .methods() // Get contract methods
            .get_msg_amount() // Our contract method
            .call() // Perform the contract call.
            .await?; // This is an async call, `.await` for it.
                     // ANCHOR_END: connect_wallet

        Ok(())
    }

    #[tokio::test]
    async fn custom_assets_example() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let other_wallet = WalletUnlocked::new_random(None);

        // ANCHOR: add_custom_assets
        let amount = 1000;
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .add_custom_asset(
                AssetId::zeroed(),
                amount,
                Some(other_wallet.address().clone()),
            )
            .call()
            .await?;
        // ANCHOR_END: add_custom_assets

        Ok(())
    }

    #[tokio::test]
    async fn low_level_call_example() -> Result<()> {
        use fuels::{core::codec::calldata, prelude::*, types::SizedAsciiString};

        setup_program_test!(
            Wallets("wallet"),
            Abigen(
                Contract(
                    name = "MyCallerContract",
                    project = "e2e/sway/contracts/low_level_caller"
                ),
                Contract(
                    name = "MyTargetContract",
                    project = "e2e/sway/contracts/contract_test"
                ),
            ),
            Deploy(
                name = "caller_contract_instance",
                contract = "MyCallerContract",
                wallet = "wallet"
            ),
            Deploy(
                name = "target_contract_instance",
                contract = "MyTargetContract",
                wallet = "wallet"
            ),
        );

        // ANCHOR: low_level_call
        let function_selector = encode_fn_selector("set_value_multiple_complex");
        let call_data = calldata!(
            MyStruct {
                a: true,
                b: [1, 2, 3],
            },
            SizedAsciiString::<4>::try_from("fuel")?
        )?;

        caller_contract_instance
            .methods()
            .call_low_level_call(
                target_contract_instance.id(),
                Bytes(function_selector),
                Bytes(call_data),
            )
            .determine_missing_contracts(None)
            .await?
            .call()
            .await?;
        // ANCHOR_END: low_level_call

        let result_uint = target_contract_instance
            .methods()
            .get_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_bool = target_contract_instance
            .methods()
            .get_bool_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_str = target_contract_instance
            .methods()
            .get_str_value()
            .call()
            .await
            .unwrap()
            .value;

        assert_eq!(result_uint, 2);
        assert!(result_bool);
        assert_eq!(result_str, "fuel");

        Ok(())
    }

    #[tokio::test]
    async fn configure_the_return_value_decoder() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_decoder_config
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .with_decoder_config(DecoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .call()
            .await?;
        // ANCHOR_END: contract_decoder_config

        Ok(())
    }

    #[tokio::test]
    async fn storage_slots_override() -> Result<()> {
        {
            // ANCHOR: storage_slots_override
            use fuels::{programs::contract::Contract, tx::StorageSlot};
            let slot_override = StorageSlot::new([1; 32].into(), [2; 32].into());
            let storage_config =
                StorageConfiguration::default().add_slot_overrides([slot_override]);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_override
        }

        {
            // ANCHOR: storage_slots_disable_autoload
            use fuels::programs::contract::Contract;
            let storage_config = StorageConfiguration::default().with_autoload(false);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_disable_autoload
        }

        Ok(())
    }

    #[tokio::test]
    async fn contract_custom_call() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );
        let provider = wallet.try_provider()?;

        let counter = 42;

        // ANCHOR: contract_call_tb
        let call_handler = contract_instance.methods().initialize_counter(counter);

        let mut tb = call_handler.transaction_builder().await?;

        // customize the builder...

        wallet.adjust_for_fee(&mut tb, 0).await?;
        tb.add_signer(wallet.clone())?;

        let tx = tb.build(provider).await?;

        let tx_id = provider.send_transaction(tx).await?;
        tokio::time::sleep(Duration::from_millis(500)).await;

        let tx_status = provider.tx_status(&tx_id).await?;

        let response = call_handler.get_response_from(tx_status)?;

        assert_eq!(counter, response.value);
        // ANCHOR_END: contract_call_tb

        Ok(())
    }

    #[tokio::test]
    async fn configure_encoder_config() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_encoder_config
        let _ = contract_instance
            .with_encoder_config(EncoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .methods()
            .initialize_counter(42)
            .call()
            .await?;
        // ANCHOR_END: contract_encoder_config

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_impersonation() -> Result<()> {
        use std::str::FromStr;

        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let node_config = NodeConfig {
            utxo_validation: false,
            ..Default::default()
        };
        let mut wallet = WalletUnlocked::new_from_private_key(
            SecretKey::from_str(
                "0x4433d156e8c53bf5b50af07aa95a29436f29a94e0ccc5d58df8e57bdc8583c32",
            )?,
            None,
        );
        let coins = setup_single_asset_coins(
            wallet.address(),
            AssetId::zeroed(),
            DEFAULT_NUM_COINS,
            DEFAULT_COIN_AMOUNT,
        );
        let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
        wallet.set_provider(provider.clone());

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_impersonation
        // create impersonator for an address
        let address =
            Address::from_str("0x17f46f562778f4bb5fe368eeae4985197db51d80c83494ea7f84c530172dedd1")
                .unwrap();
        let address = Bech32Address::from(address);
        let impersonator = ImpersonatedAccount::new(address, Some(provider.clone()));

        let contract_instance = MyContract::new(contract_id, impersonator.clone());

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: contract_call_impersonation

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn deploying_via_loader() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            )),
            Wallets("main_wallet")
        );
        let contract_binary =
            "../../e2e/sway/contracts/huge_contract/out/release/huge_contract.bin";

        let provider: Provider = main_wallet.try_provider()?.clone();

        let random_salt = || Salt::new(rand::thread_rng().gen());
        // ANCHOR: show_contract_is_too_big
        let contract = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?;
        let max_allowed = provider
            .consensus_parameters()
            .await?
            .contract_params()
            .contract_max_size();

        assert!(contract.code().len() as u64 > max_allowed);
        // ANCHOR_END: show_contract_is_too_big

        let wallet = main_wallet.clone();

        // ANCHOR: manual_blob_upload_then_deploy
        let max_words_per_blob = 10_000;
        let blobs = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .blobs()
        .to_vec();

        let mut all_blob_ids = vec![];
        let mut already_uploaded_blobs = HashSet::new();
        for blob in blobs {
            let blob_id = blob.id();
            all_blob_ids.push(blob_id);

            // uploading the same blob twice is not allowed
            if already_uploaded_blobs.contains(&blob_id) {
                continue;
            }

            let mut tb = BlobTransactionBuilder::default().with_blob(blob);
            wallet.adjust_for_fee(&mut tb, 0).await?;
            wallet.add_witnesses(&mut tb)?;

            let tx = tb.build(&provider).await?;
            provider
                .send_transaction_and_await_commit(tx)
                .await?
                .check(None)?;

            already_uploaded_blobs.insert(blob_id);
        }

        let contract_id = Contract::loader_from_blob_ids(all_blob_ids, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blob_upload_then_deploy

        // ANCHOR: deploy_via_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: deploy_via_loader

        // ANCHOR: auto_convert_to_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .smart_deploy(&wallet, TxPolicies::default(), max_words_per_blob)
        .await?;
        // ANCHOR_END: auto_convert_to_loader

        // ANCHOR: upload_blobs_then_deploy
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .upload_blobs(&wallet, TxPolicies::default())
        .await?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: upload_blobs_then_deploy

        let wallet = main_wallet.clone();
        // ANCHOR: use_loader
        let contract_instance = MyContract::new(contract_id, wallet);
        let response = contract_instance.methods().something().call().await?.value;
        assert_eq!(response, 1001);
        // ANCHOR_END: use_loader

        // ANCHOR: show_max_tx_size
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_size();
        // ANCHOR_END: show_max_tx_size

        // ANCHOR: show_max_tx_gas
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_gas_per_tx();
        // ANCHOR_END: show_max_tx_gas

        let wallet = main_wallet;
        // ANCHOR: manual_blobs_then_deploy
        let chunk_size = 100_000;
        assert!(
            chunk_size % 8 == 0,
            "all chunks, except the last, must be word-aligned"
        );
        let blobs = contract
            .code()
            .chunks(chunk_size)
            .map(|chunk| Blob::new(chunk.to_vec()))
            .collect();

        let contract_id = Contract::loader_from_blobs(blobs, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blobs_then_deploy

        // ANCHOR: estimate_max_blob_size
        let max_blob_size = BlobTransactionBuilder::default()
            .estimate_max_blob_size(&provider)
            .await?;
        // ANCHOR_END: estimate_max_blob_size

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn decoding_script_transactions() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Wallets("wallet"),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let tx_id = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?
            .tx_id
            .unwrap();

        let provider: &Provider = wallet.try_provider()?;

        // ANCHOR: decoding_script_transactions
        let TransactionType::Script(tx) = provider
            .get_transaction_by_id(&tx_id)
            .await?
            .unwrap()
            .transaction
        else {
            panic!("Transaction is not a script transaction");
        };

        let ScriptType::ContractCall(calls) = ScriptType::detect(tx.script(), tx.script_data())?
        else {
            panic!("Script is not a contract call");
        };

        let json_abi = std::fs::read_to_string(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test-abi.json",
        )?;
        let abi_formatter = ABIFormatter::from_json_abi(json_abi)?;

        let call = &calls[0];
        let fn_selector = call.decode_fn_selector()?;
        let decoded_args =
            abi_formatter.decode_fn_args(&fn_selector, call.encoded_args.as_slice())?;

        eprintln!(
            "The script called: {fn_selector}({})",
            decoded_args.join(", ")
        );

        // ANCHOR_END: decoding_script_transactions
        Ok(())
    }
}
```

The same method is available for script calls.
