import type SparseMerkleSolidityNode from './sparseMerkleSolidityNode';
declare class SparseCompactMerkleSolidityProof {
    SideNodes: string[];
    NonMembershipLeaf: SparseMerkleSolidityNode;
    BitMask: number[];
    NumSideNodes: number;
    Sibling: SparseMerkleSolidityNode;
    constructor(SideNodes: string[], NonMembershipLeaf: SparseMerkleSolidityNode, Bitmask: number[], NumSideNodes: number, Sibling: SparseMerkleSolidityNode);
}
export default SparseCompactMerkleSolidityProof;
//# sourceMappingURL=sparseCompactMerkleSolidityProof.d.ts.map