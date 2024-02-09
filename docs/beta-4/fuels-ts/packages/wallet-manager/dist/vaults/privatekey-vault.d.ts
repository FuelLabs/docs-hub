import type { AbstractAddress } from '@fuel-ts/interfaces';
import type { Provider } from '@fuel-ts/providers';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import type { Account, Vault } from '../types';
interface PkVaultOptions {
    secret?: string;
    accounts?: Array<string>;
    provider: Provider;
}
export declare class PrivateKeyVault implements Vault<PkVaultOptions> {
    #private;
    static readonly type = "privateKey";
    provider: Provider;
    /**
     * If privateKey vault is initialized with a secretKey, it creates
     * one account with the fallowing secret
     */
    constructor(options: PkVaultOptions);
    serialize(): PkVaultOptions;
    getPublicAccount(privateKey: string): {
        address: AbstractAddress;
        publicKey: string;
    };
    getAccounts(): Account[];
    addAccount(): {
        address: AbstractAddress;
        publicKey: string;
    };
    exportAccount(address: AbstractAddress): string;
    getWallet(address: AbstractAddress): WalletUnlocked;
}
export {};
//# sourceMappingURL=privatekey-vault.d.ts.map