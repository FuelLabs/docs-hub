export declare const leafPrefix = "0x00";
export declare const nodePrefix = "0x01";
/**
 * Slice off the '0x' on each argument to simulate abi.encode
 * prefix + key + hash(data)
 */
export declare function hashLeaf(key: string, data: string): [string, string];
/**
 * Slice off the '0x' on each argument to simulate abi.encodePacked
 * prefix + key + hash(data)
 */
export declare function hashNode(left: string, right: string): [string, string];
/**
 * Parse a leaf
 */
export declare function parseLeaf(data: string): [string, string];
/**
 * Parse a nodes
 */
export declare function parseNode(data: string): [string, string];
/**
 * Check if data is a leaf by checking prefix
 */
export declare function isLeaf(data: string): boolean;
//# sourceMappingURL=treeHasher.d.ts.map