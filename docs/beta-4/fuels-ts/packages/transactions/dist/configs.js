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

// src/configs.ts
var configs_exports = {};
__export(configs_exports, {
  CONTRACT_MAX_SIZE: () => CONTRACT_MAX_SIZE,
  FAILED_ASSERT_EQ_SIGNAL: () => FAILED_ASSERT_EQ_SIGNAL,
  FAILED_ASSERT_SIGNAL: () => FAILED_ASSERT_SIGNAL,
  FAILED_REQUIRE_SIGNAL: () => FAILED_REQUIRE_SIGNAL,
  FAILED_SEND_MESSAGE_SIGNAL: () => FAILED_SEND_MESSAGE_SIGNAL,
  FAILED_TRANSFER_TO_ADDRESS_SIGNAL: () => FAILED_TRANSFER_TO_ADDRESS_SIGNAL,
  FAILED_UNKNOWN_SIGNAL: () => FAILED_UNKNOWN_SIGNAL,
  MAX_PREDICATE_DATA_LENGTH: () => MAX_PREDICATE_DATA_LENGTH,
  MAX_PREDICATE_LENGTH: () => MAX_PREDICATE_LENGTH,
  MAX_SCRIPT_DATA_LENGTH: () => MAX_SCRIPT_DATA_LENGTH,
  MAX_SCRIPT_LENGTH: () => MAX_SCRIPT_LENGTH,
  MAX_STATIC_CONTRACTS: () => MAX_STATIC_CONTRACTS,
  MAX_WITNESSES: () => MAX_WITNESSES
});
module.exports = __toCommonJS(configs_exports);
var CONTRACT_MAX_SIZE = 16 * 1024;
var MAX_WITNESSES = 16;
var MAX_SCRIPT_LENGTH = 1024 * 1024 * 1024;
var MAX_SCRIPT_DATA_LENGTH = 1024 * 1024 * 1024;
var MAX_STATIC_CONTRACTS = 255;
var MAX_PREDICATE_LENGTH = 1024 * 1024;
var MAX_PREDICATE_DATA_LENGTH = 1024 * 1024;
var FAILED_REQUIRE_SIGNAL = "0xffffffffffff0000";
var FAILED_TRANSFER_TO_ADDRESS_SIGNAL = "0xffffffffffff0001";
var FAILED_SEND_MESSAGE_SIGNAL = "0xffffffffffff0002";
var FAILED_ASSERT_EQ_SIGNAL = "0xffffffffffff0003";
var FAILED_ASSERT_SIGNAL = "0xffffffffffff0004";
var FAILED_UNKNOWN_SIGNAL = "0x0";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CONTRACT_MAX_SIZE,
  FAILED_ASSERT_EQ_SIGNAL,
  FAILED_ASSERT_SIGNAL,
  FAILED_REQUIRE_SIGNAL,
  FAILED_SEND_MESSAGE_SIGNAL,
  FAILED_TRANSFER_TO_ADDRESS_SIGNAL,
  FAILED_UNKNOWN_SIGNAL,
  MAX_PREDICATE_DATA_LENGTH,
  MAX_PREDICATE_LENGTH,
  MAX_SCRIPT_DATA_LENGTH,
  MAX_SCRIPT_LENGTH,
  MAX_STATIC_CONTRACTS,
  MAX_WITNESSES
});
//# sourceMappingURL=configs.js.map