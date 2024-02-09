import type { BytesLike } from 'ethers';
export type MnemonicPhrase = string | Array<string>;
export declare function toUtf8Bytes(stri: string): Uint8Array;
export declare function getWords(mnemonic: MnemonicPhrase): Array<string>;
export declare function getPhrase(mnemonic: MnemonicPhrase): string;
export declare function entropyToMnemonicIndices(entropy: Uint8Array): Array<number>;
export declare function mnemonicWordsToEntropy(words: Array<string>, wordlist: Array<string>): BytesLike;
//# sourceMappingURL=utils.d.ts.map