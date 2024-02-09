"use strict";
(() => {
  // src/configs.ts
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
})();
//# sourceMappingURL=configs.global.js.map