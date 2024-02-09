import { Address } from '@fuel-ts/address';
import * as elliptic from 'elliptic';
import type { BytesLike } from 'ethers';
/**
 * Return elliptic instance with curve secp256k1
 */
export declare function getCurve(): elliptic.ec;
declare class Signer {
    readonly address: Address;
    readonly publicKey: string;
    readonly compressedPublicKey: string;
    readonly privateKey: string;
    /**
     * Create a Signer instance from a given private key
     *
     * @param privateKey - The private key to use for signing
     * @returns A new Signer instance
     */
    constructor(privateKey: BytesLike);
    /**
     * Sign data using the Signer instance
     *
     * Signature is a 64 byte array of the concatenated r and s values with the compressed recoveryParam byte. [Read more](FuelLabs/fuel-specs/specs/protocol/cryptographic_primitives.md#public-key-cryptography)
     *
     * @param data - The data to be sign
     * @returns hashed signature
     */
    sign(data: BytesLike): string;
    /**
     * Add point on the current elliptic curve
     *
     * @param point - Point to add on the curve
     * @returns compressed point on the curve
     */
    addPoint(point: BytesLike): string;
    /**
     * Recover the public key from a signature performed with [`sign`](#sign).
     *
     * @param data - Data
     * @param signature - hashed signature
     * @returns public key from signature from the
     */
    static recoverPublicKey(data: BytesLike, signature: BytesLike): string;
    /**
     * Recover the address from a signature performed with [`sign`](#sign).
     *
     * @param data - Data
     * @param signature - Signature
     * @returns Address from signature
     */
    static recoverAddress(data: BytesLike, signature: BytesLike): Address;
    /**
     * Generate a random privateKey
     *
     * @param entropy - Adds extra entropy to generate the privateKey
     * @returns random 32-byte hashed
     */
    static generatePrivateKey(entropy?: BytesLike): string | Uint8Array;
    /**
     * Extended publicKey from a compact publicKey
     *
     * @param publicKey - Compact publicKey
     * @returns extended publicKey
     */
    static extendPublicKey(publicKey: BytesLike): string;
}
export default Signer;
//# sourceMappingURL=signer.d.ts.map