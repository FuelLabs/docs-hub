import { NumberCoder, StructCoder } from '@fuel-ts/abi-coder';
export type TxPointer = {
    /** Block height (u32) */
    blockHeight: number;
    /** Transaction index (u16) */
    txIndex: number;
};
export declare class TxPointerCoder extends StructCoder<{
    blockHeight: NumberCoder;
    txIndex: NumberCoder;
}> {
    constructor();
}
//# sourceMappingURL=tx-pointer.d.ts.map