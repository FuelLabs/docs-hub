import Node from './types/node';
import Proof from './types/proof';
/**
 * Slice off the '0x' on each argument to simulate abi.encodePacked
 * hash(prefix + value + data)
 */
export declare function hashLeaf(value: string, data: string): string;
/**
 * Slice off the '0x' on each argument to simulate abi.encodePacked
 * hash (prefix + leftSum + leftHash + rightSum + rightHash)
 */
export declare function hashNode(leftValue: string, left: string, rightValue: string, right: string): string;
/**
 * Construct tree
 */
export declare function constructTree(sums: string[], data: string[]): Node[];
/**
 * Compute the merkle root
 */
export declare function calcRoot(sums: string[], data: string[]): Node;
/**
 * Get proof for the leaf
 */
export declare function getProof(nodes: Node[], id: number): Proof;
//# sourceMappingURL=sumMerkleTree.d.ts.map