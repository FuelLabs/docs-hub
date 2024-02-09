import SparseCompactMerkleProof from './types/sparseCompactMerkleProof';
import SparseMerkleProof from './types/sparseMerkleProof';
/**
 * Verify a merkle proof
 */
export declare function verifyProof(proof: SparseMerkleProof, root: string, key: string, value: string): [boolean, string[][]];
/**
 * Compact a Sparse Merkle Proof using a bitmask
 */
export declare function compactProof(proof: SparseMerkleProof): SparseCompactMerkleProof;
/**
 * Decompact a Sparse Merkle Proof
 */
export declare function decompactProof(proof: SparseCompactMerkleProof): SparseMerkleProof;
//# sourceMappingURL=proofs.d.ts.map