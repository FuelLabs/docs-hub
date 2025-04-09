# Storage

<!-- This section should explain storage in Sway -->
<!-- storage:example:start -->
When developing a [smart contract](../sway-program-types/smart_contracts.md), you will typically need some sort of persistent storage. In this case, persistent storage, often just called _storage_ in this context, is a place where you can store values that are persisted inside the contract itself. This is in contrast to a regular value in _memory_, which disappears after the contract exits.

Put in conventional programming terms, contract storage is like saving data to a hard drive. That data is saved even after the program that saved it exits. That data is persistent. Using memory is like declaring a variable in a program: it exists for the duration of the program and is non-persistent.

Some basic use cases of storage include declaring an owner address for a contract and saving balances in a wallet.
<!-- storage:example:end -->

## Storage Accesses Via the `storage` Keyword

Declaring variables in storage requires a `storage` block that contains a list of all your variables, their types, and their initial values. The initial value can be any expression that can be evaluated to a constant during compilation, as follows:

```sway
```sway\ncontract;

// ANCHOR: basic_storage_declaration
storage {
    var1: u64 = 1,
    var2: b256 = b256::zero(),
    var3: Address = Address::zero(),
    var4: Option<u8> = None,
}
// ANCHOR_END: basic_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_something();

    #[storage(read)]
    fn get_something();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_something() {
        // ANCHOR: basic_storage_write
        storage.var1.write(42);
        storage
            .var2
            .write(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .var3
            .write(Address::from(0x1111111111111111111111111111111111111111111111111111111111111111));
        storage.var4.write(Some(2u8));
        // ANCHOR_END: basic_storage_write
    }
    #[storage(read)]
    fn get_something() {
        // ANCHOR: basic_storage_read
        let var1: u64 = storage.var1.read();
        let var2: b256 = storage.var2.try_read().unwrap_or(b256::zero());
        let var3: Address = storage.var3.try_read().unwrap_or(Address::zero());
        let var4: Option<u8> = storage.var4.try_read().unwrap_or(None);
        // ANCHOR_END: basic_storage_read
    }
}\n```
```

To write into a storage variable, you need to use the `storage` keyword as follows:

```sway
```sway\ncontract;

// ANCHOR: basic_storage_declaration
storage {
    var1: u64 = 1,
    var2: b256 = b256::zero(),
    var3: Address = Address::zero(),
    var4: Option<u8> = None,
}
// ANCHOR_END: basic_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_something();

    #[storage(read)]
    fn get_something();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_something() {
        // ANCHOR: basic_storage_write
        storage.var1.write(42);
        storage
            .var2
            .write(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .var3
            .write(Address::from(0x1111111111111111111111111111111111111111111111111111111111111111));
        storage.var4.write(Some(2u8));
        // ANCHOR_END: basic_storage_write
    }
    #[storage(read)]
    fn get_something() {
        // ANCHOR: basic_storage_read
        let var1: u64 = storage.var1.read();
        let var2: b256 = storage.var2.try_read().unwrap_or(b256::zero());
        let var3: Address = storage.var3.try_read().unwrap_or(Address::zero());
        let var4: Option<u8> = storage.var4.try_read().unwrap_or(None);
        // ANCHOR_END: basic_storage_read
    }
}\n```
```

To read a storage variable, you also need to use the `storage` keyword. You may use `read()` or `try_read()`, however we recommend using `try_read()` for additional safety.

```sway
```sway\ncontract;

// ANCHOR: basic_storage_declaration
storage {
    var1: u64 = 1,
    var2: b256 = b256::zero(),
    var3: Address = Address::zero(),
    var4: Option<u8> = None,
}
// ANCHOR_END: basic_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_something();

    #[storage(read)]
    fn get_something();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_something() {
        // ANCHOR: basic_storage_write
        storage.var1.write(42);
        storage
            .var2
            .write(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .var3
            .write(Address::from(0x1111111111111111111111111111111111111111111111111111111111111111));
        storage.var4.write(Some(2u8));
        // ANCHOR_END: basic_storage_write
    }
    #[storage(read)]
    fn get_something() {
        // ANCHOR: basic_storage_read
        let var1: u64 = storage.var1.read();
        let var2: b256 = storage.var2.try_read().unwrap_or(b256::zero());
        let var3: Address = storage.var3.try_read().unwrap_or(Address::zero());
        let var4: Option<u8> = storage.var4.try_read().unwrap_or(None);
        // ANCHOR_END: basic_storage_read
    }
}\n```
```

## Storing Structs

To store a struct in storage, each variable must be assigned in the `storage` block. This can be either my assigning the fields individually or using a public [constructor](../basics/methods_and_associated_functions.md#constructors) that can be evaluated to a constant during compilation.

```sway
```sway\ncontract;

// ANCHOR: struct_storage_declaration
struct Type1 {
    x: u64,
    y: u64,
}

struct Type2 {
    w: b256,
    z: bool,
}

impl Type2 {
    // a constructor that evaluates to a constant during compilation
    fn default() -> Self {
        Self {
            w: 0x0000000000000000000000000000000000000000000000000000000000000000,
            z: true,
        }
    }
}

storage {
    var1: Type1 = Type1 { x: 0, y: 0 },
    var2: Type2 = Type2::default(),
}
// ANCHOR_END: struct_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_struct();

    #[storage(read)]
    fn get_struct();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_struct() {
        // ANCHOR: struct_storage_write
        // Store individual fields
        storage.var1.x.write(42);
        storage.var1.y.write(77);

        // Store an entire struct
        let new_struct = Type2 {
            w: 0x1111111111111111111111111111111111111111111111111111111111111111,
            z: false,
        };
        storage.var2.write(new_struct);
        // ANCHOR_END: struct_storage_write
    }

    #[storage(read)]
    fn get_struct() {
        // ANCHOR: struct_storage_read
        let var1_x: u64 = storage.var1.x.try_read().unwrap_or(0);
        let var1_y: u64 = storage.var1.y.try_read().unwrap_or(0);
        let var2: Type2 = storage.var2.try_read().unwrap_or(Type2::default());
        // ANCHOR_END: struct_storage_read
    }
}\n```
```

You may write to both fields of a struct and the entire struct as follows:

```sway
```sway\ncontract;

// ANCHOR: struct_storage_declaration
struct Type1 {
    x: u64,
    y: u64,
}

struct Type2 {
    w: b256,
    z: bool,
}

impl Type2 {
    // a constructor that evaluates to a constant during compilation
    fn default() -> Self {
        Self {
            w: 0x0000000000000000000000000000000000000000000000000000000000000000,
            z: true,
        }
    }
}

storage {
    var1: Type1 = Type1 { x: 0, y: 0 },
    var2: Type2 = Type2::default(),
}
// ANCHOR_END: struct_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_struct();

    #[storage(read)]
    fn get_struct();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_struct() {
        // ANCHOR: struct_storage_write
        // Store individual fields
        storage.var1.x.write(42);
        storage.var1.y.write(77);

        // Store an entire struct
        let new_struct = Type2 {
            w: 0x1111111111111111111111111111111111111111111111111111111111111111,
            z: false,
        };
        storage.var2.write(new_struct);
        // ANCHOR_END: struct_storage_write
    }

    #[storage(read)]
    fn get_struct() {
        // ANCHOR: struct_storage_read
        let var1_x: u64 = storage.var1.x.try_read().unwrap_or(0);
        let var1_y: u64 = storage.var1.y.try_read().unwrap_or(0);
        let var2: Type2 = storage.var2.try_read().unwrap_or(Type2::default());
        // ANCHOR_END: struct_storage_read
    }
}\n```
```

The same applies to reading structs from storage, where both the individual and struct as a whole may be read as follows:

```sway
```sway\ncontract;

// ANCHOR: struct_storage_declaration
struct Type1 {
    x: u64,
    y: u64,
}

struct Type2 {
    w: b256,
    z: bool,
}

impl Type2 {
    // a constructor that evaluates to a constant during compilation
    fn default() -> Self {
        Self {
            w: 0x0000000000000000000000000000000000000000000000000000000000000000,
            z: true,
        }
    }
}

storage {
    var1: Type1 = Type1 { x: 0, y: 0 },
    var2: Type2 = Type2::default(),
}
// ANCHOR_END: struct_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_struct();

    #[storage(read)]
    fn get_struct();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_struct() {
        // ANCHOR: struct_storage_write
        // Store individual fields
        storage.var1.x.write(42);
        storage.var1.y.write(77);

        // Store an entire struct
        let new_struct = Type2 {
            w: 0x1111111111111111111111111111111111111111111111111111111111111111,
            z: false,
        };
        storage.var2.write(new_struct);
        // ANCHOR_END: struct_storage_write
    }

    #[storage(read)]
    fn get_struct() {
        // ANCHOR: struct_storage_read
        let var1_x: u64 = storage.var1.x.try_read().unwrap_or(0);
        let var1_y: u64 = storage.var1.y.try_read().unwrap_or(0);
        let var2: Type2 = storage.var2.try_read().unwrap_or(Type2::default());
        // ANCHOR_END: struct_storage_read
    }
}\n```
```

## Common Storage Collections

We support the following common storage collections:

- `StorageMap<K, V>`
- `StorageVec<T>`
- `StorageBytes`
- `StorageString`

Please note that these types are not initialized during compilation. This means that if you try to access a key from a storage map before the storage has been set, for example, the call will revert.

Declaring these variables in storage requires a `storage` block as follows:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

### `StorageMaps<K, V>`

Generic storage maps are available in the standard library as `StorageMap<K, V>` which have to be defined inside a `storage` block and allow you to call `insert()` and `get()` to insert values at specific keys and get those values respectively. Refer to [Storage Maps](../common-collections/storage_map.md) for more information about `StorageMap<K, V>`.

**Warning** While the `StorageMap<K, V>` is currently included in the prelude, to use it the `Hash` trait must still be imported. This is a known issue and will be resolved.

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

To write to a storage map, call either the `insert()` or `try_insert()` functions as follows:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

The following demonstrates how to read from a storage map:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

### `StorageVec<T>`

Generic storage vectors are available in the standard library as `StorageVec<T>` which have to be defined inside a `storage` block and allow you to call `push()` and `pop()` to push and pop values from a vector respectively. Refer to [Storage Vector](../common-collections/storage_vec.md) for more information about `StorageVec<T>`.

The following demonstrates how to import `StorageVec<T>`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

> **NOTE**: When importing the `StorageVec<T>`, please be sure to use the glob operator: `use std::storage::storage_vec::*`.

The following demonstrates how to write to a `StorageVec<T>`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

The following demonstrates how to read from a `StorageVec<T>`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

### `StorageBytes`

Storage of `Bytes` is available in the standard library as `StorageBytes` which have to be defined inside a `storage` block. `StorageBytes` cannot be manipulated in the same way a `StorageVec<T>` or `StorageMap<K, V>` can but stores bytes more efficiently thus reducing gas. Only the entirety of a `Bytes` may be read/written to storage. This means any changes would require loading the entire `Bytes` to the heap, making changes, and then storing it once again. If frequent changes are needed, a `StorageVec<u8>` is recommended.

The following demonstrates how to import `StorageBytes`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

> **NOTE**: When importing the `StorageBytes`, please be sure to use the glob operator: `use std::storage::storage_bytes::*`.

The following demonstrates how to write to a `StorageBytes`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

The following demonstrates how to read from a `StorageBytes`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

### `StorageString`

Storage of `String` is available in the standard library as `StorageString` which have to be defined inside a `storage` block. `StorageString` cannot be manipulated in the same way a `StorageVec<T>` or `StorageMap<K, V>`. Only the entirety of a `String` may be read/written to storage.

The following demonstrates how to import `StorageString`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

> **NOTE**: When importing the `StorageString`, please be sure to use the glob operator: `use std::storage::storage_string::*`.

The following demonstrates how to write to a `StorageString`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

The following demonstrates how to read from a `StorageString`:

```sway
```sway\ncontract;

use std::{bytes::Bytes, string::String};

// ANCHOR: temp_hash_import
use std::hash::Hash;
// ANCHOR: temp_hash_import

// ANCHOR: storage_vec_import
use std::storage::storage_vec::*;
// ANCHOR: storage_vec_import

// ANCHOR: storage_bytes_import
use std::storage::storage_bytes::*;
// ANCHOR: storage_bytes_import

// ANCHOR: storage_string_import
use std::storage::storage_string::*;
// ANCHOR: storage_string_import

// ANCHOR: advanced_storage_declaration
storage {
    storage_map: StorageMap<u64, bool> = StorageMap {},
    storage_vec: StorageVec<b256> = StorageVec {},
    storage_string: StorageString = StorageString {},
    storage_bytes: StorageBytes = StorageBytes {},
}
// ANCHOR_END: advanced_storage_declaration

abi StorageExample {
    #[storage(write)]
    fn store_map();
    #[storage(read)]
    fn get_map();
    #[storage(write)]
    fn store_vec();
    #[storage(read, write)]
    fn get_vec();
    #[storage(write)]
    fn store_string();
    #[storage(read)]
    fn get_string();
    #[storage(write)]
    fn store_bytes();
    #[storage(read)]
    fn get_bytes();
}

impl StorageExample for Contract {
    #[storage(write)]
    fn store_map() {
        // ANCHOR: map_storage_write
        storage.storage_map.insert(12, true);
        storage.storage_map.insert(59, false);

        // try_insert() will only insert if a value does not already exist for a key.
        let result = storage.storage_map.try_insert(103, true);
        assert(result.is_ok());
        // ANCHOR_END: map_storage_write
    }
    #[storage(read)]
    fn get_map() {
        // ANCHOR: map_storage_read
        // Access directly
        let stored_val1: bool = storage.storage_map.get(12).try_read().unwrap_or(false);

        // First get the storage key and then access the value.
        let storage_key2: StorageKey<bool> = storage.storage_map.get(59);
        let stored_val2: bool = storage_key2.try_read().unwrap_or(false);

        // Unsafely access the value.
        let stored_val3: bool = storage.storage_map.get(103).read();
        // ANCHOR_END: map_storage_read
    }

    #[storage(write)]
    fn store_vec() {
        // ANCHOR: vec_storage_write
        storage
            .storage_vec
            .push(0x1111111111111111111111111111111111111111111111111111111111111111);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000001);
        storage
            .storage_vec
            .push(0x0000000000000000000000000000000000000000000000000000000000000002);

        // Set will overwrite the element stored at the given index.
        storage.storage_vec.set(2, b256::zero());
        // ANCHOR_END: vec_storage_write
    }
    #[storage(read, write)]
    fn get_vec() {
        // ANCHOR: vec_storage_read
        // Method 1: Access the element directly
        // Note: get() does not remove the element from the vec.
        let stored_val1: b256 = storage.storage_vec.get(0).unwrap().try_read().unwrap_or(b256::zero());

        // Method 2: First get the storage key and then access the value.
        let storage_key2: StorageKey<b256> = storage.storage_vec.get(1).unwrap();
        let stored_val2: b256 = storage_key2.try_read().unwrap_or(b256::zero());

        // pop() will remove the last element from the vec.
        let length: u64 = storage.storage_vec.len();
        let stored_val3: b256 = storage.storage_vec.pop().unwrap();
        assert(length != storage.storage_vec.len());
        // ANCHOR_END: vec_storage_read
    }

    #[storage(write)]
    fn store_string() {
        // ANCHOR: string_storage_write
        let my_string = String::from_ascii_str("Fuel is blazingly fast");
        storage.storage_string.write_slice(my_string);
        // ANCHOR_END: string_storage_write
    }
    #[storage(read)]
    fn get_string() {
        // ANCHOR: string_storage_read
        let stored_string: String = storage.storage_string.read_slice().unwrap();
        // ANCHOR_END: string_storage_read
    }

    #[storage(write)]
    fn store_bytes() {
        // ANCHOR: bytes_storage_write
        // Setup Bytes
        let mut my_bytes = Bytes::new();
        my_bytes.push(1u8);
        my_bytes.push(2u8);
        my_bytes.push(3u8);

        // Write to storage
        storage.storage_bytes.write_slice(my_bytes);
        // ANCHOR_END: bytes_storage_write
    }
    #[storage(read)]
    fn get_bytes() {
        // ANCHOR: bytes_storage_read
        let stored_bytes: Bytes = storage.storage_bytes.read_slice().unwrap();
        // ANCHOR_END: bytes_storage_read
    }
}\n```
```

## Advanced Storage

For more advanced storage techniques please refer to the [Advanced Storage](../advanced/advanced_storage.md) page.
