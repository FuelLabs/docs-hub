import type { StorageAbstract } from '../types';
declare class MemoryStorage implements StorageAbstract {
    storage: Map<string, unknown>;
    getItem<T>(key: string): Promise<T | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}
export default MemoryStorage;
//# sourceMappingURL=memory-storage.d.ts.map