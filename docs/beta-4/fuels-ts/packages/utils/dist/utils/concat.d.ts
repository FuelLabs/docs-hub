import type { BytesLike } from 'ethers';
/**
 * Concatenates multiple Uint8Arrays into a single Uint8Array.
 *
 * @param arrays - The arrays to concatenate.
 * @returns - The concatenated array.
 */
export declare const concatBytes: (arrays: ReadonlyArray<Uint8Array> | ReadonlyArray<number[]>) => Uint8Array;
/**
 * Concatenates multiple BytesLike into a single Uint8Array.
 *
 * @param arrays - The arrays to concatenate.
 * @returns - The concatenated array.
 */
export declare const concat: (arrays: ReadonlyArray<BytesLike>) => Uint8Array;
//# sourceMappingURL=concat.d.ts.map