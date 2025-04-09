# Results

Examples of if statements in Sway

```sway
contract;

// Result<T, E> = Ok(T) | Err(E)

enum MathError {
    DivByZero: (),
}

fn div(x: u64, y: u64) -> Result<u64, MathError> {
    if y == 0 {
        return Result::Err(MathError::DivByZero);
    }

    Result::Ok(x / y)
}

abi MyContract {
    fn test_div(x: u64, y: u64) -> u64;
}

impl MyContract for Contract {
    fn test_div(x: u64, y: u64) -> u64 {
        let res = div(x, y);
        match res {
            Result::Ok(val) => val,
            Result::Err(err) => revert(0),
        }
    }
}
```
