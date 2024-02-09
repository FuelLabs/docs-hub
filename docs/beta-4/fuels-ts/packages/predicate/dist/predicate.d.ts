import type { JsonAbi, InputValue } from '@fuel-ts/abi-coder';
import { Interface } from '@fuel-ts/abi-coder';
import type { AbstractAddress, AbstractPredicate, BytesLike } from '@fuel-ts/interfaces';
import type { BigNumberish } from '@fuel-ts/math';
import type { CallResult, Provider, TransactionRequest, TransactionRequestLike, TransactionResponse } from '@fuel-ts/providers';
import type { TxParamsType } from '@fuel-ts/wallet';
import { Account } from '@fuel-ts/wallet';
/**
 * `Predicate` provides methods to populate transaction data with predicate information and sending transactions with them.
 */
export declare class Predicate<ARGS extends InputValue[]> extends Account implements AbstractPredicate {
    bytes: Uint8Array;
    predicateData: Uint8Array;
    predicateArgs: ARGS;
    interface?: Interface;
    /**
     * Creates an instance of the Predicate class.
     *
     * @param bytes - The bytes of the predicate.
     * @param provider - The provider used to interact with the blockchain.
     * @param jsonAbi - The JSON ABI of the predicate.
     * @param configurableConstants - Optional configurable constants for the predicate.
     */
    constructor(bytes: BytesLike, provider: Provider, jsonAbi?: JsonAbi, configurableConstants?: {
        [name: string]: unknown;
    });
    /**
     * Populates the transaction data with predicate data.
     *
     * @param transactionRequestLike - The transaction request-like object.
     * @returns The transaction request with predicate data.
     */
    populateTransactionPredicateData(transactionRequestLike: TransactionRequestLike): TransactionRequest;
    /**
     * A helper that creates a transfer transaction request and returns it.
     *
     * @param destination - The address of the destination.
     * @param amount - The amount of coins to transfer.
     * @param assetId - The asset ID of the coins to transfer.
     * @param txParams - The transaction parameters (gasLimit, gasPrice, maturity).
     * @returns A promise that resolves to the prepared transaction request.
     */
    createTransfer(
    /** Address of the destination */
    destination: AbstractAddress, 
    /** Amount of coins */
    amount: BigNumberish, 
    /** Asset ID of coins */
    assetId?: BytesLike, 
    /** Tx Params */
    txParams?: TxParamsType): Promise<TransactionRequest>;
    /**
     * Sends a transaction with the populated predicate data.
     *
     * @param transactionRequestLike - The transaction request-like object.
     * @returns A promise that resolves to the transaction response.
     */
    sendTransaction(transactionRequestLike: TransactionRequestLike): Promise<TransactionResponse>;
    /**
     * Simulates a transaction with the populated predicate data.
     *
     * @param transactionRequestLike - The transaction request-like object.
     * @returns A promise that resolves to the call result.
     */
    simulateTransaction(transactionRequestLike: TransactionRequestLike): Promise<CallResult>;
    /**
     * Sets data for the predicate.
     *
     * @param args - Arguments for the predicate function.
     * @returns The Predicate instance with updated predicate data.
     */
    setData<T extends ARGS>(...args: T): this;
    private getPredicateData;
    /**
     * Processes the predicate data and returns the altered bytecode and interface.
     *
     * @param bytes - The bytes of the predicate.
     * @param jsonAbi - The JSON ABI of the predicate.
     * @param configurableConstants - Optional configurable constants for the predicate.
     * @returns An object containing the new predicate bytes and interface.
     */
    private static processPredicateData;
    /**
     * Sets the configurable constants for the predicate.
     *
     * @param bytes - The bytes of the predicate.
     * @param configurableConstants - Configurable constants to be set.
     * @param abiInterface - The ABI interface of the predicate.
     * @returns The mutated bytes with the configurable constants set.
     */
    private static setConfigurableConstants;
}
//# sourceMappingURL=predicate.d.ts.map