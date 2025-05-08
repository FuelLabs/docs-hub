# Functions

Examples of functions in Sway

```sway
contract;

// Functions
// - Internal and external functions
// - ref mut
// - Return multiple outputs

abi MyContract {
    fn test_func() -> (u64, bool);
}

fn eq(x: u64, y: u64) -> bool {
    x == y
}

fn inc(ref mut num: u64) {
    num += 1;
}

fn swap_mut(ref mut pair: (u64, u64)) {
    let tmp = pair.0;
    pair.0 = pair.1;
    pair.1 = tmp;
}

fn swap(x: u64, y: u64) -> (u64, u64) {
    (y, x)
}

impl MyContract for Contract {
    fn test_func() -> (u64, bool) {
        assert(eq(11, 11));
        assert(!eq(11, 12));

        let mut num: u64 = 123;
        inc(num);
        assert(num == 123 + 1);

        let mut pair = (12, 13);
        swap_mut(pair);
        assert(pair.0 == 13);
        assert(pair.1 == 12);

        let x = 1;
        let y = 2;
        let (y, x) = swap(x, y);
        assert(y == 1);
        assert(x == 2);
        (123, true)
    }
}
```
