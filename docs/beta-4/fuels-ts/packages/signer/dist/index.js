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
  Signer: () => signer_default,
  getCurve: () => getCurve
});
module.exports = __toCommonJS(src_exports);

// src/signer.ts
var import_address = require("@fuel-ts/address");
var import_crypto = require("@fuel-ts/crypto");
var import_hasher = require("@fuel-ts/hasher");
var import_math = require("@fuel-ts/math");
var elliptic = __toESM(require("elliptic"));
var import_ethers = require("ethers");
var { ec: EC } = elliptic;
function getCurve() {
  return new EC("secp256k1");
}
var Signer = class {
  address;
  publicKey;
  compressedPublicKey;
  privateKey;
  /**
   * Create a Signer instance from a given private key
   *
   * @param privateKey - The private key to use for signing
   * @returns A new Signer instance
   */
  constructor(privateKey) {
    if (typeof privateKey === "string") {
      if (privateKey.match(/^[0-9a-f]*$/i) && privateKey.length === 64) {
        privateKey = `0x${privateKey}`;
      }
    }
    const privateKeyBytes = (0, import_ethers.getBytesCopy)(privateKey);
    const keyPair = getCurve().keyFromPrivate(privateKeyBytes, "hex");
    this.compressedPublicKey = (0, import_ethers.hexlify)(Uint8Array.from(keyPair.getPublic(true, "array")));
    this.publicKey = (0, import_ethers.hexlify)(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
    this.privateKey = (0, import_ethers.hexlify)(privateKeyBytes);
    this.address = import_address.Address.fromPublicKey(this.publicKey);
  }
  /**
   * Sign data using the Signer instance
   *
   * Signature is a 64 byte array of the concatenated r and s values with the compressed recoveryParam byte. [Read more](FuelLabs/fuel-specs/specs/protocol/cryptographic_primitives.md#public-key-cryptography)
   *
   * @param data - The data to be sign
   * @returns hashed signature
   */
  sign(data) {
    const keyPair = getCurve().keyFromPrivate((0, import_ethers.getBytesCopy)(this.privateKey), "hex");
    const signature = keyPair.sign((0, import_ethers.getBytesCopy)(data), {
      canonical: true
    });
    const r = (0, import_math.toBytes)(signature.r, 32);
    const s = (0, import_math.toBytes)(signature.s, 32);
    s[0] |= (signature.recoveryParam || 0) << 7;
    return (0, import_ethers.concat)([r, s]);
  }
  /**
   * Add point on the current elliptic curve
   *
   * @param point - Point to add on the curve
   * @returns compressed point on the curve
   */
  addPoint(point) {
    const p0 = getCurve().keyFromPublic((0, import_ethers.getBytesCopy)(this.compressedPublicKey));
    const p1 = getCurve().keyFromPublic((0, import_ethers.getBytesCopy)(point));
    const result = p0.getPublic().add(p1.getPublic());
    return (0, import_ethers.hexlify)(Uint8Array.from(result.encode("array", true)));
  }
  /**
   * Recover the public key from a signature performed with [`sign`](#sign).
   *
   * @param data - Data
   * @param signature - hashed signature
   * @returns public key from signature from the
   */
  static recoverPublicKey(data, signature) {
    const signedMessageBytes = (0, import_ethers.getBytesCopy)(signature);
    const r = signedMessageBytes.slice(0, 32);
    const s = signedMessageBytes.slice(32, 64);
    const recoveryParam = (s[0] & 128) >> 7;
    s[0] &= 127;
    const publicKey = getCurve().recoverPubKey((0, import_ethers.getBytesCopy)(data), { r, s }, recoveryParam).encode("array", false).slice(1);
    return (0, import_ethers.hexlify)(Uint8Array.from(publicKey));
  }
  /**
   * Recover the address from a signature performed with [`sign`](#sign).
   *
   * @param data - Data
   * @param signature - Signature
   * @returns Address from signature
   */
  static recoverAddress(data, signature) {
    return import_address.Address.fromPublicKey(Signer.recoverPublicKey(data, signature));
  }
  /**
   * Generate a random privateKey
   *
   * @param entropy - Adds extra entropy to generate the privateKey
   * @returns random 32-byte hashed
   */
  static generatePrivateKey(entropy) {
    return entropy ? (0, import_hasher.hash)((0, import_ethers.concat)([(0, import_crypto.randomBytes)(32), (0, import_ethers.getBytesCopy)(entropy)])) : (0, import_crypto.randomBytes)(32);
  }
  /**
   * Extended publicKey from a compact publicKey
   *
   * @param publicKey - Compact publicKey
   * @returns extended publicKey
   */
  static extendPublicKey(publicKey) {
    const keyPair = getCurve().keyFromPublic((0, import_ethers.getBytesCopy)(publicKey));
    return (0, import_ethers.hexlify)(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
  }
};
var signer_default = Signer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Signer,
  getCurve
});
//# sourceMappingURL=index.js.map