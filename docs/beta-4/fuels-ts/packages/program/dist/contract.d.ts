import type { FunctionFragment, JsonAbi } from '@fuel-ts/abi-coder';
import { Interface } from '@fuel-ts/abi-coder';
import type { AbstractAddress, AbstractContract } from '@fuel-ts/interfaces';
import type { Provider } from '@fuel-ts/providers';
import type { Account } from '@fuel-ts/wallet';
import type { BytesLike } from 'ethers';
import { FunctionInvocationScope } from './functions/invocation-scope';
import { MultiCallInvocationScope } from './functions/multicall-scope';
import type { InvokeFunctions } from './types';
/**
 * `Contract` provides a way to interact with the contract program type.
 */
export default class Contract implements AbstractContract {
    /**
     * The unique contract identifier.
     */
    id: AbstractAddress;
    /**
     * The provider for interacting with the contract.
     */
    provider: Provider;
    /**
     * The contract's ABI interface.
     */
    interface: Interface;
    /**
     * The account associated with the contract, if available.
     */
    account: Account | null;
    /**
     * A collection of functions available on the contract.
     */
    functions: InvokeFunctions;
    /**
     * Creates an instance of the Contract class.
     *
     * @param id - The contract's address.
     * @param abi - The contract's ABI (JSON ABI or Interface instance).
     * @param accountOrProvider - The account or provider for interaction.
     */
    constructor(id: string | AbstractAddress, abi: JsonAbi | Interface, accountOrProvider: Account | Provider);
    /**
     * Build a function invocation scope for the provided function fragment.
     *
     * @param func - The function fragment to build a scope for.
     * @returns A function that creates a FunctionInvocationScope.
     */
    buildFunction(func: FunctionFragment): (...args: Array<unknown>) => FunctionInvocationScope<unknown[], any>;
    /**
     * Create a multi-call invocation scope for the provided function invocation scopes.
     *
     * @param calls - An array of FunctionInvocationScopes to execute in a batch.
     * @returns A MultiCallInvocationScope instance.
     */
    multiCall(calls: Array<FunctionInvocationScope>): MultiCallInvocationScope<any>;
    /**
     * Get the balance for a given asset ID for this contract.
     *
     * @param assetId - The specified asset ID.
     * @returns The balance of the contract for the specified asset.
     */
    getBalance(assetId: BytesLike): Promise<import("@fuel-ts/math").BN>;
}
//# sourceMappingURL=contract.d.ts.map