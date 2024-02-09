import type { FunctionFragment } from '@fuel-ts/abi-coder';
import type { AbstractProgram } from '@fuel-ts/interfaces';
import type { CallConfig, CallParams } from '../types';
import { BaseInvocationScope } from './base-invocation-scope';
/**
 * Represents a scope for invoking a function.
 *
 * @template TArgs - The type of the function arguments.
 * @template TReturn - The type of the return value.
 */
export declare class FunctionInvocationScope<TArgs extends Array<any> = Array<any>, TReturn = any> extends BaseInvocationScope<TReturn> {
    protected func: FunctionFragment;
    private callParameters?;
    private forward?;
    protected args: TArgs;
    /**
     * Constructs an instance of FunctionInvocationScope.
     *
     * @param program - The program.
     * @param func - The function fragment.
     * @param args - The arguments.
     */
    constructor(program: AbstractProgram, func: FunctionFragment, args: TArgs);
    /**
     * Gets the call configuration.
     *
     * @returns The call configuration.
     */
    getCallConfig(): CallConfig<TArgs>;
    /**
     * Sets the arguments for the function invocation.
     *
     * @param args - The arguments.
     * @returns The instance of FunctionInvocationScope.
     */
    setArguments(...args: TArgs): this;
    /**
     * Sets the call parameters for the function invocation.
     *
     * @param callParams - The call parameters.
     * @returns The instance of FunctionInvocationScope.
     * @throws If the function is not payable and forward is set.
     */
    callParams(callParams: CallParams): this;
}
//# sourceMappingURL=invocation-scope.d.ts.map