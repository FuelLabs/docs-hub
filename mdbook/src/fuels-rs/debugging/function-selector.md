# Function selector

Whenever you call a contract method the SDK will generate a function selector according to the fuel specs which will be
used by the node to identify which method we wish to execute.

If, for whatever reason, you wish to generate the function selector yourself you can do so:

```rust,ignore
// fn some_fn_name(arg1: Vec<str[3]>, arg2: u8)
        let fn_name = "some_fn_name";

        let selector = encode_fn_selector(fn_name);

        assert_eq!(
            selector,
            [0, 0, 0, 0, 0, 0, 0, 12, 115, 111, 109, 101, 95, 102, 110, 95, 110, 97, 109, 101]
        );
```
