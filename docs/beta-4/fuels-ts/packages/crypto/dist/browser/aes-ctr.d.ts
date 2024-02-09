import type { CryptoApi } from '../types';
/**
 * Generate a pbkdf2 key from a password and random salt
 */
export declare const keyFromPassword: CryptoApi['keyFromPassword'];
/**
 * Encrypts a data object that can be any serializable value using
 * a provided password.
 *
 * @returns Promise<Keystore> object
 */
export declare const encrypt: CryptoApi['encrypt'];
/**
 * Given a password and a keystore object, decrypts the text and returns
 * the resulting value
 */
export declare const decrypt: CryptoApi['decrypt'];
//# sourceMappingURL=aes-ctr.d.ts.map