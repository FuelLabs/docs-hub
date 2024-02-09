"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AddressType: () => AddressType,
  BaseTransactionRequest: () => BaseTransactionRequest,
  ChainName: () => ChainName,
  ChangeOutputCollisionError: () => ChangeOutputCollisionError,
  CreateTransactionRequest: () => CreateTransactionRequest,
  NoWitnessAtIndexError: () => NoWitnessAtIndexError,
  NoWitnessByOwnerError: () => NoWitnessByOwnerError,
  OperationName: () => OperationName,
  Provider: () => Provider,
  ScriptTransactionRequest: () => ScriptTransactionRequest,
  TransactionResponse: () => TransactionResponse,
  TransactionStatus: () => TransactionStatus,
  TransactionType: () => import_transactions5.TransactionType,
  TransactionTypeName: () => TransactionTypeName,
  addAmountToAsset: () => addAmountToAsset,
  addOperation: () => addOperation,
  assembleReceiptByType: () => assembleReceiptByType,
  assembleTransactionSummary: () => assembleTransactionSummary,
  buildBlockExplorerUrl: () => buildBlockExplorerUrl,
  calculateMetadataGasForTxCreate: () => calculateMetadataGasForTxCreate,
  calculateMetadataGasForTxScript: () => calculateMetadataGasForTxScript,
  calculatePriceWithFactor: () => calculatePriceWithFactor,
  calculateTransactionFee: () => calculateTransactionFee,
  coinQuantityfy: () => coinQuantityfy,
  extractBurnedAssetsFromReceipts: () => extractBurnedAssetsFromReceipts,
  extractMintedAssetsFromReceipts: () => extractMintedAssetsFromReceipts,
  fromDateToTai64: () => fromDateToTai64,
  fromTai64ToDate: () => fromTai64ToDate,
  fromTai64ToUnix: () => fromTai64ToUnix,
  fromUnixToTai64: () => fromUnixToTai64,
  gasUsedByInputs: () => gasUsedByInputs,
  getContractCallOperations: () => getContractCallOperations,
  getContractCreatedOperations: () => getContractCreatedOperations,
  getContractTransferOperations: () => getContractTransferOperations,
  getDecodedLogs: () => getDecodedLogs,
  getGasUsedFromReceipts: () => getGasUsedFromReceipts,
  getInputAccountAddress: () => getInputAccountAddress,
  getInputContractFromIndex: () => getInputContractFromIndex,
  getInputFromAssetId: () => getInputFromAssetId,
  getInputsByType: () => getInputsByType,
  getInputsCoin: () => getInputsCoin,
  getInputsContract: () => getInputsContract,
  getInputsMessage: () => getInputsMessage,
  getMaxGas: () => getMaxGas,
  getMinGas: () => getMinGas,
  getOperations: () => getOperations,
  getOutputsByType: () => getOutputsByType,
  getOutputsChange: () => getOutputsChange,
  getOutputsCoin: () => getOutputsCoin,
  getOutputsContract: () => getOutputsContract,
  getOutputsContractCreated: () => getOutputsContractCreated,
  getOutputsVariable: () => getOutputsVariable,
  getPayProducerOperations: () => getPayProducerOperations,
  getReceiptsByType: () => getReceiptsByType,
  getReceiptsCall: () => getReceiptsCall,
  getReceiptsMessageOut: () => getReceiptsMessageOut,
  getReceiptsTransferOut: () => getReceiptsTransferOut,
  getReceiptsWithMissingData: () => getReceiptsWithMissingData,
  getTransactionStatusName: () => getTransactionStatusName,
  getTransactionSummary: () => getTransactionSummary,
  getTransactionSummaryFromRequest: () => getTransactionSummaryFromRequest,
  getTransactionTypeName: () => getTransactionTypeName,
  getTransactionsSummaries: () => getTransactionsSummaries,
  getTransferOperations: () => getTransferOperations,
  getWithdrawFromFuelOperations: () => getWithdrawFromFuelOperations,
  hasSameAssetId: () => hasSameAssetId,
  inputify: () => inputify,
  isCoin: () => isCoin,
  isMessage: () => isMessage,
  isRawCoin: () => isRawCoin,
  isRawMessage: () => isRawMessage,
  isType: () => isType,
  isTypeCreate: () => isTypeCreate,
  isTypeMint: () => isTypeMint,
  isTypeScript: () => isTypeScript,
  normalizeJSON: () => normalizeJSON,
  outputify: () => outputify,
  processGqlReceipt: () => processGqlReceipt,
  processGraphqlStatus: () => processGraphqlStatus,
  resolveGasDependentCosts: () => resolveGasDependentCosts,
  returnZeroScript: () => returnZeroScript,
  sleep: () => sleep,
  transactionRequestify: () => transactionRequestify,
  withdrawScript: () => withdrawScript
});
module.exports = __toCommonJS(src_exports);

// src/coin-quantity.ts
var import_configs = require("@fuel-ts/address/configs");
var import_math = require("@fuel-ts/math");
var import_ethers = require("ethers");
var coinQuantityfy = (coinQuantityLike) => {
  let assetId;
  let amount;
  let max2;
  if (Array.isArray(coinQuantityLike)) {
    amount = coinQuantityLike[0];
    assetId = coinQuantityLike[1] ?? import_configs.BaseAssetId;
    max2 = coinQuantityLike[2] ?? void 0;
  } else {
    amount = coinQuantityLike.amount;
    assetId = coinQuantityLike.assetId ?? import_configs.BaseAssetId;
    max2 = coinQuantityLike.max ?? void 0;
  }
  return {
    assetId: (0, import_ethers.hexlify)(assetId),
    amount: (0, import_math.bn)(amount),
    max: max2 ? (0, import_math.bn)(max2) : void 0
  };
};
var addAmountToAsset = (params) => {
  const { amount, assetId } = params;
  const coinQuantities = [...params.coinQuantities];
  const assetIdx = coinQuantities.findIndex((coinQuantity) => coinQuantity.assetId === assetId);
  if (assetIdx !== -1) {
    coinQuantities[assetIdx].amount = coinQuantities[assetIdx].amount.add(amount);
  } else {
    coinQuantities.push({ assetId, amount });
  }
  return coinQuantities;
};

// src/provider.ts
var import_address3 = require("@fuel-ts/address");
var import_errors12 = require("@fuel-ts/errors");
var import_math14 = require("@fuel-ts/math");
var import_transactions17 = require("@fuel-ts/transactions");
var import_versions = require("@fuel-ts/versions");
var import_ethers18 = require("ethers");
var import_graphql_request = require("graphql-request");
var import_ramda3 = require("ramda");

// src/__generated__/operations.ts
var import_graphql_tag = __toESM(require("graphql-tag"));
var ReceiptFragmentFragmentDoc = import_graphql_tag.default`
    fragment receiptFragment on Receipt {
  contract {
    id
    bytecode
    salt
  }
  pc
  is
  to {
    id
    bytecode
    salt
  }
  toAddress
  amount
  assetId
  gas
  param1
  param2
  val
  ptr
  digest
  reason
  ra
  rb
  rc
  rd
  len
  receiptType
  result
  gasUsed
  data
  sender
  recipient
  nonce
  contractId
  subId
}
    `;
var TransactionFragmentFragmentDoc = import_graphql_tag.default`
    fragment transactionFragment on Transaction {
  id
  rawPayload
  gasPrice
  receipts {
    ...receiptFragment
  }
  status {
    type: __typename
    ... on SubmittedStatus {
      time
    }
    ... on SuccessStatus {
      block {
        id
      }
      time
      programState {
        returnType
        data
      }
    }
    ... on FailureStatus {
      block {
        id
      }
      time
      reason
    }
  }
}
    ${ReceiptFragmentFragmentDoc}`;
var CoinFragmentFragmentDoc = import_graphql_tag.default`
    fragment coinFragment on Coin {
  __typename
  utxoId
  owner
  amount
  assetId
  maturity
  blockCreated
  txCreatedIdx
}
    `;
var MessageCoinFragmentFragmentDoc = import_graphql_tag.default`
    fragment messageCoinFragment on MessageCoin {
  __typename
  sender
  recipient
  nonce
  amount
  assetId
  daHeight
}
    `;
var MessageFragmentFragmentDoc = import_graphql_tag.default`
    fragment messageFragment on Message {
  amount
  sender
  recipient
  data
  nonce
  daHeight
}
    `;
var MessageProofFragmentFragmentDoc = import_graphql_tag.default`
    fragment messageProofFragment on MessageProof {
  messageProof {
    proofSet
    proofIndex
  }
  blockProof {
    proofSet
    proofIndex
  }
  messageBlockHeader {
    id
    daHeight
    transactionsCount
    transactionsRoot
    height
    prevRoot
    time
    applicationHash
    messageReceiptRoot
    messageReceiptCount
  }
  commitBlockHeader {
    id
    daHeight
    transactionsCount
    transactionsRoot
    height
    prevRoot
    time
    applicationHash
    messageReceiptRoot
    messageReceiptCount
  }
  sender
  recipient
  nonce
  amount
  data
}
    `;
var BalanceFragmentFragmentDoc = import_graphql_tag.default`
    fragment balanceFragment on Balance {
  owner
  amount
  assetId
}
    `;
var BlockFragmentFragmentDoc = import_graphql_tag.default`
    fragment blockFragment on Block {
  id
  header {
    height
    time
  }
  transactions {
    id
  }
}
    `;
var TxParametersFragmentFragmentDoc = import_graphql_tag.default`
    fragment TxParametersFragment on TxParameters {
  maxInputs
  maxOutputs
  maxWitnesses
  maxGasPerTx
  maxSize
}
    `;
var PredicateParametersFragmentFragmentDoc = import_graphql_tag.default`
    fragment PredicateParametersFragment on PredicateParameters {
  maxPredicateLength
  maxPredicateDataLength
  maxGasPerPredicate
  maxMessageDataLength
}
    `;
var ScriptParametersFragmentFragmentDoc = import_graphql_tag.default`
    fragment ScriptParametersFragment on ScriptParameters {
  maxScriptLength
  maxScriptDataLength
}
    `;
var ContractParametersFragmentFragmentDoc = import_graphql_tag.default`
    fragment ContractParametersFragment on ContractParameters {
  contractMaxSize
  maxStorageSlots
}
    `;
var FeeParametersFragmentFragmentDoc = import_graphql_tag.default`
    fragment FeeParametersFragment on FeeParameters {
  gasPriceFactor
  gasPerByte
}
    `;
var DependentCostFragmentFragmentDoc = import_graphql_tag.default`
    fragment DependentCostFragment on DependentCost {
  __typename
  ... on LightOperation {
    base
    unitsPerGas
  }
  ... on HeavyOperation {
    base
    gasPerUnit
  }
}
    `;
var GasCostsFragmentFragmentDoc = import_graphql_tag.default`
    fragment GasCostsFragment on GasCosts {
  add
  addi
  aloc
  and
  andi
  bal
  bhei
  bhsh
  burn
  cb
  cfei
  cfsi
  croo
  div
  divi
  ecr1
  eck1
  ed19
  eq
  exp
  expi
  flag
  gm
  gt
  gtf
  ji
  jmp
  jne
  jnei
  jnzi
  jmpf
  jmpb
  jnzf
  jnzb
  jnef
  jneb
  lb
  log
  lt
  lw
  mint
  mlog
  modOp
  modi
  moveOp
  movi
  mroo
  mul
  muli
  mldv
  noop
  not
  or
  ori
  poph
  popl
  pshh
  pshl
  ret
  rvrt
  sb
  sll
  slli
  srl
  srli
  srw
  sub
  subi
  sw
  sww
  time
  tr
  tro
  wdcm
  wqcm
  wdop
  wqop
  wdml
  wqml
  wddv
  wqdv
  wdmd
  wqmd
  wdam
  wqam
  wdmm
  wqmm
  xor
  xori
  call {
    ...DependentCostFragment
  }
  ccp {
    ...DependentCostFragment
  }
  csiz {
    ...DependentCostFragment
  }
  k256 {
    ...DependentCostFragment
  }
  ldc {
    ...DependentCostFragment
  }
  logd {
    ...DependentCostFragment
  }
  mcl {
    ...DependentCostFragment
  }
  mcli {
    ...DependentCostFragment
  }
  mcp {
    ...DependentCostFragment
  }
  mcpi {
    ...DependentCostFragment
  }
  meq {
    ...DependentCostFragment
  }
  retd {
    ...DependentCostFragment
  }
  s256 {
    ...DependentCostFragment
  }
  scwq {
    ...DependentCostFragment
  }
  smo {
    ...DependentCostFragment
  }
  srwq {
    ...DependentCostFragment
  }
  swwq {
    ...DependentCostFragment
  }
  contractRoot {
    ...DependentCostFragment
  }
  stateRoot {
    ...DependentCostFragment
  }
  vmInitialization {
    ...DependentCostFragment
  }
  newStoragePerByte
}
    ${DependentCostFragmentFragmentDoc}`;
var ConsensusParametersFragmentFragmentDoc = import_graphql_tag.default`
    fragment consensusParametersFragment on ConsensusParameters {
  txParams {
    ...TxParametersFragment
  }
  predicateParams {
    ...PredicateParametersFragment
  }
  scriptParams {
    ...ScriptParametersFragment
  }
  contractParams {
    ...ContractParametersFragment
  }
  feeParams {
    ...FeeParametersFragment
  }
  gasCosts {
    ...GasCostsFragment
  }
  baseAssetId
  chainId
}
    ${TxParametersFragmentFragmentDoc}
${PredicateParametersFragmentFragmentDoc}
${ScriptParametersFragmentFragmentDoc}
${ContractParametersFragmentFragmentDoc}
${FeeParametersFragmentFragmentDoc}
${GasCostsFragmentFragmentDoc}`;
var ChainInfoFragmentFragmentDoc = import_graphql_tag.default`
    fragment chainInfoFragment on ChainInfo {
  name
  latestBlock {
    ...blockFragment
  }
  daHeight
  consensusParameters {
    ...consensusParametersFragment
  }
}
    ${BlockFragmentFragmentDoc}
${ConsensusParametersFragmentFragmentDoc}`;
var ContractBalanceFragmentFragmentDoc = import_graphql_tag.default`
    fragment contractBalanceFragment on ContractBalance {
  contract
  amount
  assetId
}
    `;
var PageInfoFragmentFragmentDoc = import_graphql_tag.default`
    fragment pageInfoFragment on PageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}
    `;
var NodeInfoFragmentFragmentDoc = import_graphql_tag.default`
    fragment nodeInfoFragment on NodeInfo {
  utxoValidation
  vmBacktrace
  minGasPrice
  maxTx
  maxDepth
  nodeVersion
  peers {
    id
    addresses
    clientVersion
    blockHeight
    lastHeartbeatMs
    appScore
  }
}
    `;
var GetVersionDocument = import_graphql_tag.default`
    query getVersion {
  nodeInfo {
    nodeVersion
  }
}
    `;
var GetNodeInfoDocument = import_graphql_tag.default`
    query getNodeInfo {
  nodeInfo {
    ...nodeInfoFragment
  }
}
    ${NodeInfoFragmentFragmentDoc}`;
var GetChainDocument = import_graphql_tag.default`
    query getChain {
  chain {
    ...chainInfoFragment
  }
}
    ${ChainInfoFragmentFragmentDoc}`;
var GetTransactionDocument = import_graphql_tag.default`
    query getTransaction($transactionId: TransactionId!) {
  transaction(id: $transactionId) {
    ...transactionFragment
  }
}
    ${TransactionFragmentFragmentDoc}`;
var GetTransactionWithReceiptsDocument = import_graphql_tag.default`
    query getTransactionWithReceipts($transactionId: TransactionId!) {
  transaction(id: $transactionId) {
    ...transactionFragment
    receipts {
      ...receiptFragment
    }
  }
}
    ${TransactionFragmentFragmentDoc}
${ReceiptFragmentFragmentDoc}`;
var GetTransactionsDocument = import_graphql_tag.default`
    query getTransactions($after: String, $before: String, $first: Int, $last: Int) {
  transactions(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        ...transactionFragment
      }
    }
  }
}
    ${TransactionFragmentFragmentDoc}`;
var GetTransactionsByOwnerDocument = import_graphql_tag.default`
    query getTransactionsByOwner($owner: Address!, $after: String, $before: String, $first: Int, $last: Int) {
  transactionsByOwner(
    owner: $owner
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    pageInfo {
      ...pageInfoFragment
    }
    edges {
      node {
        ...transactionFragment
      }
    }
  }
}
    ${PageInfoFragmentFragmentDoc}
${TransactionFragmentFragmentDoc}`;
var EstimatePredicatesDocument = import_graphql_tag.default`
    query estimatePredicates($encodedTransaction: HexString!) {
  estimatePredicates(tx: $encodedTransaction) {
    ...transactionFragment
  }
}
    ${TransactionFragmentFragmentDoc}`;
var GetBlockDocument = import_graphql_tag.default`
    query getBlock($blockId: BlockId, $height: U32) {
  block(id: $blockId, height: $height) {
    ...blockFragment
  }
}
    ${BlockFragmentFragmentDoc}`;
var GetBlockWithTransactionsDocument = import_graphql_tag.default`
    query getBlockWithTransactions($blockId: BlockId, $blockHeight: U32) {
  block(id: $blockId, height: $blockHeight) {
    ...blockFragment
    transactions {
      ...transactionFragment
    }
  }
}
    ${BlockFragmentFragmentDoc}
${TransactionFragmentFragmentDoc}`;
var GetBlocksDocument = import_graphql_tag.default`
    query getBlocks($after: String, $before: String, $first: Int, $last: Int) {
  blocks(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        ...blockFragment
      }
    }
  }
}
    ${BlockFragmentFragmentDoc}`;
var GetCoinDocument = import_graphql_tag.default`
    query getCoin($coinId: UtxoId!) {
  coin(utxoId: $coinId) {
    ...coinFragment
  }
}
    ${CoinFragmentFragmentDoc}`;
var GetCoinsDocument = import_graphql_tag.default`
    query getCoins($filter: CoinFilterInput!, $after: String, $before: String, $first: Int, $last: Int) {
  coins(
    filter: $filter
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...coinFragment
      }
    }
  }
}
    ${CoinFragmentFragmentDoc}`;
var GetCoinsToSpendDocument = import_graphql_tag.default`
    query getCoinsToSpend($owner: Address!, $queryPerAsset: [SpendQueryElementInput!]!, $excludedIds: ExcludeInput) {
  coinsToSpend(
    owner: $owner
    queryPerAsset: $queryPerAsset
    excludedIds: $excludedIds
  ) {
    ...coinFragment
    ...messageCoinFragment
  }
}
    ${CoinFragmentFragmentDoc}
${MessageCoinFragmentFragmentDoc}`;
var GetContractDocument = import_graphql_tag.default`
    query getContract($contractId: ContractId!) {
  contract(id: $contractId) {
    bytecode
    id
  }
}
    `;
var GetContractBalanceDocument = import_graphql_tag.default`
    query getContractBalance($contract: ContractId!, $asset: AssetId!) {
  contractBalance(contract: $contract, asset: $asset) {
    ...contractBalanceFragment
  }
}
    ${ContractBalanceFragmentFragmentDoc}`;
var GetBalanceDocument = import_graphql_tag.default`
    query getBalance($owner: Address!, $assetId: AssetId!) {
  balance(owner: $owner, assetId: $assetId) {
    ...balanceFragment
  }
}
    ${BalanceFragmentFragmentDoc}`;
var GetBalancesDocument = import_graphql_tag.default`
    query getBalances($filter: BalanceFilterInput!, $after: String, $before: String, $first: Int, $last: Int) {
  balances(
    filter: $filter
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...balanceFragment
      }
    }
  }
}
    ${BalanceFragmentFragmentDoc}`;
var GetMessagesDocument = import_graphql_tag.default`
    query getMessages($owner: Address!, $after: String, $before: String, $first: Int, $last: Int) {
  messages(
    owner: $owner
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...messageFragment
      }
    }
  }
}
    ${MessageFragmentFragmentDoc}`;
var GetMessageProofDocument = import_graphql_tag.default`
    query getMessageProof($transactionId: TransactionId!, $nonce: Nonce!, $commitBlockId: BlockId, $commitBlockHeight: U32) {
  messageProof(
    transactionId: $transactionId
    nonce: $nonce
    commitBlockId: $commitBlockId
    commitBlockHeight: $commitBlockHeight
  ) {
    ...messageProofFragment
  }
}
    ${MessageProofFragmentFragmentDoc}`;
var GetMessageStatusDocument = import_graphql_tag.default`
    query getMessageStatus($nonce: Nonce!) {
  messageStatus(nonce: $nonce) {
    state
  }
}
    `;
var DryRunDocument = import_graphql_tag.default`
    mutation dryRun($encodedTransaction: HexString!, $utxoValidation: Boolean) {
  dryRun(tx: $encodedTransaction, utxoValidation: $utxoValidation) {
    ...receiptFragment
  }
}
    ${ReceiptFragmentFragmentDoc}`;
var SubmitDocument = import_graphql_tag.default`
    mutation submit($encodedTransaction: HexString!) {
  submit(tx: $encodedTransaction) {
    id
  }
}
    `;
var ProduceBlocksDocument = import_graphql_tag.default`
    mutation produceBlocks($startTimestamp: Tai64Timestamp, $blocksToProduce: U32!) {
  produceBlocks(
    blocksToProduce: $blocksToProduce
    startTimestamp: $startTimestamp
  )
}
    `;
var defaultWrapper = (action, _operationName, _operationType) => action();
function getSdk(client, withWrapper = defaultWrapper) {
  return {
    getVersion(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetVersionDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getVersion", "query");
    },
    getNodeInfo(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetNodeInfoDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getNodeInfo", "query");
    },
    getChain(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetChainDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getChain", "query");
    },
    getTransaction(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetTransactionDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTransaction", "query");
    },
    getTransactionWithReceipts(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetTransactionWithReceiptsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTransactionWithReceipts", "query");
    },
    getTransactions(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetTransactionsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTransactions", "query");
    },
    getTransactionsByOwner(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetTransactionsByOwnerDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTransactionsByOwner", "query");
    },
    estimatePredicates(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(EstimatePredicatesDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "estimatePredicates", "query");
    },
    getBlock(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetBlockDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getBlock", "query");
    },
    getBlockWithTransactions(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetBlockWithTransactionsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getBlockWithTransactions", "query");
    },
    getBlocks(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetBlocksDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getBlocks", "query");
    },
    getCoin(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetCoinDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getCoin", "query");
    },
    getCoins(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetCoinsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getCoins", "query");
    },
    getCoinsToSpend(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetCoinsToSpendDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getCoinsToSpend", "query");
    },
    getContract(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetContractDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getContract", "query");
    },
    getContractBalance(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetContractBalanceDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getContractBalance", "query");
    },
    getBalance(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetBalanceDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getBalance", "query");
    },
    getBalances(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetBalancesDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getBalances", "query");
    },
    getMessages(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetMessagesDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getMessages", "query");
    },
    getMessageProof(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetMessageProofDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getMessageProof", "query");
    },
    getMessageStatus(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(GetMessageStatusDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getMessageStatus", "query");
    },
    dryRun(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(DryRunDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "dryRun", "mutation");
    },
    submit(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(SubmitDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "submit", "mutation");
    },
    produceBlocks(variables, requestHeaders) {
      return withWrapper((wrappedRequestHeaders) => client.request(ProduceBlocksDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "produceBlocks", "mutation");
    }
  };
}

// src/memory-cache.ts
var import_errors = require("@fuel-ts/errors");
var import_ethers2 = require("ethers");
var cache = {};
var DEFAULT_TTL_IN_MS = 30 * 1e3;
var MemoryCache = class {
  ttl;
  constructor(ttlInMs = DEFAULT_TTL_IN_MS) {
    this.ttl = ttlInMs;
    if (typeof ttlInMs !== "number" || this.ttl <= 0) {
      throw new import_errors.FuelError(
        import_errors.ErrorCode.INVALID_TTL,
        `Invalid TTL: ${this.ttl}. Use a value greater than zero.`
      );
    }
  }
  get(value, isAutoExpiring = true) {
    const key = (0, import_ethers2.hexlify)(value);
    if (cache[key]) {
      if (!isAutoExpiring || cache[key].expires > Date.now()) {
        return cache[key].value;
      }
      this.del(value);
    }
    return void 0;
  }
  set(value) {
    const expiresAt = Date.now() + this.ttl;
    const key = (0, import_ethers2.hexlify)(value);
    cache[key] = {
      expires: expiresAt,
      value
    };
    return expiresAt;
  }
  getAllData() {
    return Object.keys(cache).reduce((list, key) => {
      const data = this.get(key, false);
      if (data) {
        list.push(data);
      }
      return list;
    }, []);
  }
  getActiveData() {
    return Object.keys(cache).reduce((list, key) => {
      const data = this.get(key);
      if (data) {
        list.push(data);
      }
      return list;
    }, []);
  }
  del(value) {
    const key = (0, import_ethers2.hexlify)(value);
    delete cache[key];
  }
};

// src/transaction-request/input.ts
var import_configs2 = require("@fuel-ts/address/configs");
var import_errors2 = require("@fuel-ts/errors");
var import_math2 = require("@fuel-ts/math");
var import_transactions = require("@fuel-ts/transactions");
var import_ethers3 = require("ethers");
var inputify = (value) => {
  const { type } = value;
  switch (value.type) {
    case import_transactions.InputType.Coin: {
      const predicate = (0, import_ethers3.getBytesCopy)(value.predicate ?? "0x");
      const predicateData = (0, import_ethers3.getBytesCopy)(value.predicateData ?? "0x");
      return {
        type: import_transactions.InputType.Coin,
        txID: (0, import_ethers3.hexlify)((0, import_ethers3.getBytesCopy)(value.id).slice(0, 32)),
        outputIndex: (0, import_ethers3.getBytesCopy)(value.id)[32],
        owner: (0, import_ethers3.hexlify)(value.owner),
        amount: (0, import_math2.bn)(value.amount),
        assetId: (0, import_ethers3.hexlify)(value.assetId),
        txPointer: {
          blockHeight: (0, import_math2.toNumber)((0, import_ethers3.getBytesCopy)(value.txPointer).slice(0, 8)),
          txIndex: (0, import_math2.toNumber)((0, import_ethers3.getBytesCopy)(value.txPointer).slice(8, 16))
        },
        witnessIndex: value.witnessIndex,
        maturity: value.maturity ?? 0,
        predicateGasUsed: (0, import_math2.bn)(value.predicateGasUsed),
        predicateLength: predicate.length,
        predicateDataLength: predicateData.length,
        predicate: (0, import_ethers3.hexlify)(predicate),
        predicateData: (0, import_ethers3.hexlify)(predicateData)
      };
    }
    case import_transactions.InputType.Contract: {
      return {
        type: import_transactions.InputType.Contract,
        txID: import_configs2.ZeroBytes32,
        outputIndex: 0,
        balanceRoot: import_configs2.ZeroBytes32,
        stateRoot: import_configs2.ZeroBytes32,
        txPointer: {
          blockHeight: (0, import_math2.toNumber)((0, import_ethers3.getBytesCopy)(value.txPointer).slice(0, 8)),
          txIndex: (0, import_math2.toNumber)((0, import_ethers3.getBytesCopy)(value.txPointer).slice(8, 16))
        },
        contractID: (0, import_ethers3.hexlify)(value.contractId)
      };
    }
    case import_transactions.InputType.Message: {
      const predicate = (0, import_ethers3.getBytesCopy)(value.predicate ?? "0x");
      const predicateData = (0, import_ethers3.getBytesCopy)(value.predicateData ?? "0x");
      const data = (0, import_ethers3.getBytesCopy)(value.data ?? "0x");
      return {
        type: import_transactions.InputType.Message,
        sender: (0, import_ethers3.hexlify)(value.sender),
        recipient: (0, import_ethers3.hexlify)(value.recipient),
        amount: (0, import_math2.bn)(value.amount),
        nonce: (0, import_ethers3.hexlify)(value.nonce),
        witnessIndex: value.witnessIndex,
        predicateGasUsed: (0, import_math2.bn)(value.predicateGasUsed),
        predicateLength: predicate.length,
        predicateDataLength: predicateData.length,
        predicate: (0, import_ethers3.hexlify)(predicate),
        predicateData: (0, import_ethers3.hexlify)(predicateData),
        data: (0, import_ethers3.hexlify)(data),
        dataLength: data.length
      };
    }
    default: {
      throw new import_errors2.FuelError(
        import_errors2.ErrorCode.INVALID_TRANSACTION_INPUT,
        `Invalid transaction input type: ${type}.`
      );
    }
  }
};

// src/transaction-request/output.ts
var import_configs3 = require("@fuel-ts/address/configs");
var import_errors3 = require("@fuel-ts/errors");
var import_math3 = require("@fuel-ts/math");
var import_transactions2 = require("@fuel-ts/transactions");
var import_ethers4 = require("ethers");
var outputify = (value) => {
  const { type } = value;
  switch (type) {
    case import_transactions2.OutputType.Coin: {
      return {
        type: import_transactions2.OutputType.Coin,
        to: (0, import_ethers4.hexlify)(value.to),
        amount: (0, import_math3.bn)(value.amount),
        assetId: (0, import_ethers4.hexlify)(value.assetId)
      };
    }
    case import_transactions2.OutputType.Contract: {
      return {
        type: import_transactions2.OutputType.Contract,
        inputIndex: value.inputIndex,
        balanceRoot: import_configs3.ZeroBytes32,
        stateRoot: import_configs3.ZeroBytes32
      };
    }
    case import_transactions2.OutputType.Change: {
      return {
        type: import_transactions2.OutputType.Change,
        to: (0, import_ethers4.hexlify)(value.to),
        amount: (0, import_math3.bn)(0),
        assetId: (0, import_ethers4.hexlify)(value.assetId)
      };
    }
    case import_transactions2.OutputType.Variable: {
      return {
        type: import_transactions2.OutputType.Variable,
        to: import_configs3.ZeroBytes32,
        amount: (0, import_math3.bn)(0),
        assetId: import_configs3.ZeroBytes32
      };
    }
    case import_transactions2.OutputType.ContractCreated: {
      return {
        type: import_transactions2.OutputType.ContractCreated,
        contractId: (0, import_ethers4.hexlify)(value.contractId),
        stateRoot: (0, import_ethers4.hexlify)(value.stateRoot)
      };
    }
    default: {
      throw new import_errors3.FuelError(
        import_errors3.ErrorCode.INVALID_TRANSACTION_INPUT,
        `Invalid transaction output type: ${type}.`
      );
    }
  }
};

// src/transaction-request/transaction-request.ts
var import_address = require("@fuel-ts/address");
var import_configs6 = require("@fuel-ts/address/configs");
var import_math6 = require("@fuel-ts/math");
var import_transactions5 = require("@fuel-ts/transactions");
var import_ethers9 = require("ethers");

// src/resource.ts
var isRawCoin = (resource) => "utxoId" in resource;
var isRawMessage = (resource) => "recipient" in resource;
var isCoin = (resource) => "id" in resource;
var isMessage = (resource) => "recipient" in resource;

// src/utils/receipts.ts
var import_configs4 = require("@fuel-ts/address/configs");
var import_errors4 = require("@fuel-ts/errors");
var import_math4 = require("@fuel-ts/math");
var import_transactions3 = require("@fuel-ts/transactions");
var import_configs5 = require("@fuel-ts/transactions/configs");
var import_ethers5 = require("ethers");
var doesReceiptHaveMissingOutputVariables = (receipt) => receipt.type === import_transactions3.ReceiptType.Revert && receipt.val.toString("hex") === import_configs5.FAILED_TRANSFER_TO_ADDRESS_SIGNAL;
var doesReceiptHaveMissingContractId = (receipt) => receipt.type === import_transactions3.ReceiptType.Panic && receipt.contractId !== "0x0000000000000000000000000000000000000000000000000000000000000000";
var getReceiptsWithMissingData = (receipts) => receipts.reduce(
  (memo, receipt) => {
    if (doesReceiptHaveMissingOutputVariables(receipt)) {
      memo.missingOutputVariables.push(receipt);
    }
    if (doesReceiptHaveMissingContractId(receipt)) {
      memo.missingOutputContractIds.push(receipt);
    }
    return memo;
  },
  {
    missingOutputVariables: [],
    missingOutputContractIds: []
  }
);
var hexOrZero = (hex) => hex || import_configs4.ZeroBytes32;
function assembleReceiptByType(receipt) {
  const { receiptType } = receipt;
  switch (receiptType) {
    case "CALL" /* Call */: {
      const callReceipt = {
        type: import_transactions3.ReceiptType.Call,
        from: hexOrZero(receipt.contract?.id),
        to: hexOrZero(receipt?.to?.id),
        amount: (0, import_math4.bn)(receipt.amount),
        assetId: hexOrZero(receipt.assetId),
        gas: (0, import_math4.bn)(receipt.gas),
        param1: (0, import_math4.bn)(receipt.param1),
        param2: (0, import_math4.bn)(receipt.param2),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return callReceipt;
    }
    case "RETURN" /* Return */: {
      const returnReceipt = {
        type: import_transactions3.ReceiptType.Return,
        id: hexOrZero(receipt.contract?.id),
        val: (0, import_math4.bn)(receipt.val),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return returnReceipt;
    }
    case "RETURN_DATA" /* ReturnData */: {
      const returnDataReceipt = {
        type: import_transactions3.ReceiptType.ReturnData,
        id: hexOrZero(receipt.contract?.id),
        ptr: (0, import_math4.bn)(receipt.ptr),
        len: (0, import_math4.bn)(receipt.len),
        digest: hexOrZero(receipt.digest),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return returnDataReceipt;
    }
    case "PANIC" /* Panic */: {
      const panicReceipt = {
        type: import_transactions3.ReceiptType.Panic,
        id: hexOrZero(receipt.contract?.id),
        reason: (0, import_math4.bn)(receipt.reason),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is),
        contractId: hexOrZero(receipt.contractId)
      };
      return panicReceipt;
    }
    case "REVERT" /* Revert */: {
      const revertReceipt = {
        type: import_transactions3.ReceiptType.Revert,
        id: hexOrZero(receipt.contract?.id),
        val: (0, import_math4.bn)(receipt.ra),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return revertReceipt;
    }
    case "LOG" /* Log */: {
      const logReceipt = {
        type: import_transactions3.ReceiptType.Log,
        id: hexOrZero(receipt.contract?.id),
        val0: (0, import_math4.bn)(receipt.ra),
        val1: (0, import_math4.bn)(receipt.rb),
        val2: (0, import_math4.bn)(receipt.rc),
        val3: (0, import_math4.bn)(receipt.rd),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return logReceipt;
    }
    case "LOG_DATA" /* LogData */: {
      const logDataReceipt = {
        type: import_transactions3.ReceiptType.LogData,
        id: hexOrZero(receipt.contract?.id),
        val0: (0, import_math4.bn)(receipt.ra),
        val1: (0, import_math4.bn)(receipt.rb),
        ptr: (0, import_math4.bn)(receipt.ptr),
        len: (0, import_math4.bn)(receipt.len),
        digest: hexOrZero(receipt.digest),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return logDataReceipt;
    }
    case "TRANSFER" /* Transfer */: {
      const transferReceipt = {
        type: import_transactions3.ReceiptType.Transfer,
        from: hexOrZero(receipt.contract?.id),
        to: hexOrZero(receipt.toAddress || receipt?.to?.id),
        amount: (0, import_math4.bn)(receipt.amount),
        assetId: hexOrZero(receipt.assetId),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return transferReceipt;
    }
    case "TRANSFER_OUT" /* TransferOut */: {
      const transferOutReceipt = {
        type: import_transactions3.ReceiptType.TransferOut,
        from: hexOrZero(receipt.contract?.id),
        to: hexOrZero(receipt.toAddress || receipt.to?.id),
        amount: (0, import_math4.bn)(receipt.amount),
        assetId: hexOrZero(receipt.assetId),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return transferOutReceipt;
    }
    case "SCRIPT_RESULT" /* ScriptResult */: {
      const scriptResultReceipt = {
        type: import_transactions3.ReceiptType.ScriptResult,
        result: (0, import_math4.bn)(receipt.result),
        gasUsed: (0, import_math4.bn)(receipt.gasUsed)
      };
      return scriptResultReceipt;
    }
    case "MESSAGE_OUT" /* MessageOut */: {
      const sender = hexOrZero(receipt.sender);
      const recipient = hexOrZero(receipt.recipient);
      const nonce = hexOrZero(receipt.nonce);
      const amount = (0, import_math4.bn)(receipt.amount);
      const data = receipt.data ? (0, import_ethers5.getBytesCopy)(receipt.data) : Uint8Array.from([]);
      const digest = hexOrZero(receipt.digest);
      const messageId = import_transactions3.ReceiptMessageOutCoder.getMessageId({
        sender,
        recipient,
        nonce,
        amount,
        data
      });
      const receiptMessageOut = {
        type: import_transactions3.ReceiptType.MessageOut,
        sender,
        recipient,
        amount,
        nonce,
        data,
        digest,
        messageId
      };
      return receiptMessageOut;
    }
    case "MINT" /* Mint */: {
      const contractId = hexOrZero(receipt.contract?.id);
      const subId = hexOrZero(receipt.subId);
      const assetId = import_transactions3.ReceiptMintCoder.getAssetId(contractId, subId);
      const mintReceipt = {
        type: import_transactions3.ReceiptType.Mint,
        subId,
        contractId,
        assetId,
        val: (0, import_math4.bn)(receipt.val),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return mintReceipt;
    }
    case "BURN" /* Burn */: {
      const contractId = hexOrZero(receipt.contract?.id);
      const subId = hexOrZero(receipt.subId);
      const assetId = import_transactions3.ReceiptBurnCoder.getAssetId(contractId, subId);
      const burnReceipt = {
        type: import_transactions3.ReceiptType.Burn,
        subId,
        contractId,
        assetId,
        val: (0, import_math4.bn)(receipt.val),
        pc: (0, import_math4.bn)(receipt.pc),
        is: (0, import_math4.bn)(receipt.is)
      };
      return burnReceipt;
    }
    default:
      throw new import_errors4.FuelError(import_errors4.ErrorCode.INVALID_RECEIPT_TYPE, `Invalid receipt type: ${receiptType}.`);
  }
}

// src/utils/block-explorer.ts
var import_errors5 = require("@fuel-ts/errors");
var DEFAULT_BLOCK_EXPLORER_URL = "https://fuellabs.github.io/block-explorer-v2";
var getPathFromInput = (key, value) => {
  const pathMap = {
    address: `address`,
    txId: `transaction`,
    blockNumber: `block`
  };
  const path = pathMap[key] || key;
  return `${path}/${value}`;
};
var buildBlockExplorerUrl = (options = {}) => {
  const { blockExplorerUrl, path, providerUrl, address, txId, blockNumber } = options;
  const explorerUrl = blockExplorerUrl || DEFAULT_BLOCK_EXPLORER_URL;
  const customInputParams = [
    {
      key: "address",
      value: address
    },
    {
      key: "txId",
      value: txId
    },
    {
      key: "blockNumber",
      value: blockNumber
    }
  ];
  const definedValues = customInputParams.filter((param) => !!param.value).map(({ key, value }) => ({
    key,
    value
  }));
  const hasAnyDefinedValues = definedValues.length > 0;
  if (definedValues.length > 1) {
    throw new import_errors5.FuelError(
      import_errors5.ErrorCode.ERROR_BUILDING_BLOCK_EXPLORER_URL,
      `Only one of the following can be passed in to buildBlockExplorerUrl: ${customInputParams.map((param) => param.key).join(", ")}.`
    );
  }
  if (path && definedValues.length > 0) {
    const inputKeys = customInputParams.map(({ key }) => key).join(", ");
    throw new import_errors5.FuelError(
      import_errors5.ErrorCode.ERROR_BUILDING_BLOCK_EXPLORER_URL,
      `You cannot pass in a path to 'buildBlockExplorerUrl' along with any of the following: ${inputKeys}.`
    );
  }
  const pathGeneratedFromInputParams = hasAnyDefinedValues ? getPathFromInput(
    definedValues[0].key,
    definedValues[0].value
  ) : "";
  const trimSlashes = /^\/|\/$/gm;
  const cleanPath = path ? path.replace(trimSlashes, "") : pathGeneratedFromInputParams;
  const cleanBlockExplorerUrl = explorerUrl.replace(trimSlashes, "");
  const cleanProviderUrl = providerUrl?.replace(trimSlashes, "");
  const encodedProviderUrl = cleanProviderUrl ? encodeURIComponent(cleanProviderUrl) : void 0;
  const protocol = cleanBlockExplorerUrl.match(/^https?:\/\//) ? "" : "https://";
  const providerUrlProtocol = cleanProviderUrl?.match(/^https?:\/\//) ? "" : "https://";
  const url = `${protocol}${cleanBlockExplorerUrl}/${cleanPath}${encodedProviderUrl ? `?providerUrl=${providerUrlProtocol}${encodedProviderUrl}` : ""}`;
  return url;
};

// src/utils/gas.ts
var import_math5 = require("@fuel-ts/math");
var import_transactions4 = require("@fuel-ts/transactions");
var import_ethers6 = require("ethers");
var calculatePriceWithFactor = (gas, gasPrice, priceFactor) => (0, import_math5.bn)(Math.ceil(gas.mul(gasPrice).toNumber() / priceFactor.toNumber()));
var getGasUsedFromReceipts = (receipts) => {
  const scriptResult = receipts.filter(
    (receipt) => receipt.type === import_transactions4.ReceiptType.ScriptResult
  );
  const gasUsed = scriptResult.reduce((prev, receipt) => prev.add(receipt.gasUsed), (0, import_math5.bn)(0));
  return gasUsed;
};
function resolveGasDependentCosts(byteSize, gasDependentCost) {
  const base = (0, import_math5.bn)(gasDependentCost.base);
  let dependentValue = (0, import_math5.bn)(0);
  if (gasDependentCost.__typename === "LightOperation") {
    dependentValue = (0, import_math5.bn)(byteSize).div((0, import_math5.bn)(gasDependentCost.unitsPerGas));
  }
  if (gasDependentCost.__typename === "HeavyOperation") {
    dependentValue = (0, import_math5.bn)(byteSize).mul((0, import_math5.bn)(gasDependentCost.gasPerUnit));
  }
  return base.add(dependentValue);
}
function gasUsedByInputs(inputs, txBytesSize, gasCosts) {
  const witnessCache = [];
  const totalGas = inputs.reduce((total, input) => {
    if ("predicate" in input && input.predicate && input.predicate !== "0x") {
      return total.add(
        resolveGasDependentCosts(txBytesSize, gasCosts.vmInitialization).add(
          resolveGasDependentCosts((0, import_ethers6.getBytesCopy)(input.predicate).length, gasCosts.contractRoot)
        ).add((0, import_math5.bn)(input.predicateGasUsed))
      );
    }
    if ("witnessIndex" in input && !witnessCache.includes(input.witnessIndex)) {
      witnessCache.push(input.witnessIndex);
      return total.add(gasCosts.ecr1);
    }
    return total;
  }, (0, import_math5.bn)());
  return totalGas;
}
function getMinGas(params) {
  const { gasCosts, gasPerByte, inputs, metadataGas, txBytesSize } = params;
  const vmInitGas = resolveGasDependentCosts(txBytesSize, gasCosts.vmInitialization);
  const bytesGas = (0, import_math5.bn)(txBytesSize).mul(gasPerByte);
  const inputsGas = gasUsedByInputs(inputs, txBytesSize, gasCosts);
  const minGas = vmInitGas.add(bytesGas).add(inputsGas).add(metadataGas).maxU64();
  return minGas;
}
function getMaxGas(params) {
  const { gasPerByte, witnessesLength, witnessLimit, minGas, gasLimit = (0, import_math5.bn)(0) } = params;
  let remainingAllowedWitnessGas = (0, import_math5.bn)(0);
  if (witnessLimit?.gt(0) && witnessLimit.gte(witnessesLength)) {
    remainingAllowedWitnessGas = (0, import_math5.bn)(witnessLimit).sub(witnessesLength).mul(gasPerByte);
  }
  return remainingAllowedWitnessGas.add(minGas).add(gasLimit);
}
function calculateMetadataGasForTxCreate({
  gasCosts,
  stateRootSize,
  txBytesSize,
  contractBytesSize
}) {
  const contractRootGas = resolveGasDependentCosts(contractBytesSize, gasCosts.contractRoot);
  const stateRootGas = resolveGasDependentCosts(stateRootSize, gasCosts.stateRoot);
  const txIdGas = resolveGasDependentCosts(txBytesSize, gasCosts.s256);
  const contractIdInputSize = (0, import_math5.bn)(4 + 32 + 32 + 32);
  const contractIdGas = resolveGasDependentCosts(contractIdInputSize, gasCosts.s256);
  const metadataGas = contractRootGas.add(stateRootGas).add(txIdGas).add(contractIdGas);
  return metadataGas.maxU64();
}
function calculateMetadataGasForTxScript({
  gasCosts,
  txBytesSize
}) {
  return resolveGasDependentCosts(txBytesSize, gasCosts.s256);
}

// src/utils/json.ts
var import_ethers7 = require("ethers");
var import_ramda = require("ramda");
function normalize(object) {
  Object.keys(object).forEach((key) => {
    switch (object[key]?.constructor.name) {
      case "Uint8Array":
        object[key] = (0, import_ethers7.hexlify)(object[key]);
        break;
      case "Array":
        object[key] = normalize(object[key]);
        break;
      case "BN":
        object[key] = object[key].toHex();
        break;
      case "Address":
        object[key] = object[key].toB256();
        break;
      case "Object":
        object[key] = normalize(object[key]);
        break;
      default:
        break;
    }
  });
  return object;
}
function normalizeJSON(root) {
  return normalize((0, import_ramda.clone)(root));
}

// src/utils/sleep.ts
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

// src/utils/time.ts
var fromTai64ToUnix = (tai64Timestamp) => Number(BigInt(tai64Timestamp) - BigInt(2 ** 62) - BigInt(10));
var fromUnixToTai64 = (unixTimestampMs) => (BigInt(unixTimestampMs) + BigInt(2 ** 62) + BigInt(10)).toString();

// src/transaction-request/errors.ts
var ChangeOutputCollisionError = class extends Error {
  name = "ChangeOutputCollisionError";
  message = 'A ChangeOutput with the same "assetId" already exists for a different "to" address';
};
var NoWitnessAtIndexError = class extends Error {
  constructor(index) {
    super();
    this.index = index;
    this.message = `Witness at index "${index}" was not found`;
  }
  name = "NoWitnessAtIndexError";
};
var NoWitnessByOwnerError = class extends Error {
  constructor(owner) {
    super();
    this.owner = owner;
    this.message = `A witness for the given owner "${owner}" was not found`;
  }
  name = "NoWitnessByOwnerError";
};

// src/transaction-request/witness.ts
var import_ethers8 = require("ethers");
var witnessify = (value) => {
  const data = (0, import_ethers8.getBytesCopy)(value);
  return {
    data: (0, import_ethers8.hexlify)(data),
    dataLength: data.length
  };
};

// src/transaction-request/transaction-request.ts
var BaseTransactionRequest = class {
  /** Gas price for transaction */
  gasPrice;
  /** Block until which tx cannot be included */
  maturity;
  /** The maximum fee payable by this transaction using BASE_ASSET. */
  maxFee;
  /** The maximum amount of witness data allowed for the transaction */
  witnessLimit;
  /** List of inputs */
  inputs = [];
  /** List of outputs */
  outputs = [];
  /** List of witnesses */
  witnesses = [];
  /**
   * Constructor for initializing a base transaction request.
   *
   * @param baseTransactionRequest - Optional object containing properties to initialize the transaction request.
   */
  constructor({
    gasPrice,
    maturity,
    maxFee,
    witnessLimit,
    inputs,
    outputs,
    witnesses
  } = {}) {
    this.gasPrice = (0, import_math6.bn)(gasPrice);
    this.maturity = maturity ?? 0;
    this.witnessLimit = witnessLimit ? (0, import_math6.bn)(witnessLimit) : void 0;
    this.maxFee = maxFee ? (0, import_math6.bn)(maxFee) : void 0;
    this.inputs = inputs ?? [];
    this.outputs = outputs ?? [];
    this.witnesses = witnesses ?? [];
  }
  static getPolicyMeta(req) {
    let policyTypes = 0;
    const policies = [];
    if (req.gasPrice) {
      policyTypes += import_transactions5.PolicyType.GasPrice;
      policies.push({ data: req.gasPrice, type: import_transactions5.PolicyType.GasPrice });
    }
    if (req.witnessLimit) {
      policyTypes += import_transactions5.PolicyType.WitnessLimit;
      policies.push({ data: req.witnessLimit, type: import_transactions5.PolicyType.WitnessLimit });
    }
    if (req.maturity > 0) {
      policyTypes += import_transactions5.PolicyType.Maturity;
      policies.push({ data: req.maturity, type: import_transactions5.PolicyType.Maturity });
    }
    if (req.maxFee) {
      policyTypes += import_transactions5.PolicyType.MaxFee;
      policies.push({ data: req.maxFee, type: import_transactions5.PolicyType.MaxFee });
    }
    return {
      policyTypes,
      policies
    };
  }
  /**
   * Method to obtain the base transaction details.
   *
   * @returns The base transaction details.
   */
  getBaseTransaction() {
    const inputs = this.inputs?.map(inputify) ?? [];
    const outputs = this.outputs?.map(outputify) ?? [];
    const witnesses = this.witnesses?.map(witnessify) ?? [];
    const { policyTypes, policies } = BaseTransactionRequest.getPolicyMeta(this);
    return {
      policyTypes,
      inputs,
      outputs,
      policies,
      witnesses,
      inputsCount: inputs.length,
      outputsCount: outputs.length,
      witnessesCount: witnesses.length
    };
  }
  /**
   * Converts the transaction request to a byte array.
   *
   * @returns The transaction bytes.
   */
  toTransactionBytes() {
    return new import_transactions5.TransactionCoder().encode(this.toTransaction());
  }
  /**
   * @hidden
   *
   * Pushes an input to the list without any side effects and returns the index
   */
  pushInput(input) {
    this.inputs.push(input);
    return this.inputs.length - 1;
  }
  /**
   * @hidden
   *
   * Pushes an output to the list without any side effects and returns the index
   */
  pushOutput(output) {
    this.outputs.push(output);
    return this.outputs.length - 1;
  }
  /**
   * @hidden
   *
   * Creates an empty witness without any side effects and returns the index
   */
  createWitness() {
    this.witnesses.push((0, import_ethers9.concat)([import_configs6.ZeroBytes32, import_configs6.ZeroBytes32]));
    return this.witnesses.length - 1;
  }
  /**
   * Updates the witness for a given owner and signature.
   *
   * @param address - The address to get the coin input witness index for.
   * @param signature - The signature to update the witness with.
   */
  updateWitnessByOwner(address, signature) {
    const witnessIndex = this.getCoinInputWitnessIndexByOwner(address);
    if (typeof witnessIndex === "number") {
      this.updateWitness(witnessIndex, signature);
    }
  }
  /**
   * Updates an existing witness without any side effects.
   *
   * @param index - The index of the witness to update.
   * @param witness - The new witness.
   * @throws If the witness does not exist.
   */
  updateWitness(index, witness) {
    if (!this.witnesses[index]) {
      throw new NoWitnessAtIndexError(index);
    }
    this.witnesses[index] = witness;
  }
  /**
   * Gets the coin inputs for a transaction.
   *
   * @returns The coin inputs.
   */
  getCoinInputs() {
    return this.inputs.filter(
      (input) => input.type === import_transactions5.InputType.Coin
    );
  }
  /**
   * Gets the coin outputs for a transaction.
   *
   * @returns The coin outputs.
   */
  getCoinOutputs() {
    return this.outputs.filter(
      (output) => output.type === import_transactions5.OutputType.Coin
    );
  }
  /**
   * Gets the change outputs for a transaction.
   *
   * @returns The change outputs.
   */
  getChangeOutputs() {
    return this.outputs.filter(
      (output) => output.type === import_transactions5.OutputType.Change
    );
  }
  /**
   * @hidden
   *
   * Returns the witnessIndex of the found CoinInput.
   */
  getCoinInputWitnessIndexByOwner(owner) {
    const ownerAddress = (0, import_address.addressify)(owner);
    const found = this.inputs.find((input) => {
      switch (input.type) {
        case import_transactions5.InputType.Coin:
          return (0, import_ethers9.hexlify)(input.owner) === ownerAddress.toB256();
        case import_transactions5.InputType.Message:
          return (0, import_ethers9.hexlify)(input.recipient) === ownerAddress.toB256();
        default:
          return false;
      }
    });
    return found?.witnessIndex;
  }
  /**
   * Adds a single coin input to the transaction and a change output for the related
   * assetId, if one it was not added yet.
   *
   * @param coin - Coin resource.
   * @param predicate - Predicate bytes.
   * @param predicateData - Predicate data bytes.
   */
  addCoinInput(coin, predicate) {
    const { assetId, owner, amount } = coin;
    let witnessIndex;
    if (predicate) {
      witnessIndex = 0;
    } else {
      witnessIndex = this.getCoinInputWitnessIndexByOwner(owner);
      if (typeof witnessIndex !== "number") {
        witnessIndex = this.createWitness();
      }
    }
    const input = {
      ...coin,
      type: import_transactions5.InputType.Coin,
      owner: owner.toB256(),
      amount,
      assetId,
      txPointer: "0x00000000000000000000000000000000",
      witnessIndex,
      predicate: predicate?.bytes,
      predicateData: predicate?.predicateData
    };
    this.pushInput(input);
    this.addChangeOutput(owner, assetId);
  }
  /**
   * Adds a single message input to the transaction and a change output for the
   * baseAssetId, if one it was not added yet.
   *
   * @param message - Message resource.
   * @param predicate - Predicate bytes.
   * @param predicateData - Predicate data bytes.
   */
  addMessageInput(message, predicate) {
    const { recipient, sender, amount } = message;
    const assetId = import_configs6.BaseAssetId;
    let witnessIndex;
    if (predicate) {
      witnessIndex = 0;
    } else {
      witnessIndex = this.getCoinInputWitnessIndexByOwner(recipient);
      if (typeof witnessIndex !== "number") {
        witnessIndex = this.createWitness();
      }
    }
    const input = {
      ...message,
      type: import_transactions5.InputType.Message,
      sender: sender.toB256(),
      recipient: recipient.toB256(),
      amount,
      witnessIndex,
      predicate: predicate?.bytes,
      predicateData: predicate?.predicateData
    };
    this.pushInput(input);
    this.addChangeOutput(recipient, assetId);
  }
  /**
   * Adds a single resource to the transaction by adding a coin/message input and a
   * change output for the related assetId, if one it was not added yet.
   *
   * @param resource - The resource to add.
   * @returns This transaction.
   */
  addResource(resource) {
    if (isCoin(resource)) {
      this.addCoinInput(resource);
    } else {
      this.addMessageInput(resource);
    }
    return this;
  }
  /**
   * Adds multiple resources to the transaction by adding coin/message inputs and change
   * outputs from the related assetIds.
   *
   * @param resources - The resources to add.
   * @returns This transaction.
   */
  addResources(resources) {
    resources.forEach((resource) => this.addResource(resource));
    return this;
  }
  /**
   * Adds multiple resources to the transaction by adding coin/message inputs and change
   * outputs from the related assetIds.
   *
   * @param resources - The resources to add.
   * @returns This transaction.
   */
  addPredicateResource(resource, predicate) {
    if (isCoin(resource)) {
      this.addCoinInput(resource, predicate);
    } else {
      this.addMessageInput(resource, predicate);
    }
    return this;
  }
  /**
   * Adds multiple predicate coin/message inputs to the transaction and change outputs
   * from the related assetIds.
   *
   * @param resources - The resources to add.
   * @returns This transaction.
   */
  addPredicateResources(resources, predicate) {
    resources.forEach((resource) => this.addPredicateResource(resource, predicate));
    return this;
  }
  /**
   * Adds a coin output to the transaction.
   *
   * @param to - Address of the owner.
   * @param amount - Amount of coin.
   * @param assetId - Asset ID of coin.
   */
  addCoinOutput(to, amount, assetId = import_configs6.BaseAssetId) {
    this.pushOutput({
      type: import_transactions5.OutputType.Coin,
      to: (0, import_address.addressify)(to).toB256(),
      amount,
      assetId
    });
    return this;
  }
  /**
   * Adds multiple coin outputs to the transaction.
   *
   * @param to - Address of the destination.
   * @param quantities - Quantities of coins.
   */
  addCoinOutputs(to, quantities) {
    quantities.map(coinQuantityfy).forEach((quantity) => {
      this.pushOutput({
        type: import_transactions5.OutputType.Coin,
        to: (0, import_address.addressify)(to).toB256(),
        amount: quantity.amount,
        assetId: quantity.assetId
      });
    });
    return this;
  }
  /**
   * Adds a change output to the transaction.
   *
   * @param to - Address of the owner.
   * @param assetId - Asset ID of coin.
   */
  addChangeOutput(to, assetId = import_configs6.BaseAssetId) {
    const changeOutput = this.getChangeOutputs().find(
      (output) => (0, import_ethers9.hexlify)(output.assetId) === assetId
    );
    if (!changeOutput) {
      this.pushOutput({
        type: import_transactions5.OutputType.Change,
        to: (0, import_address.addressify)(to).toB256(),
        assetId
      });
    }
  }
  /**
   * @hidden
   */
  byteSize() {
    return this.toTransactionBytes().length;
  }
  /**
   * @hidden
   */
  metadataGas(_gasCosts) {
    throw new Error("Not implemented");
  }
  /**
   * @hidden
   */
  calculateMinGas(chainInfo) {
    const { gasCosts, consensusParameters } = chainInfo;
    const { gasPerByte } = consensusParameters;
    return getMinGas({
      gasPerByte,
      gasCosts,
      inputs: this.inputs,
      txBytesSize: this.byteSize(),
      metadataGas: this.metadataGas(gasCosts)
    });
  }
  calculateMaxGas(chainInfo, minGas) {
    const { consensusParameters } = chainInfo;
    const { gasPerByte } = consensusParameters;
    const witnessesLength = this.toTransaction().witnesses.reduce(
      (acc, wit) => acc + wit.dataLength,
      0
    );
    return getMaxGas({
      gasPerByte,
      minGas,
      witnessesLength,
      witnessLimit: this.witnessLimit
    });
  }
  /**
   * Funds the transaction with fake UTXOs for each assetId and amount in the
   * quantities array.
   *
   * @param quantities - CoinQuantity Array.
   */
  fundWithFakeUtxos(quantities) {
    const hasBaseAssetId = quantities.some(({ assetId }) => assetId === import_configs6.BaseAssetId);
    if (!hasBaseAssetId) {
      quantities.push({ assetId: import_configs6.BaseAssetId, amount: (0, import_math6.bn)(1) });
    }
    const owner = (0, import_address.getRandomB256)();
    const witnessToRemove = this.inputs.reduce(
      (acc, input) => {
        if (input.type === import_transactions5.InputType.Coin || input.type === import_transactions5.InputType.Message) {
          if (!acc[input.witnessIndex]) {
            acc[input.witnessIndex] = true;
          }
        }
        return acc;
      },
      {}
    );
    this.witnesses = this.witnesses.filter((_, idx) => !witnessToRemove[idx]);
    this.inputs = this.inputs.filter((input) => input.type === import_transactions5.InputType.Contract);
    this.outputs = this.outputs.filter((output) => output.type !== import_transactions5.OutputType.Change);
    const fakeResources = quantities.map(({ assetId, amount }, idx) => ({
      id: `${import_configs6.ZeroBytes32}0${idx}`,
      amount,
      assetId,
      owner: import_address.Address.fromB256(owner),
      maturity: 0,
      blockCreated: (0, import_math6.bn)(1),
      txCreatedIdx: (0, import_math6.bn)(1)
    }));
    this.addResources(fakeResources);
  }
  /**
   * Retrieves an array of CoinQuantity for each coin output present in the transaction.
   * a transaction.
   *
   * @returns  CoinQuantity array.
   */
  getCoinOutputsQuantities() {
    const coinsQuantities = this.getCoinOutputs().map(({ amount, assetId }) => ({
      amount: (0, import_math6.bn)(amount),
      assetId: assetId.toString()
    }));
    return coinsQuantities;
  }
  /**
   * Return the minimum amount in native coins required to create
   * a transaction.
   *
   * @returns The transaction as a JSON object.
   */
  toJSON() {
    return normalizeJSON(this);
  }
  /**
   * @hidden
   *
   * Determines whether the transaction has a predicate input.
   *
   * @returns Whether the transaction has a predicate input.
   */
  hasPredicateInput() {
    return Boolean(
      this.inputs.find(
        (input) => "predicate" in input && input.predicate && input.predicate !== (0, import_ethers9.getBytesCopy)("0x")
      )
    );
  }
};

// src/transaction-request/create-transaction-request.ts
var import_configs8 = require("@fuel-ts/address/configs");
var import_math8 = require("@fuel-ts/math");
var import_transactions7 = require("@fuel-ts/transactions");
var import_ethers12 = require("ethers");

// src/transaction-request/hash-transaction.ts
var import_configs7 = require("@fuel-ts/address/configs");
var import_hasher = require("@fuel-ts/hasher");
var import_math7 = require("@fuel-ts/math");
var import_transactions6 = require("@fuel-ts/transactions");
var import_ethers10 = require("ethers");
var import_ramda2 = require("ramda");
function hashTransaction(transactionRequest, chainId) {
  const transaction = transactionRequest.toTransaction();
  if (transaction.type === import_transactions6.TransactionType.Script) {
    transaction.receiptsRoot = import_configs7.ZeroBytes32;
  }
  transaction.inputs = transaction.inputs.map((input) => {
    const inputClone = (0, import_ramda2.clone)(input);
    switch (inputClone.type) {
      case import_transactions6.InputType.Coin: {
        inputClone.txPointer = {
          blockHeight: 0,
          txIndex: 0
        };
        inputClone.predicateGasUsed = (0, import_math7.bn)(0);
        return inputClone;
      }
      case import_transactions6.InputType.Message: {
        inputClone.predicateGasUsed = (0, import_math7.bn)(0);
        return inputClone;
      }
      case import_transactions6.InputType.Contract: {
        inputClone.txPointer = {
          blockHeight: 0,
          txIndex: 0
        };
        inputClone.txID = import_configs7.ZeroBytes32;
        inputClone.outputIndex = 0;
        inputClone.balanceRoot = import_configs7.ZeroBytes32;
        inputClone.stateRoot = import_configs7.ZeroBytes32;
        return inputClone;
      }
      default:
        return inputClone;
    }
  });
  transaction.outputs = transaction.outputs.map((output) => {
    const outputClone = (0, import_ramda2.clone)(output);
    switch (outputClone.type) {
      case import_transactions6.OutputType.Contract: {
        outputClone.balanceRoot = import_configs7.ZeroBytes32;
        outputClone.stateRoot = import_configs7.ZeroBytes32;
        return outputClone;
      }
      case import_transactions6.OutputType.Change: {
        outputClone.amount = (0, import_math7.bn)(0);
        return outputClone;
      }
      case import_transactions6.OutputType.Variable: {
        outputClone.to = import_configs7.ZeroBytes32;
        outputClone.amount = (0, import_math7.bn)(0);
        outputClone.assetId = import_configs7.ZeroBytes32;
        return outputClone;
      }
      default:
        return outputClone;
    }
  });
  transaction.witnessesCount = 0;
  transaction.witnesses = [];
  const chainIdBytes = (0, import_hasher.uint64ToBytesBE)(chainId);
  const concatenatedData = (0, import_ethers10.concat)([chainIdBytes, new import_transactions6.TransactionCoder().encode(transaction)]);
  return (0, import_ethers10.sha256)(concatenatedData);
}

// src/transaction-request/storage-slot.ts
var import_ethers11 = require("ethers");
var getStorageValue = (value) => {
  const v = new Uint8Array(32);
  v.set((0, import_ethers11.getBytesCopy)(value));
  return v;
};
var storageSlotify = (storageSlot) => {
  let key;
  let value;
  if (Array.isArray(storageSlot)) {
    key = storageSlot[0];
    value = storageSlot[1];
  } else {
    key = storageSlot.key;
    value = storageSlot.value;
  }
  return {
    key: (0, import_ethers11.hexlify)(key),
    value: (0, import_ethers11.hexlify)(getStorageValue(value))
  };
};

// src/transaction-request/create-transaction-request.ts
var CreateTransactionRequest = class extends BaseTransactionRequest {
  static from(obj) {
    if (obj instanceof this) {
      return obj;
    }
    return new this(obj);
  }
  /** Type of the transaction */
  type = import_transactions7.TransactionType.Create;
  /** Witness index of contract bytecode to create */
  bytecodeWitnessIndex;
  /** Salt */
  salt;
  /** List of storage slots to initialize */
  storageSlots;
  /**
   * Creates an instance `CreateTransactionRequest`.
   *
   * @param createTransactionRequestLike - The initial values for the instance
   */
  constructor({
    bytecodeWitnessIndex,
    salt,
    storageSlots,
    ...rest
  } = {}) {
    super(rest);
    this.bytecodeWitnessIndex = bytecodeWitnessIndex ?? 0;
    this.salt = (0, import_ethers12.hexlify)(salt ?? import_configs8.ZeroBytes32);
    this.storageSlots = [...storageSlots ?? []];
  }
  /**
   * Converts the transaction request to a `TransactionCreate`.
   *
   * @returns The transaction create object.
   */
  toTransaction() {
    const baseTransaction = this.getBaseTransaction();
    const bytecodeWitnessIndex = this.bytecodeWitnessIndex;
    const storageSlots = this.storageSlots?.map(storageSlotify) ?? [];
    return {
      type: import_transactions7.TransactionType.Create,
      ...baseTransaction,
      bytecodeLength: baseTransaction.witnesses[bytecodeWitnessIndex].dataLength / 4,
      bytecodeWitnessIndex,
      storageSlotsCount: storageSlots.length,
      salt: this.salt ? (0, import_ethers12.hexlify)(this.salt) : import_configs8.ZeroBytes32,
      storageSlots
    };
  }
  /**
   * Get contract created outputs for the transaction.
   *
   * @returns An array of contract created transaction request outputs.
   */
  getContractCreatedOutputs() {
    return this.outputs.filter(
      (output) => output.type === import_transactions7.OutputType.ContractCreated
    );
  }
  /**
   * Gets the Transaction Request by hashing the transaction.
   *
   * @param chainId - The chain ID.
   *
   * @returns - A hash of the transaction, which is the transaction ID.
   */
  getTransactionId(chainId) {
    return hashTransaction(this, chainId);
  }
  /**
   * Adds a contract created output to the transaction request.
   *
   * @param contractId - The contract ID.
   * @param stateRoot - The state root.
   */
  addContractCreatedOutput(contractId, stateRoot) {
    this.pushOutput({
      type: import_transactions7.OutputType.ContractCreated,
      contractId,
      stateRoot
    });
  }
  metadataGas(gasCosts) {
    return calculateMetadataGasForTxCreate({
      contractBytesSize: (0, import_math8.bn)((0, import_ethers12.getBytesCopy)(this.witnesses[this.bytecodeWitnessIndex] || "0x").length),
      gasCosts,
      stateRootSize: this.storageSlots.length,
      txBytesSize: this.byteSize()
    });
  }
};

// src/transaction-request/script-transaction-request.ts
var import_abi_coder = require("@fuel-ts/abi-coder");
var import_address2 = require("@fuel-ts/address");
var import_configs9 = require("@fuel-ts/address/configs");
var import_math9 = require("@fuel-ts/math");
var import_transactions8 = require("@fuel-ts/transactions");
var import_ethers14 = require("ethers");

// src/transaction-request/scripts.ts
var import_ethers13 = require("ethers");
var returnZeroScript = {
  /*
      Opcode::RET(REG_ZERO)
      Opcode::NOOP
    */
  // TODO: Don't use hardcoded scripts: https://github.com/FuelLabs/fuels-ts/issues/281
  bytes: (0, import_ethers13.getBytesCopy)("0x24000000"),
  encodeScriptData: () => new Uint8Array(0)
};
var withdrawScript = {
  /*
          The following code loads some basic values into registers and calls SMO to create an output message
          5040C010 	- ADDI r16 $is i16   [r16 now points to memory 16 bytes from the start of this program (start of receiver data)]
          5D44C006	- LW r17 $is i6      [r17 set to the 6th word in this program (6*8=48 bytes from the start of this program)]
          4C400011	- SMO r16 r0 r0 r17  [send message out to address starting at memory position r16 with amount in r17]
          24000000	- RET                [return 0]
          00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 [recipient address]
          00000000 00000000 [amount value]
      */
  // TODO: Don't use hardcoded scripts: https://github.com/FuelLabs/fuels-ts/issues/281
  bytes: (0, import_ethers13.getBytesCopy)("0x5040C0105D44C0064C40001124000000"),
  encodeScriptData: () => new Uint8Array(0)
};

// src/transaction-request/script-transaction-request.ts
var ScriptTransactionRequest = class extends BaseTransactionRequest {
  static from(obj) {
    if (obj instanceof this) {
      return obj;
    }
    return new this(obj);
  }
  /** Type of the transaction */
  type = import_transactions8.TransactionType.Script;
  /** Gas limit for transaction */
  gasLimit;
  /** Script to execute */
  script;
  /** Script input data (parameters) */
  scriptData;
  /**
   * Constructor for `ScriptTransactionRequest`.
   *
   * @param scriptTransactionRequestLike - The initial values for the instance.
   */
  constructor({ script, scriptData, gasLimit, ...rest } = {}) {
    super(rest);
    this.gasLimit = (0, import_math9.bn)(gasLimit);
    this.script = (0, import_ethers14.getBytesCopy)(script ?? returnZeroScript.bytes);
    this.scriptData = (0, import_ethers14.getBytesCopy)(scriptData ?? returnZeroScript.encodeScriptData());
  }
  /**
   * Converts the transaction request to a `TransactionScript`.
   *
   * @returns The transaction script object.
   */
  toTransaction() {
    const script = (0, import_ethers14.getBytesCopy)(this.script ?? "0x");
    const scriptData = (0, import_ethers14.getBytesCopy)(this.scriptData ?? "0x");
    return {
      type: import_transactions8.TransactionType.Script,
      scriptGasLimit: this.gasLimit,
      ...super.getBaseTransaction(),
      scriptLength: script.length,
      scriptDataLength: scriptData.length,
      receiptsRoot: import_configs9.ZeroBytes32,
      script: (0, import_ethers14.hexlify)(script),
      scriptData: (0, import_ethers14.hexlify)(scriptData)
    };
  }
  /**
   * Get contract inputs for the transaction.
   *
   * @returns An array of contract transaction request inputs.
   */
  getContractInputs() {
    return this.inputs.filter(
      (input) => input.type === import_transactions8.InputType.Contract
    );
  }
  /**
   * Get contract outputs for the transaction.
   *
   * @returns An array of contract transaction request outputs.
   */
  getContractOutputs() {
    return this.outputs.filter(
      (output) => output.type === import_transactions8.OutputType.Contract
    );
  }
  /**
   * Get variable outputs for the transaction.
   *
   * @returns An array of variable transaction request outputs.
   */
  getVariableOutputs() {
    return this.outputs.filter(
      (output) => output.type === import_transactions8.OutputType.Variable
    );
  }
  /**
   * Set the script and its data.
   *
   * @param script - The abstract script request.
   * @param data - The script data.
   */
  setScript(script, data) {
    this.scriptData = script.encodeScriptData(data);
    this.script = script.bytes;
  }
  /**
   * Adds variable outputs to the transaction request.
   *
   * @param numberOfVariables - The number of variables to add.
   * @returns The new length of the outputs array.
   */
  addVariableOutputs(numberOfVariables = 1) {
    let outputsNumber = numberOfVariables;
    while (outputsNumber) {
      this.pushOutput({
        type: import_transactions8.OutputType.Variable
      });
      outputsNumber -= 1;
    }
    return this.outputs.length - 1;
  }
  calculateMaxGas(chainInfo, minGas) {
    const { consensusParameters } = chainInfo;
    const { gasPerByte } = consensusParameters;
    const witnessesLength = this.toTransaction().witnesses.reduce(
      (acc, wit) => acc + wit.dataLength,
      0
    );
    return getMaxGas({
      gasPerByte,
      minGas,
      witnessesLength,
      witnessLimit: this.witnessLimit,
      gasLimit: this.gasLimit
    });
  }
  /**
   * Adds a contract input and output to the transaction request.
   *
   * @param contract - The contract ID.
   * @returns The current instance of the `ScriptTransactionRequest`.
   */
  addContractInputAndOutput(contract) {
    const contractAddress = (0, import_address2.addressify)(contract);
    if (this.getContractInputs().find((i) => i.contractId === contractAddress.toB256())) {
      return this;
    }
    const inputIndex = super.pushInput({
      type: import_transactions8.InputType.Contract,
      contractId: contractAddress.toB256(),
      txPointer: "0x00000000000000000000000000000000"
    });
    this.pushOutput({
      type: import_transactions8.OutputType.Contract,
      inputIndex
    });
    return this;
  }
  /**
   * Gets the Transaction Request by hashing the transaction.
   *
   * @param chainId - The chain ID.
   *
   * @returns - A hash of the transaction, which is the transaction ID.
   */
  getTransactionId(chainId) {
    return hashTransaction(this, chainId);
  }
  /**
   * Sets the data for the transaction request.
   *
   * @param abi - Script JSON ABI.
   * @param args - The input arguments.
   * @returns The current instance of the `ScriptTransactionRequest`.
   */
  setData(abi, args) {
    const abiInterface = new import_abi_coder.Interface(abi);
    this.scriptData = abiInterface.functions.main.encodeArguments(args);
    return this;
  }
  metadataGas(gasCosts) {
    return calculateMetadataGasForTxScript({
      gasCosts,
      txBytesSize: this.byteSize()
    });
  }
};

// src/transaction-request/utils.ts
var import_errors7 = require("@fuel-ts/errors");
var import_transactions9 = require("@fuel-ts/transactions");
var transactionRequestify = (obj) => {
  if (obj instanceof ScriptTransactionRequest || obj instanceof CreateTransactionRequest) {
    return obj;
  }
  const { type } = obj;
  switch (obj.type) {
    case import_transactions9.TransactionType.Script: {
      return ScriptTransactionRequest.from(obj);
    }
    case import_transactions9.TransactionType.Create: {
      return CreateTransactionRequest.from(obj);
    }
    default: {
      throw new import_errors7.FuelError(import_errors7.ErrorCode.INVALID_TRANSACTION_TYPE, `Invalid transaction type: ${type}.`);
    }
  }
};

// src/transaction-response/transaction-response.ts
var import_errors11 = require("@fuel-ts/errors");
var import_math13 = require("@fuel-ts/math");
var import_transactions15 = require("@fuel-ts/transactions");
var import_ethers17 = require("ethers");

// src/transaction-summary/assemble-transaction-summary.ts
var import_ethers16 = require("ethers");

// src/transaction-summary/calculate-transaction-fee.ts
var import_math10 = require("@fuel-ts/math");
var import_transactions10 = require("@fuel-ts/transactions");
var import_ethers15 = require("ethers");
var calculateTransactionFee = (params) => {
  const {
    gasUsed,
    rawPayload,
    consensusParameters: { gasCosts, feeParams }
  } = params;
  const gasPerByte = (0, import_math10.bn)(feeParams.gasPerByte);
  const gasPriceFactor = (0, import_math10.bn)(feeParams.gasPriceFactor);
  const transactionBytes = (0, import_ethers15.getBytesCopy)(rawPayload);
  const [transaction] = new import_transactions10.TransactionCoder().decode(transactionBytes, 0);
  if (transaction.type === import_transactions10.TransactionType.Mint) {
    return {
      fee: (0, import_math10.bn)(0),
      minFee: (0, import_math10.bn)(0),
      maxFee: (0, import_math10.bn)(0),
      feeFromGasUsed: (0, import_math10.bn)(0)
    };
  }
  const { type, witnesses, inputs, policies } = transaction;
  let metadataGas = (0, import_math10.bn)(0);
  let gasLimit = (0, import_math10.bn)(0);
  if (type === import_transactions10.TransactionType.Create) {
    const { bytecodeWitnessIndex, storageSlots } = transaction;
    const contractBytesSize = (0, import_math10.bn)((0, import_ethers15.getBytesCopy)(witnesses[bytecodeWitnessIndex].data).length);
    metadataGas = calculateMetadataGasForTxCreate({
      contractBytesSize,
      gasCosts,
      stateRootSize: storageSlots.length || 0,
      txBytesSize: transactionBytes.length
    });
  } else {
    const { scriptGasLimit } = transaction;
    if (scriptGasLimit) {
      gasLimit = scriptGasLimit;
    }
    metadataGas = calculateMetadataGasForTxScript({
      gasCosts,
      txBytesSize: transactionBytes.length
    });
  }
  const minGas = getMinGas({
    gasCosts,
    gasPerByte: (0, import_math10.bn)(gasPerByte),
    inputs,
    metadataGas,
    txBytesSize: transactionBytes.length
  });
  const gasPrice = (0, import_math10.bn)(policies.find((policy) => policy.type === import_transactions10.PolicyType.GasPrice)?.data);
  const witnessLimit = policies.find((policy) => policy.type === import_transactions10.PolicyType.WitnessLimit)?.data;
  const witnessesLength = witnesses.reduce((acc, wit) => acc + wit.dataLength, 0);
  const maxGas = getMaxGas({
    gasPerByte,
    minGas,
    witnessesLength,
    gasLimit,
    witnessLimit
  });
  const feeFromGasUsed = calculatePriceWithFactor(gasUsed, gasPrice, gasPriceFactor);
  const minFee = calculatePriceWithFactor(minGas, gasPrice, gasPriceFactor);
  const maxFee = calculatePriceWithFactor(maxGas, gasPrice, gasPriceFactor);
  const fee = minFee.add(feeFromGasUsed);
  return {
    fee,
    minFee,
    maxFee,
    feeFromGasUsed
  };
};

// src/transaction-summary/date.ts
var import_tai64 = require("tai64");
var fromTai64ToDate = (tai64Timestamp) => {
  const timestamp = import_tai64.TAI64.fromString(tai64Timestamp, 10).toUnix();
  return new Date(timestamp * 1e3);
};
var fromDateToTai64 = (date) => import_tai64.TAI64.fromUnix(Math.floor(date.getTime() / 1e3)).toString(10);

// src/transaction-summary/operations.ts
var import_errors9 = require("@fuel-ts/errors");
var import_math12 = require("@fuel-ts/math");
var import_transactions13 = require("@fuel-ts/transactions");

// src/transaction-summary/call.ts
var import_abi_coder2 = require("@fuel-ts/abi-coder");
var import_math11 = require("@fuel-ts/math");
var getFunctionCall = ({ abi, receipt, rawPayload, maxInputs }) => {
  const abiInterface = new import_abi_coder2.Interface(abi);
  const callFunctionSelector = receipt.param1.toHex(8);
  const functionFragment = abiInterface.getFunction(callFunctionSelector);
  const inputs = functionFragment.jsonFn.inputs;
  let encodedArgs;
  if (functionFragment.isInputDataPointer) {
    if (rawPayload) {
      const argsOffset = (0, import_math11.bn)(receipt.param2).sub((0, import_abi_coder2.calculateVmTxMemory)({ maxInputs: maxInputs.toNumber() })).toNumber();
      encodedArgs = `0x${rawPayload.slice(2).slice(argsOffset * 2)}`;
    }
  } else {
    encodedArgs = receipt.param2.toHex();
  }
  let argumentsProvided;
  if (encodedArgs) {
    const data = functionFragment.decodeArguments(encodedArgs);
    if (data) {
      argumentsProvided = inputs.reduce((prev, input, index) => {
        const value = data[index];
        const name = input.name;
        if (name) {
          return {
            ...prev,
            // reparse to remove bn
            [name]: JSON.parse(JSON.stringify(value))
          };
        }
        return prev;
      }, {});
    }
  }
  const call = {
    functionSignature: functionFragment.signature,
    functionName: functionFragment.name,
    argumentsProvided,
    ...receipt.amount?.isZero() ? {} : { amount: receipt.amount, assetId: receipt.assetId }
  };
  return call;
};

// src/transaction-summary/input.ts
var import_errors8 = require("@fuel-ts/errors");
var import_transactions11 = require("@fuel-ts/transactions");
function getInputsByType(inputs, type) {
  return inputs.filter((i) => i.type === type);
}
function getInputsCoin(inputs) {
  return getInputsByType(inputs, import_transactions11.InputType.Coin);
}
function getInputsMessage(inputs) {
  return getInputsByType(inputs, import_transactions11.InputType.Message);
}
function getInputsContract(inputs) {
  return getInputsByType(inputs, import_transactions11.InputType.Contract);
}
function getInputFromAssetId(inputs, assetId) {
  const coinInputs = getInputsCoin(inputs);
  const messageInputs = getInputsMessage(inputs);
  const coinInput = coinInputs.find((i) => i.assetId === assetId);
  const messageInput = messageInputs.find(
    (_) => assetId === "0x0000000000000000000000000000000000000000000000000000000000000000"
  );
  return coinInput || messageInput;
}
function getInputContractFromIndex(inputs, inputIndex) {
  if (inputIndex == null) {
    return void 0;
  }
  const contractInput = inputs?.[inputIndex];
  if (!contractInput) {
    return void 0;
  }
  if (contractInput.type !== import_transactions11.InputType.Contract) {
    throw new import_errors8.FuelError(
      import_errors8.ErrorCode.INVALID_TRANSACTION_INPUT,
      `Contract input should be of type 'contract'.`
    );
  }
  return contractInput;
}
function getInputAccountAddress(input) {
  if (input.type === import_transactions11.InputType.Coin) {
    return input.owner.toString();
  }
  if (input.type === import_transactions11.InputType.Message) {
    return input.recipient.toString();
  }
  return "";
}

// src/transaction-summary/output.ts
var import_transactions12 = require("@fuel-ts/transactions");
function getOutputsByType(outputs, type) {
  return outputs.filter((o) => o.type === type);
}
function getOutputsContractCreated(outputs) {
  return getOutputsByType(outputs, import_transactions12.OutputType.ContractCreated);
}
function getOutputsCoin(outputs) {
  return getOutputsByType(outputs, import_transactions12.OutputType.Coin);
}
function getOutputsChange(outputs) {
  return getOutputsByType(outputs, import_transactions12.OutputType.Change);
}
function getOutputsContract(outputs) {
  return getOutputsByType(outputs, import_transactions12.OutputType.Contract);
}
function getOutputsVariable(outputs) {
  return getOutputsByType(outputs, import_transactions12.OutputType.Variable);
}

// src/transaction-summary/types.ts
var TransactionTypeName = /* @__PURE__ */ ((TransactionTypeName2) => {
  TransactionTypeName2["Create"] = "Create";
  TransactionTypeName2["Mint"] = "Mint";
  TransactionTypeName2["Script"] = "Script";
  return TransactionTypeName2;
})(TransactionTypeName || {});
var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
  TransactionStatus2["submitted"] = "submitted";
  TransactionStatus2["success"] = "success";
  TransactionStatus2["squeezedout"] = "squeezedout";
  TransactionStatus2["failure"] = "failure";
  return TransactionStatus2;
})(TransactionStatus || {});
var OperationName = /* @__PURE__ */ ((OperationName2) => {
  OperationName2["payBlockProducer"] = "Pay network fee to block producer";
  OperationName2["contractCreated"] = "Contract created";
  OperationName2["transfer"] = "Transfer asset";
  OperationName2["contractCall"] = "Contract call";
  OperationName2["contractTransfer"] = "Contract transfer";
  OperationName2["receive"] = "Receive asset";
  OperationName2["mint"] = "Mint asset";
  OperationName2["predicatecall"] = "Predicate call";
  OperationName2["script"] = "Script";
  OperationName2["sent"] = "Sent asset";
  OperationName2["withdrawFromFuel"] = "Withdraw from Fuel";
  return OperationName2;
})(OperationName || {});
var AddressType = /* @__PURE__ */ ((AddressType2) => {
  AddressType2[AddressType2["contract"] = 0] = "contract";
  AddressType2[AddressType2["account"] = 1] = "account";
  return AddressType2;
})(AddressType || {});
var ChainName = /* @__PURE__ */ ((ChainName2) => {
  ChainName2["ethereum"] = "ethereum";
  ChainName2["fuel"] = "fuel";
  return ChainName2;
})(ChainName || {});

// src/transaction-summary/operations.ts
function getReceiptsByType(receipts, type) {
  return (receipts ?? []).filter((r) => r.type === type);
}
function getTransactionTypeName(transactionType) {
  switch (transactionType) {
    case import_transactions13.TransactionType.Mint:
      return "Mint" /* Mint */;
    case import_transactions13.TransactionType.Create:
      return "Create" /* Create */;
    case import_transactions13.TransactionType.Script:
      return "Script" /* Script */;
    default:
      throw new import_errors9.FuelError(
        import_errors9.ErrorCode.INVALID_TRANSACTION_TYPE,
        `Invalid transaction type: ${transactionType}.`
      );
  }
}
function isType(transactionType, type) {
  const txType = getTransactionTypeName(transactionType);
  return txType === type;
}
function isTypeMint(transactionType) {
  return isType(transactionType, "Mint" /* Mint */);
}
function isTypeCreate(transactionType) {
  return isType(transactionType, "Create" /* Create */);
}
function isTypeScript(transactionType) {
  return isType(transactionType, "Script" /* Script */);
}
function hasSameAssetId(a) {
  return (b) => a.assetId === b.assetId;
}
function getReceiptsCall(receipts) {
  return getReceiptsByType(receipts, import_transactions13.ReceiptType.Call);
}
function getReceiptsMessageOut(receipts) {
  return getReceiptsByType(receipts, import_transactions13.ReceiptType.MessageOut);
}
var mergeAssets = (op1, op2) => {
  const assets1 = op1.assetsSent || [];
  const assets2 = op2.assetsSent || [];
  const filtered = assets2.filter((c) => !assets1.some(hasSameAssetId(c)));
  return assets1.map((coin) => {
    const asset = assets2.find(hasSameAssetId(coin));
    if (!asset) {
      return coin;
    }
    return { ...coin, amount: (0, import_math12.bn)(coin.amount).add(asset.amount) };
  }).concat(filtered);
};
function isSameOperation(a, b) {
  return a.name === b.name && a.from?.address === b.from?.address && a.to?.address === b.to?.address && a.from?.type === b.from?.type && a.to?.type === b.to?.type;
}
function addOperation(operations, toAdd) {
  const ops = operations.map((op) => {
    if (!isSameOperation(op, toAdd)) {
      return null;
    }
    let newOp = { ...op };
    if (toAdd.assetsSent?.length) {
      newOp = {
        ...newOp,
        assetsSent: op.assetsSent?.length ? mergeAssets(op, toAdd) : toAdd.assetsSent
      };
    }
    if (toAdd.calls?.length) {
      newOp = {
        ...newOp,
        calls: [...op.calls || [], ...toAdd.calls || []]
      };
    }
    return newOp;
  }).filter(Boolean);
  return ops.length ? ops : [...operations, toAdd];
}
function getReceiptsTransferOut(receipts) {
  return getReceiptsByType(receipts, import_transactions13.ReceiptType.TransferOut);
}
function getContractTransferOperations({ receipts }) {
  const transferOutReceipts = getReceiptsTransferOut(receipts);
  const contractTransferOperations = transferOutReceipts.reduce(
    (prevContractTransferOps, receipt) => {
      const newContractTransferOps = addOperation(prevContractTransferOps, {
        name: "Contract transfer" /* contractTransfer */,
        from: {
          type: 0 /* contract */,
          address: receipt.from
        },
        to: {
          type: 1 /* account */,
          address: receipt.to
        },
        assetsSent: [
          {
            amount: receipt.amount,
            assetId: receipt.assetId
          }
        ]
      });
      return newContractTransferOps;
    },
    []
  );
  return contractTransferOperations;
}
function getWithdrawFromFuelOperations({
  inputs,
  receipts
}) {
  const messageOutReceipts = getReceiptsMessageOut(receipts);
  const withdrawFromFuelOperations = messageOutReceipts.reduce(
    (prevWithdrawFromFuelOps, receipt) => {
      const assetId = "0x0000000000000000000000000000000000000000000000000000000000000000";
      const input = getInputFromAssetId(inputs, assetId);
      if (input) {
        const inputAddress = getInputAccountAddress(input);
        const newWithdrawFromFuelOps = addOperation(prevWithdrawFromFuelOps, {
          name: "Withdraw from Fuel" /* withdrawFromFuel */,
          from: {
            type: 1 /* account */,
            address: inputAddress
          },
          to: {
            type: 1 /* account */,
            address: receipt.recipient.toString(),
            chain: "ethereum" /* ethereum */
          },
          assetsSent: [
            {
              amount: receipt.amount,
              assetId
            }
          ]
        });
        return newWithdrawFromFuelOps;
      }
      return prevWithdrawFromFuelOps;
    },
    []
  );
  return withdrawFromFuelOperations;
}
function getContractCallOperations({
  inputs,
  outputs,
  receipts,
  abiMap,
  rawPayload,
  maxInputs
}) {
  const contractCallReceipts = getReceiptsCall(receipts);
  const contractOutputs = getOutputsContract(outputs);
  const contractCallOperations = contractOutputs.reduce((prevOutputCallOps, output) => {
    const contractInput = getInputContractFromIndex(inputs, output.inputIndex);
    if (contractInput) {
      const newCallOps = contractCallReceipts.reduce((prevContractCallOps, receipt) => {
        if (receipt.to === contractInput.contractID) {
          const input = getInputFromAssetId(inputs, receipt.assetId);
          if (input) {
            const inputAddress = getInputAccountAddress(input);
            const calls = [];
            const abi = abiMap?.[contractInput.contractID];
            if (abi) {
              calls.push(
                getFunctionCall({
                  abi,
                  receipt,
                  rawPayload,
                  maxInputs
                })
              );
            }
            const newContractCallOps = addOperation(prevContractCallOps, {
              name: "Contract call" /* contractCall */,
              from: {
                type: 1 /* account */,
                address: inputAddress
              },
              to: {
                type: 0 /* contract */,
                address: receipt.to
              },
              // if no amount is forwarded to the contract, skip showing assetsSent
              assetsSent: receipt.amount?.isZero() ? void 0 : [
                {
                  amount: receipt.amount,
                  assetId: receipt.assetId
                }
              ],
              calls
            });
            return newContractCallOps;
          }
        }
        return prevContractCallOps;
      }, prevOutputCallOps);
      return newCallOps;
    }
    return prevOutputCallOps;
  }, []);
  return contractCallOperations;
}
function getTransferOperations({
  inputs,
  outputs,
  receipts
}) {
  const coinOutputs = getOutputsCoin(outputs);
  const [transferReceipt] = getReceiptsByType(
    receipts,
    import_transactions13.ReceiptType.Transfer
  );
  let operations = [];
  if (transferReceipt) {
    const changeOutputs = getOutputsChange(outputs);
    changeOutputs.forEach((output) => {
      const { assetId } = output;
      const [contractInput] = getInputsContract(inputs);
      const utxo = getInputFromAssetId(inputs, assetId);
      if (utxo && contractInput) {
        const inputAddress = getInputAccountAddress(utxo);
        operations = addOperation(operations, {
          name: "Transfer asset" /* transfer */,
          from: {
            type: 1 /* account */,
            address: inputAddress
          },
          to: {
            type: 0 /* contract */,
            address: contractInput.contractID
          },
          assetsSent: [
            {
              assetId: assetId.toString(),
              amount: transferReceipt.amount
            }
          ]
        });
      }
    });
  } else {
    coinOutputs.forEach((output) => {
      const input = getInputFromAssetId(inputs, output.assetId);
      if (input) {
        const inputAddress = getInputAccountAddress(input);
        operations = addOperation(operations, {
          name: "Transfer asset" /* transfer */,
          from: {
            type: 1 /* account */,
            address: inputAddress
          },
          to: {
            type: 1 /* account */,
            address: output.to.toString()
          },
          assetsSent: [
            {
              assetId: output.assetId.toString(),
              amount: output.amount
            }
          ]
        });
      }
    });
  }
  return operations;
}
function getPayProducerOperations(outputs) {
  const coinOutputs = getOutputsCoin(outputs);
  const payProducerOperations = coinOutputs.reduce((prev, output) => {
    const operations = addOperation(prev, {
      name: "Pay network fee to block producer" /* payBlockProducer */,
      from: {
        type: 1 /* account */,
        address: "Network"
      },
      to: {
        type: 1 /* account */,
        address: output.to.toString()
      },
      assetsSent: [
        {
          assetId: output.assetId.toString(),
          amount: output.amount
        }
      ]
    });
    return operations;
  }, []);
  return payProducerOperations;
}
function getContractCreatedOperations({ inputs, outputs }) {
  const contractCreatedOutputs = getOutputsContractCreated(outputs);
  const input = getInputsCoin(inputs)[0];
  const fromAddress = getInputAccountAddress(input);
  const contractCreatedOperations = contractCreatedOutputs.reduce((prev, contractCreatedOutput) => {
    const operations = addOperation(prev, {
      name: "Contract created" /* contractCreated */,
      from: {
        type: 1 /* account */,
        address: fromAddress
      },
      to: {
        type: 0 /* contract */,
        address: contractCreatedOutput?.contractId || ""
      }
    });
    return operations;
  }, []);
  return contractCreatedOperations;
}
function getOperations({
  transactionType,
  inputs,
  outputs,
  receipts,
  abiMap,
  rawPayload,
  maxInputs
}) {
  if (isTypeCreate(transactionType)) {
    return [
      ...getContractCreatedOperations({ inputs, outputs }),
      ...getTransferOperations({ inputs, outputs, receipts })
    ];
  }
  if (isTypeScript(transactionType)) {
    return [
      ...getTransferOperations({ inputs, outputs, receipts }),
      ...getContractCallOperations({
        inputs,
        outputs,
        receipts,
        abiMap,
        rawPayload,
        maxInputs
      }),
      ...getContractTransferOperations({ receipts }),
      ...getWithdrawFromFuelOperations({ inputs, receipts })
    ];
  }
  return [...getPayProducerOperations(outputs)];
}

// src/transaction-summary/receipt.ts
var import_transactions14 = require("@fuel-ts/transactions");
var processGqlReceipt = (gqlReceipt) => {
  const receipt = assembleReceiptByType(gqlReceipt);
  switch (receipt.type) {
    case import_transactions14.ReceiptType.ReturnData: {
      return {
        ...receipt,
        data: gqlReceipt.data || "0x"
      };
    }
    case import_transactions14.ReceiptType.LogData: {
      return {
        ...receipt,
        data: gqlReceipt.data || "0x"
      };
    }
    default:
      return receipt;
  }
};
var extractMintedAssetsFromReceipts = (receipts) => {
  const mintedAssets = [];
  receipts.forEach((receipt) => {
    if (receipt.type === import_transactions14.ReceiptType.Mint) {
      mintedAssets.push({
        subId: receipt.subId,
        contractId: receipt.contractId,
        assetId: receipt.assetId,
        amount: receipt.val
      });
    }
  });
  return mintedAssets;
};
var extractBurnedAssetsFromReceipts = (receipts) => {
  const burnedAssets = [];
  receipts.forEach((receipt) => {
    if (receipt.type === import_transactions14.ReceiptType.Burn) {
      burnedAssets.push({
        subId: receipt.subId,
        contractId: receipt.contractId,
        assetId: receipt.assetId,
        amount: receipt.val
      });
    }
  });
  return burnedAssets;
};

// src/transaction-summary/status.ts
var import_errors10 = require("@fuel-ts/errors");
var getTransactionStatusName = (gqlStatus) => {
  switch (gqlStatus) {
    case "FailureStatus":
      return "failure" /* failure */;
    case "SuccessStatus":
      return "success" /* success */;
    case "SubmittedStatus":
      return "submitted" /* submitted */;
    case "SqueezedOutStatus":
      return "squeezedout" /* squeezedout */;
    default:
      throw new import_errors10.FuelError(
        import_errors10.ErrorCode.INVALID_TRANSACTION_STATUS,
        `Invalid transaction status: ${gqlStatus}.`
      );
  }
};
var processGraphqlStatus = (gqlTransactionStatus) => {
  let time;
  let blockId;
  let status;
  let isStatusFailure = false;
  let isStatusSuccess = false;
  let isStatusPending = false;
  if (gqlTransactionStatus?.type) {
    status = getTransactionStatusName(gqlTransactionStatus.type);
    switch (gqlTransactionStatus.type) {
      case "SuccessStatus":
        time = gqlTransactionStatus.time;
        blockId = gqlTransactionStatus.block.id;
        isStatusSuccess = true;
        break;
      case "FailureStatus":
        time = gqlTransactionStatus.time;
        blockId = gqlTransactionStatus.block.id;
        isStatusFailure = true;
        break;
      case "SubmittedStatus":
        time = gqlTransactionStatus.time;
        isStatusPending = true;
        break;
      default:
    }
  }
  const processedGraphqlStatus = {
    time,
    blockId,
    status,
    isStatusFailure,
    isStatusSuccess,
    isStatusPending
  };
  return processedGraphqlStatus;
};

// src/transaction-summary/assemble-transaction-summary.ts
function assembleTransactionSummary(params) {
  const {
    id,
    receipts,
    gasPerByte,
    gasPriceFactor,
    transaction,
    transactionBytes,
    gqlTransactionStatus,
    abiMap = {},
    maxInputs,
    gasCosts
  } = params;
  const gasUsed = getGasUsedFromReceipts(receipts);
  const rawPayload = (0, import_ethers16.hexlify)(transactionBytes);
  const operations = getOperations({
    transactionType: transaction.type,
    inputs: transaction.inputs || [],
    outputs: transaction.outputs || [],
    receipts,
    rawPayload,
    abiMap,
    maxInputs
  });
  const typeName = getTransactionTypeName(transaction.type);
  const { fee } = calculateTransactionFee({
    gasUsed,
    rawPayload,
    consensusParameters: {
      gasCosts,
      feeParams: {
        gasPerByte,
        gasPriceFactor
      }
    }
  });
  const { isStatusFailure, isStatusPending, isStatusSuccess, blockId, status, time } = processGraphqlStatus(gqlTransactionStatus);
  const mintedAssets = extractMintedAssetsFromReceipts(receipts);
  const burnedAssets = extractBurnedAssetsFromReceipts(receipts);
  let date;
  if (time) {
    date = fromTai64ToDate(time);
  }
  const transactionSummary = {
    id,
    fee,
    gasUsed,
    operations,
    type: typeName,
    blockId,
    time,
    status,
    receipts,
    mintedAssets,
    burnedAssets,
    isTypeMint: isTypeMint(transaction.type),
    isTypeCreate: isTypeCreate(transaction.type),
    isTypeScript: isTypeScript(transaction.type),
    isStatusFailure,
    isStatusSuccess,
    isStatusPending,
    date,
    transaction
  };
  return transactionSummary;
}

// src/transaction-response/transaction-response.ts
var STATUS_POLLING_INTERVAL_MAX_MS = 5e3;
var STATUS_POLLING_INTERVAL_MIN_MS = 1e3;
var TransactionResponse = class {
  /** Transaction ID */
  id;
  /** Current provider */
  provider;
  /** Gas used on the transaction */
  gasUsed = (0, import_math13.bn)(0);
  /** Number of attempts made to fetch the transaction */
  fetchAttempts = 0;
  /** Number of attempts made to retrieve a processed transaction. */
  resultAttempts = 0;
  /** The graphql Transaction with receipts object. */
  gqlTransaction;
  /**
   * Constructor for `TransactionResponse`.
   *
   * @param id - The transaction ID.
   * @param provider - The provider.
   */
  constructor(id, provider) {
    this.id = id;
    this.provider = provider;
  }
  /**
   * Async constructor for `TransactionResponse`. This method can be used to create
   * an instance of `TransactionResponse` and wait for the transaction to be fetched
   * from the chain, ensuring that the `gqlTransaction` property is set.
   *
   * @param id - The transaction ID.
   * @param provider - The provider.
   */
  static async create(id, provider) {
    const response = new TransactionResponse(id, provider);
    await response.fetch();
    return response;
  }
  /**
   * Fetch the transaction with receipts from the provider.
   *
   * @returns Transaction with receipts query result.
   */
  async fetch() {
    const response = await this.provider.operations.getTransactionWithReceipts({
      transactionId: this.id
    });
    if (!response.transaction) {
      await this.sleepBasedOnAttempts(++this.fetchAttempts);
      return this.fetch();
    }
    this.gqlTransaction = response.transaction;
    return response.transaction;
  }
  /**
   * Decode the raw payload of the transaction.
   *
   * @param transactionWithReceipts - The transaction with receipts object.
   * @returns The decoded transaction.
   */
  decodeTransaction(transactionWithReceipts) {
    return new import_transactions15.TransactionCoder().decode(
      (0, import_ethers17.getBytesCopy)(transactionWithReceipts.rawPayload),
      0
    )?.[0];
  }
  /**
   * Retrieves the TransactionSummary. If the `gqlTransaction` is not set, it will
   * fetch it from the provider
   *
   * @param contractsAbiMap - The contracts ABI map.
   * @returns
   */
  async getTransactionSummary(contractsAbiMap) {
    let transaction = this.gqlTransaction;
    if (!transaction) {
      transaction = await this.fetch();
    }
    const decodedTransaction = this.decodeTransaction(
      transaction
    );
    const receipts = transaction.receipts?.map(processGqlReceipt) || [];
    const { gasPerByte, gasPriceFactor, gasCosts } = this.provider.getGasConfig();
    const maxInputs = this.provider.getChain().consensusParameters.maxInputs;
    const transactionSummary = assembleTransactionSummary({
      id: this.id,
      receipts,
      transaction: decodedTransaction,
      transactionBytes: (0, import_ethers17.getBytesCopy)(transaction.rawPayload),
      gqlTransactionStatus: transaction.status,
      gasPerByte,
      gasPriceFactor,
      abiMap: contractsAbiMap,
      maxInputs,
      gasCosts
    });
    return transactionSummary;
  }
  /**
   * Waits for transaction to complete and returns the result.
   *
   * @returns The completed transaction result
   */
  async waitForResult(contractsAbiMap) {
    await this.fetch();
    if (this.gqlTransaction?.status?.type === "SubmittedStatus") {
      await this.sleepBasedOnAttempts(++this.resultAttempts);
      return this.waitForResult(contractsAbiMap);
    }
    const transactionSummary = await this.getTransactionSummary(contractsAbiMap);
    const transactionResult = {
      gqlTransaction: this.gqlTransaction,
      ...transactionSummary
    };
    return transactionResult;
  }
  /**
   * Waits for transaction to complete and returns the result.
   *
   * @param contractsAbiMap - The contracts ABI map.
   */
  async wait(contractsAbiMap) {
    const result = await this.waitForResult(contractsAbiMap);
    if (result.isStatusFailure) {
      throw new import_errors11.FuelError(
        import_errors11.ErrorCode.TRANSACTION_FAILED,
        `Transaction failed: ${result.gqlTransaction.status.reason}`
      );
    }
    return result;
  }
  /**
   * Introduces a delay based on the number of previous attempts made.
   *
   * @param attempts - The number of attempts.
   */
  async sleepBasedOnAttempts(attempts) {
    await sleep(
      Math.min(STATUS_POLLING_INTERVAL_MIN_MS * attempts, STATUS_POLLING_INTERVAL_MAX_MS)
    );
  }
};

// src/transaction-response/getDecodedLogs.ts
var import_abi_coder3 = require("@fuel-ts/abi-coder");
var import_transactions16 = require("@fuel-ts/transactions");
function getDecodedLogs(receipts, abiInterface) {
  return receipts.reduce((logs, r) => {
    if (r.type === import_transactions16.ReceiptType.LogData) {
      logs.push(abiInterface.decodeLog(r.data, r.val1.toNumber(), r.id)[0]);
    }
    if (r.type === import_transactions16.ReceiptType.Log) {
      logs.push(abiInterface.decodeLog(new import_abi_coder3.U64Coder().encode(r.val0), r.val1.toNumber(), r.id)[0]);
    }
    return logs;
  }, []);
}

// src/utils/merge-quantities.ts
var mergeQuantities = (arr1, arr2) => {
  const resultMap = {};
  function addToMap({ amount, assetId }) {
    if (resultMap[assetId]) {
      resultMap[assetId] = resultMap[assetId].add(amount);
    } else {
      resultMap[assetId] = amount;
    }
  }
  arr1.forEach(addToMap);
  arr2.forEach(addToMap);
  return Object.entries(resultMap).map(([assetId, amount]) => ({ assetId, amount }));
};

// src/provider.ts
var MAX_RETRIES = 10;
var processGqlChain = (chain) => {
  const { name, daHeight, consensusParameters, latestBlock } = chain;
  const { contractParams, feeParams, predicateParams, scriptParams, txParams, gasCosts } = consensusParameters;
  return {
    name,
    baseChainHeight: (0, import_math14.bn)(daHeight),
    consensusParameters: {
      contractMaxSize: (0, import_math14.bn)(contractParams.contractMaxSize),
      maxInputs: (0, import_math14.bn)(txParams.maxInputs),
      maxOutputs: (0, import_math14.bn)(txParams.maxOutputs),
      maxWitnesses: (0, import_math14.bn)(txParams.maxWitnesses),
      maxGasPerTx: (0, import_math14.bn)(txParams.maxGasPerTx),
      maxScriptLength: (0, import_math14.bn)(scriptParams.maxScriptLength),
      maxScriptDataLength: (0, import_math14.bn)(scriptParams.maxScriptDataLength),
      maxStorageSlots: (0, import_math14.bn)(contractParams.maxStorageSlots),
      maxPredicateLength: (0, import_math14.bn)(predicateParams.maxPredicateLength),
      maxPredicateDataLength: (0, import_math14.bn)(predicateParams.maxPredicateDataLength),
      maxGasPerPredicate: (0, import_math14.bn)(predicateParams.maxGasPerPredicate),
      gasPriceFactor: (0, import_math14.bn)(feeParams.gasPriceFactor),
      gasPerByte: (0, import_math14.bn)(feeParams.gasPerByte),
      maxMessageDataLength: (0, import_math14.bn)(predicateParams.maxMessageDataLength),
      chainId: (0, import_math14.bn)(consensusParameters.chainId),
      gasCosts
    },
    gasCosts,
    latestBlock: {
      id: latestBlock.id,
      height: (0, import_math14.bn)(latestBlock.header.height),
      time: latestBlock.header.time,
      transactions: latestBlock.transactions.map((i) => ({
        id: i.id
      }))
    }
  };
};
var _cacheInputs, cacheInputs_fn;
var _Provider = class {
  /**
   * Constructor to initialize a Provider.
   *
   * @param url - GraphQL endpoint of the Fuel node
   * @param chainInfo - Chain info of the Fuel node
   * @param options - Additional options for the provider
   * @hidden
   */
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    /**
     * @hidden
     */
    __privateAdd(this, _cacheInputs);
    __publicField(this, "operations");
    __publicField(this, "cache");
    this.operations = this.createOperations(url, options);
    this.cache = options.cacheUtxo ? new MemoryCache(options.cacheUtxo) : void 0;
  }
  static clearChainAndNodeCaches() {
    _Provider.nodeInfoCache = {};
    _Provider.chainInfoCache = {};
  }
  /**
   * Creates a new instance of the Provider class. This is the recommended way to initialize a Provider.
   * @param url - GraphQL endpoint of the Fuel node
   * @param options - Additional options for the provider
   */
  static async create(url, options = {}) {
    const provider = new _Provider(url, options);
    await provider.fetchChainAndNodeInfo();
    return provider;
  }
  /**
   * Returns the cached chainInfo for the current URL.
   */
  getChain() {
    const chain = _Provider.chainInfoCache[this.url];
    if (!chain) {
      throw new import_errors12.FuelError(
        import_errors12.ErrorCode.CHAIN_INFO_CACHE_EMPTY,
        "Chain info cache is empty. Make sure you have called `Provider.create` to initialize the provider."
      );
    }
    return chain;
  }
  /**
   * Returns the cached nodeInfo for the current URL.
   */
  getNode() {
    const node = _Provider.nodeInfoCache[this.url];
    if (!node) {
      throw new import_errors12.FuelError(
        import_errors12.ErrorCode.NODE_INFO_CACHE_EMPTY,
        "Node info cache is empty. Make sure you have called `Provider.create` to initialize the provider."
      );
    }
    return node;
  }
  /**
   * Returns some helpful parameters related to gas fees.
   */
  getGasConfig() {
    const { minGasPrice } = this.getNode();
    const { maxGasPerTx, maxGasPerPredicate, gasPriceFactor, gasPerByte, gasCosts } = this.getChain().consensusParameters;
    return {
      minGasPrice,
      maxGasPerTx,
      maxGasPerPredicate,
      gasPriceFactor,
      gasPerByte,
      gasCosts
    };
  }
  /**
   * Updates the URL for the provider and fetches the consensus parameters for the new URL, if needed.
   */
  async connect(url, options) {
    this.url = url;
    this.operations = this.createOperations(url, options ?? this.options);
    await this.fetchChainAndNodeInfo();
  }
  /**
   * Fetches both the chain and node information, saves it to the cache, and return it.
   *
   * @returns NodeInfo and Chain
   */
  async fetchChainAndNodeInfo() {
    const chain = await this.fetchChain();
    const nodeInfo = await this.fetchNode();
    _Provider.ensureClientVersionIsSupported(nodeInfo);
    return {
      chain,
      nodeInfo
    };
  }
  static ensureClientVersionIsSupported(nodeInfo) {
    const { isMajorSupported, isMinorSupported, supportedVersion } = (0, import_versions.checkFuelCoreVersionCompatibility)(nodeInfo.nodeVersion);
    if (!isMajorSupported || !isMinorSupported) {
      throw new import_errors12.FuelError(
        import_errors12.FuelError.CODES.UNSUPPORTED_FUEL_CLIENT_VERSION,
        `Fuel client version: ${nodeInfo.nodeVersion}, Supported version: ${supportedVersion}`
      );
    }
  }
  /**
   * Create GraphQL client and set operations.
   *
   * @param url - The URL of the Fuel node
   * @param options - Additional options for the provider
   * @returns The operation SDK object
   */
  createOperations(url, options = {}) {
    this.url = url;
    const gqlClient = new import_graphql_request.GraphQLClient(url, options.fetch ? { fetch: options.fetch } : void 0);
    return getSdk(gqlClient);
  }
  /**
   * Returns the version of the connected node.
   *
   * @returns A promise that resolves to the version string.
   */
  async getVersion() {
    const {
      nodeInfo: { nodeVersion }
    } = await this.operations.getVersion();
    return nodeVersion;
  }
  /**
   * @hidden
   *
   * Returns the network configuration of the connected Fuel node.
   *
   * @returns A promise that resolves to the network configuration object
   */
  async getNetwork() {
    const {
      name,
      consensusParameters: { chainId }
    } = await this.getChain();
    const network = new import_ethers18.Network(name, chainId.toNumber());
    return Promise.resolve(network);
  }
  /**
   * Returns the block number.
   *
   * @returns A promise that resolves to the block number
   */
  async getBlockNumber() {
    const { chain } = await this.operations.getChain();
    return (0, import_math14.bn)(chain.latestBlock.header.height, 10);
  }
  /**
   * Returns the chain information.
   * @param url - The URL of the Fuel node
   * @returns NodeInfo object
   */
  async fetchNode() {
    const { nodeInfo } = await this.operations.getNodeInfo();
    const processedNodeInfo = {
      maxDepth: (0, import_math14.bn)(nodeInfo.maxDepth),
      maxTx: (0, import_math14.bn)(nodeInfo.maxTx),
      minGasPrice: (0, import_math14.bn)(nodeInfo.minGasPrice),
      nodeVersion: nodeInfo.nodeVersion,
      utxoValidation: nodeInfo.utxoValidation,
      vmBacktrace: nodeInfo.vmBacktrace,
      peers: nodeInfo.peers
    };
    _Provider.nodeInfoCache[this.url] = processedNodeInfo;
    return processedNodeInfo;
  }
  /**
   * Fetches the `chainInfo` for the given node URL.
   * @param url - The URL of the Fuel node
   * @returns ChainInfo object
   */
  async fetchChain() {
    const { chain } = await this.operations.getChain();
    const processedChain = processGqlChain(chain);
    _Provider.chainInfoCache[this.url] = processedChain;
    return processedChain;
  }
  /**
   * Returns the chain ID
   * @returns A promise that resolves to the chain ID number
   */
  getChainId() {
    const {
      consensusParameters: { chainId }
    } = this.getChain();
    return chainId.toNumber();
  }
  /**
   * Submits a transaction to the chain to be executed.
   *
   * If the transaction is missing any dependencies,
   * the transaction will be mutated and those dependencies will be added.
   *
   * @param transactionRequestLike - The transaction request object.
   * @returns A promise that resolves to the transaction response object.
   */
  // #region Provider-sendTransaction
  async sendTransaction(transactionRequestLike, { estimateTxDependencies = true } = {}) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    __privateMethod(this, _cacheInputs, cacheInputs_fn).call(this, transactionRequest.inputs);
    if (estimateTxDependencies) {
      await this.estimateTxDependencies(transactionRequest);
    }
    const encodedTransaction = (0, import_ethers18.hexlify)(transactionRequest.toTransactionBytes());
    const { gasUsed, minGasPrice } = await this.getTransactionCost(transactionRequest, [], {
      estimateTxDependencies: false,
      estimatePredicates: false
    });
    if ((0, import_math14.bn)(minGasPrice).gt((0, import_math14.bn)(transactionRequest.gasPrice))) {
      throw new import_errors12.FuelError(
        import_errors12.ErrorCode.GAS_PRICE_TOO_LOW,
        `Gas price '${transactionRequest.gasPrice}' is lower than the required: '${minGasPrice}'.`
      );
    }
    const isScriptTransaction = transactionRequest.type === import_transactions17.TransactionType.Script;
    if (isScriptTransaction && (0, import_math14.bn)(gasUsed).gt((0, import_math14.bn)(transactionRequest.gasLimit))) {
      throw new import_errors12.FuelError(
        import_errors12.ErrorCode.GAS_LIMIT_TOO_LOW,
        `Gas limit '${transactionRequest.gasLimit}' is lower than the required: '${gasUsed}'.`
      );
    }
    const {
      submit: { id: transactionId }
    } = await this.operations.submit({ encodedTransaction });
    const response = new TransactionResponse(transactionId, this);
    return response;
  }
  /**
   * Executes a transaction without actually submitting it to the chain.
   *
   * If the transaction is missing any dependencies,
   * the transaction will be mutated and those dependencies will be added.
   *
   * @param transactionRequestLike - The transaction request object.
   * @param utxoValidation - Additional provider call parameters.
   * @returns A promise that resolves to the call result object.
   */
  async call(transactionRequestLike, { utxoValidation, estimateTxDependencies = true } = {}) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    if (estimateTxDependencies) {
      await this.estimateTxDependencies(transactionRequest);
    }
    const encodedTransaction = (0, import_ethers18.hexlify)(transactionRequest.toTransactionBytes());
    const { dryRun: gqlReceipts } = await this.operations.dryRun({
      encodedTransaction,
      utxoValidation: utxoValidation || false
    });
    const receipts = gqlReceipts.map(processGqlReceipt);
    return {
      receipts
    };
  }
  /**
   * Verifies whether enough gas is available to complete transaction.
   *
   * @param transactionRequest - The transaction request object.
   * @returns A promise that resolves to the estimated transaction request object.
   */
  async estimatePredicates(transactionRequest) {
    const encodedTransaction = (0, import_ethers18.hexlify)(transactionRequest.toTransactionBytes());
    const response = await this.operations.estimatePredicates({
      encodedTransaction
    });
    const estimatedTransaction = transactionRequest;
    const [decodedTransaction] = new import_transactions17.TransactionCoder().decode(
      (0, import_ethers18.getBytesCopy)(response.estimatePredicates.rawPayload),
      0
    );
    if (decodedTransaction.inputs) {
      decodedTransaction.inputs.forEach((input, index) => {
        if ("predicate" in input && input.predicateGasUsed.gt(0)) {
          estimatedTransaction.inputs[index].predicateGasUsed = input.predicateGasUsed;
        }
      });
    }
    return estimatedTransaction;
  }
  /**
   * Will dryRun a transaction and check for missing dependencies.
   *
   * If there are missing variable outputs,
   * `addVariableOutputs` is called on the transaction.
   *
   * @privateRemarks
   * TODO: Investigate support for missing contract IDs
   * TODO: Add support for missing output messages
   *
   * @param transactionRequest - The transaction request object.
   * @returns A promise.
   */
  async estimateTxDependencies(transactionRequest) {
    let missingOutputVariableCount = 0;
    let missingOutputContractIdsCount = 0;
    let tries = 0;
    if (transactionRequest.type === import_transactions17.TransactionType.Create) {
      return;
    }
    let txRequest = transactionRequest;
    if (txRequest.hasPredicateInput()) {
      txRequest = await this.estimatePredicates(txRequest);
    }
    do {
      const { dryRun: gqlReceipts } = await this.operations.dryRun({
        encodedTransaction: (0, import_ethers18.hexlify)(txRequest.toTransactionBytes()),
        utxoValidation: false
      });
      const receipts = gqlReceipts.map(processGqlReceipt);
      const { missingOutputVariables, missingOutputContractIds } = getReceiptsWithMissingData(receipts);
      missingOutputVariableCount = missingOutputVariables.length;
      missingOutputContractIdsCount = missingOutputContractIds.length;
      if (missingOutputVariableCount === 0 && missingOutputContractIdsCount === 0) {
        return;
      }
      if (txRequest instanceof ScriptTransactionRequest) {
        txRequest.addVariableOutputs(missingOutputVariableCount);
        missingOutputContractIds.forEach(
          ({ contractId }) => txRequest.addContractInputAndOutput(import_address3.Address.fromString(contractId))
        );
      }
      tries += 1;
    } while (tries < MAX_RETRIES);
  }
  /**
   * Executes a signed transaction without applying the states changes
   * on the chain.
   *
   * If the transaction is missing any dependencies,
   * the transaction will be mutated and those dependencies will be added
   *
   * @param transactionRequestLike - The transaction request object.
   * @returns A promise that resolves to the call result object.
   */
  async simulate(transactionRequestLike, { estimateTxDependencies = true } = {}) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    if (estimateTxDependencies) {
      await this.estimateTxDependencies(transactionRequest);
    }
    const encodedTransaction = (0, import_ethers18.hexlify)(transactionRequest.toTransactionBytes());
    const { dryRun: gqlReceipts } = await this.operations.dryRun({
      encodedTransaction,
      utxoValidation: true
    });
    const receipts = gqlReceipts.map(processGqlReceipt);
    return {
      receipts
    };
  }
  /**
   * Returns a transaction cost to enable user
   * to set gasLimit and also reserve balance amounts
   * on the the transaction.
   *
   * @privateRemarks
   * The tolerance is add on top of the gasUsed calculated
   * from the node, this create a safe margin costs like
   * change states on transfer that don't occur on the dryRun
   * transaction. The default value is 0.2 or 20%
   *
   * @param transactionRequestLike - The transaction request object.
   * @param tolerance - The tolerance to add on top of the gasUsed.
   * @returns A promise that resolves to the transaction cost object.
   */
  async getTransactionCost(transactionRequestLike, forwardingQuantities = [], { estimateTxDependencies = true, estimatePredicates = true } = {}) {
    const transactionRequest = transactionRequestify((0, import_ramda3.clone)(transactionRequestLike));
    const chainInfo = this.getChain();
    const { gasPriceFactor, minGasPrice, maxGasPerTx } = this.getGasConfig();
    const gasPrice = (0, import_math14.max)(transactionRequest.gasPrice, minGasPrice);
    const isScriptTransaction = transactionRequest.type === import_transactions17.TransactionType.Script;
    if (transactionRequest.hasPredicateInput() && estimatePredicates) {
      if (isScriptTransaction) {
        transactionRequest.gasLimit = (0, import_math14.bn)(0);
      }
      await this.estimatePredicates(transactionRequest);
    }
    const minGas = transactionRequest.calculateMinGas(chainInfo);
    const maxGas = transactionRequest.calculateMaxGas(chainInfo, minGas);
    const coinOutputsQuantities = transactionRequest.getCoinOutputsQuantities();
    const allQuantities = mergeQuantities(coinOutputsQuantities, forwardingQuantities);
    transactionRequest.fundWithFakeUtxos(allQuantities);
    let gasUsed = minGas;
    let receipts = [];
    if (isScriptTransaction) {
      transactionRequest.gasPrice = (0, import_math14.bn)(0);
      transactionRequest.gasLimit = (0, import_math14.bn)(maxGasPerTx.sub(maxGas).toNumber() * 0.9);
      const result = await this.call(transactionRequest, {
        estimateTxDependencies
      });
      receipts = result.receipts;
      gasUsed = getGasUsedFromReceipts(receipts);
    } else {
      gasUsed = minGas;
    }
    const usedFee = calculatePriceWithFactor(
      gasUsed,
      gasPrice,
      gasPriceFactor
    ).normalizeZeroToOne();
    const minFee = calculatePriceWithFactor(minGas, gasPrice, gasPriceFactor).normalizeZeroToOne();
    const maxFee = calculatePriceWithFactor(maxGas, gasPrice, gasPriceFactor).normalizeZeroToOne();
    return {
      requiredQuantities: allQuantities,
      receipts,
      gasUsed,
      minGasPrice,
      gasPrice,
      minGas,
      maxGas,
      usedFee,
      minFee,
      maxFee
    };
  }
  async getResourcesForTransaction(owner, transactionRequestLike, forwardingQuantities = []) {
    const transactionRequest = transactionRequestify((0, import_ramda3.clone)(transactionRequestLike));
    const transactionCost = await this.getTransactionCost(transactionRequest, forwardingQuantities);
    transactionRequest.addResources(
      await this.getResourcesToSpend(owner, transactionCost.requiredQuantities)
    );
    const { requiredQuantities, ...txCost } = await this.getTransactionCost(
      transactionRequest,
      forwardingQuantities
    );
    const resources = await this.getResourcesToSpend(owner, requiredQuantities);
    return {
      resources,
      requiredQuantities,
      ...txCost
    };
  }
  /**
   * Returns coins for the given owner.
   */
  async getCoins(owner, assetId, paginationArgs) {
    const result = await this.operations.getCoins({
      first: 10,
      ...paginationArgs,
      filter: { owner: owner.toB256(), assetId: assetId && (0, import_ethers18.hexlify)(assetId) }
    });
    const coins = result.coins.edges.map((edge) => edge.node);
    return coins.map((coin) => ({
      id: coin.utxoId,
      assetId: coin.assetId,
      amount: (0, import_math14.bn)(coin.amount),
      owner: import_address3.Address.fromAddressOrString(coin.owner),
      maturity: (0, import_math14.bn)(coin.maturity).toNumber(),
      blockCreated: (0, import_math14.bn)(coin.blockCreated),
      txCreatedIdx: (0, import_math14.bn)(coin.txCreatedIdx)
    }));
  }
  /**
   * Returns resources for the given owner satisfying the spend query.
   *
   * @param owner - The address to get resources for.
   * @param quantities - The quantities to get.
   * @param excludedIds - IDs of excluded resources from the selection.
   * @returns A promise that resolves to the resources.
   */
  async getResourcesToSpend(owner, quantities, excludedIds) {
    const excludeInput = {
      messages: excludedIds?.messages?.map((id) => (0, import_ethers18.hexlify)(id)) || [],
      utxos: excludedIds?.utxos?.map((id) => (0, import_ethers18.hexlify)(id)) || []
    };
    if (this.cache) {
      const uniqueUtxos = new Set(
        excludeInput.utxos.concat(this.cache?.getActiveData().map((id) => (0, import_ethers18.hexlify)(id)))
      );
      excludeInput.utxos = Array.from(uniqueUtxos);
    }
    const coinsQuery = {
      owner: owner.toB256(),
      queryPerAsset: quantities.map(coinQuantityfy).map(({ assetId, amount, max: maxPerAsset }) => ({
        assetId: (0, import_ethers18.hexlify)(assetId),
        amount: amount.toString(10),
        max: maxPerAsset ? maxPerAsset.toString(10) : void 0
      })),
      excludedIds: excludeInput
    };
    const result = await this.operations.getCoinsToSpend(coinsQuery);
    const coins = result.coinsToSpend.flat().map((coin) => {
      switch (coin.__typename) {
        case "MessageCoin":
          return {
            amount: (0, import_math14.bn)(coin.amount),
            assetId: coin.assetId,
            daHeight: (0, import_math14.bn)(coin.daHeight),
            sender: import_address3.Address.fromAddressOrString(coin.sender),
            recipient: import_address3.Address.fromAddressOrString(coin.recipient),
            nonce: coin.nonce
          };
        case "Coin":
          return {
            id: coin.utxoId,
            amount: (0, import_math14.bn)(coin.amount),
            assetId: coin.assetId,
            owner: import_address3.Address.fromAddressOrString(coin.owner),
            maturity: (0, import_math14.bn)(coin.maturity).toNumber(),
            blockCreated: (0, import_math14.bn)(coin.blockCreated),
            txCreatedIdx: (0, import_math14.bn)(coin.txCreatedIdx)
          };
        default:
          return null;
      }
    }).filter((v) => !!v);
    return coins;
  }
  /**
   * Returns block matching the given ID or height.
   *
   * @param idOrHeight - ID or height of the block.
   * @returns A promise that resolves to the block.
   */
  async getBlock(idOrHeight) {
    let variables;
    if (typeof idOrHeight === "number") {
      variables = { height: (0, import_math14.bn)(idOrHeight).toString(10) };
    } else if (idOrHeight === "latest") {
      variables = { height: (await this.getBlockNumber()).toString(10) };
    } else if (idOrHeight.length === 66) {
      variables = { blockId: idOrHeight };
    } else {
      variables = { blockId: (0, import_math14.bn)(idOrHeight).toString(10) };
    }
    const { block } = await this.operations.getBlock(variables);
    if (!block) {
      return null;
    }
    return {
      id: block.id,
      height: (0, import_math14.bn)(block.header.height),
      time: block.header.time,
      transactionIds: block.transactions.map((tx) => tx.id)
    };
  }
  /**
   * Returns all the blocks matching the given parameters.
   *
   * @param params - The parameters to query blocks.
   * @returns A promise that resolves to the blocks.
   */
  async getBlocks(params) {
    const { blocks: fetchedData } = await this.operations.getBlocks(params);
    const blocks = fetchedData.edges.map(({ node: block }) => ({
      id: block.id,
      height: (0, import_math14.bn)(block.header.height),
      time: block.header.time,
      transactionIds: block.transactions.map((tx) => tx.id)
    }));
    return blocks;
  }
  /**
   * Returns block matching the given ID or type, including transaction data.
   *
   * @param idOrHeight - ID or height of the block.
   * @returns A promise that resolves to the block.
   */
  async getBlockWithTransactions(idOrHeight) {
    let variables;
    if (typeof idOrHeight === "number") {
      variables = { blockHeight: (0, import_math14.bn)(idOrHeight).toString(10) };
    } else if (idOrHeight === "latest") {
      variables = { blockHeight: (await this.getBlockNumber()).toString() };
    } else {
      variables = { blockId: idOrHeight };
    }
    const { block } = await this.operations.getBlockWithTransactions(variables);
    if (!block) {
      return null;
    }
    return {
      id: block.id,
      height: (0, import_math14.bn)(block.header.height, 10),
      time: block.header.time,
      transactionIds: block.transactions.map((tx) => tx.id),
      transactions: block.transactions.map(
        (tx) => new import_transactions17.TransactionCoder().decode((0, import_ethers18.getBytesCopy)(tx.rawPayload), 0)?.[0]
      )
    };
  }
  /**
   * Get transaction with the given ID.
   *
   * @param transactionId - ID of the transaction.
   * @returns A promise that resolves to the transaction.
   */
  async getTransaction(transactionId) {
    const { transaction } = await this.operations.getTransaction({ transactionId });
    if (!transaction) {
      return null;
    }
    return new import_transactions17.TransactionCoder().decode(
      (0, import_ethers18.getBytesCopy)(transaction.rawPayload),
      0
    )?.[0];
  }
  /**
   * Get deployed contract with the given ID.
   *
   * @param contractId - ID of the contract.
   * @returns A promise that resolves to the contract.
   */
  async getContract(contractId) {
    const { contract } = await this.operations.getContract({ contractId });
    if (!contract) {
      return null;
    }
    return contract;
  }
  /**
   * Returns the balance for the given contract for the given asset ID.
   *
   * @param contractId - The contract ID to get the balance for.
   * @param assetId - The asset ID of coins to get.
   * @returns A promise that resolves to the balance.
   */
  async getContractBalance(contractId, assetId) {
    const { contractBalance } = await this.operations.getContractBalance({
      contract: contractId.toB256(),
      asset: (0, import_ethers18.hexlify)(assetId)
    });
    return (0, import_math14.bn)(contractBalance.amount, 10);
  }
  /**
   * Returns the balance for the given owner for the given asset ID.
   *
   * @param owner - The address to get coins for.
   * @param assetId - The asset ID of coins to get.
   * @returns A promise that resolves to the balance.
   */
  async getBalance(owner, assetId) {
    const { balance } = await this.operations.getBalance({
      owner: owner.toB256(),
      assetId: (0, import_ethers18.hexlify)(assetId)
    });
    return (0, import_math14.bn)(balance.amount, 10);
  }
  /**
   * Returns balances for the given owner.
   *
   * @param owner - The address to get coins for.
   * @param paginationArgs - Pagination arguments.
   * @returns A promise that resolves to the balances.
   */
  async getBalances(owner, paginationArgs) {
    const result = await this.operations.getBalances({
      first: 10,
      ...paginationArgs,
      filter: { owner: owner.toB256() }
    });
    const balances = result.balances.edges.map((edge) => edge.node);
    return balances.map((balance) => ({
      assetId: balance.assetId,
      amount: (0, import_math14.bn)(balance.amount)
    }));
  }
  /**
   * Returns message for the given address.
   *
   * @param address - The address to get message from.
   * @param paginationArgs - Pagination arguments.
   * @returns A promise that resolves to the messages.
   */
  async getMessages(address, paginationArgs) {
    const result = await this.operations.getMessages({
      first: 10,
      ...paginationArgs,
      owner: address.toB256()
    });
    const messages = result.messages.edges.map((edge) => edge.node);
    return messages.map((message) => ({
      messageId: import_transactions17.InputMessageCoder.getMessageId({
        sender: message.sender,
        recipient: message.recipient,
        nonce: message.nonce,
        amount: (0, import_math14.bn)(message.amount),
        data: message.data
      }),
      sender: import_address3.Address.fromAddressOrString(message.sender),
      recipient: import_address3.Address.fromAddressOrString(message.recipient),
      nonce: message.nonce,
      amount: (0, import_math14.bn)(message.amount),
      data: import_transactions17.InputMessageCoder.decodeData(message.data),
      daHeight: (0, import_math14.bn)(message.daHeight)
    }));
  }
  /**
   * Returns Message Proof for given transaction id and the message id from MessageOut receipt.
   *
   * @param transactionId - The transaction to get message from.
   * @param messageId - The message id from MessageOut receipt.
   * @param commitBlockId - The commit block id.
   * @param commitBlockHeight - The commit block height.
   * @returns A promise that resolves to the message proof.
   */
  async getMessageProof(transactionId, nonce, commitBlockId, commitBlockHeight) {
    let inputObject = {
      transactionId,
      nonce
    };
    if (commitBlockId && commitBlockHeight) {
      throw new import_errors12.FuelError(
        import_errors12.ErrorCode.INVALID_INPUT_PARAMETERS,
        "commitBlockId and commitBlockHeight cannot be used together"
      );
    }
    if (commitBlockId) {
      inputObject = {
        ...inputObject,
        commitBlockId
      };
    }
    if (commitBlockHeight) {
      inputObject = {
        ...inputObject,
        // Conver BN into a number string required on the query
        // This should problably be fixed on the fuel client side
        commitBlockHeight: commitBlockHeight.toNumber().toString()
      };
    }
    const result = await this.operations.getMessageProof(inputObject);
    if (!result.messageProof) {
      return null;
    }
    const {
      messageProof,
      messageBlockHeader,
      commitBlockHeader,
      blockProof,
      sender,
      recipient,
      amount,
      data
    } = result.messageProof;
    return {
      messageProof: {
        proofIndex: (0, import_math14.bn)(messageProof.proofIndex),
        proofSet: messageProof.proofSet
      },
      blockProof: {
        proofIndex: (0, import_math14.bn)(blockProof.proofIndex),
        proofSet: blockProof.proofSet
      },
      messageBlockHeader: {
        id: messageBlockHeader.id,
        daHeight: (0, import_math14.bn)(messageBlockHeader.daHeight),
        transactionsCount: (0, import_math14.bn)(messageBlockHeader.transactionsCount),
        transactionsRoot: messageBlockHeader.transactionsRoot,
        height: (0, import_math14.bn)(messageBlockHeader.height),
        prevRoot: messageBlockHeader.prevRoot,
        time: messageBlockHeader.time,
        applicationHash: messageBlockHeader.applicationHash,
        messageReceiptRoot: messageBlockHeader.messageReceiptRoot,
        messageReceiptCount: (0, import_math14.bn)(messageBlockHeader.messageReceiptCount)
      },
      commitBlockHeader: {
        id: commitBlockHeader.id,
        daHeight: (0, import_math14.bn)(commitBlockHeader.daHeight),
        transactionsCount: (0, import_math14.bn)(commitBlockHeader.transactionsCount),
        transactionsRoot: commitBlockHeader.transactionsRoot,
        height: (0, import_math14.bn)(commitBlockHeader.height),
        prevRoot: commitBlockHeader.prevRoot,
        time: commitBlockHeader.time,
        applicationHash: commitBlockHeader.applicationHash,
        messageReceiptRoot: commitBlockHeader.messageReceiptRoot,
        messageReceiptCount: (0, import_math14.bn)(commitBlockHeader.messageReceiptCount)
      },
      sender: import_address3.Address.fromAddressOrString(sender),
      recipient: import_address3.Address.fromAddressOrString(recipient),
      nonce,
      amount: (0, import_math14.bn)(amount),
      data
    };
  }
  /**
   * Returns Message Proof for given transaction id and the message id from MessageOut receipt.
   *
   * @param nonce - The nonce of the message to get status from.
   * @returns A promise that resolves to the message status
   */
  async getMessageStatus(nonce) {
    const result = await this.operations.getMessageStatus({ nonce });
    return result.messageStatus;
  }
  /**
   * Lets you produce blocks with custom timestamps and the block number of the last block produced.
   *
   * @param amount - The amount of blocks to produce
   * @param startTime - The UNIX timestamp to set for the first produced block
   * @returns A promise that resolves to the block number of the last produced block.
   */
  async produceBlocks(amount, startTime) {
    const { produceBlocks: latestBlockHeight } = await this.operations.produceBlocks({
      blocksToProduce: (0, import_math14.bn)(amount).toString(10),
      startTimestamp: startTime ? fromUnixToTai64(startTime) : void 0
    });
    return (0, import_math14.bn)(latestBlockHeight);
  }
};
var Provider = _Provider;
_cacheInputs = new WeakSet();
cacheInputs_fn = function(inputs) {
  if (!this.cache) {
    return;
  }
  inputs.forEach((input) => {
    if (input.type === import_transactions17.InputType.Coin) {
      this.cache?.set(input.id);
    }
  });
};
__publicField(Provider, "chainInfoCache", {});
__publicField(Provider, "nodeInfoCache", {});

// src/transaction-summary/get-transaction-summary.ts
var import_errors13 = require("@fuel-ts/errors");
var import_math15 = require("@fuel-ts/math");
var import_transactions18 = require("@fuel-ts/transactions");
var import_ethers19 = require("ethers");
async function getTransactionSummary(params) {
  const { id, provider, abiMap } = params;
  const { transaction: gqlTransaction } = await provider.operations.getTransactionWithReceipts({
    transactionId: id
  });
  if (!gqlTransaction) {
    throw new import_errors13.FuelError(
      import_errors13.ErrorCode.TRANSACTION_NOT_FOUND,
      `Transaction not found for given id: ${id}.`
    );
  }
  const [decodedTransaction] = new import_transactions18.TransactionCoder().decode(
    (0, import_ethers19.getBytesCopy)(gqlTransaction.rawPayload),
    0
  );
  const receipts = gqlTransaction.receipts?.map(processGqlReceipt) || [];
  const {
    consensusParameters: { gasPerByte, gasPriceFactor, maxInputs, gasCosts }
  } = provider.getChain();
  const transactionInfo = assembleTransactionSummary({
    id: gqlTransaction.id,
    receipts,
    transaction: decodedTransaction,
    transactionBytes: (0, import_ethers19.getBytesCopy)(gqlTransaction.rawPayload),
    gqlTransactionStatus: gqlTransaction.status,
    gasPerByte: (0, import_math15.bn)(gasPerByte),
    gasPriceFactor: (0, import_math15.bn)(gasPriceFactor),
    abiMap,
    maxInputs,
    gasCosts
  });
  return {
    gqlTransaction,
    ...transactionInfo
  };
}
async function getTransactionSummaryFromRequest(params) {
  const { provider, transactionRequest, abiMap } = params;
  const { receipts } = await provider.call(transactionRequest);
  const { gasPerByte, gasPriceFactor, gasCosts } = provider.getGasConfig();
  const maxInputs = provider.getChain().consensusParameters.maxInputs;
  const transaction = transactionRequest.toTransaction();
  const transactionBytes = transactionRequest.toTransactionBytes();
  const transactionSummary = assembleTransactionSummary({
    receipts,
    transaction,
    transactionBytes,
    abiMap,
    gasPerByte,
    gasPriceFactor,
    maxInputs,
    gasCosts
  });
  return transactionSummary;
}
async function getTransactionsSummaries(params) {
  const { filters, provider, abiMap } = params;
  const { transactionsByOwner } = await provider.operations.getTransactionsByOwner(filters);
  const { edges, pageInfo } = transactionsByOwner;
  const {
    consensusParameters: { gasPerByte, gasPriceFactor, maxInputs, gasCosts }
  } = provider.getChain();
  const transactions = edges.map((edge) => {
    const { node: gqlTransaction } = edge;
    const { id, rawPayload, receipts: gqlReceipts, status } = gqlTransaction;
    const [decodedTransaction] = new import_transactions18.TransactionCoder().decode((0, import_ethers19.getBytesCopy)(rawPayload), 0);
    const receipts = gqlReceipts?.map(processGqlReceipt) || [];
    const transactionSummary = assembleTransactionSummary({
      id,
      receipts,
      transaction: decodedTransaction,
      transactionBytes: (0, import_ethers19.getBytesCopy)(rawPayload),
      gqlTransactionStatus: status,
      abiMap,
      gasPerByte,
      gasPriceFactor,
      maxInputs,
      gasCosts
    });
    const output = {
      gqlTransaction,
      ...transactionSummary
    };
    return output;
  });
  return {
    transactions,
    pageInfo
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddressType,
  BaseTransactionRequest,
  ChainName,
  ChangeOutputCollisionError,
  CreateTransactionRequest,
  NoWitnessAtIndexError,
  NoWitnessByOwnerError,
  OperationName,
  Provider,
  ScriptTransactionRequest,
  TransactionResponse,
  TransactionStatus,
  TransactionType,
  TransactionTypeName,
  addAmountToAsset,
  addOperation,
  assembleReceiptByType,
  assembleTransactionSummary,
  buildBlockExplorerUrl,
  calculateMetadataGasForTxCreate,
  calculateMetadataGasForTxScript,
  calculatePriceWithFactor,
  calculateTransactionFee,
  coinQuantityfy,
  extractBurnedAssetsFromReceipts,
  extractMintedAssetsFromReceipts,
  fromDateToTai64,
  fromTai64ToDate,
  fromTai64ToUnix,
  fromUnixToTai64,
  gasUsedByInputs,
  getContractCallOperations,
  getContractCreatedOperations,
  getContractTransferOperations,
  getDecodedLogs,
  getGasUsedFromReceipts,
  getInputAccountAddress,
  getInputContractFromIndex,
  getInputFromAssetId,
  getInputsByType,
  getInputsCoin,
  getInputsContract,
  getInputsMessage,
  getMaxGas,
  getMinGas,
  getOperations,
  getOutputsByType,
  getOutputsChange,
  getOutputsCoin,
  getOutputsContract,
  getOutputsContractCreated,
  getOutputsVariable,
  getPayProducerOperations,
  getReceiptsByType,
  getReceiptsCall,
  getReceiptsMessageOut,
  getReceiptsTransferOut,
  getReceiptsWithMissingData,
  getTransactionStatusName,
  getTransactionSummary,
  getTransactionSummaryFromRequest,
  getTransactionTypeName,
  getTransactionsSummaries,
  getTransferOperations,
  getWithdrawFromFuelOperations,
  hasSameAssetId,
  inputify,
  isCoin,
  isMessage,
  isRawCoin,
  isRawMessage,
  isType,
  isTypeCreate,
  isTypeMint,
  isTypeScript,
  normalizeJSON,
  outputify,
  processGqlReceipt,
  processGraphqlStatus,
  resolveGasDependentCosts,
  returnZeroScript,
  sleep,
  transactionRequestify,
  withdrawScript
});
//# sourceMappingURL=index.js.map