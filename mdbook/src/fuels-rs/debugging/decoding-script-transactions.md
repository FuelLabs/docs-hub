# Decoding script transactions

The SDK offers some tools that can help you make fuel script transactions more
human readable. You can determine whether the script transaction is:

* calling a contract method(s),
* is a loader script and you can see the blob id
* is neither of the above

In the case of contract call(s), if you have the ABI file, you can also decode
the arguments to the function by making use of the `AbiFormatter`:

```rust,ignore
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
```

prints:

```text
The script called: initialize_counter(42)
```

The `AbiFormatter` can also decode configurables, refer to the rust docs for
more information.
