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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  MNEMONIC_SIZES: () => MNEMONIC_SIZES,
  Mnemonic: () => mnemonic_default
});
module.exports = __toCommonJS(src_exports);

// src/mnemonic.ts
var import_crypto = require("@fuel-ts/crypto");
var import_errors2 = require("@fuel-ts/errors");
var import_wordlists = require("@fuel-ts/wordlists");
var import_ethers2 = require("ethers");

// src/utils.ts
var import_errors = require("@fuel-ts/errors");
var import_ethers = require("ethers");
function toUtf8Bytes(stri) {
  const str = stri.normalize("NFKD");
  const result = [];
  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    if (c < 128) {
      result.push(c);
    } else if (c < 2048) {
      result.push(c >> 6 | 192);
      result.push(c & 63 | 128);
    } else if ((c & 64512) === 55296) {
      i += 1;
      const c2 = str.charCodeAt(i);
      if (i >= str.length || (c2 & 64512) !== 56320) {
        throw new import_errors.FuelError(
          import_errors.ErrorCode.INVALID_INPUT_PARAMETERS,
          "Invalid UTF-8 in the input string."
        );
      }
      const pair = 65536 + ((c & 1023) << 10) + (c2 & 1023);
      result.push(pair >> 18 | 240);
      result.push(pair >> 12 & 63 | 128);
      result.push(pair >> 6 & 63 | 128);
      result.push(pair & 63 | 128);
    } else {
      result.push(c >> 12 | 224);
      result.push(c >> 6 & 63 | 128);
      result.push(c & 63 | 128);
    }
  }
  return Uint8Array.from(result);
}
function getLowerMask(bits) {
  return (1 << bits) - 1;
}
function getUpperMask(bits) {
  return (1 << bits) - 1 << 8 - bits;
}
function getWords(mnemonic) {
  if (!Array.isArray(mnemonic)) {
    return mnemonic.split(/\s+/);
  }
  return mnemonic;
}
function getPhrase(mnemonic) {
  if (Array.isArray(mnemonic)) {
    return mnemonic.join(" ");
  }
  return mnemonic;
}
function entropyToMnemonicIndices(entropy) {
  const indices = [0];
  let remainingBits = 11;
  for (let i = 0; i < entropy.length; i += 1) {
    if (remainingBits > 8) {
      indices[indices.length - 1] <<= 8;
      indices[indices.length - 1] |= entropy[i];
      remainingBits -= 8;
    } else {
      indices[indices.length - 1] <<= remainingBits;
      indices[indices.length - 1] |= entropy[i] >> 8 - remainingBits;
      indices.push(entropy[i] & getLowerMask(8 - remainingBits));
      remainingBits += 3;
    }
  }
  const checksumBits = entropy.length / 4;
  const checksum = (0, import_ethers.getBytesCopy)((0, import_ethers.sha256)(entropy))[0] & getUpperMask(checksumBits);
  indices[indices.length - 1] <<= checksumBits;
  indices[indices.length - 1] |= checksum >> 8 - checksumBits;
  return indices;
}
function mnemonicWordsToEntropy(words, wordlist) {
  const size = Math.ceil(11 * words.length / 8);
  const entropy = (0, import_ethers.getBytesCopy)(new Uint8Array(size));
  let offset = 0;
  for (let i = 0; i < words.length; i += 1) {
    const index = wordlist.indexOf(words[i].normalize("NFKD"));
    if (index === -1) {
      throw new import_errors.FuelError(
        import_errors.ErrorCode.INVALID_MNEMONIC,
        `Invalid mnemonic: the word '${words[i]}' is not found in the provided wordlist.`
      );
    }
    for (let bit = 0; bit < 11; bit += 1) {
      if (index & 1 << 10 - bit) {
        entropy[offset >> 3] |= 1 << 7 - offset % 8;
      }
      offset += 1;
    }
  }
  const entropyBits = 32 * words.length / 3;
  const checksumBits = words.length / 3;
  const checksumMask = getUpperMask(checksumBits);
  const checksum = (0, import_ethers.getBytesCopy)((0, import_ethers.sha256)(entropy.slice(0, entropyBits / 8)))[0] & checksumMask;
  if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
    throw new import_errors.FuelError(
      import_errors.ErrorCode.INVALID_CHECKSUM,
      "Checksum validation failed for the provided mnemonic."
    );
  }
  return entropy.slice(0, entropyBits / 8);
}

// src/mnemonic.ts
var MasterSecret = toUtf8Bytes("Bitcoin seed");
var MainnetPRV = "0x0488ade4";
var TestnetPRV = "0x04358394";
var MNEMONIC_SIZES = [12, 15, 18, 21, 24];
function assertWordList(wordlist) {
  if (wordlist.length !== 2048) {
    throw new import_errors2.FuelError(
      import_errors2.ErrorCode.INVALID_WORD_LIST,
      `Expected word list length of 2048, but got ${wordlist.length}.`
    );
  }
}
function assertEntropy(entropy) {
  if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
    throw new import_errors2.FuelError(
      import_errors2.ErrorCode.INVALID_ENTROPY,
      `Entropy should be between 16 and 32 bytes and a multiple of 4, but got ${entropy.length} bytes.`
    );
  }
}
function assertMnemonic(words) {
  if (!MNEMONIC_SIZES.includes(words.length)) {
    const errorMsg = `Invalid mnemonic size. Expected one of [${MNEMONIC_SIZES.join(
      ", "
    )}] words, but got ${words.length}.`;
    throw new import_errors2.FuelError(import_errors2.ErrorCode.INVALID_MNEMONIC, errorMsg);
  }
}
var Mnemonic = class {
  wordlist;
  /**
   *
   * @param wordlist - Provide a wordlist with the list of words used to generate the mnemonic phrase. The default value is the English list.
   * @returns Mnemonic instance
   */
  constructor(wordlist = import_wordlists.english) {
    this.wordlist = wordlist;
    assertWordList(this.wordlist);
  }
  /**
   *
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @returns Entropy hash
   */
  mnemonicToEntropy(phrase) {
    return Mnemonic.mnemonicToEntropy(phrase, this.wordlist);
  }
  /**
   *
   * @param entropy - Entropy source to the mnemonic phrase.
   * @returns Mnemonic phrase
   */
  entropyToMnemonic(entropy) {
    return Mnemonic.entropyToMnemonic(entropy, this.wordlist);
  }
  /**
   *
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @param wordlist - Provide a wordlist with the list of words used to generate the mnemonic phrase. The default value is the English list.
   * @returns Mnemonic phrase
   */
  static mnemonicToEntropy(phrase, wordlist = import_wordlists.english) {
    const words = getWords(phrase);
    assertMnemonic(words);
    return (0, import_ethers2.hexlify)(mnemonicWordsToEntropy(words, wordlist));
  }
  /**
   * @param entropy - Entropy source to the mnemonic phrase.
   * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static entropyToMnemonic(entropy, wordlist = import_wordlists.english) {
    const entropyBytes = (0, import_ethers2.getBytesCopy)(entropy);
    assertWordList(wordlist);
    assertEntropy(entropyBytes);
    return entropyToMnemonicIndices(entropyBytes).map((i) => wordlist[i]).join(" ");
  }
  /**
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @param passphrase - Add additional security to protect the generated seed with a memorized passphrase. `Note: if the owner forgot the passphrase, all wallets and accounts derive from the phrase will be lost.`
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static mnemonicToSeed(phrase, passphrase = "") {
    assertMnemonic(getWords(phrase));
    const phraseBytes = toUtf8Bytes(getPhrase(phrase));
    const salt = toUtf8Bytes(`mnemonic${passphrase}`);
    return (0, import_ethers2.pbkdf2)(phraseBytes, salt, 2048, 64, "sha512");
  }
  /**
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @param passphrase - Add additional security to protect the generated seed with a memorized passphrase. `Note: if the owner forgot the passphrase, all wallets and accounts derive from the phrase will be lost.`
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static mnemonicToMasterKeys(phrase, passphrase = "") {
    const seed = Mnemonic.mnemonicToSeed(phrase, passphrase);
    return Mnemonic.masterKeysFromSeed(seed);
  }
  /**
   * Validates if given mnemonic is  valid
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @returns true if phrase is a valid mnemonic
   */
  static isMnemonicValid(phrase) {
    const words = getWords(phrase);
    let i = 0;
    try {
      assertMnemonic(words);
    } catch {
      return false;
    }
    while (i < words.length) {
      if (Mnemonic.binarySearch(words[i]) === false) {
        return false;
      }
      i += 1;
    }
    return true;
  }
  static binarySearch(target) {
    const words = import_wordlists.english;
    let left = 0;
    let right = words.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (words[mid] === target) {
        return true;
      }
      if (target < words[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return false;
  }
  /**
   * @param seed - BIP39 seed
   * @param testnet - Inform if should use testnet or mainnet prefix, the default value is true (`mainnet`).
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static masterKeysFromSeed(seed) {
    const seedArray = (0, import_ethers2.getBytesCopy)(seed);
    if (seedArray.length < 16 || seedArray.length > 64) {
      throw new import_errors2.FuelError(
        import_errors2.ErrorCode.INVALID_SEED,
        `Seed length should be between 16 and 64 bytes, but received ${seedArray.length} bytes.`
      );
    }
    return (0, import_ethers2.getBytesCopy)((0, import_ethers2.computeHmac)("sha512", MasterSecret, seedArray));
  }
  /**
   * Get the extendKey as defined on BIP-32 from the provided seed
   *
   * @param seed - BIP39 seed
   * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
   * @returns BIP-32 extended private key
   */
  static seedToExtendedKey(seed, testnet = false) {
    const masterKey = Mnemonic.masterKeysFromSeed(seed);
    const prefix = (0, import_ethers2.getBytesCopy)(testnet ? TestnetPRV : MainnetPRV);
    const depth = "0x00";
    const fingerprint = "0x00000000";
    const index = "0x00000000";
    const chainCode = masterKey.slice(32);
    const privateKey = masterKey.slice(0, 32);
    const extendedKey = (0, import_ethers2.concat)([
      prefix,
      depth,
      fingerprint,
      index,
      chainCode,
      (0, import_ethers2.concat)(["0x00", privateKey])
    ]);
    const checksum = (0, import_ethers2.dataSlice)((0, import_ethers2.sha256)((0, import_ethers2.sha256)(extendedKey)), 0, 4);
    return (0, import_ethers2.encodeBase58)((0, import_ethers2.concat)([extendedKey, checksum]));
  }
  /**
   *  Create a new mnemonic using a randomly generated number as entropy.
   *  As defined in BIP39, the entropy must be a multiple of 32 bits, and its size must be between 128 and 256 bits.
   *  Therefore, the possible values for `strength` are 128, 160, 192, 224, and 256.
   *  If not provided, the default entropy length will be set to 256 bits.
   *  The return is a list of words that encodes the generated entropy.
   *
   *
   * @param size - Number of bytes used as an entropy
   * @param extraEntropy - Optional extra entropy to increase randomness
   * @returns A randomly generated mnemonic
   */
  static generate(size = 32, extraEntropy = "") {
    const entropy = extraEntropy ? (0, import_ethers2.sha256)((0, import_ethers2.concat)([(0, import_crypto.randomBytes)(size), (0, import_ethers2.getBytesCopy)(extraEntropy)])) : (0, import_crypto.randomBytes)(size);
    return Mnemonic.entropyToMnemonic(entropy);
  }
};
var mnemonic_default = Mnemonic;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MNEMONIC_SIZES,
  Mnemonic
});
//# sourceMappingURL=index.js.map