import type { StorageSlot } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';
export type TransactionRequestStorageSlot = {
    /** Key */
    key: BytesLike;
    /** Value */
    value: BytesLike;
} | [key: BytesLike, value: BytesLike];
export declare const storageSlotify: (storageSlot: TransactionRequestStorageSlot) => StorageSlot;
//# sourceMappingURL=storage-slot.d.ts.map