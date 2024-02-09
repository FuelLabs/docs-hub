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
  ByteArrayCoder: () => ByteArrayCoder,
  InputCoder: () => InputCoder,
  InputCoinCoder: () => InputCoinCoder,
  InputContractCoder: () => InputContractCoder,
  InputMessageCoder: () => InputMessageCoder,
  InputType: () => InputType,
  OutputChangeCoder: () => OutputChangeCoder,
  OutputCoder: () => OutputCoder,
  OutputCoinCoder: () => OutputCoinCoder,
  OutputContractCoder: () => OutputContractCoder,
  OutputContractCreatedCoder: () => OutputContractCreatedCoder,
  OutputType: () => OutputType,
  OutputVariableCoder: () => OutputVariableCoder,
  PoliciesCoder: () => PoliciesCoder,
  PolicyType: () => PolicyType,
  ReceiptBurnCoder: () => ReceiptBurnCoder,
  ReceiptCallCoder: () => ReceiptCallCoder,
  ReceiptCoder: () => ReceiptCoder,
  ReceiptLogCoder: () => ReceiptLogCoder,
  ReceiptLogDataCoder: () => ReceiptLogDataCoder,
  ReceiptMessageOutCoder: () => ReceiptMessageOutCoder,
  ReceiptMintCoder: () => ReceiptMintCoder,
  ReceiptPanicCoder: () => ReceiptPanicCoder,
  ReceiptReturnCoder: () => ReceiptReturnCoder,
  ReceiptReturnDataCoder: () => ReceiptReturnDataCoder,
  ReceiptRevertCoder: () => ReceiptRevertCoder,
  ReceiptScriptResultCoder: () => ReceiptScriptResultCoder,
  ReceiptTransferCoder: () => ReceiptTransferCoder,
  ReceiptTransferOutCoder: () => ReceiptTransferOutCoder,
  ReceiptType: () => ReceiptType,
  StorageSlotCoder: () => StorageSlotCoder,
  TransactionCoder: () => TransactionCoder,
  TransactionCreateCoder: () => TransactionCreateCoder,
  TransactionMintCoder: () => TransactionMintCoder,
  TransactionScriptCoder: () => TransactionScriptCoder,
  TransactionType: () => TransactionType,
  TxPointerCoder: () => TxPointerCoder,
  UtxoIdCoder: () => UtxoIdCoder,
  WitnessCoder: () => WitnessCoder,
  sortPolicies: () => sortPolicies
});
module.exports = __toCommonJS(src_exports);

// src/coders/input.ts
var import_abi_coder3 = require("@fuel-ts/abi-coder");
var import_errors = require("@fuel-ts/errors");
var import_utils2 = require("@fuel-ts/utils");
var import_ethers2 = require("ethers");

// src/coders/byte-array.ts
var import_abi_coder = require("@fuel-ts/abi-coder");
var import_utils = require("@fuel-ts/utils");
var import_ethers = require("ethers");
var ByteArrayCoder = class extends import_abi_coder.Coder {
  length;
  #paddingLength;
  constructor(length) {
    const paddingLength = (8 - length % 8) % 8;
    const encodedLength = length + paddingLength;
    super(
      "ByteArray",
      // While this might sound like a [u8; N] coder it's actually not.
      // A [u8; N] coder would pad every u8 to 8 bytes which would
      // make every u8 have the same size as a u64.
      // We are packing four u8s into u64s here, avoiding this padding.
      `[u64; ${encodedLength / 4}]`,
      encodedLength
    );
    this.length = length;
    this.#paddingLength = paddingLength;
  }
  encode(value) {
    const parts = [];
    const data = (0, import_ethers.getBytesCopy)(value);
    parts.push(data);
    if (this.#paddingLength) {
      parts.push(new Uint8Array(this.#paddingLength));
    }
    return (0, import_utils.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = [(0, import_ethers.hexlify)(data.slice(o, o + this.length)), o + this.length];
    const value = decoded;
    if (this.#paddingLength) {
      [decoded, o] = [null, o + this.#paddingLength];
    }
    return [value, o];
  }
};

// src/coders/tx-pointer.ts
var import_abi_coder2 = require("@fuel-ts/abi-coder");
var TxPointerCoder = class extends import_abi_coder2.StructCoder {
  constructor() {
    super("TxPointer", {
      blockHeight: new import_abi_coder2.NumberCoder("u32"),
      txIndex: new import_abi_coder2.NumberCoder("u16")
    });
  }
};

// src/coders/input.ts
var InputType = /* @__PURE__ */ ((InputType2) => {
  InputType2[InputType2["Coin"] = 0] = "Coin";
  InputType2[InputType2["Contract"] = 1] = "Contract";
  InputType2[InputType2["Message"] = 2] = "Message";
  return InputType2;
})(InputType || {});
var InputCoinCoder = class extends import_abi_coder3.Coder {
  constructor() {
    super("InputCoin", "struct InputCoin", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder3.B256Coder().encode(value.txID));
    parts.push(new import_abi_coder3.NumberCoder("u8").encode(value.outputIndex));
    parts.push(new import_abi_coder3.B256Coder().encode(value.owner));
    parts.push(new import_abi_coder3.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder3.B256Coder().encode(value.assetId));
    parts.push(new TxPointerCoder().encode(value.txPointer));
    parts.push(new import_abi_coder3.NumberCoder("u8").encode(value.witnessIndex));
    parts.push(new import_abi_coder3.NumberCoder("u32").encode(value.maturity));
    parts.push(new import_abi_coder3.U64Coder().encode(value.predicateGasUsed));
    parts.push(new import_abi_coder3.NumberCoder("u32").encode(value.predicateLength));
    parts.push(new import_abi_coder3.NumberCoder("u32").encode(value.predicateDataLength));
    parts.push(new ByteArrayCoder(value.predicateLength).encode(value.predicate));
    parts.push(new ByteArrayCoder(value.predicateDataLength).encode(value.predicateData));
    return (0, import_utils2.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const txID = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u8").decode(data, o);
    const outputIndex = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const owner = decoded;
    [decoded, o] = new import_abi_coder3.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new TxPointerCoder().decode(data, o);
    const txPointer = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u8").decode(data, o);
    const witnessIndex = Number(decoded);
    [decoded, o] = new import_abi_coder3.NumberCoder("u32").decode(data, o);
    const maturity = decoded;
    [decoded, o] = new import_abi_coder3.U64Coder().decode(data, o);
    const predicateGasUsed = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u32").decode(data, o);
    const predicateLength = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u32").decode(data, o);
    const predicateDataLength = decoded;
    [decoded, o] = new ByteArrayCoder(predicateLength).decode(data, o);
    const predicate = decoded;
    [decoded, o] = new ByteArrayCoder(predicateDataLength).decode(data, o);
    const predicateData = decoded;
    return [
      {
        type: 0 /* Coin */,
        txID,
        outputIndex,
        owner,
        amount,
        assetId,
        txPointer,
        witnessIndex,
        maturity,
        predicateGasUsed,
        predicateLength,
        predicateDataLength,
        predicate,
        predicateData
      },
      o
    ];
  }
};
var InputContractCoder = class extends import_abi_coder3.Coder {
  constructor() {
    super("InputContract", "struct InputContract", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder3.B256Coder().encode(value.txID));
    parts.push(new import_abi_coder3.NumberCoder("u8").encode(value.outputIndex));
    parts.push(new import_abi_coder3.B256Coder().encode(value.balanceRoot));
    parts.push(new import_abi_coder3.B256Coder().encode(value.stateRoot));
    parts.push(new TxPointerCoder().encode(value.txPointer));
    parts.push(new import_abi_coder3.B256Coder().encode(value.contractID));
    return (0, import_utils2.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const txID = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u8").decode(data, o);
    const outputIndex = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const balanceRoot = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const stateRoot = decoded;
    [decoded, o] = new TxPointerCoder().decode(data, o);
    const txPointer = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const contractID = decoded;
    return [
      {
        type: 1 /* Contract */,
        txID,
        outputIndex,
        balanceRoot,
        stateRoot,
        txPointer,
        contractID
      },
      o
    ];
  }
};
var InputMessageCoder = class extends import_abi_coder3.Coder {
  constructor() {
    super("InputMessage", "struct InputMessage", 0);
  }
  static getMessageId(value) {
    const parts = [];
    parts.push(new ByteArrayCoder(32).encode(value.sender));
    parts.push(new ByteArrayCoder(32).encode(value.recipient));
    parts.push(new ByteArrayCoder(32).encode(value.nonce));
    parts.push(new import_abi_coder3.U64Coder().encode(value.amount));
    parts.push((0, import_ethers2.getBytesCopy)(value.data || "0x"));
    return (0, import_ethers2.sha256)((0, import_utils2.concat)(parts));
  }
  static encodeData(messageData) {
    const bytes = (0, import_ethers2.getBytesCopy)(messageData || "0x");
    const dataLength = bytes.length;
    return new ByteArrayCoder(dataLength).encode(bytes);
  }
  encode(value) {
    const parts = [];
    const data = InputMessageCoder.encodeData(value.data);
    parts.push(new ByteArrayCoder(32).encode(value.sender));
    parts.push(new ByteArrayCoder(32).encode(value.recipient));
    parts.push(new import_abi_coder3.U64Coder().encode(value.amount));
    parts.push(new ByteArrayCoder(32).encode(value.nonce));
    parts.push(new import_abi_coder3.NumberCoder("u8").encode(value.witnessIndex));
    parts.push(new import_abi_coder3.U64Coder().encode(value.predicateGasUsed));
    parts.push(new import_abi_coder3.NumberCoder("u16").encode(data.length));
    parts.push(new import_abi_coder3.NumberCoder("u16").encode(value.predicateLength));
    parts.push(new import_abi_coder3.NumberCoder("u16").encode(value.predicateDataLength));
    parts.push(new ByteArrayCoder(data.length).encode(data));
    parts.push(new ByteArrayCoder(value.predicateLength).encode(value.predicate));
    parts.push(new ByteArrayCoder(value.predicateDataLength).encode(value.predicateData));
    return (0, import_utils2.concat)(parts);
  }
  static decodeData(messageData) {
    const bytes = (0, import_ethers2.getBytesCopy)(messageData);
    const dataLength = bytes.length;
    const [data] = new ByteArrayCoder(dataLength).decode(bytes, 0);
    return (0, import_ethers2.getBytesCopy)(data);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const sender = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const recipient = decoded;
    [decoded, o] = new import_abi_coder3.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder3.B256Coder().decode(data, o);
    const nonce = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u8").decode(data, o);
    const witnessIndex = Number(decoded);
    [decoded, o] = new import_abi_coder3.U64Coder().decode(data, o);
    const predicateGasUsed = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u16").decode(data, o);
    const predicateLength = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u16").decode(data, o);
    const dataLength = decoded;
    [decoded, o] = new import_abi_coder3.NumberCoder("u16").decode(data, o);
    const predicateDataLength = decoded;
    [decoded, o] = new ByteArrayCoder(dataLength).decode(data, o);
    const messageData = decoded;
    [decoded, o] = new ByteArrayCoder(predicateLength).decode(data, o);
    const predicate = decoded;
    [decoded, o] = new ByteArrayCoder(predicateDataLength).decode(data, o);
    const predicateData = decoded;
    return [
      {
        type: 2 /* Message */,
        sender,
        recipient,
        amount,
        witnessIndex,
        nonce,
        predicateGasUsed,
        dataLength,
        predicateLength,
        predicateDataLength,
        data: messageData,
        predicate,
        predicateData
      },
      o
    ];
  }
};
var InputCoder = class extends import_abi_coder3.Coder {
  constructor() {
    super("Input", "struct Input", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder3.NumberCoder("u8").encode(value.type));
    const { type } = value;
    switch (type) {
      case 0 /* Coin */: {
        parts.push(new InputCoinCoder().encode(value));
        break;
      }
      case 1 /* Contract */: {
        parts.push(new InputContractCoder().encode(value));
        break;
      }
      case 2 /* Message */: {
        parts.push(new InputMessageCoder().encode(value));
        break;
      }
      default: {
        throw new import_errors.FuelError(
          import_errors.ErrorCode.INVALID_TRANSACTION_INPUT,
          `Invalid transaction input type: ${type}.`
        );
      }
    }
    return (0, import_utils2.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder3.NumberCoder("u8").decode(data, o);
    const type = decoded;
    switch (type) {
      case 0 /* Coin */: {
        [decoded, o] = new InputCoinCoder().decode(data, o);
        return [decoded, o];
      }
      case 1 /* Contract */: {
        [decoded, o] = new InputContractCoder().decode(data, o);
        return [decoded, o];
      }
      case 2 /* Message */: {
        [decoded, o] = new InputMessageCoder().decode(data, o);
        return [decoded, o];
      }
      default: {
        throw new import_errors.FuelError(
          import_errors.ErrorCode.INVALID_TRANSACTION_INPUT,
          `Invalid transaction input type: ${type}.`
        );
      }
    }
  }
};

// src/coders/output.ts
var import_abi_coder4 = require("@fuel-ts/abi-coder");
var import_errors2 = require("@fuel-ts/errors");
var import_utils3 = require("@fuel-ts/utils");
var OutputType = /* @__PURE__ */ ((OutputType2) => {
  OutputType2[OutputType2["Coin"] = 0] = "Coin";
  OutputType2[OutputType2["Contract"] = 1] = "Contract";
  OutputType2[OutputType2["Change"] = 2] = "Change";
  OutputType2[OutputType2["Variable"] = 3] = "Variable";
  OutputType2[OutputType2["ContractCreated"] = 4] = "ContractCreated";
  return OutputType2;
})(OutputType || {});
var OutputCoinCoder = class extends import_abi_coder4.Coder {
  constructor() {
    super("OutputCoin", "struct OutputCoin", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder4.B256Coder().encode(value.to));
    parts.push(new import_abi_coder4.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder4.B256Coder().encode(value.assetId));
    return (0, import_utils3.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const to = decoded;
    [decoded, o] = new import_abi_coder4.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const assetId = decoded;
    return [
      {
        type: 0 /* Coin */,
        to,
        amount,
        assetId
      },
      o
    ];
  }
};
var OutputContractCoder = class extends import_abi_coder4.Coder {
  constructor() {
    super("OutputContract", "struct OutputContract", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder4.NumberCoder("u8").encode(value.inputIndex));
    parts.push(new import_abi_coder4.B256Coder().encode(value.balanceRoot));
    parts.push(new import_abi_coder4.B256Coder().encode(value.stateRoot));
    return (0, import_utils3.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder4.NumberCoder("u8").decode(data, o);
    const inputIndex = decoded;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const balanceRoot = decoded;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const stateRoot = decoded;
    return [
      {
        type: 1 /* Contract */,
        inputIndex,
        balanceRoot,
        stateRoot
      },
      o
    ];
  }
};
var OutputChangeCoder = class extends import_abi_coder4.Coder {
  constructor() {
    super("OutputChange", "struct OutputChange", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder4.B256Coder().encode(value.to));
    parts.push(new import_abi_coder4.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder4.B256Coder().encode(value.assetId));
    return (0, import_utils3.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const to = decoded;
    [decoded, o] = new import_abi_coder4.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const assetId = decoded;
    return [
      {
        type: 2 /* Change */,
        to,
        amount,
        assetId
      },
      o
    ];
  }
};
var OutputVariableCoder = class extends import_abi_coder4.Coder {
  constructor() {
    super("OutputVariable", "struct OutputVariable", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder4.B256Coder().encode(value.to));
    parts.push(new import_abi_coder4.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder4.B256Coder().encode(value.assetId));
    return (0, import_utils3.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const to = decoded;
    [decoded, o] = new import_abi_coder4.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const assetId = decoded;
    return [
      {
        type: 3 /* Variable */,
        to,
        amount,
        assetId
      },
      o
    ];
  }
};
var OutputContractCreatedCoder = class extends import_abi_coder4.Coder {
  constructor() {
    super("OutputContractCreated", "struct OutputContractCreated", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder4.B256Coder().encode(value.contractId));
    parts.push(new import_abi_coder4.B256Coder().encode(value.stateRoot));
    return (0, import_utils3.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const contractId = decoded;
    [decoded, o] = new import_abi_coder4.B256Coder().decode(data, o);
    const stateRoot = decoded;
    return [
      {
        type: 4 /* ContractCreated */,
        contractId,
        stateRoot
      },
      o
    ];
  }
};
var OutputCoder = class extends import_abi_coder4.Coder {
  constructor() {
    super("Output", " struct Output", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder4.NumberCoder("u8").encode(value.type));
    const { type } = value;
    switch (type) {
      case 0 /* Coin */: {
        parts.push(new OutputCoinCoder().encode(value));
        break;
      }
      case 1 /* Contract */: {
        parts.push(new OutputContractCoder().encode(value));
        break;
      }
      case 2 /* Change */: {
        parts.push(new OutputChangeCoder().encode(value));
        break;
      }
      case 3 /* Variable */: {
        parts.push(new OutputVariableCoder().encode(value));
        break;
      }
      case 4 /* ContractCreated */: {
        parts.push(new OutputContractCreatedCoder().encode(value));
        break;
      }
      default: {
        throw new import_errors2.FuelError(
          import_errors2.ErrorCode.INVALID_TRANSACTION_OUTPUT,
          `Invalid transaction output type: ${type}.`
        );
      }
    }
    return (0, import_utils3.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder4.NumberCoder("u8").decode(data, o);
    const type = decoded;
    switch (type) {
      case 0 /* Coin */: {
        [decoded, o] = new OutputCoinCoder().decode(data, o);
        return [decoded, o];
      }
      case 1 /* Contract */: {
        [decoded, o] = new OutputContractCoder().decode(data, o);
        return [decoded, o];
      }
      case 2 /* Change */: {
        [decoded, o] = new OutputChangeCoder().decode(data, o);
        return [decoded, o];
      }
      case 3 /* Variable */: {
        [decoded, o] = new OutputVariableCoder().decode(data, o);
        return [decoded, o];
      }
      case 4 /* ContractCreated */: {
        [decoded, o] = new OutputContractCreatedCoder().decode(data, o);
        return [decoded, o];
      }
      default: {
        throw new import_errors2.FuelError(
          import_errors2.ErrorCode.INVALID_TRANSACTION_OUTPUT,
          `Invalid transaction output type: ${type}.`
        );
      }
    }
  }
};

// src/coders/policy.ts
var import_abi_coder5 = require("@fuel-ts/abi-coder");
var import_errors3 = require("@fuel-ts/errors");
var import_utils4 = require("@fuel-ts/utils");
var PolicyType = /* @__PURE__ */ ((PolicyType2) => {
  PolicyType2[PolicyType2["GasPrice"] = 1] = "GasPrice";
  PolicyType2[PolicyType2["WitnessLimit"] = 2] = "WitnessLimit";
  PolicyType2[PolicyType2["Maturity"] = 4] = "Maturity";
  PolicyType2[PolicyType2["MaxFee"] = 8] = "MaxFee";
  return PolicyType2;
})(PolicyType || {});
var sortPolicies = (policies) => policies.sort((a, b) => a.type - b.type);
function validateDuplicatedPolicies(policies) {
  const seenTypes = /* @__PURE__ */ new Set();
  policies.forEach((policy) => {
    if (seenTypes.has(policy.type)) {
      throw new import_errors3.FuelError(
        import_errors3.ErrorCode.DUPLICATED_POLICY,
        `Duplicate policy type found: ${8 /* MaxFee */}`
      );
    }
    seenTypes.add(policy.type);
  });
}
var PoliciesCoder = class extends import_abi_coder5.Coder {
  constructor() {
    super("Policies", "array Policy", 0);
  }
  encode(policies) {
    validateDuplicatedPolicies(policies);
    const sortedPolicies = sortPolicies(policies);
    const parts = [];
    sortedPolicies.forEach(({ data, type }) => {
      switch (type) {
        case 8 /* MaxFee */:
        case 1 /* GasPrice */:
        case 2 /* WitnessLimit */:
          parts.push(new import_abi_coder5.U64Coder().encode(data));
          break;
        case 4 /* Maturity */:
          parts.push(new import_abi_coder5.NumberCoder("u32").encode(data));
          break;
        default: {
          throw new import_errors3.FuelError(import_errors3.ErrorCode.INVALID_POLICY_TYPE, `Invalid policy type: ${type}`);
        }
      }
    });
    return (0, import_utils4.concat)(parts);
  }
  decode(data, offset, policyTypes) {
    let o = offset;
    const policies = [];
    if (policyTypes & 1 /* GasPrice */) {
      const [gasPrice, nextOffset] = new import_abi_coder5.U64Coder().decode(data, o);
      o = nextOffset;
      policies.push({ type: 1 /* GasPrice */, data: gasPrice });
    }
    if (policyTypes & 2 /* WitnessLimit */) {
      const [witnessLimit, nextOffset] = new import_abi_coder5.U64Coder().decode(data, o);
      o = nextOffset;
      policies.push({ type: 2 /* WitnessLimit */, data: witnessLimit });
    }
    if (policyTypes & 4 /* Maturity */) {
      const [maturity, nextOffset] = new import_abi_coder5.NumberCoder("u32").decode(data, o);
      o = nextOffset;
      policies.push({ type: 4 /* Maturity */, data: maturity });
    }
    if (policyTypes & 8 /* MaxFee */) {
      const [maxFee, nextOffset] = new import_abi_coder5.U64Coder().decode(data, o);
      o = nextOffset;
      policies.push({ type: 8 /* MaxFee */, data: maxFee });
    }
    return [policies, o];
  }
};

// src/coders/receipt.ts
var import_abi_coder6 = require("@fuel-ts/abi-coder");
var import_errors4 = require("@fuel-ts/errors");
var import_utils5 = require("@fuel-ts/utils");
var import_ethers3 = require("ethers");
var ReceiptType = /* @__PURE__ */ ((ReceiptType2) => {
  ReceiptType2[ReceiptType2["Call"] = 0] = "Call";
  ReceiptType2[ReceiptType2["Return"] = 1] = "Return";
  ReceiptType2[ReceiptType2["ReturnData"] = 2] = "ReturnData";
  ReceiptType2[ReceiptType2["Panic"] = 3] = "Panic";
  ReceiptType2[ReceiptType2["Revert"] = 4] = "Revert";
  ReceiptType2[ReceiptType2["Log"] = 5] = "Log";
  ReceiptType2[ReceiptType2["LogData"] = 6] = "LogData";
  ReceiptType2[ReceiptType2["Transfer"] = 7] = "Transfer";
  ReceiptType2[ReceiptType2["TransferOut"] = 8] = "TransferOut";
  ReceiptType2[ReceiptType2["ScriptResult"] = 9] = "ScriptResult";
  ReceiptType2[ReceiptType2["MessageOut"] = 10] = "MessageOut";
  ReceiptType2[ReceiptType2["Mint"] = 11] = "Mint";
  ReceiptType2[ReceiptType2["Burn"] = 12] = "Burn";
  return ReceiptType2;
})(ReceiptType || {});
var ReceiptCallCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptCall", "struct ReceiptCall", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.from));
    parts.push(new import_abi_coder6.B256Coder().encode(value.to));
    parts.push(new import_abi_coder6.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder6.B256Coder().encode(value.assetId));
    parts.push(new import_abi_coder6.U64Coder().encode(value.gas));
    parts.push(new import_abi_coder6.U64Coder().encode(value.param1));
    parts.push(new import_abi_coder6.U64Coder().encode(value.param2));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const from = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const to = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const gas = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const param1 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const param2 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 0 /* Call */,
        from,
        to,
        amount,
        assetId,
        gas,
        param1,
        param2,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptReturnCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptReturn", "struct ReceiptReturn", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.id));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const id = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 1 /* Return */,
        id,
        val,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptReturnDataCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptReturnData", "struct ReceiptReturnData", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.id));
    parts.push(new import_abi_coder6.U64Coder().encode(value.ptr));
    parts.push(new import_abi_coder6.U64Coder().encode(value.len));
    parts.push(new import_abi_coder6.B256Coder().encode(value.digest));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const id = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const ptr = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const len = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const digest = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 2 /* ReturnData */,
        id,
        ptr,
        len,
        digest,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptPanicCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptPanic", "struct ReceiptPanic", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.id));
    parts.push(new import_abi_coder6.U64Coder().encode(value.reason));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    parts.push(new import_abi_coder6.B256Coder().encode(value.contractId));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const id = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const reason = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const contractId = decoded;
    return [
      {
        type: 3 /* Panic */,
        id,
        reason,
        pc,
        is,
        contractId
      },
      o
    ];
  }
};
var ReceiptRevertCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptRevert", "struct ReceiptRevert", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.id));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const id = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 4 /* Revert */,
        id,
        val,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptLogCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptLog", "struct ReceiptLog", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.id));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val0));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val1));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val2));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val3));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const id = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val0 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val1 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val2 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val3 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 5 /* Log */,
        id,
        val0,
        val1,
        val2,
        val3,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptLogDataCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptLogData", "struct ReceiptLogData", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.id));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val0));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val1));
    parts.push(new import_abi_coder6.U64Coder().encode(value.ptr));
    parts.push(new import_abi_coder6.U64Coder().encode(value.len));
    parts.push(new import_abi_coder6.B256Coder().encode(value.digest));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const id = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val0 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val1 = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const ptr = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const len = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const digest = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 6 /* LogData */,
        id,
        val0,
        val1,
        ptr,
        len,
        digest,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptTransferCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptTransfer", "struct ReceiptTransfer", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.from));
    parts.push(new import_abi_coder6.B256Coder().encode(value.to));
    parts.push(new import_abi_coder6.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder6.B256Coder().encode(value.assetId));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const from = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const to = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 7 /* Transfer */,
        from,
        to,
        amount,
        assetId,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptTransferOutCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptTransferOut", "struct ReceiptTransferOut", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.from));
    parts.push(new import_abi_coder6.B256Coder().encode(value.to));
    parts.push(new import_abi_coder6.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder6.B256Coder().encode(value.assetId));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const from = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const to = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    return [
      {
        type: 8 /* TransferOut */,
        from,
        to,
        amount,
        assetId,
        pc,
        is
      },
      o
    ];
  }
};
var ReceiptScriptResultCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptScriptResult", "struct ReceiptScriptResult", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.U64Coder().encode(value.result));
    parts.push(new import_abi_coder6.U64Coder().encode(value.gasUsed));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const result = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const gasUsed = decoded;
    return [
      {
        type: 9 /* ScriptResult */,
        result,
        gasUsed
      },
      o
    ];
  }
};
var ReceiptMessageOutCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptMessageOut", "struct ReceiptMessageOut", 0);
  }
  static getMessageId(value) {
    const parts = [];
    parts.push(new ByteArrayCoder(32).encode(value.sender));
    parts.push(new ByteArrayCoder(32).encode(value.recipient));
    parts.push(new ByteArrayCoder(32).encode(value.nonce));
    parts.push(new import_abi_coder6.U64Coder().encode(value.amount));
    parts.push((0, import_ethers3.getBytesCopy)(value.data || "0x"));
    return (0, import_ethers3.sha256)((0, import_utils5.concat)(parts));
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.sender));
    parts.push(new import_abi_coder6.B256Coder().encode(value.recipient));
    parts.push(new import_abi_coder6.U64Coder().encode(value.amount));
    parts.push(new import_abi_coder6.B256Coder().encode(value.nonce));
    parts.push(new import_abi_coder6.NumberCoder("u16").encode(value.data.length));
    parts.push(new import_abi_coder6.B256Coder().encode(value.digest));
    parts.push(new ByteArrayCoder(value.data.length).encode(value.data));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const sender = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const recipient = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const nonce = decoded;
    [decoded, o] = new import_abi_coder6.NumberCoder("u16").decode(data, o);
    const len = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const digest = decoded;
    [decoded, o] = new ByteArrayCoder(len).decode(data, o);
    const messageData = (0, import_ethers3.getBytesCopy)(decoded);
    const receiptMessageOut = {
      type: 10 /* MessageOut */,
      messageId: "",
      sender,
      recipient,
      amount,
      nonce,
      digest,
      data: messageData
    };
    receiptMessageOut.messageId = ReceiptMessageOutCoder.getMessageId(receiptMessageOut);
    return [receiptMessageOut, o];
  }
};
var getAssetIdForMintAndBurnReceipts = (contractId, subId) => {
  const contractIdBytes = (0, import_ethers3.getBytesCopy)(contractId);
  const subIdBytes = (0, import_ethers3.getBytesCopy)(subId);
  return (0, import_ethers3.sha256)((0, import_utils5.concat)([contractIdBytes, subIdBytes]));
};
var ReceiptMintCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptMint", "struct ReceiptMint", 0);
  }
  static getAssetId(contractId, subId) {
    return getAssetIdForMintAndBurnReceipts(contractId, subId);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.subId));
    parts.push(new import_abi_coder6.B256Coder().encode(value.contractId));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const subId = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const contractId = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    const assetId = ReceiptMintCoder.getAssetId(contractId, subId);
    const receiptMint = {
      type: 11 /* Mint */,
      subId,
      contractId,
      val,
      pc,
      is,
      assetId
    };
    return [receiptMint, o];
  }
};
var ReceiptBurnCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("ReceiptBurn", "struct ReceiptBurn", 0);
  }
  static getAssetId(contractId, subId) {
    return getAssetIdForMintAndBurnReceipts(contractId, subId);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.B256Coder().encode(value.subId));
    parts.push(new import_abi_coder6.B256Coder().encode(value.contractId));
    parts.push(new import_abi_coder6.U64Coder().encode(value.val));
    parts.push(new import_abi_coder6.U64Coder().encode(value.pc));
    parts.push(new import_abi_coder6.U64Coder().encode(value.is));
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const subId = decoded;
    [decoded, o] = new import_abi_coder6.B256Coder().decode(data, o);
    const contractId = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const val = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const pc = decoded;
    [decoded, o] = new import_abi_coder6.U64Coder().decode(data, o);
    const is = decoded;
    const assetId = ReceiptMintCoder.getAssetId(contractId, subId);
    const receiptBurn = {
      type: 12 /* Burn */,
      subId,
      contractId,
      val,
      pc,
      is,
      assetId
    };
    return [receiptBurn, o];
  }
};
var ReceiptCoder = class extends import_abi_coder6.Coder {
  constructor() {
    super("Receipt", "struct Receipt", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder6.NumberCoder("u8").encode(value.type));
    const { type } = value;
    switch (value.type) {
      case 0 /* Call */: {
        parts.push(new ReceiptCallCoder().encode(value));
        break;
      }
      case 1 /* Return */: {
        parts.push(new ReceiptReturnCoder().encode(value));
        break;
      }
      case 2 /* ReturnData */: {
        parts.push(new ReceiptReturnDataCoder().encode(value));
        break;
      }
      case 3 /* Panic */: {
        parts.push(new ReceiptPanicCoder().encode(value));
        break;
      }
      case 4 /* Revert */: {
        parts.push(new ReceiptRevertCoder().encode(value));
        break;
      }
      case 5 /* Log */: {
        parts.push(new ReceiptLogCoder().encode(value));
        break;
      }
      case 6 /* LogData */: {
        parts.push(new ReceiptLogDataCoder().encode(value));
        break;
      }
      case 7 /* Transfer */: {
        parts.push(new ReceiptTransferCoder().encode(value));
        break;
      }
      case 8 /* TransferOut */: {
        parts.push(new ReceiptTransferOutCoder().encode(value));
        break;
      }
      case 9 /* ScriptResult */: {
        parts.push(new ReceiptScriptResultCoder().encode(value));
        break;
      }
      case 10 /* MessageOut */: {
        parts.push(new ReceiptMessageOutCoder().encode(value));
        break;
      }
      case 11 /* Mint */: {
        parts.push(new ReceiptMintCoder().encode(value));
        break;
      }
      case 12 /* Burn */: {
        parts.push(new ReceiptBurnCoder().encode(value));
        break;
      }
      default: {
        throw new import_errors4.FuelError(import_errors4.ErrorCode.INVALID_RECEIPT_TYPE, `Invalid receipt type: ${type}`);
      }
    }
    return (0, import_utils5.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder6.NumberCoder("u8").decode(data, o);
    const type = decoded;
    switch (type) {
      case 0 /* Call */: {
        [decoded, o] = new ReceiptCallCoder().decode(data, o);
        return [decoded, o];
      }
      case 1 /* Return */: {
        [decoded, o] = new ReceiptReturnCoder().decode(data, o);
        return [decoded, o];
      }
      case 2 /* ReturnData */: {
        [decoded, o] = new ReceiptReturnDataCoder().decode(data, o);
        return [decoded, o];
      }
      case 3 /* Panic */: {
        [decoded, o] = new ReceiptPanicCoder().decode(data, o);
        return [decoded, o];
      }
      case 4 /* Revert */: {
        [decoded, o] = new ReceiptRevertCoder().decode(data, o);
        return [decoded, o];
      }
      case 5 /* Log */: {
        [decoded, o] = new ReceiptLogCoder().decode(data, o);
        return [decoded, o];
      }
      case 6 /* LogData */: {
        [decoded, o] = new ReceiptLogDataCoder().decode(data, o);
        return [decoded, o];
      }
      case 7 /* Transfer */: {
        [decoded, o] = new ReceiptTransferCoder().decode(data, o);
        return [decoded, o];
      }
      case 8 /* TransferOut */: {
        [decoded, o] = new ReceiptTransferOutCoder().decode(data, o);
        return [decoded, o];
      }
      case 9 /* ScriptResult */: {
        [decoded, o] = new ReceiptScriptResultCoder().decode(data, o);
        return [decoded, o];
      }
      case 10 /* MessageOut */: {
        [decoded, o] = new ReceiptMessageOutCoder().decode(data, o);
        return [decoded, o];
      }
      case 11 /* Mint */: {
        [decoded, o] = new ReceiptMintCoder().decode(data, o);
        return [decoded, o];
      }
      case 12 /* Burn */: {
        [decoded, o] = new ReceiptBurnCoder().decode(data, o);
        return [decoded, o];
      }
      default: {
        throw new import_errors4.FuelError(import_errors4.ErrorCode.INVALID_RECEIPT_TYPE, `Invalid receipt type: ${type}`);
      }
    }
  }
};

// src/coders/storage-slot.ts
var import_abi_coder7 = require("@fuel-ts/abi-coder");
var StorageSlotCoder = class extends import_abi_coder7.StructCoder {
  constructor() {
    super("StorageSlot", {
      key: new import_abi_coder7.B256Coder(),
      value: new import_abi_coder7.B256Coder()
    });
  }
};

// src/coders/transaction.ts
var import_abi_coder9 = require("@fuel-ts/abi-coder");
var import_errors5 = require("@fuel-ts/errors");
var import_utils7 = require("@fuel-ts/utils");

// src/coders/witness.ts
var import_abi_coder8 = require("@fuel-ts/abi-coder");
var import_utils6 = require("@fuel-ts/utils");
var WitnessCoder = class extends import_abi_coder8.Coder {
  constructor() {
    super(
      "Witness",
      // Types of dynamic length are not supported in the ABI
      "unknown",
      0
    );
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder8.NumberCoder("u16").encode(value.dataLength));
    parts.push(new ByteArrayCoder(value.dataLength).encode(value.data));
    return (0, import_utils6.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder8.NumberCoder("u16").decode(data, o);
    const dataLength = decoded;
    [decoded, o] = new ByteArrayCoder(dataLength).decode(data, o);
    const witnessData = decoded;
    return [
      {
        dataLength,
        data: witnessData
      },
      o
    ];
  }
};

// src/coders/transaction.ts
var TransactionType = /* @__PURE__ */ ((TransactionType2) => {
  TransactionType2[TransactionType2["Script"] = 0] = "Script";
  TransactionType2[TransactionType2["Create"] = 1] = "Create";
  TransactionType2[TransactionType2["Mint"] = 2] = "Mint";
  return TransactionType2;
})(TransactionType || {});
var TransactionScriptCoder = class extends import_abi_coder9.Coder {
  constructor() {
    super("TransactionScript", "struct TransactionScript", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder9.U64Coder().encode(value.scriptGasLimit));
    parts.push(new import_abi_coder9.NumberCoder("u16").encode(value.scriptLength));
    parts.push(new import_abi_coder9.NumberCoder("u16").encode(value.scriptDataLength));
    parts.push(new import_abi_coder9.NumberCoder("u32").encode(value.policyTypes));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.inputsCount));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.outputsCount));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.witnessesCount));
    parts.push(new import_abi_coder9.B256Coder().encode(value.receiptsRoot));
    parts.push(new ByteArrayCoder(value.scriptLength).encode(value.script));
    parts.push(new ByteArrayCoder(value.scriptDataLength).encode(value.scriptData));
    parts.push(new PoliciesCoder().encode(value.policies));
    parts.push(new import_abi_coder9.ArrayCoder(new InputCoder(), value.inputsCount).encode(value.inputs));
    parts.push(new import_abi_coder9.ArrayCoder(new OutputCoder(), value.outputsCount).encode(value.outputs));
    parts.push(new import_abi_coder9.ArrayCoder(new WitnessCoder(), value.witnessesCount).encode(value.witnesses));
    return (0, import_utils7.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder9.U64Coder().decode(data, o);
    const scriptGasLimit = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u16").decode(data, o);
    const scriptLength = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u16").decode(data, o);
    const scriptDataLength = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u32").decode(data, o);
    const policyTypes = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const inputsCount = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const outputsCount = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const witnessesCount = decoded;
    [decoded, o] = new import_abi_coder9.B256Coder().decode(data, o);
    const receiptsRoot = decoded;
    [decoded, o] = new ByteArrayCoder(scriptLength).decode(data, o);
    const script = decoded;
    [decoded, o] = new ByteArrayCoder(scriptDataLength).decode(data, o);
    const scriptData = decoded;
    [decoded, o] = new PoliciesCoder().decode(data, o, policyTypes);
    const policies = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new InputCoder(), inputsCount).decode(data, o);
    const inputs = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new OutputCoder(), outputsCount).decode(data, o);
    const outputs = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new WitnessCoder(), witnessesCount).decode(data, o);
    const witnesses = decoded;
    return [
      {
        type: 0 /* Script */,
        scriptGasLimit,
        scriptLength,
        scriptDataLength,
        policyTypes,
        inputsCount,
        outputsCount,
        witnessesCount,
        receiptsRoot,
        script,
        scriptData,
        policies,
        inputs,
        outputs,
        witnesses
      },
      o
    ];
  }
};
var TransactionCreateCoder = class extends import_abi_coder9.Coder {
  constructor() {
    super("TransactionCreate", "struct TransactionCreate", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder9.NumberCoder("u16").encode(value.bytecodeLength));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.bytecodeWitnessIndex));
    parts.push(new import_abi_coder9.NumberCoder("u32").encode(value.policyTypes));
    parts.push(new import_abi_coder9.NumberCoder("u16").encode(value.storageSlotsCount));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.inputsCount));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.outputsCount));
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.witnessesCount));
    parts.push(new import_abi_coder9.B256Coder().encode(value.salt));
    parts.push(new PoliciesCoder().encode(value.policies));
    parts.push(
      new import_abi_coder9.ArrayCoder(new StorageSlotCoder(), value.storageSlotsCount).encode(value.storageSlots)
    );
    parts.push(new import_abi_coder9.ArrayCoder(new InputCoder(), value.inputsCount).encode(value.inputs));
    parts.push(new import_abi_coder9.ArrayCoder(new OutputCoder(), value.outputsCount).encode(value.outputs));
    parts.push(new import_abi_coder9.ArrayCoder(new WitnessCoder(), value.witnessesCount).encode(value.witnesses));
    return (0, import_utils7.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder9.NumberCoder("u16").decode(data, o);
    const bytecodeLength = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const bytecodeWitnessIndex = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u32").decode(data, o);
    const policyTypes = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u16").decode(data, o);
    const storageSlotsCount = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const inputsCount = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const outputsCount = decoded;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const witnessesCount = decoded;
    [decoded, o] = new import_abi_coder9.B256Coder().decode(data, o);
    const salt = decoded;
    [decoded, o] = new PoliciesCoder().decode(data, o, policyTypes);
    const policies = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new StorageSlotCoder(), storageSlotsCount).decode(data, o);
    const storageSlots = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new InputCoder(), inputsCount).decode(data, o);
    const inputs = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new OutputCoder(), outputsCount).decode(data, o);
    const outputs = decoded;
    [decoded, o] = new import_abi_coder9.ArrayCoder(new WitnessCoder(), witnessesCount).decode(data, o);
    const witnesses = decoded;
    return [
      {
        type: 1 /* Create */,
        bytecodeLength,
        bytecodeWitnessIndex,
        policyTypes,
        storageSlotsCount,
        inputsCount,
        outputsCount,
        witnessesCount,
        salt,
        policies,
        storageSlots,
        inputs,
        outputs,
        witnesses
      },
      o
    ];
  }
};
var TransactionMintCoder = class extends import_abi_coder9.Coder {
  constructor() {
    super("TransactionMint", "struct TransactionMint", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new TxPointerCoder().encode(value.txPointer));
    parts.push(new InputContractCoder().encode(value.inputContract));
    parts.push(new OutputContractCoder().encode(value.outputContract));
    parts.push(new import_abi_coder9.U64Coder().encode(value.mintAmount));
    parts.push(new import_abi_coder9.B256Coder().encode(value.mintAssetId));
    return (0, import_utils7.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new TxPointerCoder().decode(data, o);
    const txPointer = decoded;
    [decoded, o] = new InputContractCoder().decode(data, o);
    const inputContract = decoded;
    [decoded, o] = new OutputContractCoder().decode(data, o);
    const outputContract = decoded;
    [decoded, o] = new import_abi_coder9.U64Coder().decode(data, o);
    const mintAmount = decoded;
    [decoded, o] = new import_abi_coder9.B256Coder().decode(data, o);
    const mintAssetId = decoded;
    return [
      {
        type: 2 /* Mint */,
        txPointer,
        inputContract,
        outputContract,
        mintAmount,
        mintAssetId
      },
      o
    ];
  }
};
var TransactionCoder = class extends import_abi_coder9.Coder {
  constructor() {
    super("Transaction", "struct Transaction", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new import_abi_coder9.NumberCoder("u8").encode(value.type));
    const { type } = value;
    switch (value.type) {
      case 0 /* Script */: {
        parts.push(
          new TransactionScriptCoder().encode(value)
        );
        break;
      }
      case 1 /* Create */: {
        parts.push(
          new TransactionCreateCoder().encode(value)
        );
        break;
      }
      case 2 /* Mint */: {
        parts.push(new TransactionMintCoder().encode(value));
        break;
      }
      default: {
        throw new import_errors5.FuelError(
          import_errors5.ErrorCode.INVALID_TRANSACTION_TYPE,
          `Invalid transaction type: ${type}`
        );
      }
    }
    return (0, import_utils7.concat)(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new import_abi_coder9.NumberCoder("u8").decode(data, o);
    const type = decoded;
    switch (type) {
      case 0 /* Script */: {
        [decoded, o] = new TransactionScriptCoder().decode(data, o);
        return [decoded, o];
      }
      case 1 /* Create */: {
        [decoded, o] = new TransactionCreateCoder().decode(data, o);
        return [decoded, o];
      }
      case 2 /* Mint */: {
        [decoded, o] = new TransactionMintCoder().decode(data, o);
        return [decoded, o];
      }
      default: {
        throw new import_errors5.FuelError(
          import_errors5.ErrorCode.INVALID_TRANSACTION_TYPE,
          `Invalid transaction type: ${type}`
        );
      }
    }
  }
};

// src/coders/utxo-id.ts
var import_abi_coder10 = require("@fuel-ts/abi-coder");
var UtxoIdCoder = class extends import_abi_coder10.StructCoder {
  constructor() {
    super("UtxoId", {
      transactionId: new import_abi_coder10.B256Coder(),
      outputIndex: new import_abi_coder10.NumberCoder("u8")
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ByteArrayCoder,
  InputCoder,
  InputCoinCoder,
  InputContractCoder,
  InputMessageCoder,
  InputType,
  OutputChangeCoder,
  OutputCoder,
  OutputCoinCoder,
  OutputContractCoder,
  OutputContractCreatedCoder,
  OutputType,
  OutputVariableCoder,
  PoliciesCoder,
  PolicyType,
  ReceiptBurnCoder,
  ReceiptCallCoder,
  ReceiptCoder,
  ReceiptLogCoder,
  ReceiptLogDataCoder,
  ReceiptMessageOutCoder,
  ReceiptMintCoder,
  ReceiptPanicCoder,
  ReceiptReturnCoder,
  ReceiptReturnDataCoder,
  ReceiptRevertCoder,
  ReceiptScriptResultCoder,
  ReceiptTransferCoder,
  ReceiptTransferOutCoder,
  ReceiptType,
  StorageSlotCoder,
  TransactionCoder,
  TransactionCreateCoder,
  TransactionMintCoder,
  TransactionScriptCoder,
  TransactionType,
  TxPointerCoder,
  UtxoIdCoder,
  WitnessCoder,
  sortPolicies
});
//# sourceMappingURL=index.js.map