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
  Script: () => Script,
  returnZeroScript: () => returnZeroScript
});
module.exports = __toCommonJS(src_exports);

// src/script.ts
var import_abi_coder = require("@fuel-ts/abi-coder");
var import_errors2 = require("@fuel-ts/errors");
var import_interfaces = require("@fuel-ts/interfaces");
var import_ethers = require("ethers");

// src/script-invocation-scope.ts
var import_errors = require("@fuel-ts/errors");
var import_program = require("@fuel-ts/program");
var import_transactions = require("@fuel-ts/transactions");
var ScriptInvocationScope = class extends import_program.FunctionInvocationScope {
  scriptRequest;
  updateScriptRequest() {
    if (!this.scriptRequest) {
      this.buildScriptRequest();
    }
    this.transactionRequest.setScript(this.scriptRequest, this.args);
  }
  buildScriptRequest() {
    const programBytes = this.program.bytes;
    const chainInfoCache = this.program.provider.getChain();
    if (!chainInfoCache) {
      throw new import_errors.FuelError(
        import_errors.FuelError.CODES.CHAIN_INFO_CACHE_EMPTY,
        "Provider chain info cache is empty. Please make sure to initialize the `Provider` properly by running `await Provider.create()`"
      );
    }
    const maxInputs = chainInfoCache.consensusParameters.maxInputs.toNumber();
    const byteLength = new import_transactions.ByteArrayCoder(programBytes.length).encodedLength;
    this.scriptRequest = new import_program.ScriptRequest(
      programBytes,
      (args) => this.func.encodeArguments(
        args,
        import_program.ScriptRequest.getScriptDataOffsetWithScriptBytes(byteLength, maxInputs)
      ),
      () => []
    );
  }
};

// src/script.ts
var Script = class extends import_interfaces.AbstractScript {
  /**
   * The compiled bytecode of the script.
   */
  bytes;
  /**
   * The ABI interface for the script.
   */
  interface;
  /**
   * The account associated with the script.
   */
  account;
  /**
   * The script request object.
   */
  script;
  /**
   * The provider used for interacting with the network.
   */
  provider;
  /**
   * Functions that can be invoked within the script.
   */
  functions;
  /**
   * Create a new instance of the Script class.
   *
   * @param bytecode - The compiled bytecode of the script.
   * @param abi - The ABI interface for the script.
   * @param account - The account associated with the script.
   */
  constructor(bytecode, abi, account) {
    super();
    this.bytes = (0, import_ethers.getBytesCopy)(bytecode);
    this.interface = new import_abi_coder.Interface(abi);
    this.provider = account.provider;
    this.account = account;
    this.functions = {
      main: (...args) => new ScriptInvocationScope(this, this.interface.getFunction("main"), args)
    };
  }
  /**
   * Set the configurable constants of the script.
   *
   * @param configurables - An object containing the configurable constants and their values.
   * @throws Will throw an error if the script has no configurable constants to be set or if an invalid constant is provided.
   * @returns This instance of the `Script`.
   */
  setConfigurableConstants(configurables) {
    try {
      if (!Object.keys(this.interface.configurables).length) {
        throw new Error(`The script does not have configurable constants to be set`);
      }
      Object.entries(configurables).forEach(([key, value]) => {
        if (!this.interface.configurables[key]) {
          throw new Error(`The script does not have a configurable constant named: '${key}'`);
        }
        const { offset } = this.interface.configurables[key];
        const encoded = this.interface.encodeConfigurable(key, value);
        this.bytes.set(encoded, offset);
      });
    } catch (err) {
      throw new import_errors2.FuelError(
        import_errors2.ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants: ${err.message}.`
      );
    }
    return this;
  }
};

// src/scripts.ts
var import_program2 = require("@fuel-ts/program");
var returnZeroScript = new import_program2.ScriptRequest(
  /*
    Opcode::RET(REG_ZERO)
    Opcode::NOOP
  */
  // TODO: Don't use hardcoded scripts: https://github.com/FuelLabs/fuels-ts/issues/281
  "0x24000000",
  () => new Uint8Array(0),
  () => void 0
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Script,
  returnZeroScript
});
//# sourceMappingURL=index.js.map