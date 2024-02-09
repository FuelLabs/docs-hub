/// <reference types="node" />
import type { AbstractAddress } from '@fuel-ts/interfaces';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import { EventEmitter } from 'events';
import type { StorageAbstract, Account, VaultConfig, WalletManagerOptions, Vault } from './types';
import { MnemonicVault } from './vaults/mnemonic-vault';
import { PrivateKeyVault } from './vaults/privatekey-vault';
/**
 * WalletManager is a upper package to manage multiple vaults like mnemonic and privateKeys.
 *
 * - VaultTypes can be add to `WalletManager.Vaults` enabling to add custom Vault types.
 * - Storage can be instantiate when initializing enabling custom storage types.
 */
export declare class WalletManager extends EventEmitter {
    #private;
    /**
     * Vaults
     *
     * Vaults are responsible to store secret keys and return an `Wallet` instance,
     * to interact with the network.
     *
     * Each vault has access to its own state
     *
     */
    static Vaults: (typeof MnemonicVault | typeof PrivateKeyVault)[];
    /**
     * Storage
     *
     * Persistent encrypted data. `The default storage works only on memory`.
     */
    readonly storage: StorageAbstract;
    readonly STORAGE_KEY: string;
    constructor(options?: WalletManagerOptions);
    get isLocked(): boolean;
    /**
     * Return the vault serialized object containing all the privateKeys,
     * the format of the return depends on the Vault type.
     */
    exportVault<T extends Vault>(vaultId: number): ReturnType<T['serialize']>;
    /**
     * List all vaults on the Wallet Manager, this function not return secret's
     */
    getVaults(): Array<{
        title?: string;
        type: string;
        vaultId: number;
    }>;
    /**
     * List all accounts on the Wallet Manager not vault information is revealed
     */
    getAccounts(): Array<Account>;
    /**
     * Create a Wallet instance for the specific account
     */
    getWallet(address: AbstractAddress): WalletUnlocked;
    /**
     * Export specific account privateKey
     */
    exportPrivateKey(address: AbstractAddress): string;
    /**
     * Add account to a selected vault or on the first vault as default.
     * If not vaults are adds it will return error
     */
    addAccount(options?: {
        vaultId: number;
    }): Promise<Account>;
    /**
     * Remove vault by index, by remove the vault you also remove all accounts
     * created by the vault.
     */
    removeVault(index: number): Promise<void>;
    /**
     * Add Vault, the `vaultConfig.type` will look for the Vaults supported if
     * didn't found it will throw.
     */
    addVault(vaultConfig: VaultConfig): Promise<void>;
    /**
     * Lock wallet. It removes passphrase from class instance, encrypt and hide all address and
     * secrets.
     */
    lock(): void;
    /**
     * Unlock wallet. It sets passphrase on WalletManger instance load all address from configured vaults.
     * Vaults with secrets are not unlocked or instantiated on this moment.
     */
    unlock(passphrase: string): Promise<void>;
    /**
     * Update WalletManager encryption passphrase
     */
    updatePassphrase(oldpass: string, newpass: string): Promise<void>;
    /**
     * Retrieve and decrypt WalletManager state from storage
     */
    loadState(): Promise<void>;
    /**
     * Store encrypted WalletManager state on storage
     */
    private saveState;
    /**
     * Return a instantiable Class reference from `WalletManager.Vaults` supported list.
     */
    private getVaultClass;
}
//# sourceMappingURL=wallet-manager.d.ts.map