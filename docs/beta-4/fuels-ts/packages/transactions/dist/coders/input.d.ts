import { Coder } from '@fuel-ts/abi-coder';
import type { BN } from '@fuel-ts/math';
import type { BytesLike } from 'ethers';
import type { TxPointer } from './tx-pointer';
export declare enum InputType {
    Coin = 0,
    Contract = 1,
    Message = 2
}
export type InputCoin = {
    type: InputType.Coin;
    /** Hash of transaction (b256) */
    txID: string;
    /** Index of transaction output (u8) */
    outputIndex: number;
    /** Owning address or script hash (b256) */
    owner: string;
    /** Amount of coins (u64) */
    amount: BN;
    /** Asset ID of the coins (b256) */
    assetId: string;
    /** Points to the TX whose output is being spent. (TxPointer) */
    txPointer: TxPointer;
    /** Index of witness that authorizes spending the coin (u8) */
    witnessIndex: number;
    /** UTXO being spent must have been created at least this many blocks ago (u32) */
    maturity: number;
    /** Gas used by predicate (u64) */
    predicateGasUsed: BN;
    /** Length of predicate, in instructions (u16) */
    predicateLength: number;
    /** Length of predicate input data, in bytes (u16) */
    predicateDataLength: number;
    /** Predicate bytecode (byte[]) */
    predicate: string;
    /** Predicate input data (parameters) (byte[]) */
    predicateData: string;
};
export declare class InputCoinCoder extends Coder<InputCoin, InputCoin> {
    constructor();
    encode(value: InputCoin): Uint8Array;
    decode(data: Uint8Array, offset: number): [InputCoin, number];
}
export type InputContract = {
    type: InputType.Contract;
    /** Hash of transaction (b256) */
    txID: string;
    /** Index of transaction output (u8) */
    outputIndex: number;
    /** Root of amount of coins owned by contract before transaction execution (b256) */
    balanceRoot: string;
    /** State root of contract before transaction execution (b256) */
    stateRoot: string;
    /** Points to the TX whose output is being spent. (TxPointer) */
    txPointer: TxPointer;
    /** Contract ID (b256) */
    contractID: string;
};
export declare class InputContractCoder extends Coder<InputContract, InputContract> {
    constructor();
    encode(value: InputContract): Uint8Array;
    decode(data: Uint8Array, offset: number): [InputContract, number];
}
export type InputMessage = {
    type: InputType.Message;
    /** Address of sender */
    sender: string;
    /** Address of recipient */
    recipient: string;
    /** Amount of coins */
    amount: BN;
    /** data of message */
    data?: string;
    /** Length of predicate, in instructions (u16) */
    dataLength?: number;
    /** Unique nonce of message */
    nonce: string;
    /** Index of witness that authorizes message (u8) */
    witnessIndex: number;
    /** Gas used by predicate (u64) */
    predicateGasUsed: BN;
    /** Length of predicate, in instructions (u16) */
    predicateLength: number;
    /** Length of predicate input data, in bytes (u16) */
    predicateDataLength: number;
    /** Predicate bytecode (byte[]) */
    predicate: string;
    /** Predicate input data (parameters) (byte[]) */
    predicateData: string;
};
export declare class InputMessageCoder extends Coder<InputMessage, InputMessage> {
    constructor();
    static getMessageId(value: Pick<InputMessage, 'sender' | 'recipient' | 'nonce' | 'amount' | 'data'>): string;
    static encodeData(messageData?: BytesLike): Uint8Array;
    encode(value: InputMessage): Uint8Array;
    static decodeData(messageData: BytesLike): Uint8Array;
    decode(data: Uint8Array, offset: number): [InputMessage, number];
}
export type Input = InputCoin | InputContract | InputMessage;
export declare class InputCoder extends Coder<Input, Input> {
    constructor();
    encode(value: Input): Uint8Array;
    decode(data: Uint8Array, offset: number): [Input, number];
}
//# sourceMappingURL=input.d.ts.map