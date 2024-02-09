import type { BN } from '@fuel-ts/math';
import type { ReceiptCall, ReceiptLog, ReceiptLogData, ReceiptPanic, ReceiptReturn, ReceiptReturnData, ReceiptRevert, ReceiptTransfer, ReceiptTransferOut, ReceiptScriptResult, ReceiptMessageOut, Transaction, ReceiptMint, ReceiptBurn } from '@fuel-ts/transactions';
import type Provider from '../provider';
import type { TransactionSummary, GqlTransaction, AbiMap } from '../transaction-summary/types';
/** @hidden */
export type TransactionResultCallReceipt = ReceiptCall;
/** @hidden */
export type TransactionResultReturnReceipt = ReceiptReturn;
/** @hidden */
export type TransactionResultReturnDataReceipt = ReceiptReturnData & {
    data: string;
};
/** @hidden */
export type TransactionResultPanicReceipt = ReceiptPanic;
/** @hidden */
export type TransactionResultRevertReceipt = ReceiptRevert;
/** @hidden */
export type TransactionResultLogReceipt = ReceiptLog;
/** @hidden */
export type TransactionResultLogDataReceipt = ReceiptLogData & {
    data: string;
};
/** @hidden */
export type TransactionResultTransferReceipt = ReceiptTransfer;
/** @hidden */
export type TransactionResultTransferOutReceipt = ReceiptTransferOut;
/** @hidden */
export type TransactionResultScriptResultReceipt = ReceiptScriptResult;
/** @hidden */
export type TransactionResultMessageOutReceipt = ReceiptMessageOut;
export type TransactionResultMintReceipt = ReceiptMint;
export type TransactionResultBurnReceipt = ReceiptBurn;
/** @hidden */
export type TransactionResultReceipt = ReceiptCall | ReceiptReturn | (ReceiptReturnData & {
    data: string;
}) | ReceiptPanic | ReceiptRevert | ReceiptLog | (ReceiptLogData & {
    data: string;
}) | ReceiptTransfer | ReceiptTransferOut | ReceiptScriptResult | ReceiptMessageOut | TransactionResultMintReceipt | TransactionResultBurnReceipt;
/** @hidden */
export type TransactionResult<TTransactionType = void> = TransactionSummary<TTransactionType> & {
    gqlTransaction: GqlTransaction;
};
/**
 * Represents a response for a transaction.
 */
export declare class TransactionResponse {
    /** Transaction ID */
    id: string;
    /** Current provider */
    provider: Provider;
    /** Gas used on the transaction */
    gasUsed: BN;
    /** Number of attempts made to fetch the transaction */
    fetchAttempts: number;
    /** Number of attempts made to retrieve a processed transaction. */
    resultAttempts: number;
    /** The graphql Transaction with receipts object. */
    gqlTransaction?: GqlTransaction;
    /**
     * Constructor for `TransactionResponse`.
     *
     * @param id - The transaction ID.
     * @param provider - The provider.
     */
    constructor(id: string, provider: Provider);
    /**
     * Async constructor for `TransactionResponse`. This method can be used to create
     * an instance of `TransactionResponse` and wait for the transaction to be fetched
     * from the chain, ensuring that the `gqlTransaction` property is set.
     *
     * @param id - The transaction ID.
     * @param provider - The provider.
     */
    static create(id: string, provider: Provider): Promise<TransactionResponse>;
    /**
     * Fetch the transaction with receipts from the provider.
     *
     * @returns Transaction with receipts query result.
     */
    fetch(): Promise<GqlTransaction>;
    /**
     * Decode the raw payload of the transaction.
     *
     * @param transactionWithReceipts - The transaction with receipts object.
     * @returns The decoded transaction.
     */
    decodeTransaction<TTransactionType = void>(transactionWithReceipts: GqlTransaction): Transaction<TTransactionType>;
    /**
     * Retrieves the TransactionSummary. If the `gqlTransaction` is not set, it will
     * fetch it from the provider
     *
     * @param contractsAbiMap - The contracts ABI map.
     * @returns
     */
    getTransactionSummary<TTransactionType = void>(contractsAbiMap?: AbiMap): Promise<TransactionSummary<TTransactionType>>;
    /**
     * Waits for transaction to complete and returns the result.
     *
     * @returns The completed transaction result
     */
    waitForResult<TTransactionType = void>(contractsAbiMap?: AbiMap): Promise<TransactionResult<TTransactionType>>;
    /**
     * Waits for transaction to complete and returns the result.
     *
     * @param contractsAbiMap - The contracts ABI map.
     */
    wait<TTransactionType = void>(contractsAbiMap?: AbiMap): Promise<TransactionResult<TTransactionType>>;
    /**
     * Introduces a delay based on the number of previous attempts made.
     *
     * @param attempts - The number of attempts.
     */
    private sleepBasedOnAttempts;
}
//# sourceMappingURL=transaction-response.d.ts.map