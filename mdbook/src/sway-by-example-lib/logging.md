# Logging

Examples of logging in Sway

```sway
contract;

use std::logging::log;

abi MyContract {
    fn test_func(val: u64);
}

impl MyContract for Contract {
    fn test_func(val: u64) {
        log(val);
    }
}
```
