// src/cli.ts
import { bold, green as green3 } from "chalk";
import CliTable from "cli-table";

// src/lib/colorizeUserVersion.ts
import { cyan, green, red } from "chalk";
var colorizeUserVersion = (params) => {
  const { version, isGt, isOk } = params;
  if (isGt) {
    return cyan(version);
  }
  if (isOk) {
    return green(version);
  }
  return red(version);
};

// src/lib/compareSystemVersions.ts
import semver from "semver";

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
  const systemForcIsGt = semver.gt(systemForcVersion, versions.FORC);
  const systemFuelCoreIsGt = semver.gt(systemFuelCoreVersion, versions.FUEL_CORE);
  const systemForcIsEq = semver.eq(systemForcVersion, versions.FORC);
  const systemFuelCoreIsEq = semver.eq(systemFuelCoreVersion, versions.FUEL_CORE);
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
import { green as green2 } from "chalk";
import { execSync } from "child_process";
var stdio = "ignore";
function getSystemForc() {
  let systemForcVersion = null;
  let error = null;
  try {
    const reg = /[^0-9.]+/g;
    systemForcVersion = execSync("forc --version", { stdio }).toString().replace(reg, "");
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
    systemFuelCoreVersion = execSync("fuel-core --version", { stdio }).toString().replace(reg, "");
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
    error(`  ${green2(fuelUpLink)}`);
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
  const cliTable = new CliTable({
    head: ["", bold("Supported"), bold(`Yours / System`)]
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
    error(`  ${green3(fuelUpLink)}`);
    error(cliTable.toString());
    process.exit(1);
  }
}
export {
  compareSystemVersions,
  fuelUpLink,
  getSystemForc,
  getSystemFuelCore,
  getSystemVersions,
  runVersions
};
//# sourceMappingURL=cli.mjs.map