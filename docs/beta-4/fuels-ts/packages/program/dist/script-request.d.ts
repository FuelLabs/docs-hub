import type { BN } from '@fuel-ts/math';
import type { TransactionResultReturnDataReceipt, TransactionResultRevertReceipt, CallResult, TransactionResultReceipt, TransactionResultReturnReceipt, TransactionResultScriptResultReceipt } from '@fuel-ts/providers';
import { type BytesLike } from 'ethers';
import type { CallConfig } from './types';
export declare const calculateScriptDataBaseOffset: (maxInputs: number) => number;
export declare const POINTER_DATA_OFFSET: number;
/**
 * Represents a script result, containing information about the script execution.
 */
export type ScriptResult = {
    code: BN;
    gasUsed: BN;
    receipts: TransactionResultReceipt[];
    scriptResultReceipt: TransactionResultScriptResultReceipt;
    returnReceipt: TransactionResultReturnReceipt | TransactionResultReturnDataReceipt | TransactionResultRevertReceipt;
    callResult: CallResult;
};
/**
 * Decodes a CallResult using the provided decoder function.
 *
 * @param callResult - The CallResult to decode.
 * @param decoder - The decoding function to apply on the ScriptResult.
 * @param logs - Optional logs associated with the decoding.
 * @returns The decoded result.
 * @throws Throws an error if decoding fails.
 */
export declare function decodeCallResult<TResult>(callResult: CallResult, decoder: (scriptResult: ScriptResult) => TResult, logs?: Array<any>): TResult;
/**
 * Converts a CallResult to an invocation result based on the provided call configuration.
 *
 * @param callResult - The CallResult from the script call.
 * @param call - The call configuration.
 * @param logs - Optional logs associated with the decoding.
 * @returns The decoded invocation result.
 */
export declare function callResultToInvocationResult<TReturn>(callResult: CallResult, call: CallConfig, logs?: unknown[]): TReturn;
export type EncodedScriptCall = Uint8Array | {
    data: Uint8Array;
    script: Uint8Array;
};
/**
 * `ScriptRequest` provides functionality to encode and decode script data and results.
 *
 * @template TData - Type of the script data.
 * @template TResult - Type of the script result.
 */
export declare class ScriptRequest<TData = void, TResult = void> {
    /**
     * The bytes of the script.
     */
    bytes: Uint8Array;
    /**
     * A function to encode the script data.
     */
    scriptDataEncoder: (data: TData) => EncodedScriptCall;
    /**
     * A function to decode the script result.
     */
    scriptResultDecoder: (scriptResult: ScriptResult) => TResult;
    /**
     * Creates an instance of the ScriptRequest class.
     *
     * @param bytes - The bytes of the script.
     * @param scriptDataEncoder - The script data encoder function.
     * @param scriptResultDecoder - The script result decoder function.
     */
    constructor(bytes: BytesLike, scriptDataEncoder: (data: TData) => EncodedScriptCall, scriptResultDecoder: (scriptResult: ScriptResult) => TResult);
    /**
     * Gets the script data offset for the given bytes.
     *
     * @param byteLength - The byte length of the script.
     * @param maxInputs - The maxInputs value from the chain's consensus params.
     * @returns The script data offset.
     */
    static getScriptDataOffsetWithScriptBytes(byteLength: number, maxInputs: number): number;
    /**
     * Gets the script data offset.
     *
     * @param maxInputs - The maxInputs value from the chain's consensus params.
     * @returns The script data offset.
     */
    getScriptDataOffset(maxInputs: number): number;
    /**
     * Encodes the data for a script call.
     *
     * @param data - The script data.
     * @returns The encoded data.
     */
    encodeScriptData(data: TData): Uint8Array;
    /**
     * Decodes the result of a script call.
     *
     * @param callResult - The CallResult from the script call.
     * @param logs - Optional logs associated with the decoding.
     * @returns The decoded result.
     */
    decodeCallResult(callResult: CallResult, logs?: Array<any>): TResult;
}
//# sourceMappingURL=script-request.d.ts.map