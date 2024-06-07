/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.89.1
  Forc version: 0.60.0
  Fuel-Core version: 0.27.0
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot } from "fuels";
import type { FuelnautAbi, FuelnautAbiInterface } from "../FuelnautAbi";

const _abi = {
  "encoding": "1",
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 19,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 18,
          "typeArguments": [
            {
              "name": "",
              "type": 20,
              "typeArguments": null
            }
          ]
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 4,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "bool",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum AccessError",
      "components": [
        {
          "name": "NotOwner",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "enum Error",
      "components": [
        {
          "name": "InvalidBytecodeRoot",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "HasNotCompletedLevel",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 13,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 14,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "enum InitializationError",
      "components": [
        {
          "name": "CannotReinitialized",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        11
      ]
    },
    {
      "typeId": 10,
      "type": "enum State",
      "components": [
        {
          "name": "Uninitialized",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Initialized",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "Revoked",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "raw untyped ptr",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 13,
      "type": "struct Address",
      "components": [
        {
          "name": "bits",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 14,
      "type": "struct ContractId",
      "components": [
        {
          "name": "bits",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 15,
      "type": "struct OwnershipSet",
      "components": [
        {
          "name": "new_owner",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 16,
      "type": "struct OwnershipTransferred",
      "components": [
        {
          "name": "new_owner",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "previous_owner",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 17,
      "type": "struct RawVec",
      "components": [
        {
          "name": "ptr",
          "type": 12,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        11
      ]
    },
    {
      "typeId": 18,
      "type": "struct Vec",
      "components": [
        {
          "name": "buf",
          "type": 17,
          "typeArguments": [
            {
              "name": "",
              "type": 11,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "len",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        11
      ]
    },
    {
      "typeId": 19,
      "type": "u64",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 20,
      "type": "u8",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "address",
          "type": 13,
          "typeArguments": null
        },
        {
          "name": "level_id",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "complete_instance",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "instance",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "level_id",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "create_instance",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " this function takes the ContractId of a newly deployed instance"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " and registers the instance to the sender's player"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " if there is no player for the sender, it creates a new player"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " if the sender is a contract, it reverts"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " the ContractId of the instance is verified to match the registered level bytecode"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "instance",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "level_id",
          "type": 19,
          "typeArguments": null
        },
        {
          "name": "bytecode_input",
          "type": 18,
          "typeArguments": [
            {
              "name": "",
              "type": 20,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "configurables",
          "type": 18,
          "typeArguments": [
            {
              "name": "",
              "type": 1,
              "typeArguments": null
            }
          ]
        }
      ],
      "name": "create_instance_with_configurables",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "address",
          "type": 13,
          "typeArguments": null
        }
      ],
      "name": "get_all_levels_status",
      "output": {
        "name": "",
        "type": 18,
        "typeArguments": [
          {
            "name": "",
            "type": 9,
            "typeArguments": [
              {
                "name": "",
                "type": 4,
                "typeArguments": null
              }
            ]
          }
        ]
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " returns a vector of bool options representing the statuses of each level"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " if the option is None, the level has not been started"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " if the option is Some(true), the level has been completed"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " if the option is Some(false), the level has been started but not completed"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "id",
          "type": 14,
          "typeArguments": null
        }
      ],
      "name": "get_bytecode_root",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "address",
          "type": 13,
          "typeArguments": null
        },
        {
          "name": "instance_id",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "get_instance_contract",
      "output": {
        "name": "",
        "type": 2,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "index",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "get_level",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_total_number_of_levels",
      "output": {
        "name": "",
        "type": 19,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "my_constructor",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "owner",
      "output": {
        "name": "",
        "type": 10,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "bytecode_root",
          "type": 3,
          "typeArguments": null
        }
      ],
      "name": "register_level",
      "output": {
        "name": "",
        "type": 19,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " this function registers a challenge level of the fuelnaut game"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " it takes a ContractId of the level to register"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " and returns the index where the level is stored in the registered_levels vector"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "new_owner",
          "type": 7,
          "typeArguments": null
        }
      ],
      "name": "transfer_contract_ownership",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "bytecode_input",
          "type": 18,
          "typeArguments": [
            {
              "name": "",
              "type": 20,
              "typeArguments": null
            }
          ]
        }
      ],
      "name": "verify_bytecode_test",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "bytecode_input",
          "type": 18,
          "typeArguments": [
            {
              "name": "",
              "type": 20,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "configurables",
          "type": 18,
          "typeArguments": [
            {
              "name": "",
              "type": 1,
              "typeArguments": null
            }
          ]
        }
      ],
      "name": "verify_instance_with_configurables",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": null
    }
  ],
  "loggedTypes": [
    {
      "logId": "5679770223941778533",
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": "2161305517876418151",
      "loggedType": {
        "name": "",
        "type": 8,
        "typeArguments": []
      }
    },
    {
      "logId": "16280289466020123285",
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": []
      }
    },
    {
      "logId": "4571204900286667806",
      "loggedType": {
        "name": "",
        "type": 5,
        "typeArguments": []
      }
    },
    {
      "logId": "12970362301975156672",
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": []
      }
    },
    {
      "logId": "8961848586872524460",
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": null
      }
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const _storageSlots: StorageSlot[] = [
  {
    "key": "f383b0ce51358be57daa3b725fe44acdb2d880604e367199080b4379c41bb6ed",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "f383b0ce51358be57daa3b725fe44acdb2d880604e367199080b4379c41bb6ee",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export const FuelnautAbi__factory = {
  abi: _abi,

  storageSlots: _storageSlots,

  createInterface(): FuelnautAbiInterface {
    return new Interface(_abi) as unknown as FuelnautAbiInterface
  },

  connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): FuelnautAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as FuelnautAbi
  },

  async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<FuelnautAbi> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    const contract = await factory.deployContract({
      storageSlots: _storageSlots,
      ...options,
    });

    return contract as unknown as FuelnautAbi;
  }
}
