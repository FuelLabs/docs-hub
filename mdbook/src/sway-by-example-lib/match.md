# Match Statements

Examples of match statements in Sway

```sway
contract;

// Control flow
// Assign variable
// Enum

abi MyContract {
    fn test_function(x: u64, y: Option<u64>) -> u64;
}

fn do_something() {}

fn do_something_else() {}

impl MyContract for Contract {
    fn test_function(x: u64, y: Option<u64>) -> u64 {
        // Control flow
        match x {
            0 => do_something(),
            _ => do_something_else(),
        }

        // Assign variable
        let res: str = match x {
            0 => "a",
            1 => "b",
            2 => "c",
            _ => "d",
        };

        // Enum
        let z = match y {
            Option::Some(val) => val + 1,
            Option::None => 0,
        };

        z
    }
}
```
