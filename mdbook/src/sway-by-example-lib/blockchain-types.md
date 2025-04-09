# Blockchain Types

Examples of blockchain data types in Sway

```sway
contract;

// Address
// Contract Id
// Identity

abi MyContract {
    fn test_func() -> Identity;
}

impl MyContract for Contract {
    fn test_func() -> Identity {
        // Address
        let b: b256 = 0x000000000000000000000000000000000000000000000000000000000000002A;
        let addr: Address = Address::from(b);
        let b: b256 = addr.into();

        // Contract id
        let b: b256 = 0x000000000000000000000000000000000000000000000000000000000000002A;
        let my_contract_id: ContractId = ContractId::from(b);
        let b: b256 = my_contract_id.into();

        // Identity type
        let raw_addr: b256 = 0xddec0e7e6a9a4a4e3e57d08d080d71a299c628a46bc609aab4627695679421ca;
        let addr = Address::from(raw_addr);
        let my_id: Identity = Identity::Address(addr);

        // Match on identity
        let id: Address = match my_id {
            Identity::Address(addr) => addr,
            Identity::ContractId(id) => revert(0),
        };

        my_id
    }
}
```
