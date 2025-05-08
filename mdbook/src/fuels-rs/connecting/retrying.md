# Retrying requests

The [`Provider`](https://docs.rs/fuels/0.62.0/fuels/accounts/provider/struct.Provider.html) can be configured to retry a request upon receiving a `io::Error`.

> Note: Currently all node errors are received as `io::Error`s. So, if configured, a retry will happen even if, for example, a transaction failed to verify.

We can configure the number of retry attempts and the retry strategy as detailed below.

## `RetryConfig`

The retry behavior can be altered by giving a custom `RetryConfig`. It allows for configuring the maximum number of attempts and the interval strategy used.

```rust, ignore
#[derive(Clone, Debug)]
pub struct RetryConfig {
    max_attempts: NonZeroU32,
    interval: Backoff,
}
```

```rust, ignore
let retry_config = RetryConfig::new(3, Backoff::Fixed(Duration::from_secs(2)))?;
        let provider = setup_test_provider(coins.clone(), vec![], None, None)
            .await?
            .with_retry_config(retry_config);
```

## Interval strategy - `Backoff`

`Backoff` defines different strategies for managing intervals between retry attempts.
Each strategy allows you to customize the waiting time before a new attempt based on the number of attempts made.

### Variants

- `Linear(Duration)`: `Default` Increases the waiting time linearly with each attempt.
- `Exponential(Duration)`: Doubles the waiting time with each attempt.
- `Fixed(Duration)`: Uses a constant waiting time between attempts.

```rust, ignore
<!-- MDBOOK-ANCHOR-ERROR: Anchor 'backoff' not found in '../../../packages/fuels-accounts/src/provider/retry_util.rs' -->
```
