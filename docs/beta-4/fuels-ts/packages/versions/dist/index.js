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
  checkFuelCoreVersionCompatibility: () => checkFuelCoreVersionCompatibility,
  versions: () => versions
});
module.exports = __toCommonJS(src_exports);

// src/lib/getBuiltinVersions.ts
function getBuiltinVersions() {
  return {
    FORC: "0.46.1",
    FUEL_CORE: "0.20.8",
    FUELS: "0.69.1"
  };
}

// src/lib/checkFuelCoreVersionCompatibility.ts
var import_semver = __toESM(require("semver"));
function checkFuelCoreVersionCompatibility(networkVersion) {
  const { FUEL_CORE: supportedVersion } = getBuiltinVersions();
  const networkMajor = import_semver.default.major(networkVersion);
  const networkMinor = import_semver.default.minor(networkVersion);
  const networkPatch = import_semver.default.patch(networkVersion);
  const supportedMajor = import_semver.default.major(supportedVersion);
  const supportedMinor = import_semver.default.minor(supportedVersion);
  const supportedPatch = import_semver.default.patch(supportedVersion);
  return {
    supportedVersion,
    isMajorSupported: networkMajor === supportedMajor,
    isMinorSupported: networkMinor === supportedMinor,
    isPatchSupported: networkPatch === supportedPatch
  };
}

// src/index.ts
var versions = getBuiltinVersions();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkFuelCoreVersionCompatibility,
  versions
});
//# sourceMappingURL=index.js.map