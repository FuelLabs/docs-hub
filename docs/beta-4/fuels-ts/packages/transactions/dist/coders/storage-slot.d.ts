import { B256Coder, StructCoder } from '@fuel-ts/abi-coder';
export type StorageSlot = {
    /** Key (b256) */
    key: string;
    /** Value (b256) */
    value: string;
};
export declare class StorageSlotCoder extends StructCoder<{
    key: B256Coder;
    value: B256Coder;
}> {
    constructor();
}
//# sourceMappingURL=storage-slot.d.ts.map