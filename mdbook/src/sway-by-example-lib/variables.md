# Variables

Examples of variables in Sway

```sway
contract;

abi MyContract {
    fn test_func() -> u64;
}

impl MyContract for Contract {
    fn test_func() -> u64 {
        // Immutable
        // 0 <= u64 <= 2**64 - 1
        let x = 5;
        // Cannot re-assign x to another value
        // x = 6;

        // Mutable
        let mut y = 5;
        y = 6;

        // Type annotations
        let i: u32 = 123;

        y
    }
}
```
