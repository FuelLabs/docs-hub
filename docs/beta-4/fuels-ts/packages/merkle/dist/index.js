"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SparseMerkleTree: () => SparseMerkleTree,
  calcRoot: () => calcRoot,
  constructTree: () => constructTree,
  getProof: () => getProof,
  hashLeaf: () => hashLeaf,
  hashNode: () => hashNode
});
module.exports = __toCommonJS(src_exports);

// src/common/common.ts
var EMPTY = "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

// src/common/cryptography.ts
var import_ethers = require("ethers");
function hash(data) {
  return (0, import_ethers.sha256)(data);
}

// src/binary/types/node.ts
var Node = class {
  left;
  right;
  parent;
  hash;
  data;
  index;
  constructor(left, right, parent, hash2, data, index = 0) {
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.hash = hash2;
    this.data = data;
    this.index = index;
  }
};
var node_default = Node;

// src/binary/binaryMerkleTree.ts
function hashLeaf(data) {
  return hash("0x00".concat(data.slice(2)));
}
function hashNode(left, right) {
  return hash("0x01".concat(left.slice(2)).concat(right.slice(2)));
}
function constructTree(data) {
  const nodes = [];
  for (let i = 0; i < data.length; i += 1) {
    const hashed = hashLeaf(data[i]);
    const leaf = new node_default(-1, -1, -1, hashed, data[i]);
    leaf.index = i;
    nodes.push(leaf);
  }
  const nodesList = [...nodes];
  let pNodes = [...nodes];
  let size = nodes.length + 1 >> 1;
  let odd = nodes.length & 1;
  while (true) {
    let i = 0;
    for (; i < size - odd; i += 1) {
      const j = i << 1;
      const hashed = hashNode(pNodes[j].hash, pNodes[j + 1].hash);
      nodes[i] = new node_default(pNodes[j].index, pNodes[j + 1].index, -1, hashed, "");
      const nextIndex = nodesList.length;
      nodes[i].index = nextIndex;
      nodesList[pNodes[j].index].parent = nextIndex;
      nodesList[pNodes[j + 1].index].parent = nextIndex;
      nodesList.push(nodes[i]);
    }
    if (size === 1) {
      break;
    }
    if (odd === 1) {
      nodes[i] = pNodes[i << 1];
    }
    odd = size & 1;
    size = size + 1 >> 1;
    pNodes = [...nodes];
  }
  return nodesList;
}
function calcRoot(data) {
  if (!data.length) {
    return EMPTY;
  }
  const nodes = [];
  for (let i = 0; i < data.length; i += 1) {
    const hashed = hashLeaf(data[i]);
    nodes.push(new node_default(-1, -1, -1, hashed, data[i]));
  }
  let pNodes = nodes;
  let size = nodes.length + 1 >> 1;
  let odd = nodes.length & 1;
  while (true) {
    let i = 0;
    for (; i < size - odd; i += 1) {
      const j = i << 1;
      const hashed = hashNode(pNodes[j].hash, pNodes[j + 1].hash);
      nodes[i] = new node_default(pNodes[j].index, pNodes[j + 1].index, -1, hashed, "");
    }
    if (odd === 1) {
      nodes[i] = pNodes[i << 1];
    }
    if (size === 1) {
      break;
    }
    odd = size & 1;
    size = size + 1 >> 1;
    pNodes = nodes;
  }
  return nodes[0].hash;
}
function getProof(nodes, id) {
  const proof = [];
  for (let prev = id, cur = nodes[id].parent; cur !== -1; prev = cur, cur = nodes[cur].parent) {
    if (nodes[cur].left === prev) {
      proof.push(nodes[nodes[cur].right].hash);
    } else {
      proof.push(nodes[nodes[cur].left].hash);
    }
  }
  return proof;
}

// src/sparse/treeHasher.ts
var leafPrefix = "0x00";
var nodePrefix = "0x01";
function hashLeaf2(key, data) {
  const value = "0x00".concat(key.slice(2)).concat(hash(data).slice(2));
  return [hash(value), value];
}
function hashNode2(left, right) {
  const value = "0x01".concat(left.slice(2)).concat(right.slice(2));
  return [hash(value), value];
}
function parseLeaf(data) {
  const len = nodePrefix.length;
  return ["0x".concat(data.slice(len, len + 64)), "0x".concat(data.slice(len + 64))];
}
function parseNode(data) {
  const len = nodePrefix.length;
  return ["0x".concat(data.slice(len, len + 64)), "0x".concat(data.slice(len + 64))];
}
function isLeaf(data) {
  return data.slice(0, 4) === leafPrefix;
}

// src/sparse/types/sparseCompactMerkleProof.ts
var SparseCompactMerkleProof = class {
  SideNodes;
  NonMembershipLeafData;
  BitMask;
  NumSideNodes;
  SiblingData;
  constructor(SideNodes, NonMembershipLeafData, Bitmask, NumSideNodes, SiblingData) {
    this.SideNodes = SideNodes;
    this.NonMembershipLeafData = NonMembershipLeafData;
    this.BitMask = Bitmask;
    this.NumSideNodes = NumSideNodes;
    this.SiblingData = SiblingData;
  }
};
var sparseCompactMerkleProof_default = SparseCompactMerkleProof;

// src/sparse/types/sparseMerkleProof.ts
var SparseMerkleProof = class {
  SideNodes;
  NonMembershipLeafData;
  SiblingData;
  constructor(sideNodes, NonMembershipLeafData, SiblingData) {
    this.SideNodes = sideNodes;
    this.NonMembershipLeafData = NonMembershipLeafData;
    this.SiblingData = SiblingData;
  }
};
var sparseMerkleProof_default = SparseMerkleProof;

// src/sparse/utils.ts
var ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
var MAX_HEIGHT = 256;
function getBitAtFromMSB(data, position) {
  const slicedData = data.slice(2);
  const byte = "0x".concat(
    slicedData.slice(Math.floor(position / 8) * 2, Math.floor(position / 8) * 2 + 2)
  );
  const bits = Number(byte) & 1 << 8 - 1 - position % 8;
  if (bits > 0) {
    return 1;
  }
  return 0;
}
function reverseSideNodes(sideNodes) {
  let left = 0;
  let right = sideNodes.length - 1;
  const reversedSideNodes = sideNodes;
  while (left < right) {
    [reversedSideNodes[left], reversedSideNodes[right]] = [
      reversedSideNodes[right],
      reversedSideNodes[left]
    ];
    left += 1;
    right -= 1;
  }
  return reversedSideNodes;
}
function countCommonPrefix(data1, data2) {
  let count = 0;
  for (let i = 0; i < MAX_HEIGHT; i += 1) {
    if (getBitAtFromMSB(data1, i) === getBitAtFromMSB(data2, i)) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

// src/sparse/proofs.ts
function compactProof(proof) {
  const bitMask = [];
  const compactedSideNodes = [];
  let node;
  for (let i = 0; i < proof.SideNodes.length; i += 1) {
    node = proof.SideNodes[i];
    if (node === ZERO) {
      bitMask.push(0);
    } else {
      compactedSideNodes.push(node);
      bitMask.push(1);
    }
  }
  const compactedProof = new sparseCompactMerkleProof_default(
    compactedSideNodes,
    proof.NonMembershipLeafData,
    bitMask,
    proof.SideNodes.length,
    proof.SiblingData
  );
  return compactedProof;
}

// src/sparse/sparseMerkleTree.ts
var SparseMerkleTree = class {
  ms;
  root;
  constructor() {
    const ms = {};
    this.ms = ms;
    this.root = ZERO;
    this.ms[this.root] = ZERO;
  }
  get(key) {
    return this.ms[key];
  }
  set(key, value) {
    this.ms[key] = value;
  }
  setRoot(root) {
    this.root = root;
  }
  sideNodesForRoot(key, root) {
    const sideNodes = [];
    if (root === ZERO) {
      return [sideNodes, ZERO, "", ""];
    }
    let currentData = this.get(root);
    if (isLeaf(currentData)) {
      return [sideNodes, root, currentData, ""];
    }
    let leftNode;
    let rightNode;
    let nodeHash = "";
    let sideNode = "";
    for (let i = 0; i < MAX_HEIGHT; i += 1) {
      [leftNode, rightNode] = parseNode(currentData);
      if (getBitAtFromMSB(key, i) === 1) {
        sideNode = leftNode;
        nodeHash = rightNode;
      } else {
        sideNode = rightNode;
        nodeHash = leftNode;
      }
      sideNodes.push(sideNode);
      if (nodeHash === ZERO) {
        currentData = "";
        break;
      }
      currentData = this.get(nodeHash);
      if (isLeaf(currentData)) {
        break;
      }
    }
    const siblingData = this.get(sideNode);
    return [reverseSideNodes(sideNodes), nodeHash, currentData, siblingData];
  }
  deleteWithSideNodes(key, sideNodes, oldLeafHash, oldLeafData) {
    if (oldLeafHash === ZERO) {
      return this.root;
    }
    const [actualPath] = parseLeaf(oldLeafData);
    if (actualPath !== key) {
      return this.root;
    }
    let currentHash = "";
    let currentData = "";
    let sideNode = "";
    let sideNodeValue = "";
    let nonPlaceholderReached = false;
    for (let i = 0; i < sideNodes.length; i += 1) {
      if (sideNodes[i] === "") {
        continue;
      }
      sideNode = sideNodes[i];
      if (currentData === "") {
        sideNodeValue = this.get(sideNode);
        if (isLeaf(sideNodeValue)) {
          currentHash = sideNode;
          currentData = sideNode;
          continue;
        } else {
          currentData = ZERO;
          nonPlaceholderReached = true;
        }
      }
      if (!nonPlaceholderReached && sideNode === ZERO) {
        continue;
      } else if (!nonPlaceholderReached) {
        nonPlaceholderReached = true;
      }
      if (getBitAtFromMSB(key, sideNodes.length - 1 - i) === 1) {
        [currentHash, currentData] = hashNode2(sideNode, currentData);
      } else {
        [currentHash, currentData] = hashNode2(currentData, sideNode);
      }
      this.set(currentHash, currentData);
      currentData = currentHash;
    }
    if (currentHash === "") {
      currentHash = ZERO;
    }
    return currentHash;
  }
  updateWithSideNodes(key, value, sideNodes, oldLeafHash, oldLeafData) {
    let currentHash;
    let currentData;
    this.set(hash(value), value);
    [currentHash, currentData] = hashLeaf2(key, value);
    this.set(currentHash, currentData);
    currentData = currentHash;
    let commonPrefixCount;
    if (oldLeafHash === ZERO) {
      commonPrefixCount = MAX_HEIGHT;
    } else {
      const [actualPath] = parseLeaf(oldLeafData);
      commonPrefixCount = countCommonPrefix(key, actualPath);
    }
    if (commonPrefixCount !== MAX_HEIGHT) {
      if (getBitAtFromMSB(key, commonPrefixCount) === 1) {
        [currentHash, currentData] = hashNode2(oldLeafHash, currentData);
      } else {
        [currentHash, currentData] = hashNode2(currentData, oldLeafHash);
      }
      this.set(currentHash, currentData);
      currentData = currentHash;
    }
    for (let i = 0; i < MAX_HEIGHT; i += 1) {
      let sideNode;
      const offsetOfSideNodes = MAX_HEIGHT - sideNodes.length;
      if (i - offsetOfSideNodes < 0 || sideNodes[i - offsetOfSideNodes] === "") {
        if (commonPrefixCount !== MAX_HEIGHT && commonPrefixCount > MAX_HEIGHT - 1 - i) {
          sideNode = ZERO;
        } else {
          continue;
        }
      } else {
        sideNode = sideNodes[i - offsetOfSideNodes];
      }
      if (getBitAtFromMSB(key, MAX_HEIGHT - 1 - i) === 1) {
        [currentHash, currentData] = hashNode2(sideNode, currentData);
      } else {
        [currentHash, currentData] = hashNode2(currentData, sideNode);
      }
      this.set(currentHash, currentData);
      currentData = currentHash;
    }
    return currentHash;
  }
  update(key, value) {
    const [sideNodes, oldLeafHash, oldLeafData] = this.sideNodesForRoot(key, this.root);
    const newRoot = this.updateWithSideNodes(key, value, sideNodes, oldLeafHash, oldLeafData);
    this.setRoot(newRoot);
  }
  delete(key) {
    const [sideNodes, oldLeafHash, oldLeafData] = this.sideNodesForRoot(key, this.root);
    const newRoot = this.deleteWithSideNodes(key, sideNodes, oldLeafHash, oldLeafData);
    this.setRoot(newRoot);
  }
  prove(key) {
    const [sideNodes, leafHash, leafData, siblingData] = this.sideNodesForRoot(key, this.root);
    const nonEmptySideNodes = [];
    for (let i = 0; i < sideNodes.length; i += 1) {
      if (sideNodes[i] !== "") {
        nonEmptySideNodes.push(sideNodes[i]);
      }
    }
    let nonMembershipLeafData = "";
    if (leafHash !== ZERO) {
      const [actualPath] = parseLeaf(leafData);
      if (actualPath !== key) {
        nonMembershipLeafData = leafData;
      }
    }
    const proof = new sparseMerkleProof_default(nonEmptySideNodes, nonMembershipLeafData, siblingData);
    return proof;
  }
  proveCompacted(key) {
    const proof = this.prove(key);
    const compactedProof = compactProof(proof);
    return compactedProof;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SparseMerkleTree,
  calcRoot,
  constructTree,
  getProof,
  hashLeaf,
  hashNode
});
//# sourceMappingURL=index.js.map