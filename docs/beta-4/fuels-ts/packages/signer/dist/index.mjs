// src/signer.ts
import { Address } from "@fuel-ts/address";
import { randomBytes } from "@fuel-ts/crypto";
import { hash } from "@fuel-ts/hasher";
import { toBytes } from "@fuel-ts/math";
import * as elliptic from "elliptic";
import { hexlify, concat, getBytesCopy } from "ethers";
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
    const privateKeyBytes = getBytesCopy(privateKey);
    const keyPair = getCurve().keyFromPrivate(privateKeyBytes, "hex");
    this.compressedPublicKey = hexlify(Uint8Array.from(keyPair.getPublic(true, "array")));
    this.publicKey = hexlify(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
    this.privateKey = hexlify(privateKeyBytes);
    this.address = Address.fromPublicKey(this.publicKey);
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
    const keyPair = getCurve().keyFromPrivate(getBytesCopy(this.privateKey), "hex");
    const signature = keyPair.sign(getBytesCopy(data), {
      canonical: true
    });
    const r = toBytes(signature.r, 32);
    const s = toBytes(signature.s, 32);
    s[0] |= (signature.recoveryParam || 0) << 7;
    return concat([r, s]);
  }
  /**
   * Add point on the current elliptic curve
   *
   * @param point - Point to add on the curve
   * @returns compressed point on the curve
   */
  addPoint(point) {
    const p0 = getCurve().keyFromPublic(getBytesCopy(this.compressedPublicKey));
    const p1 = getCurve().keyFromPublic(getBytesCopy(point));
    const result = p0.getPublic().add(p1.getPublic());
    return hexlify(Uint8Array.from(result.encode("array", true)));
  }
  /**
   * Recover the public key from a signature performed with [`sign`](#sign).
   *
   * @param data - Data
   * @param signature - hashed signature
   * @returns public key from signature from the
   */
  static recoverPublicKey(data, signature) {
    const signedMessageBytes = getBytesCopy(signature);
    const r = signedMessageBytes.slice(0, 32);
    const s = signedMessageBytes.slice(32, 64);
    const recoveryParam = (s[0] & 128) >> 7;
    s[0] &= 127;
    const publicKey = getCurve().recoverPubKey(getBytesCopy(data), { r, s }, recoveryParam).encode("array", false).slice(1);
    return hexlify(Uint8Array.from(publicKey));
  }
  /**
   * Recover the address from a signature performed with [`sign`](#sign).
   *
   * @param data - Data
   * @param signature - Signature
   * @returns Address from signature
   */
  static recoverAddress(data, signature) {
    return Address.fromPublicKey(Signer.recoverPublicKey(data, signature));
  }
  /**
   * Generate a random privateKey
   *
   * @param entropy - Adds extra entropy to generate the privateKey
   * @returns random 32-byte hashed
   */
  static generatePrivateKey(entropy) {
    return entropy ? hash(concat([randomBytes(32), getBytesCopy(entropy)])) : randomBytes(32);
  }
  /**
   * Extended publicKey from a compact publicKey
   *
   * @param publicKey - Compact publicKey
   * @returns extended publicKey
   */
  static extendPublicKey(publicKey) {
    const keyPair = getCurve().keyFromPublic(getBytesCopy(publicKey));
    return hexlify(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
  }
};
var signer_default = Signer;
export {
  signer_default as Signer,
  getCurve
};
//# sourceMappingURL=index.mjs.map