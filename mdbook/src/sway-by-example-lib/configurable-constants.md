# Configurable Constants

Examples of configurable constants in Sway

```sway
contract;

// Configurable constants

configurable {
    MY_NUM: u64 = 123,
    OWNER: Address = Address::from(0x3333333333333333333333333333333333333333333333333333333333333333),
    POINT: Point = Point { x: 1, y: 2 },
}

struct Point {
    x: u64,
    y: u64,
}

abi MyContract {
    fn test_func() -> (u64, Address, Point);
}

impl MyContract for Contract {
    fn test_func() -> (u64, Address, Point) {
        (MY_NUM, OWNER, POINT)
    }
}
```
