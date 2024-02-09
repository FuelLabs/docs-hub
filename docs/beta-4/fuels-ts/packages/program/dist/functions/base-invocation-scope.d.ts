import type { AbstractContract, AbstractProgram } from '@fuel-ts/interfaces';
import type { BN } from '@fuel-ts/math';
import type { Provider, CoinQuantity } from '@fuel-ts/providers';
import { ScriptTransactionRequest } from '@fuel-ts/providers';
import type { ContractCall, InvocationScopeLike, TransactionCostOptions, TxParams } from '../types';
import { InvocationCallResult, FunctionInvocationResult } from './invocation-results';
/**
 * Base class for managing invocation scopes and preparing transactions.
 */
export declare class BaseInvocationScope<TReturn = any> {
    protected transactionRequest: ScriptTransactionRequest;
    protected program: AbstractProgram;
    protected functionInvocationScopes: Array<InvocationScopeLike>;
    protected txParameters?: TxParams;
    protected requiredCoins: CoinQuantity[];
    protected isMultiCall: boolean;
    /**
     * Constructs an instance of BaseInvocationScope.
     *
     * @param program - The abstract program to be invoked.
     * @param isMultiCall - A flag indicating whether the invocation is a multi-call.
     */
    constructor(program: AbstractProgram, isMultiCall: boolean);
    /**
     * Getter for the contract calls.
     *
     * @returns An array of contract calls.
     */
    protected get calls(): ContractCall[];
    /**
     * Updates the script request with the current contract calls.
     */
    protected updateScriptRequest(): void;
    /**
     * Updates the transaction request with the current input/output.
     */
    protected updateContractInputAndOutput(): void;
    /**
     * Gets the required coins for the transaction.
     *
     * @returns An array of required coin quantities.
     */
    protected getRequiredCoins(): Array<CoinQuantity>;
    /**
     * Updates the required coins for the transaction.
     */
    protected updateRequiredCoins(): void;
    /**
     * Adds a single call to the invocation scope.
     *
     * @param funcScope - The function scope to add.
     * @returns The current instance of the class.
     */
    protected addCall(funcScope: InvocationScopeLike): this;
    /**
     * Adds multiple calls to the invocation scope.
     *
     * @param funcScopes - An array of function scopes to add.
     * @returns The current instance of the class.
     */
    protected addCalls(funcScopes: Array<InvocationScopeLike>): this;
    /**
     * Prepares the transaction by updating the script request, required coins, and checking the gas limit.
     */
    protected prepareTransaction(): Promise<void>;
    /**
     * Checks if the total gas limit is within the acceptable range.
     */
    protected checkGasLimitTotal(): void;
    /**
     * Gets the transaction cost ny dry running the transaction.
     *
     * @param options - Optional transaction cost options.
     * @returns The transaction cost details.
     */
    getTransactionCost(options?: TransactionCostOptions): Promise<import("@fuel-ts/providers").TransactionCost>;
    /**
     * Funds the transaction with the required coins.
     *
     * @returns The current instance of the class.
     */
    fundWithRequiredCoins(fee: BN): Promise<this>;
    /**
     * Sets the transaction parameters.
     *
     * @param txParams - The transaction parameters to set.
     * @returns The current instance of the class.
     */
    txParams(txParams: TxParams): this;
    /**
     * Adds contracts to the invocation scope.
     *
     * @param contracts - An array of contracts to add.
     * @returns The current instance of the class.
     */
    addContracts(contracts: Array<AbstractContract>): this;
    /**
     * Prepares and returns the transaction request object.
     *
     * @returns The prepared transaction request.
     */
    getTransactionRequest(): Promise<ScriptTransactionRequest>;
    /**
     * Submits a transaction.
     *
     * @returns The result of the function invocation.
     */
    call<T = TReturn>(): Promise<FunctionInvocationResult<T>>;
    /**
     * Simulates a transaction.
     *
     * @returns The result of the invocation call.
     */
    simulate<T = TReturn>(): Promise<InvocationCallResult<T>>;
    /**
     * Executes a transaction in dry run mode.
     *
     * @returns The result of the invocation call.
     */
    dryRun<T = TReturn>(): Promise<InvocationCallResult<T>>;
    getProvider(): Provider;
    /**
     * Obtains the ID of a transaction.
     *
     * @param chainId - the chainId to use to hash the transaction with
     * @returns the ID of the transaction.
     */
    getTransactionId(chainId?: number): Promise<string>;
}
//# sourceMappingURL=base-invocation-scope.d.ts.map