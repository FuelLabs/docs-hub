"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AssertFailedRevertError: () => AssertFailedRevertError,
  Contract: () => Contract,
  FunctionInvocationResult: () => FunctionInvocationResult,
  FunctionInvocationScope: () => FunctionInvocationScope,
  InstructionSet: () => InstructionSet,
  InvocationResult: () => InvocationResult,
  MultiCallInvocationScope: () => MultiCallInvocationScope,
  RequireRevertError: () => RequireRevertError,
  RevertError: () => RevertError,
  ScriptRequest: () => ScriptRequest,
  ScriptResultDecoderError: () => ScriptResultDecoderError,
  SendMessageRevertError: () => SendMessageRevertError,
  TransferToAddressRevertError: () => TransferToAddressRevertError,
  assert: () => assert,
  getDocs: () => getDocs,
  revertErrorFactory: () => revertErrorFactory
});
module.exports = __toCommonJS(src_exports);

// src/utils.ts
var import_errors = require("@fuel-ts/errors");

// src/configs.ts
var PANIC_REASONS = [
  "Success",
  "Revert",
  "OutOfGas",
  "TransactionValidity",
  "MemoryOverflow",
  "ArithmeticOverflow",
  "ContractNotFound",
  "MemoryOwnership",
  "NotEnoughBalance",
  "ExpectedInternalContext",
  "AssetIdNotFound",
  "InputNotFound",
  "OutputNotFound",
  "WitnessNotFound",
  "TransactionMaturity",
  "InvalidMetadataIdentifier",
  "MalformedCallStructure",
  "ReservedRegisterNotWritable",
  "ErrorFlag",
  "InvalidImmediateValue",
  "ExpectedCoinInput",
  "MaxMemoryAccess",
  "MemoryWriteOverlap",
  "ContractNotInInputs",
  "InternalBalanceOverflow",
  "ContractMaxSize",
  "ExpectedUnallocatedStack",
  "MaxStaticContractsReached",
  "TransferAmountCannotBeZero",
  "ExpectedOutputVariable",
  "ExpectedParentInternalContext",
  "IllegalJump",
  "NonZeroMessageOutputRecipient",
  "ZeroedMessageOutputRecipient"
];
var PANIC_DOC_URL = "https://docs.rs/fuel-asm/latest/fuel_asm/enum.PanicReason.html";

// src/utils.ts
var getFailureReason = (reason) => {
  if (PANIC_REASONS.includes(reason)) {
    return reason;
  }
  return reason === "Revert(123)" ? "MismatchedSelector" : "unknown";
};
var getDocs = (status) => {
  if (status?.type === "FailureStatus") {
    const reason = getFailureReason(status.reason);
    return {
      doc: reason !== "unknown" ? `${PANIC_DOC_URL}#variant.${reason}` : PANIC_DOC_URL,
      reason
    };
  }
  return { doc: PANIC_DOC_URL, reason: "unknown" };
};
function assert(condition, message) {
  if (!condition) {
    throw new import_errors.FuelError(import_errors.ErrorCode.TRANSACTION_ERROR, message);
  }
}

// src/errors.ts
var import_transactions2 = require("@fuel-ts/transactions");

// src/revert/revert-error-codes.ts
var import_transactions = require("@fuel-ts/transactions");

// src/revert/revert-error.ts
var import_configs2 = require("@fuel-ts/transactions/configs");
var REVERT_MAP = {
  [import_configs2.FAILED_REQUIRE_SIGNAL]: "RequireFailed",
  [import_configs2.FAILED_TRANSFER_TO_ADDRESS_SIGNAL]: "TransferToAddressFailed",
  [import_configs2.FAILED_SEND_MESSAGE_SIGNAL]: "SendMessageFailed",
  [import_configs2.FAILED_ASSERT_EQ_SIGNAL]: "AssertEqFailed",
  [import_configs2.FAILED_ASSERT_SIGNAL]: "AssertFailed",
  [import_configs2.FAILED_UNKNOWN_SIGNAL]: "Unknown"
};
var decodeRevertErrorCode = (receipt) => {
  const signalHex = receipt.val.toHex();
  return REVERT_MAP[signalHex] ? REVERT_MAP[signalHex] : void 0;
};
var RevertError = class extends Error {
  /**
   * The receipt associated with the revert error.
   */
  receipt;
  /**
   * Creates a new instance of RevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(`The script reverted with reason ${reason}`);
    this.name = "RevertError";
    this.receipt = receipt;
  }
  /**
   * Returns a string representation of the RevertError.
   *
   * @returns The string representation of the error.
   */
  toString() {
    const { id, ...r } = this.receipt;
    return `${this.name}: ${this.message}
    ${id}: ${JSON.stringify(r)}`;
  }
};
var RequireRevertError = class extends RevertError {
  /**
   * Creates a new instance of RequireRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "RequireRevertError";
  }
};
var TransferToAddressRevertError = class extends RevertError {
  /**
   * Creates a new instance of TransferToAddressRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "TransferToAddressRevertError";
  }
};
var SendMessageRevertError = class extends RevertError {
  /**
   * Creates a new instance of SendMessageRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "SendMessageRevertError";
  }
};
var AssertFailedRevertError = class extends RevertError {
  /**
   * Creates a new instance of AssertFailedRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "AssertFailedRevertError";
  }
};
var revertErrorFactory = (receipt) => {
  const reason = decodeRevertErrorCode(receipt);
  if (!reason) {
    return void 0;
  }
  switch (reason) {
    case "RequireFailed":
      return new RequireRevertError(receipt, reason);
    case "TransferToAddressFailed":
      return new TransferToAddressRevertError(receipt, reason);
    case "SendMessageFailed":
      return new SendMessageRevertError(receipt, reason);
    case "AssertFailed":
      return new AssertFailedRevertError(receipt, reason);
    default:
      return new RevertError(receipt, reason);
  }
};

// src/revert/revert-error-codes.ts
var { warn } = console;
var getRevertReceipts = (receipts) => receipts.filter((r) => r.type === import_transactions.ReceiptType.Revert);
var RevertErrorCodes = class {
  revertReceipts;
  constructor(receipts) {
    this.revertReceipts = getRevertReceipts(receipts);
  }
  assert(detailedError) {
    const revertError = this.getError();
    if (revertError) {
      revertError.cause = detailedError;
      throw revertError;
    }
  }
  getError() {
    if (!this.revertReceipts.length) {
      return void 0;
    }
    if (this.revertReceipts.length !== 1) {
      warn(
        "Multiple revert receipts found, expected one. Receipts:",
        JSON.stringify(this.revertReceipts)
      );
    }
    return revertErrorFactory(this.revertReceipts[0]);
  }
};

// src/errors.ts
var bigintReplacer = (key, value) => typeof value === "bigint" ? value.toString() : value;
var ScriptResultDecoderError = class extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs;
  constructor(result, message, logs) {
    let docLink = "";
    if (result?.gqlTransaction?.status) {
      docLink = `${JSON.stringify(getDocs(result.gqlTransaction.status), null, 2)}

`;
    }
    const logsText = logs.length ? `Logs:
${JSON.stringify(logs, null, 2)}

` : "";
    const receiptsText = `Receipts:
${JSON.stringify(
      result.receipts.map(({ type, ...r }) => ({ type: import_transactions2.ReceiptType[type], ...r })),
      bigintReplacer,
      2
    )}`;
    super(`${message}

${docLink}${logsText}${receiptsText}`);
    this.logs = logs;
    new RevertErrorCodes(result.receipts).assert(this);
  }
};

// src/functions/invocation-scope.ts
var import_errors6 = require("@fuel-ts/errors");
var import_providers3 = require("@fuel-ts/providers");

// src/functions/base-invocation-scope.ts
var import_errors5 = require("@fuel-ts/errors");
var import_math3 = require("@fuel-ts/math");
var import_providers2 = require("@fuel-ts/providers");
var import_transactions6 = require("@fuel-ts/transactions");
var asm2 = __toESM(require("@fuels/vm-asm"));

// src/contract-call-script.ts
var import_abi_coder2 = require("@fuel-ts/abi-coder");
var import_configs3 = require("@fuel-ts/address/configs");
var import_errors4 = require("@fuel-ts/errors");
var import_math = require("@fuel-ts/math");
var import_transactions4 = require("@fuel-ts/transactions");
var import_utils3 = require("@fuel-ts/utils");
var asm = __toESM(require("@fuels/vm-asm"));
var import_ethers3 = require("ethers");

// src/instruction-set.ts
var import_utils2 = require("@fuel-ts/utils");
var import_ethers = require("ethers");
var InstructionSet = class {
  #operations;
  constructor(...args) {
    this.#operations = args || [];
  }
  entries() {
    return this.#operations;
  }
  push(...args) {
    this.#operations.push(...args);
  }
  concat(ops) {
    return this.#operations.concat(ops);
  }
  extend(ops) {
    this.#operations.push(...ops);
  }
  toBytes() {
    return (0, import_utils2.concat)(
      this.#operations.reduce((instructions, line) => {
        instructions.push(line.to_bytes());
        return instructions;
      }, [])
    );
  }
  toHex() {
    return (0, import_ethers.hexlify)(this.toBytes());
  }
  toString() {
    return `Program:
${JSON.stringify(this.#operations, null, 2)}`;
  }
  byteLength() {
    return this.toBytes().byteLength;
  }
};

// src/script-request.ts
var import_abi_coder = require("@fuel-ts/abi-coder");
var import_errors2 = require("@fuel-ts/errors");
var import_transactions3 = require("@fuel-ts/transactions");
var import_ethers2 = require("ethers");
var calculateScriptDataBaseOffset = (maxInputs) => import_abi_coder.SCRIPT_FIXED_SIZE + (0, import_abi_coder.calculateVmTxMemory)({ maxInputs });
var POINTER_DATA_OFFSET = import_abi_coder.WORD_SIZE + import_abi_coder.ASSET_ID_LEN + import_abi_coder.CONTRACT_ID_LEN + import_abi_coder.WORD_SIZE + import_abi_coder.WORD_SIZE;
function callResultToScriptResult(callResult) {
  const receipts = [...callResult.receipts];
  let scriptResultReceipt;
  let returnReceipt;
  receipts.forEach((receipt) => {
    if (receipt.type === import_transactions3.ReceiptType.ScriptResult) {
      scriptResultReceipt = receipt;
    } else if (receipt.type === import_transactions3.ReceiptType.Return || receipt.type === import_transactions3.ReceiptType.ReturnData || receipt.type === import_transactions3.ReceiptType.Revert) {
      returnReceipt = receipt;
    }
  });
  if (!scriptResultReceipt) {
    throw new import_errors2.FuelError(
      import_errors2.ErrorCode.TRANSACTION_ERROR,
      `The script call result does not contain a 'scriptResultReceipt'.`
    );
  }
  if (!returnReceipt) {
    throw new import_errors2.FuelError(
      import_errors2.ErrorCode.TRANSACTION_ERROR,
      `The script call result does not contain a 'returnReceipt'.`
    );
  }
  const scriptResult = {
    code: scriptResultReceipt.result,
    gasUsed: scriptResultReceipt.gasUsed,
    receipts,
    scriptResultReceipt,
    returnReceipt,
    callResult
  };
  return scriptResult;
}
function decodeCallResult(callResult, decoder, logs = []) {
  try {
    const scriptResult = callResultToScriptResult(callResult);
    return decoder(scriptResult);
  } catch (error) {
    throw new ScriptResultDecoderError(
      callResult,
      error.message,
      logs
    );
  }
}
function callResultToInvocationResult(callResult, call2, logs) {
  return decodeCallResult(
    callResult,
    (scriptResult) => {
      if (scriptResult.returnReceipt.type === import_transactions3.ReceiptType.Revert) {
        throw new import_errors2.FuelError(
          import_errors2.ErrorCode.SCRIPT_REVERTED,
          `Script Reverted. Logs: ${JSON.stringify(logs)}`
        );
      }
      if (scriptResult.returnReceipt.type !== import_transactions3.ReceiptType.Return && scriptResult.returnReceipt.type !== import_transactions3.ReceiptType.ReturnData) {
        const { type } = scriptResult.returnReceipt;
        throw new import_errors2.FuelError(
          import_errors2.ErrorCode.SCRIPT_REVERTED,
          `Script Return Type [${type}] Invalid. Logs: ${JSON.stringify({
            logs,
            receipt: scriptResult.returnReceipt
          })}`
        );
      }
      let value;
      if (scriptResult.returnReceipt.type === import_transactions3.ReceiptType.Return) {
        value = scriptResult.returnReceipt.val;
      }
      if (scriptResult.returnReceipt.type === import_transactions3.ReceiptType.ReturnData) {
        const decoded = call2.func.decodeOutput(scriptResult.returnReceipt.data);
        value = decoded[0];
      }
      return value;
    },
    logs
  );
}
var ScriptRequest = class {
  /**
   * The bytes of the script.
   */
  bytes;
  /**
   * A function to encode the script data.
   */
  scriptDataEncoder;
  /**
   * A function to decode the script result.
   */
  scriptResultDecoder;
  /**
   * Creates an instance of the ScriptRequest class.
   *
   * @param bytes - The bytes of the script.
   * @param scriptDataEncoder - The script data encoder function.
   * @param scriptResultDecoder - The script result decoder function.
   */
  constructor(bytes, scriptDataEncoder, scriptResultDecoder2) {
    this.bytes = (0, import_ethers2.getBytesCopy)(bytes);
    this.scriptDataEncoder = scriptDataEncoder;
    this.scriptResultDecoder = scriptResultDecoder2;
  }
  /**
   * Gets the script data offset for the given bytes.
   *
   * @param byteLength - The byte length of the script.
   * @param maxInputs - The maxInputs value from the chain's consensus params.
   * @returns The script data offset.
   */
  static getScriptDataOffsetWithScriptBytes(byteLength, maxInputs) {
    const scriptDataBaseOffset = (0, import_abi_coder.calculateVmTxMemory)({ maxInputs }) + import_abi_coder.SCRIPT_FIXED_SIZE;
    return scriptDataBaseOffset + byteLength;
  }
  /**
   * Gets the script data offset.
   *
   * @param maxInputs - The maxInputs value from the chain's consensus params.
   * @returns The script data offset.
   */
  getScriptDataOffset(maxInputs) {
    return ScriptRequest.getScriptDataOffsetWithScriptBytes(this.bytes.length, maxInputs);
  }
  /**
   * Encodes the data for a script call.
   *
   * @param data - The script data.
   * @returns The encoded data.
   */
  encodeScriptData(data) {
    const callScript = this.scriptDataEncoder(data);
    if (ArrayBuffer.isView(callScript)) {
      return callScript;
    }
    this.bytes = (0, import_ethers2.getBytesCopy)(callScript.script);
    return callScript.data;
  }
  /**
   * Decodes the result of a script call.
   *
   * @param callResult - The CallResult from the script call.
   * @param logs - Optional logs associated with the decoding.
   * @returns The decoded result.
   */
  decodeCallResult(callResult, logs = []) {
    return decodeCallResult(callResult, this.scriptResultDecoder, logs);
  }
};

// src/contract-call-script.ts
var DEFAULT_OPCODE_PARAMS = {
  assetIdOffset: 0,
  amountOffset: 0,
  gasForwardedOffset: 0,
  callDataOffset: 0
};
var SCRIPT_WRAPPER_CONTRACT_ID = import_configs3.ZeroBytes32;
var getSingleCallInstructions = ({ callDataOffset, gasForwardedOffset, amountOffset, assetIdOffset }, outputInfo) => {
  const inst = new InstructionSet(
    asm.movi(16, callDataOffset),
    asm.movi(17, amountOffset),
    asm.lw(17, 17, 0),
    asm.movi(18, assetIdOffset)
  );
  if (gasForwardedOffset) {
    inst.push(
      asm.movi(19, gasForwardedOffset),
      asm.lw(19, 19, 0),
      asm.call(16, 17, 18, 19)
    );
  } else {
    inst.push(asm.call(16, 17, 18, asm.RegId.cgas().to_u8()));
  }
  if (outputInfo.isHeap) {
    inst.extend([
      // The RET register contains the pointer address of the `CALL` return (a stack
      // address).
      // The RETL register contains the length of the `CALL` return (=24 because the Vec/Bytes
      // struct takes 3 WORDs). We don't actually need it unless the Vec/Bytes struct encoding
      // changes in the compiler.
      // Load the word located at the address contained in RET, it's a word that
      // translates to a heap address. 0x15 is a free register.
      asm.lw(21, asm.RegId.ret().to_u8(), 0),
      // We know a Vec/Bytes struct has its third WORD contain the length of the underlying
      // vector, so use a 2 offset to store the length in 0x16, which is a free register.
      asm.lw(22, asm.RegId.ret().to_u8(), 2),
      // The in-memory size of the type is (in-memory size of the inner type) * length
      asm.muli(22, 22, outputInfo.encodedLength),
      asm.retd(21, 22)
    ]);
  }
  return inst;
};
function getInstructions(offsets, outputs) {
  if (!offsets.length) {
    return new Uint8Array();
  }
  const multiCallInstructions = new InstructionSet();
  for (let i = 0; i < offsets.length; i += 1) {
    multiCallInstructions.extend(getSingleCallInstructions(offsets[i], outputs[i]).entries());
  }
  multiCallInstructions.push(asm.ret(1));
  return multiCallInstructions.toBytes();
}
var isReturnType = (type) => type === import_transactions4.ReceiptType.Return || type === import_transactions4.ReceiptType.ReturnData;
var getMainCallReceipt = (receipts, contractId) => receipts.find(
  ({ type, from, to }) => type === import_transactions4.ReceiptType.Call && from === SCRIPT_WRAPPER_CONTRACT_ID && to === contractId
);
var scriptResultDecoder = (contractId, isOutputDataHeap) => (result) => {
  if ((0, import_math.toNumber)(result.code) !== 0) {
    throw new import_errors4.FuelError(
      import_errors4.ErrorCode.TRANSACTION_ERROR,
      `Execution of the script associated with contract ${contractId} resulted in a non-zero exit code: ${result.code}.`
    );
  }
  const mainCallResult = getMainCallReceipt(
    result.receipts,
    contractId.toB256()
  );
  const mainCallInstructionStart = (0, import_math.bn)(mainCallResult?.is);
  const receipts = result.receipts;
  return receipts.filter(({ type }) => isReturnType(type)).flatMap((receipt, index, filtered) => {
    if (!mainCallInstructionStart.eq((0, import_math.bn)(receipt.is))) {
      return [];
    }
    if (receipt.type === import_transactions4.ReceiptType.Return) {
      return [new import_abi_coder2.U64Coder().encode(receipt.val)];
    }
    if (receipt.type === import_transactions4.ReceiptType.ReturnData) {
      const encodedScriptReturn = (0, import_ethers3.getBytesCopy)(receipt.data);
      if (isOutputDataHeap && isReturnType(filtered[index + 1]?.type)) {
        const nextReturnData = filtered[index + 1];
        return (0, import_utils3.concat)([encodedScriptReturn, (0, import_ethers3.getBytesCopy)(nextReturnData.data)]);
      }
      return [encodedScriptReturn];
    }
    return [new Uint8Array()];
  });
};
var decodeContractCallScriptResult = (callResult, contractId, isOutputDataHeap, logs = []) => decodeCallResult(callResult, scriptResultDecoder(contractId, isOutputDataHeap), logs);
var getCallInstructionsLength = (contractCalls) => contractCalls.reduce(
  (sum, call2) => {
    const offset = { ...DEFAULT_OPCODE_PARAMS };
    if (call2.gas) {
      offset.gasForwardedOffset = 1;
    }
    const output = {
      isHeap: call2.isOutputDataHeap,
      encodedLength: call2.outputEncodedLength
    };
    return sum + getSingleCallInstructions(offset, output).byteLength();
  },
  asm.Instruction.size()
  // placeholder for single RET instruction which is added later
);
var getFunctionOutputInfos = (functionScopes) => functionScopes.map((funcScope) => {
  const { func } = funcScope.getCallConfig();
  return {
    isHeap: func.outputMetadata.isHeapType,
    encodedLength: func.outputMetadata.encodedLength
  };
});
var getContractCallScript = (functionScopes, maxInputs) => new ScriptRequest(
  // Script to call the contract, start with stub size matching length of calls
  getInstructions(
    new Array(functionScopes.length).fill(DEFAULT_OPCODE_PARAMS),
    getFunctionOutputInfos(functionScopes)
  ),
  (contractCalls) => {
    const TOTAL_CALLS = contractCalls.length;
    if (TOTAL_CALLS === 0) {
      return { data: new Uint8Array(), script: new Uint8Array() };
    }
    const callInstructionsLength = getCallInstructionsLength(contractCalls);
    const paddingLength = (8 - callInstructionsLength % 8) % 8;
    const paddedInstructionsLength = callInstructionsLength + paddingLength;
    const dataOffset = calculateScriptDataBaseOffset(maxInputs.toNumber()) + paddedInstructionsLength;
    const paramOffsets = [];
    let segmentOffset = dataOffset;
    const outputInfos = [];
    const scriptData = [];
    for (let i = 0; i < TOTAL_CALLS; i += 1) {
      const call2 = contractCalls[i];
      outputInfos.push({
        isHeap: call2.isOutputDataHeap,
        encodedLength: call2.outputEncodedLength
      });
      let gasForwardedSize = 0;
      paramOffsets.push({
        amountOffset: segmentOffset,
        assetIdOffset: segmentOffset + import_abi_coder2.WORD_SIZE,
        gasForwardedOffset: call2.gas ? segmentOffset + import_abi_coder2.WORD_SIZE + import_abi_coder2.ASSET_ID_LEN : 0,
        callDataOffset: segmentOffset + import_abi_coder2.WORD_SIZE + import_abi_coder2.ASSET_ID_LEN + gasForwardedSize
      });
      scriptData.push(new import_abi_coder2.U64Coder().encode(call2.amount || 0));
      scriptData.push(new import_abi_coder2.B256Coder().encode(call2.assetId?.toString() || import_configs3.BaseAssetId));
      scriptData.push(call2.contractId.toBytes());
      scriptData.push(new import_abi_coder2.U64Coder().encode(call2.fnSelector));
      if (call2.gas) {
        scriptData.push(new import_abi_coder2.U64Coder().encode(call2.gas));
        gasForwardedSize = import_abi_coder2.WORD_SIZE;
      }
      if (call2.isInputDataPointer) {
        const pointerInputOffset = segmentOffset + POINTER_DATA_OFFSET + gasForwardedSize;
        scriptData.push(new import_abi_coder2.U64Coder().encode(pointerInputOffset));
      }
      const args = (0, import_ethers3.getBytesCopy)(call2.data);
      scriptData.push(args);
      segmentOffset = dataOffset + (0, import_utils3.concat)(scriptData).byteLength;
    }
    const script = getInstructions(paramOffsets, outputInfos);
    const finalScriptData = (0, import_utils3.concat)(scriptData);
    return { data: finalScriptData, script };
  },
  () => [new Uint8Array()]
);

// src/functions/invocation-results.ts
var import_math2 = require("@fuel-ts/math");
var import_providers = require("@fuel-ts/providers");
var import_transactions5 = require("@fuel-ts/transactions");
function getGasUsage(callResult) {
  const scriptResult = callResult.receipts.find((r) => r.type === import_transactions5.ReceiptType.ScriptResult);
  return scriptResult?.gasUsed || (0, import_math2.bn)(0);
}
var InvocationResult = class {
  functionScopes;
  isMultiCall;
  gasUsed;
  value;
  /**
   * Constructs an instance of InvocationResult.
   *
   * @param funcScopes - The function scopes.
   * @param callResult - The call result.
   * @param isMultiCall - Whether it's a multi-call.
   */
  constructor(funcScopes, callResult, isMultiCall) {
    this.functionScopes = Array.isArray(funcScopes) ? funcScopes : [funcScopes];
    this.isMultiCall = isMultiCall;
    this.value = this.getDecodedValue(callResult);
    this.gasUsed = getGasUsage(callResult);
  }
  /**
   * Gets the first call config.
   *
   * @returns The first call config.
   */
  getFirstCallConfig() {
    if (!this.functionScopes[0]) {
      return void 0;
    }
    return this.functionScopes[0].getCallConfig();
  }
  /**
   * Decodes the value from the call result.
   *
   * @param callResult - The call result.
   * @returns The decoded value.
   */
  getDecodedValue(callResult) {
    const logs = this.getDecodedLogs(callResult.receipts);
    const callConfig = this.getFirstCallConfig();
    if (this.functionScopes.length === 1 && callConfig && "bytes" in callConfig.program) {
      return callResultToInvocationResult(callResult, callConfig, logs);
    }
    const encodedResults = decodeContractCallScriptResult(
      callResult,
      (callConfig?.program).id,
      callConfig?.func.outputMetadata.isHeapType || false,
      logs
    );
    const returnValues = encodedResults.map((encodedResult, i) => {
      const { func } = this.functionScopes[i].getCallConfig();
      return func.decodeOutput(encodedResult)?.[0];
    });
    return this.isMultiCall ? returnValues : returnValues?.[0];
  }
  /**
   * Decodes the logs from the receipts.
   *
   * @param receipts - The transaction result receipts.
   * @returns The decoded logs.
   */
  getDecodedLogs(receipts) {
    const callConfig = this.getFirstCallConfig();
    if (!callConfig) {
      return [];
    }
    const { program } = callConfig;
    return (0, import_providers.getDecodedLogs)(receipts, program.interface);
  }
};
var FunctionInvocationResult = class extends InvocationResult {
  transactionId;
  transactionResponse;
  transactionResult;
  program;
  logs;
  /**
   * Constructs an instance of FunctionInvocationResult.
   *
   * @param funcScopes - The function scopes.
   * @param transactionResponse - The transaction response.
   * @param transactionResult - The transaction result.
   * @param program - The program.
   * @param isMultiCall - Whether it's a multi-call.
   */
  constructor(funcScopes, transactionResponse, transactionResult, program, isMultiCall) {
    super(funcScopes, transactionResult, isMultiCall);
    this.transactionResponse = transactionResponse;
    this.transactionResult = transactionResult;
    this.transactionId = this.transactionResponse.id;
    this.program = program;
    this.logs = this.getDecodedLogs(transactionResult.receipts);
  }
  /**
   * Builds an instance of FunctionInvocationResult.
   *
   * @param funcScope - The function scope.
   * @param transactionResponse - The transaction response.
   * @param isMultiCall - Whether it's a multi-call.
   * @param program - The program.
   * @returns The function invocation result.
   */
  static async build(funcScope, transactionResponse, isMultiCall, program) {
    const txResult = await transactionResponse.waitForResult();
    const fnResult = new FunctionInvocationResult(
      funcScope,
      transactionResponse,
      txResult,
      program,
      isMultiCall
    );
    return fnResult;
  }
};
var InvocationCallResult = class extends InvocationResult {
  callResult;
  /**
   * Constructs an instance of InvocationCallResult.
   *
   * @param funcScopes - The function scopes.
   * @param callResult - The call result.
   * @param isMultiCall - Whether it's a multi-call.
   */
  constructor(funcScopes, callResult, isMultiCall) {
    super(funcScopes, callResult, isMultiCall);
    this.callResult = callResult;
  }
  /**
   * Builds an instance of InvocationCallResult.
   *
   * @param funcScopes - The function scopes.
   * @param callResult - The call result.
   * @param isMultiCall - Whether it's a multi-call.
   * @returns The invocation call result.
   */
  static async build(funcScopes, callResult, isMultiCall) {
    const fnResult = await new InvocationCallResult(funcScopes, callResult, isMultiCall);
    return fnResult;
  }
};

// src/functions/base-invocation-scope.ts
function createContractCall(funcScope, offset) {
  const { program, args, forward, func, callParameters } = funcScope.getCallConfig();
  const DATA_POINTER_OFFSET = funcScope.getCallConfig().func.isInputDataPointer ? POINTER_DATA_OFFSET : 0;
  const data = func.encodeArguments(args, offset + DATA_POINTER_OFFSET);
  return {
    contractId: program.id,
    fnSelector: func.selector,
    data,
    isInputDataPointer: func.isInputDataPointer,
    isOutputDataHeap: func.outputMetadata.isHeapType,
    outputEncodedLength: func.outputMetadata.encodedLength,
    assetId: forward?.assetId,
    amount: forward?.amount,
    gas: callParameters?.gasLimit
  };
}
var BaseInvocationScope = class {
  transactionRequest;
  program;
  functionInvocationScopes = [];
  txParameters;
  requiredCoins = [];
  isMultiCall = false;
  /**
   * Constructs an instance of BaseInvocationScope.
   *
   * @param program - The abstract program to be invoked.
   * @param isMultiCall - A flag indicating whether the invocation is a multi-call.
   */
  constructor(program, isMultiCall) {
    this.program = program;
    this.isMultiCall = isMultiCall;
    this.transactionRequest = new import_providers2.ScriptTransactionRequest();
  }
  /**
   * Getter for the contract calls.
   *
   * @returns An array of contract calls.
   */
  get calls() {
    const provider = this.getProvider();
    const consensusParams = provider.getChain().consensusParameters;
    if (!consensusParams) {
      throw new import_errors5.FuelError(
        import_errors5.FuelError.CODES.CHAIN_INFO_CACHE_EMPTY,
        "Provider chain info cache is empty. Please make sure to initialize the `Provider` properly by running `await Provider.create()``"
      );
    }
    const maxInputs = consensusParams.maxInputs;
    const script = getContractCallScript(this.functionInvocationScopes, maxInputs);
    return this.functionInvocationScopes.map(
      (funcScope) => createContractCall(funcScope, script.getScriptDataOffset(maxInputs.toNumber()))
    );
  }
  /**
   * Updates the script request with the current contract calls.
   */
  updateScriptRequest() {
    const maxInputs = this.program.provider.getChain().consensusParameters.maxInputs;
    const contractCallScript = getContractCallScript(this.functionInvocationScopes, maxInputs);
    this.transactionRequest.setScript(contractCallScript, this.calls);
  }
  /**
   * Updates the transaction request with the current input/output.
   */
  updateContractInputAndOutput() {
    const calls = this.calls;
    calls.forEach((c) => {
      if (c.contractId) {
        this.transactionRequest.addContractInputAndOutput(c.contractId);
      }
    });
  }
  /**
   * Gets the required coins for the transaction.
   *
   * @returns An array of required coin quantities.
   */
  getRequiredCoins() {
    const forwardingAssets = this.calls.map((call2) => ({
      assetId: String(call2.assetId),
      amount: (0, import_math3.bn)(call2.amount || 0)
    })).filter(({ assetId, amount }) => assetId && !(0, import_math3.bn)(amount).isZero());
    return forwardingAssets;
  }
  /**
   * Updates the required coins for the transaction.
   */
  updateRequiredCoins() {
    const assets = this.getRequiredCoins();
    const reduceForwardCoins = (requiredCoins, { assetId, amount }) => {
      const currentAmount = requiredCoins.get(assetId)?.amount || (0, import_math3.bn)(0);
      return requiredCoins.set(assetId, {
        assetId: String(assetId),
        amount: currentAmount.add(amount)
      });
    };
    this.requiredCoins = Array.from(
      assets.reduce(reduceForwardCoins, /* @__PURE__ */ new Map()).values()
    );
  }
  /**
   * Adds a single call to the invocation scope.
   *
   * @param funcScope - The function scope to add.
   * @returns The current instance of the class.
   */
  addCall(funcScope) {
    this.addCalls([funcScope]);
    return this;
  }
  /**
   * Adds multiple calls to the invocation scope.
   *
   * @param funcScopes - An array of function scopes to add.
   * @returns The current instance of the class.
   */
  addCalls(funcScopes) {
    this.functionInvocationScopes.push(...funcScopes);
    this.updateContractInputAndOutput();
    this.updateRequiredCoins();
    return this;
  }
  /**
   * Prepares the transaction by updating the script request, required coins, and checking the gas limit.
   */
  async prepareTransaction() {
    await asm2.initWasm();
    this.updateScriptRequest();
    this.updateRequiredCoins();
    this.checkGasLimitTotal();
  }
  /**
   * Checks if the total gas limit is within the acceptable range.
   */
  checkGasLimitTotal() {
    const gasLimitOnCalls = this.calls.reduce((total, call2) => total.add(call2.gas || 0), (0, import_math3.bn)(0));
    if (this.transactionRequest.gasLimit.eq(0)) {
      this.transactionRequest.gasLimit = gasLimitOnCalls;
    } else if (gasLimitOnCalls.gt(this.transactionRequest.gasLimit)) {
      throw new import_errors5.FuelError(
        import_errors5.ErrorCode.TRANSACTION_ERROR,
        "Transaction's gasLimit must be equal to or greater than the combined forwarded gas of all calls."
      );
    }
  }
  /**
   * Gets the transaction cost ny dry running the transaction.
   *
   * @param options - Optional transaction cost options.
   * @returns The transaction cost details.
   */
  async getTransactionCost(options) {
    const provider = this.getProvider();
    const request = await this.getTransactionRequest();
    request.gasPrice = (0, import_math3.bn)((0, import_math3.toNumber)(request.gasPrice) || (0, import_math3.toNumber)(options?.gasPrice || 0));
    const txCost = await provider.getTransactionCost(request, this.getRequiredCoins());
    return txCost;
  }
  /**
   * Funds the transaction with the required coins.
   *
   * @returns The current instance of the class.
   */
  async fundWithRequiredCoins(fee) {
    this.transactionRequest.inputs = this.transactionRequest.inputs.filter(
      (i) => i.type !== import_transactions6.InputType.Coin
    );
    await this.program.account?.fund(this.transactionRequest, this.requiredCoins, fee);
    return this;
  }
  /**
   * Sets the transaction parameters.
   *
   * @param txParams - The transaction parameters to set.
   * @returns The current instance of the class.
   */
  txParams(txParams) {
    this.txParameters = txParams;
    const request = this.transactionRequest;
    const { minGasPrice } = this.getProvider().getGasConfig();
    request.gasPrice = (0, import_math3.bn)(txParams.gasPrice || request.gasPrice || minGasPrice);
    request.gasLimit = (0, import_math3.bn)(txParams.gasLimit || request.gasLimit);
    request.maxFee = txParams.maxFee ? (0, import_math3.bn)(txParams.maxFee) : request.maxFee;
    request.witnessLimit = txParams.witnessLimit ? (0, import_math3.bn)(txParams.witnessLimit) : request.witnessLimit;
    request.maturity = txParams.maturity || request.maturity;
    request.addVariableOutputs(this.txParameters?.variableOutputs || 0);
    return this;
  }
  /**
   * Adds contracts to the invocation scope.
   *
   * @param contracts - An array of contracts to add.
   * @returns The current instance of the class.
   */
  addContracts(contracts) {
    contracts.forEach((contract) => {
      this.transactionRequest.addContractInputAndOutput(contract.id);
      this.program.interface.updateExternalLoggedTypes(contract.id.toB256(), contract.interface);
    });
    return this;
  }
  /**
   * Prepares and returns the transaction request object.
   *
   * @returns The prepared transaction request.
   */
  async getTransactionRequest() {
    await this.prepareTransaction();
    return this.transactionRequest;
  }
  /**
   * Submits a transaction.
   *
   * @returns The result of the function invocation.
   */
  async call() {
    assert(this.program.account, "Wallet is required!");
    const transactionRequest = await this.getTransactionRequest();
    const { maxFee } = await this.getTransactionCost();
    await this.fundWithRequiredCoins(maxFee);
    const response = await this.program.account.sendTransaction(transactionRequest);
    return FunctionInvocationResult.build(
      this.functionInvocationScopes,
      response,
      this.isMultiCall,
      this.program
    );
  }
  /**
   * Simulates a transaction.
   *
   * @returns The result of the invocation call.
   */
  async simulate() {
    assert(this.program.account, "Wallet is required!");
    const isUnlockedWallet = this.program.account.populateTransactionWitnessesSignature;
    if (!isUnlockedWallet) {
      return this.dryRun();
    }
    const transactionRequest = await this.getTransactionRequest();
    const { maxFee } = await this.getTransactionCost();
    await this.fundWithRequiredCoins(maxFee);
    const result = await this.program.account.simulateTransaction(transactionRequest);
    return InvocationCallResult.build(this.functionInvocationScopes, result, this.isMultiCall);
  }
  /**
   * Executes a transaction in dry run mode.
   *
   * @returns The result of the invocation call.
   */
  async dryRun() {
    assert(this.program.account, "Wallet is required!");
    const provider = this.getProvider();
    const transactionRequest = await this.getTransactionRequest();
    const { maxFee } = await this.getTransactionCost();
    await this.fundWithRequiredCoins(maxFee);
    const response = await provider.call(transactionRequest, {
      utxoValidation: false
    });
    const result = await InvocationCallResult.build(
      this.functionInvocationScopes,
      response,
      this.isMultiCall
    );
    return result;
  }
  getProvider() {
    const provider = this.program.provider;
    return provider;
  }
  /**
   * Obtains the ID of a transaction.
   *
   * @param chainId - the chainId to use to hash the transaction with
   * @returns the ID of the transaction.
   */
  async getTransactionId(chainId) {
    const chainIdToHash = chainId ?? await this.getProvider().getChainId();
    const transactionRequest = await this.getTransactionRequest();
    return transactionRequest.getTransactionId(chainIdToHash);
  }
};

// src/functions/invocation-scope.ts
var FunctionInvocationScope = class extends BaseInvocationScope {
  func;
  callParameters;
  forward;
  args;
  /**
   * Constructs an instance of FunctionInvocationScope.
   *
   * @param program - The program.
   * @param func - The function fragment.
   * @param args - The arguments.
   */
  constructor(program, func, args) {
    super(program, false);
    this.func = func;
    this.args = args || [];
    this.setArguments(...args);
    super.addCall(this);
  }
  /**
   * Gets the call configuration.
   *
   * @returns The call configuration.
   */
  getCallConfig() {
    return {
      func: this.func,
      program: this.program,
      callParameters: this.callParameters,
      txParameters: this.txParameters,
      forward: this.forward,
      args: this.args
    };
  }
  /**
   * Sets the arguments for the function invocation.
   *
   * @param args - The arguments.
   * @returns The instance of FunctionInvocationScope.
   */
  setArguments(...args) {
    this.args = args || [];
    return this;
  }
  /**
   * Sets the call parameters for the function invocation.
   *
   * @param callParams - The call parameters.
   * @returns The instance of FunctionInvocationScope.
   * @throws If the function is not payable and forward is set.
   */
  callParams(callParams) {
    this.callParameters = callParams;
    if (callParams?.forward) {
      if (!this.func.attributes.find((attr) => attr.name === "payable")) {
        throw new import_errors6.FuelError(
          import_errors6.ErrorCode.TRANSACTION_ERROR,
          `The target function ${this.func.name} cannot accept forwarded funds as it's not marked as 'payable'.`
        );
      }
      this.forward = (0, import_providers3.coinQuantityfy)(callParams.forward);
    }
    this.setArguments(...this.args);
    this.updateRequiredCoins();
    return this;
  }
};

// src/functions/multicall-scope.ts
var import_errors7 = require("@fuel-ts/errors");
var MultiCallInvocationScope = class extends BaseInvocationScope {
  /**
   * Constructs an instance of MultiCallInvocationScope.
   *
   * @param contract - The contract.
   * @param funcScopes - An array of function invocation scopes.
   */
  constructor(contract, funcScopes) {
    super(contract, true);
    this.addCalls(funcScopes);
    this.validateHeapTypeReturnCalls();
  }
  /**
   * Adds a single function invocation scope to the multi-call invocation scope.
   *
   * @param funcScope - The function invocation scope.
   * @returns The instance of MultiCallInvocationScope.
   */
  addCall(funcScope) {
    return super.addCalls([funcScope]);
  }
  /**
   * Adds multiple function invocation scopes to the multi-call invocation scope.
   *
   * @param funcScopes - An array of function invocation scopes.
   * @returns The instance of MultiCallInvocationScope.
   */
  addCalls(funcScopes) {
    return super.addCalls(funcScopes);
  }
  validateHeapTypeReturnCalls() {
    let heapOutputIndex = -1;
    let numberOfHeaps = 0;
    this.calls.forEach((call2, callIndex) => {
      const { isOutputDataHeap } = call2;
      if (isOutputDataHeap) {
        heapOutputIndex = callIndex;
        if (++numberOfHeaps > 1) {
          throw new import_errors7.FuelError(
            import_errors7.ErrorCode.INVALID_MULTICALL,
            "A multicall can have only one call that returns a heap type."
          );
        }
      }
    });
    const hasHeapTypeReturn = heapOutputIndex !== -1;
    const isOnLastCall = heapOutputIndex === this.calls.length - 1;
    if (hasHeapTypeReturn && !isOnLastCall) {
      throw new import_errors7.FuelError(
        import_errors7.ErrorCode.INVALID_MULTICALL,
        "In a multicall, the contract call returning a heap type must be the last call."
      );
    }
  }
};

// src/contract.ts
var import_abi_coder3 = require("@fuel-ts/abi-coder");
var import_address = require("@fuel-ts/address");
var Contract = class {
  /**
   * The unique contract identifier.
   */
  id;
  /**
   * The provider for interacting with the contract.
   */
  provider;
  /**
   * The contract's ABI interface.
   */
  interface;
  /**
   * The account associated with the contract, if available.
   */
  account;
  /**
   * A collection of functions available on the contract.
   */
  functions = {};
  /**
   * Creates an instance of the Contract class.
   *
   * @param id - The contract's address.
   * @param abi - The contract's ABI (JSON ABI or Interface instance).
   * @param accountOrProvider - The account or provider for interaction.
   */
  constructor(id, abi, accountOrProvider) {
    this.interface = abi instanceof import_abi_coder3.Interface ? abi : new import_abi_coder3.Interface(abi);
    this.id = import_address.Address.fromAddressOrString(id);
    if (accountOrProvider && "provider" in accountOrProvider) {
      this.provider = accountOrProvider.provider;
      this.account = accountOrProvider;
    } else {
      this.provider = accountOrProvider;
      this.account = null;
    }
    Object.keys(this.interface.functions).forEach((name) => {
      const fragment = this.interface.getFunction(name);
      Object.defineProperty(this.functions, fragment.name, {
        value: this.buildFunction(fragment),
        writable: false
      });
    });
  }
  /**
   * Build a function invocation scope for the provided function fragment.
   *
   * @param func - The function fragment to build a scope for.
   * @returns A function that creates a FunctionInvocationScope.
   */
  buildFunction(func) {
    return (...args) => new FunctionInvocationScope(this, func, args);
  }
  /**
   * Create a multi-call invocation scope for the provided function invocation scopes.
   *
   * @param calls - An array of FunctionInvocationScopes to execute in a batch.
   * @returns A MultiCallInvocationScope instance.
   */
  multiCall(calls) {
    return new MultiCallInvocationScope(this, calls);
  }
  /**
   * Get the balance for a given asset ID for this contract.
   *
   * @param assetId - The specified asset ID.
   * @returns The balance of the contract for the specified asset.
   */
  // #region contract-balance-1
  getBalance(assetId) {
    return this.provider.getContractBalance(this.id, assetId);
  }
  // #endregion contract-balance-1
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssertFailedRevertError,
  Contract,
  FunctionInvocationResult,
  FunctionInvocationScope,
  InstructionSet,
  InvocationResult,
  MultiCallInvocationScope,
  RequireRevertError,
  RevertError,
  ScriptRequest,
  ScriptResultDecoderError,
  SendMessageRevertError,
  TransferToAddressRevertError,
  assert,
  getDocs,
  revertErrorFactory
});
//# sourceMappingURL=index.js.map