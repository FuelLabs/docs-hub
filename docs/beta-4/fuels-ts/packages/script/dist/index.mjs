// src/script.ts
import { Interface } from "@fuel-ts/abi-coder";
import { ErrorCode, FuelError as FuelError2 } from "@fuel-ts/errors";
import { AbstractScript } from "@fuel-ts/interfaces";
import { getBytesCopy } from "ethers";

// src/script-invocation-scope.ts
import { FuelError } from "@fuel-ts/errors";
import { ScriptRequest, FunctionInvocationScope } from "@fuel-ts/program";
import { ByteArrayCoder } from "@fuel-ts/transactions";
var ScriptInvocationScope = class extends FunctionInvocationScope {
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
      throw new FuelError(
        FuelError.CODES.CHAIN_INFO_CACHE_EMPTY,
        "Provider chain info cache is empty. Please make sure to initialize the `Provider` properly by running `await Provider.create()`"
      );
    }
    const maxInputs = chainInfoCache.consensusParameters.maxInputs.toNumber();
    const byteLength = new ByteArrayCoder(programBytes.length).encodedLength;
    this.scriptRequest = new ScriptRequest(
      programBytes,
      (args) => this.func.encodeArguments(
        args,
        ScriptRequest.getScriptDataOffsetWithScriptBytes(byteLength, maxInputs)
      ),
      () => []
    );
  }
};

// src/script.ts
var Script = class extends AbstractScript {
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
    this.bytes = getBytesCopy(bytecode);
    this.interface = new Interface(abi);
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
      throw new FuelError2(
        ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants: ${err.message}.`
      );
    }
    return this;
  }
};

// src/scripts.ts
import { ScriptRequest as ScriptRequest2 } from "@fuel-ts/program";
var returnZeroScript = new ScriptRequest2(
  /*
    Opcode::RET(REG_ZERO)
    Opcode::NOOP
  */
  // TODO: Don't use hardcoded scripts: https://github.com/FuelLabs/fuels-ts/issues/281
  "0x24000000",
  () => new Uint8Array(0),
  () => void 0
);
export {
  Script,
  returnZeroScript
};
//# sourceMappingURL=index.mjs.map