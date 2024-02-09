import type { ReceiptBurn, ReceiptCall, ReceiptLog, ReceiptLogData, ReceiptMessageOut, ReceiptMint, ReceiptPanic, ReceiptReturn, ReceiptReturnData, ReceiptRevert, ReceiptScriptResult, ReceiptTransfer, ReceiptTransferOut } from '@fuel-ts/transactions';
import type { GqlReceipt } from '../__generated__/operations';
import type { TransactionResultReceipt } from '../transaction-response';
/** @hidden */
export declare const getReceiptsWithMissingData: (receipts: Array<TransactionResultReceipt>) => {
    missingOutputVariables: Array<ReceiptRevert>;
    missingOutputContractIds: Array<ReceiptPanic>;
};
export declare function assembleReceiptByType(receipt: GqlReceipt): ReceiptCall | ReceiptReturn | ReceiptReturnData | ReceiptPanic | ReceiptRevert | ReceiptLog | ReceiptLogData | ReceiptTransfer | ReceiptTransferOut | ReceiptScriptResult | ReceiptMessageOut | ReceiptMint | ReceiptBurn;
//# sourceMappingURL=receipts.d.ts.map