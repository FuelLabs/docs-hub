import { ReceiptType, TransactionType } from '@fuel-ts/transactions';
import type { Output } from '@fuel-ts/transactions';
import type { TransactionResultReceipt } from '../transaction-response';
import { TransactionTypeName } from './types';
import type { InputOutputParam, InputParam, OperationCoin, RawPayloadParam, ReceiptParam, Operation, GetOperationParams, GetTransferOperationsParams } from './types';
/** @hidden */
export declare function getReceiptsByType<T = TransactionResultReceipt>(receipts: TransactionResultReceipt[], type: ReceiptType): T[];
/** @hidden */
export declare function getTransactionTypeName(transactionType: TransactionType): TransactionTypeName;
/** @hidden */
export declare function isType(transactionType: TransactionType, type: TransactionTypeName): boolean;
/** @hidden */
export declare function isTypeMint(transactionType: TransactionType): boolean;
/** @hidden */
export declare function isTypeCreate(transactionType: TransactionType): boolean;
/** @hidden */
export declare function isTypeScript(transactionType: TransactionType): boolean;
/** @hidden */
export declare function hasSameAssetId(a: OperationCoin): (b: OperationCoin) => boolean;
/** @hidden */
export declare function getReceiptsCall(receipts: TransactionResultReceipt[]): import("@fuel-ts/transactions").ReceiptCall[];
/** @hidden */
export declare function getReceiptsMessageOut(receipts: TransactionResultReceipt[]): import("@fuel-ts/transactions").ReceiptMessageOut[];
/** @hidden */
export declare function addOperation(operations: Operation[], toAdd: Operation): Operation[];
/** @hidden */
export declare function getReceiptsTransferOut(receipts: TransactionResultReceipt[]): import("@fuel-ts/transactions").ReceiptTransferOut[];
/** @hidden */
export declare function getContractTransferOperations({ receipts }: ReceiptParam): Operation[];
/** @hidden */
export declare function getWithdrawFromFuelOperations({ inputs, receipts, }: InputParam & ReceiptParam): Operation[];
/** @hidden */
export declare function getContractCallOperations({ inputs, outputs, receipts, abiMap, rawPayload, maxInputs, }: InputOutputParam & ReceiptParam & Pick<GetOperationParams, 'abiMap' | 'maxInputs'> & RawPayloadParam): Operation[];
/** @hidden */
export declare function getTransferOperations({ inputs, outputs, receipts, }: GetTransferOperationsParams): Operation[];
/** @hidden */
export declare function getPayProducerOperations(outputs: Output[]): Operation[];
/** @hidden */
export declare function getContractCreatedOperations({ inputs, outputs }: InputOutputParam): Operation[];
/** @hidden */
export declare function getOperations({ transactionType, inputs, outputs, receipts, abiMap, rawPayload, maxInputs, }: GetOperationParams): Operation[];
//# sourceMappingURL=operations.d.ts.map