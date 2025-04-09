# Big Numbers

Examples of Big Numbers in Sway

```sway
contract;

// Storage declaration
storage {
    big_number: u256 = 0,
}

// ABI definition
abi BigNumberContract {

    #[storage(write)]
    fn set_big_number(value: u256);

    #[storage(read)]
    fn get_big_number() -> u256;

    #[storage(write)]
    fn add_u64_to_big_number(value: u64);

    #[storage(write)]
    fn multiply_big_number_by_u64(value: u64);
}

// Implementation of the ABI
impl BigNumberContract for Contract {
    /// Sets the big number to a new value.
    ///
    /// # Arguments
    ///
    /// * `value`: [u256] - The new value to set.
    ///
    /// # Storage Access
    ///
    /// * Writes: `1`
    #[storage(write)]
    fn set_big_number(value: u256) {
        // Write the new value to the storage variable `big_number`.
        storage.big_number.write(value);
    }

    /// Returns the current big number.
    ///
    /// # Returns
    ///
    /// * [u256] - The current big number.
    ///
    /// # Storage Access
    ///
    /// * Reads: `1`
    #[storage(read)]
    fn get_big_number() -> u256 {
        // Read and return the value of the storage variable `big_number`.
        storage.big_number.read()
    }

    /// Adds a `u64` value to the current big number.
    ///
    /// # Arguments
    ///
    /// * `value`: [u64] - The value to add.
    ///
    /// # Storage Access
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    #[storage(write)]
    fn add_u64_to_big_number(value: u64) {
        // Read the current value of the storage variable `big_number`.
        let current_value = storage.big_number.read();
        // Convert the `u64` value to `u256`.
        let value_as_u256 = value.as_u256();
        // Add the converted value to the current value.
        let new_value = current_value + value_as_u256;
        // Write the new value back to the storage variable `big_number`.
        storage.big_number.write(new_value);
    }

    /// Multiplies the current big number by a `u64` value.
    ///
    /// # Arguments
    ///
    /// * `value`: [u64] - The value to multiply by.
    ///
    /// # Storage Access
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    #[storage(write)]
    fn multiply_big_number_by_u64(value: u64) {
        // Read the current value of the storage variable `big_number`.
        let current_value = storage.big_number.read();
        // Convert the `u64` value to `u256`.
        let value_as_u256 = value.as_u256();
        // Multiply the current value by the converted value.
        let new_value = current_value * value_as_u256;
        // Write the new value back to the storage variable `big_number`.
        storage.big_number.write(new_value);
    }
}
```
