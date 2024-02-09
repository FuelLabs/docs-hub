import type { AddressLike, AbstractAddress, AbstractPredicate } from '@fuel-ts/interfaces';
import type { BN, BigNumberish } from '@fuel-ts/math';
import type { TransactionScript, Policy, TransactionCreate } from '@fuel-ts/transactions';
import { TransactionType } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';
import type { GqlGasCosts } from '../__generated__/operations';
import type { Coin } from '../coin';
import type { CoinQuantity, CoinQuantityLike } from '../coin-quantity';
import type { MessageCoin } from '../message';
import type { ChainInfo } from '../provider';
import type { Resource } from '../resource';
import type { CoinTransactionRequestOutput } from '.';
import type { TransactionRequestInput, CoinTransactionRequestInput } from './input';
import type { TransactionRequestOutput, ChangeTransactionRequestOutput } from './output';
import type { TransactionRequestWitness } from './witness';
export { 
/**
 * @hidden
 */
TransactionType, };
/**
 * @hidden
 *
 * Interface defining a like structure for a base transaction request.
 */
export interface BaseTransactionRequestLike {
    /** Gas price for transaction */
    gasPrice?: BigNumberish;
    /** Block until which tx cannot be included */
    maturity?: number;
    /** The maximum fee payable by this transaction using BASE_ASSET. */
    maxFee?: BigNumberish;
    /** The maximum amount of witness data allowed for the transaction */
    witnessLimit?: BigNumberish;
    /** List of inputs */
    inputs?: TransactionRequestInput[];
    /** List of outputs */
    outputs?: TransactionRequestOutput[];
    /** List of witnesses */
    witnesses?: TransactionRequestWitness[];
}
type ToBaseTransactionResponse = Pick<TransactionScript, 'inputs' | 'inputsCount' | 'outputs' | 'outputsCount' | 'witnesses' | 'witnessesCount' | 'policies' | 'policyTypes'>;
/**
 * Abstract class to define the functionalities of a transaction request transaction request.
 */
export declare abstract class BaseTransactionRequest implements BaseTransactionRequestLike {
    /** Type of the transaction */
    abstract type: TransactionType;
    /** Gas price for transaction */
    gasPrice: BN;
    /** Block until which tx cannot be included */
    maturity: number;
    /** The maximum fee payable by this transaction using BASE_ASSET. */
    maxFee?: BN;
    /** The maximum amount of witness data allowed for the transaction */
    witnessLimit?: BN | undefined;
    /** List of inputs */
    inputs: TransactionRequestInput[];
    /** List of outputs */
    outputs: TransactionRequestOutput[];
    /** List of witnesses */
    witnesses: TransactionRequestWitness[];
    /**
     * Constructor for initializing a base transaction request.
     *
     * @param baseTransactionRequest - Optional object containing properties to initialize the transaction request.
     */
    constructor({ gasPrice, maturity, maxFee, witnessLimit, inputs, outputs, witnesses, }?: BaseTransactionRequestLike);
    static getPolicyMeta(req: BaseTransactionRequest): {
        policyTypes: number;
        policies: Policy[];
    };
    /**
     * Method to obtain the base transaction details.
     *
     * @returns The base transaction details.
     */
    protected getBaseTransaction(): ToBaseTransactionResponse;
    abstract toTransaction(): TransactionCreate | TransactionScript;
    /**
     * Converts the transaction request to a byte array.
     *
     * @returns The transaction bytes.
     */
    toTransactionBytes(): Uint8Array;
    /**
     * @hidden
     *
     * Pushes an input to the list without any side effects and returns the index
     */
    protected pushInput(input: TransactionRequestInput): number;
    /**
     * @hidden
     *
     * Pushes an output to the list without any side effects and returns the index
     */
    protected pushOutput(output: TransactionRequestOutput): number;
    /**
     * @hidden
     *
     * Creates an empty witness without any side effects and returns the index
     */
    protected createWitness(): number;
    /**
     * Updates the witness for a given owner and signature.
     *
     * @param address - The address to get the coin input witness index for.
     * @param signature - The signature to update the witness with.
     */
    updateWitnessByOwner(address: AbstractAddress, signature: BytesLike): void;
    /**
     * Updates an existing witness without any side effects.
     *
     * @param index - The index of the witness to update.
     * @param witness - The new witness.
     * @throws If the witness does not exist.
     */
    updateWitness(index: number, witness: TransactionRequestWitness): void;
    /**
     * Gets the coin inputs for a transaction.
     *
     * @returns The coin inputs.
     */
    getCoinInputs(): CoinTransactionRequestInput[];
    /**
     * Gets the coin outputs for a transaction.
     *
     * @returns The coin outputs.
     */
    getCoinOutputs(): CoinTransactionRequestOutput[];
    /**
     * Gets the change outputs for a transaction.
     *
     * @returns The change outputs.
     */
    getChangeOutputs(): ChangeTransactionRequestOutput[];
    /**
     * @hidden
     *
     * Returns the witnessIndex of the found CoinInput.
     */
    getCoinInputWitnessIndexByOwner(owner: AddressLike): number | undefined;
    /**
     * Adds a single coin input to the transaction and a change output for the related
     * assetId, if one it was not added yet.
     *
     * @param coin - Coin resource.
     * @param predicate - Predicate bytes.
     * @param predicateData - Predicate data bytes.
     */
    addCoinInput(coin: Coin, predicate?: AbstractPredicate): void;
    /**
     * Adds a single message input to the transaction and a change output for the
     * baseAssetId, if one it was not added yet.
     *
     * @param message - Message resource.
     * @param predicate - Predicate bytes.
     * @param predicateData - Predicate data bytes.
     */
    addMessageInput(message: MessageCoin, predicate?: AbstractPredicate): void;
    /**
     * Adds a single resource to the transaction by adding a coin/message input and a
     * change output for the related assetId, if one it was not added yet.
     *
     * @param resource - The resource to add.
     * @returns This transaction.
     */
    addResource(resource: Resource): this;
    /**
     * Adds multiple resources to the transaction by adding coin/message inputs and change
     * outputs from the related assetIds.
     *
     * @param resources - The resources to add.
     * @returns This transaction.
     */
    addResources(resources: ReadonlyArray<Resource>): this;
    /**
     * Adds multiple resources to the transaction by adding coin/message inputs and change
     * outputs from the related assetIds.
     *
     * @param resources - The resources to add.
     * @returns This transaction.
     */
    addPredicateResource(resource: Resource, predicate: AbstractPredicate): this;
    /**
     * Adds multiple predicate coin/message inputs to the transaction and change outputs
     * from the related assetIds.
     *
     * @param resources - The resources to add.
     * @returns This transaction.
     */
    addPredicateResources(resources: Resource[], predicate: AbstractPredicate): this;
    /**
     * Adds a coin output to the transaction.
     *
     * @param to - Address of the owner.
     * @param amount - Amount of coin.
     * @param assetId - Asset ID of coin.
     */
    addCoinOutput(to: AddressLike, amount: BigNumberish, assetId?: BytesLike): this;
    /**
     * Adds multiple coin outputs to the transaction.
     *
     * @param to - Address of the destination.
     * @param quantities - Quantities of coins.
     */
    addCoinOutputs(to: AddressLike, quantities: CoinQuantityLike[]): this;
    /**
     * Adds a change output to the transaction.
     *
     * @param to - Address of the owner.
     * @param assetId - Asset ID of coin.
     */
    addChangeOutput(to: AddressLike, assetId?: BytesLike): void;
    /**
     * @hidden
     */
    byteSize(): number;
    /**
     * @hidden
     */
    metadataGas(_gasCosts: GqlGasCosts): BN;
    /**
     * @hidden
     */
    calculateMinGas(chainInfo: ChainInfo): BN;
    calculateMaxGas(chainInfo: ChainInfo, minGas: BN): BN;
    /**
     * Funds the transaction with fake UTXOs for each assetId and amount in the
     * quantities array.
     *
     * @param quantities - CoinQuantity Array.
     */
    fundWithFakeUtxos(quantities: CoinQuantity[]): void;
    /**
     * Retrieves an array of CoinQuantity for each coin output present in the transaction.
     * a transaction.
     *
     * @returns  CoinQuantity array.
     */
    getCoinOutputsQuantities(): CoinQuantity[];
    /**
     * Gets the Transaction Request by hashing the transaction.
     *
     * @param chainId - The chain ID.
     *
     * @returns - A hash of the transaction, which is the transaction ID.
     */
    abstract getTransactionId(chainId: number): string;
    /**
     * Return the minimum amount in native coins required to create
     * a transaction.
     *
     * @returns The transaction as a JSON object.
     */
    toJSON(): any;
    /**
     * @hidden
     *
     * Determines whether the transaction has a predicate input.
     *
     * @returns Whether the transaction has a predicate input.
     */
    hasPredicateInput(): boolean;
}
//# sourceMappingURL=transaction-request.d.ts.map