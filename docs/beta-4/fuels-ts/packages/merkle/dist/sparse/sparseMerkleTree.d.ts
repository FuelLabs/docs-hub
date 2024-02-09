import type SparseCompactMerkleProof from './types/sparseCompactMerkleProof';
import SparseMerkleProof from './types/sparseMerkleProof';
import type { MapStore } from './utils';
export declare class SparseMerkleTree {
    ms: MapStore;
    root: string;
    constructor();
    get(key: string): string;
    set(key: string, value: string): void;
    setRoot(root: string): void;
    sideNodesForRoot(key: string, root: string): [string[], string, string, string];
    deleteWithSideNodes(key: string, sideNodes: string[], oldLeafHash: string, oldLeafData: string): string;
    updateWithSideNodes(key: string, value: string, sideNodes: string[], oldLeafHash: string, oldLeafData: string): string;
    update(key: string, value: string): void;
    delete(key: string): void;
    prove(key: string): SparseMerkleProof;
    proveCompacted(key: string): SparseCompactMerkleProof;
}
//# sourceMappingURL=sparseMerkleTree.d.ts.map