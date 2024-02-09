var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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

// src/coin-quantity.ts
import { BaseAssetId } from "@fuel-ts/address/configs";
import { bn } from "@fuel-ts/math";
import { hexlify } from "ethers";
var coinQuantityfy = (coinQuantityLike) => {
  let assetId;
  let amount;
  let max2;
  if (Array.isArray(coinQuantityLike)) {
    amount = coinQuantityLike[0];
    assetId = coinQuantityLike[1] ?? BaseAssetId;
    max2 = coinQuantityLike[2] ?? void 0;
  } else {
    amount = coinQuantityLike.amount;
    assetId = coinQuantityLike.assetId ?? BaseAssetId;
    max2 = coinQuantityLike.max ?? void 0;
  }
  return {
    assetId: hexlify(assetId),
    amount: bn(amount),
    max: max2 ? bn(max2) : void 0
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
import { Address as Address2 } from "@fuel-ts/address";
import { ErrorCode as ErrorCode11, FuelError as FuelError11 } from "@fuel-ts/errors";
import { bn as bn14, max } from "@fuel-ts/math";
import {
  InputType as InputType6,
  TransactionType as TransactionType8,
  InputMessageCoder,
  TransactionCoder as TransactionCoder5
} from "@fuel-ts/transactions";
import { checkFuelCoreVersionCompatibility } from "@fuel-ts/versions";
import { getBytesCopy as getBytesCopy12, hexlify as hexlify12, Network } from "ethers";
import { GraphQLClient } from "graphql-request";
import { clone as clone3 } from "ramda";

// src/__generated__/operations.ts
import gql from "graphql-tag";
var ReceiptFragmentFragmentDoc = gql`
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
var TransactionFragmentFragmentDoc = gql`
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
var CoinFragmentFragmentDoc = gql`
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
var MessageCoinFragmentFragmentDoc = gql`
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
var MessageFragmentFragmentDoc = gql`
    fragment messageFragment on Message {
  amount
  sender
  recipient
  data
  nonce
  daHeight
}
    `;
var MessageProofFragmentFragmentDoc = gql`
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
var BalanceFragmentFragmentDoc = gql`
    fragment balanceFragment on Balance {
  owner
  amount
  assetId
}
    `;
var BlockFragmentFragmentDoc = gql`
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
var TxParametersFragmentFragmentDoc = gql`
    fragment TxParametersFragment on TxParameters {
  maxInputs
  maxOutputs
  maxWitnesses
  maxGasPerTx
  maxSize
}
    `;
var PredicateParametersFragmentFragmentDoc = gql`
    fragment PredicateParametersFragment on PredicateParameters {
  maxPredicateLength
  maxPredicateDataLength
  maxGasPerPredicate
  maxMessageDataLength
}
    `;
var ScriptParametersFragmentFragmentDoc = gql`
    fragment ScriptParametersFragment on ScriptParameters {
  maxScriptLength
  maxScriptDataLength
}
    `;
var ContractParametersFragmentFragmentDoc = gql`
    fragment ContractParametersFragment on ContractParameters {
  contractMaxSize
  maxStorageSlots
}
    `;
var FeeParametersFragmentFragmentDoc = gql`
    fragment FeeParametersFragment on FeeParameters {
  gasPriceFactor
  gasPerByte
}
    `;
var DependentCostFragmentFragmentDoc = gql`
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
var GasCostsFragmentFragmentDoc = gql`
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
var ConsensusParametersFragmentFragmentDoc = gql`
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
var ChainInfoFragmentFragmentDoc = gql`
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
var ContractBalanceFragmentFragmentDoc = gql`
    fragment contractBalanceFragment on ContractBalance {
  contract
  amount
  assetId
}
    `;
var PageInfoFragmentFragmentDoc = gql`
    fragment pageInfoFragment on PageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}
    `;
var NodeInfoFragmentFragmentDoc = gql`
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
var GetVersionDocument = gql`
    query getVersion {
  nodeInfo {
    nodeVersion
  }
}
    `;
var GetNodeInfoDocument = gql`
    query getNodeInfo {
  nodeInfo {
    ...nodeInfoFragment
  }
}
    ${NodeInfoFragmentFragmentDoc}`;
var GetChainDocument = gql`
    query getChain {
  chain {
    ...chainInfoFragment
  }
}
    ${ChainInfoFragmentFragmentDoc}`;
var GetTransactionDocument = gql`
    query getTransaction($transactionId: TransactionId!) {
  transaction(id: $transactionId) {
    ...transactionFragment
  }
}
    ${TransactionFragmentFragmentDoc}`;
var GetTransactionWithReceiptsDocument = gql`
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
var GetTransactionsDocument = gql`
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
var GetTransactionsByOwnerDocument = gql`
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
var EstimatePredicatesDocument = gql`
    query estimatePredicates($encodedTransaction: HexString!) {
  estimatePredicates(tx: $encodedTransaction) {
    ...transactionFragment
  }
}
    ${TransactionFragmentFragmentDoc}`;
var GetBlockDocument = gql`
    query getBlock($blockId: BlockId, $height: U32) {
  block(id: $blockId, height: $height) {
    ...blockFragment
  }
}
    ${BlockFragmentFragmentDoc}`;
var GetBlockWithTransactionsDocument = gql`
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
var GetBlocksDocument = gql`
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
var GetCoinDocument = gql`
    query getCoin($coinId: UtxoId!) {
  coin(utxoId: $coinId) {
    ...coinFragment
  }
}
    ${CoinFragmentFragmentDoc}`;
var GetCoinsDocument = gql`
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
var GetCoinsToSpendDocument = gql`
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
var GetContractDocument = gql`
    query getContract($contractId: ContractId!) {
  contract(id: $contractId) {
    bytecode
    id
  }
}
    `;
var GetContractBalanceDocument = gql`
    query getContractBalance($contract: ContractId!, $asset: AssetId!) {
  contractBalance(contract: $contract, asset: $asset) {
    ...contractBalanceFragment
  }
}
    ${ContractBalanceFragmentFragmentDoc}`;
var GetBalanceDocument = gql`
    query getBalance($owner: Address!, $assetId: AssetId!) {
  balance(owner: $owner, assetId: $assetId) {
    ...balanceFragment
  }
}
    ${BalanceFragmentFragmentDoc}`;
var GetBalancesDocument = gql`
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
var GetMessagesDocument = gql`
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
var GetMessageProofDocument = gql`
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
var GetMessageStatusDocument = gql`
    query getMessageStatus($nonce: Nonce!) {
  messageStatus(nonce: $nonce) {
    state
  }
}
    `;
var DryRunDocument = gql`
    mutation dryRun($encodedTransaction: HexString!, $utxoValidation: Boolean) {
  dryRun(tx: $encodedTransaction, utxoValidation: $utxoValidation) {
    ...receiptFragment
  }
}
    ${ReceiptFragmentFragmentDoc}`;
var SubmitDocument = gql`
    mutation submit($encodedTransaction: HexString!) {
  submit(tx: $encodedTransaction) {
    id
  }
}
    `;
var ProduceBlocksDocument = gql`
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
import { ErrorCode, FuelError } from "@fuel-ts/errors";
import { hexlify as hexlify2 } from "ethers";
var cache = {};
var DEFAULT_TTL_IN_MS = 30 * 1e3;
var MemoryCache = class {
  ttl;
  constructor(ttlInMs = DEFAULT_TTL_IN_MS) {
    this.ttl = ttlInMs;
    if (typeof ttlInMs !== "number" || this.ttl <= 0) {
      throw new FuelError(
        ErrorCode.INVALID_TTL,
        `Invalid TTL: ${this.ttl}. Use a value greater than zero.`
      );
    }
  }
  get(value, isAutoExpiring = true) {
    const key = hexlify2(value);
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
    const key = hexlify2(value);
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
    const key = hexlify2(value);
    delete cache[key];
  }
};

// src/transaction-request/input.ts
import { ZeroBytes32 } from "@fuel-ts/address/configs";
import { ErrorCode as ErrorCode2, FuelError as FuelError2 } from "@fuel-ts/errors";
import { bn as bn2, toNumber } from "@fuel-ts/math";
import { InputType } from "@fuel-ts/transactions";
import { getBytesCopy, hexlify as hexlify3 } from "ethers";
var inputify = (value) => {
  const { type } = value;
  switch (value.type) {
    case InputType.Coin: {
      const predicate = getBytesCopy(value.predicate ?? "0x");
      const predicateData = getBytesCopy(value.predicateData ?? "0x");
      return {
        type: InputType.Coin,
        txID: hexlify3(getBytesCopy(value.id).slice(0, 32)),
        outputIndex: getBytesCopy(value.id)[32],
        owner: hexlify3(value.owner),
        amount: bn2(value.amount),
        assetId: hexlify3(value.assetId),
        txPointer: {
          blockHeight: toNumber(getBytesCopy(value.txPointer).slice(0, 8)),
          txIndex: toNumber(getBytesCopy(value.txPointer).slice(8, 16))
        },
        witnessIndex: value.witnessIndex,
        maturity: value.maturity ?? 0,
        predicateGasUsed: bn2(value.predicateGasUsed),
        predicateLength: predicate.length,
        predicateDataLength: predicateData.length,
        predicate: hexlify3(predicate),
        predicateData: hexlify3(predicateData)
      };
    }
    case InputType.Contract: {
      return {
        type: InputType.Contract,
        txID: ZeroBytes32,
        outputIndex: 0,
        balanceRoot: ZeroBytes32,
        stateRoot: ZeroBytes32,
        txPointer: {
          blockHeight: toNumber(getBytesCopy(value.txPointer).slice(0, 8)),
          txIndex: toNumber(getBytesCopy(value.txPointer).slice(8, 16))
        },
        contractID: hexlify3(value.contractId)
      };
    }
    case InputType.Message: {
      const predicate = getBytesCopy(value.predicate ?? "0x");
      const predicateData = getBytesCopy(value.predicateData ?? "0x");
      const data = getBytesCopy(value.data ?? "0x");
      return {
        type: InputType.Message,
        sender: hexlify3(value.sender),
        recipient: hexlify3(value.recipient),
        amount: bn2(value.amount),
        nonce: hexlify3(value.nonce),
        witnessIndex: value.witnessIndex,
        predicateGasUsed: bn2(value.predicateGasUsed),
        predicateLength: predicate.length,
        predicateDataLength: predicateData.length,
        predicate: hexlify3(predicate),
        predicateData: hexlify3(predicateData),
        data: hexlify3(data),
        dataLength: data.length
      };
    }
    default: {
      throw new FuelError2(
        ErrorCode2.INVALID_TRANSACTION_INPUT,
        `Invalid transaction input type: ${type}.`
      );
    }
  }
};

// src/transaction-request/output.ts
import { ZeroBytes32 as ZeroBytes322 } from "@fuel-ts/address/configs";
import { ErrorCode as ErrorCode3, FuelError as FuelError3 } from "@fuel-ts/errors";
import { bn as bn3 } from "@fuel-ts/math";
import { OutputType } from "@fuel-ts/transactions";
import { hexlify as hexlify4 } from "ethers";
var outputify = (value) => {
  const { type } = value;
  switch (type) {
    case OutputType.Coin: {
      return {
        type: OutputType.Coin,
        to: hexlify4(value.to),
        amount: bn3(value.amount),
        assetId: hexlify4(value.assetId)
      };
    }
    case OutputType.Contract: {
      return {
        type: OutputType.Contract,
        inputIndex: value.inputIndex,
        balanceRoot: ZeroBytes322,
        stateRoot: ZeroBytes322
      };
    }
    case OutputType.Change: {
      return {
        type: OutputType.Change,
        to: hexlify4(value.to),
        amount: bn3(0),
        assetId: hexlify4(value.assetId)
      };
    }
    case OutputType.Variable: {
      return {
        type: OutputType.Variable,
        to: ZeroBytes322,
        amount: bn3(0),
        assetId: ZeroBytes322
      };
    }
    case OutputType.ContractCreated: {
      return {
        type: OutputType.ContractCreated,
        contractId: hexlify4(value.contractId),
        stateRoot: hexlify4(value.stateRoot)
      };
    }
    default: {
      throw new FuelError3(
        ErrorCode3.INVALID_TRANSACTION_INPUT,
        `Invalid transaction output type: ${type}.`
      );
    }
  }
};

// src/transaction-request/transaction-request.ts
import { Address, addressify, getRandomB256 } from "@fuel-ts/address";
import { BaseAssetId as BaseAssetId2, ZeroBytes32 as ZeroBytes324 } from "@fuel-ts/address/configs";
import { bn as bn6 } from "@fuel-ts/math";
import {
  PolicyType,
  TransactionCoder,
  InputType as InputType2,
  OutputType as OutputType2,
  TransactionType
} from "@fuel-ts/transactions";
import { concat, getBytesCopy as getBytesCopy5, hexlify as hexlify7 } from "ethers";

// src/resource.ts
var isRawCoin = (resource) => "utxoId" in resource;
var isRawMessage = (resource) => "recipient" in resource;
var isCoin = (resource) => "id" in resource;
var isMessage = (resource) => "recipient" in resource;

// src/utils/receipts.ts
import { ZeroBytes32 as ZeroBytes323 } from "@fuel-ts/address/configs";
import { ErrorCode as ErrorCode4, FuelError as FuelError4 } from "@fuel-ts/errors";
import { bn as bn4 } from "@fuel-ts/math";
import {
  ReceiptBurnCoder,
  ReceiptMessageOutCoder,
  ReceiptMintCoder,
  ReceiptType
} from "@fuel-ts/transactions";
import { FAILED_TRANSFER_TO_ADDRESS_SIGNAL } from "@fuel-ts/transactions/configs";
import { getBytesCopy as getBytesCopy2 } from "ethers";
var doesReceiptHaveMissingOutputVariables = (receipt) => receipt.type === ReceiptType.Revert && receipt.val.toString("hex") === FAILED_TRANSFER_TO_ADDRESS_SIGNAL;
var doesReceiptHaveMissingContractId = (receipt) => receipt.type === ReceiptType.Panic && receipt.contractId !== "0x0000000000000000000000000000000000000000000000000000000000000000";
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
var hexOrZero = (hex) => hex || ZeroBytes323;
function assembleReceiptByType(receipt) {
  const { receiptType } = receipt;
  switch (receiptType) {
    case "CALL" /* Call */: {
      const callReceipt = {
        type: ReceiptType.Call,
        from: hexOrZero(receipt.contract?.id),
        to: hexOrZero(receipt?.to?.id),
        amount: bn4(receipt.amount),
        assetId: hexOrZero(receipt.assetId),
        gas: bn4(receipt.gas),
        param1: bn4(receipt.param1),
        param2: bn4(receipt.param2),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return callReceipt;
    }
    case "RETURN" /* Return */: {
      const returnReceipt = {
        type: ReceiptType.Return,
        id: hexOrZero(receipt.contract?.id),
        val: bn4(receipt.val),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return returnReceipt;
    }
    case "RETURN_DATA" /* ReturnData */: {
      const returnDataReceipt = {
        type: ReceiptType.ReturnData,
        id: hexOrZero(receipt.contract?.id),
        ptr: bn4(receipt.ptr),
        len: bn4(receipt.len),
        digest: hexOrZero(receipt.digest),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return returnDataReceipt;
    }
    case "PANIC" /* Panic */: {
      const panicReceipt = {
        type: ReceiptType.Panic,
        id: hexOrZero(receipt.contract?.id),
        reason: bn4(receipt.reason),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is),
        contractId: hexOrZero(receipt.contractId)
      };
      return panicReceipt;
    }
    case "REVERT" /* Revert */: {
      const revertReceipt = {
        type: ReceiptType.Revert,
        id: hexOrZero(receipt.contract?.id),
        val: bn4(receipt.ra),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return revertReceipt;
    }
    case "LOG" /* Log */: {
      const logReceipt = {
        type: ReceiptType.Log,
        id: hexOrZero(receipt.contract?.id),
        val0: bn4(receipt.ra),
        val1: bn4(receipt.rb),
        val2: bn4(receipt.rc),
        val3: bn4(receipt.rd),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return logReceipt;
    }
    case "LOG_DATA" /* LogData */: {
      const logDataReceipt = {
        type: ReceiptType.LogData,
        id: hexOrZero(receipt.contract?.id),
        val0: bn4(receipt.ra),
        val1: bn4(receipt.rb),
        ptr: bn4(receipt.ptr),
        len: bn4(receipt.len),
        digest: hexOrZero(receipt.digest),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return logDataReceipt;
    }
    case "TRANSFER" /* Transfer */: {
      const transferReceipt = {
        type: ReceiptType.Transfer,
        from: hexOrZero(receipt.contract?.id),
        to: hexOrZero(receipt.toAddress || receipt?.to?.id),
        amount: bn4(receipt.amount),
        assetId: hexOrZero(receipt.assetId),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return transferReceipt;
    }
    case "TRANSFER_OUT" /* TransferOut */: {
      const transferOutReceipt = {
        type: ReceiptType.TransferOut,
        from: hexOrZero(receipt.contract?.id),
        to: hexOrZero(receipt.toAddress || receipt.to?.id),
        amount: bn4(receipt.amount),
        assetId: hexOrZero(receipt.assetId),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return transferOutReceipt;
    }
    case "SCRIPT_RESULT" /* ScriptResult */: {
      const scriptResultReceipt = {
        type: ReceiptType.ScriptResult,
        result: bn4(receipt.result),
        gasUsed: bn4(receipt.gasUsed)
      };
      return scriptResultReceipt;
    }
    case "MESSAGE_OUT" /* MessageOut */: {
      const sender = hexOrZero(receipt.sender);
      const recipient = hexOrZero(receipt.recipient);
      const nonce = hexOrZero(receipt.nonce);
      const amount = bn4(receipt.amount);
      const data = receipt.data ? getBytesCopy2(receipt.data) : Uint8Array.from([]);
      const digest = hexOrZero(receipt.digest);
      const messageId = ReceiptMessageOutCoder.getMessageId({
        sender,
        recipient,
        nonce,
        amount,
        data
      });
      const receiptMessageOut = {
        type: ReceiptType.MessageOut,
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
      const assetId = ReceiptMintCoder.getAssetId(contractId, subId);
      const mintReceipt = {
        type: ReceiptType.Mint,
        subId,
        contractId,
        assetId,
        val: bn4(receipt.val),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return mintReceipt;
    }
    case "BURN" /* Burn */: {
      const contractId = hexOrZero(receipt.contract?.id);
      const subId = hexOrZero(receipt.subId);
      const assetId = ReceiptBurnCoder.getAssetId(contractId, subId);
      const burnReceipt = {
        type: ReceiptType.Burn,
        subId,
        contractId,
        assetId,
        val: bn4(receipt.val),
        pc: bn4(receipt.pc),
        is: bn4(receipt.is)
      };
      return burnReceipt;
    }
    default:
      throw new FuelError4(ErrorCode4.INVALID_RECEIPT_TYPE, `Invalid receipt type: ${receiptType}.`);
  }
}

// src/utils/block-explorer.ts
import { ErrorCode as ErrorCode5, FuelError as FuelError5 } from "@fuel-ts/errors";
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
    throw new FuelError5(
      ErrorCode5.ERROR_BUILDING_BLOCK_EXPLORER_URL,
      `Only one of the following can be passed in to buildBlockExplorerUrl: ${customInputParams.map((param) => param.key).join(", ")}.`
    );
  }
  if (path && definedValues.length > 0) {
    const inputKeys = customInputParams.map(({ key }) => key).join(", ");
    throw new FuelError5(
      ErrorCode5.ERROR_BUILDING_BLOCK_EXPLORER_URL,
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
import { bn as bn5 } from "@fuel-ts/math";
import { ReceiptType as ReceiptType2 } from "@fuel-ts/transactions";
import { getBytesCopy as getBytesCopy3 } from "ethers";
var calculatePriceWithFactor = (gas, gasPrice, priceFactor) => bn5(Math.ceil(gas.mul(gasPrice).toNumber() / priceFactor.toNumber()));
var getGasUsedFromReceipts = (receipts) => {
  const scriptResult = receipts.filter(
    (receipt) => receipt.type === ReceiptType2.ScriptResult
  );
  const gasUsed = scriptResult.reduce((prev, receipt) => prev.add(receipt.gasUsed), bn5(0));
  return gasUsed;
};
function resolveGasDependentCosts(byteSize, gasDependentCost) {
  const base = bn5(gasDependentCost.base);
  let dependentValue = bn5(0);
  if (gasDependentCost.__typename === "LightOperation") {
    dependentValue = bn5(byteSize).div(bn5(gasDependentCost.unitsPerGas));
  }
  if (gasDependentCost.__typename === "HeavyOperation") {
    dependentValue = bn5(byteSize).mul(bn5(gasDependentCost.gasPerUnit));
  }
  return base.add(dependentValue);
}
function gasUsedByInputs(inputs, txBytesSize, gasCosts) {
  const witnessCache = [];
  const totalGas = inputs.reduce((total, input) => {
    if ("predicate" in input && input.predicate && input.predicate !== "0x") {
      return total.add(
        resolveGasDependentCosts(txBytesSize, gasCosts.vmInitialization).add(
          resolveGasDependentCosts(getBytesCopy3(input.predicate).length, gasCosts.contractRoot)
        ).add(bn5(input.predicateGasUsed))
      );
    }
    if ("witnessIndex" in input && !witnessCache.includes(input.witnessIndex)) {
      witnessCache.push(input.witnessIndex);
      return total.add(gasCosts.ecr1);
    }
    return total;
  }, bn5());
  return totalGas;
}
function getMinGas(params) {
  const { gasCosts, gasPerByte, inputs, metadataGas, txBytesSize } = params;
  const vmInitGas = resolveGasDependentCosts(txBytesSize, gasCosts.vmInitialization);
  const bytesGas = bn5(txBytesSize).mul(gasPerByte);
  const inputsGas = gasUsedByInputs(inputs, txBytesSize, gasCosts);
  const minGas = vmInitGas.add(bytesGas).add(inputsGas).add(metadataGas).maxU64();
  return minGas;
}
function getMaxGas(params) {
  const { gasPerByte, witnessesLength, witnessLimit, minGas, gasLimit = bn5(0) } = params;
  let remainingAllowedWitnessGas = bn5(0);
  if (witnessLimit?.gt(0) && witnessLimit.gte(witnessesLength)) {
    remainingAllowedWitnessGas = bn5(witnessLimit).sub(witnessesLength).mul(gasPerByte);
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
  const contractIdInputSize = bn5(4 + 32 + 32 + 32);
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
import { hexlify as hexlify5 } from "ethers";
import { clone } from "ramda";
function normalize(object) {
  Object.keys(object).forEach((key) => {
    switch (object[key]?.constructor.name) {
      case "Uint8Array":
        object[key] = hexlify5(object[key]);
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
  return normalize(clone(root));
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
import { getBytesCopy as getBytesCopy4, hexlify as hexlify6 } from "ethers";
var witnessify = (value) => {
  const data = getBytesCopy4(value);
  return {
    data: hexlify6(data),
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
    this.gasPrice = bn6(gasPrice);
    this.maturity = maturity ?? 0;
    this.witnessLimit = witnessLimit ? bn6(witnessLimit) : void 0;
    this.maxFee = maxFee ? bn6(maxFee) : void 0;
    this.inputs = inputs ?? [];
    this.outputs = outputs ?? [];
    this.witnesses = witnesses ?? [];
  }
  static getPolicyMeta(req) {
    let policyTypes = 0;
    const policies = [];
    if (req.gasPrice) {
      policyTypes += PolicyType.GasPrice;
      policies.push({ data: req.gasPrice, type: PolicyType.GasPrice });
    }
    if (req.witnessLimit) {
      policyTypes += PolicyType.WitnessLimit;
      policies.push({ data: req.witnessLimit, type: PolicyType.WitnessLimit });
    }
    if (req.maturity > 0) {
      policyTypes += PolicyType.Maturity;
      policies.push({ data: req.maturity, type: PolicyType.Maturity });
    }
    if (req.maxFee) {
      policyTypes += PolicyType.MaxFee;
      policies.push({ data: req.maxFee, type: PolicyType.MaxFee });
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
    return new TransactionCoder().encode(this.toTransaction());
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
    this.witnesses.push(concat([ZeroBytes324, ZeroBytes324]));
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
      (input) => input.type === InputType2.Coin
    );
  }
  /**
   * Gets the coin outputs for a transaction.
   *
   * @returns The coin outputs.
   */
  getCoinOutputs() {
    return this.outputs.filter(
      (output) => output.type === OutputType2.Coin
    );
  }
  /**
   * Gets the change outputs for a transaction.
   *
   * @returns The change outputs.
   */
  getChangeOutputs() {
    return this.outputs.filter(
      (output) => output.type === OutputType2.Change
    );
  }
  /**
   * @hidden
   *
   * Returns the witnessIndex of the found CoinInput.
   */
  getCoinInputWitnessIndexByOwner(owner) {
    const ownerAddress = addressify(owner);
    const found = this.inputs.find((input) => {
      switch (input.type) {
        case InputType2.Coin:
          return hexlify7(input.owner) === ownerAddress.toB256();
        case InputType2.Message:
          return hexlify7(input.recipient) === ownerAddress.toB256();
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
      type: InputType2.Coin,
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
    const assetId = BaseAssetId2;
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
      type: InputType2.Message,
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
  addCoinOutput(to, amount, assetId = BaseAssetId2) {
    this.pushOutput({
      type: OutputType2.Coin,
      to: addressify(to).toB256(),
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
        type: OutputType2.Coin,
        to: addressify(to).toB256(),
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
  addChangeOutput(to, assetId = BaseAssetId2) {
    const changeOutput = this.getChangeOutputs().find(
      (output) => hexlify7(output.assetId) === assetId
    );
    if (!changeOutput) {
      this.pushOutput({
        type: OutputType2.Change,
        to: addressify(to).toB256(),
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
    const hasBaseAssetId = quantities.some(({ assetId }) => assetId === BaseAssetId2);
    if (!hasBaseAssetId) {
      quantities.push({ assetId: BaseAssetId2, amount: bn6(1) });
    }
    const owner = getRandomB256();
    const witnessToRemove = this.inputs.reduce(
      (acc, input) => {
        if (input.type === InputType2.Coin || input.type === InputType2.Message) {
          if (!acc[input.witnessIndex]) {
            acc[input.witnessIndex] = true;
          }
        }
        return acc;
      },
      {}
    );
    this.witnesses = this.witnesses.filter((_, idx) => !witnessToRemove[idx]);
    this.inputs = this.inputs.filter((input) => input.type === InputType2.Contract);
    this.outputs = this.outputs.filter((output) => output.type !== OutputType2.Change);
    const fakeResources = quantities.map(({ assetId, amount }, idx) => ({
      id: `${ZeroBytes324}0${idx}`,
      amount,
      assetId,
      owner: Address.fromB256(owner),
      maturity: 0,
      blockCreated: bn6(1),
      txCreatedIdx: bn6(1)
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
      amount: bn6(amount),
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
        (input) => "predicate" in input && input.predicate && input.predicate !== getBytesCopy5("0x")
      )
    );
  }
};

// src/transaction-request/create-transaction-request.ts
import { ZeroBytes32 as ZeroBytes326 } from "@fuel-ts/address/configs";
import { bn as bn8 } from "@fuel-ts/math";
import { TransactionType as TransactionType3, OutputType as OutputType4 } from "@fuel-ts/transactions";
import { getBytesCopy as getBytesCopy7, hexlify as hexlify9 } from "ethers";

// src/transaction-request/hash-transaction.ts
import { ZeroBytes32 as ZeroBytes325 } from "@fuel-ts/address/configs";
import { uint64ToBytesBE } from "@fuel-ts/hasher";
import { bn as bn7 } from "@fuel-ts/math";
import { TransactionType as TransactionType2, InputType as InputType3, OutputType as OutputType3, TransactionCoder as TransactionCoder2 } from "@fuel-ts/transactions";
import { concat as concat2, sha256 } from "ethers";
import { clone as clone2 } from "ramda";
function hashTransaction(transactionRequest, chainId) {
  const transaction = transactionRequest.toTransaction();
  if (transaction.type === TransactionType2.Script) {
    transaction.receiptsRoot = ZeroBytes325;
  }
  transaction.inputs = transaction.inputs.map((input) => {
    const inputClone = clone2(input);
    switch (inputClone.type) {
      case InputType3.Coin: {
        inputClone.txPointer = {
          blockHeight: 0,
          txIndex: 0
        };
        inputClone.predicateGasUsed = bn7(0);
        return inputClone;
      }
      case InputType3.Message: {
        inputClone.predicateGasUsed = bn7(0);
        return inputClone;
      }
      case InputType3.Contract: {
        inputClone.txPointer = {
          blockHeight: 0,
          txIndex: 0
        };
        inputClone.txID = ZeroBytes325;
        inputClone.outputIndex = 0;
        inputClone.balanceRoot = ZeroBytes325;
        inputClone.stateRoot = ZeroBytes325;
        return inputClone;
      }
      default:
        return inputClone;
    }
  });
  transaction.outputs = transaction.outputs.map((output) => {
    const outputClone = clone2(output);
    switch (outputClone.type) {
      case OutputType3.Contract: {
        outputClone.balanceRoot = ZeroBytes325;
        outputClone.stateRoot = ZeroBytes325;
        return outputClone;
      }
      case OutputType3.Change: {
        outputClone.amount = bn7(0);
        return outputClone;
      }
      case OutputType3.Variable: {
        outputClone.to = ZeroBytes325;
        outputClone.amount = bn7(0);
        outputClone.assetId = ZeroBytes325;
        return outputClone;
      }
      default:
        return outputClone;
    }
  });
  transaction.witnessesCount = 0;
  transaction.witnesses = [];
  const chainIdBytes = uint64ToBytesBE(chainId);
  const concatenatedData = concat2([chainIdBytes, new TransactionCoder2().encode(transaction)]);
  return sha256(concatenatedData);
}

// src/transaction-request/storage-slot.ts
import { getBytesCopy as getBytesCopy6, hexlify as hexlify8 } from "ethers";
var getStorageValue = (value) => {
  const v = new Uint8Array(32);
  v.set(getBytesCopy6(value));
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
    key: hexlify8(key),
    value: hexlify8(getStorageValue(value))
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
  type = TransactionType3.Create;
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
    this.salt = hexlify9(salt ?? ZeroBytes326);
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
      type: TransactionType3.Create,
      ...baseTransaction,
      bytecodeLength: baseTransaction.witnesses[bytecodeWitnessIndex].dataLength / 4,
      bytecodeWitnessIndex,
      storageSlotsCount: storageSlots.length,
      salt: this.salt ? hexlify9(this.salt) : ZeroBytes326,
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
      (output) => output.type === OutputType4.ContractCreated
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
      type: OutputType4.ContractCreated,
      contractId,
      stateRoot
    });
  }
  metadataGas(gasCosts) {
    return calculateMetadataGasForTxCreate({
      contractBytesSize: bn8(getBytesCopy7(this.witnesses[this.bytecodeWitnessIndex] || "0x").length),
      gasCosts,
      stateRootSize: this.storageSlots.length,
      txBytesSize: this.byteSize()
    });
  }
};

// src/transaction-request/script-transaction-request.ts
import { Interface } from "@fuel-ts/abi-coder";
import { addressify as addressify2 } from "@fuel-ts/address";
import { ZeroBytes32 as ZeroBytes327 } from "@fuel-ts/address/configs";
import { bn as bn9 } from "@fuel-ts/math";
import { InputType as InputType4, OutputType as OutputType5, TransactionType as TransactionType4 } from "@fuel-ts/transactions";
import { getBytesCopy as getBytesCopy9, hexlify as hexlify10 } from "ethers";

// src/transaction-request/scripts.ts
import { getBytesCopy as getBytesCopy8 } from "ethers";
var returnZeroScript = {
  /*
      Opcode::RET(REG_ZERO)
      Opcode::NOOP
    */
  // TODO: Don't use hardcoded scripts: https://github.com/FuelLabs/fuels-ts/issues/281
  bytes: getBytesCopy8("0x24000000"),
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
  bytes: getBytesCopy8("0x5040C0105D44C0064C40001124000000"),
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
  type = TransactionType4.Script;
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
    this.gasLimit = bn9(gasLimit);
    this.script = getBytesCopy9(script ?? returnZeroScript.bytes);
    this.scriptData = getBytesCopy9(scriptData ?? returnZeroScript.encodeScriptData());
  }
  /**
   * Converts the transaction request to a `TransactionScript`.
   *
   * @returns The transaction script object.
   */
  toTransaction() {
    const script = getBytesCopy9(this.script ?? "0x");
    const scriptData = getBytesCopy9(this.scriptData ?? "0x");
    return {
      type: TransactionType4.Script,
      scriptGasLimit: this.gasLimit,
      ...super.getBaseTransaction(),
      scriptLength: script.length,
      scriptDataLength: scriptData.length,
      receiptsRoot: ZeroBytes327,
      script: hexlify10(script),
      scriptData: hexlify10(scriptData)
    };
  }
  /**
   * Get contract inputs for the transaction.
   *
   * @returns An array of contract transaction request inputs.
   */
  getContractInputs() {
    return this.inputs.filter(
      (input) => input.type === InputType4.Contract
    );
  }
  /**
   * Get contract outputs for the transaction.
   *
   * @returns An array of contract transaction request outputs.
   */
  getContractOutputs() {
    return this.outputs.filter(
      (output) => output.type === OutputType5.Contract
    );
  }
  /**
   * Get variable outputs for the transaction.
   *
   * @returns An array of variable transaction request outputs.
   */
  getVariableOutputs() {
    return this.outputs.filter(
      (output) => output.type === OutputType5.Variable
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
        type: OutputType5.Variable
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
    const contractAddress = addressify2(contract);
    if (this.getContractInputs().find((i) => i.contractId === contractAddress.toB256())) {
      return this;
    }
    const inputIndex = super.pushInput({
      type: InputType4.Contract,
      contractId: contractAddress.toB256(),
      txPointer: "0x00000000000000000000000000000000"
    });
    this.pushOutput({
      type: OutputType5.Contract,
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
    const abiInterface = new Interface(abi);
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
import { ErrorCode as ErrorCode6, FuelError as FuelError6 } from "@fuel-ts/errors";
import { TransactionType as TransactionType5 } from "@fuel-ts/transactions";
var transactionRequestify = (obj) => {
  if (obj instanceof ScriptTransactionRequest || obj instanceof CreateTransactionRequest) {
    return obj;
  }
  const { type } = obj;
  switch (obj.type) {
    case TransactionType5.Script: {
      return ScriptTransactionRequest.from(obj);
    }
    case TransactionType5.Create: {
      return CreateTransactionRequest.from(obj);
    }
    default: {
      throw new FuelError6(ErrorCode6.INVALID_TRANSACTION_TYPE, `Invalid transaction type: ${type}.`);
    }
  }
};

// src/transaction-response/transaction-response.ts
import { ErrorCode as ErrorCode10, FuelError as FuelError10 } from "@fuel-ts/errors";
import { bn as bn13 } from "@fuel-ts/math";
import { TransactionCoder as TransactionCoder4 } from "@fuel-ts/transactions";
import { getBytesCopy as getBytesCopy11 } from "ethers";

// src/transaction-summary/assemble-transaction-summary.ts
import { hexlify as hexlify11 } from "ethers";

// src/transaction-summary/calculate-transaction-fee.ts
import { bn as bn10 } from "@fuel-ts/math";
import { PolicyType as PolicyType2, TransactionCoder as TransactionCoder3, TransactionType as TransactionType6 } from "@fuel-ts/transactions";
import { getBytesCopy as getBytesCopy10 } from "ethers";
var calculateTransactionFee = (params) => {
  const {
    gasUsed,
    rawPayload,
    consensusParameters: { gasCosts, feeParams }
  } = params;
  const gasPerByte = bn10(feeParams.gasPerByte);
  const gasPriceFactor = bn10(feeParams.gasPriceFactor);
  const transactionBytes = getBytesCopy10(rawPayload);
  const [transaction] = new TransactionCoder3().decode(transactionBytes, 0);
  if (transaction.type === TransactionType6.Mint) {
    return {
      fee: bn10(0),
      minFee: bn10(0),
      maxFee: bn10(0),
      feeFromGasUsed: bn10(0)
    };
  }
  const { type, witnesses, inputs, policies } = transaction;
  let metadataGas = bn10(0);
  let gasLimit = bn10(0);
  if (type === TransactionType6.Create) {
    const { bytecodeWitnessIndex, storageSlots } = transaction;
    const contractBytesSize = bn10(getBytesCopy10(witnesses[bytecodeWitnessIndex].data).length);
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
    gasPerByte: bn10(gasPerByte),
    inputs,
    metadataGas,
    txBytesSize: transactionBytes.length
  });
  const gasPrice = bn10(policies.find((policy) => policy.type === PolicyType2.GasPrice)?.data);
  const witnessLimit = policies.find((policy) => policy.type === PolicyType2.WitnessLimit)?.data;
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
import { TAI64 } from "tai64";
var fromTai64ToDate = (tai64Timestamp) => {
  const timestamp = TAI64.fromString(tai64Timestamp, 10).toUnix();
  return new Date(timestamp * 1e3);
};
var fromDateToTai64 = (date) => TAI64.fromUnix(Math.floor(date.getTime() / 1e3)).toString(10);

// src/transaction-summary/operations.ts
import { ErrorCode as ErrorCode8, FuelError as FuelError8 } from "@fuel-ts/errors";
import { bn as bn12 } from "@fuel-ts/math";
import { ReceiptType as ReceiptType3, TransactionType as TransactionType7 } from "@fuel-ts/transactions";

// src/transaction-summary/call.ts
import { Interface as Interface2, calculateVmTxMemory } from "@fuel-ts/abi-coder";
import { bn as bn11 } from "@fuel-ts/math";
var getFunctionCall = ({ abi, receipt, rawPayload, maxInputs }) => {
  const abiInterface = new Interface2(abi);
  const callFunctionSelector = receipt.param1.toHex(8);
  const functionFragment = abiInterface.getFunction(callFunctionSelector);
  const inputs = functionFragment.jsonFn.inputs;
  let encodedArgs;
  if (functionFragment.isInputDataPointer) {
    if (rawPayload) {
      const argsOffset = bn11(receipt.param2).sub(calculateVmTxMemory({ maxInputs: maxInputs.toNumber() })).toNumber();
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
import { ErrorCode as ErrorCode7, FuelError as FuelError7 } from "@fuel-ts/errors";
import { InputType as InputType5 } from "@fuel-ts/transactions";
function getInputsByType(inputs, type) {
  return inputs.filter((i) => i.type === type);
}
function getInputsCoin(inputs) {
  return getInputsByType(inputs, InputType5.Coin);
}
function getInputsMessage(inputs) {
  return getInputsByType(inputs, InputType5.Message);
}
function getInputsContract(inputs) {
  return getInputsByType(inputs, InputType5.Contract);
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
  if (contractInput.type !== InputType5.Contract) {
    throw new FuelError7(
      ErrorCode7.INVALID_TRANSACTION_INPUT,
      `Contract input should be of type 'contract'.`
    );
  }
  return contractInput;
}
function getInputAccountAddress(input) {
  if (input.type === InputType5.Coin) {
    return input.owner.toString();
  }
  if (input.type === InputType5.Message) {
    return input.recipient.toString();
  }
  return "";
}

// src/transaction-summary/output.ts
import { OutputType as OutputType6 } from "@fuel-ts/transactions";
function getOutputsByType(outputs, type) {
  return outputs.filter((o) => o.type === type);
}
function getOutputsContractCreated(outputs) {
  return getOutputsByType(outputs, OutputType6.ContractCreated);
}
function getOutputsCoin(outputs) {
  return getOutputsByType(outputs, OutputType6.Coin);
}
function getOutputsChange(outputs) {
  return getOutputsByType(outputs, OutputType6.Change);
}
function getOutputsContract(outputs) {
  return getOutputsByType(outputs, OutputType6.Contract);
}
function getOutputsVariable(outputs) {
  return getOutputsByType(outputs, OutputType6.Variable);
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
    case TransactionType7.Mint:
      return "Mint" /* Mint */;
    case TransactionType7.Create:
      return "Create" /* Create */;
    case TransactionType7.Script:
      return "Script" /* Script */;
    default:
      throw new FuelError8(
        ErrorCode8.INVALID_TRANSACTION_TYPE,
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
  return getReceiptsByType(receipts, ReceiptType3.Call);
}
function getReceiptsMessageOut(receipts) {
  return getReceiptsByType(receipts, ReceiptType3.MessageOut);
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
    return { ...coin, amount: bn12(coin.amount).add(asset.amount) };
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
  return getReceiptsByType(receipts, ReceiptType3.TransferOut);
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
    ReceiptType3.Transfer
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
import { ReceiptType as ReceiptType4 } from "@fuel-ts/transactions";
var processGqlReceipt = (gqlReceipt) => {
  const receipt = assembleReceiptByType(gqlReceipt);
  switch (receipt.type) {
    case ReceiptType4.ReturnData: {
      return {
        ...receipt,
        data: gqlReceipt.data || "0x"
      };
    }
    case ReceiptType4.LogData: {
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
    if (receipt.type === ReceiptType4.Mint) {
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
    if (receipt.type === ReceiptType4.Burn) {
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
import { ErrorCode as ErrorCode9, FuelError as FuelError9 } from "@fuel-ts/errors";
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
      throw new FuelError9(
        ErrorCode9.INVALID_TRANSACTION_STATUS,
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
  const rawPayload = hexlify11(transactionBytes);
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
  gasUsed = bn13(0);
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
    return new TransactionCoder4().decode(
      getBytesCopy11(transactionWithReceipts.rawPayload),
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
      transactionBytes: getBytesCopy11(transaction.rawPayload),
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
      throw new FuelError10(
        ErrorCode10.TRANSACTION_FAILED,
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
import { U64Coder } from "@fuel-ts/abi-coder";
import { ReceiptType as ReceiptType5 } from "@fuel-ts/transactions";
function getDecodedLogs(receipts, abiInterface) {
  return receipts.reduce((logs, r) => {
    if (r.type === ReceiptType5.LogData) {
      logs.push(abiInterface.decodeLog(r.data, r.val1.toNumber(), r.id)[0]);
    }
    if (r.type === ReceiptType5.Log) {
      logs.push(abiInterface.decodeLog(new U64Coder().encode(r.val0), r.val1.toNumber(), r.id)[0]);
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
    baseChainHeight: bn14(daHeight),
    consensusParameters: {
      contractMaxSize: bn14(contractParams.contractMaxSize),
      maxInputs: bn14(txParams.maxInputs),
      maxOutputs: bn14(txParams.maxOutputs),
      maxWitnesses: bn14(txParams.maxWitnesses),
      maxGasPerTx: bn14(txParams.maxGasPerTx),
      maxScriptLength: bn14(scriptParams.maxScriptLength),
      maxScriptDataLength: bn14(scriptParams.maxScriptDataLength),
      maxStorageSlots: bn14(contractParams.maxStorageSlots),
      maxPredicateLength: bn14(predicateParams.maxPredicateLength),
      maxPredicateDataLength: bn14(predicateParams.maxPredicateDataLength),
      maxGasPerPredicate: bn14(predicateParams.maxGasPerPredicate),
      gasPriceFactor: bn14(feeParams.gasPriceFactor),
      gasPerByte: bn14(feeParams.gasPerByte),
      maxMessageDataLength: bn14(predicateParams.maxMessageDataLength),
      chainId: bn14(consensusParameters.chainId),
      gasCosts
    },
    gasCosts,
    latestBlock: {
      id: latestBlock.id,
      height: bn14(latestBlock.header.height),
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
      throw new FuelError11(
        ErrorCode11.CHAIN_INFO_CACHE_EMPTY,
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
      throw new FuelError11(
        ErrorCode11.NODE_INFO_CACHE_EMPTY,
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
    const { isMajorSupported, isMinorSupported, supportedVersion } = checkFuelCoreVersionCompatibility(nodeInfo.nodeVersion);
    if (!isMajorSupported || !isMinorSupported) {
      throw new FuelError11(
        FuelError11.CODES.UNSUPPORTED_FUEL_CLIENT_VERSION,
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
    const gqlClient = new GraphQLClient(url, options.fetch ? { fetch: options.fetch } : void 0);
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
    const network = new Network(name, chainId.toNumber());
    return Promise.resolve(network);
  }
  /**
   * Returns the block number.
   *
   * @returns A promise that resolves to the block number
   */
  async getBlockNumber() {
    const { chain } = await this.operations.getChain();
    return bn14(chain.latestBlock.header.height, 10);
  }
  /**
   * Returns the chain information.
   * @param url - The URL of the Fuel node
   * @returns NodeInfo object
   */
  async fetchNode() {
    const { nodeInfo } = await this.operations.getNodeInfo();
    const processedNodeInfo = {
      maxDepth: bn14(nodeInfo.maxDepth),
      maxTx: bn14(nodeInfo.maxTx),
      minGasPrice: bn14(nodeInfo.minGasPrice),
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
    const encodedTransaction = hexlify12(transactionRequest.toTransactionBytes());
    const { gasUsed, minGasPrice } = await this.getTransactionCost(transactionRequest, [], {
      estimateTxDependencies: false,
      estimatePredicates: false
    });
    if (bn14(minGasPrice).gt(bn14(transactionRequest.gasPrice))) {
      throw new FuelError11(
        ErrorCode11.GAS_PRICE_TOO_LOW,
        `Gas price '${transactionRequest.gasPrice}' is lower than the required: '${minGasPrice}'.`
      );
    }
    const isScriptTransaction = transactionRequest.type === TransactionType8.Script;
    if (isScriptTransaction && bn14(gasUsed).gt(bn14(transactionRequest.gasLimit))) {
      throw new FuelError11(
        ErrorCode11.GAS_LIMIT_TOO_LOW,
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
    const encodedTransaction = hexlify12(transactionRequest.toTransactionBytes());
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
    const encodedTransaction = hexlify12(transactionRequest.toTransactionBytes());
    const response = await this.operations.estimatePredicates({
      encodedTransaction
    });
    const estimatedTransaction = transactionRequest;
    const [decodedTransaction] = new TransactionCoder5().decode(
      getBytesCopy12(response.estimatePredicates.rawPayload),
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
    if (transactionRequest.type === TransactionType8.Create) {
      return;
    }
    let txRequest = transactionRequest;
    if (txRequest.hasPredicateInput()) {
      txRequest = await this.estimatePredicates(txRequest);
    }
    do {
      const { dryRun: gqlReceipts } = await this.operations.dryRun({
        encodedTransaction: hexlify12(txRequest.toTransactionBytes()),
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
          ({ contractId }) => txRequest.addContractInputAndOutput(Address2.fromString(contractId))
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
    const encodedTransaction = hexlify12(transactionRequest.toTransactionBytes());
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
    const transactionRequest = transactionRequestify(clone3(transactionRequestLike));
    const chainInfo = this.getChain();
    const { gasPriceFactor, minGasPrice, maxGasPerTx } = this.getGasConfig();
    const gasPrice = max(transactionRequest.gasPrice, minGasPrice);
    const isScriptTransaction = transactionRequest.type === TransactionType8.Script;
    if (transactionRequest.hasPredicateInput() && estimatePredicates) {
      if (isScriptTransaction) {
        transactionRequest.gasLimit = bn14(0);
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
      transactionRequest.gasPrice = bn14(0);
      transactionRequest.gasLimit = bn14(maxGasPerTx.sub(maxGas).toNumber() * 0.9);
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
    const transactionRequest = transactionRequestify(clone3(transactionRequestLike));
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
      filter: { owner: owner.toB256(), assetId: assetId && hexlify12(assetId) }
    });
    const coins = result.coins.edges.map((edge) => edge.node);
    return coins.map((coin) => ({
      id: coin.utxoId,
      assetId: coin.assetId,
      amount: bn14(coin.amount),
      owner: Address2.fromAddressOrString(coin.owner),
      maturity: bn14(coin.maturity).toNumber(),
      blockCreated: bn14(coin.blockCreated),
      txCreatedIdx: bn14(coin.txCreatedIdx)
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
      messages: excludedIds?.messages?.map((id) => hexlify12(id)) || [],
      utxos: excludedIds?.utxos?.map((id) => hexlify12(id)) || []
    };
    if (this.cache) {
      const uniqueUtxos = new Set(
        excludeInput.utxos.concat(this.cache?.getActiveData().map((id) => hexlify12(id)))
      );
      excludeInput.utxos = Array.from(uniqueUtxos);
    }
    const coinsQuery = {
      owner: owner.toB256(),
      queryPerAsset: quantities.map(coinQuantityfy).map(({ assetId, amount, max: maxPerAsset }) => ({
        assetId: hexlify12(assetId),
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
            amount: bn14(coin.amount),
            assetId: coin.assetId,
            daHeight: bn14(coin.daHeight),
            sender: Address2.fromAddressOrString(coin.sender),
            recipient: Address2.fromAddressOrString(coin.recipient),
            nonce: coin.nonce
          };
        case "Coin":
          return {
            id: coin.utxoId,
            amount: bn14(coin.amount),
            assetId: coin.assetId,
            owner: Address2.fromAddressOrString(coin.owner),
            maturity: bn14(coin.maturity).toNumber(),
            blockCreated: bn14(coin.blockCreated),
            txCreatedIdx: bn14(coin.txCreatedIdx)
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
      variables = { height: bn14(idOrHeight).toString(10) };
    } else if (idOrHeight === "latest") {
      variables = { height: (await this.getBlockNumber()).toString(10) };
    } else if (idOrHeight.length === 66) {
      variables = { blockId: idOrHeight };
    } else {
      variables = { blockId: bn14(idOrHeight).toString(10) };
    }
    const { block } = await this.operations.getBlock(variables);
    if (!block) {
      return null;
    }
    return {
      id: block.id,
      height: bn14(block.header.height),
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
      height: bn14(block.header.height),
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
      variables = { blockHeight: bn14(idOrHeight).toString(10) };
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
      height: bn14(block.header.height, 10),
      time: block.header.time,
      transactionIds: block.transactions.map((tx) => tx.id),
      transactions: block.transactions.map(
        (tx) => new TransactionCoder5().decode(getBytesCopy12(tx.rawPayload), 0)?.[0]
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
    return new TransactionCoder5().decode(
      getBytesCopy12(transaction.rawPayload),
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
      asset: hexlify12(assetId)
    });
    return bn14(contractBalance.amount, 10);
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
      assetId: hexlify12(assetId)
    });
    return bn14(balance.amount, 10);
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
      amount: bn14(balance.amount)
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
      messageId: InputMessageCoder.getMessageId({
        sender: message.sender,
        recipient: message.recipient,
        nonce: message.nonce,
        amount: bn14(message.amount),
        data: message.data
      }),
      sender: Address2.fromAddressOrString(message.sender),
      recipient: Address2.fromAddressOrString(message.recipient),
      nonce: message.nonce,
      amount: bn14(message.amount),
      data: InputMessageCoder.decodeData(message.data),
      daHeight: bn14(message.daHeight)
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
      throw new FuelError11(
        ErrorCode11.INVALID_INPUT_PARAMETERS,
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
        proofIndex: bn14(messageProof.proofIndex),
        proofSet: messageProof.proofSet
      },
      blockProof: {
        proofIndex: bn14(blockProof.proofIndex),
        proofSet: blockProof.proofSet
      },
      messageBlockHeader: {
        id: messageBlockHeader.id,
        daHeight: bn14(messageBlockHeader.daHeight),
        transactionsCount: bn14(messageBlockHeader.transactionsCount),
        transactionsRoot: messageBlockHeader.transactionsRoot,
        height: bn14(messageBlockHeader.height),
        prevRoot: messageBlockHeader.prevRoot,
        time: messageBlockHeader.time,
        applicationHash: messageBlockHeader.applicationHash,
        messageReceiptRoot: messageBlockHeader.messageReceiptRoot,
        messageReceiptCount: bn14(messageBlockHeader.messageReceiptCount)
      },
      commitBlockHeader: {
        id: commitBlockHeader.id,
        daHeight: bn14(commitBlockHeader.daHeight),
        transactionsCount: bn14(commitBlockHeader.transactionsCount),
        transactionsRoot: commitBlockHeader.transactionsRoot,
        height: bn14(commitBlockHeader.height),
        prevRoot: commitBlockHeader.prevRoot,
        time: commitBlockHeader.time,
        applicationHash: commitBlockHeader.applicationHash,
        messageReceiptRoot: commitBlockHeader.messageReceiptRoot,
        messageReceiptCount: bn14(commitBlockHeader.messageReceiptCount)
      },
      sender: Address2.fromAddressOrString(sender),
      recipient: Address2.fromAddressOrString(recipient),
      nonce,
      amount: bn14(amount),
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
      blocksToProduce: bn14(amount).toString(10),
      startTimestamp: startTime ? fromUnixToTai64(startTime) : void 0
    });
    return bn14(latestBlockHeight);
  }
};
var Provider = _Provider;
_cacheInputs = new WeakSet();
cacheInputs_fn = function(inputs) {
  if (!this.cache) {
    return;
  }
  inputs.forEach((input) => {
    if (input.type === InputType6.Coin) {
      this.cache?.set(input.id);
    }
  });
};
__publicField(Provider, "chainInfoCache", {});
__publicField(Provider, "nodeInfoCache", {});

// src/transaction-summary/get-transaction-summary.ts
import { ErrorCode as ErrorCode12, FuelError as FuelError12 } from "@fuel-ts/errors";
import { bn as bn15 } from "@fuel-ts/math";
import { TransactionCoder as TransactionCoder6 } from "@fuel-ts/transactions";
import { getBytesCopy as getBytesCopy13 } from "ethers";
async function getTransactionSummary(params) {
  const { id, provider, abiMap } = params;
  const { transaction: gqlTransaction } = await provider.operations.getTransactionWithReceipts({
    transactionId: id
  });
  if (!gqlTransaction) {
    throw new FuelError12(
      ErrorCode12.TRANSACTION_NOT_FOUND,
      `Transaction not found for given id: ${id}.`
    );
  }
  const [decodedTransaction] = new TransactionCoder6().decode(
    getBytesCopy13(gqlTransaction.rawPayload),
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
    transactionBytes: getBytesCopy13(gqlTransaction.rawPayload),
    gqlTransactionStatus: gqlTransaction.status,
    gasPerByte: bn15(gasPerByte),
    gasPriceFactor: bn15(gasPriceFactor),
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
    const [decodedTransaction] = new TransactionCoder6().decode(getBytesCopy13(rawPayload), 0);
    const receipts = gqlReceipts?.map(processGqlReceipt) || [];
    const transactionSummary = assembleTransactionSummary({
      id,
      receipts,
      transaction: decodedTransaction,
      transactionBytes: getBytesCopy13(rawPayload),
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
export {
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
};
//# sourceMappingURL=index.mjs.map