// src/index.ts
import { Script } from "@fuel-ts/script";

// src/cli/utils/createConfig.ts
function createConfig(config) {
  return config;
}

// src/cli/types.ts
var Commands = /* @__PURE__ */ ((Commands2) => {
  Commands2["build"] = "build";
  Commands2["deploy"] = "deploy";
  Commands2["dev"] = "dev";
  Commands2["init"] = "init";
  return Commands2;
})(Commands || {});

// src/index.ts
export * from "@fuel-ts/abi-coder";
export * from "@fuel-ts/address";
export * from "@fuel-ts/address/configs";
export * from "@fuel-ts/contract";
export * from "@fuel-ts/crypto";
export * from "@fuel-ts/hasher";
export * from "@fuel-ts/interfaces";
export * from "@fuel-ts/math";
export * from "@fuel-ts/math/configs";
export * from "@fuel-ts/mnemonic";
export * from "@fuel-ts/predicate";
export * from "@fuel-ts/predicate";
export * from "@fuel-ts/program";
export * from "@fuel-ts/program/configs";
export * from "@fuel-ts/providers";
export * from "@fuel-ts/signer";
export * from "@fuel-ts/transactions";
export * from "@fuel-ts/utils";
export * from "@fuel-ts/wallet";
export * from "@fuel-ts/transactions/configs";
export * from "@fuel-ts/wallet";
export * from "@fuel-ts/wallet/configs";
export {
  Commands,
  Script,
  createConfig
};
//# sourceMappingURL=index.mjs.map