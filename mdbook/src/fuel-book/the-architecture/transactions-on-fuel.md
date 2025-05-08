# Transactions on Fuel

Highlights:

- Fuel utilizes the UTXO model for transactions, a method famously employed in the Bitcoin protocol. This method allows for advantages like parallel transaction execution. In this model, addresses can own native assets and spend these coins through transactions.

- There are five distinct categories of transactions in Fuel, classified based on their operations: Script, Create, Mint, Upgrade, and Upload. Categorization helps define the various functionalities that users can perform within the Fuel ecosystem.

- Fuel transactions are composed of several key components: Inputs, Scripts, Outputs, and Witnesses. Inputs consist of state elements that users access during the transaction and can include Coins, Contracts, and Messages.

- The structure of a Fuel transaction allows for the inclusion of smart contracts as inputs, which can maintain persistent storage and can be utilized to execute complex operations beyond simple transactions, unlike the limitations faced by the Bitcoin protocol.

- Witnesses play a crucial role in Fuel transactions by providing digital signatures and verification for spending coins. Block builders fill in these fields and exclude them from the transaction ID, allowing for flexible data handling in transaction processing.

Fuel uses the UTXO model for transactions on its blockchain. The model is popularly used in the Bitcoin protocol and has various advantages, including parallel transaction execution.

In Fuel, addresses can own native assets and spend coins with transactions. Fuel categorizes transactions into five types based on their blockchain operations:

1. Script
2. Create
3. Mint
4. Upgrade
5. Upload

![2.2 Transaction Types](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-transaction-types-light.png)

Fuel uses the UTXO model for transactions, introducing specific constructs we'll explore before examining the various transaction types:

- Inputs
- Script
- Outputs
- Witnesses

We'll explore Fuel transaction components in detail before examining individual transaction types.

## Inputs

Fuel transactions use three types of Inputs, which are state elements accessed by users:

1. Coins
2. Contracts
3. Messages

### Coins

Coins are units for some asset that a user can spend as part of the transaction. Fuel natively supports multiple assets, unlike chains that only support one base asset (such as ETH for Ethereum). Asset creation is built into Fuel's protocol. For more details, see the native assets section in the appendix.

Users can own various denominations of certain assets in different numbers of Coins. For example, a Fuel address A can have a balance of some asset 100, with four coins of 25 denominations each, and some address B can have a balance of 100 for the same asset, but three coins of denomination 10, 40, 50.

![2.2 Input Coins](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-input-coins-light.png)

An Input Coin has the following parameters attached:

|         name        |    type   |                     description                     |
|:-------------------:|:---------:|:---------------------------------------------------:|
| txID                | byte[32]  | Hash of transaction.                                |
| outputIndex         | uint16    | Index of transaction output.                        |
| owner               | byte[32]  | Owning address or predicate root.                   |
| amount              | uint64    | Amount of coins.                                    |
| asset_id            | byte[32]  | Asset ID of the coins.                              |
| txPointer           | TXPointer | Points to the TX whose output is being spent.       |
| witnessIndex        | uint16    | Index of witness that authorizes spending the coin. |
| predicateGasUsed    | uint64    | Gas used by predicate.                              |
| predicateLength     | uint64    | Length of predicate, in instructions.               |
| predicateDataLength | uint64    | Length of predicate input data, in bytes.           |
| predicate           | byte[]    | Predicate bytecode.                                 |
| predicateData       | byte[]    | Predicate input data (parameters).                  |

The transaction invalidity rules for this input type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/input/#inputcoin).

### Contracts

A common question about the UTXO model concerns implementing smart contracts beyond ephemeral scripts.

Bitcoin's limited support for complex smart contracts stems from several core issues:

- Bitcoin script is not Turing complete, meaning you cannot do things like loops inside Bitcoin

- Bitcoin scripts in transactions lack persistent storage, limiting the blockchain's functionality.

Many incorrectly attribute Bitcoin's limitations to its UTXO model. However, these constraints stem from deliberate design choices. At Fuel, we embrace the UTXO model while supporting full Turing-complete smart contracts with persistent storage. We solve this problem by making stateful smart contracts an input for Fuel transactions.

Contracts have persistent storage and can own native assets. Users consume contracts by using the contracts as input for transactions. Then, users can call various external functions attached to contracts via the ephemeral script attached to the transaction.

![2.2 Input Contracts](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-input-contracts-light.png)

| name        | type      | description                                                             |
|-------------|-----------|-------------------------------------------------------------------------|
| txID        |  byte[32] | Hash of transaction.                                                    |
| outputIndex | uint16    | Index of transaction output.                                            |
| balanceRoot | byte[32]  | Root of amount of coins owned by contract before transaction execution. |
| stateRoot   | byte[32]  | State root of contract before transaction execution.                    |
| txPointer   | TXPointer | Points to the TX whose output is being spent.                           |
| contractID  | byte[32]  | Contract ID.                                                            |

When signing over contracts, `txID`, `outputIndex`, `balanceRoot`, `stateRoot`, and `txPointer` are initialized to zero values, which the block builder later fills in. This helps avoid concurrency issues with Contracts, as previously seen in the Cardano model.

When interacting with an AMM contract on Fuel, the process follows a specific flow. You begin by including the contract as an input to your transaction. Next, you call the external methods within an ephemeral script. Finally, you emit the contract as an output. This emitted contract can then be consumed as an input for the subsequent transaction involving this particular AMM contract. This approach allows for efficient state management and seamless interaction with the AMM on the Fuel platform.

The transaction invalidity rules for this input type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/input/#inputcontract).

### Messages

The Block Builder creates messages created as part of sending messages from the L1 to the L2. Messages make deposits to the Fuel rollups from the L1 possible, and we will discuss them in better detail later in the Fuel & Ethereum section.

**NOTE:** An Input Message can only be consumed as an Input as part of a transaction, and is then destroyed from the UTXO set.

![2.2 Input Messages](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-input-messages-light.png)

A fuel InputMessage consists of the following parameters:

|         name        |   type   |                       description                       |
|:-------------------:|:--------:|:-------------------------------------------------------:|
| sender              | byte[32] | The address of the message sender.                      |
| recipient           | byte[32] | The address or predicate root of the message recipient. |
| amount              | uint64   | Amount of base asset coins sent with message.           |
| nonce               | byte[32] | The message nonce.                                      |
| witnessIndex        | uint16   | Index of witness that authorizes spending the coin.     |
| predicateGasUsed    | uint64   | Gas used by predicate execution.                        |
| dataLength          | uint64   | Length of message data, in bytes.                       |
| predicateLength     | uint64   | Length of predicate, in instructions.                   |
| predicateDataLength | uint64   | Length of predicate input data, in bytes.               |
| data                | byte[]   | The message data.                                       |
| predicate           | byte[]   | Predicate bytecode.                                     |
| predicateData       | byte[]   | Predicate input data (parameters).                      |

The transaction invalidity rules for this input type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/input/#inputmessage).

## Scripts

Fuel scripts are ephemeral scripts that express the various actions taken during a transaction; a script can call the contracts provided as inputs or perform other arbitrary computation.

Fuel implements multi-call functionality through scripts, enabling efficient batch transactions. This approach allows users to:

1. Provide up to [MAX_INPUTS](https://docs.fuel.network/docs/specs/tx-format/consensus_parameters/) contracts in a single transaction

2. Call external methods on these multiple contracts

As mentioned in the FuelVM section, the FuelVM is in the Script Context, scripts cannot have their own persistent storage.

## Outputs

Fuel transactions have Outputs, which define the creation of new UTXOs post-transaction; these Outputs can then be inputs for the next set of transactions.

There are five types of possible Output types in a Fuel transaction:

1. Coin
2. Contract
3. Change
4. Variable
5. ContractCreated

One thing to note is we have three Outputs dealing with Coins, and the table below summarizes the core differences (we will expand more in further sections):

|         | OutputCoin | OutputChange      | OutputVariable         |
|---------|------------|-------------------|------------------------|
| Amount  | Static     | Automatically set | Set by script/contract |
| AssetID | Static     | Static            | Set by script/contract |
| To      | Static     | Static            | Set by script/contract |

**NOTE:** A Coin Output (Coin, Change, Variable) with an amount of zero leads to the pruning of the output from the UTXO set, which means coin outputs of amount zero are not part of the UTXO set.

### OutputCoin

Output Coins are new coins sent to a Fuel Address, which become spendable as Input Coins in further transactions.

|   name   |   type   |              description             |
|:--------:|:--------:|:------------------------------------:|
| to       | byte[32] | Receiving address or predicate root. |
| amount   | uint64   | Amount of coins to send.             |
| asset_id | byte[32] | Asset ID of coins.                   |

![2.2 Output Coins](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-output-coin-light.png)

The transaction invalidity rules for this output type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/output/#outputcoin).

### OutputContract

OutputContracts are newly generated contract outputs that become available as InputContracts for a specific contract ID in subsequent transactions utilizing this contract as an Input. They contain the newly updated index, balanceRoot, and stateRoot of the contract after being processed as part of the transaction.

**NOTE:** Every InputContract part of the transaction must always have a corresponding Output Contract.

![2.2 Output Contract](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-output-contract-light.png)

|     name    |   type   |                               description                              |
|:-----------:|:--------:|:----------------------------------------------------------------------:|
| inputIndex  | uint16   | Index of input contract.                                               |
| balanceRoot | byte[32] | Root of amount of coins owned by contract after transaction execution. |
| stateRoot   | byte[32] | State root of contract after transaction execution.                    |

The transaction invalidity rules for this output type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/output/#outputcontract).

### OutputChange

An OutputChange, included as one of our outputs for a specific assetId, enables the recovery of any unused balance from the total input balance provided in the transaction for that assetId.

For example, an OutputChange can collect any ETH not spent as gas or any USDC not swapped as part of a DEX transaction.

![2.2 Output Change](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-output-change-light.png)

**NOTE:** There can only be one OutputChange per `asset_id in a transaction`.

|   name   |   type   |              description             |
|:--------:|:--------:|:------------------------------------:|
| to       | byte[32] | Receiving address or predicate root. |
| amount   | uint64   | Amount of coins to send.             |
| asset_id | byte[32] | Asset ID of coins.                   |

The transaction invalidity rules for this output type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/output/#outputchange).

### OutputVariable

OutputVariable acts as a placeholder for coins created in the execution of scripts and contracts since they can create a coin of an arbitrary amount and to an arbitrary user. This is useful in scenarios where the exact output amount and owner cannot be determined beforehand.

**NOTE:** This means every transaction using mint internally will need an OutputVariable for that particular assetID.

![2.2 Output Variable](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-output-variable-light.png)

Consider a scenario where a contract transfers its output coin to a user only upon receiving a correct value. In this case, we can utilize a variable output at the end of the transaction. This output may or may not have a value attached to it, depending on whether the condition is met and have an arbitrary owner.

Variable Outputs are used via the [TRO](https://docs.fuel.network/docs/specs/fuel-vm/instruction-set/#tro-transfer-coins-to-output) opcode.

|   name   |   type   |              description             |
|:--------:|:--------:|:------------------------------------:|
| to       | byte[32] | Receiving address or predicate root. |
| amount   | uint64   | Amount of coins to send.             |
| asset_id | byte[32] | Asset ID of coins.                   |

The transaction invalidity rules for this output type are available [in our documentation](https://docs.fuel.network/docs/specs/tx-format/output/#outputvariable).

### OutputContractCreated

The `OutputContractCreated` output indicates that a new contract was created as part of the transaction. The parameters include the `contractID` and the initial state root for this contract.

|    name    |   type   |           description           |
|:----------:|:--------:|:-------------------------------:|
| contractID | byte[32] | Contract ID.                    |
| stateRoot  | byte[32] | Initial state root of contract. |

The transaction invalidity rules for this output type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/output/#outputcontractcreated).

## Witness

The witness is a parameter attached to transactions. The block builders fill in witnesses and are not part of the transaction ID. A Witness is usually used to provide digital signatures for verification purposes, for example, the signature to prove the spending of a Coin or anything else.

Witnesses are not part of the transaction ID, which allows someone to sign over a transaction and provide it as part of the transaction.

**NOTE:** The protocol doesn't limit witnesses to providing signatures only; they serve to fill in any data and enable various interesting use cases, like [State Rehydration](../fuels-future/state-rehydration.md).

Each witness contains a byte array data along with the field dataLength helping know the length of this data.

|    name    |   type   |            description            |
|:----------:|:--------:|:---------------------------------:|
| dataLength | uint64   | Length of witness data, in bytes. |
| data       | byte[]   | Witness data.                     |
| asset_id   | byte[32] | Asset ID of coins.                |

Multiple witnesses can be provided as part of the transaction, and the inputs can indicate which witness block builders, contracts, scripts or predicates can look at to verify the validity of being able to spend the input by providing the index at which their witness lives.

## TransactionScript

Script transactions are transactions that, as the name suggests, have Inputs, Outputs, and a Script that dictates what happens as part of the transaction.

Note: Scripts are optional in transactions of type `TransactionScript`. For example, a simple token transfer can work only on inputs and outputs, with no requirement for a script. Scripts are mainly leveraged when you want to do other things as part of your transaction beyond simply transferring or burning assets.

The transaction's script can compute arbitrary amounts and call other contracts. A famous example of script transactions is using an AMM or transferring a token.

|       name       |    type    |               description               |
|:----------------:|:----------:|:---------------------------------------:|
| scriptGasLimit   | uint64     | Gas limits the script execution.        |
| receiptsRoot     | byte[32]   | Merkle root of receipts.                |
| scriptLength     | uint64     | Script length, in instructions.         |
| scriptDataLength | uint64     | Length of script input data, in bytes.  |
| policyTypes      | uint32     | Bitfield of used policy types.          |
| inputsCount      | uint16     | Number of inputs.                       |
| outputsCount     | uint16     | Number of outputs.                      |
| witnessesCount   | uint16     | Number of witnesses.                    |
| script           | byte[]     | Script to execute.                      |
| scriptData       | byte[]     | Script input data (parameters).         |
| policies         | Policy []  | List of policies, sorted by PolicyType. |
| inputs           | Input []   | List of inputs.                         |
| outputs          | Output []  | List of outputs.                        |
| witnesses        | Witness [] | List of witnesses.                      |

**NOTE:** Script transactions lack the ability to create contracts, therefore they cannot produce a ContractCreated output type. For additional transaction invalidity rules, refer to [our documentation](https://docs.fuel.network/docs/specs/tx-format/transaction/#transactionscript).

## TransactionCreate

TransactionCreate is used to create new contracts; the parameters allow for contracts with initialized storage slots.

The contract ID of smart contracts on Fuel is calculated deterministically, and the calculation mechanism is referred to [here](https://docs.fuel.network/docs/specs/identifiers/contract-id/).

![2.2 Transaction Create](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-transaction-create-light.png)

|         name         |          type          |                    description                    |
|:--------------------:|:----------------------:|:-------------------------------------------------:|
| bytecodeWitnessIndex | uint16                 | Witness index of contract bytecode to create.     |
| salt                 | byte[32]               | Salt.                                             |
| storageSlotsCount    | uint64                 | Number of storage slots to initialize.            |
| policyTypes          | uint32                 | Bitfield of used policy types.                    |
| inputsCount          | uint16                 | Number of inputs.                                 |
| outputsCount         | uint16                 | Number of outputs.                                |
| witnessesCount       | uint16                 | Number of witnesses.                              |
| storageSlots         | (byte[32], byte[32])[] | List of storage slots to initialize (key, value). |
| policies             | Policy []              | List of policies.                                 |
| inputs               | Input []               | List of inputs.                                   |
| outputs              | Output []              | List of outputs.                                  |
| witnesses            | Witness []             | List of witnesses.                                |

The transaction invalidity rules for this transaction type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/transaction/#transactionscript).

## TransactionMint

The block producer uses this transaction to mint new assets. It doesn’t require a signature. The transaction is currently used to create the block producer's fees. The last transaction in the blocks is a Coinbase transaction, allowing the block producer to collect fees for building the block.

![2.2 Transaction Mint](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-transaction-mint-light.png)

|      name      |      type      |                                 description                                |
|:--------------:|:--------------:|:--------------------------------------------------------------------------:|
| txPointer      | TXPointer      | The location of the Mint transaction in the block.                         |
| inputContract  | InputContract  | The contract UTXO that assets are minted to.                               |
| outputContract | OutputContract | The contract UTXO that assets are being minted to.                         |
| mintAmount     | uint64         | The amount of funds minted.                                                |
| mintAssetId    | byte[32]       | The asset IDs corresponding to the minted amount.                          |
| gasPrice       | uint64         | The gas price to be used in calculating all fees for transactions on block |

The transaction invalidity rules for this transaction type can be seen here.

## TransactionUpgrade

The Fuel network employs [consensus parameters](https://docs.fuel.network/docs/specs/tx-format/consensus_parameters/), subject to occasional upgrades. The network's state transition function resides on-chain, allowing privileged addresses to upgrade it when necessary.

Therefore, at any given moment, a TransactionUpgrade might attempt to perform one of the following actions:

- Trying to upgrade the consensus parameters

- Trying to upgrade the state transition function

![2.2 Transaction Upgrade](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-transaction-upgrade-light.png)

|      name      |      type      |           description          |
|:--------------:|:--------------:|:------------------------------:|
| upgradePurpose | UpgradePurpose | The purpose of the upgrade.    |
| policyTypes    | uint32         | Bitfield of used policy types. |
| inputsCount    | uint16         | Number of inputs.              |
| outputsCount   | uint16         | Number of outputs.             |
| witnessesCount | uint16         | Number of witnesses.           |
| policies       | Policy []      | List of policies.              |
| inputs         | Input []       | List of inputs.                |
| outputs        | Output []      | List of outputs.               |
| witnesses      | Witness []     | List of witnesses.             |

The transaction invalidity rules for this transaction type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/transaction/#transactionmint).

## TransactionUpload

Before performing an upgrade, operators must upload the Fuel state transition bytecode to the chain. This requires uploading the bytecode via multiple transactions. TransactionUpload allows us to split the bytecode into multiple subsections and upload each subsection sequentially over multiple transactions.

On successful upload of all subsections, the transaction reaches completion, and the system adopts the new bytecode.

![2.2 Transaction Upload](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.2-transaction-upload-light.png)

<!-- markdownlint-disable MD052 -->
|        name       |    type    |                                      description                                      |
|:-----------------:|:----------:|:-------------------------------------------------------------------------------------:|
| root              | byte[32]   | The root of the Merkle tree is created over the bytecode.                             |
| witnessIndex      | uint16     | The witness index of the subsection of the bytecode.                                  |
| subsectionIndex   | uint16     | The index of the subsection of the bytecode.                                          |
| subsectionsNumber | uint16     | The total number of subsections on which bytecode was divided.                        |
| proofSetCount     | uint16     | Number of Merkle nodes in the proof.                                                  |
| policyTypes       | uint32     | Bitfield of used policy types.                                                        |
| inputsCount       | uint16     | Number of inputs.                                                                     |
| outputsCount      | uint16     | Number of outputs.                                                                    |
| witnessesCount    | uint16     | Number of witnesses.                                                                  |
| proofSet          | byte[32][] | The proof set of Merkle nodes to verify the connection of the subsection to the root. |
| policies          | Policy []  | List of policies.                                                                     |
| inputs            | Input []   | List of inputs.                                                                       |
| outputs           | Output []  | List of outputs.                                                                      |
| witnesses         | Witness [] | List of witnesses.                                                                    |
<!-- markdownlint-enable MD052 -->

The transaction invalidity rules for this transaction type can be seen [here](https://docs.fuel.network/docs/specs/tx-format/transaction/#transactionupload).

## Appendix

### Native Assets

In Fuel, apart from Eth (which is called the base asset), the functionality of minting and burning assets is enshrined in the protocol. The FuelVM provides op-codes for creating, minting, and burning assets, [MINT](https://docs.fuel.network/docs/specs/fuel-vm/instruction-set/#mint-mint-new-coins) and [BURN](https://docs.fuel.network/docs/specs/fuel-vm/instruction-set/#burn-burn-existing-coins), respectively.

All native assets can be spent using the same rules as the base asset, allowing Fuel developers and users to fully utilize the UTXO model and the resulting parallelization.

To explore Native assets further, it is recommended that you look at [Sway Standards](https://docs.fuel.network/docs/sway-standards/), which provide various standards ( like SRC-3, SRC-20, and many more ) related to native assets.
