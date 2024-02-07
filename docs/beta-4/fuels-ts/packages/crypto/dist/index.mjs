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

// src/node/aes-ctr.ts
import { FuelError, ErrorCode } from "@fuel-ts/errors";
import crypto2 from "crypto";
import { getBytesCopy, pbkdf2 } from "ethers";

// src/node/bufferFromString.ts
var bufferFromString = (string, encoding = "base64") => Uint8Array.from(Buffer.from(string, encoding));

// src/node/randomBytes.ts
import crypto from "crypto";
var randomBytes = (length) => {
  const randomValues = Uint8Array.from(crypto.randomBytes(length));
  return randomValues;
};

// src/node/stringFromBuffer.ts
var stringFromBuffer = (buffer, encoding = "base64") => Buffer.from(buffer).toString(encoding);

// src/node/aes-ctr.ts
var ALGORITHM = "aes-256-ctr";
var keyFromPassword = (password, saltBuffer) => {
  const passBuffer = bufferFromString(String(password).normalize("NFKC"), "utf-8");
  const key = pbkdf2(passBuffer, saltBuffer, 1e5, 32, "sha256");
  return getBytesCopy(key);
};
var encrypt = async (password, data) => {
  const iv = randomBytes(16);
  const salt = randomBytes(32);
  const secret = keyFromPassword(password, salt);
  const dataBuffer = Uint8Array.from(Buffer.from(JSON.stringify(data), "utf-8"));
  const cipher = await crypto2.createCipheriv(ALGORITHM, secret, iv);
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
  const decipher = await crypto2.createDecipheriv(ALGORITHM, secret, iv);
  const decrypted = decipher.update(encryptedText);
  const deBuff = Buffer.concat([decrypted, decipher.final()]);
  const decryptedData = Buffer.from(deBuff).toString("utf-8");
  try {
    return JSON.parse(decryptedData);
  } catch {
    throw new FuelError(ErrorCode.INVALID_CREDENTIALS, "Invalid credentials.");
  }
};

// src/node/encryptJsonWalletData.ts
import crypto3 from "crypto";
async function encryptJsonWalletData(data, key, iv) {
  const cipher = await crypto3.createCipheriv("aes-128-ctr", key.subarray(0, 16), iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return new Uint8Array(encrypted);
}
async function decryptJsonWalletData(data, key, iv) {
  const decipher = crypto3.createDecipheriv("aes-128-ctr", key.subarray(0, 16), iv);
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
//# sourceMappingURL=index.mjs.map