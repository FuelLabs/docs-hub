# Script

Examples of a script program type in Sway

|                                | Predicates | Scripts  |
|--------------------------------|------------|-----------|
| Access data on chain           |      ❌     |     ✅     |
| Read data from smart contracts |      ❌     |     ✅     |
| Check date or time             |      ❌     |     ✅     |
| Read block hash or number      |      ❌     |     ✅     |
| Read input coins               |      ✅     |     ✅     |
| Read output coins              |      ✅     |     ✅     |
| Read transaction scripts       |      ✅     |     ✅     |
| Read transaction bytecode      |      ✅     |     ✅     |

```sway
script;

abi ContractA {
    fn test_func(x: u64) -> Identity;
}

const CONTRACTA_ID = 0x79fa8779bed2f36c3581d01c79df8da45eee09fac1fd76a5a656e16326317ef0;

fn main(a: u64) {
    let c = abi(ContractA, CONTRACTA_ID);

    // Call a contract multiple times
    log(c.test_func(a));
    log(c.test_func(a + 32));
}
```
