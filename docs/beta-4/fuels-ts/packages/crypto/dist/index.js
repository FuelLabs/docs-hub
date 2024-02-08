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
  bufferFromString: () => bufferFromString2,
  decrypt: () => decrypt2,
  decryptJsonWalletData: () => decryptJsonWalletData2,
  encrypt: () => encrypt2,
  encryptJsonWalletData: () => encryptJsonWalletData2,
  keccak256: () => keccak2562,
  keyFromPassword: () => keyFromPassword2,
  randomBytes: () => randomBytes2,
  scrypt: () => scrypt2,
  stringFromBuffer: () => stringFromBuffer2
});
module.exports = __toCommonJS(src_exports);

// src/shared/scrypt.ts
var import_scrypt = require("ethereum-cryptography/scrypt");
var scrypt = (params) => {
  const { password, salt, n, p, r, dklen } = params;
  const derivedKey = (0, import_scrypt.scryptSync)(password, salt, n, r, p, dklen);
  return derivedKey;
};

// src/shared/keccak256.ts
var import_keccak = require("ethereum-cryptography/keccak");
var keccak256 = (data) => (0, import_keccak.keccak256)(data);

// src/node/aes-ctr.ts
var import_errors = require("@fuel-ts/errors");
var import_crypto2 = __toESM(require("crypto"));
var import_ethers = require("ethers");

// src/node/bufferFromString.ts
var bufferFromString = (string, encoding = "base64") => Uint8Array.from(Buffer.from(string, encoding));

// src/node/randomBytes.ts
var import_crypto = __toESM(require("crypto"));
var randomBytes = (length) => {
  const randomValues = Uint8Array.from(import_crypto.default.randomBytes(length));
  return randomValues;
};

// src/node/stringFromBuffer.ts
var stringFromBuffer = (buffer, encoding = "base64") => Buffer.from(buffer).toString(encoding);

// src/node/aes-ctr.ts
var ALGORITHM = "aes-256-ctr";
var keyFromPassword = (password, saltBuffer) => {
  const passBuffer = bufferFromString(String(password).normalize("NFKC"), "utf-8");
  const key = (0, import_ethers.pbkdf2)(passBuffer, saltBuffer, 1e5, 32, "sha256");
  return (0, import_ethers.getBytesCopy)(key);
};
var encrypt = async (password, data) => {
  const iv = randomBytes(16);
  const salt = randomBytes(32);
  const secret = keyFromPassword(password, salt);
  const dataBuffer = Uint8Array.from(Buffer.from(JSON.stringify(data), "utf-8"));
  const cipher = await import_crypto2.default.createCipheriv(ALGORITHM, secret, iv);
  let cipherData = cipher.update(dataBuffer);
  cipherData = Buffer.concat([cipherData, cipher.final()]);
  return {
    data: stringFromBuffer(cipherData),
    iv: stringFromBuffer(iv),
    salt: stringFromBuffer(salt)
  };
};
var decrypt = async (password, keystore) => {
  const iv = bufferFromString(keystore.iv);
  const salt = bufferFromString(keystore.salt);
  const secret = keyFromPassword(password, salt);
  const encryptedText = bufferFromString(keystore.data);
  const decipher = await import_crypto2.default.createDecipheriv(ALGORITHM, secret, iv);
  const decrypted = decipher.update(encryptedText);
  const deBuff = Buffer.concat([decrypted, decipher.final()]);
  const decryptedData = Buffer.from(deBuff).toString("utf-8");
  try {
    return JSON.parse(decryptedData);
  } catch {
    throw new import_errors.FuelError(import_errors.ErrorCode.INVALID_CREDENTIALS, "Invalid credentials.");
  }
};

// src/node/encryptJsonWalletData.ts
var import_crypto3 = __toESM(require("crypto"));
async function encryptJsonWalletData(data, key, iv) {
  const cipher = await import_crypto3.default.createCipheriv("aes-128-ctr", key.subarray(0, 16), iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return new Uint8Array(encrypted);
}
async function decryptJsonWalletData(data, key, iv) {
  const decipher = import_crypto3.default.createDecipheriv("aes-128-ctr", key.subarray(0, 16), iv);
  const decrypted = await Buffer.concat([decipher.update(data), decipher.final()]);
  return new Uint8Array(decrypted);
}

// src/node/index.ts
var api = {
  bufferFromString,
  stringFromBuffer,
  decrypt,
  encrypt,
  keyFromPassword,
  randomBytes,
  scrypt,
  keccak256,
  decryptJsonWalletData,
  encryptJsonWalletData
};
var node_default = api;

// src/index.ts
var {
  bufferFromString: bufferFromString2,
  decrypt: decrypt2,
  encrypt: encrypt2,
  keyFromPassword: keyFromPassword2,
  randomBytes: randomBytes2,
  stringFromBuffer: stringFromBuffer2,
  scrypt: scrypt2,
  keccak256: keccak2562,
  decryptJsonWalletData: decryptJsonWalletData2,
  encryptJsonWalletData: encryptJsonWalletData2
} = node_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bufferFromString,
  decrypt,
  decryptJsonWalletData,
  encrypt,
  encryptJsonWalletData,
  keccak256,
  keyFromPassword,
  randomBytes,
  scrypt,
  stringFromBuffer
});
//# sourceMappingURL=index.js.map