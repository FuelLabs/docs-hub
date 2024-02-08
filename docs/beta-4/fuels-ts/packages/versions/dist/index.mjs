// src/lib/getBuiltinVersions.ts
function getBuiltinVersions() {
  return {
    FORC: "0.46.1",
    FUEL_CORE: "0.20.8",
    FUELS: "0.69.1"
  };
}

// src/lib/checkFuelCoreVersionCompatibility.ts
import semver from "semver";
function checkFuelCoreVersionCompatibility(networkVersion) {
  const { FUEL_CORE: supportedVersion } = getBuiltinVersions();
  const networkMajor = semver.major(networkVersion);
  const networkMinor = semver.minor(networkVersion);
  const networkPatch = semver.patch(networkVersion);
  const supportedMajor = semver.major(supportedVersion);
  const supportedMinor = semver.minor(supportedVersion);
  const supportedPatch = semver.patch(supportedVersion);
  return {
    supportedVersion,
    isMajorSupported: networkMajor === supportedMajor,
    isMinorSupported: networkMinor === supportedMinor,
    isPatchSupported: networkPatch === supportedPatch
  };
}

// src/index.ts
var versions = getBuiltinVersions();
export {
  checkFuelCoreVersionCompatibility,
  versions
};
//# sourceMappingURL=index.mjs.map