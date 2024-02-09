import type { AbstractAddress } from '@fuel-ts/interfaces';
import type { BN } from '@fuel-ts/math';
import type { Transaction } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';
import { Network } from 'ethers';
import { getSdk as getOperationsSdk } from './__generated__/operations';
import type { GqlGasCosts, GqlGetBlocksQueryVariables, GqlPeerInfo } from './__generated__/operations';
import type { Coin } from './coin';
import type { CoinQuantity, CoinQuantityLike } from './coin-quantity';
import { MemoryCache } from './memory-cache';
import type { Message, MessageProof, MessageStatus } from './message';
import type { ExcludeResourcesOption, Resource } from './resource';
import type { TransactionRequestLike, TransactionRequest } from './transaction-request';
import type { TransactionResultReceipt } from './transaction-response';
import { TransactionResponse } from './transaction-response';
export type CallResult = {
    receipts: TransactionResultReceipt[];
};
/**
 * A Fuel block
 */
export type Block = {
    id: string;
    height: BN;
    time: string;
    transactionIds: string[];
};
/**
 * Deployed Contract bytecode and contract id
 */
export type ContractResult = {
    id: string;
    bytecode: string;
};
type ConsensusParameters = {
    contractMaxSize: BN;
    maxInputs: BN;
    maxOutputs: BN;
    maxWitnesses: BN;
    maxGasPerTx: BN;
    maxScriptLength: BN;
    maxScriptDataLength: BN;
    maxStorageSlots: BN;
    maxPredicateLength: BN;
    maxPredicateDataLength: BN;
    maxGasPerPredicate: BN;
    gasPriceFactor: BN;
    gasPerByte: BN;
    maxMessageDataLength: BN;
    chainId: BN;
    gasCosts: GqlGasCosts;
};
/**
 * Chain information
 */
export type ChainInfo = {
    name: string;
    baseChainHeight: BN;
    consensusParameters: ConsensusParameters;
    gasCosts: GqlGasCosts;
    latestBlock: {
        id: string;
        height: BN;
        time: string;
        transactions: Array<{
            id: string;
        }>;
    };
};
/**
 * Node information
 */
export type NodeInfo = {
    utxoValidation: boolean;
    vmBacktrace: boolean;
    minGasPrice: BN;
    maxTx: BN;
    maxDepth: BN;
    nodeVersion: string;
    peers: GqlPeerInfo[];
};
export type NodeInfoAndConsensusParameters = {
    minGasPrice: BN;
    nodeVersion: string;
    gasPerByte: BN;
    gasPriceFactor: BN;
    maxGasPerTx: BN;
};
export type TransactionCost = {
    requiredQuantities: CoinQuantity[];
    receipts: TransactionResultReceipt[];
    minGasPrice: BN;
    gasPrice: BN;
    minGas: BN;
    maxGas: BN;
    gasUsed: BN;
    minFee: BN;
    maxFee: BN;
    usedFee: BN;
};
/**
 * @hidden
 *
 * Cursor pagination arguments
 *
 * https://relay.dev/graphql/connections.htm#sec-Arguments
 */
export type CursorPaginationArgs = {
    /** Forward pagination limit */
    first?: number | null;
    /** Forward pagination cursor */
    after?: string | null;
    /** Backward pagination limit  */
    last?: number | null;
    /** Backward pagination cursor */
    before?: string | null;
};
export type FetchRequestOptions = {
    method: 'POST';
    headers: {
        [key: string]: string;
    };
    body: string;
};
export type ProviderOptions = {
    fetch?: (url: string, options: FetchRequestOptions) => Promise<unknown>;
    cacheUtxo?: number;
};
/**
 * UTXO Validation Param
 */
export type UTXOValidationParams = {
    utxoValidation?: boolean;
};
/**
 * Transaction estimation Param
 */
export type EstimateTransactionParams = {
    estimateTxDependencies?: boolean;
};
export type EstimatePredicateParams = {
    estimatePredicates?: boolean;
};
export type TransactionCostParams = EstimateTransactionParams & EstimatePredicateParams;
/**
 * Provider Call transaction params
 */
export type ProviderCallParams = UTXOValidationParams & EstimateTransactionParams;
/**
 * Provider Send transaction params
 */
export type ProviderSendTxParams = EstimateTransactionParams;
/**
 * A provider for connecting to a node
 */
export default class Provider {
    #private;
    /** GraphQL endpoint of the Fuel node */
    url: string;
    options: ProviderOptions;
    operations: ReturnType<typeof getOperationsSdk>;
    cache?: MemoryCache;
    static clearChainAndNodeCaches(): void;
    private static chainInfoCache;
    private static nodeInfoCache;
    /**
     * Constructor to initialize a Provider.
     *
     * @param url - GraphQL endpoint of the Fuel node
     * @param chainInfo - Chain info of the Fuel node
     * @param options - Additional options for the provider
     * @hidden
     */
    protected constructor(
    /** GraphQL endpoint of the Fuel node */
    url: string, options?: ProviderOptions);
    /**
     * Creates a new instance of the Provider class. This is the recommended way to initialize a Provider.
     * @param url - GraphQL endpoint of the Fuel node
     * @param options - Additional options for the provider
     */
    static create(url: string, options?: ProviderOptions): Promise<Provider>;
    /**
     * Returns the cached chainInfo for the current URL.
     */
    getChain(): ChainInfo;
    /**
     * Returns the cached nodeInfo for the current URL.
     */
    getNode(): NodeInfo;
    /**
     * Returns some helpful parameters related to gas fees.
     */
    getGasConfig(): {
        minGasPrice: BN;
        maxGasPerTx: BN;
        maxGasPerPredicate: BN;
        gasPriceFactor: BN;
        gasPerByte: BN;
        gasCosts: GqlGasCosts;
    };
    /**
     * Updates the URL for the provider and fetches the consensus parameters for the new URL, if needed.
     */
    connect(url: string, options?: ProviderOptions): Promise<void>;
    /**
     * Fetches both the chain and node information, saves it to the cache, and return it.
     *
     * @returns NodeInfo and Chain
     */
    fetchChainAndNodeInfo(): Promise<{
        chain: ChainInfo;
        nodeInfo: NodeInfo;
    }>;
    private static ensureClientVersionIsSupported;
    /**
     * Create GraphQL client and set operations.
     *
     * @param url - The URL of the Fuel node
     * @param options - Additional options for the provider
     * @returns The operation SDK object
     */
    private createOperations;
    /**
     * Returns the version of the connected node.
     *
     * @returns A promise that resolves to the version string.
     */
    getVersion(): Promise<string>;
    /**
     * @hidden
     *
     * Returns the network configuration of the connected Fuel node.
     *
     * @returns A promise that resolves to the network configuration object
     */
    getNetwork(): Promise<Network>;
    /**
     * Returns the block number.
     *
     * @returns A promise that resolves to the block number
     */
    getBlockNumber(): Promise<BN>;
    /**
     * Returns the chain information.
     * @param url - The URL of the Fuel node
     * @returns NodeInfo object
     */
    fetchNode(): Promise<NodeInfo>;
    /**
     * Fetches the `chainInfo` for the given node URL.
     * @param url - The URL of the Fuel node
     * @returns ChainInfo object
     */
    fetchChain(): Promise<ChainInfo>;
    /**
     * Returns the chain ID
     * @returns A promise that resolves to the chain ID number
     */
    getChainId(): number;
    /**
     * Submits a transaction to the chain to be executed.
     *
     * If the transaction is missing any dependencies,
     * the transaction will be mutated and those dependencies will be added.
     *
     * @param transactionRequestLike - The transaction request object.
     * @returns A promise that resolves to the transaction response object.
     */
    sendTransaction(transactionRequestLike: TransactionRequestLike, { estimateTxDependencies }?: ProviderSendTxParams): Promise<TransactionResponse>;
    /**
     * Executes a transaction without actually submitting it to the chain.
     *
     * If the transaction is missing any dependencies,
     * the transaction will be mutated and those dependencies will be added.
     *
     * @param transactionRequestLike - The transaction request object.
     * @param utxoValidation - Additional provider call parameters.
     * @returns A promise that resolves to the call result object.
     */
    call(transactionRequestLike: TransactionRequestLike, { utxoValidation, estimateTxDependencies }?: ProviderCallParams): Promise<CallResult>;
    /**
     * Verifies whether enough gas is available to complete transaction.
     *
     * @param transactionRequest - The transaction request object.
     * @returns A promise that resolves to the estimated transaction request object.
     */
    estimatePredicates(transactionRequest: TransactionRequest): Promise<TransactionRequest>;
    /**
     * Will dryRun a transaction and check for missing dependencies.
     *
     * If there are missing variable outputs,
     * `addVariableOutputs` is called on the transaction.
     *
     * @privateRemarks
     * TODO: Investigate support for missing contract IDs
     * TODO: Add support for missing output messages
     *
     * @param transactionRequest - The transaction request object.
     * @returns A promise.
     */
    estimateTxDependencies(transactionRequest: TransactionRequest): Promise<void>;
    /**
     * Executes a signed transaction without applying the states changes
     * on the chain.
     *
     * If the transaction is missing any dependencies,
     * the transaction will be mutated and those dependencies will be added
     *
     * @param transactionRequestLike - The transaction request object.
     * @returns A promise that resolves to the call result object.
     */
    simulate(transactionRequestLike: TransactionRequestLike, { estimateTxDependencies }?: EstimateTransactionParams): Promise<CallResult>;
    /**
     * Returns a transaction cost to enable user
     * to set gasLimit and also reserve balance amounts
     * on the the transaction.
     *
     * @privateRemarks
     * The tolerance is add on top of the gasUsed calculated
     * from the node, this create a safe margin costs like
     * change states on transfer that don't occur on the dryRun
     * transaction. The default value is 0.2 or 20%
     *
     * @param transactionRequestLike - The transaction request object.
     * @param tolerance - The tolerance to add on top of the gasUsed.
     * @returns A promise that resolves to the transaction cost object.
     */
    getTransactionCost(transactionRequestLike: TransactionRequestLike, forwardingQuantities?: CoinQuantity[], { estimateTxDependencies, estimatePredicates }?: TransactionCostParams): Promise<TransactionCost>;
    getResourcesForTransaction(owner: AbstractAddress, transactionRequestLike: TransactionRequestLike, forwardingQuantities?: CoinQuantity[]): Promise<{
        receipts: TransactionResultReceipt[];
        minGasPrice: BN;
        gasPrice: BN;
        minGas: BN;
        maxGas: BN;
        gasUsed: BN;
        minFee: BN;
        maxFee: BN;
        usedFee: BN;
        resources: Resource[];
        requiredQuantities: CoinQuantity[];
    }>;
    /**
     * Returns coins for the given owner.
     */
    getCoins(
    /** The address to get coins for */
    owner: AbstractAddress, 
    /** The asset ID of coins to get */
    assetId?: BytesLike, 
    /** Pagination arguments */
    paginationArgs?: CursorPaginationArgs): Promise<Coin[]>;
    /**
     * Returns resources for the given owner satisfying the spend query.
     *
     * @param owner - The address to get resources for.
     * @param quantities - The quantities to get.
     * @param excludedIds - IDs of excluded resources from the selection.
     * @returns A promise that resolves to the resources.
     */
    getResourcesToSpend(
    /** The address to get coins for */
    owner: AbstractAddress, 
    /** The quantities to get */
    quantities: CoinQuantityLike[], 
    /** IDs of excluded resources from the selection. */
    excludedIds?: ExcludeResourcesOption): Promise<Resource[]>;
    /**
     * Returns block matching the given ID or height.
     *
     * @param idOrHeight - ID or height of the block.
     * @returns A promise that resolves to the block.
     */
    getBlock(
    /** ID or height of the block */
    idOrHeight: string | number | 'latest'): Promise<Block | null>;
    /**
     * Returns all the blocks matching the given parameters.
     *
     * @param params - The parameters to query blocks.
     * @returns A promise that resolves to the blocks.
     */
    getBlocks(params: GqlGetBlocksQueryVariables): Promise<Block[]>;
    /**
     * Returns block matching the given ID or type, including transaction data.
     *
     * @param idOrHeight - ID or height of the block.
     * @returns A promise that resolves to the block.
     */
    getBlockWithTransactions(
    /** ID or height of the block */
    idOrHeight: string | number | 'latest'): Promise<(Block & {
        transactions: Transaction[];
    }) | null>;
    /**
     * Get transaction with the given ID.
     *
     * @param transactionId - ID of the transaction.
     * @returns A promise that resolves to the transaction.
     */
    getTransaction<TTransactionType = void>(transactionId: string): Promise<Transaction<TTransactionType> | null>;
    /**
     * Get deployed contract with the given ID.
     *
     * @param contractId - ID of the contract.
     * @returns A promise that resolves to the contract.
     */
    getContract(contractId: string): Promise<ContractResult | null>;
    /**
     * Returns the balance for the given contract for the given asset ID.
     *
     * @param contractId - The contract ID to get the balance for.
     * @param assetId - The asset ID of coins to get.
     * @returns A promise that resolves to the balance.
     */
    getContractBalance(
    /** The contract ID to get the balance for */
    contractId: AbstractAddress, 
    /** The asset ID of coins to get */
    assetId: BytesLike): Promise<BN>;
    /**
     * Returns the balance for the given owner for the given asset ID.
     *
     * @param owner - The address to get coins for.
     * @param assetId - The asset ID of coins to get.
     * @returns A promise that resolves to the balance.
     */
    getBalance(
    /** The address to get coins for */
    owner: AbstractAddress, 
    /** The asset ID of coins to get */
    assetId: BytesLike): Promise<BN>;
    /**
     * Returns balances for the given owner.
     *
     * @param owner - The address to get coins for.
     * @param paginationArgs - Pagination arguments.
     * @returns A promise that resolves to the balances.
     */
    getBalances(
    /** The address to get coins for */
    owner: AbstractAddress, 
    /** Pagination arguments */
    paginationArgs?: CursorPaginationArgs): Promise<CoinQuantity[]>;
    /**
     * Returns message for the given address.
     *
     * @param address - The address to get message from.
     * @param paginationArgs - Pagination arguments.
     * @returns A promise that resolves to the messages.
     */
    getMessages(
    /** The address to get message from */
    address: AbstractAddress, 
    /** Pagination arguments */
    paginationArgs?: CursorPaginationArgs): Promise<Message[]>;
    /**
     * Returns Message Proof for given transaction id and the message id from MessageOut receipt.
     *
     * @param transactionId - The transaction to get message from.
     * @param messageId - The message id from MessageOut receipt.
     * @param commitBlockId - The commit block id.
     * @param commitBlockHeight - The commit block height.
     * @returns A promise that resolves to the message proof.
     */
    getMessageProof(
    /** The transaction to get message from */
    transactionId: string, nonce: string, commitBlockId?: string, commitBlockHeight?: BN): Promise<MessageProof | null>;
    /**
     * Returns Message Proof for given transaction id and the message id from MessageOut receipt.
     *
     * @param nonce - The nonce of the message to get status from.
     * @returns A promise that resolves to the message status
     */
    getMessageStatus(
    /** The nonce of the message to get status from */
    nonce: string): Promise<MessageStatus>;
    /**
     * Lets you produce blocks with custom timestamps and the block number of the last block produced.
     *
     * @param amount - The amount of blocks to produce
     * @param startTime - The UNIX timestamp to set for the first produced block
     * @returns A promise that resolves to the block number of the last produced block.
     */
    produceBlocks(amount: number, startTime?: number): Promise<BN>;
}
export {};
//# sourceMappingURL=provider.d.ts.map