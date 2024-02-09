import type { TransactionRequest } from './types';
/**
 * Hash transaction request with sha256. [Read more](https://github.com/FuelLabs/fuel-specs/blob/master/specs/protocol/identifiers.md#transaction-id)
 *
 * @param transactionRequest - Transaction request to be hashed
 * @returns sha256 hash of the transaction
 */
export declare function hashTransaction(transactionRequest: TransactionRequest, chainId: number): string;
//# sourceMappingURL=hash-transaction.d.ts.map