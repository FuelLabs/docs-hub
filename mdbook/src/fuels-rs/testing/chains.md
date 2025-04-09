# Increasing the block height

You can use `produce_blocks` to help achieve an arbitrary block height; this is useful when you want to do any testing regarding transaction maturity.

> **Note**: For the `produce_blocks` API to work, it is imperative to have `manual_blocks_enabled = true` in the config for the running node. See example below.

```rust,ignore
let wallets =
        launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None).await?;
    let wallet = &wallets[0];
    let provider = wallet.try_provider()?;

    assert_eq!(provider.latest_block_height().await?, 0u32);

    provider.produce_blocks(3, None).await?;

    assert_eq!(provider.latest_block_height().await?, 3u32);
```

You can also set a custom block time as the second, optional argument. Here is an example:

```rust,ignore
let block_time = 20u32; // seconds
    let config = NodeConfig {
        // This is how you specify the time between blocks
        block_production: Trigger::Interval {
            block_time: std::time::Duration::from_secs(block_time.into()),
        },
        ..NodeConfig::default()
    };
    let wallets =
        launch_custom_provider_and_get_wallets(WalletsConfig::default(), Some(config), None)
            .await?;
    let wallet = &wallets[0];
    let provider = wallet.try_provider()?;

    assert_eq!(provider.latest_block_height().await?, 0u32);
    let origin_block_time = provider.latest_block_time().await?.unwrap();
    let blocks_to_produce = 3;

    provider.produce_blocks(blocks_to_produce, None).await?;
    assert_eq!(provider.latest_block_height().await?, blocks_to_produce);
    let expected_latest_block_time = origin_block_time
        .checked_add_signed(Duration::try_seconds((blocks_to_produce * block_time) as i64).unwrap())
        .unwrap();
    assert_eq!(
        provider.latest_block_time().await?.unwrap(),
        expected_latest_block_time
    );
```
