"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVersions = exports.getVersions = exports.getNodeVersion = exports.getFullFuelCoreVersion = exports.getFuelCoreVersion = exports.getRustSDKVersion = void 0;
var fs = require("fs");
var path_1 = require("path");
var toml = require("toml");
var constants_1 = require("../config/constants");
function itemFromPackageJson(docsDir, filename) {
    var file = fs.readFileSync((0, path_1.join)(docsDir, filename), "utf-8");
    var json = JSON.parse(file);
    return json;
}
function getWalletVersion(docsDir) {
    var json = itemFromPackageJson(docsDir, "fuels-wallet/packages/sdk/package.json");
    return {
        name: "fuels-wallet",
        version: json.version,
        category: "Wallet",
        url: "https://github.com/FuelLabs/fuels-wallet/tree/v".concat(json.version),
    };
}
function getTSSDKVersion(docsDir) {
    var json = itemFromPackageJson(docsDir, "fuels-ts/packages/fuels/package.json");
    return {
        name: "fuels-ts",
        version: json.version,
        category: "TypeScript SDK",
        url: "https://github.com/FuelLabs/fuels-ts/tree/v".concat(json.version),
    };
}
function getRustSDKVersion(docsDir) {
    var filedir = (0, path_1.join)(docsDir, "fuels-rs/Cargo.toml");
    var file = fs.readFileSync(filedir, "utf-8");
    var tomfile = toml.parse(file);
    return {
        name: "fuels-rs",
        category: "Rust SDK",
        version: tomfile.workspace.package.version,
        url: "https://github.com/FuelLabs/fuels-rs/tree/v".concat(tomfile.workspace.package.version),
    };
}
exports.getRustSDKVersion = getRustSDKVersion;
function getForcVersion(docsDir) {
    var _a;
    var swayfile = (0, path_1.join)(docsDir, "sway/Cargo.toml");
    var file = fs.readFileSync(swayfile, "utf-8");
    var swaitomfile = toml.parse(file);
    var forcfiledir = (0, path_1.join)(docsDir, "sway/forc-pkg/Cargo.toml");
    var forcfile = fs.readFileSync(forcfiledir, "utf-8");
    var version = (_a = forcfile === null || forcfile === void 0 ? void 0 : forcfile.match(/version = "(.*)"/)) === null || _a === void 0 ? void 0 : _a[1];
    return {
        name: "forc",
        category: "Forc",
        version: version,
        url: "https://github.com/FuelLabs/sway/tree/v".concat(version),
    };
}
function getFuelCoreVersion() {
    var filedir = (0, path_1.join)(constants_1.DOCS_DIRECTORY, "fuel-core/Cargo.toml");
    var file = fs.readFileSync(filedir, "utf-8");
    var tomfile = toml.parse(file);
    return tomfile.workspace.package.version;
}
exports.getFuelCoreVersion = getFuelCoreVersion;
function getFullFuelCoreVersion(versionSet) {
    if (versionSet === "beta-4") {
        return {
            name: "fuel-graphql-docs",
            category: "GraphQL API",
            version: "0.20.5",
            url: "https://github.com/FuelLabs/fuel-core/tree/v0.20.5",
        };
    }
    var filedir = (0, path_1.join)(constants_1.DOCS_DIRECTORY, "fuel-core/Cargo.toml");
    var file = fs.readFileSync(filedir, "utf-8");
    var tomfile = toml.parse(file);
    return {
        name: "fuel-graphql-docs",
        category: "GraphQL API",
        version: tomfile.workspace.package.version,
        url: "https://github.com/FuelLabs/fuel-core/tree/v".concat(tomfile.workspace.package.version),
    };
}
exports.getFullFuelCoreVersion = getFullFuelCoreVersion;
// returns the version of the node required by fuels-ts
function getNodeVersion() {
    var filedir = (0, path_1.join)(constants_1.DOCS_DIRECTORY, "fuels-ts/packages/fuels/package.json");
    var file = fs.readFileSync(filedir, "utf-8");
    var json = JSON.parse(file);
    return json.engines.node;
}
exports.getNodeVersion = getNodeVersion;
function getVersions(versionSet) {
    var docsDir = constants_1.DOCS_DIRECTORY;
    if (versionSet === "nightly") {
        docsDir = constants_1.NIGHTLY_DOCS_DIRECTORY;
    }
    else if (versionSet === "beta-4") {
        docsDir = constants_1.BETA_4_DOCS_DIRECTORY;
    }
    var wallet = getWalletVersion(docsDir);
    var tsSDK = getTSSDKVersion(docsDir);
    var rust = getRustSDKVersion(docsDir);
    var forc = getForcVersion(docsDir);
    var fuelCore = getFullFuelCoreVersion(versionSet);
    return {
        Forc: forc,
        Sway: forc,
        "Fuel Rust SDK": rust,
        "Fuel TS SDK": tsSDK,
        "Fuel Wallet": wallet,
        "GraphQL API": fuelCore,
    };
}
exports.getVersions = getVersions;
function getAllVersions() {
    var versions = getVersions("default");
    var nightlyVersions = getVersions("nightly");
    var beta4Versions = getVersions("beta-4");
    return { versions: versions, nightlyVersions: nightlyVersions, beta4Versions: beta4Versions };
}
exports.getAllVersions = getAllVersions;
// gets the correct url tag for github links
function getDocVersion(link, versionSet) {
    var versions = getVersions(versionSet);
    if (link.includes("/fuels-ts/")) {
        return "v".concat(versions["Fuel TS SDK"].version);
    }
    if (link.includes("/fuels-rs/")) {
        return "v".concat(versions["Fuel Rust SDK"].version);
    }
    if (link.includes("/sway/")) {
        return "v".concat(versions.Sway.version);
    }
    if (link.includes("/fuels-wallet/")) {
        return "v".concat(versions["Fuel Wallet"].version);
    }
    return "master";
}
exports.default = getDocVersion;
