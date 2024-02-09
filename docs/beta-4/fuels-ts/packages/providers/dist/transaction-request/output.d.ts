import type { BigNumberish } from '@fuel-ts/math';
import type { Output } from '@fuel-ts/transactions';
import { OutputType } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';
export type CoinTransactionRequestOutput = {
    type: OutputType.Coin;
    /** Receiving address or script hash */
    to: BytesLike;
    /** Amount of coins to send */
    amount: BigNumberish;
    /** Asset ID of coins */
    assetId: BytesLike;
};
export type ContractTransactionRequestOutput = {
    type: OutputType.Contract;
    /** Index of input contract */
    inputIndex: number;
};
export type ChangeTransactionRequestOutput = {
    type: OutputType.Change;
    /** Receiving address or script hash */
    to: BytesLike;
    /** Asset ID of coins */
    assetId: BytesLike;
};
export type VariableTransactionRequestOutput = {
    type: OutputType.Variable;
};
export type ContractCreatedTransactionRequestOutput = {
    type: OutputType.ContractCreated;
    /** Contract ID */
    contractId: BytesLike;
    /** State Root */
    stateRoot: BytesLike;
};
export type TransactionRequestOutput = CoinTransactionRequestOutput | ContractTransactionRequestOutput | ChangeTransactionRequestOutput | VariableTransactionRequestOutput | ContractCreatedTransactionRequestOutput;
/** @hidden */
export declare const outputify: (value: TransactionRequestOutput) => Output;
//# sourceMappingURL=output.d.ts.map