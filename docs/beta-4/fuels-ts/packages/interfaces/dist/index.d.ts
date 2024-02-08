/**
 * @privateRemarks
 *
 * TODO: Consider re-distritubing interfaces near their original packages
 */
export type Bech32Address = `fuel${string}`;
export type B256Address = string;
export type B256AddressEvm = `0x000000000000000000000000${string}`;
export type Bytes = Uint8Array | number[];
export type RawSlice = Uint8Array | number[];
export type BytesLike = Uint8Array | string;
/**
 * @prop value - A 256 bit hash string with the first 12 bytes cleared
 */
export type EvmAddress = {
    value: B256AddressEvm;
};
/**
 * @prop value - A wrapped 256 bit hash string
 */
export type AssetId = {
    value: B256Address;
};
export type StdString = string;
/**
 * @hidden
 */
export declare abstract class AbstractScriptRequest<T> {
    abstract bytes: Uint8Array;
    abstract encodeScriptData: (data: T) => Uint8Array;
}
export declare abstract class AbstractAddress {
    abstract toJSON(): string;
    abstract toString(): string;
    abstract toAddress(): Bech32Address;
    abstract toB256(): B256Address;
    abstract toHexString(): string;
    abstract toBytes(): Uint8Array;
    abstract equals(other: AbstractAddress): boolean;
}
export declare abstract class AbstractAccount {
    abstract address: AbstractAddress;
    abstract provider: unknown;
    abstract getResourcesToSpend(quantities: any[], options?: any): any;
    abstract sendTransaction(transactionRequest: any): any;
    abstract simulateTransaction(transactionRequest: any): any;
    abstract fund(transactionRequest: any, quantities: any, fee: any): Promise<void>;
}
/**
 * @hidden
 */
export declare abstract class AbstractProgram {
    abstract account: AbstractAccount | null;
    abstract interface: {
        updateExternalLoggedTypes: (id: string, abiInterface: any) => any;
    };
    abstract provider: {
        sendTransaction(transactionRequest: any): any;
    } | null;
}
export declare abstract class AbstractContract extends AbstractProgram {
    abstract id: AbstractAddress;
}
/**
 * @hidden
 */
export declare abstract class AbstractScript extends AbstractProgram {
    abstract bytes: Uint8Array;
}
/** A simple type alias defined using the `type` keyword. */
export type AddressLike = AbstractAddress | AbstractAccount;
export type ContractIdLike = AbstractAddress | AbstractContract;
/**
 * @hidden
 */
export declare abstract class AbstractPredicate {
    abstract bytes: Uint8Array;
    abstract address: AbstractAddress;
    abstract predicateData: Uint8Array;
    abstract types?: ReadonlyArray<any>;
}
//# sourceMappingURL=index.d.ts.map