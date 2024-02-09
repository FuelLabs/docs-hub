import { Coder } from '@fuel-ts/abi-coder';
import type { BN } from '@fuel-ts/math';
export declare enum OutputType {
    Coin = 0,
    Contract = 1,
    Change = 2,
    Variable = 3,
    ContractCreated = 4
}
export type OutputCoin = {
    type: OutputType.Coin;
    /** Receiving address or script hash (b256) */
    to: string;
    /** Amount of coins to send (u64) */
    amount: BN;
    /** Asset ID of coins (b256) */
    assetId: string;
};
export declare class OutputCoinCoder extends Coder<OutputCoin, OutputCoin> {
    constructor();
    encode(value: OutputCoin): Uint8Array;
    decode(data: Uint8Array, offset: number): [OutputCoin, number];
}
export type OutputContract = {
    type: OutputType.Contract;
    /** Index of input contract (u8) */
    inputIndex: number;
    /** Root of amount of coins owned by contract after transaction execution (b256) */
    balanceRoot: string;
    /** State root of contract after transaction execution (b256) */
    stateRoot: string;
};
export declare class OutputContractCoder extends Coder<OutputContract, OutputContract> {
    constructor();
    encode(value: OutputContract): Uint8Array;
    decode(data: Uint8Array, offset: number): [OutputContract, number];
}
export type OutputChange = {
    type: OutputType.Change;
    /** Receiving address or script hash (b256) */
    to: string;
    /** Amount of coins to send (u64) */
    amount: BN;
    /** Asset ID of coins (b256) */
    assetId: string;
};
export declare class OutputChangeCoder extends Coder<OutputChange, OutputChange> {
    constructor();
    encode(value: OutputChange): Uint8Array;
    decode(data: Uint8Array, offset: number): [OutputChange, number];
}
export type OutputVariable = {
    type: OutputType.Variable;
    /** Receiving address or script hash (b256) */
    to: string;
    /** Amount of coins to send (u64) */
    amount: BN;
    /** Asset ID of coins (b256) */
    assetId: string;
};
export declare class OutputVariableCoder extends Coder<OutputVariable, OutputVariable> {
    constructor();
    encode(value: OutputVariable): Uint8Array;
    decode(data: Uint8Array, offset: number): [OutputVariable, number];
}
export type OutputContractCreated = {
    type: OutputType.ContractCreated;
    /** Contract ID (b256) */
    contractId: string;
    /** State root of contract (b256) */
    stateRoot: string;
};
export declare class OutputContractCreatedCoder extends Coder<OutputContractCreated, OutputContractCreated> {
    constructor();
    encode(value: OutputContractCreated): Uint8Array;
    decode(data: Uint8Array, offset: number): [OutputContractCreated, number];
}
export type Output = OutputCoin | OutputContract | OutputChange | OutputVariable | OutputContractCreated;
export declare class OutputCoder extends Coder<Output, Output> {
    constructor();
    encode(value: Output): Uint8Array;
    decode(data: Uint8Array, offset: number): [Output, number];
}
//# sourceMappingURL=output.d.ts.map