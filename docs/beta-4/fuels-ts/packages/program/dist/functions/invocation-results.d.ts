import type { AbstractProgram } from '@fuel-ts/interfaces';
import type { BN } from '@fuel-ts/math';
import type { CallResult, TransactionResponse, TransactionResult, TransactionResultReceipt } from '@fuel-ts/providers';
import type { InvocationScopeLike } from '../types';
/**
 * Represents the result of a function invocation, with decoded logs and gas usage.
 *
 * @template T - The type of the returned value.
 */
export declare class InvocationResult<T = any> {
    readonly functionScopes: Array<InvocationScopeLike>;
    readonly isMultiCall: boolean;
    readonly gasUsed: BN;
    readonly value: T;
    /**
     * Constructs an instance of InvocationResult.
     *
     * @param funcScopes - The function scopes.
     * @param callResult - The call result.
     * @param isMultiCall - Whether it's a multi-call.
     */
    constructor(funcScopes: InvocationScopeLike | Array<InvocationScopeLike>, callResult: CallResult, isMultiCall: boolean);
    /**
     * Gets the first call config.
     *
     * @returns The first call config.
     */
    private getFirstCallConfig;
    /**
     * Decodes the value from the call result.
     *
     * @param callResult - The call result.
     * @returns The decoded value.
     */
    protected getDecodedValue(callResult: CallResult): T;
    /**
     * Decodes the logs from the receipts.
     *
     * @param receipts - The transaction result receipts.
     * @returns The decoded logs.
     */
    protected getDecodedLogs(receipts: Array<TransactionResultReceipt>): unknown[];
}
/**
 * Represents the result of a function invocation with transaction details.
 *
 * @template T - The type of the returned value.
 * @template TTransactionType - The type of the transaction.
 */
export declare class FunctionInvocationResult<T = any, TTransactionType = void> extends InvocationResult<T> {
    readonly transactionId: string;
    readonly transactionResponse: TransactionResponse;
    readonly transactionResult: TransactionResult<TTransactionType>;
    readonly program: AbstractProgram;
    readonly logs: Array<any>;
    /**
     * Constructs an instance of FunctionInvocationResult.
     *
     * @param funcScopes - The function scopes.
     * @param transactionResponse - The transaction response.
     * @param transactionResult - The transaction result.
     * @param program - The program.
     * @param isMultiCall - Whether it's a multi-call.
     */
    constructor(funcScopes: InvocationScopeLike | Array<InvocationScopeLike>, transactionResponse: TransactionResponse, transactionResult: TransactionResult<TTransactionType>, program: AbstractProgram, isMultiCall: boolean);
    /**
     * Builds an instance of FunctionInvocationResult.
     *
     * @param funcScope - The function scope.
     * @param transactionResponse - The transaction response.
     * @param isMultiCall - Whether it's a multi-call.
     * @param program - The program.
     * @returns The function invocation result.
     */
    static build<T, TTransactionType = void>(funcScope: InvocationScopeLike | Array<InvocationScopeLike>, transactionResponse: TransactionResponse, isMultiCall: boolean, program: AbstractProgram): Promise<FunctionInvocationResult<T, TTransactionType>>;
}
/**
 * Represents the result of an invocation call.
 *
 * @template T - The type of the returned value.
 */
export declare class InvocationCallResult<T = any> extends InvocationResult<T> {
    readonly callResult: CallResult;
    /**
     * Constructs an instance of InvocationCallResult.
     *
     * @param funcScopes - The function scopes.
     * @param callResult - The call result.
     * @param isMultiCall - Whether it's a multi-call.
     */
    constructor(funcScopes: InvocationScopeLike | Array<InvocationScopeLike>, callResult: CallResult, isMultiCall: boolean);
    /**
     * Builds an instance of InvocationCallResult.
     *
     * @param funcScopes - The function scopes.
     * @param callResult - The call result.
     * @param isMultiCall - Whether it's a multi-call.
     * @returns The invocation call result.
     */
    static build<T>(funcScopes: InvocationScopeLike | Array<InvocationScopeLike>, callResult: CallResult, isMultiCall: boolean): Promise<InvocationCallResult<T>>;
}
//# sourceMappingURL=invocation-results.d.ts.map