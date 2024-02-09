import type { AbstractAddress } from '@fuel-ts/interfaces';
import type { Provider } from '@fuel-ts/providers';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import type { Vault } from '../types';
interface MnemonicVaultOptions {
    secret?: string;
    rootPath?: string;
    numberOfAccounts?: number | null;
    provider: Provider;
}
export declare class MnemonicVault implements Vault<MnemonicVaultOptions> {
    #private;
    static readonly type = "mnemonic";
    pathKey: string;
    rootPath: string;
    numberOfAccounts: number;
    provider: Provider;
    constructor(options: MnemonicVaultOptions);
    getDerivePath(index: number): string;
    serialize(): MnemonicVaultOptions;
    getAccounts(): {
        publicKey: string;
        address: AbstractAddress;
    }[];
    addAccount(): {
        publicKey: string;
        address: AbstractAddress;
    };
    exportAccount(address: AbstractAddress): string;
    getWallet(address: AbstractAddress): WalletUnlocked;
}
export {};
//# sourceMappingURL=mnemonic-vault.d.ts.map