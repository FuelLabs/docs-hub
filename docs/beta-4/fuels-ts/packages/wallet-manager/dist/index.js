"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  StorageAbstract: () => StorageAbstract,
  Vault: () => Vault,
  WalletManager: () => WalletManager
});
module.exports = __toCommonJS(src_exports);

// src/wallet-manager.ts
var import_crypto = require("@fuel-ts/crypto");
var import_errors3 = require("@fuel-ts/errors");
var import_events = require("events");

// src/storages/memory-storage.ts
var MemoryStorage = class {
  storage = /* @__PURE__ */ new Map();
  async getItem(key) {
    const item = await this.storage.get(key);
    return item;
  }
  async setItem(key, value) {
    await this.storage.set(key, value);
  }
  async removeItem(key) {
    await this.storage.delete(key);
  }
  async clear() {
    await this.storage.clear();
  }
};
var memory_storage_default = MemoryStorage;

// src/vaults/mnemonic-vault.ts
var import_errors = require("@fuel-ts/errors");
var import_mnemonic = require("@fuel-ts/mnemonic");
var import_wallet = require("@fuel-ts/wallet");
var _secret;
var MnemonicVault = class {
  constructor(options) {
    __privateAdd(this, _secret, void 0);
    __publicField(this, "pathKey", "{}");
    __publicField(this, "rootPath", `m/44'/1179993420'/${this.pathKey}'/0/0`);
    __publicField(this, "numberOfAccounts", 0);
    __publicField(this, "provider");
    __privateSet(this, _secret, options.secret || import_mnemonic.Mnemonic.generate());
    this.rootPath = options.rootPath || this.rootPath;
    this.numberOfAccounts = options.numberOfAccounts || 1;
    this.provider = options.provider;
  }
  getDerivePath(index) {
    if (this.rootPath.includes(this.pathKey)) {
      return this.rootPath.replace(this.pathKey, String(index));
    }
    return `${this.rootPath}/${index}`;
  }
  serialize() {
    return {
      secret: __privateGet(this, _secret),
      rootPath: this.rootPath,
      numberOfAccounts: this.numberOfAccounts,
      provider: this.provider
    };
  }
  getAccounts() {
    const accounts = [];
    let numberOfAccounts = 0;
    do {
      const wallet = import_wallet.Wallet.fromMnemonic(
        __privateGet(this, _secret),
        this.provider,
        this.getDerivePath(numberOfAccounts)
      );
      accounts.push({
        publicKey: wallet.publicKey,
        address: wallet.address
      });
      numberOfAccounts += 1;
    } while (numberOfAccounts < this.numberOfAccounts);
    return accounts;
  }
  addAccount() {
    this.numberOfAccounts += 1;
    const wallet = import_wallet.Wallet.fromMnemonic(
      __privateGet(this, _secret),
      this.provider,
      this.getDerivePath(this.numberOfAccounts - 1)
    );
    return {
      publicKey: wallet.publicKey,
      address: wallet.address
    };
  }
  exportAccount(address) {
    let numberOfAccounts = 0;
    do {
      const wallet = import_wallet.Wallet.fromMnemonic(
        __privateGet(this, _secret),
        this.provider,
        this.getDerivePath(numberOfAccounts)
      );
      if (wallet.address.equals(address)) {
        return wallet.privateKey;
      }
      numberOfAccounts += 1;
    } while (numberOfAccounts < this.numberOfAccounts);
    throw new import_errors.FuelError(
      import_errors.ErrorCode.WALLET_MANAGER_ERROR,
      `Account with address '${address}' not found in derived wallets.`
    );
  }
  getWallet(address) {
    const privateKey = this.exportAccount(address);
    return import_wallet.Wallet.fromPrivateKey(privateKey, this.provider);
  }
};
_secret = new WeakMap();
__publicField(MnemonicVault, "type", "mnemonic");

// src/vaults/privatekey-vault.ts
var import_errors2 = require("@fuel-ts/errors");
var import_wallet2 = require("@fuel-ts/wallet");
var _privateKeys;
var PrivateKeyVault = class {
  /**
   * If privateKey vault is initialized with a secretKey, it creates
   * one account with the fallowing secret
   */
  constructor(options) {
    __publicField(this, "provider");
    __privateAdd(this, _privateKeys, []);
    this.provider = options.provider;
    if (options.secret) {
      __privateSet(this, _privateKeys, [options.secret]);
    } else {
      __privateSet(this, _privateKeys, options.accounts || [
        import_wallet2.Wallet.generate({
          provider: options.provider
        }).privateKey
      ]);
    }
  }
  serialize() {
    return {
      accounts: __privateGet(this, _privateKeys),
      provider: this.provider
    };
  }
  getPublicAccount(privateKey) {
    const wallet = import_wallet2.Wallet.fromPrivateKey(privateKey, this.provider);
    return {
      address: wallet.address,
      publicKey: wallet.publicKey
    };
  }
  getAccounts() {
    return __privateGet(this, _privateKeys).map((pk) => this.getPublicAccount(pk));
  }
  addAccount() {
    const wallet = import_wallet2.Wallet.generate({
      provider: this.provider
    });
    __privateGet(this, _privateKeys).push(wallet.privateKey);
    return this.getPublicAccount(wallet.privateKey);
  }
  exportAccount(address) {
    const privateKey = __privateGet(this, _privateKeys).find(
      (pk) => import_wallet2.Wallet.fromPrivateKey(pk, this.provider).address.equals(address)
    );
    if (!privateKey) {
      throw new import_errors2.FuelError(
        import_errors2.ErrorCode.WALLET_MANAGER_ERROR,
        `No private key found for address '${address}'.`
      );
    }
    return privateKey;
  }
  getWallet(address) {
    const privateKey = this.exportAccount(address);
    return import_wallet2.Wallet.fromPrivateKey(privateKey, this.provider);
  }
};
_privateKeys = new WeakMap();
__publicField(PrivateKeyVault, "type", "privateKey");

// src/wallet-manager.ts
var ERROR_MESSAGES = {
  invalid_vault_type: "The provided Vault type is invalid.",
  address_not_found: "No private key found for address the specified wallet address.",
  vault_not_found: "The specified vault was not found.",
  wallet_not_unlocked: "The wallet is currently locked.",
  passphrase_not_match: "The provided passphrase did not match the expected value."
};
function assert(condition, message) {
  if (!condition) {
    throw new import_errors3.FuelError(import_errors3.ErrorCode.WALLET_MANAGER_ERROR, message);
  }
}
var _vaults, _passphrase, _isLocked, _serializeVaults, serializeVaults_fn, _deserializeVaults, deserializeVaults_fn;
var _WalletManager = class extends import_events.EventEmitter {
  constructor(options) {
    super();
    /**
     * Serialize all vaults to store
     *
     * `This is only accessible from inside the class`
     */
    __privateAdd(this, _serializeVaults);
    /**
     * Deserialize all vaults to state
     *
     * `This is only accessible from inside the class`
     */
    __privateAdd(this, _deserializeVaults);
    /**
     * Storage
     *
     * Persistent encrypted data. `The default storage works only on memory`.
     */
    __publicField(this, "storage", new memory_storage_default());
    /* Key name passed to the storage */
    __publicField(this, "STORAGE_KEY", "WalletManager");
    // `This variables are only accessible from inside the class`
    __privateAdd(this, _vaults, []);
    __privateAdd(this, _passphrase, "");
    __privateAdd(this, _isLocked, true);
    this.storage = options?.storage || this.storage;
  }
  get isLocked() {
    return __privateGet(this, _isLocked);
  }
  /**
   * Return the vault serialized object containing all the privateKeys,
   * the format of the return depends on the Vault type.
   */
  exportVault(vaultId) {
    assert(!__privateGet(this, _isLocked), ERROR_MESSAGES.wallet_not_unlocked);
    const vaultState = __privateGet(this, _vaults).find((_, idx) => idx === vaultId);
    assert(vaultState, ERROR_MESSAGES.vault_not_found);
    return vaultState.vault.serialize();
  }
  /**
   * List all vaults on the Wallet Manager, this function not return secret's
   */
  getVaults() {
    return __privateGet(this, _vaults).map((v, idx) => ({
      title: v.title,
      type: v.type,
      vaultId: idx
    }));
  }
  /**
   * List all accounts on the Wallet Manager not vault information is revealed
   */
  getAccounts() {
    return __privateGet(this, _vaults).flatMap(
      (vaultState, vaultId) => vaultState.vault.getAccounts().map((account) => ({ ...account, vaultId }))
    );
  }
  /**
   * Create a Wallet instance for the specific account
   */
  getWallet(address) {
    const vaultState = __privateGet(this, _vaults).find(
      (vs) => vs.vault.getAccounts().find((a) => a.address.equals(address))
    );
    assert(vaultState, ERROR_MESSAGES.address_not_found);
    return vaultState.vault.getWallet(address);
  }
  /**
   * Export specific account privateKey
   */
  exportPrivateKey(address) {
    assert(!__privateGet(this, _isLocked), ERROR_MESSAGES.wallet_not_unlocked);
    const vaultState = __privateGet(this, _vaults).find(
      (vs) => vs.vault.getAccounts().find((a) => a.address.equals(address))
    );
    assert(vaultState, ERROR_MESSAGES.address_not_found);
    return vaultState.vault.exportAccount(address);
  }
  /**
   * Add account to a selected vault or on the first vault as default.
   * If not vaults are adds it will return error
   */
  async addAccount(options) {
    await this.loadState();
    const vaultState = __privateGet(this, _vaults)[options?.vaultId || 0];
    await assert(vaultState, ERROR_MESSAGES.vault_not_found);
    const account = vaultState.vault.addAccount();
    await this.saveState();
    return account;
  }
  /**
   * Remove vault by index, by remove the vault you also remove all accounts
   * created by the vault.
   */
  async removeVault(index) {
    __privateGet(this, _vaults).splice(index, 1);
    await this.saveState();
  }
  /**
   * Add Vault, the `vaultConfig.type` will look for the Vaults supported if
   * didn't found it will throw.
   */
  async addVault(vaultConfig) {
    await this.loadState();
    const Vault2 = this.getVaultClass(vaultConfig.type);
    const vault = new Vault2(vaultConfig);
    __privateSet(this, _vaults, __privateGet(this, _vaults).concat({
      title: vaultConfig.title,
      type: vaultConfig.type,
      vault
    }));
    await this.saveState();
  }
  /**
   * Lock wallet. It removes passphrase from class instance, encrypt and hide all address and
   * secrets.
   */
  lock() {
    __privateSet(this, _isLocked, true);
    __privateSet(this, _vaults, []);
    __privateSet(this, _passphrase, "");
    this.emit("lock");
  }
  /**
   * Unlock wallet. It sets passphrase on WalletManger instance load all address from configured vaults.
   * Vaults with secrets are not unlocked or instantiated on this moment.
   */
  async unlock(passphrase) {
    __privateSet(this, _passphrase, passphrase);
    __privateSet(this, _isLocked, false);
    try {
      await this.loadState();
      this.emit("unlock");
    } catch (err) {
      await this.lock();
      throw err;
    }
  }
  /**
   * Update WalletManager encryption passphrase
   */
  async updatePassphrase(oldpass, newpass) {
    const isLocked = __privateGet(this, _isLocked);
    await this.unlock(oldpass);
    __privateSet(this, _passphrase, newpass);
    await this.saveState();
    await this.loadState();
    if (isLocked) {
      await this.lock();
    }
  }
  /**
   * Retrieve and decrypt WalletManager state from storage
   */
  async loadState() {
    await assert(!__privateGet(this, _isLocked), ERROR_MESSAGES.wallet_not_unlocked);
    const data = await this.storage.getItem(this.STORAGE_KEY);
    if (data) {
      const state = await (0, import_crypto.decrypt)(__privateGet(this, _passphrase), JSON.parse(data));
      __privateSet(this, _vaults, __privateMethod(this, _deserializeVaults, deserializeVaults_fn).call(this, state.vaults));
    }
  }
  /**
   * Store encrypted WalletManager state on storage
   */
  async saveState() {
    await assert(!__privateGet(this, _isLocked), ERROR_MESSAGES.wallet_not_unlocked);
    const encryptedData = await (0, import_crypto.encrypt)(__privateGet(this, _passphrase), {
      vaults: __privateMethod(this, _serializeVaults, serializeVaults_fn).call(this, __privateGet(this, _vaults))
    });
    await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(encryptedData));
    this.emit("update");
  }
  /**
   * Return a instantiable Class reference from `WalletManager.Vaults` supported list.
   */
  getVaultClass(type) {
    const VaultClass = _WalletManager.Vaults.find((v) => v.type === type);
    assert(VaultClass, ERROR_MESSAGES.invalid_vault_type);
    return VaultClass;
  }
};
var WalletManager = _WalletManager;
_vaults = new WeakMap();
_passphrase = new WeakMap();
_isLocked = new WeakMap();
_serializeVaults = new WeakSet();
serializeVaults_fn = function(vaults) {
  return vaults.map(({ title, type, vault }) => ({
    title,
    type,
    data: vault.serialize()
  }));
};
_deserializeVaults = new WeakSet();
deserializeVaults_fn = function(vaults) {
  return vaults.map(({ title, type, data: vaultConfig }) => {
    const VaultClass = this.getVaultClass(type);
    return {
      title,
      type,
      vault: new VaultClass(vaultConfig)
    };
  });
};
/**
 * Vaults
 *
 * Vaults are responsible to store secret keys and return an `Wallet` instance,
 * to interact with the network.
 *
 * Each vault has access to its own state
 *
 */
__publicField(WalletManager, "Vaults", [MnemonicVault, PrivateKeyVault]);

// src/types.ts
var import_errors4 = require("@fuel-ts/errors");
var Vault = class {
  constructor(_options) {
    throw new import_errors4.FuelError(import_errors4.ErrorCode.NOT_IMPLEMENTED, "Not implemented.");
  }
  serialize() {
    throw new import_errors4.FuelError(import_errors4.ErrorCode.NOT_IMPLEMENTED, "Not implemented.");
  }
  getAccounts() {
    throw new import_errors4.FuelError(import_errors4.ErrorCode.NOT_IMPLEMENTED, "Not implemented.");
  }
  addAccount() {
    throw new import_errors4.FuelError(import_errors4.ErrorCode.NOT_IMPLEMENTED, "Not implemented.");
  }
  exportAccount(_address) {
    throw new import_errors4.FuelError(import_errors4.ErrorCode.NOT_IMPLEMENTED, "Not implemented.");
  }
  getWallet(_address) {
    throw new import_errors4.FuelError(import_errors4.ErrorCode.NOT_IMPLEMENTED, "Not implemented.");
  }
};
__publicField(Vault, "type");
var StorageAbstract = class {
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StorageAbstract,
  Vault,
  WalletManager
});
//# sourceMappingURL=index.js.map