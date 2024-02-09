"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/common/common.ts
  var EMPTY = "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/_version.js
  var version = "6.7.1";

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/utils/properties.js
  function checkType(value, type, name) {
    const types = type.split("|").map((t) => t.trim());
    for (let i = 0; i < types.length; i++) {
      switch (type) {
        case "any":
          return;
        case "bigint":
        case "boolean":
        case "number":
        case "string":
          if (typeof value === type) {
            return;
          }
      }
    }
    const error = new Error(`invalid value for type ${type}`);
    error.code = "INVALID_ARGUMENT";
    error.argument = `value.${name}`;
    error.value = value;
    throw error;
  }
  function defineProperties(target, values, types) {
    for (let key in values) {
      let value = values[key];
      const type = types ? types[key] : null;
      if (type) {
        checkType(value, type, key);
      }
      Object.defineProperty(target, key, { enumerable: true, value, writable: false });
    }
  }

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/utils/errors.js
  function stringify(value) {
    if (value == null) {
      return "null";
    }
    if (Array.isArray(value)) {
      return "[ " + value.map(stringify).join(", ") + " ]";
    }
    if (value instanceof Uint8Array) {
      const HEX = "0123456789abcdef";
      let result = "0x";
      for (let i = 0; i < value.length; i++) {
        result += HEX[value[i] >> 4];
        result += HEX[value[i] & 15];
      }
      return result;
    }
    if (typeof value === "object" && typeof value.toJSON === "function") {
      return stringify(value.toJSON());
    }
    switch (typeof value) {
      case "boolean":
      case "symbol":
        return value.toString();
      case "bigint":
        return BigInt(value).toString();
      case "number":
        return value.toString();
      case "string":
        return JSON.stringify(value);
      case "object": {
        const keys = Object.keys(value);
        keys.sort();
        return "{ " + keys.map((k) => `${stringify(k)}: ${stringify(value[k])}`).join(", ") + " }";
      }
    }
    return `[ COULD NOT SERIALIZE ]`;
  }
  function makeError(message, code, info) {
    {
      const details = [];
      if (info) {
        if ("message" in info || "code" in info || "name" in info) {
          throw new Error(`value will overwrite populated values: ${stringify(info)}`);
        }
        for (const key in info) {
          const value = info[key];
          details.push(key + "=" + stringify(value));
        }
      }
      details.push(`code=${code}`);
      details.push(`version=${version}`);
      if (details.length) {
        message += " (" + details.join(", ") + ")";
      }
    }
    let error;
    switch (code) {
      case "INVALID_ARGUMENT":
        error = new TypeError(message);
        break;
      case "NUMERIC_FAULT":
      case "BUFFER_OVERRUN":
        error = new RangeError(message);
        break;
      default:
        error = new Error(message);
    }
    defineProperties(error, { code });
    if (info) {
      Object.assign(error, info);
    }
    return error;
  }
  function assert(check, message, code, info) {
    if (!check) {
      throw makeError(message, code, info);
    }
  }
  function assertArgument(check, message, name, value) {
    assert(check, message, "INVALID_ARGUMENT", { argument: name, value });
  }
  var _normalizeForms = ["NFD", "NFC", "NFKD", "NFKC"].reduce((accum, form) => {
    try {
      if ("test".normalize(form) !== "test") {
        throw new Error("bad");
      }
      ;
      if (form === "NFD") {
        const check = String.fromCharCode(233).normalize("NFD");
        const expected = String.fromCharCode(101, 769);
        if (check !== expected) {
          throw new Error("broken");
        }
      }
      accum.push(form);
    } catch (error) {
    }
    return accum;
  }, []);

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/utils/data.js
  function _getBytes(value, name, copy) {
    if (value instanceof Uint8Array) {
      if (copy) {
        return new Uint8Array(value);
      }
      return value;
    }
    if (typeof value === "string" && value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
      const result = new Uint8Array((value.length - 2) / 2);
      let offset = 2;
      for (let i = 0; i < result.length; i++) {
        result[i] = parseInt(value.substring(offset, offset + 2), 16);
        offset += 2;
      }
      return result;
    }
    assertArgument(false, "invalid BytesLike value", name || "value", value);
  }
  function getBytes(value, name) {
    return _getBytes(value, name, false);
  }
  var HexCharacters = "0123456789abcdef";
  function hexlify(data) {
    const bytes = getBytes(data);
    let result = "0x";
    for (let i = 0; i < bytes.length; i++) {
      const v = bytes[i];
      result += HexCharacters[(v & 240) >> 4] + HexCharacters[v & 15];
    }
    return result;
  }

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/crypto/crypto.js
  var import_crypto = __require("crypto");

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/crypto/sha2.js
  var _sha256 = function(data) {
    return (0, import_crypto.createHash)("sha256").update(data).digest();
  };
  var _sha512 = function(data) {
    return (0, import_crypto.createHash)("sha512").update(data).digest();
  };
  var __sha256 = _sha256;
  var __sha512 = _sha512;
  var locked256 = false;
  var locked512 = false;
  function sha256(_data) {
    const data = getBytes(_data, "data");
    return hexlify(__sha256(data));
  }
  sha256._ = _sha256;
  sha256.lock = function() {
    locked256 = true;
  };
  sha256.register = function(func) {
    if (locked256) {
      throw new Error("sha256 is locked");
    }
    __sha256 = func;
  };
  Object.freeze(sha256);
  function sha512(_data) {
    const data = getBytes(_data, "data");
    return hexlify(__sha512(data));
  }
  sha512._ = _sha512;
  sha512.lock = function() {
    locked512 = true;
  };
  sha512.register = function(func) {
    if (locked512) {
      throw new Error("sha512 is locked");
    }
    __sha512 = func;
  };
  Object.freeze(sha256);

  // src/common/cryptography.ts
  function hash(data) {
    return sha256(data);
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
})();
//# sourceMappingURL=index.global.js.map