export declare const ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
export declare const EMPTY = "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
export declare const MAX_HEIGHT = 256;
export interface MapStore {
    [key: string]: string;
}
/**
 * Gets the bit at an offset from the most significant bit
 */
export declare function getBitAtFromMSB(data: string, position: number): number;
/**
 * Reverse the nodes position
 */
export declare function reverseSideNodes(sideNodes: string[]): string[];
/**
 * Counts the common bit at at an offset from the most significant bit
 * between two inputs
 */
export declare function countCommonPrefix(data1: string, data2: string): number;
//# sourceMappingURL=utils.d.ts.map