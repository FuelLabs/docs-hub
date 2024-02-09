import type { GqlTransactionStatusesNames, GraphqlTransactionStatus, TransactionSummary } from './types';
import { TransactionStatus } from './types';
/** @hidden */
export declare const getTransactionStatusName: (gqlStatus: GqlTransactionStatusesNames) => TransactionStatus;
type IProcessGraphqlStatusResponse = Pick<TransactionSummary, 'time' | 'blockId' | 'isStatusPending' | 'isStatusSuccess' | 'isStatusFailure' | 'status'>;
/** @hidden */
export declare const processGraphqlStatus: (gqlTransactionStatus?: GraphqlTransactionStatus) => IProcessGraphqlStatusResponse;
export {};
//# sourceMappingURL=status.d.ts.map