import type { BytesLike } from 'ethers';
export declare class MemoryCache {
    ttl: number;
    constructor(ttlInMs?: number);
    get(value: BytesLike, isAutoExpiring?: boolean): BytesLike | undefined;
    set(value: BytesLike): number;
    getAllData(): BytesLike[];
    getActiveData(): BytesLike[];
    del(value: BytesLike): void;
}
//# sourceMappingURL=memory-cache.d.ts.map