# abigen

<!-- This section explain the `abigen!` macro -->
<!-- abigen:example:start -->
`abigen!` is a procedural macro -- it generates code. It accepts inputs in the format of:

```text
ProgramType(name="MyProgramType", abi="my_program-abi.json")...
```

where:

- `ProgramType` is one of: `Contract`, `Script` or `Predicate`,

- `name` is the name that will be given to the generated bindings,

- `abi` is either a path to the JSON ABI file or its actual contents.
<!-- abigen:example:end -->

---
So, an `abigen!` which generates bindings for two contracts and one script looks like this:

```rust,ignore
abigen!(
            Contract(
                name = "ContractA",
                abi = "e2e/sway/bindings/sharing_types/contract_a/out/release/contract_a-abi.json"
            ),
            Contract(
                name = "ContractB",
                abi = "e2e/sway/bindings/sharing_types/contract_b/out/release/contract_b-abi.json"
            ),
            Script(
                name = "MyScript",
                abi = "e2e/sway/scripts/arguments/out/release/arguments-abi.json"
            ),
            Predicate(
                name = "MyPredicateEncoder",
                abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
            ),
        );
```

## How does the generated code look?

A rough overview:

```rust,ignore
pub mod abigen_bindings {
    pub mod contract_a_mod {
        struct SomeCustomStruct{/*...*/};
        // other custom types used in the contract

        struct ContractA {/*...*/};
        impl ContractA {/*...*/};
        // ...
    }
    pub mod contract_b_mod {
        // ...
    }
    pub mod my_script_mod {
        // ...
    }
    pub mod my_predicate_mod{
        // ...
    }
    pub mod shared_types{
        // ...
    }
}

pub use contract_a_mod::{/*..*/};
pub use contract_b_mod::{/*..*/};
pub use my_predicate_mod::{/*..*/};
pub use shared_types::{/*..*/};
```

Each `ProgramType` gets its own `mod` based on the `name` given in the `abigen!`. Inside the respective mods, the custom types used by that program are generated, and the bindings through which the actual calls can be made.

One extra `mod` called `shared_types` is generated if `abigen!` detects that the given programs share types. Instead of each `mod` regenerating the type for itself, the type is lifted out into the `shared_types` module, generated only once, and then shared between all program bindings that use it. Reexports are added to each mod so that even if a type is deemed shared, you can still access it as though each `mod` had generated the type for itself (i.e. `my_contract_mod::SharedType`).

A type is deemed shared if its name and definition match up. This can happen either because you've used the same library (a custom one or a type from the `stdlib`) or because you've happened to define the exact same type.

Finally, `pub use` statements are inserted, so you don't have to fully qualify the generated types. To avoid conflict, only types that have unique names will get a `pub use` statement. If you find `rustc` can't find your type, it might just be that there is another generated type with the same name. To fix the issue just qualify the path by doing `abigen_bindings::whatever_contract_mod::TheType`.

> **Note:**
> It is **highly** encouraged that you generate all your bindings in one `abigen!` call. Doing it in this manner will allow type sharing and avoid name collisions you'd normally get when calling `abigen!` multiple times inside the same namespace. If you choose to proceed otherwise, keep in mind the generated code overview presented above and appropriately separate the `abigen!` calls into different modules to resolve the collision.

## Using the bindings

Let's look at a contract with two methods: `initialize_counter(arg: u64) -> u64` and `increment_counter(arg: u64) -> u64`, with the following JSON ABI:

```json,ignore
{
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "type": "u64"
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "value",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "initialize_counter",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    },
    {
      "inputs": [
        {
          "name": "value",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "increment_counter",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    }
  ],
  "metadataTypes": []
}
```

By doing this:

```rust,ignore
use fuels::prelude::*;
            // Replace with your own JSON abi path (relative to the root of your crate)
            abigen!(Contract(
                name = "MyContractName",
                abi = "examples/rust_bindings/src/abi.json"
            ));
```

or this:

```rust,ignore
use fuels::prelude::*;
            abigen!(Contract(
                name = "MyContract",
                abi = r#"
            {
              "programType": "contract",
              "specVersion": "1",
              "encodingVersion": "1",
              "concreteTypes": [
                {
                  "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
                  "type": "u64"
                }
              ],
              "functions": [
                {
                  "inputs": [
                    {
                      "name": "value",
                      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
                    }
                  ],
                  "name": "initialize_counter",
                  "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
                },
                {
                  "inputs": [
                    {
                      "name": "value",
                      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
                    }
                  ],
                  "name": "increment_counter",
                  "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
                }
              ],
              "metadataTypes": []
            }
            "#
            ));
```

you'll generate this (shortened for brevity's sake):

```rust,ignore
pub mod abigen_bindings {
    pub mod my_contract_mod {
        #[derive(Debug, Clone)]
        pub struct MyContract<A: ::fuels::accounts::Account> {
            contract_id: ::fuels::types::bech32::Bech32ContractId,
            account: A,
            log_decoder: ::fuels::core::codec::LogDecoder,
            encoder_config: ::fuels::core::codec::EncoderConfig,
        }
        impl<A: ::fuels::accounts::Account> MyContract<A> {
            pub fn new(
                contract_id: impl ::core::convert::Into<::fuels::types::bech32::Bech32ContractId>,
                account: A,
            ) -> Self {
                let contract_id: ::fuels::types::bech32::Bech32ContractId = contract_id.into();
                let log_decoder = ::fuels::core::codec::LogDecoder::new(
                    ::fuels::core::codec::log_formatters_lookup(vec![], contract_id.clone().into()),
                );
                let encoder_config = ::fuels::core::codec::EncoderConfig::default();
                Self {
                    contract_id,
                    account,
                    log_decoder,
                    encoder_config,
                }
            }
            pub fn contract_id(&self) -> &::fuels::types::bech32::Bech32ContractId {
                &self.contract_id
            }
            pub fn account(&self) -> A {
                self.account.clone()
            }
            pub fn with_account<U: ::fuels::accounts::Account>(self, account: U) -> MyContract<U> {
                MyContract {
                    contract_id: self.contract_id,
                    account,
                    log_decoder: self.log_decoder,
                    encoder_config: self.encoder_config,
                }
            }
            pub fn with_encoder_config(
                mut self,
                encoder_config: ::fuels::core::codec::EncoderConfig,
            ) -> MyContract<A> {
                self.encoder_config = encoder_config;
                self
            }
            pub async fn get_balances(
                &self,
            ) -> ::fuels::types::errors::Result<
                ::std::collections::HashMap<::fuels::types::AssetId, u64>,
            > {
                ::fuels::accounts::ViewOnlyAccount::try_provider(&self.account)?
                    .get_contract_balances(&self.contract_id)
                    .await
                    .map_err(::std::convert::Into::into)
            }
            pub fn methods(&self) -> MyContractMethods<A> {
                MyContractMethods {
                    contract_id: self.contract_id.clone(),
                    account: self.account.clone(),
                    log_decoder: self.log_decoder.clone(),
                    encoder_config: self.encoder_config.clone(),
                }
            }
        }
        pub struct MyContractMethods<A: ::fuels::accounts::Account> {
            contract_id: ::fuels::types::bech32::Bech32ContractId,
            account: A,
            log_decoder: ::fuels::core::codec::LogDecoder,
            encoder_config: ::fuels::core::codec::EncoderConfig,
        }
        impl<A: ::fuels::accounts::Account> MyContractMethods<A> {
            #[doc = " This method will read the counter from storage, increment it"]
            #[doc = " and write the incremented value to storage"]
            pub fn increment_counter(
                &self,
                value: ::core::primitive::u64,
            ) -> ::fuels::programs::calls::CallHandler<
                A,
                ::fuels::programs::calls::ContractCall,
                ::core::primitive::u64,
            > {
                ::fuels::programs::calls::CallHandler::new_contract_call(
                    self.contract_id.clone(),
                    self.account.clone(),
                    ::fuels::core::codec::encode_fn_selector("increment_counter"),
                    &[::fuels::core::traits::Tokenizable::into_token(value)],
                    self.log_decoder.clone(),
                    false,
                    self.encoder_config.clone(),
                )
            }
            pub fn initialize_counter(
                &self,
                value: ::core::primitive::u64,
            ) -> ::fuels::programs::calls::CallHandler<
                A,
                ::fuels::programs::calls::ContractCall,
                ::core::primitive::u64,
            > {
                ::fuels::programs::calls::CallHandler::new_contract_call(
                    self.contract_id.clone(),
                    self.account.clone(),
                    ::fuels::core::codec::encode_fn_selector("initialize_counter"),
                    &[::fuels::core::traits::Tokenizable::into_token(value)],
                    self.log_decoder.clone(),
                    false,
                    self.encoder_config.clone(),
                )
            }
        }
        impl<A: ::fuels::accounts::Account> ::fuels::programs::calls::ContractDependency for MyContract<A> {
            fn id(&self) -> ::fuels::types::bech32::Bech32ContractId {
                self.contract_id.clone()
            }
            fn log_decoder(&self) -> ::fuels::core::codec::LogDecoder {
                self.log_decoder.clone()
            }
        }
        #[derive(Clone, Debug, Default)]
        pub struct MyContractConfigurables {
            offsets_with_data: ::std::vec::Vec<(u64, ::std::vec::Vec<u8>)>,
            encoder: ::fuels::core::codec::ABIEncoder,
        }
        impl MyContractConfigurables {
            pub fn new(encoder_config: ::fuels::core::codec::EncoderConfig) -> Self {
                Self {
                    encoder: ::fuels::core::codec::ABIEncoder::new(encoder_config),
                    ..::std::default::Default::default()
                }
            }
        }
        impl From<MyContractConfigurables> for ::fuels::core::Configurables {
            fn from(config: MyContractConfigurables) -> Self {
                ::fuels::core::Configurables::new(config.offsets_with_data)
            }
        }
    }
}
pub use abigen_bindings::my_contract_mod::MyContract;
pub use abigen_bindings::my_contract_mod::MyContractConfigurables;
pub use abigen_bindings::my_contract_mod::MyContractMethods;
```

> **Note:** that is all **generated** code. No need to write any of that. Ever. The generated code might look different from one version to another, this is just an example to give you an idea of what it looks like.

Then, you're able to use it to call the actual methods on the deployed contract:

```rust,ignore
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
```
