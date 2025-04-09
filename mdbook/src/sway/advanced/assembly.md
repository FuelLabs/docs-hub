# Inline Assembly in Sway

While many users will never have to touch assembly language while writing Sway code, it is a powerful tool that enables many advanced use-cases (e.g., optimizations, building libraries, etc).

## ASM Block

In Sway, the way we use assembly inline is to declare an `asm` block like this:

```sway
asm() {...}
```

Declaring an `asm` block is similar to declaring a function.
We can specify register names to operate on as arguments, we can perform assembly instructions within the block, and we can return a value by specifying a return register.
Here's an example showing what this might look like:

```sway
pub fn add_1(num: u32) -> u32 {
    asm(r1: num, r2) {
        add r2 r1 one;
        r2: u32
    }
}
```

The return register is specified at the end of the `asm` block, after all the assembly instructions. It consists of the register name and an optional return type. In the above example, the return register name is `r2` and the return type is `u32`.
If the return type is omitted, it is `u64` by default.

The return register itself is optional. If it is not specified, similar to functions, the returned value from the `asm` block will be [unit](../basics/built_in_types.md#unit-type), `()`.

An `asm` block can only return a single register. If you really need to return more than one value, you can modify a tuple. Here's an example showing how you can implement this for `(u64, u64)`:

```sway
```sway\nscript;

fn adder(a: u64, b: u64, c: u64) -> (u64, u64) {
    let empty_tuple = (0u64, 0u64);
    asm(output: empty_tuple, r1: a, r2: b, r3: c, r4, r5) {
        add r4 r1 r2; // add a & b and put the result in r4
        add r5 r2 r3; // add b & c and put the result in r5
        sw output r4 i0; // store the word in r4 in output + 0 words
        sw output r5 i1; // store the word in r5 in output + 1 word
        output: (u64, u64) // return both values
    }
}

fn main() -> bool {
    let (first, second) = adder(1, 2, 3);
    assert(first == 3);
    assert(second == 5);
    true
}\n```
```

Note that this is contrived example meant to demonstrate the syntax; there's absolutely no need to use assembly to add integers!

Note that in the above example:

- we initialized the register `r1` with the value of `num`.
- we declared a second register `r2` (you may choose any register names you want).
- we use the `add` opcode to add `one` to the value of `r1` and store it in `r2`.
- `one` is an example of a "reserved register", of which there are 16 in total. Further reading on this is linked below under "Semantics".
- we return `r2` and specify the return type as being `u32`.

An important note is that the `ji` and `jnei` opcodes are not available within an `asm` block. For those looking to introduce control flow to `asm` blocks, it is recommended to surround smaller chunks of `asm` with control flow (`if`, `else`, and `while`).

## Helpful Links

For examples of assembly in action, check out the [Sway standard library](https://github.com/FuelLabs/sway/tree/master/sway-lib-std).

For a complete list of all instructions supported in the FuelVM: [Instructions](https://fuellabs.github.io/fuel-specs/master/vm/instruction_set).

And to learn more about the FuelVM semantics: [Semantics](https://fuellabs.github.io/fuel-specs/master/vm#semantics).
