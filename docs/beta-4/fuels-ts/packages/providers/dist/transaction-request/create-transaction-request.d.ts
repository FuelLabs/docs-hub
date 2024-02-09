import { type BN } from '@fuel-ts/math';
import type { TransactionCreate } from '@fuel-ts/transactions';
import { TransactionType } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';
import type { GqlGasCosts } from '../__generated__/operations';
import type { ContractCreatedTransactionRequestOutput } from './output';
import type { TransactionRequestStorageSlot } from './storage-slot';
import { BaseTransactionRequest } from './transaction-request';
import type { BaseTransactionRequestLike } from './transaction-request';
/**
 * @hidden
 */
export interface CreateTransactionRequestLike extends BaseTransactionRequestLike {
    /** Witness index of contract bytecode to create */
    bytecodeWitnessIndex?: number;
    /** Salt */
    salt?: BytesLike;
    /** List of storage slots to initialize */
    storageSlots?: TransactionRequestStorageSlot[];
}
/**
 * `CreateTransactionRequest` provides functionalities for creating a transaction request that creates a contract.
 */
export declare class CreateTransactionRequest extends BaseTransactionRequest {
    static from(obj: CreateTransactionRequestLike): CreateTransactionRequest;
    /** Type of the transaction */
    type: TransactionType.Create;
    /** Witness index of contract bytecode to create */
    bytecodeWitnessIndex: number;
    /** Salt */
    salt: string;
    /** List of storage slots to initialize */
    storageSlots: TransactionRequestStorageSlot[];
    /**
     * Creates an instance `CreateTransactionRequest`.
     *
     * @param createTransactionRequestLike - The initial values for the instance
     */
    constructor({ bytecodeWitnessIndex, salt, storageSlots, ...rest }?: CreateTransactionRequestLike);
    /**
     * Converts the transaction request to a `TransactionCreate`.
     *
     * @returns The transaction create object.
     */
    toTransaction(): TransactionCreate;
    /**
     * Get contract created outputs for the transaction.
     *
     * @returns An array of contract created transaction request outputs.
     */
    getContractCreatedOutputs(): ContractCreatedTransactionRequestOutput[];
    /**
     * Gets the Transaction Request by hashing the transaction.
     *
     * @param chainId - The chain ID.
     *
     * @returns - A hash of the transaction, which is the transaction ID.
     */
    getTransactionId(chainId: number): string;
    /**
     * Adds a contract created output to the transaction request.
     *
     * @param contractId - The contract ID.
     * @param stateRoot - The state root.
     */
    addContractCreatedOutput(
    /** Contract ID */
    contractId: BytesLike, 
    /** State Root */
    stateRoot: BytesLike): void;
    metadataGas(gasCosts: GqlGasCosts): BN;
}
//# sourceMappingURL=create-transaction-request.d.ts.map