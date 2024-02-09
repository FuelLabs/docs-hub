"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Predicate: () => Predicate
});
module.exports = __toCommonJS(src_exports);

// src/predicate.ts
var import_abi_coder = require("@fuel-ts/abi-coder");
var import_address = require("@fuel-ts/address");
var import_configs = require("@fuel-ts/address/configs");
var import_errors = require("@fuel-ts/errors");
var import_providers = require("@fuel-ts/providers");
var import_transactions = require("@fuel-ts/transactions");
var import_wallet = require("@fuel-ts/wallet");
var import_ethers2 = require("ethers");

// src/utils/getPredicateRoot.ts
var import_hasher = require("@fuel-ts/hasher");
var import_merkle = require("@fuel-ts/merkle");
var import_utils = require("@fuel-ts/utils");
var import_ethers = require("ethers");
var getPredicateRoot = (bytecode) => {
  const chunkSize = 16 * 1024;
  const bytes = (0, import_ethers.getBytesCopy)(bytecode);
  const chunks = (0, import_utils.chunkAndPadBytes)(bytes, chunkSize);
  const codeRoot = (0, import_merkle.calcRoot)(chunks.map((c) => (0, import_ethers.hexlify)(c)));
  const predicateRoot = (0, import_hasher.hash)((0, import_ethers.concat)(["0x4655454C", codeRoot]));
  return predicateRoot;
};

// src/predicate.ts
var Predicate = class extends import_wallet.Account {
  bytes;
  predicateData = Uint8Array.from([]);
  predicateArgs = [];
  interface;
  /**
   * Creates an instance of the Predicate class.
   *
   * @param bytes - The bytes of the predicate.
   * @param provider - The provider used to interact with the blockchain.
   * @param jsonAbi - The JSON ABI of the predicate.
   * @param configurableConstants - Optional configurable constants for the predicate.
   */
  constructor(bytes, provider, jsonAbi, configurableConstants) {
    const { predicateBytes, predicateInterface } = Predicate.processPredicateData(
      bytes,
      jsonAbi,
      configurableConstants
    );
    const address = import_address.Address.fromB256(getPredicateRoot(predicateBytes));
    super(address, provider);
    this.bytes = predicateBytes;
    this.interface = predicateInterface;
  }
  /**
   * Populates the transaction data with predicate data.
   *
   * @param transactionRequestLike - The transaction request-like object.
   * @returns The transaction request with predicate data.
   */
  populateTransactionPredicateData(transactionRequestLike) {
    const request = (0, import_providers.transactionRequestify)(transactionRequestLike);
    const { policies } = import_providers.BaseTransactionRequest.getPolicyMeta(request);
    request.inputs?.forEach((input) => {
      if (input.type === import_transactions.InputType.Coin && (0, import_ethers2.hexlify)(input.owner) === this.address.toB256()) {
        input.predicate = this.bytes;
        input.predicateData = this.getPredicateData(policies.length);
      }
    });
    return request;
  }
  /**
   * A helper that creates a transfer transaction request and returns it.
   *
   * @param destination - The address of the destination.
   * @param amount - The amount of coins to transfer.
   * @param assetId - The asset ID of the coins to transfer.
   * @param txParams - The transaction parameters (gasLimit, gasPrice, maturity).
   * @returns A promise that resolves to the prepared transaction request.
   */
  async createTransfer(destination, amount, assetId = import_configs.BaseAssetId, txParams = {}) {
    const request = await super.createTransfer(destination, amount, assetId, txParams);
    return this.populateTransactionPredicateData(request);
  }
  /**
   * Sends a transaction with the populated predicate data.
   *
   * @param transactionRequestLike - The transaction request-like object.
   * @returns A promise that resolves to the transaction response.
   */
  sendTransaction(transactionRequestLike) {
    const transactionRequest = this.populateTransactionPredicateData(transactionRequestLike);
    return super.sendTransaction(transactionRequest);
  }
  /**
   * Simulates a transaction with the populated predicate data.
   *
   * @param transactionRequestLike - The transaction request-like object.
   * @returns A promise that resolves to the call result.
   */
  simulateTransaction(transactionRequestLike) {
    const transactionRequest = this.populateTransactionPredicateData(transactionRequestLike);
    return super.simulateTransaction(transactionRequest);
  }
  /**
   * Sets data for the predicate.
   *
   * @param args - Arguments for the predicate function.
   * @returns The Predicate instance with updated predicate data.
   */
  setData(...args) {
    this.predicateArgs = args;
    return this;
  }
  getPredicateData(policiesLength) {
    if (!this.predicateArgs.length) {
      return new Uint8Array();
    }
    const mainFn = this.interface?.functions.main;
    const paddedCode = new import_transactions.ByteArrayCoder(this.bytes.length).encode(this.bytes);
    const VM_TX_MEMORY = (0, import_abi_coder.calculateVmTxMemory)({
      maxInputs: this.provider.getChain().consensusParameters.maxInputs.toNumber()
    });
    const OFFSET = VM_TX_MEMORY + import_abi_coder.SCRIPT_FIXED_SIZE + import_abi_coder.INPUT_COIN_FIXED_SIZE + import_abi_coder.WORD_SIZE + paddedCode.byteLength + policiesLength * import_abi_coder.WORD_SIZE;
    return mainFn?.encodeArguments(this.predicateArgs, OFFSET) || new Uint8Array();
  }
  /**
   * Processes the predicate data and returns the altered bytecode and interface.
   *
   * @param bytes - The bytes of the predicate.
   * @param jsonAbi - The JSON ABI of the predicate.
   * @param configurableConstants - Optional configurable constants for the predicate.
   * @returns An object containing the new predicate bytes and interface.
   */
  static processPredicateData(bytes, jsonAbi, configurableConstants) {
    let predicateBytes = (0, import_ethers2.getBytesCopy)(bytes);
    let abiInterface;
    if (jsonAbi) {
      abiInterface = new import_abi_coder.Interface(jsonAbi);
      if (abiInterface.functions.main === void 0) {
        throw new import_errors.FuelError(
          import_errors.ErrorCode.ABI_MAIN_METHOD_MISSING,
          'Cannot use ABI without "main" function.'
        );
      }
    }
    if (configurableConstants && Object.keys(configurableConstants).length) {
      predicateBytes = Predicate.setConfigurableConstants(
        predicateBytes,
        configurableConstants,
        abiInterface
      );
    }
    return {
      predicateBytes,
      predicateInterface: abiInterface
    };
  }
  /**
   * Sets the configurable constants for the predicate.
   *
   * @param bytes - The bytes of the predicate.
   * @param configurableConstants - Configurable constants to be set.
   * @param abiInterface - The ABI interface of the predicate.
   * @returns The mutated bytes with the configurable constants set.
   */
  static setConfigurableConstants(bytes, configurableConstants, abiInterface) {
    const mutatedBytes = bytes;
    try {
      if (!abiInterface) {
        throw new Error(
          "Cannot validate configurable constants because the Predicate was instantiated without a JSON ABI"
        );
      }
      if (Object.keys(abiInterface.configurables).length === 0) {
        throw new Error("Predicate has no configurable constants to be set");
      }
      Object.entries(configurableConstants).forEach(([key, value]) => {
        if (!abiInterface?.configurables[key]) {
          throw new Error(`No configurable constant named '${key}' found in the Predicate`);
        }
        const { offset } = abiInterface.configurables[key];
        const encoded = abiInterface.encodeConfigurable(key, value);
        mutatedBytes.set(encoded, offset);
      });
    } catch (err) {
      throw new import_errors.FuelError(
        import_errors.ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants: ${err.message}.`
      );
    }
    return mutatedBytes;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Predicate
});
//# sourceMappingURL=index.js.map