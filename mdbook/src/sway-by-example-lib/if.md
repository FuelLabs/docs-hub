# If Statements

Examples of if statements in Sway

```sway
contract;

// if, else if, else
// if let

abi MyContract {
    fn test_func(x: u64) -> u64;
}

impl MyContract for Contract {
    fn test_func(x: u64) -> u64 {
        // if, else if, else
        if x < 10 {
            // do something
        } else if x < 20 {
            // do something else
        } else {
            // do something else
        }

        // if let
        let mut y = 0;
        if x < 10 {
            y = x * x;
        } else {
            y = x + 1;
        }

        // Assign the outcome of if statements to the variable y
        let y = if x < 10 {
            // do something, for example
            x * x
        } else {
            // do something else, for example
            x + 1
        }; // Notice semicolon here

        y
    }
}
```
