import { type BN } from '@fuel-ts/math';
import { type Transaction } from '@fuel-ts/transactions';
import type { GqlGasCosts } from '../__generated__/operations';
import type { TransactionResultReceipt } from '../transaction-response';
import type { AbiMap, GraphqlTransactionStatus, TransactionSummary } from './types';
export interface AssembleTransactionSummaryParams {
    gasPerByte: BN;
    gasPriceFactor: BN;
    transaction: Transaction;
    id?: string;
    transactionBytes: Uint8Array;
    gqlTransactionStatus?: GraphqlTransactionStatus;
    receipts: TransactionResultReceipt[];
    abiMap?: AbiMap;
    maxInputs: BN;
    gasCosts: GqlGasCosts;
}
/** @hidden */
export declare function assembleTransactionSummary<TTransactionType = void>(params: AssembleTransactionSummaryParams): TransactionSummary<TTransactionType>;
//# sourceMappingURL=assemble-transaction-summary.d.ts.map