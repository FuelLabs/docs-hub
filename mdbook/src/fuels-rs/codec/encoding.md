# Encoding

Be sure to read the [prerequisites](./index.md#prerequisites-for-decodingencoding) to encoding.

Encoding is done via the [`ABIEncoder`](https://docs.rs/fuels/latest/fuels/core/codec/struct.ABIEncoder.html):

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

There is also a shortcut-macro that can encode multiple types which implement [`Tokenizable`](https://docs.rs/fuels/latest/fuels/core/traits/trait.Tokenizable.html):

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

## Configuring the encoder

The encoder can be configured to limit its resource expenditure:

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

The default values for the `EncoderConfig` are:

```rust,ignore
mod bounded_encoder;

use std::default::Default;

use crate::{
    codec::abi_encoder::bounded_encoder::BoundedEncoder,
    types::{errors::Result, Token},
};

#[derive(Debug, Clone, Copy)]
pub struct EncoderConfig {
    /// Entering a struct, array, tuple, enum or vector increases the depth. Encoding will fail if
    /// the current depth becomes greater than `max_depth` configured here.
    pub max_depth: usize,
    /// Every encoded argument will increase the token count. Encoding will fail if the current
    /// token count becomes greater than `max_tokens` configured here.
    pub max_tokens: usize,
}

// ANCHOR: default_encoder_config
impl Default for EncoderConfig {
    fn default() -> Self {
        Self {
            max_depth: 45,
            max_tokens: 10_000,
        }
    }
}
// ANCHOR_END: default_encoder_config

#[derive(Default, Clone, Debug)]
pub struct ABIEncoder {
    pub config: EncoderConfig,
}

impl ABIEncoder {
    pub fn new(config: EncoderConfig) -> Self {
        Self { config }
    }

    /// Encodes `Token`s following the ABI specs defined
    /// [here](https://github.com/FuelLabs/fuel-specs/blob/master/specs/protocol/abi.md)
    pub fn encode(&self, tokens: &[Token]) -> Result<Vec<u8>> {
        BoundedEncoder::new(self.config).encode(tokens)
    }
}

#[cfg(test)]
mod tests {
    use std::slice;

    use super::*;
    use crate::{
        to_named,
        types::{
            errors::Error,
            param_types::{EnumVariants, ParamType},
            StaticStringToken, U256,
        },
    };

    #[test]
    fn encode_multiple_uint() -> Result<()> {
        let tokens = [
            Token::U8(u8::MAX),
            Token::U16(u16::MAX),
            Token::U32(u32::MAX),
            Token::U64(u64::MAX),
            Token::U128(u128::MAX),
            Token::U256(U256::MAX),
        ];

        let result = ABIEncoder::default().encode(&tokens)?;

        let expected = [
            255, // u8
            255, 255, // u16
            255, 255, 255, 255, // u32
            255, 255, 255, 255, 255, 255, 255, 255, // u64
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, // u128
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, // u256
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_bool() -> Result<()> {
        let token = Token::Bool(true);

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [1];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_b256() -> Result<()> {
        let data = [
            213, 87, 156, 70, 223, 204, 127, 24, 32, 112, 19, 230, 91, 68, 228, 203, 78, 44, 34,
            152, 244, 172, 69, 123, 168, 248, 39, 67, 243, 30, 147, 11,
        ];
        let token = Token::B256(data);

        let result = ABIEncoder::default().encode(&[token])?;

        assert_eq!(result, data);

        Ok(())
    }

    #[test]
    fn encode_bytes() -> Result<()> {
        let token = Token::Bytes([255, 0, 1, 2, 3, 4, 5].to_vec());

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 0, 0, 0, 0, 0, 0, 7, // len
            255, 0, 1, 2, 3, 4, 5, // data
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_string() -> Result<()> {
        let token = Token::String("This is a full sentence".to_string());

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 0, 0, 0, 0, 0, 0, 23, // len
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, //This is a full sentence
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_raw_slice() -> Result<()> {
        let token = Token::RawSlice([255, 0, 1, 2, 3, 4, 5].to_vec());

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 0, 0, 0, 0, 0, 0, 7, // len
            255, 0, 1, 2, 3, 4, 5, // data
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_string_array() -> Result<()> {
        let token = Token::StringArray(StaticStringToken::new(
            "This is a full sentence".into(),
            Some(23),
        ));

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, //This is a full sentence
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_string_slice() -> Result<()> {
        let token = Token::StringSlice(StaticStringToken::new(
            "This is a full sentence".into(),
            None,
        ));

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 0, 0, 0, 0, 0, 0, 23, // len
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, //This is a full sentence
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_tuple() -> Result<()> {
        let token = Token::Tuple(vec![Token::U32(255), Token::Bool(true)]);

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 0, 0, 255, //u32
            1,   //bool
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_array() -> Result<()> {
        let token = Token::Tuple(vec![Token::U32(255), Token::U32(128)]);

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 0, 0, 255, //u32
            0, 0, 0, 128, //u32
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_enum_with_deeply_nested_types() -> Result<()> {
        /*
        enum DeeperEnum {
            v1: bool,
            v2: str[10]
        }
         */
        let types = to_named(&[ParamType::Bool, ParamType::StringArray(10)]);
        let deeper_enum_variants = EnumVariants::new(types)?;
        let deeper_enum_token =
            Token::StringArray(StaticStringToken::new("0123456789".into(), Some(10)));

        /*
        struct StructA {
            some_enum: DeeperEnum
            some_number: u32
        }
         */

        let fields = to_named(&[
            ParamType::Enum {
                name: "".to_string(),
                enum_variants: deeper_enum_variants.clone(),
                generics: vec![],
            },
            ParamType::Bool,
        ]);
        let struct_a_type = ParamType::Struct {
            name: "".to_string(),
            fields,
            generics: vec![],
        };

        let struct_a_token = Token::Struct(vec![
            Token::Enum(Box::new((1, deeper_enum_token, deeper_enum_variants))),
            Token::U32(11332),
        ]);

        /*
         enum TopLevelEnum {
            v1: StructA,
            v2: bool,
            v3: u64
        }
        */

        let types = to_named(&[struct_a_type, ParamType::Bool, ParamType::U64]);
        let top_level_enum_variants = EnumVariants::new(types)?;
        let top_level_enum_token =
            Token::Enum(Box::new((0, struct_a_token, top_level_enum_variants)));

        let result = ABIEncoder::default().encode(slice::from_ref(&top_level_enum_token))?;

        let expected = [
            0, 0, 0, 0, 0, 0, 0, 0, // TopLevelEnum::v1 discriminant
            0, 0, 0, 0, 0, 0, 0, 1, // DeeperEnum::v2 discriminant
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // str[10]
            0, 0, 44, 68, // StructA.some_number
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_nested_structs() -> Result<()> {
        let token = Token::Struct(vec![
            Token::U16(10),
            Token::Struct(vec![
                Token::Bool(true),
                Token::Array(vec![Token::U8(1), Token::U8(2)]),
            ]),
        ]);

        let result = ABIEncoder::default().encode(&[token])?;

        let expected = [
            0, 10, // u16
            1,  // bool
            1, 2, // [u8, u8]
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn encode_comprehensive() -> Result<()> {
        let foo = Token::Struct(vec![
            Token::U16(10),
            Token::Struct(vec![
                Token::Bool(true),
                Token::Array(vec![Token::U8(1), Token::U8(2)]),
            ]),
        ]);
        let arr_u8 = Token::Array(vec![Token::U8(1), Token::U8(2)]);
        let b256 = Token::B256([255; 32]);
        let str_arr = Token::StringArray(StaticStringToken::new(
            "This is a full sentence".into(),
            Some(23),
        ));
        let tokens = vec![foo, arr_u8, b256, str_arr];

        let result = ABIEncoder::default().encode(&tokens)?;

        let expected = [
            0, 10, // foo.x == 10u16
            1,  // foo.y.a == true
            1,  // foo.y.b.0 == 1u8
            2,  // foo.y.b.1 == 2u8
            1,  // u8[2].0 == 1u8
            2,  // u8[2].0 == 2u8
            255, 255, 255, 255, 255, 255, 255, 255, // b256
            255, 255, 255, 255, 255, 255, 255, 255, // b256
            255, 255, 255, 255, 255, 255, 255, 255, // b256
            255, 255, 255, 255, 255, 255, 255, 255, // b256
            84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 102, 117, 108, 108, 32, 115, 101, 110,
            116, 101, 110, 99, 101, // str[23]
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn enums_with_only_unit_variants_are_encoded_in_one_word() -> Result<()> {
        let expected = [0, 0, 0, 0, 0, 0, 0, 1];

        let types = to_named(&[ParamType::Unit, ParamType::Unit]);
        let enum_selector = Box::new((1, Token::Unit, EnumVariants::new(types)?));

        let actual = ABIEncoder::default().encode(&[Token::Enum(enum_selector)])?;

        assert_eq!(actual, expected);

        Ok(())
    }

    #[test]
    fn vec_in_enum() -> Result<()> {
        // arrange
        let types = to_named(&[ParamType::B256, ParamType::Vector(Box::new(ParamType::U64))]);
        let variants = EnumVariants::new(types)?;
        let selector = (1, Token::Vector(vec![Token::U64(5)]), variants);
        let token = Token::Enum(Box::new(selector));

        // act
        let result = ABIEncoder::default().encode(&[token])?;

        // assert
        let expected = [
            0, 0, 0, 0, 0, 0, 0, 1, // enum dicsriminant
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 5, // vec[len, u64]
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn enum_in_vec() -> Result<()> {
        // arrange
        let types = to_named(&[ParamType::B256, ParamType::U8]);
        let variants = EnumVariants::new(types)?;
        let selector = (1, Token::U8(8), variants);
        let enum_token = Token::Enum(Box::new(selector));

        let vec_token = Token::Vector(vec![enum_token]);

        // act
        let result = ABIEncoder::default().encode(&[vec_token])?;

        // assert
        let expected = [
            0, 0, 0, 0, 0, 0, 0, 1, // vec len
            0, 0, 0, 0, 0, 0, 0, 1, 8, // enum discriminant and u8 value
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn vec_in_struct() -> Result<()> {
        // arrange
        let token = Token::Struct(vec![Token::Vector(vec![Token::U64(5)]), Token::U8(9)]);

        // act
        let result = ABIEncoder::default().encode(&[token])?;

        // assert
        let expected = [
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 5, // vec[len, u64]
            9, // u8
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn vec_in_vec() -> Result<()> {
        // arrange
        let token = Token::Vector(vec![Token::Vector(vec![Token::U8(5), Token::U8(6)])]);

        // act
        let result = ABIEncoder::default().encode(&[token])?;

        // assert
        let expected = [
            0, 0, 0, 0, 0, 0, 0, 1, // vec1 len
            0, 0, 0, 0, 0, 0, 0, 2, 5, 6, // vec2 [len, u8, u8]
        ];

        assert_eq!(result, expected);

        Ok(())
    }

    #[test]
    fn max_depth_surpassed() {
        const MAX_DEPTH: usize = 2;
        let config = EncoderConfig {
            max_depth: MAX_DEPTH,
            ..Default::default()
        };
        let msg = "depth limit `2` reached while encoding. Try increasing it".to_string();

        [nested_struct, nested_enum, nested_tuple, nested_array]
            .iter()
            .map(|fun| fun(MAX_DEPTH + 1))
            .for_each(|token| {
                assert_encoding_failed(config, token, &msg);
            });
    }

    fn assert_encoding_failed(config: EncoderConfig, token: Token, msg: &str) {
        let encoder = ABIEncoder::new(config);

        let err = encoder.encode(&[token]);

        let Err(Error::Codec(actual_msg)) = err else {
            panic!("expected a Codec error. Got: `{err:?}`");
        };
        assert_eq!(actual_msg, msg);
    }

    fn nested_struct(depth: usize) -> Token {
        let fields = if depth == 1 {
            vec![Token::U8(255), Token::String("bloopblip".to_string())]
        } else {
            vec![nested_struct(depth - 1)]
        };

        Token::Struct(fields)
    }

    fn nested_enum(depth: usize) -> Token {
        if depth == 0 {
            return Token::U8(255);
        }

        let inner_enum = nested_enum(depth - 1);

        // Create a basic EnumSelector for the current level (the `EnumVariants` is not
        // actually accurate but it's not used for encoding)
        let selector = (
            0u64,
            inner_enum,
            EnumVariants::new(to_named(&[ParamType::U64])).unwrap(),
        );

        Token::Enum(Box::new(selector))
    }

    fn nested_array(depth: usize) -> Token {
        if depth == 1 {
            Token::Array(vec![Token::U8(255)])
        } else {
            Token::Array(vec![nested_array(depth - 1)])
        }
    }

    fn nested_tuple(depth: usize) -> Token {
        let fields = if depth == 1 {
            vec![Token::U8(255), Token::String("bloopblip".to_string())]
        } else {
            vec![nested_tuple(depth - 1)]
        };

        Token::Tuple(fields)
    }
}
```

## Configuring the encoder for contract/script calls

You can also configure the encoder used to encode the arguments of the contract method:

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
