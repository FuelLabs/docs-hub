import { SparseMerkleTree } from './sparseMerkleTree';
import type SparseCompactMerkleProof from './types/sparseCompactMerkleProof';
import type SparseMerkleProof from './types/sparseMerkleProof';
export declare class DeepSparseMerkleSubTree extends SparseMerkleTree {
    constructor(root: string);
    verify(proof: SparseMerkleProof, key: string, value: string): boolean;
    addBranch(proof: SparseMerkleProof, key: string, value: string): boolean;
    verifyCompact(proof: SparseCompactMerkleProof, key: string, value: string): boolean;
    addBranchCompact(proof: SparseCompactMerkleProof, key: string, value: string): boolean;
}
//# sourceMappingURL=deepSparseMerkleSubTree.d.ts.map