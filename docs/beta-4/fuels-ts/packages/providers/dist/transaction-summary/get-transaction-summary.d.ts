import type { GqlGetTransactionsByOwnerQueryVariables, GqlPageInfo } from '../__generated__/operations';
import type Provider from '../provider';
import type { TransactionRequest } from '../transaction-request';
import type { TransactionResult } from '../transaction-response';
import type { AbiMap, TransactionSummary } from './types';
/** @hidden */
export interface GetTransactionSummaryParams {
    id: string;
    provider: Provider;
    abiMap?: AbiMap;
}
export declare function getTransactionSummary<TTransactionType = void>(params: GetTransactionSummaryParams): Promise<TransactionResult>;
export interface GetTransactionSummaryFromRequestParams {
    transactionRequest: TransactionRequest;
    provider: Provider;
    abiMap?: AbiMap;
}
/** @hidden */
export declare function getTransactionSummaryFromRequest<TTransactionType = void>(params: GetTransactionSummaryFromRequestParams): Promise<TransactionSummary<TTransactionType>>;
export interface GetTransactionsSummariesParams {
    provider: Provider;
    filters: GqlGetTransactionsByOwnerQueryVariables;
    abiMap?: AbiMap;
}
export interface GetTransactionsSummariesReturns {
    transactions: TransactionResult[];
    pageInfo: GqlPageInfo;
}
/** @hidden */
export declare function getTransactionsSummaries(params: GetTransactionsSummariesParams): Promise<GetTransactionsSummariesReturns>;
//# sourceMappingURL=get-transaction-summary.d.ts.map