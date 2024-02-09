// src/predicate.ts
import {
  Interface,
  INPUT_COIN_FIXED_SIZE,
  WORD_SIZE,
  calculateVmTxMemory,
  SCRIPT_FIXED_SIZE
} from "@fuel-ts/abi-coder";
import { Address } from "@fuel-ts/address";
import { BaseAssetId } from "@fuel-ts/address/configs";
import { ErrorCode, FuelError } from "@fuel-ts/errors";
import { transactionRequestify, BaseTransactionRequest } from "@fuel-ts/providers";
import { ByteArrayCoder, InputType } from "@fuel-ts/transactions";
import { Account } from "@fuel-ts/wallet";
import { getBytesCopy as getBytesCopy2, hexlify as hexlify2 } from "ethers";

// src/utils/getPredicateRoot.ts
import { hash } from "@fuel-ts/hasher";
import { calcRoot } from "@fuel-ts/merkle";
import { chunkAndPadBytes } from "@fuel-ts/utils";
import { hexlify, concat, getBytesCopy } from "ethers";
var getPredicateRoot = (bytecode) => {
  const chunkSize = 16 * 1024;
  const bytes = getBytesCopy(bytecode);
  const chunks = chunkAndPadBytes(bytes, chunkSize);
  const codeRoot = calcRoot(chunks.map((c) => hexlify(c)));
  const predicateRoot = hash(concat(["0x4655454C", codeRoot]));
  return predicateRoot;
};

// src/predicate.ts
var Predicate = class extends Account {
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
    const address = Address.fromB256(getPredicateRoot(predicateBytes));
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
    const request = transactionRequestify(transactionRequestLike);
    const { policies } = BaseTransactionRequest.getPolicyMeta(request);
    request.inputs?.forEach((input) => {
      if (input.type === InputType.Coin && hexlify2(input.owner) === this.address.toB256()) {
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
  async createTransfer(destination, amount, assetId = BaseAssetId, txParams = {}) {
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
    const paddedCode = new ByteArrayCoder(this.bytes.length).encode(this.bytes);
    const VM_TX_MEMORY = calculateVmTxMemory({
      maxInputs: this.provider.getChain().consensusParameters.maxInputs.toNumber()
    });
    const OFFSET = VM_TX_MEMORY + SCRIPT_FIXED_SIZE + INPUT_COIN_FIXED_SIZE + WORD_SIZE + paddedCode.byteLength + policiesLength * WORD_SIZE;
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
    let predicateBytes = getBytesCopy2(bytes);
    let abiInterface;
    if (jsonAbi) {
      abiInterface = new Interface(jsonAbi);
      if (abiInterface.functions.main === void 0) {
        throw new FuelError(
          ErrorCode.ABI_MAIN_METHOD_MISSING,
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
      throw new FuelError(
        ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants: ${err.message}.`
      );
    }
    return mutatedBytes;
  }
};
export {
  Predicate
};
//# sourceMappingURL=index.mjs.map