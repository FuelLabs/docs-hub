# Vector

Examples of vectors in Sway

```sway
contract;

use std::{storage::storage_vec::*};

// storage vector, heap

abi MyContract {
    #[storage(read, write)]
    fn storage_vec_examples();
    fn heap_vec_examples();
}

storage {
    nums: StorageVec<u64> = StorageVec {},
}

impl MyContract for Contract {
    #[storage(read, write)]
    fn storage_vec_examples() {
        // push
        // pop
        // get
        // set
        // remove - moves all elements down by one 
        // swap remove - remove element, move last element
        // len
        // clear - sets length to zero
        // loop

        // push
        storage.nums.push(100);
        storage.nums.push(200);
        storage.nums.push(300);
        storage.nums.push(400);
        storage.nums.push(500);
        storage.nums.push(600);

        // pop - remove last - returns Option<num>
        let last = storage.nums.pop();

        // get
        let first = storage.nums.get(0).unwrap();
        let none = storage.nums.get(1000);

        // set
        storage.nums.set(0, 123);

        // remove - Returns value removed
        // Before remove [100, 200, 300, 400]
        // After  remove [100, 300, 400]
        let removed_val = storage.nums.remove(1);

        // swap remove
        // Before swap_remove [100, 300, 400, 500]
        // After  swap_remove [100, 500, 400]
        storage.nums.swap_remove(1);

        let len = storage.nums.len();

        // clear - sets length to zero
        storage.nums.clear();

        // Loop example
        let mut i = 0;
        while i < len {
            let val = storage.nums.get(i).unwrap();
            i += 1;
        }
    }

    fn heap_vec_examples() {
        // new
        // push
        // pop
        // remove
        // get
        // set
        // len
        let mut v: Vec<u64> = Vec::new();

        v.push(100);
        v.push(200);
        v.push(300);
        v.push(400);
        v.push(500);

        // Returns Option<u64>
        v.pop();

        // Before remove [100, 200, 300, 400]
        // After  remove [100, 300, 400]
        // Returns removed element
        v.remove(1);

        let val = v.get(1).unwrap();

        v.set(1, val + 1);

        let len = v.len();
    }
}
```
