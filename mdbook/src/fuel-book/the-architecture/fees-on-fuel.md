# Fees on Fuel

The Fuel ignition process introduces various fees and costs essential for utilizing the permissionless network. These can be categorized into the following types:

- **Transaction Fees:** A mandatory fee paid to validators for processing transactions and executing instructions on the network.
- **Tip:** An optional fee that allows users to boost their transactions in the processing order, ensuring faster execution.

## Fuel’s Approach to Transaction Fees

### Fee Structure

Fuel operates on a modular execution layer, emphasizing efficiency in gas computation and storage fees. Instead of relying on inflationary rewards, Fuel focuses on sustainable economics driven by transaction fees. [Learn more.](https://docs.fuel.network/docs/specs/fuel-vm/#script-execution)

### Parallel Execution for Low Fees

Fuel’s unique parallel transaction execution significantly reduces congestion. This results in:

- Lower transaction fees.
- Faster settlement times, which encourages a high volume of transactions.
  
This aligns with the long-term vision of most blockchains to sustain security through transaction fees rather than inflation.

## Transaction Fees in the Fuel Network

In the Fuel network, transaction fees are essential for incentivizing block builders to prioritize transactions and for maintaining network security and efficiency. Understanding how transaction fees are calculated and how they are used helps users make informed decisions on how to interact with the network.

## What Are Transaction Fees?

Transaction fees in Fuel are the costs that users must pay to process and execute their transactions on the network. These fees are dynamic and depend on several factors, including the gas consumed by the transaction, the gas price, and the gas limit set by the user.

Transaction fees are calculated based on gas consumption during the execution of the transaction. There are two main components that determine the cost:

- **Intrinsic Fees:** The fundamental costs associated with a transaction, including the byte size, processing of inputs/outputs, predicates and signature verification, and initializing the virtual machine (VM). These fees are incurred regardless of whether the transaction is successfully executed.  
- **Execution Fees:** Costs associated with the computational work performed during the transaction, determined by the complexity of operations such as smart contract execution, data manipulation, and VM computations.  

## Gas Consumption Breakdown  

- **Intrinsic Gas Fees:** These cover the basic costs of transaction handling, which include:  
  - Byte size of the transaction.  
  - Input/output processing.  
  - Predicate evaluation and signature verification.  
  - VM initialization (prior to executing scripts or predicates).  

- **Execution Gas Fees:** These fees account for the gas consumed during the execution phase of the transaction, such as:  
  - Smart contract execution.  
  - Data processing and storage.  
  - Interactions with decentralized applications (dApps) or other smart contracts.  
The total fee for a transaction is calculated using the following formula:

```python
def cost(tx, gasPrice) -> int:
   return gas_to_fee(min_gas(tx) + tx.gasLimit - unspentGas, gasPrice)
```

Where:

- `min_gas(tx)`: Minimum gas required for the transaction, covering intrinsic fees.
- `tx.gasLimit`: The maximum amount of gas that the user is willing to spend for this transaction.
- `unspentGas`: Gas left over after intrinsic costs and execution. This is collected by the block producer as a reward in the Fuel
  network.
- `gas_to_fee()`: Converts the total gas used (after considering min gas, gas limit, and unspent gas) into a fee based on the gasPrice.

The final transaction fee depends on the amount of gas consumed during execution and the gas price specified by the user.

If the transaction uses less gas than the gas limit set by the user, the leftover gas (referred to as unspent gas) is collected by  block builder as a reward.

`The block gas limit is 30000000`

## Tips in the Fuel Network

Tips are an additional fee provided by the user to incentivize block builders to prioritize their transaction. In Fuel, the priority of your transaction’s inclusion in the block is determined by both the tip and the max_gas (gas limit) you set for the transaction.

## What is a Tip?

A tip is an extra fee that the user adds on top of the minimum transaction fees to increase the likelihood that their transaction will be included in the next block. This tip directly incentivizes the block builder to prioritize the transaction.

- **Setting the Tip in a Transaction**

To set the tip in a transaction using the Fuel SDK, you can specify it in the transaction parameters. Here’s an example in TypeScript using the fuels library:

```typescript
import { bn, ScriptTransactionRequest } from 'fuels';

const transactionRequest = new ScriptTransactionRequest({
  tip: bn(10), // Sets the tip policy
  maxFee: bn(1), // Sets the max fee policy
});
```

In this example, the tip is set to 10 using the bn function to handle big numbers. The tip is an optional amount added to incentivize the block producer to include the transaction, ensuring faster processing for those willing to pay more.

## Fee Structure and Incentives

Fuel uses a dynamic fee model where transaction fees are adjusted based on network congestion, transaction complexity, and the user’s willingness to pay higher fees. Block builders are incentivized based on both the tip and max_gas (gas limit), creating a flexible and efficient system.

## Transaction Prioritization

In Fuel, transactions are prioritized by the block builder based on two main factors:

- **Tip:** The additional gas fee provided by the user to incentivize faster processing of the transaction. A higher tip means higher priority for inclusion in the block.
- **max_gas:** The maximum gas limit specified by the user for the transaction. A higher max_gas means the transaction may take longer to process, lowering its priority.

The priority of a transaction is:

- Directly proportional to the tip: Higher tips increase the transaction’s priority.
- Inversely proportional to the max_gas: A higher gas limit decreases the transaction’s priority.

This model encourages users to offer a higher tip to ensure quicker inclusion, while also considering the transaction’s gas limit to avoid excessively large transactions.

## Unspent Gas and Block Producer Rewards

After a transaction is executed, any leftover gas (`unspentGas`) is collected by the block producer as a reward.

- **UnspentGas:** The remaining Gas left over after intrinsic costs and execution. This is collected by the block producer as a reward in the Fuel
- **Block Producer Incentives:** Block producers are rewarded for processing transactions, both through the minimum fee (guaranteed for each transaction) and the unspent gas collected.

The unspent gas ensures that block producers are incentivized to prioritize transactions with higher tips and to optimize block space for better overall performance.

## Example Gas Calculation

Here’s a simplified example of how gas works in Fuel:

- **Transaction:** A user sends tokens to another account.
- **Gas Calculation:**
  - Compute Gas: CPU work required to validate the transaction.
  - Storage Gas: Updating the account balance in the blockchain.

If the gas limit is set to 10,000 and the gas price is 1 gwei, the total fee would be:

- 10,000 x 1 gwei = 10,000 gwei (or 0.00001 ETH ).

When a transaction involves script execution, the system sets up the virtual machine (VM) to run the transaction. It checks the amount of gas available for the transaction and starts running the script step by step.

For each step in the script, the system calculates how much gas it needs. If there isn’t enough gas left to run a step, it stops the process and “reverts” the transaction, meaning nothing changes except for the gas spent. If there’s enough gas, it continues running the script and deducts the gas used. [Learn more](https://docs.fuel.network/docs/fuel-book/the-architecture/transactions-on-fuel)

At the end of the transaction, the system updates a record (called the `receiptsRoot`) to show the results of the transaction. This process helps ensure that the transaction is handled efficiently and fairly, with gas being used properly.

## Fee Calculation Example

Let’s consider a transaction with the following parameters:

- Intrinsic Gas (`min_gas(tx)`): 10,000 gas
- Gas Limit (`tx.gasLimit`): 50,000 gas
- Unspent Gas (`unspentGas`): 5,000 gas
- Gas Price (`gasPrice`): 0.001 Fuel per gas unit

The transaction fee will be calculated as:

```python
min_gas = 10000
gasLimit = 50000
unspentGas = 5000
gasPrice = 0.001

# Total gas used for the transaction
totalGas = min_gas + gasLimit - unspentGas

# Convert gas to fee
fee = gas_to_fee(totalGas, gasPrice)
```

This fee is the final cost that the user will pay for the transaction, which includes both intrinsic and execution gas fees, adjusted based on the gas price. Note that `gasLimit` applies to transactions of type Script. `gasLimit` is not applicable for transactions of type Create and is defined to equal 0 in the above formula.

## Transaction Parameters

The following are the available parameters to control transaction behavior:

```typescript
const txParams: TxParams = {
  gasLimit: bn(70935),
  maxFee: bn(69242),
  tip: bn(100),
};
```

### Explanation of Parameters

- **Gas Limit (`gasLimit`):** The maximum amount of gas you're willing to allow the transaction to consume. If the transaction requires more gas than this limit, it will fail.
  - Example: `gasLimit: bn(70935)`
- **Max Fee (`maxFee`):** The maximum amount you're willing to pay for the transaction using the base asset. This allows users to set an upper limit on the transaction fee they are willing to pay, preventing unexpected high costs due to sudden network congestion or fee spikes.
  - Example: `maxFee: bn(69242)`
- **Tip (`tip`):** An optional amount of the base asset to incentivize the block producer to include the transaction, ensuring faster processing for those willing to pay more. The value set here will be added to the transaction maxFee.
  - Example: `tip: bn(100)`

--------

Fuel’s transaction fee model provides a balanced approach to cost and incentivization:

- Transaction Fees are composed of intrinsic and execution gas fees, with the `gasPrice` determining the final transaction cost.
- Tip and `max_gas` determine transaction priority, allowing users to prioritize their transactions by increasing the tip or adjusting the gas limit.

By setting parameters such as `gasLimit`, `maxFee`, `tip`, and others, users have full control over the cost and priority of their transactions, ensuring a flexible and efficient experience within the Fuel network.
