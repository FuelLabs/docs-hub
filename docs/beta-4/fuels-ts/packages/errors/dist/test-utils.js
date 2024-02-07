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

// src/test-utils.ts
var test_utils_exports = {};
__export(test_utils_exports, {
  expectToThrowFuelError: () => expectToThrowFuelError,
  safeExec: () => safeExec
});
module.exports = __toCommonJS(test_utils_exports);

// src/test-utils/safeExec.ts
var safeExec = async (lambda) => {
  let error;
  let result;
  try {
    result = await lambda();
  } catch (_error) {
    error = _error;
  }
  return { error, result };
};

// src/error-codes.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["NO_ABIS_FOUND"] = "no-abis-found";
  ErrorCode2["ABI_TYPES_AND_VALUES_MISMATCH"] = "abi-types-and-values-mismatch";
  ErrorCode2["ABI_MAIN_METHOD_MISSING"] = "abi-main-method-missing";
  ErrorCode2["INVALID_COMPONENT"] = "invalid-component";
  ErrorCode2["FRAGMENT_NOT_FOUND"] = "fragment-not-found";
  ErrorCode2["CONFIGURABLE_NOT_FOUND"] = "configurable-not-found";
  ErrorCode2["TYPE_NOT_FOUND"] = "type-not-found";
  ErrorCode2["TYPE_NOT_SUPPORTED"] = "type-not-supported";
  ErrorCode2["INVALID_DECODE_VALUE"] = "invalid-decode-value";
  ErrorCode2["JSON_ABI_ERROR"] = "json-abi-error";
  ErrorCode2["TYPE_ID_NOT_FOUND"] = "type-id-not-found";
  ErrorCode2["BIN_FILE_NOT_FOUND"] = "bin-file-not-found";
  ErrorCode2["CODER_NOT_FOUND"] = "coder-not-found";
  ErrorCode2["INVALID_DATA"] = "invalid-data";
  ErrorCode2["FUNCTION_NOT_FOUND"] = "function-not-found";
  ErrorCode2["INVALID_BECH32_ADDRESS"] = "invalid-bech32-address";
  ErrorCode2["INVALID_EVM_ADDRESS"] = "invalid-evm-address";
  ErrorCode2["INVALID_B256_ADDRESS"] = "invalid-b256-address";
  ErrorCode2["INVALID_URL"] = "invalid-url";
  ErrorCode2["CHAIN_INFO_CACHE_EMPTY"] = "chain-info-cache-empty";
  ErrorCode2["NODE_INFO_CACHE_EMPTY"] = "node-info-cache-empty";
  ErrorCode2["MISSING_PROVIDER"] = "missing-provider";
  ErrorCode2["INVALID_PUBLIC_KEY"] = "invalid-public-key";
  ErrorCode2["INSUFFICIENT_BALANCE"] = "insufficient-balance";
  ErrorCode2["WALLET_MANAGER_ERROR"] = "wallet-manager-error";
  ErrorCode2["HD_WALLET_ERROR"] = "hd-wallet-error";
  ErrorCode2["PARSE_FAILED"] = "parse-failed";
  ErrorCode2["ENCODE_ERROR"] = "encode-error";
  ErrorCode2["DECODE_ERROR"] = "decode-error";
  ErrorCode2["INVALID_CREDENTIALS"] = "invalid-credentials";
  ErrorCode2["ENV_DEPENDENCY_MISSING"] = "env-dependency-missing";
  ErrorCode2["INVALID_TTL"] = "invalid-ttl";
  ErrorCode2["INVALID_INPUT_PARAMETERS"] = "invalid-input-parameters";
  ErrorCode2["NOT_IMPLEMENTED"] = "not-implemented";
  ErrorCode2["NOT_SUPPORTED"] = "not-supported";
  ErrorCode2["CONVERTING_FAILED"] = "converting-error";
  ErrorCode2["ELEMENT_NOT_FOUND"] = "element-not-found";
  ErrorCode2["MISSING_REQUIRED_PARAMETER"] = "missing-required-parameter";
  ErrorCode2["UNEXPECTED_HEX_VALUE"] = "unexpected-hex-value";
  ErrorCode2["GAS_PRICE_TOO_LOW"] = "gas-price-too-low";
  ErrorCode2["GAS_LIMIT_TOO_LOW"] = "gas-limit-too-low";
  ErrorCode2["TRANSACTION_NOT_FOUND"] = "transaction-not-found";
  ErrorCode2["TRANSACTION_FAILED"] = "transaction-failed";
  ErrorCode2["INVALID_CONFIGURABLE_CONSTANTS"] = "invalid-configurable-constants";
  ErrorCode2["INVALID_TRANSACTION_INPUT"] = "invalid-transaction-input";
  ErrorCode2["INVALID_TRANSACTION_OUTPUT"] = "invalid-transaction-output";
  ErrorCode2["INVALID_TRANSACTION_STATUS"] = "invalid-transaction-status";
  ErrorCode2["INVALID_TRANSACTION_TYPE"] = "invalid-transaction-type";
  ErrorCode2["TRANSACTION_ERROR"] = "transaction-error";
  ErrorCode2["INVALID_RECEIPT_TYPE"] = "invalid-receipt-type";
  ErrorCode2["INVALID_WORD_LIST"] = "invalid-word-list";
  ErrorCode2["INVALID_MNEMONIC"] = "invalid-mnemonic";
  ErrorCode2["INVALID_ENTROPY"] = "invalid-entropy";
  ErrorCode2["INVALID_SEED"] = "invalid-seed";
  ErrorCode2["INVALID_CHECKSUM"] = "invalid-checksum";
  ErrorCode2["INVALID_PASSWORD"] = "invalid-password";
  ErrorCode2["ACCOUNT_REQUIRED"] = "account-required";
  ErrorCode2["LATEST_BLOCK_UNAVAILABLE"] = "latest-block-unavailable";
  ErrorCode2["ERROR_BUILDING_BLOCK_EXPLORER_URL"] = "error-building-block-explorer-url";
  ErrorCode2["UNSUPPORTED_FUEL_CLIENT_VERSION"] = "unsupported-fuel-client-version";
  ErrorCode2["VITEPRESS_PLUGIN_ERROR"] = "vitepress-plugin-error";
  ErrorCode2["INVALID_MULTICALL"] = "invalid-multicall";
  ErrorCode2["SCRIPT_REVERTED"] = "script-reverted";
  ErrorCode2["SCRIPT_RETURN_INVALID_TYPE"] = "script-return-invalid-type";
  return ErrorCode2;
})(ErrorCode || {});

// src/test-utils/expect-to-throw-fuel-error.ts
var codes = Object.values(ErrorCode);
var expectToThrowFuelError = async (lambda, expectedError) => {
  if (!expectedError.code) {
    throw new Error("Expected error must contain a code.");
  }
  if (!codes.includes(expectedError.code)) {
    throw new Error(`Expected error code '${expectedError.code}' is not a valid FuelError code.`);
  }
  const { error: thrownError } = await safeExec(lambda);
  if (!thrownError) {
    throw new Error(`Passed-in lambda didn't throw.`);
  }
  const thrownErrorStr = `Thrown error >>> ${thrownError.toString()}`;
  if (!thrownError.code) {
    throw new Error(`Thrown error must contain a code. ${thrownErrorStr}`);
  }
  if (!codes.includes(thrownError.code)) {
    throw new Error(
      `Thrown error code '${thrownError.code}' is not a valid FuelError code. ${thrownErrorStr}`
    );
  }
  expect(thrownError.name).toEqual("FuelError");
  expect(thrownError).toMatchObject(expectedError);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  expectToThrowFuelError,
  safeExec
});
//# sourceMappingURL=test-utils.js.map