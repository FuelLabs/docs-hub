# RocksDB

RocksDB enables the preservation of the blockchain's state locally, facilitating its future utilization.

To create or use a local database, follow these instructions:

```rust,ignore
let provider_config = NodeConfig {
            database_type: DbType::RocksDb(Some(PathBuf::from("/tmp/.spider/db"))),
            ..NodeConfig::default()
        };
```

> Note: If the specified database does not exist, a new database will be created at that path. To utilize the code snippets above, either the `fuel-core` binary must be present, or both the `fuel-core-lib` and `rocksdb` features need to be enabled.
