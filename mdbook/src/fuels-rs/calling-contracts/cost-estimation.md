# Estimating contract call cost

With the function `estimate_transaction_cost(tolerance: Option<f64>, block_horizon: Option<u32>)` provided by `CallHandler`, you can get a cost estimation for a specific call. The return type, `TransactionCost`, is a struct that contains relevant information for the estimation:

```rust,ignore
pub struct TransactionCost {
    pub gas_price: u64,
    pub gas_used: u64,
    pub metered_bytes_size: u64,
    pub total_fee: u64,
}
```

Below are examples that show how to get the estimated transaction cost from single and multi call transactions.

```rust,ignore
let contract_instance = MyContract::new(contract_id, wallet);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
```

```rust,ignore
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
```

The transaction cost estimation can be used to set the gas limit for an actual call, or to show the user the estimated cost.

> **Note** The same estimation interface is available for scripts.
