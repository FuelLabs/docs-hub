# Options

Examples of options in Sway

```sway
contract;

// Option<T> = Some(T) | None

abi MyContract {
    fn test_func() -> (Option<bool>, Option<bool>, Option<bool>);
}

impl MyContract for Contract {
    fn test_func() -> (Option<bool>, Option<bool>, Option<bool>) {
        let liked = Option::Some(true);
        let disliked = Option::Some(false);
        let none = Option::None;
        (liked, disliked, none)
    }
}
```
