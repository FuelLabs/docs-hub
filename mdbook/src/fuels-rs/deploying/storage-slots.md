# Overriding storage slots

If you use storage in your contract, the default storage values will be generated in a JSON file (e.g. `my_contract-storage_slots.json`) by the Sway compiler. These are loaded automatically for you when you load a contract binary. If you wish to override some of the defaults, you need to provide the corresponding storage slots manually:

```rust,ignore
use fuels::{programs::contract::Contract, tx::StorageSlot};
            let slot_override = StorageSlot::new([1; 32].into(), [2; 32].into());
            let storage_config =
                StorageConfiguration::default().add_slot_overrides([slot_override]);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
```

If you don't have the slot storage file (`my_contract-storage_slots.json` example from above) for some reason, or you don't wish to load any of the default values, you can disable the auto-loading of storage slots:

```rust,ignore
use fuels::programs::contract::Contract;
            let storage_config = StorageConfiguration::default().with_autoload(false);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
```
