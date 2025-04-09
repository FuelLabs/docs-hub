# `FizzBuzz`

This example is not the traditional [`FizzBuzz`](https://en.wikipedia.org/wiki/Fizz_buzz#Programming); instead it is the smart contract version! A script can call the `fizzbuzz` ABI method of this contract with some `u64` value and receive back the result as an `enum`.

The format for custom structs and enums such as `FizzBuzzResult` will be automatically included in the ABI JSON so that off-chain code can handle the encoded form of the returned data.

```sway
```sway\ncontract;

enum FizzBuzzResult {
    Fizz: (),
    Buzz: (),
    FizzBuzz: (),
    Other: u64,
}

abi FizzBuzz {
    fn fizzbuzz(input: u64) -> FizzBuzzResult;
}

impl FizzBuzz for Contract {
    fn fizzbuzz(input: u64) -> FizzBuzzResult {
        if input % 15 == 0 {
            FizzBuzzResult::FizzBuzz
        } else if input % 3 == 0 {
            FizzBuzzResult::Fizz
        } else if input % 5 == 0 {
            FizzBuzzResult::Buzz
        } else {
            FizzBuzzResult::Other(input)
        }
    }
}\n```
```
