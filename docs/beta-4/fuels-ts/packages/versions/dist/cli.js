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

// src/cli.ts
var cli_exports = {};
__export(cli_exports, {
  compareSystemVersions: () => compareSystemVersions,
  fuelUpLink: () => fuelUpLink,
  getSystemForc: () => getSystemForc,
  getSystemFuelCore: () => getSystemFuelCore,
  getSystemVersions: () => getSystemVersions,
  runVersions: () => runVersions
});
module.exports = __toCommonJS(cli_exports);
var import_chalk3 = require("chalk");
var import_cli_table = __toESM(require("cli-table"));

// src/lib/colorizeUserVersion.ts
var import_chalk = require("chalk");
var colorizeUserVersion = (params) => {
  const { version, isGt, isOk } = params;
  if (isGt) {
    return (0, import_chalk.cyan)(version);
  }
  if (isOk) {
    return (0, import_chalk.green)(version);
  }
  return (0, import_chalk.red)(version);
};

// src/lib/compareSystemVersions.ts
var import_semver = __toESM(require("semver"));

// src/lib/getBuiltinVersions.ts
function getBuiltinVersions() {
  return {
    FORC: "0.46.1",
    FUEL_CORE: "0.20.8",
    FUELS: "0.69.1"
  };
}

// src/lib/compareSystemVersions.ts
function compareSystemVersions(params) {
  const { systemForcVersion, systemFuelCoreVersion } = params;
  const versions = getBuiltinVersions();
  const systemForcIsGt = import_semver.default.gt(systemForcVersion, versions.FORC);
  const systemFuelCoreIsGt = import_semver.default.gt(systemFuelCoreVersion, versions.FUEL_CORE);
  const systemForcIsEq = import_semver.default.eq(systemForcVersion, versions.FORC);
  const systemFuelCoreIsEq = import_semver.default.eq(systemFuelCoreVersion, versions.FUEL_CORE);
  return {
    systemForcIsGt,
    systemFuelCoreIsGt,
    systemForcIsEq,
    systemFuelCoreIsEq
  };
}

// src/lib/fuelUpLink.ts
var fuelUpLink = "https://github.com/fuellabs/fuelup";

// src/lib/getSystemVersions.ts
var import_chalk2 = require("chalk");
var import_child_process = require("child_process");
var stdio = "ignore";
function getSystemForc() {
  let systemForcVersion = null;
  let error = null;
  try {
    const reg = /[^0-9.]+/g;
    systemForcVersion = (0, import_child_process.execSync)("forc --version", { stdio }).toString().replace(reg, "");
  } catch (err) {
    error = err;
  }
  return {
    error,
    systemForcVersion
  };
}
function getSystemFuelCore() {
  let systemFuelCoreVersion = null;
  let error = null;
  try {
    const reg = /[^0-9.]+/g;
    systemFuelCoreVersion = (0, import_child_process.execSync)("fuel-core --version", { stdio }).toString().replace(reg, "");
  } catch (err) {
    error = err;
  }
  return {
    error,
    systemFuelCoreVersion
  };
}
function getSystemVersions() {
  const { error } = console;
  const { error: errorForc, systemForcVersion } = getSystemForc();
  const { error: errorCore, systemFuelCoreVersion } = getSystemFuelCore();
  const err = errorForc ?? errorCore;
  if (err) {
    error("Make sure you have Forc and Fuel-Core installed.");
    error(`  ${(0, import_chalk2.green)(fuelUpLink)}`);
    throw err;
  }
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    systemForcVersion,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    systemFuelCoreVersion
  };
}

// src/cli.ts
function runVersions() {
  const { error, info } = console;
  const supportedVersions = getBuiltinVersions();
  const cliTable = new import_cli_table.default({
    head: ["", (0, import_chalk3.bold)("Supported"), (0, import_chalk3.bold)(`Yours / System`)]
  });
  const { systemForcVersion, systemFuelCoreVersion } = getSystemVersions();
  const comparisons = compareSystemVersions({
    systemForcVersion,
    systemFuelCoreVersion
  });
  const userForcColorized = colorizeUserVersion({
    version: systemForcVersion,
    isGt: comparisons.systemForcIsGt,
    isOk: comparisons.systemForcIsEq
  });
  const userFuelCoreColorized = colorizeUserVersion({
    version: systemFuelCoreVersion,
    isGt: comparisons.systemFuelCoreIsGt,
    isOk: comparisons.systemFuelCoreIsEq
  });
  cliTable.push(["Forc", supportedVersions.FORC, userForcColorized]);
  cliTable.push(["Fuel-Core", supportedVersions.FUEL_CORE, userFuelCoreColorized]);
  const someIsGt = comparisons.systemForcIsGt || comparisons.systemFuelCoreIsGt;
  const bothAreExact = comparisons.systemForcIsEq && comparisons.systemFuelCoreIsEq;
  if (someIsGt) {
    info(`Your system's components are newer than the ones supported!`);
    info(cliTable.toString());
    process.exit(0);
  } else if (bothAreExact) {
    info(`You have all the right versions! \u26A1`);
    info(cliTable.toString());
    process.exit(0);
  } else {
    error(`You're using outdated versions \u2014 update them with:`);
    error(`  ${(0, import_chalk3.green)(fuelUpLink)}`);
    error(cliTable.toString());
    process.exit(1);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compareSystemVersions,
  fuelUpLink,
  getSystemForc,
  getSystemFuelCore,
  getSystemVersions,
  runVersions
});
//# sourceMappingURL=cli.js.map