/// <reference types="node" />
import BnJs from 'bn.js';
import type { FormatConfig } from './types';
type CompareResult = -1 | 0 | 1;
export type BNInput = number | string | number[] | Uint8Array | Buffer | BnJs;
interface BNHelper {
    caller(v: BNInput, methodName: string): BN | boolean | CompareResult;
    toHex: (bytesPadding?: number) => string;
    toBytes: (bytesPadding?: number) => Uint8Array;
    toJSON: () => string;
}
interface BNInputOverrides {
    add: (v: BNInput) => BN;
    pow: (v: BNInput) => BN;
    sub: (v: BNInput) => BN;
    div: (v: BNInput) => BN;
    mul: (v: BNInput) => BN;
    mod: (v: BNInput) => BN;
    divRound: (v: BNInput) => BN;
    lt: (v: BNInput) => boolean;
    lte: (v: BNInput) => boolean;
    gt: (v: BNInput) => boolean;
    gte: (v: BNInput) => boolean;
    eq: (v: BNInput) => boolean;
    cmp: (v: BNInput) => CompareResult;
}
interface BNOverrides {
    sqr: () => BN;
    neg: () => BN;
    abs: () => BN;
    toTwos: (width: number) => BN;
    fromTwos: (width: number) => BN;
}
interface BNHiddenTypes {
    mulTo: (num: BN, out: BN) => BN;
    divmod: (num: BNInput, mode?: string, positive?: boolean) => {
        mod: BN;
        div: BN;
    };
}
type BNInputOverridesKeys = keyof BNInputOverrides;
export declare class BN extends BnJs implements BNInputOverrides, BNHiddenTypes, BNHelper, BNOverrides {
    MAX_U64: string;
    constructor(value?: BNInput | null, base?: number | 'hex', endian?: BnJs.Endianness);
    toString(base?: number | 'hex', length?: number): string;
    toHex(bytesPadding?: number): string;
    toBytes(bytesPadding?: number): Uint8Array;
    toJSON(): string;
    valueOf(): string;
    format(options?: FormatConfig): string;
    formatUnits(units?: number): string;
    add(v: BNInput): BN;
    pow(v: BNInput): BN;
    sub(v: BNInput): BN;
    div(v: BNInput): BN;
    mul(v: BNInput): BN;
    mod(v: BNInput): BN;
    divRound(v: BNInput): BN;
    lt(v: BNInput): boolean;
    lte(v: BNInput): boolean;
    gt(v: BNInput): boolean;
    gte(v: BNInput): boolean;
    eq(v: BNInput): boolean;
    cmp(v: BNInput): CompareResult;
    sqr(): BN;
    neg(): BN;
    abs(): BN;
    toTwos(width: number): BN;
    fromTwos(width: number): BN;
    caller(v: BNInput, methodName: BNInputOverridesKeys): BN | boolean | CompareResult;
    clone(): BN;
    mulTo(num: BN, out: BN): BN;
    egcd(p: BnJs): {
        a: BN;
        b: BN;
        gcd: BN;
    };
    divmod(num: BNInput, mode?: string, positive?: boolean): {
        mod: BN;
        div: BN;
    };
    maxU64(): BN;
    normalizeZeroToOne(): BN;
}
export declare const bn: {
    (value?: BNInput | null, base?: number | 'hex', endian?: BnJs.Endianness): BN;
    parseUnits(value: string, units?: number): BN;
};
export {};
//# sourceMappingURL=bn.d.ts.map