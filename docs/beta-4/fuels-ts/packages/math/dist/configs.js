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
  DECIMAL_UNITS: () => DECIMAL_UNITS,
  DEFAULT_MIN_PRECISION: () => DEFAULT_MIN_PRECISION,
  DEFAULT_PRECISION: () => DEFAULT_PRECISION
});
module.exports = __toCommonJS(configs_exports);
var DEFAULT_PRECISION = 9;
var DEFAULT_MIN_PRECISION = 3;
var DECIMAL_UNITS = 9;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DECIMAL_UNITS,
  DEFAULT_MIN_PRECISION,
  DEFAULT_PRECISION
});
//# sourceMappingURL=configs.js.map