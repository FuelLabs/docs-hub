import type { AbstractAddress } from '@fuel-ts/interfaces';
import type { Provider } from '@fuel-ts/providers';
import type { WalletUnlocked } from '@fuel-ts/wallet';
export type Account = {
    address: AbstractAddress;
    publicKey: string;
    vaultId?: number;
};
export type WalletManagerOptions = {
    storage: StorageAbstract;
};
export type VaultConfig = {
    type: string;
    title?: string;
    secret?: string;
    provider: Provider;
};
export type VaultsState = Array<{
    type: string;
    title?: string;
    data?: VaultConfig;
    vault: Vault;
}>;
export interface WalletManagerState {
    vaults: VaultsState;
}
export declare abstract class Vault<TOptions = {
    secret?: string;
}> {
    static readonly type: string;
    constructor(_options: TOptions);
    serialize(): TOptions;
    getAccounts(): Account[];
    addAccount(): Account;
    exportAccount(_address: AbstractAddress): string;
    getWallet(_address: AbstractAddress): WalletUnlocked;
}
export declare abstract class StorageAbstract {
    abstract setItem(key: string, value: string): Promise<void>;
    abstract getItem(key: string): Promise<string | null | undefined>;
    abstract removeItem(key: string): Promise<void>;
    abstract clear(): Promise<void>;
}
//# sourceMappingURL=types.d.ts.map