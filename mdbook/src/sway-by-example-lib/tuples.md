# Tuples

Examples of tuples in Sway

```sway
contract;

// Tuples
// - Create, read, update
// - Nested
// - Destructure and "_"

abi MyContract {
    fn test_func() -> (u64, (str, bool));
}

impl MyContract for Contract {
    fn test_func() -> (u64, (str, bool)) {
        let mut tuple: (u64, bool, u64) = (1, false, 2);
        tuple.0 = 123;
        let x = tuple.0;

        let nested = (1, ("Fuel", false));
        let s = nested.1.0;

        let (n, (s, b)) = nested;
        // Skip variables for 0 and 1.1 
        let (_, (s, _)) = nested;

        nested
    }
}
```
