import { B256Coder, NumberCoder, StructCoder } from '@fuel-ts/abi-coder';
export type UtxoId = {
    /** Transaction ID (b256) */
    transactionId: string;
    /** Output index (u8) */
    outputIndex: number;
};
export declare class UtxoIdCoder extends StructCoder<{
    transactionId: B256Coder;
    outputIndex: NumberCoder;
}> {
    constructor();
}
//# sourceMappingURL=utxo-id.d.ts.map