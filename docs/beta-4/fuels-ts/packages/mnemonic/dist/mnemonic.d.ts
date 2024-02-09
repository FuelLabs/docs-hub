import type { BytesLike } from 'ethers';
import type { MnemonicPhrase } from './utils';
export declare const MNEMONIC_SIZES: number[];
declare class Mnemonic {
    wordlist: Array<string>;
    /**
     *
     * @param wordlist - Provide a wordlist with the list of words used to generate the mnemonic phrase. The default value is the English list.
     * @returns Mnemonic instance
     */
    constructor(wordlist?: Array<string>);
    /**
     *
     * @param phrase - Mnemonic phrase composed by words from the provided wordlist
     * @returns Entropy hash
     */
    mnemonicToEntropy(phrase: MnemonicPhrase): string;
    /**
     *
     * @param entropy - Entropy source to the mnemonic phrase.
     * @returns Mnemonic phrase
     */
    entropyToMnemonic(entropy: BytesLike): string;
    /**
     *
     * @param phrase - Mnemonic phrase composed by words from the provided wordlist
     * @param wordlist - Provide a wordlist with the list of words used to generate the mnemonic phrase. The default value is the English list.
     * @returns Mnemonic phrase
     */
    static mnemonicToEntropy(phrase: MnemonicPhrase, wordlist?: Array<string>): string;
    /**
     * @param entropy - Entropy source to the mnemonic phrase.
     * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
     * @returns 64-byte array contains privateKey and chainCode as described on BIP39
     */
    static entropyToMnemonic(entropy: BytesLike, wordlist?: Array<string>): string;
    /**
     * @param phrase - Mnemonic phrase composed by words from the provided wordlist
     * @param passphrase - Add additional security to protect the generated seed with a memorized passphrase. `Note: if the owner forgot the passphrase, all wallets and accounts derive from the phrase will be lost.`
     * @returns 64-byte array contains privateKey and chainCode as described on BIP39
     */
    static mnemonicToSeed(phrase: MnemonicPhrase, passphrase?: BytesLike): string;
    /**
     * @param phrase - Mnemonic phrase composed by words from the provided wordlist
     * @param passphrase - Add additional security to protect the generated seed with a memorized passphrase. `Note: if the owner forgot the passphrase, all wallets and accounts derive from the phrase will be lost.`
     * @returns 64-byte array contains privateKey and chainCode as described on BIP39
     */
    static mnemonicToMasterKeys(phrase: MnemonicPhrase, passphrase?: BytesLike): Uint8Array;
    /**
     * Validates if given mnemonic is  valid
     * @param phrase - Mnemonic phrase composed by words from the provided wordlist
     * @returns true if phrase is a valid mnemonic
     */
    static isMnemonicValid(phrase: string): boolean;
    static binarySearch(target: string): boolean;
    /**
     * @param seed - BIP39 seed
     * @param testnet - Inform if should use testnet or mainnet prefix, the default value is true (`mainnet`).
     * @returns 64-byte array contains privateKey and chainCode as described on BIP39
     */
    static masterKeysFromSeed(seed: string): Uint8Array;
    /**
     * Get the extendKey as defined on BIP-32 from the provided seed
     *
     * @param seed - BIP39 seed
     * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
     * @returns BIP-32 extended private key
     */
    static seedToExtendedKey(seed: string, testnet?: boolean): string;
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
    static generate(size?: number, extraEntropy?: BytesLike): string;
}
export default Mnemonic;
//# sourceMappingURL=mnemonic.d.ts.map