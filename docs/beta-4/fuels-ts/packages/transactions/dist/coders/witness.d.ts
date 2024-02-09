import { Coder } from '@fuel-ts/abi-coder';
export type Witness = {
    /** Length of witness data byte array */
    dataLength: number;
    /** Witness data (byte[]) */
    data: string;
};
export declare class WitnessCoder extends Coder<Witness, Witness> {
    constructor();
    encode(value: Witness): Uint8Array;
    decode(data: Uint8Array, offset: number): [Witness, number];
}
//# sourceMappingURL=witness.d.ts.map