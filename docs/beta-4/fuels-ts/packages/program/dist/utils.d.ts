import type { TransactionResult } from '@fuel-ts/providers';
/**
 * @hidden
 */
export declare const getDocs: (status: TransactionResult['gqlTransaction']['status']) => {
    doc: string;
    reason: string;
};
/**
 * @hidden
 *
 * Generic assert function to avoid undesirable errors
 */
export declare function assert(condition: unknown, message: string): asserts condition;
//# sourceMappingURL=utils.d.ts.map