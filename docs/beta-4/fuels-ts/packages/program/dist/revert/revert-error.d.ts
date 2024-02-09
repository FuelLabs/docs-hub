import type { TransactionResultRevertReceipt } from '@fuel-ts/providers';
/**
 * Represents the possible reasons for a revert.
 */
export type RevertReason = 'RequireFailed' | 'TransferToAddressFailed' | 'SendMessageFailed' | 'AssertEqFailed' | 'AssertFailed' | 'Unknown';
/**
 * @hidden
 *
 * An error class for revert errors.
 */
export declare class RevertError extends Error {
    /**
     * The receipt associated with the revert error.
     */
    receipt: TransactionResultRevertReceipt;
    /**
     * Creates a new instance of RevertError.
     *
     * @param receipt - The transaction revert receipt.
     * @param reason - The revert reason.
     */
    constructor(receipt: TransactionResultRevertReceipt, reason: RevertReason);
    /**
     * Returns a string representation of the RevertError.
     *
     * @returns The string representation of the error.
     */
    toString(): string;
}
/**
 * @hidden
 *
 * An error class for Require revert errors.
 */
export declare class RequireRevertError extends RevertError {
    /**
     * Creates a new instance of RequireRevertError.
     *
     * @param receipt - The transaction revert receipt.
     * @param reason - The revert reason.
     */
    constructor(receipt: TransactionResultRevertReceipt, reason: RevertReason);
}
/**
 * @hidden
 *
 * An error class for TransferToAddress revert errors.
 */
export declare class TransferToAddressRevertError extends RevertError {
    /**
     * Creates a new instance of TransferToAddressRevertError.
     *
     * @param receipt - The transaction revert receipt.
     * @param reason - The revert reason.
     */
    constructor(receipt: TransactionResultRevertReceipt, reason: RevertReason);
}
/**
 * @hidden
 *
 * An error class for SendMessage revert errors.
 */
export declare class SendMessageRevertError extends RevertError {
    /**
     * Creates a new instance of SendMessageRevertError.
     *
     * @param receipt - The transaction revert receipt.
     * @param reason - The revert reason.
     */
    constructor(receipt: TransactionResultRevertReceipt, reason: RevertReason);
}
/**
 * @hidden
 *
 * An error class for AssertFailed revert errors.
 */
export declare class AssertFailedRevertError extends RevertError {
    /**
     * Creates a new instance of AssertFailedRevertError.
     *
     * @param receipt - The transaction revert receipt.
     * @param reason - The revert reason.
     */
    constructor(receipt: TransactionResultRevertReceipt, reason: RevertReason);
}
/**
 * @hidden
 *
 * Factory function to create the appropriate RevertError instance based on the given receipt.
 *
 * @param receipt - The transaction revert receipt.
 * @returns The RevertError instance, or undefined if the revert reason is not recognized.
 */
export declare const revertErrorFactory: (receipt: TransactionResultRevertReceipt) => RevertError | undefined;
//# sourceMappingURL=revert-error.d.ts.map