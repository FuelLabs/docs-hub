# Primitive Types

Examples of primitive data types in Sway

```sway
contract;

// Primitive types
// - Unsigned integers
// - Strings
// - Boolean
// - 256 bits = 32 bytes

abi MyContract {
    fn test_func() -> bool;
}

impl MyContract for Contract {
    fn test_func() -> bool {
        // Unsigned integers
        // 0 <= u8 <= 2**8 - 1
        let u_8: u8 = 123;
        // 0 <= u16 <= 2**16 - 1
        let u_16: u16 = 123;
        // 0 <= u32 <= 2**32 - 1
        let u_32: u32 = 123;
        // 0 <= u64 <= 2**64 - 1
        let u_64: u64 = 123;
        // 0 <= u256 <= 2**256 - 1 
        // Since u256 are bigger than registers they are stored in memory rather than registers
        let u256: u256 = 123;

        let u_64_max = u64::max();

        // String slice
        let s_slice: str = "fuel";

        // Fixed length string array
        let s_array: str[4] = __to_str_array("fuel");

        // Boolean
        let boo: bool = true;
        // 256 bits = 32 bytes
        let b_256: b256 = 0x1111111111111111111111111111111111111111111111111111111111111111;

        true
    }
}
```
