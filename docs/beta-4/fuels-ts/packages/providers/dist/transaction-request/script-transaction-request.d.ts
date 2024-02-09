import type { InputValue, JsonAbi } from '@fuel-ts/abi-coder';
import type { AbstractScriptRequest, ContractIdLike } from '@fuel-ts/interfaces';
import type { BN, BigNumberish } from '@fuel-ts/math';
import type { TransactionScript } from '@fuel-ts/transactions';
import { TransactionType } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';
import type { GqlGasCosts } from '../__generated__/operations';
import type { ChainInfo } from '../provider';
import type { ContractTransactionRequestInput } from './input';
import type { ContractTransactionRequestOutput, VariableTransactionRequestOutput } from './output';
import type { BaseTransactionRequestLike } from './transaction-request';
import { BaseTransactionRequest } from './transaction-request';
/**
 * @hidden
 */
export interface ScriptTransactionRequestLike extends BaseTransactionRequestLike {
    /** Gas limit for transaction */
    gasLimit?: BigNumberish;
    /** Script to execute */
    script?: BytesLike;
    /** Script input data (parameters) */
    scriptData?: BytesLike;
}
/**
 * `ScriptTransactionRequest` provides functionalities for creating a transaction request that uses a script.
 */
export declare class ScriptTransactionRequest extends BaseTransactionRequest {
    static from(obj: ScriptTransactionRequestLike): ScriptTransactionRequest;
    /** Type of the transaction */
    type: TransactionType.Script;
    /** Gas limit for transaction */
    gasLimit: BN;
    /** Script to execute */
    script: Uint8Array;
    /** Script input data (parameters) */
    scriptData: Uint8Array;
    /**
     * Constructor for `ScriptTransactionRequest`.
     *
     * @param scriptTransactionRequestLike - The initial values for the instance.
     */
    constructor({ script, scriptData, gasLimit, ...rest }?: ScriptTransactionRequestLike);
    /**
     * Converts the transaction request to a `TransactionScript`.
     *
     * @returns The transaction script object.
     */
    toTransaction(): TransactionScript;
    /**
     * Get contract inputs for the transaction.
     *
     * @returns An array of contract transaction request inputs.
     */
    getContractInputs(): ContractTransactionRequestInput[];
    /**
     * Get contract outputs for the transaction.
     *
     * @returns An array of contract transaction request outputs.
     */
    getContractOutputs(): ContractTransactionRequestOutput[];
    /**
     * Get variable outputs for the transaction.
     *
     * @returns An array of variable transaction request outputs.
     */
    getVariableOutputs(): VariableTransactionRequestOutput[];
    /**
     * Set the script and its data.
     *
     * @param script - The abstract script request.
     * @param data - The script data.
     */
    setScript<T>(script: AbstractScriptRequest<T>, data: T): void;
    /**
     * Adds variable outputs to the transaction request.
     *
     * @param numberOfVariables - The number of variables to add.
     * @returns The new length of the outputs array.
     */
    addVariableOutputs(numberOfVariables?: number): number;
    calculateMaxGas(chainInfo: ChainInfo, minGas: BN): BN;
    /**
     * Adds a contract input and output to the transaction request.
     *
     * @param contract - The contract ID.
     * @returns The current instance of the `ScriptTransactionRequest`.
     */
    addContractInputAndOutput(contract: ContractIdLike): ScriptTransactionRequest;
    /**
     * Gets the Transaction Request by hashing the transaction.
     *
     * @param chainId - The chain ID.
     *
     * @returns - A hash of the transaction, which is the transaction ID.
     */
    getTransactionId(chainId: number): string;
    /**
     * Sets the data for the transaction request.
     *
     * @param abi - Script JSON ABI.
     * @param args - The input arguments.
     * @returns The current instance of the `ScriptTransactionRequest`.
     */
    setData(abi: JsonAbi, args: InputValue[]): ScriptTransactionRequest;
    metadataGas(gasCosts: GqlGasCosts): BN;
}
//# sourceMappingURL=script-transaction-request.d.ts.map