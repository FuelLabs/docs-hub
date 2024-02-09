import type { GqlReceipt } from '../__generated__/operations';
import type { TransactionResultReceipt } from '../transaction-response';
import type { BurnedAsset, MintedAsset } from './types';
export declare const processGqlReceipt: (gqlReceipt: GqlReceipt) => TransactionResultReceipt;
export declare const extractMintedAssetsFromReceipts: (receipts: Array<TransactionResultReceipt>) => MintedAsset[];
export declare const extractBurnedAssetsFromReceipts: (receipts: Array<TransactionResultReceipt>) => BurnedAsset[];
//# sourceMappingURL=receipt.d.ts.map