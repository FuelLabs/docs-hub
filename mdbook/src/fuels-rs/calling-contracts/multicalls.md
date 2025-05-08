# Multiple contract calls

With `CallHandler`, you can execute multiple contract calls within a single transaction. To achieve this, you first prepare all the contract calls that you want to bundle:

```rust,ignore
let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);
```

You can also set call parameters, variable outputs, or external contracts for every contract call, as long as you don't execute it with `call()` or `simulate()`.

Next, you provide the prepared calls to your `CallHandler` and optionally configure transaction policies:

```rust,ignore
let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);
```

> **Note:** any transaction policies configured on separate contract calls are disregarded in favor of the parameters provided to the multi-call `CallHandler`.

Furthermore, if you need to separate submission from value retrieval for any reason, you can do so as follows:

```rust,ignore
let submitted_tx = multi_call_handler.submit().await?;
        tokio::time::sleep(Duration::from_millis(500)).await;
        let (counter, array): (u64, [u64; 2]) = submitted_tx.response().await?.value;
```

## Output values

To get the output values of the bundled calls, you need to provide explicit type annotations when saving the result of `call()` or `simulate()` to a variable:

```rust,ignore
let (counter, array): (u64, [u64; 2]) = multi_call_handler.call().await?.value;
```

You can also interact with the `CallResponse` by moving the type annotation to the invoked method:

```rust,ignore
let response = multi_call_handler.call::<(u64, [u64; 2])>().await?;
```
