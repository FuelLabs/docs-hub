// src/shared/scrypt.ts
import { scryptSync as ethCryScrypt } from "ethereum-cryptography/scrypt";
var scrypt = (params) => {
  const { password, salt, n, p, r, dklen } = params;
  const derivedKey = ethCryScrypt(password, salt, n, r, p, dklen);
  return derivedKey;
};

// src/shared/keccak256.ts
import { keccak256 as keccak } from "ethereum-cryptography/keccak";
var keccak256 = (data) => keccak(data);

// src/browser/aes-ctr.ts
import { ErrorCode as ErrorCode2, FuelError as FuelError2 } from "@fuel-ts/errors";
import { getBytesCopy, pbkdf2 } from "ethers";

// src/browser/bufferFromString.ts
var bufferFromString = (string, encoding = "base64") => {
  switch (encoding) {
    case "utf-8": {
      return new TextEncoder().encode(string);
    }
    case "base64": {
      const binaryString = atob(string);
      const len = binaryString.length;
      const bytes = new Uint8Array(len).map((_, i) => binaryString.charCodeAt(i));
      return bytes;
    }
    case "hex":
    default: {
      const bufferLength = string.length / 2;
      const buffer = new Uint8Array(bufferLength).map((_, i) => {
        const startIndex = i * 2;
        const byteValue = parseInt(string.substring(startIndex, startIndex + 2), 16);
        return byteValue;
      });
      return buffer;
    }
  }
};

// src/browser/crypto.ts
import { ErrorCode, FuelError } from "@fuel-ts/errors";
var { crypto: crypto2, btoa } = globalThis;
if (!crypto2) {
  throw new FuelError(
    ErrorCode.ENV_DEPENDENCY_MISSING,
    `Could not find 'crypto' in current browser environment.`
  );
}
if (!btoa) {
  throw new FuelError(
    ErrorCode.ENV_DEPENDENCY_MISSING,
    `Could not find 'btoa' in current browser environment.`
  );
}

// src/browser/randomBytes.ts
var randomBytes = (length) => {
  const randomValues = crypto2.getRandomValues(new Uint8Array(length));
  return randomValues;
};

// src/browser/stringFromBuffer.ts
var stringFromBuffer = (buffer, encoding = "base64") => {
  switch (encoding) {
    case "utf-8": {
      return new TextDecoder().decode(buffer);
    }
    case "base64": {
      const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
      return btoa(binary);
    }
    case "hex":
    default: {
      let hexString = "";
      for (let i = 0; i < buffer.length; i += 1) {
        const hex = buffer[i].toString(16);
        hexString += hex.length === 1 ? `0${hex}` : hex;
      }
      return hexString;
    }
  }
};

// src/browser/aes-ctr.ts
var ALGORITHM = "AES-CTR";
var keyFromPassword = (password, saltBuffer) => {
  const passBuffer = bufferFromString(String(password).normalize("NFKC"), "utf-8");
  const key = pbkdf2(passBuffer, saltBuffer, 1e5, 32, "sha256");
  return getBytesCopy(key);
};
var encrypt = async (password, data) => {
  const iv = randomBytes(16);
  const salt = randomBytes(32);
  const secret = keyFromPassword(password, salt);
  const dataString = JSON.stringify(data);
  const dataBuffer = bufferFromString(dataString, "utf-8");
  const alg = {
    name: ALGORITHM,
    counter: iv,
    length: 64
  };
  const key = await crypto.subtle.importKey("raw", secret, alg, false, ["encrypt"]);
  const encBuffer = await crypto.subtle.encrypt(alg, key, dataBuffer);
  return {
    data: stringFromBuffer(encBuffer),
    iv: stringFromBuffer(iv),
    salt: stringFromBuffer(salt)
  };
};
var decrypt = async (password, keystore) => {
  const iv = bufferFromString(keystore.iv);
  const salt = bufferFromString(keystore.salt);
  const secret = keyFromPassword(password, salt);
  const encryptedText = bufferFromString(keystore.data);
  const alg = {
    name: ALGORITHM,
    counter: iv,
    length: 64
  };
  const key = await crypto.subtle.importKey("raw", secret, alg, false, ["decrypt"]);
  const ptBuffer = await crypto.subtle.decrypt(alg, key, encryptedText);
  const decryptedData = new TextDecoder().decode(ptBuffer);
  try {
    return JSON.parse(decryptedData);
  } catch {
    throw new FuelError2(ErrorCode2.INVALID_CREDENTIALS, "Invalid credentials.");
  }
};

// src/browser/encryptJsonWalletData.ts
var encryptJsonWalletData = async (data, key, iv) => {
  const subtle = crypto2.subtle;
  const keyBuffer = new Uint8Array(key.subarray(0, 16));
  const ivBuffer = iv;
  const dataBuffer = data;
  const cryptoKey = await subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CTR", length: 128 },
    false,
    ["encrypt", "decrypt"]
  );
  const encrypted = await subtle.encrypt(
    { name: "AES-CTR", counter: ivBuffer, length: 128 },
    cryptoKey,
    dataBuffer
  );
  return new Uint8Array(encrypted);
};
var decryptJsonWalletData = async (data, key, iv) => {
  const subtle = crypto2.subtle;
  const keyBuffer = new Uint8Array(key.subarray(0, 16)).buffer;
  const ivBuffer = new Uint8Array(iv).buffer;
  const dataBuffer = new Uint8Array(data).buffer;
  const cryptoKey = await subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CTR", length: 128 },
    false,
    ["encrypt", "decrypt"]
  );
  const decrypted = await subtle.decrypt(
    { name: "AES-CTR", counter: ivBuffer, length: 128 },
    cryptoKey,
    dataBuffer
  );
  return new Uint8Array(decrypted);
};

// src/browser/index.ts
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
var browser_default = api;

// src/index.browser.ts
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
} = browser_default;
export {
  bufferFromString2 as bufferFromString,
  decrypt2 as decrypt,
  decryptJsonWalletData2 as decryptJsonWalletData,
  encrypt2 as encrypt,
  encryptJsonWalletData2 as encryptJsonWalletData,
  keccak2562 as keccak256,
  keyFromPassword2 as keyFromPassword,
  randomBytes2 as randomBytes,
  scrypt2 as scrypt,
  stringFromBuffer2 as stringFromBuffer
};
//# sourceMappingURL=index.browser.mjs.map