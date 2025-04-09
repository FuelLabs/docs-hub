# Low-level calls

<!-- This section should explain what low-level calls are and how to do them -->
With low-level calls, you can specify the parameters of your calls at runtime and make indirect calls through other contracts.

Your caller contract should call `std::low_level_call::call_with_function_selector`, providing:

- target contract ID
- function selector encoded as `Bytes`
- calldata encoded as `Bytes`
- whether the calldata contains only a single value argument (e.g. a `u64`)
- `std::low_level_call::CallParams`

```rust,ignore
fn call_low_level_call(
        target: ContractId,
        function_selector: Bytes,
        calldata: Bytes,
    ) {
        let call_params = CallParams {
            coins: 0,
            asset_id: AssetId::from(ZERO_B256),
            gas: 10_000,
        };

        call_with_function_selector(target, function_selector, calldata, call_params);
    }
```

On the SDK side, you can construct an encoded function selector using `fuels::core::encode_fn_selector`, and encoded calldata using the `fuels::core::calldata!` macro.

E.g. to call the following function on the target contract:

```rust,ignore
#[storage(write)]
    fn set_value_multiple_complex(a: MyStruct, b: str[4]);
```

you would construct the function selector and the calldata as such, and provide them to the caller contract (like the one above):

```rust,ignore
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
```

> Note: the `calldata!` macro uses the default `EncoderConfig` configuration under the hood.
