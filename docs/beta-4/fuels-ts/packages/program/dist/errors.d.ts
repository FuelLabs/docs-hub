import type { TransactionResult } from '@fuel-ts/providers';
/**
 * @hidden
 */
export declare class ScriptResultDecoderError extends Error {
    logs: any[];
    constructor(result: TransactionResult, message: string, logs: Array<unknown>);
}
//# sourceMappingURL=errors.d.ts.map