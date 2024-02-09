import type { TransactionResultReceipt } from '@fuel-ts/providers';
import type { RevertError } from './revert-error';
export declare class RevertErrorCodes {
    private revertReceipts;
    constructor(receipts: TransactionResultReceipt[]);
    assert(detailedError: Error): void;
    getError(): RevertError | undefined;
}
//# sourceMappingURL=revert-error-codes.d.ts.map