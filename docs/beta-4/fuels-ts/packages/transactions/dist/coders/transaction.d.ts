import { Coder } from '@fuel-ts/abi-coder';
import { type BN } from '@fuel-ts/math';
import type { Input, InputContract } from './input';
import type { Output, OutputContract } from './output';
import type { Policy } from './policy';
import type { StorageSlot } from './storage-slot';
import type { TxPointer } from './tx-pointer';
import type { Witness } from './witness';
export declare enum TransactionType {
    Script = 0,
    Create = 1,
    Mint = 2
}
export type TransactionScript = {
    type: TransactionType.Script;
    /** Gas limit for transaction (u64) */
    scriptGasLimit: BN;
    /** Script length, in instructions (u16) */
    scriptLength: number;
    /** Length of script input data, in bytes (u16) */
    scriptDataLength: number;
    /** Bitfield of used policy types (u32) */
    policyTypes: number;
    /** Number of inputs (u8) */
    inputsCount: number;
    /** Number of outputs (u8) */
    outputsCount: number;
    /** Number of witnesses (u8) */
    witnessesCount: number;
    /** Merkle root of receipts (b256) */
    receiptsRoot: string;
    /** Script to execute (byte[]) */
    script: string;
    /** Script input data (parameters) (byte[]) */
    scriptData: string;
    /** List of inputs (Input[]) */
    inputs: Input[];
    /** List of policies, sorted by PolicyType. */
    policies: Policy[];
    /** List of outputs (Output[]) */
    outputs: Output[];
    /** List of witnesses (Witness[]) */
    witnesses: Witness[];
};
export declare class TransactionScriptCoder extends Coder<TransactionScript, TransactionScript> {
    constructor();
    encode(value: TransactionScript): Uint8Array;
    decode(data: Uint8Array, offset: number): [TransactionScript, number];
}
export type TransactionCreate = {
    type: TransactionType.Create;
    /** Contract bytecode length, in instructions (u16) */
    bytecodeLength: number;
    /** Witness index of contract bytecode to create (u8) */
    bytecodeWitnessIndex: number;
    /** Bitfield of used policy types (u32) */
    policyTypes: number;
    /** Number of storage slots to initialize (u16) */
    storageSlotsCount: number;
    /** Number of inputs (u8) */
    inputsCount: number;
    /** Number of outputs (u8) */
    outputsCount: number;
    /** Number of witnesses (u8) */
    witnessesCount: number;
    /** Salt (b256) */
    salt: string;
    /** List of policies. */
    policies: Policy[];
    /** List of inputs (StorageSlot[]) */
    storageSlots: StorageSlot[];
    /** List of inputs (Input[]) */
    inputs: Input[];
    /** List of outputs (Output[]) */
    outputs: Output[];
    /** List of witnesses (Witness[]) */
    witnesses: Witness[];
};
export declare class TransactionCreateCoder extends Coder<TransactionCreate, TransactionCreate> {
    constructor();
    encode(value: TransactionCreate): Uint8Array;
    decode(data: Uint8Array, offset: number): [TransactionCreate, number];
}
export type TransactionMint = {
    type: TransactionType.Mint;
    /** The location of the Mint transaction in the block. */
    txPointer: TxPointer;
    /** The contract utxo that assets are minted to. */
    inputContract: InputContract;
    /** The contract utxo that assets are being minted to. */
    outputContract: OutputContract;
    /** The amount of funds minted. */
    mintAmount: BN;
    /** The asset ID corresponding to the minted amount. */
    mintAssetId: string;
};
export declare class TransactionMintCoder extends Coder<TransactionMint, TransactionMint> {
    constructor();
    encode(value: TransactionMint): Uint8Array;
    decode(data: Uint8Array, offset: number): [TransactionMint, number];
}
type PossibleTransactions = TransactionScript | TransactionCreate | TransactionMint;
export type Transaction<TTransactionType = void> = TTransactionType extends TransactionType ? Extract<PossibleTransactions, {
    type: TTransactionType;
}> : Partial<Omit<TransactionScript, 'type'>> & Partial<Omit<TransactionCreate, 'type'>> & Partial<Omit<TransactionMint, 'type'>> & {
    type: TransactionType;
};
export declare class TransactionCoder extends Coder<Transaction, Transaction> {
    constructor();
    encode(value: Transaction): Uint8Array;
    decode(data: Uint8Array, offset: number): [Transaction, number];
}
export {};
//# sourceMappingURL=transaction.d.ts.map