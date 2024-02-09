import Node from './types/node';
/**
 * Slice off the '0x' on each argument to simulate abi.encodePacked
 */
export declare function hashLeaf(data: string): string;
/**
 * Slice off the '0x' on each argument to simulate abi.encodePacked
 * hash(prefix +  left + right)
 */
export declare function hashNode(left: string, right: string): string;
/**
 * Construct tree
 */
export declare function constructTree(data: string[]): Node[];
/**
 * Compute the merkle root
 */
export declare function calcRoot(data: string[]): string;
/**
 * Get proof for the leaf
 */
export declare function getProof(nodes: Node[], id: number): string[];
//# sourceMappingURL=binaryMerkleTree.d.ts.map