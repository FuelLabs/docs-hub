// src/coders/input.ts
import { Coder as Coder2, U64Coder, B256Coder, NumberCoder as NumberCoder2 } from "@fuel-ts/abi-coder";
import { ErrorCode, FuelError } from "@fuel-ts/errors";
import { concat as concat2 } from "@fuel-ts/utils";
import { getBytesCopy as getBytesCopy2, sha256 } from "ethers";

// src/coders/byte-array.ts
import { Coder } from "@fuel-ts/abi-coder";
import { concat } from "@fuel-ts/utils";
import { hexlify, getBytesCopy } from "ethers";
var ByteArrayCoder = class extends Coder {
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
    const data = getBytesCopy(value);
    parts.push(data);
    if (this.#paddingLength) {
      parts.push(new Uint8Array(this.#paddingLength));
    }
    return concat(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = [hexlify(data.slice(o, o + this.length)), o + this.length];
    const value = decoded;
    if (this.#paddingLength) {
      [decoded, o] = [null, o + this.#paddingLength];
    }
    return [value, o];
  }
};

// src/coders/tx-pointer.ts
import { NumberCoder, StructCoder } from "@fuel-ts/abi-coder";
var TxPointerCoder = class extends StructCoder {
  constructor() {
    super("TxPointer", {
      blockHeight: new NumberCoder("u32"),
      txIndex: new NumberCoder("u16")
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
var InputCoinCoder = class extends Coder2 {
  constructor() {
    super("InputCoin", "struct InputCoin", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder().encode(value.txID));
    parts.push(new NumberCoder2("u8").encode(value.outputIndex));
    parts.push(new B256Coder().encode(value.owner));
    parts.push(new U64Coder().encode(value.amount));
    parts.push(new B256Coder().encode(value.assetId));
    parts.push(new TxPointerCoder().encode(value.txPointer));
    parts.push(new NumberCoder2("u8").encode(value.witnessIndex));
    parts.push(new NumberCoder2("u32").encode(value.maturity));
    parts.push(new U64Coder().encode(value.predicateGasUsed));
    parts.push(new NumberCoder2("u32").encode(value.predicateLength));
    parts.push(new NumberCoder2("u32").encode(value.predicateDataLength));
    parts.push(new ByteArrayCoder(value.predicateLength).encode(value.predicate));
    parts.push(new ByteArrayCoder(value.predicateDataLength).encode(value.predicateData));
    return concat2(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder().decode(data, o);
    const txID = decoded;
    [decoded, o] = new NumberCoder2("u8").decode(data, o);
    const outputIndex = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
    const owner = decoded;
    [decoded, o] = new U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new TxPointerCoder().decode(data, o);
    const txPointer = decoded;
    [decoded, o] = new NumberCoder2("u8").decode(data, o);
    const witnessIndex = Number(decoded);
    [decoded, o] = new NumberCoder2("u32").decode(data, o);
    const maturity = decoded;
    [decoded, o] = new U64Coder().decode(data, o);
    const predicateGasUsed = decoded;
    [decoded, o] = new NumberCoder2("u32").decode(data, o);
    const predicateLength = decoded;
    [decoded, o] = new NumberCoder2("u32").decode(data, o);
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
var InputContractCoder = class extends Coder2 {
  constructor() {
    super("InputContract", "struct InputContract", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder().encode(value.txID));
    parts.push(new NumberCoder2("u8").encode(value.outputIndex));
    parts.push(new B256Coder().encode(value.balanceRoot));
    parts.push(new B256Coder().encode(value.stateRoot));
    parts.push(new TxPointerCoder().encode(value.txPointer));
    parts.push(new B256Coder().encode(value.contractID));
    return concat2(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder().decode(data, o);
    const txID = decoded;
    [decoded, o] = new NumberCoder2("u8").decode(data, o);
    const outputIndex = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
    const balanceRoot = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
    const stateRoot = decoded;
    [decoded, o] = new TxPointerCoder().decode(data, o);
    const txPointer = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
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
var InputMessageCoder = class extends Coder2 {
  constructor() {
    super("InputMessage", "struct InputMessage", 0);
  }
  static getMessageId(value) {
    const parts = [];
    parts.push(new ByteArrayCoder(32).encode(value.sender));
    parts.push(new ByteArrayCoder(32).encode(value.recipient));
    parts.push(new ByteArrayCoder(32).encode(value.nonce));
    parts.push(new U64Coder().encode(value.amount));
    parts.push(getBytesCopy2(value.data || "0x"));
    return sha256(concat2(parts));
  }
  static encodeData(messageData) {
    const bytes = getBytesCopy2(messageData || "0x");
    const dataLength = bytes.length;
    return new ByteArrayCoder(dataLength).encode(bytes);
  }
  encode(value) {
    const parts = [];
    const data = InputMessageCoder.encodeData(value.data);
    parts.push(new ByteArrayCoder(32).encode(value.sender));
    parts.push(new ByteArrayCoder(32).encode(value.recipient));
    parts.push(new U64Coder().encode(value.amount));
    parts.push(new ByteArrayCoder(32).encode(value.nonce));
    parts.push(new NumberCoder2("u8").encode(value.witnessIndex));
    parts.push(new U64Coder().encode(value.predicateGasUsed));
    parts.push(new NumberCoder2("u16").encode(data.length));
    parts.push(new NumberCoder2("u16").encode(value.predicateLength));
    parts.push(new NumberCoder2("u16").encode(value.predicateDataLength));
    parts.push(new ByteArrayCoder(data.length).encode(data));
    parts.push(new ByteArrayCoder(value.predicateLength).encode(value.predicate));
    parts.push(new ByteArrayCoder(value.predicateDataLength).encode(value.predicateData));
    return concat2(parts);
  }
  static decodeData(messageData) {
    const bytes = getBytesCopy2(messageData);
    const dataLength = bytes.length;
    const [data] = new ByteArrayCoder(dataLength).decode(bytes, 0);
    return getBytesCopy2(data);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder().decode(data, o);
    const sender = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
    const recipient = decoded;
    [decoded, o] = new U64Coder().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder().decode(data, o);
    const nonce = decoded;
    [decoded, o] = new NumberCoder2("u8").decode(data, o);
    const witnessIndex = Number(decoded);
    [decoded, o] = new U64Coder().decode(data, o);
    const predicateGasUsed = decoded;
    [decoded, o] = new NumberCoder2("u16").decode(data, o);
    const predicateLength = decoded;
    [decoded, o] = new NumberCoder2("u16").decode(data, o);
    const dataLength = decoded;
    [decoded, o] = new NumberCoder2("u16").decode(data, o);
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
var InputCoder = class extends Coder2 {
  constructor() {
    super("Input", "struct Input", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new NumberCoder2("u8").encode(value.type));
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
        throw new FuelError(
          ErrorCode.INVALID_TRANSACTION_INPUT,
          `Invalid transaction input type: ${type}.`
        );
      }
    }
    return concat2(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder2("u8").decode(data, o);
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
        throw new FuelError(
          ErrorCode.INVALID_TRANSACTION_INPUT,
          `Invalid transaction input type: ${type}.`
        );
      }
    }
  }
};

// src/coders/output.ts
import { Coder as Coder3, U64Coder as U64Coder2, B256Coder as B256Coder2, NumberCoder as NumberCoder3 } from "@fuel-ts/abi-coder";
import { ErrorCode as ErrorCode2, FuelError as FuelError2 } from "@fuel-ts/errors";
import { concat as concat3 } from "@fuel-ts/utils";
var OutputType = /* @__PURE__ */ ((OutputType2) => {
  OutputType2[OutputType2["Coin"] = 0] = "Coin";
  OutputType2[OutputType2["Contract"] = 1] = "Contract";
  OutputType2[OutputType2["Change"] = 2] = "Change";
  OutputType2[OutputType2["Variable"] = 3] = "Variable";
  OutputType2[OutputType2["ContractCreated"] = 4] = "ContractCreated";
  return OutputType2;
})(OutputType || {});
var OutputCoinCoder = class extends Coder3 {
  constructor() {
    super("OutputCoin", "struct OutputCoin", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder2().encode(value.to));
    parts.push(new U64Coder2().encode(value.amount));
    parts.push(new B256Coder2().encode(value.assetId));
    return concat3(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder2().decode(data, o);
    const to = decoded;
    [decoded, o] = new U64Coder2().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder2().decode(data, o);
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
var OutputContractCoder = class extends Coder3 {
  constructor() {
    super("OutputContract", "struct OutputContract", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new NumberCoder3("u8").encode(value.inputIndex));
    parts.push(new B256Coder2().encode(value.balanceRoot));
    parts.push(new B256Coder2().encode(value.stateRoot));
    return concat3(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder3("u8").decode(data, o);
    const inputIndex = decoded;
    [decoded, o] = new B256Coder2().decode(data, o);
    const balanceRoot = decoded;
    [decoded, o] = new B256Coder2().decode(data, o);
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
var OutputChangeCoder = class extends Coder3 {
  constructor() {
    super("OutputChange", "struct OutputChange", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder2().encode(value.to));
    parts.push(new U64Coder2().encode(value.amount));
    parts.push(new B256Coder2().encode(value.assetId));
    return concat3(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder2().decode(data, o);
    const to = decoded;
    [decoded, o] = new U64Coder2().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder2().decode(data, o);
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
var OutputVariableCoder = class extends Coder3 {
  constructor() {
    super("OutputVariable", "struct OutputVariable", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder2().encode(value.to));
    parts.push(new U64Coder2().encode(value.amount));
    parts.push(new B256Coder2().encode(value.assetId));
    return concat3(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder2().decode(data, o);
    const to = decoded;
    [decoded, o] = new U64Coder2().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder2().decode(data, o);
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
var OutputContractCreatedCoder = class extends Coder3 {
  constructor() {
    super("OutputContractCreated", "struct OutputContractCreated", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder2().encode(value.contractId));
    parts.push(new B256Coder2().encode(value.stateRoot));
    return concat3(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder2().decode(data, o);
    const contractId = decoded;
    [decoded, o] = new B256Coder2().decode(data, o);
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
var OutputCoder = class extends Coder3 {
  constructor() {
    super("Output", " struct Output", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new NumberCoder3("u8").encode(value.type));
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
        throw new FuelError2(
          ErrorCode2.INVALID_TRANSACTION_OUTPUT,
          `Invalid transaction output type: ${type}.`
        );
      }
    }
    return concat3(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder3("u8").decode(data, o);
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
        throw new FuelError2(
          ErrorCode2.INVALID_TRANSACTION_OUTPUT,
          `Invalid transaction output type: ${type}.`
        );
      }
    }
  }
};

// src/coders/policy.ts
import { Coder as Coder4, NumberCoder as NumberCoder4, U64Coder as U64Coder3 } from "@fuel-ts/abi-coder";
import { ErrorCode as ErrorCode3, FuelError as FuelError3 } from "@fuel-ts/errors";
import { concat as concat4 } from "@fuel-ts/utils";
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
      throw new FuelError3(
        ErrorCode3.DUPLICATED_POLICY,
        `Duplicate policy type found: ${8 /* MaxFee */}`
      );
    }
    seenTypes.add(policy.type);
  });
}
var PoliciesCoder = class extends Coder4 {
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
          parts.push(new U64Coder3().encode(data));
          break;
        case 4 /* Maturity */:
          parts.push(new NumberCoder4("u32").encode(data));
          break;
        default: {
          throw new FuelError3(ErrorCode3.INVALID_POLICY_TYPE, `Invalid policy type: ${type}`);
        }
      }
    });
    return concat4(parts);
  }
  decode(data, offset, policyTypes) {
    let o = offset;
    const policies = [];
    if (policyTypes & 1 /* GasPrice */) {
      const [gasPrice, nextOffset] = new U64Coder3().decode(data, o);
      o = nextOffset;
      policies.push({ type: 1 /* GasPrice */, data: gasPrice });
    }
    if (policyTypes & 2 /* WitnessLimit */) {
      const [witnessLimit, nextOffset] = new U64Coder3().decode(data, o);
      o = nextOffset;
      policies.push({ type: 2 /* WitnessLimit */, data: witnessLimit });
    }
    if (policyTypes & 4 /* Maturity */) {
      const [maturity, nextOffset] = new NumberCoder4("u32").decode(data, o);
      o = nextOffset;
      policies.push({ type: 4 /* Maturity */, data: maturity });
    }
    if (policyTypes & 8 /* MaxFee */) {
      const [maxFee, nextOffset] = new U64Coder3().decode(data, o);
      o = nextOffset;
      policies.push({ type: 8 /* MaxFee */, data: maxFee });
    }
    return [policies, o];
  }
};

// src/coders/receipt.ts
import { Coder as Coder5, U64Coder as U64Coder4, B256Coder as B256Coder3, NumberCoder as NumberCoder5 } from "@fuel-ts/abi-coder";
import { ErrorCode as ErrorCode4, FuelError as FuelError4 } from "@fuel-ts/errors";
import { concat as concat5 } from "@fuel-ts/utils";
import { getBytesCopy as getBytesCopy3, sha256 as sha2562 } from "ethers";
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
var ReceiptCallCoder = class extends Coder5 {
  constructor() {
    super("ReceiptCall", "struct ReceiptCall", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.from));
    parts.push(new B256Coder3().encode(value.to));
    parts.push(new U64Coder4().encode(value.amount));
    parts.push(new B256Coder3().encode(value.assetId));
    parts.push(new U64Coder4().encode(value.gas));
    parts.push(new U64Coder4().encode(value.param1));
    parts.push(new U64Coder4().encode(value.param2));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const from = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const to = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const gas = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const param1 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const param2 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptReturnCoder = class extends Coder5 {
  constructor() {
    super("ReceiptReturn", "struct ReceiptReturn", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.id));
    parts.push(new U64Coder4().encode(value.val));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const id = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptReturnDataCoder = class extends Coder5 {
  constructor() {
    super("ReceiptReturnData", "struct ReceiptReturnData", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.id));
    parts.push(new U64Coder4().encode(value.ptr));
    parts.push(new U64Coder4().encode(value.len));
    parts.push(new B256Coder3().encode(value.digest));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const id = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const ptr = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const len = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const digest = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptPanicCoder = class extends Coder5 {
  constructor() {
    super("ReceiptPanic", "struct ReceiptPanic", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.id));
    parts.push(new U64Coder4().encode(value.reason));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    parts.push(new B256Coder3().encode(value.contractId));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const id = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const reason = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const is = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
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
var ReceiptRevertCoder = class extends Coder5 {
  constructor() {
    super("ReceiptRevert", "struct ReceiptRevert", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.id));
    parts.push(new U64Coder4().encode(value.val));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const id = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptLogCoder = class extends Coder5 {
  constructor() {
    super("ReceiptLog", "struct ReceiptLog", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.id));
    parts.push(new U64Coder4().encode(value.val0));
    parts.push(new U64Coder4().encode(value.val1));
    parts.push(new U64Coder4().encode(value.val2));
    parts.push(new U64Coder4().encode(value.val3));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const id = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val0 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val1 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val2 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val3 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptLogDataCoder = class extends Coder5 {
  constructor() {
    super("ReceiptLogData", "struct ReceiptLogData", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.id));
    parts.push(new U64Coder4().encode(value.val0));
    parts.push(new U64Coder4().encode(value.val1));
    parts.push(new U64Coder4().encode(value.ptr));
    parts.push(new U64Coder4().encode(value.len));
    parts.push(new B256Coder3().encode(value.digest));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const id = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val0 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val1 = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const ptr = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const len = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const digest = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptTransferCoder = class extends Coder5 {
  constructor() {
    super("ReceiptTransfer", "struct ReceiptTransfer", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.from));
    parts.push(new B256Coder3().encode(value.to));
    parts.push(new U64Coder4().encode(value.amount));
    parts.push(new B256Coder3().encode(value.assetId));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const from = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const to = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptTransferOutCoder = class extends Coder5 {
  constructor() {
    super("ReceiptTransferOut", "struct ReceiptTransferOut", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.from));
    parts.push(new B256Coder3().encode(value.to));
    parts.push(new U64Coder4().encode(value.amount));
    parts.push(new B256Coder3().encode(value.assetId));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const from = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const to = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const assetId = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptScriptResultCoder = class extends Coder5 {
  constructor() {
    super("ReceiptScriptResult", "struct ReceiptScriptResult", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new U64Coder4().encode(value.result));
    parts.push(new U64Coder4().encode(value.gasUsed));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new U64Coder4().decode(data, o);
    const result = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptMessageOutCoder = class extends Coder5 {
  constructor() {
    super("ReceiptMessageOut", "struct ReceiptMessageOut", 0);
  }
  static getMessageId(value) {
    const parts = [];
    parts.push(new ByteArrayCoder(32).encode(value.sender));
    parts.push(new ByteArrayCoder(32).encode(value.recipient));
    parts.push(new ByteArrayCoder(32).encode(value.nonce));
    parts.push(new U64Coder4().encode(value.amount));
    parts.push(getBytesCopy3(value.data || "0x"));
    return sha2562(concat5(parts));
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.sender));
    parts.push(new B256Coder3().encode(value.recipient));
    parts.push(new U64Coder4().encode(value.amount));
    parts.push(new B256Coder3().encode(value.nonce));
    parts.push(new NumberCoder5("u16").encode(value.data.length));
    parts.push(new B256Coder3().encode(value.digest));
    parts.push(new ByteArrayCoder(value.data.length).encode(value.data));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const sender = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const recipient = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const nonce = decoded;
    [decoded, o] = new NumberCoder5("u16").decode(data, o);
    const len = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const digest = decoded;
    [decoded, o] = new ByteArrayCoder(len).decode(data, o);
    const messageData = getBytesCopy3(decoded);
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
  const contractIdBytes = getBytesCopy3(contractId);
  const subIdBytes = getBytesCopy3(subId);
  return sha2562(concat5([contractIdBytes, subIdBytes]));
};
var ReceiptMintCoder = class extends Coder5 {
  constructor() {
    super("ReceiptMint", "struct ReceiptMint", 0);
  }
  static getAssetId(contractId, subId) {
    return getAssetIdForMintAndBurnReceipts(contractId, subId);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.subId));
    parts.push(new B256Coder3().encode(value.contractId));
    parts.push(new U64Coder4().encode(value.val));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const subId = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const contractId = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptBurnCoder = class extends Coder5 {
  constructor() {
    super("ReceiptBurn", "struct ReceiptBurn", 0);
  }
  static getAssetId(contractId, subId) {
    return getAssetIdForMintAndBurnReceipts(contractId, subId);
  }
  encode(value) {
    const parts = [];
    parts.push(new B256Coder3().encode(value.subId));
    parts.push(new B256Coder3().encode(value.contractId));
    parts.push(new U64Coder4().encode(value.val));
    parts.push(new U64Coder4().encode(value.pc));
    parts.push(new U64Coder4().encode(value.is));
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new B256Coder3().decode(data, o);
    const subId = decoded;
    [decoded, o] = new B256Coder3().decode(data, o);
    const contractId = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const val = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
    const pc = decoded;
    [decoded, o] = new U64Coder4().decode(data, o);
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
var ReceiptCoder = class extends Coder5 {
  constructor() {
    super("Receipt", "struct Receipt", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new NumberCoder5("u8").encode(value.type));
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
        throw new FuelError4(ErrorCode4.INVALID_RECEIPT_TYPE, `Invalid receipt type: ${type}`);
      }
    }
    return concat5(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder5("u8").decode(data, o);
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
        throw new FuelError4(ErrorCode4.INVALID_RECEIPT_TYPE, `Invalid receipt type: ${type}`);
      }
    }
  }
};

// src/coders/storage-slot.ts
import { B256Coder as B256Coder4, StructCoder as StructCoder2 } from "@fuel-ts/abi-coder";
var StorageSlotCoder = class extends StructCoder2 {
  constructor() {
    super("StorageSlot", {
      key: new B256Coder4(),
      value: new B256Coder4()
    });
  }
};

// src/coders/transaction.ts
import { Coder as Coder7, ArrayCoder, U64Coder as U64Coder5, B256Coder as B256Coder5, NumberCoder as NumberCoder7 } from "@fuel-ts/abi-coder";
import { ErrorCode as ErrorCode5, FuelError as FuelError5 } from "@fuel-ts/errors";
import { concat as concat7 } from "@fuel-ts/utils";

// src/coders/witness.ts
import { Coder as Coder6, NumberCoder as NumberCoder6 } from "@fuel-ts/abi-coder";
import { concat as concat6 } from "@fuel-ts/utils";
var WitnessCoder = class extends Coder6 {
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
    parts.push(new NumberCoder6("u16").encode(value.dataLength));
    parts.push(new ByteArrayCoder(value.dataLength).encode(value.data));
    return concat6(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder6("u16").decode(data, o);
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
var TransactionScriptCoder = class extends Coder7 {
  constructor() {
    super("TransactionScript", "struct TransactionScript", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new U64Coder5().encode(value.scriptGasLimit));
    parts.push(new NumberCoder7("u16").encode(value.scriptLength));
    parts.push(new NumberCoder7("u16").encode(value.scriptDataLength));
    parts.push(new NumberCoder7("u32").encode(value.policyTypes));
    parts.push(new NumberCoder7("u8").encode(value.inputsCount));
    parts.push(new NumberCoder7("u8").encode(value.outputsCount));
    parts.push(new NumberCoder7("u8").encode(value.witnessesCount));
    parts.push(new B256Coder5().encode(value.receiptsRoot));
    parts.push(new ByteArrayCoder(value.scriptLength).encode(value.script));
    parts.push(new ByteArrayCoder(value.scriptDataLength).encode(value.scriptData));
    parts.push(new PoliciesCoder().encode(value.policies));
    parts.push(new ArrayCoder(new InputCoder(), value.inputsCount).encode(value.inputs));
    parts.push(new ArrayCoder(new OutputCoder(), value.outputsCount).encode(value.outputs));
    parts.push(new ArrayCoder(new WitnessCoder(), value.witnessesCount).encode(value.witnesses));
    return concat7(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new U64Coder5().decode(data, o);
    const scriptGasLimit = decoded;
    [decoded, o] = new NumberCoder7("u16").decode(data, o);
    const scriptLength = decoded;
    [decoded, o] = new NumberCoder7("u16").decode(data, o);
    const scriptDataLength = decoded;
    [decoded, o] = new NumberCoder7("u32").decode(data, o);
    const policyTypes = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const inputsCount = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const outputsCount = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const witnessesCount = decoded;
    [decoded, o] = new B256Coder5().decode(data, o);
    const receiptsRoot = decoded;
    [decoded, o] = new ByteArrayCoder(scriptLength).decode(data, o);
    const script = decoded;
    [decoded, o] = new ByteArrayCoder(scriptDataLength).decode(data, o);
    const scriptData = decoded;
    [decoded, o] = new PoliciesCoder().decode(data, o, policyTypes);
    const policies = decoded;
    [decoded, o] = new ArrayCoder(new InputCoder(), inputsCount).decode(data, o);
    const inputs = decoded;
    [decoded, o] = new ArrayCoder(new OutputCoder(), outputsCount).decode(data, o);
    const outputs = decoded;
    [decoded, o] = new ArrayCoder(new WitnessCoder(), witnessesCount).decode(data, o);
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
var TransactionCreateCoder = class extends Coder7 {
  constructor() {
    super("TransactionCreate", "struct TransactionCreate", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new NumberCoder7("u16").encode(value.bytecodeLength));
    parts.push(new NumberCoder7("u8").encode(value.bytecodeWitnessIndex));
    parts.push(new NumberCoder7("u32").encode(value.policyTypes));
    parts.push(new NumberCoder7("u16").encode(value.storageSlotsCount));
    parts.push(new NumberCoder7("u8").encode(value.inputsCount));
    parts.push(new NumberCoder7("u8").encode(value.outputsCount));
    parts.push(new NumberCoder7("u8").encode(value.witnessesCount));
    parts.push(new B256Coder5().encode(value.salt));
    parts.push(new PoliciesCoder().encode(value.policies));
    parts.push(
      new ArrayCoder(new StorageSlotCoder(), value.storageSlotsCount).encode(value.storageSlots)
    );
    parts.push(new ArrayCoder(new InputCoder(), value.inputsCount).encode(value.inputs));
    parts.push(new ArrayCoder(new OutputCoder(), value.outputsCount).encode(value.outputs));
    parts.push(new ArrayCoder(new WitnessCoder(), value.witnessesCount).encode(value.witnesses));
    return concat7(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder7("u16").decode(data, o);
    const bytecodeLength = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const bytecodeWitnessIndex = decoded;
    [decoded, o] = new NumberCoder7("u32").decode(data, o);
    const policyTypes = decoded;
    [decoded, o] = new NumberCoder7("u16").decode(data, o);
    const storageSlotsCount = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const inputsCount = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const outputsCount = decoded;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
    const witnessesCount = decoded;
    [decoded, o] = new B256Coder5().decode(data, o);
    const salt = decoded;
    [decoded, o] = new PoliciesCoder().decode(data, o, policyTypes);
    const policies = decoded;
    [decoded, o] = new ArrayCoder(new StorageSlotCoder(), storageSlotsCount).decode(data, o);
    const storageSlots = decoded;
    [decoded, o] = new ArrayCoder(new InputCoder(), inputsCount).decode(data, o);
    const inputs = decoded;
    [decoded, o] = new ArrayCoder(new OutputCoder(), outputsCount).decode(data, o);
    const outputs = decoded;
    [decoded, o] = new ArrayCoder(new WitnessCoder(), witnessesCount).decode(data, o);
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
var TransactionMintCoder = class extends Coder7 {
  constructor() {
    super("TransactionMint", "struct TransactionMint", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new TxPointerCoder().encode(value.txPointer));
    parts.push(new InputContractCoder().encode(value.inputContract));
    parts.push(new OutputContractCoder().encode(value.outputContract));
    parts.push(new U64Coder5().encode(value.mintAmount));
    parts.push(new B256Coder5().encode(value.mintAssetId));
    return concat7(parts);
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
    [decoded, o] = new U64Coder5().decode(data, o);
    const mintAmount = decoded;
    [decoded, o] = new B256Coder5().decode(data, o);
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
var TransactionCoder = class extends Coder7 {
  constructor() {
    super("Transaction", "struct Transaction", 0);
  }
  encode(value) {
    const parts = [];
    parts.push(new NumberCoder7("u8").encode(value.type));
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
        throw new FuelError5(
          ErrorCode5.INVALID_TRANSACTION_TYPE,
          `Invalid transaction type: ${type}`
        );
      }
    }
    return concat7(parts);
  }
  decode(data, offset) {
    let decoded;
    let o = offset;
    [decoded, o] = new NumberCoder7("u8").decode(data, o);
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
        throw new FuelError5(
          ErrorCode5.INVALID_TRANSACTION_TYPE,
          `Invalid transaction type: ${type}`
        );
      }
    }
  }
};

// src/coders/utxo-id.ts
import { B256Coder as B256Coder6, NumberCoder as NumberCoder8, StructCoder as StructCoder3 } from "@fuel-ts/abi-coder";
var UtxoIdCoder = class extends StructCoder3 {
  constructor() {
    super("UtxoId", {
      transactionId: new B256Coder6(),
      outputIndex: new NumberCoder8("u8")
    });
  }
};
export {
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
};
//# sourceMappingURL=index.mjs.map