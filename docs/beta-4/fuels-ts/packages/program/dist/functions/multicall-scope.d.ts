import type { AbstractContract } from '@fuel-ts/interfaces';
import { BaseInvocationScope } from './base-invocation-scope';
import type { FunctionInvocationScope } from './invocation-scope';
/**
 * Represents a scope for invoking multiple calls.
 *
 * @template TReturn - The type of the return value.
 */
export declare class MultiCallInvocationScope<TReturn = any> extends BaseInvocationScope<TReturn> {
    /**
     * Constructs an instance of MultiCallInvocationScope.
     *
     * @param contract - The contract.
     * @param funcScopes - An array of function invocation scopes.
     */
    constructor(contract: AbstractContract, funcScopes: Array<FunctionInvocationScope>);
    /**
     * Adds a single function invocation scope to the multi-call invocation scope.
     *
     * @param funcScope - The function invocation scope.
     * @returns The instance of MultiCallInvocationScope.
     */
    addCall(funcScope: FunctionInvocationScope): this;
    /**
     * Adds multiple function invocation scopes to the multi-call invocation scope.
     *
     * @param funcScopes - An array of function invocation scopes.
     * @returns The instance of MultiCallInvocationScope.
     */
    addCalls(funcScopes: Array<FunctionInvocationScope>): this;
    private validateHeapTypeReturnCalls;
}
//# sourceMappingURL=multicall-scope.d.ts.map