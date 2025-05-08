# While Loop

Examples of while loop in Sway

```sway
contract;

// While loops
// continue and break

abi MyContract {
    fn example_1() -> u64;
    fn example_2() -> u64;
    fn example_3() -> u64;
}

impl MyContract for Contract {
    fn example_1() -> u64 {
        let mut total = 0;
        let mut i = 0;
        while i < 5 {
            i += 1;
            total += i;
        }

        // total = 1 + 2 + 3 + 4 + 5
        total
    }

    fn example_2() -> u64 {
        // continue - sum odds
        let mut total = 0;
        let mut i = 0;
        while i < 5 {
            i += 1;
            // Skip if even
            if i % 2 == 0 {
                continue;
            }
            total += i;
        }

        // total = 1 + 3 + 5
        total
    }

    fn example_3() -> u64 {
        // break
        let mut total = 0;
        let mut i = 0;
        while i < 5 {
            i += 1;
            if i > 3 {
                // Exit loop
                break;
            }
            total += i;
        }

        // total = 1 + 2 + 3
        total
    }
}
```
