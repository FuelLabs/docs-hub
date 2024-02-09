/// <reference types="web" />
import type { GraphQLClient } from 'graphql-request';
import type * as Dom from 'graphql-request/dist/types.dom';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Address: string;
    AssetId: string;
    BlockId: string;
    Bytes32: string;
    ContractId: string;
    HexString: string;
    Nonce: string;
    Salt: string;
    Signature: any;
    Tai64Timestamp: any;
    TransactionId: string;
    TxPointer: any;
    U8: any;
    U32: any;
    U64: string;
    UtxoId: string;
};
export type GqlBalance = {
    __typename: 'Balance';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    owner: Scalars['Address'];
};
export type GqlBalanceConnection = {
    __typename: 'BalanceConnection';
    /** A list of edges. */
    edges: Array<GqlBalanceEdge>;
    /** A list of nodes. */
    nodes: Array<GqlBalance>;
    /** Information to aid in pagination. */
    pageInfo: GqlPageInfo;
};
/** An edge in a connection. */
export type GqlBalanceEdge = {
    __typename: 'BalanceEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node: GqlBalance;
};
export type GqlBalanceFilterInput = {
    /** Filter coins based on the `owner` field */
    owner: Scalars['Address'];
};
export type GqlBlock = {
    __typename: 'Block';
    consensus: GqlConsensus;
    header: GqlHeader;
    id: Scalars['BlockId'];
    transactions: Array<GqlTransaction>;
};
export type GqlBlockConnection = {
    __typename: 'BlockConnection';
    /** A list of edges. */
    edges: Array<GqlBlockEdge>;
    /** A list of nodes. */
    nodes: Array<GqlBlock>;
    /** Information to aid in pagination. */
    pageInfo: GqlPageInfo;
};
/** An edge in a connection. */
export type GqlBlockEdge = {
    __typename: 'BlockEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node: GqlBlock;
};
export type GqlBreakpoint = {
    contract: Scalars['ContractId'];
    pc: Scalars['U64'];
};
export type GqlChainInfo = {
    __typename: 'ChainInfo';
    consensusParameters: GqlConsensusParameters;
    daHeight: Scalars['U64'];
    gasCosts: GqlGasCosts;
    latestBlock: GqlBlock;
    name: Scalars['String'];
};
export type GqlChangeOutput = {
    __typename: 'ChangeOutput';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    to: Scalars['Address'];
};
export type GqlCoin = {
    __typename: 'Coin';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    /** TxPointer - the height of the block this coin was created in */
    blockCreated: Scalars['U32'];
    maturity: Scalars['U32'];
    owner: Scalars['Address'];
    /** TxPointer - the index of the transaction that created this coin */
    txCreatedIdx: Scalars['U64'];
    utxoId: Scalars['UtxoId'];
};
export type GqlCoinConnection = {
    __typename: 'CoinConnection';
    /** A list of edges. */
    edges: Array<GqlCoinEdge>;
    /** A list of nodes. */
    nodes: Array<GqlCoin>;
    /** Information to aid in pagination. */
    pageInfo: GqlPageInfo;
};
/** An edge in a connection. */
export type GqlCoinEdge = {
    __typename: 'CoinEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node: GqlCoin;
};
export type GqlCoinFilterInput = {
    /** Returns coins only with `asset_id`. */
    assetId?: InputMaybe<Scalars['AssetId']>;
    /** Returns coins owned by the `owner`. */
    owner: Scalars['Address'];
};
export type GqlCoinOutput = {
    __typename: 'CoinOutput';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    to: Scalars['Address'];
};
/** The schema analog of the [`coins::CoinType`]. */
export type GqlCoinType = GqlCoin | GqlMessageCoin;
export type GqlConsensus = GqlGenesis | GqlPoAConsensus;
export type GqlConsensusParameters = {
    __typename: 'ConsensusParameters';
    baseAssetId: Scalars['AssetId'];
    chainId: Scalars['U64'];
    contractParams: GqlContractParameters;
    feeParams: GqlFeeParameters;
    gasCosts: GqlGasCosts;
    predicateParams: GqlPredicateParameters;
    scriptParams: GqlScriptParameters;
    txParams: GqlTxParameters;
};
export type GqlContract = {
    __typename: 'Contract';
    bytecode: Scalars['HexString'];
    id: Scalars['ContractId'];
    salt: Scalars['Salt'];
};
export type GqlContractBalance = {
    __typename: 'ContractBalance';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    contract: Scalars['ContractId'];
};
export type GqlContractBalanceConnection = {
    __typename: 'ContractBalanceConnection';
    /** A list of edges. */
    edges: Array<GqlContractBalanceEdge>;
    /** A list of nodes. */
    nodes: Array<GqlContractBalance>;
    /** Information to aid in pagination. */
    pageInfo: GqlPageInfo;
};
/** An edge in a connection. */
export type GqlContractBalanceEdge = {
    __typename: 'ContractBalanceEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node: GqlContractBalance;
};
export type GqlContractBalanceFilterInput = {
    /** Filter assets based on the `contractId` field */
    contract: Scalars['ContractId'];
};
export type GqlContractCreated = {
    __typename: 'ContractCreated';
    contract: GqlContract;
    stateRoot: Scalars['Bytes32'];
};
export type GqlContractOutput = {
    __typename: 'ContractOutput';
    balanceRoot: Scalars['Bytes32'];
    inputIndex: Scalars['Int'];
    stateRoot: Scalars['Bytes32'];
};
export type GqlContractParameters = {
    __typename: 'ContractParameters';
    contractMaxSize: Scalars['U64'];
    maxStorageSlots: Scalars['U64'];
};
export type GqlDependentCost = GqlHeavyOperation | GqlLightOperation;
export type GqlExcludeInput = {
    /** Messages to exclude from the selection. */
    messages: Array<Scalars['Nonce']>;
    /** Utxos to exclude from the selection. */
    utxos: Array<Scalars['UtxoId']>;
};
export type GqlFailureStatus = {
    __typename: 'FailureStatus';
    block: GqlBlock;
    programState?: Maybe<GqlProgramState>;
    reason: Scalars['String'];
    receipts: Array<GqlReceipt>;
    time: Scalars['Tai64Timestamp'];
    transactionId: Scalars['TransactionId'];
};
export type GqlFeeParameters = {
    __typename: 'FeeParameters';
    gasPerByte: Scalars['U64'];
    gasPriceFactor: Scalars['U64'];
};
export type GqlGasCosts = {
    __typename: 'GasCosts';
    add: Scalars['U64'];
    addi: Scalars['U64'];
    aloc: Scalars['U64'];
    and: Scalars['U64'];
    andi: Scalars['U64'];
    bal: Scalars['U64'];
    bhei: Scalars['U64'];
    bhsh: Scalars['U64'];
    burn: Scalars['U64'];
    call: GqlDependentCost;
    cb: Scalars['U64'];
    ccp: GqlDependentCost;
    cfei: Scalars['U64'];
    cfsi: Scalars['U64'];
    contractRoot: GqlDependentCost;
    croo: Scalars['U64'];
    csiz: GqlDependentCost;
    div: Scalars['U64'];
    divi: Scalars['U64'];
    eck1: Scalars['U64'];
    ecr1: Scalars['U64'];
    ed19: Scalars['U64'];
    eq: Scalars['U64'];
    exp: Scalars['U64'];
    expi: Scalars['U64'];
    flag: Scalars['U64'];
    gm: Scalars['U64'];
    gt: Scalars['U64'];
    gtf: Scalars['U64'];
    ji: Scalars['U64'];
    jmp: Scalars['U64'];
    jmpb: Scalars['U64'];
    jmpf: Scalars['U64'];
    jne: Scalars['U64'];
    jneb: Scalars['U64'];
    jnef: Scalars['U64'];
    jnei: Scalars['U64'];
    jnzb: Scalars['U64'];
    jnzf: Scalars['U64'];
    jnzi: Scalars['U64'];
    k256: GqlDependentCost;
    lb: Scalars['U64'];
    ldc: GqlDependentCost;
    log: Scalars['U64'];
    logd: GqlDependentCost;
    lt: Scalars['U64'];
    lw: Scalars['U64'];
    mcl: GqlDependentCost;
    mcli: GqlDependentCost;
    mcp: GqlDependentCost;
    mcpi: GqlDependentCost;
    meq: GqlDependentCost;
    mint: Scalars['U64'];
    mldv: Scalars['U64'];
    mlog: Scalars['U64'];
    modOp: Scalars['U64'];
    modi: Scalars['U64'];
    moveOp: Scalars['U64'];
    movi: Scalars['U64'];
    mroo: Scalars['U64'];
    mul: Scalars['U64'];
    muli: Scalars['U64'];
    newStoragePerByte: Scalars['U64'];
    noop: Scalars['U64'];
    not: Scalars['U64'];
    or: Scalars['U64'];
    ori: Scalars['U64'];
    poph: Scalars['U64'];
    popl: Scalars['U64'];
    pshh: Scalars['U64'];
    pshl: Scalars['U64'];
    ret: Scalars['U64'];
    retd: GqlDependentCost;
    rvrt: Scalars['U64'];
    s256: GqlDependentCost;
    sb: Scalars['U64'];
    scwq: GqlDependentCost;
    sll: Scalars['U64'];
    slli: Scalars['U64'];
    smo: GqlDependentCost;
    srl: Scalars['U64'];
    srli: Scalars['U64'];
    srw: Scalars['U64'];
    srwq: GqlDependentCost;
    stateRoot: GqlDependentCost;
    sub: Scalars['U64'];
    subi: Scalars['U64'];
    sw: Scalars['U64'];
    sww: Scalars['U64'];
    swwq: GqlDependentCost;
    time: Scalars['U64'];
    tr: Scalars['U64'];
    tro: Scalars['U64'];
    vmInitialization: GqlDependentCost;
    wdam: Scalars['U64'];
    wdcm: Scalars['U64'];
    wddv: Scalars['U64'];
    wdmd: Scalars['U64'];
    wdml: Scalars['U64'];
    wdmm: Scalars['U64'];
    wdop: Scalars['U64'];
    wqam: Scalars['U64'];
    wqcm: Scalars['U64'];
    wqdv: Scalars['U64'];
    wqmd: Scalars['U64'];
    wqml: Scalars['U64'];
    wqmm: Scalars['U64'];
    wqop: Scalars['U64'];
    xor: Scalars['U64'];
    xori: Scalars['U64'];
};
export type GqlGenesis = {
    __typename: 'Genesis';
    /**
     * The chain configs define what consensus type to use, what settlement layer to use,
     * rules of block validity, etc.
     */
    chainConfigHash: Scalars['Bytes32'];
    /** The Binary Merkle Tree root of all genesis coins. */
    coinsRoot: Scalars['Bytes32'];
    /** The Binary Merkle Tree root of state, balances, contracts code hash of each contract. */
    contractsRoot: Scalars['Bytes32'];
    /** The Binary Merkle Tree root of all genesis messages. */
    messagesRoot: Scalars['Bytes32'];
};
export type GqlHeader = {
    __typename: 'Header';
    /** Hash of the application header. */
    applicationHash: Scalars['Bytes32'];
    /** The layer 1 height of messages and events to include since the last layer 1 block number. */
    daHeight: Scalars['U64'];
    /** Fuel block height. */
    height: Scalars['U32'];
    /** Hash of the header */
    id: Scalars['BlockId'];
    /** Number of message receipts in this block. */
    messageReceiptCount: Scalars['U64'];
    /** Merkle root of message receipts in this block. */
    messageReceiptRoot: Scalars['Bytes32'];
    /** Merkle root of all previous block header hashes. */
    prevRoot: Scalars['Bytes32'];
    /** The block producer time. */
    time: Scalars['Tai64Timestamp'];
    /** Number of transactions in this block. */
    transactionsCount: Scalars['U64'];
    /** Merkle root of transactions. */
    transactionsRoot: Scalars['Bytes32'];
};
export type GqlHeavyOperation = {
    __typename: 'HeavyOperation';
    base: Scalars['U64'];
    gasPerUnit: Scalars['U64'];
};
export type GqlInput = GqlInputCoin | GqlInputContract | GqlInputMessage;
export type GqlInputCoin = {
    __typename: 'InputCoin';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    maturity: Scalars['U32'];
    owner: Scalars['Address'];
    predicate: Scalars['HexString'];
    predicateData: Scalars['HexString'];
    predicateGasUsed: Scalars['U64'];
    txPointer: Scalars['TxPointer'];
    utxoId: Scalars['UtxoId'];
    witnessIndex: Scalars['Int'];
};
export type GqlInputContract = {
    __typename: 'InputContract';
    balanceRoot: Scalars['Bytes32'];
    contract: GqlContract;
    stateRoot: Scalars['Bytes32'];
    txPointer: Scalars['TxPointer'];
    utxoId: Scalars['UtxoId'];
};
export type GqlInputMessage = {
    __typename: 'InputMessage';
    amount: Scalars['U64'];
    data: Scalars['HexString'];
    nonce: Scalars['Nonce'];
    predicate: Scalars['HexString'];
    predicateData: Scalars['HexString'];
    predicateGasUsed: Scalars['U64'];
    recipient: Scalars['Address'];
    sender: Scalars['Address'];
    witnessIndex: Scalars['Int'];
};
export type GqlLightOperation = {
    __typename: 'LightOperation';
    base: Scalars['U64'];
    unitsPerGas: Scalars['U64'];
};
export type GqlMerkleProof = {
    __typename: 'MerkleProof';
    proofIndex: Scalars['U64'];
    proofSet: Array<Scalars['Bytes32']>;
};
export type GqlMessage = {
    __typename: 'Message';
    amount: Scalars['U64'];
    daHeight: Scalars['U64'];
    data: Scalars['HexString'];
    nonce: Scalars['Nonce'];
    recipient: Scalars['Address'];
    sender: Scalars['Address'];
};
export type GqlMessageCoin = {
    __typename: 'MessageCoin';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    daHeight: Scalars['U64'];
    nonce: Scalars['Nonce'];
    recipient: Scalars['Address'];
    sender: Scalars['Address'];
};
export type GqlMessageConnection = {
    __typename: 'MessageConnection';
    /** A list of edges. */
    edges: Array<GqlMessageEdge>;
    /** A list of nodes. */
    nodes: Array<GqlMessage>;
    /** Information to aid in pagination. */
    pageInfo: GqlPageInfo;
};
/** An edge in a connection. */
export type GqlMessageEdge = {
    __typename: 'MessageEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node: GqlMessage;
};
export type GqlMessageProof = {
    __typename: 'MessageProof';
    amount: Scalars['U64'];
    blockProof: GqlMerkleProof;
    commitBlockHeader: GqlHeader;
    data: Scalars['HexString'];
    messageBlockHeader: GqlHeader;
    messageProof: GqlMerkleProof;
    nonce: Scalars['Nonce'];
    recipient: Scalars['Address'];
    sender: Scalars['Address'];
};
export declare enum GqlMessageState {
    NotFound = "NOT_FOUND",
    Spent = "SPENT",
    Unspent = "UNSPENT"
}
export type GqlMessageStatus = {
    __typename: 'MessageStatus';
    state: GqlMessageState;
};
export type GqlMutation = {
    __typename: 'Mutation';
    continueTx: GqlRunResult;
    /** Execute a dry-run of the transaction using a fork of current state, no changes are committed. */
    dryRun: Array<GqlReceipt>;
    endSession: Scalars['Boolean'];
    execute: Scalars['Boolean'];
    /**
     * Sequentially produces `blocks_to_produce` blocks. The first block starts with
     * `start_timestamp`. If the block production in the [`crate::service::Config`] is
     * `Trigger::Interval { block_time }`, produces blocks with `block_time ` intervals between
     * them. The `start_timestamp` is the timestamp in seconds.
     */
    produceBlocks: Scalars['U32'];
    reset: Scalars['Boolean'];
    setBreakpoint: Scalars['Boolean'];
    setSingleStepping: Scalars['Boolean'];
    startSession: Scalars['ID'];
    startTx: GqlRunResult;
    /**
     * Submits transaction to the `TxPool`.
     *
     * Returns submitted transaction if the transaction is included in the `TxPool` without problems.
     */
    submit: GqlTransaction;
};
export type GqlMutationContinueTxArgs = {
    id: Scalars['ID'];
};
export type GqlMutationDryRunArgs = {
    tx: Scalars['HexString'];
    utxoValidation?: InputMaybe<Scalars['Boolean']>;
};
export type GqlMutationEndSessionArgs = {
    id: Scalars['ID'];
};
export type GqlMutationExecuteArgs = {
    id: Scalars['ID'];
    op: Scalars['String'];
};
export type GqlMutationProduceBlocksArgs = {
    blocksToProduce: Scalars['U32'];
    startTimestamp?: InputMaybe<Scalars['Tai64Timestamp']>;
};
export type GqlMutationResetArgs = {
    id: Scalars['ID'];
};
export type GqlMutationSetBreakpointArgs = {
    breakpoint: GqlBreakpoint;
    id: Scalars['ID'];
};
export type GqlMutationSetSingleSteppingArgs = {
    enable: Scalars['Boolean'];
    id: Scalars['ID'];
};
export type GqlMutationStartTxArgs = {
    id: Scalars['ID'];
    txJson: Scalars['String'];
};
export type GqlMutationSubmitArgs = {
    tx: Scalars['HexString'];
};
export type GqlNodeInfo = {
    __typename: 'NodeInfo';
    maxDepth: Scalars['U64'];
    maxTx: Scalars['U64'];
    minGasPrice: Scalars['U64'];
    nodeVersion: Scalars['String'];
    peers: Array<GqlPeerInfo>;
    utxoValidation: Scalars['Boolean'];
    vmBacktrace: Scalars['Boolean'];
};
export type GqlOutput = GqlChangeOutput | GqlCoinOutput | GqlContractCreated | GqlContractOutput | GqlVariableOutput;
/**
 * A separate `Breakpoint` type to be used as an output, as a single
 * type cannot act as both input and output type in async-graphql
 */
export type GqlOutputBreakpoint = {
    __typename: 'OutputBreakpoint';
    contract: Scalars['ContractId'];
    pc: Scalars['U64'];
};
/** Information about pagination in a connection */
export type GqlPageInfo = {
    __typename: 'PageInfo';
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars['String']>;
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars['Boolean'];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars['Boolean'];
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars['String']>;
};
export type GqlPeerInfo = {
    __typename: 'PeerInfo';
    /** The advertised multi-addrs that can be used to connect to this peer */
    addresses: Array<Scalars['String']>;
    /** The internal fuel p2p reputation of this peer */
    appScore: Scalars['Float'];
    /** The last reported height of the peer */
    blockHeight?: Maybe<Scalars['U32']>;
    /** The self-reported version of the client the peer is using */
    clientVersion?: Maybe<Scalars['String']>;
    /** The libp2p peer id */
    id: Scalars['String'];
    /** The last heartbeat from this peer in unix epoch time ms */
    lastHeartbeatMs: Scalars['U64'];
};
export type GqlPoAConsensus = {
    __typename: 'PoAConsensus';
    /** Gets the signature of the block produced by `PoA` consensus. */
    signature: Scalars['Signature'];
};
export type GqlPolicies = {
    __typename: 'Policies';
    gasPrice?: Maybe<Scalars['U64']>;
    maturity?: Maybe<Scalars['U32']>;
    maxFee?: Maybe<Scalars['U64']>;
    witnessLimit?: Maybe<Scalars['U64']>;
};
export type GqlPredicateParameters = {
    __typename: 'PredicateParameters';
    maxGasPerPredicate: Scalars['U64'];
    maxMessageDataLength: Scalars['U64'];
    maxPredicateDataLength: Scalars['U64'];
    maxPredicateLength: Scalars['U64'];
};
export type GqlProgramState = {
    __typename: 'ProgramState';
    data: Scalars['HexString'];
    returnType: GqlReturnType;
};
export type GqlQuery = {
    __typename: 'Query';
    balance: GqlBalance;
    balances: GqlBalanceConnection;
    block?: Maybe<GqlBlock>;
    blocks: GqlBlockConnection;
    chain: GqlChainInfo;
    /** Gets the coin by `utxo_id`. */
    coin?: Maybe<GqlCoin>;
    /** Gets all unspent coins of some `owner` maybe filtered with by `asset_id` per page. */
    coins: GqlCoinConnection;
    /**
     * For each `query_per_asset`, get some spendable coins(of asset specified by the query) owned by
     * `owner` that add up at least the query amount. The returned coins can be spent.
     * The number of coins is optimized to prevent dust accumulation.
     *
     * The query supports excluding and maximum the number of coins.
     *
     * Returns:
     * The list of spendable coins per asset from the query. The length of the result is
     * the same as the length of `query_per_asset`. The ordering of assets and `query_per_asset`
     * is the same.
     */
    coinsToSpend: Array<Array<GqlCoinType>>;
    contract?: Maybe<GqlContract>;
    contractBalance: GqlContractBalance;
    contractBalances: GqlContractBalanceConnection;
    /** Estimate the predicate gas for the provided transaction */
    estimatePredicates: GqlTransaction;
    /** Returns true when the GraphQL API is serving requests. */
    health: Scalars['Boolean'];
    memory: Scalars['String'];
    messageProof?: Maybe<GqlMessageProof>;
    messageStatus: GqlMessageStatus;
    messages: GqlMessageConnection;
    nodeInfo: GqlNodeInfo;
    register: Scalars['U64'];
    transaction?: Maybe<GqlTransaction>;
    transactions: GqlTransactionConnection;
    transactionsByOwner: GqlTransactionConnection;
};
export type GqlQueryBalanceArgs = {
    assetId: Scalars['AssetId'];
    owner: Scalars['Address'];
};
export type GqlQueryBalancesArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    filter: GqlBalanceFilterInput;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
};
export type GqlQueryBlockArgs = {
    height?: InputMaybe<Scalars['U32']>;
    id?: InputMaybe<Scalars['BlockId']>;
};
export type GqlQueryBlocksArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
};
export type GqlQueryCoinArgs = {
    utxoId: Scalars['UtxoId'];
};
export type GqlQueryCoinsArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    filter: GqlCoinFilterInput;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
};
export type GqlQueryCoinsToSpendArgs = {
    excludedIds?: InputMaybe<GqlExcludeInput>;
    owner: Scalars['Address'];
    queryPerAsset: Array<GqlSpendQueryElementInput>;
};
export type GqlQueryContractArgs = {
    id: Scalars['ContractId'];
};
export type GqlQueryContractBalanceArgs = {
    asset: Scalars['AssetId'];
    contract: Scalars['ContractId'];
};
export type GqlQueryContractBalancesArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    filter: GqlContractBalanceFilterInput;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
};
export type GqlQueryEstimatePredicatesArgs = {
    tx: Scalars['HexString'];
};
export type GqlQueryMemoryArgs = {
    id: Scalars['ID'];
    size: Scalars['U32'];
    start: Scalars['U32'];
};
export type GqlQueryMessageProofArgs = {
    commitBlockHeight?: InputMaybe<Scalars['U32']>;
    commitBlockId?: InputMaybe<Scalars['BlockId']>;
    nonce: Scalars['Nonce'];
    transactionId: Scalars['TransactionId'];
};
export type GqlQueryMessageStatusArgs = {
    nonce: Scalars['Nonce'];
};
export type GqlQueryMessagesArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
    owner?: InputMaybe<Scalars['Address']>;
};
export type GqlQueryRegisterArgs = {
    id: Scalars['ID'];
    register: Scalars['U32'];
};
export type GqlQueryTransactionArgs = {
    id: Scalars['TransactionId'];
};
export type GqlQueryTransactionsArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
};
export type GqlQueryTransactionsByOwnerArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
    owner: Scalars['Address'];
};
export type GqlReceipt = {
    __typename: 'Receipt';
    amount?: Maybe<Scalars['U64']>;
    assetId?: Maybe<Scalars['AssetId']>;
    contract?: Maybe<GqlContract>;
    contractId?: Maybe<Scalars['ContractId']>;
    data?: Maybe<Scalars['HexString']>;
    digest?: Maybe<Scalars['Bytes32']>;
    gas?: Maybe<Scalars['U64']>;
    gasUsed?: Maybe<Scalars['U64']>;
    is?: Maybe<Scalars['U64']>;
    len?: Maybe<Scalars['U64']>;
    nonce?: Maybe<Scalars['Nonce']>;
    param1?: Maybe<Scalars['U64']>;
    param2?: Maybe<Scalars['U64']>;
    pc?: Maybe<Scalars['U64']>;
    ptr?: Maybe<Scalars['U64']>;
    ra?: Maybe<Scalars['U64']>;
    rb?: Maybe<Scalars['U64']>;
    rc?: Maybe<Scalars['U64']>;
    rd?: Maybe<Scalars['U64']>;
    reason?: Maybe<Scalars['U64']>;
    receiptType: GqlReceiptType;
    recipient?: Maybe<Scalars['Address']>;
    result?: Maybe<Scalars['U64']>;
    sender?: Maybe<Scalars['Address']>;
    subId?: Maybe<Scalars['Bytes32']>;
    to?: Maybe<GqlContract>;
    toAddress?: Maybe<Scalars['Address']>;
    val?: Maybe<Scalars['U64']>;
};
export declare enum GqlReceiptType {
    Burn = "BURN",
    Call = "CALL",
    Log = "LOG",
    LogData = "LOG_DATA",
    MessageOut = "MESSAGE_OUT",
    Mint = "MINT",
    Panic = "PANIC",
    Return = "RETURN",
    ReturnData = "RETURN_DATA",
    Revert = "REVERT",
    ScriptResult = "SCRIPT_RESULT",
    Transfer = "TRANSFER",
    TransferOut = "TRANSFER_OUT"
}
export declare enum GqlReturnType {
    Return = "RETURN",
    ReturnData = "RETURN_DATA",
    Revert = "REVERT"
}
export type GqlRunResult = {
    __typename: 'RunResult';
    breakpoint?: Maybe<GqlOutputBreakpoint>;
    jsonReceipts: Array<Scalars['String']>;
    state: GqlRunState;
};
export declare enum GqlRunState {
    /** Stopped on a breakpoint */
    Breakpoint = "BREAKPOINT",
    /** All breakpoints have been processed, and the program has terminated */
    Completed = "COMPLETED"
}
export type GqlScriptParameters = {
    __typename: 'ScriptParameters';
    maxScriptDataLength: Scalars['U64'];
    maxScriptLength: Scalars['U64'];
};
export type GqlSpendQueryElementInput = {
    /** Target amount for the query. */
    amount: Scalars['U64'];
    /** Identifier of the asset to spend. */
    assetId: Scalars['AssetId'];
    /** The maximum number of currencies for selection. */
    max?: InputMaybe<Scalars['U32']>;
};
export type GqlSqueezedOutStatus = {
    __typename: 'SqueezedOutStatus';
    reason: Scalars['String'];
};
export type GqlSubmittedStatus = {
    __typename: 'SubmittedStatus';
    time: Scalars['Tai64Timestamp'];
};
export type GqlSubscription = {
    __typename: 'Subscription';
    /**
     * Returns a stream of status updates for the given transaction id.
     * If the current status is [`TransactionStatus::Success`], [`TransactionStatus::SqueezedOut`]
     * or [`TransactionStatus::Failed`] the stream will return that and end immediately.
     * If the current status is [`TransactionStatus::Submitted`] this will be returned
     * and the stream will wait for a future update.
     *
     * This stream will wait forever so it's advised to use within a timeout.
     *
     * It is possible for the stream to miss an update if it is polled slower
     * then the updates arrive. In such a case the stream will close without
     * a status. If this occurs the stream can simply be restarted to return
     * the latest status.
     */
    statusChange: GqlTransactionStatus;
    /** Submits transaction to the `TxPool` and await either confirmation or failure. */
    submitAndAwait: GqlTransactionStatus;
};
export type GqlSubscriptionStatusChangeArgs = {
    id: Scalars['TransactionId'];
};
export type GqlSubscriptionSubmitAndAwaitArgs = {
    tx: Scalars['HexString'];
};
export type GqlSuccessStatus = {
    __typename: 'SuccessStatus';
    block: GqlBlock;
    programState?: Maybe<GqlProgramState>;
    receipts: Array<GqlReceipt>;
    time: Scalars['Tai64Timestamp'];
    transactionId: Scalars['TransactionId'];
};
export type GqlTransaction = {
    __typename: 'Transaction';
    bytecodeLength?: Maybe<Scalars['U64']>;
    bytecodeWitnessIndex?: Maybe<Scalars['Int']>;
    gasPrice?: Maybe<Scalars['U64']>;
    id: Scalars['TransactionId'];
    inputAssetIds?: Maybe<Array<Scalars['AssetId']>>;
    inputContract?: Maybe<GqlInputContract>;
    inputContracts?: Maybe<Array<GqlContract>>;
    inputs?: Maybe<Array<GqlInput>>;
    isCreate: Scalars['Boolean'];
    isMint: Scalars['Boolean'];
    isScript: Scalars['Boolean'];
    maturity?: Maybe<Scalars['U32']>;
    mintAmount?: Maybe<Scalars['U64']>;
    mintAssetId?: Maybe<Scalars['AssetId']>;
    outputContract?: Maybe<GqlContractOutput>;
    outputs: Array<GqlOutput>;
    policies?: Maybe<GqlPolicies>;
    /** Return the transaction bytes using canonical encoding */
    rawPayload: Scalars['HexString'];
    receipts?: Maybe<Array<GqlReceipt>>;
    receiptsRoot?: Maybe<Scalars['Bytes32']>;
    salt?: Maybe<Scalars['Salt']>;
    script?: Maybe<Scalars['HexString']>;
    scriptData?: Maybe<Scalars['HexString']>;
    scriptGasLimit?: Maybe<Scalars['U64']>;
    status?: Maybe<GqlTransactionStatus>;
    storageSlots?: Maybe<Array<Scalars['HexString']>>;
    txPointer?: Maybe<Scalars['TxPointer']>;
    witnesses?: Maybe<Array<Scalars['HexString']>>;
};
export type GqlTransactionConnection = {
    __typename: 'TransactionConnection';
    /** A list of edges. */
    edges: Array<GqlTransactionEdge>;
    /** A list of nodes. */
    nodes: Array<GqlTransaction>;
    /** Information to aid in pagination. */
    pageInfo: GqlPageInfo;
};
/** An edge in a connection. */
export type GqlTransactionEdge = {
    __typename: 'TransactionEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node: GqlTransaction;
};
export type GqlTransactionStatus = GqlFailureStatus | GqlSqueezedOutStatus | GqlSubmittedStatus | GqlSuccessStatus;
export type GqlTxParameters = {
    __typename: 'TxParameters';
    maxGasPerTx: Scalars['U64'];
    maxInputs: Scalars['U8'];
    maxOutputs: Scalars['U8'];
    maxSize: Scalars['U64'];
    maxWitnesses: Scalars['U32'];
};
export type GqlVariableOutput = {
    __typename: 'VariableOutput';
    amount: Scalars['U64'];
    assetId: Scalars['AssetId'];
    to: Scalars['Address'];
};
export type GqlTransactionFragmentFragment = {
    __typename: 'Transaction';
    id: string;
    rawPayload: string;
    gasPrice?: string | null;
    receipts?: Array<{
        __typename: 'Receipt';
        pc?: string | null;
        is?: string | null;
        toAddress?: string | null;
        amount?: string | null;
        assetId?: string | null;
        gas?: string | null;
        param1?: string | null;
        param2?: string | null;
        val?: string | null;
        ptr?: string | null;
        digest?: string | null;
        reason?: string | null;
        ra?: string | null;
        rb?: string | null;
        rc?: string | null;
        rd?: string | null;
        len?: string | null;
        receiptType: GqlReceiptType;
        result?: string | null;
        gasUsed?: string | null;
        data?: string | null;
        sender?: string | null;
        recipient?: string | null;
        nonce?: string | null;
        contractId?: string | null;
        subId?: string | null;
        contract?: {
            __typename: 'Contract';
            id: string;
            bytecode: string;
            salt: string;
        } | null;
        to?: {
            __typename: 'Contract';
            id: string;
            bytecode: string;
            salt: string;
        } | null;
    }> | null;
    status?: {
        __typename: 'FailureStatus';
        time: any;
        reason: string;
        type: 'FailureStatus';
        block: {
            __typename: 'Block';
            id: string;
        };
    } | {
        __typename: 'SqueezedOutStatus';
        type: 'SqueezedOutStatus';
    } | {
        __typename: 'SubmittedStatus';
        time: any;
        type: 'SubmittedStatus';
    } | {
        __typename: 'SuccessStatus';
        time: any;
        type: 'SuccessStatus';
        block: {
            __typename: 'Block';
            id: string;
        };
        programState?: {
            __typename: 'ProgramState';
            returnType: GqlReturnType;
            data: string;
        } | null;
    } | null;
};
export type GqlReceiptFragmentFragment = {
    __typename: 'Receipt';
    pc?: string | null;
    is?: string | null;
    toAddress?: string | null;
    amount?: string | null;
    assetId?: string | null;
    gas?: string | null;
    param1?: string | null;
    param2?: string | null;
    val?: string | null;
    ptr?: string | null;
    digest?: string | null;
    reason?: string | null;
    ra?: string | null;
    rb?: string | null;
    rc?: string | null;
    rd?: string | null;
    len?: string | null;
    receiptType: GqlReceiptType;
    result?: string | null;
    gasUsed?: string | null;
    data?: string | null;
    sender?: string | null;
    recipient?: string | null;
    nonce?: string | null;
    contractId?: string | null;
    subId?: string | null;
    contract?: {
        __typename: 'Contract';
        id: string;
        bytecode: string;
        salt: string;
    } | null;
    to?: {
        __typename: 'Contract';
        id: string;
        bytecode: string;
        salt: string;
    } | null;
};
export type GqlBlockFragmentFragment = {
    __typename: 'Block';
    id: string;
    header: {
        __typename: 'Header';
        height: any;
        time: any;
    };
    transactions: Array<{
        __typename: 'Transaction';
        id: string;
    }>;
};
export type GqlCoinFragmentFragment = {
    __typename: 'Coin';
    utxoId: string;
    owner: string;
    amount: string;
    assetId: string;
    maturity: any;
    blockCreated: any;
    txCreatedIdx: string;
};
export type GqlMessageCoinFragmentFragment = {
    __typename: 'MessageCoin';
    sender: string;
    recipient: string;
    nonce: string;
    amount: string;
    assetId: string;
    daHeight: string;
};
export type GqlMessageFragmentFragment = {
    __typename: 'Message';
    amount: string;
    sender: string;
    recipient: string;
    data: string;
    nonce: string;
    daHeight: string;
};
export type GqlMessageProofFragmentFragment = {
    __typename: 'MessageProof';
    sender: string;
    recipient: string;
    nonce: string;
    amount: string;
    data: string;
    messageProof: {
        __typename: 'MerkleProof';
        proofSet: Array<string>;
        proofIndex: string;
    };
    blockProof: {
        __typename: 'MerkleProof';
        proofSet: Array<string>;
        proofIndex: string;
    };
    messageBlockHeader: {
        __typename: 'Header';
        id: string;
        daHeight: string;
        transactionsCount: string;
        transactionsRoot: string;
        height: any;
        prevRoot: string;
        time: any;
        applicationHash: string;
        messageReceiptRoot: string;
        messageReceiptCount: string;
    };
    commitBlockHeader: {
        __typename: 'Header';
        id: string;
        daHeight: string;
        transactionsCount: string;
        transactionsRoot: string;
        height: any;
        prevRoot: string;
        time: any;
        applicationHash: string;
        messageReceiptRoot: string;
        messageReceiptCount: string;
    };
};
export type GqlBalanceFragmentFragment = {
    __typename: 'Balance';
    owner: string;
    amount: string;
    assetId: string;
};
export type GqlTxParametersFragmentFragment = {
    __typename: 'TxParameters';
    maxInputs: any;
    maxOutputs: any;
    maxWitnesses: any;
    maxGasPerTx: string;
    maxSize: string;
};
export type GqlPredicateParametersFragmentFragment = {
    __typename: 'PredicateParameters';
    maxPredicateLength: string;
    maxPredicateDataLength: string;
    maxGasPerPredicate: string;
    maxMessageDataLength: string;
};
export type GqlScriptParametersFragmentFragment = {
    __typename: 'ScriptParameters';
    maxScriptLength: string;
    maxScriptDataLength: string;
};
export type GqlContractParametersFragmentFragment = {
    __typename: 'ContractParameters';
    contractMaxSize: string;
    maxStorageSlots: string;
};
export type GqlFeeParametersFragmentFragment = {
    __typename: 'FeeParameters';
    gasPriceFactor: string;
    gasPerByte: string;
};
type GqlDependentCostFragment_HeavyOperation_Fragment = {
    __typename: 'HeavyOperation';
    base: string;
    gasPerUnit: string;
};
type GqlDependentCostFragment_LightOperation_Fragment = {
    __typename: 'LightOperation';
    base: string;
    unitsPerGas: string;
};
export type GqlDependentCostFragmentFragment = GqlDependentCostFragment_HeavyOperation_Fragment | GqlDependentCostFragment_LightOperation_Fragment;
export type GqlGasCostsFragmentFragment = {
    __typename: 'GasCosts';
    add: string;
    addi: string;
    aloc: string;
    and: string;
    andi: string;
    bal: string;
    bhei: string;
    bhsh: string;
    burn: string;
    cb: string;
    cfei: string;
    cfsi: string;
    croo: string;
    div: string;
    divi: string;
    ecr1: string;
    eck1: string;
    ed19: string;
    eq: string;
    exp: string;
    expi: string;
    flag: string;
    gm: string;
    gt: string;
    gtf: string;
    ji: string;
    jmp: string;
    jne: string;
    jnei: string;
    jnzi: string;
    jmpf: string;
    jmpb: string;
    jnzf: string;
    jnzb: string;
    jnef: string;
    jneb: string;
    lb: string;
    log: string;
    lt: string;
    lw: string;
    mint: string;
    mlog: string;
    modOp: string;
    modi: string;
    moveOp: string;
    movi: string;
    mroo: string;
    mul: string;
    muli: string;
    mldv: string;
    noop: string;
    not: string;
    or: string;
    ori: string;
    poph: string;
    popl: string;
    pshh: string;
    pshl: string;
    ret: string;
    rvrt: string;
    sb: string;
    sll: string;
    slli: string;
    srl: string;
    srli: string;
    srw: string;
    sub: string;
    subi: string;
    sw: string;
    sww: string;
    time: string;
    tr: string;
    tro: string;
    wdcm: string;
    wqcm: string;
    wdop: string;
    wqop: string;
    wdml: string;
    wqml: string;
    wddv: string;
    wqdv: string;
    wdmd: string;
    wqmd: string;
    wdam: string;
    wqam: string;
    wdmm: string;
    wqmm: string;
    xor: string;
    xori: string;
    newStoragePerByte: string;
    call: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    ccp: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    csiz: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    k256: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    ldc: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    logd: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    mcl: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    mcli: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    mcp: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    mcpi: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    meq: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    retd: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    s256: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    scwq: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    smo: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    srwq: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    swwq: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    contractRoot: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    stateRoot: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
    vmInitialization: {
        __typename: 'HeavyOperation';
        base: string;
        gasPerUnit: string;
    } | {
        __typename: 'LightOperation';
        base: string;
        unitsPerGas: string;
    };
};
export type GqlConsensusParametersFragmentFragment = {
    __typename: 'ConsensusParameters';
    baseAssetId: string;
    chainId: string;
    txParams: {
        __typename: 'TxParameters';
        maxInputs: any;
        maxOutputs: any;
        maxWitnesses: any;
        maxGasPerTx: string;
        maxSize: string;
    };
    predicateParams: {
        __typename: 'PredicateParameters';
        maxPredicateLength: string;
        maxPredicateDataLength: string;
        maxGasPerPredicate: string;
        maxMessageDataLength: string;
    };
    scriptParams: {
        __typename: 'ScriptParameters';
        maxScriptLength: string;
        maxScriptDataLength: string;
    };
    contractParams: {
        __typename: 'ContractParameters';
        contractMaxSize: string;
        maxStorageSlots: string;
    };
    feeParams: {
        __typename: 'FeeParameters';
        gasPriceFactor: string;
        gasPerByte: string;
    };
    gasCosts: {
        __typename: 'GasCosts';
        add: string;
        addi: string;
        aloc: string;
        and: string;
        andi: string;
        bal: string;
        bhei: string;
        bhsh: string;
        burn: string;
        cb: string;
        cfei: string;
        cfsi: string;
        croo: string;
        div: string;
        divi: string;
        ecr1: string;
        eck1: string;
        ed19: string;
        eq: string;
        exp: string;
        expi: string;
        flag: string;
        gm: string;
        gt: string;
        gtf: string;
        ji: string;
        jmp: string;
        jne: string;
        jnei: string;
        jnzi: string;
        jmpf: string;
        jmpb: string;
        jnzf: string;
        jnzb: string;
        jnef: string;
        jneb: string;
        lb: string;
        log: string;
        lt: string;
        lw: string;
        mint: string;
        mlog: string;
        modOp: string;
        modi: string;
        moveOp: string;
        movi: string;
        mroo: string;
        mul: string;
        muli: string;
        mldv: string;
        noop: string;
        not: string;
        or: string;
        ori: string;
        poph: string;
        popl: string;
        pshh: string;
        pshl: string;
        ret: string;
        rvrt: string;
        sb: string;
        sll: string;
        slli: string;
        srl: string;
        srli: string;
        srw: string;
        sub: string;
        subi: string;
        sw: string;
        sww: string;
        time: string;
        tr: string;
        tro: string;
        wdcm: string;
        wqcm: string;
        wdop: string;
        wqop: string;
        wdml: string;
        wqml: string;
        wddv: string;
        wqdv: string;
        wdmd: string;
        wqmd: string;
        wdam: string;
        wqam: string;
        wdmm: string;
        wqmm: string;
        xor: string;
        xori: string;
        newStoragePerByte: string;
        call: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        ccp: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        csiz: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        k256: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        ldc: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        logd: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        mcl: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        mcli: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        mcp: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        mcpi: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        meq: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        retd: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        s256: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        scwq: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        smo: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        srwq: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        swwq: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        contractRoot: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        stateRoot: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
        vmInitialization: {
            __typename: 'HeavyOperation';
            base: string;
            gasPerUnit: string;
        } | {
            __typename: 'LightOperation';
            base: string;
            unitsPerGas: string;
        };
    };
};
export type GqlChainInfoFragmentFragment = {
    __typename: 'ChainInfo';
    name: string;
    daHeight: string;
    latestBlock: {
        __typename: 'Block';
        id: string;
        header: {
            __typename: 'Header';
            height: any;
            time: any;
        };
        transactions: Array<{
            __typename: 'Transaction';
            id: string;
        }>;
    };
    consensusParameters: {
        __typename: 'ConsensusParameters';
        baseAssetId: string;
        chainId: string;
        txParams: {
            __typename: 'TxParameters';
            maxInputs: any;
            maxOutputs: any;
            maxWitnesses: any;
            maxGasPerTx: string;
            maxSize: string;
        };
        predicateParams: {
            __typename: 'PredicateParameters';
            maxPredicateLength: string;
            maxPredicateDataLength: string;
            maxGasPerPredicate: string;
            maxMessageDataLength: string;
        };
        scriptParams: {
            __typename: 'ScriptParameters';
            maxScriptLength: string;
            maxScriptDataLength: string;
        };
        contractParams: {
            __typename: 'ContractParameters';
            contractMaxSize: string;
            maxStorageSlots: string;
        };
        feeParams: {
            __typename: 'FeeParameters';
            gasPriceFactor: string;
            gasPerByte: string;
        };
        gasCosts: {
            __typename: 'GasCosts';
            add: string;
            addi: string;
            aloc: string;
            and: string;
            andi: string;
            bal: string;
            bhei: string;
            bhsh: string;
            burn: string;
            cb: string;
            cfei: string;
            cfsi: string;
            croo: string;
            div: string;
            divi: string;
            ecr1: string;
            eck1: string;
            ed19: string;
            eq: string;
            exp: string;
            expi: string;
            flag: string;
            gm: string;
            gt: string;
            gtf: string;
            ji: string;
            jmp: string;
            jne: string;
            jnei: string;
            jnzi: string;
            jmpf: string;
            jmpb: string;
            jnzf: string;
            jnzb: string;
            jnef: string;
            jneb: string;
            lb: string;
            log: string;
            lt: string;
            lw: string;
            mint: string;
            mlog: string;
            modOp: string;
            modi: string;
            moveOp: string;
            movi: string;
            mroo: string;
            mul: string;
            muli: string;
            mldv: string;
            noop: string;
            not: string;
            or: string;
            ori: string;
            poph: string;
            popl: string;
            pshh: string;
            pshl: string;
            ret: string;
            rvrt: string;
            sb: string;
            sll: string;
            slli: string;
            srl: string;
            srli: string;
            srw: string;
            sub: string;
            subi: string;
            sw: string;
            sww: string;
            time: string;
            tr: string;
            tro: string;
            wdcm: string;
            wqcm: string;
            wdop: string;
            wqop: string;
            wdml: string;
            wqml: string;
            wddv: string;
            wqdv: string;
            wdmd: string;
            wqmd: string;
            wdam: string;
            wqam: string;
            wdmm: string;
            wqmm: string;
            xor: string;
            xori: string;
            newStoragePerByte: string;
            call: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            ccp: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            csiz: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            k256: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            ldc: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            logd: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            mcl: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            mcli: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            mcp: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            mcpi: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            meq: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            retd: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            s256: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            scwq: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            smo: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            srwq: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            swwq: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            contractRoot: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            stateRoot: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
            vmInitialization: {
                __typename: 'HeavyOperation';
                base: string;
                gasPerUnit: string;
            } | {
                __typename: 'LightOperation';
                base: string;
                unitsPerGas: string;
            };
        };
    };
};
export type GqlContractBalanceFragmentFragment = {
    __typename: 'ContractBalance';
    contract: string;
    amount: string;
    assetId: string;
};
export type GqlPageInfoFragmentFragment = {
    __typename: 'PageInfo';
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
};
export type GqlGetVersionQueryVariables = Exact<{
    [key: string]: never;
}>;
export type GqlGetVersionQuery = {
    __typename: 'Query';
    nodeInfo: {
        __typename: 'NodeInfo';
        nodeVersion: string;
    };
};
export type GqlNodeInfoFragmentFragment = {
    __typename: 'NodeInfo';
    utxoValidation: boolean;
    vmBacktrace: boolean;
    minGasPrice: string;
    maxTx: string;
    maxDepth: string;
    nodeVersion: string;
    peers: Array<{
        __typename: 'PeerInfo';
        id: string;
        addresses: Array<string>;
        clientVersion?: string | null;
        blockHeight?: any | null;
        lastHeartbeatMs: string;
        appScore: number;
    }>;
};
export type GqlGetNodeInfoQueryVariables = Exact<{
    [key: string]: never;
}>;
export type GqlGetNodeInfoQuery = {
    __typename: 'Query';
    nodeInfo: {
        __typename: 'NodeInfo';
        utxoValidation: boolean;
        vmBacktrace: boolean;
        minGasPrice: string;
        maxTx: string;
        maxDepth: string;
        nodeVersion: string;
        peers: Array<{
            __typename: 'PeerInfo';
            id: string;
            addresses: Array<string>;
            clientVersion?: string | null;
            blockHeight?: any | null;
            lastHeartbeatMs: string;
            appScore: number;
        }>;
    };
};
export type GqlGetChainQueryVariables = Exact<{
    [key: string]: never;
}>;
export type GqlGetChainQuery = {
    __typename: 'Query';
    chain: {
        __typename: 'ChainInfo';
        name: string;
        daHeight: string;
        latestBlock: {
            __typename: 'Block';
            id: string;
            header: {
                __typename: 'Header';
                height: any;
                time: any;
            };
            transactions: Array<{
                __typename: 'Transaction';
                id: string;
            }>;
        };
        consensusParameters: {
            __typename: 'ConsensusParameters';
            baseAssetId: string;
            chainId: string;
            txParams: {
                __typename: 'TxParameters';
                maxInputs: any;
                maxOutputs: any;
                maxWitnesses: any;
                maxGasPerTx: string;
                maxSize: string;
            };
            predicateParams: {
                __typename: 'PredicateParameters';
                maxPredicateLength: string;
                maxPredicateDataLength: string;
                maxGasPerPredicate: string;
                maxMessageDataLength: string;
            };
            scriptParams: {
                __typename: 'ScriptParameters';
                maxScriptLength: string;
                maxScriptDataLength: string;
            };
            contractParams: {
                __typename: 'ContractParameters';
                contractMaxSize: string;
                maxStorageSlots: string;
            };
            feeParams: {
                __typename: 'FeeParameters';
                gasPriceFactor: string;
                gasPerByte: string;
            };
            gasCosts: {
                __typename: 'GasCosts';
                add: string;
                addi: string;
                aloc: string;
                and: string;
                andi: string;
                bal: string;
                bhei: string;
                bhsh: string;
                burn: string;
                cb: string;
                cfei: string;
                cfsi: string;
                croo: string;
                div: string;
                divi: string;
                ecr1: string;
                eck1: string;
                ed19: string;
                eq: string;
                exp: string;
                expi: string;
                flag: string;
                gm: string;
                gt: string;
                gtf: string;
                ji: string;
                jmp: string;
                jne: string;
                jnei: string;
                jnzi: string;
                jmpf: string;
                jmpb: string;
                jnzf: string;
                jnzb: string;
                jnef: string;
                jneb: string;
                lb: string;
                log: string;
                lt: string;
                lw: string;
                mint: string;
                mlog: string;
                modOp: string;
                modi: string;
                moveOp: string;
                movi: string;
                mroo: string;
                mul: string;
                muli: string;
                mldv: string;
                noop: string;
                not: string;
                or: string;
                ori: string;
                poph: string;
                popl: string;
                pshh: string;
                pshl: string;
                ret: string;
                rvrt: string;
                sb: string;
                sll: string;
                slli: string;
                srl: string;
                srli: string;
                srw: string;
                sub: string;
                subi: string;
                sw: string;
                sww: string;
                time: string;
                tr: string;
                tro: string;
                wdcm: string;
                wqcm: string;
                wdop: string;
                wqop: string;
                wdml: string;
                wqml: string;
                wddv: string;
                wqdv: string;
                wdmd: string;
                wqmd: string;
                wdam: string;
                wqam: string;
                wdmm: string;
                wqmm: string;
                xor: string;
                xori: string;
                newStoragePerByte: string;
                call: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                ccp: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                csiz: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                k256: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                ldc: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                logd: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                mcl: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                mcli: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                mcp: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                mcpi: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                meq: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                retd: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                s256: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                scwq: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                smo: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                srwq: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                swwq: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                contractRoot: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                stateRoot: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
                vmInitialization: {
                    __typename: 'HeavyOperation';
                    base: string;
                    gasPerUnit: string;
                } | {
                    __typename: 'LightOperation';
                    base: string;
                    unitsPerGas: string;
                };
            };
        };
    };
};
export type GqlGetTransactionQueryVariables = Exact<{
    transactionId: Scalars['TransactionId'];
}>;
export type GqlGetTransactionQuery = {
    __typename: 'Query';
    transaction?: {
        __typename: 'Transaction';
        id: string;
        rawPayload: string;
        gasPrice?: string | null;
        receipts?: Array<{
            __typename: 'Receipt';
            pc?: string | null;
            is?: string | null;
            toAddress?: string | null;
            amount?: string | null;
            assetId?: string | null;
            gas?: string | null;
            param1?: string | null;
            param2?: string | null;
            val?: string | null;
            ptr?: string | null;
            digest?: string | null;
            reason?: string | null;
            ra?: string | null;
            rb?: string | null;
            rc?: string | null;
            rd?: string | null;
            len?: string | null;
            receiptType: GqlReceiptType;
            result?: string | null;
            gasUsed?: string | null;
            data?: string | null;
            sender?: string | null;
            recipient?: string | null;
            nonce?: string | null;
            contractId?: string | null;
            subId?: string | null;
            contract?: {
                __typename: 'Contract';
                id: string;
                bytecode: string;
                salt: string;
            } | null;
            to?: {
                __typename: 'Contract';
                id: string;
                bytecode: string;
                salt: string;
            } | null;
        }> | null;
        status?: {
            __typename: 'FailureStatus';
            time: any;
            reason: string;
            type: 'FailureStatus';
            block: {
                __typename: 'Block';
                id: string;
            };
        } | {
            __typename: 'SqueezedOutStatus';
            type: 'SqueezedOutStatus';
        } | {
            __typename: 'SubmittedStatus';
            time: any;
            type: 'SubmittedStatus';
        } | {
            __typename: 'SuccessStatus';
            time: any;
            type: 'SuccessStatus';
            block: {
                __typename: 'Block';
                id: string;
            };
            programState?: {
                __typename: 'ProgramState';
                returnType: GqlReturnType;
                data: string;
            } | null;
        } | null;
    } | null;
};
export type GqlGetTransactionWithReceiptsQueryVariables = Exact<{
    transactionId: Scalars['TransactionId'];
}>;
export type GqlGetTransactionWithReceiptsQuery = {
    __typename: 'Query';
    transaction?: {
        __typename: 'Transaction';
        id: string;
        rawPayload: string;
        gasPrice?: string | null;
        receipts?: Array<{
            __typename: 'Receipt';
            pc?: string | null;
            is?: string | null;
            toAddress?: string | null;
            amount?: string | null;
            assetId?: string | null;
            gas?: string | null;
            param1?: string | null;
            param2?: string | null;
            val?: string | null;
            ptr?: string | null;
            digest?: string | null;
            reason?: string | null;
            ra?: string | null;
            rb?: string | null;
            rc?: string | null;
            rd?: string | null;
            len?: string | null;
            receiptType: GqlReceiptType;
            result?: string | null;
            gasUsed?: string | null;
            data?: string | null;
            sender?: string | null;
            recipient?: string | null;
            nonce?: string | null;
            contractId?: string | null;
            subId?: string | null;
            contract?: {
                __typename: 'Contract';
                id: string;
                bytecode: string;
                salt: string;
            } | null;
            to?: {
                __typename: 'Contract';
                id: string;
                bytecode: string;
                salt: string;
            } | null;
        }> | null;
        status?: {
            __typename: 'FailureStatus';
            time: any;
            reason: string;
            type: 'FailureStatus';
            block: {
                __typename: 'Block';
                id: string;
            };
        } | {
            __typename: 'SqueezedOutStatus';
            type: 'SqueezedOutStatus';
        } | {
            __typename: 'SubmittedStatus';
            time: any;
            type: 'SubmittedStatus';
        } | {
            __typename: 'SuccessStatus';
            time: any;
            type: 'SuccessStatus';
            block: {
                __typename: 'Block';
                id: string;
            };
            programState?: {
                __typename: 'ProgramState';
                returnType: GqlReturnType;
                data: string;
            } | null;
        } | null;
    } | null;
};
export type GqlGetTransactionsQueryVariables = Exact<{
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
}>;
export type GqlGetTransactionsQuery = {
    __typename: 'Query';
    transactions: {
        __typename: 'TransactionConnection';
        edges: Array<{
            __typename: 'TransactionEdge';
            node: {
                __typename: 'Transaction';
                id: string;
                rawPayload: string;
                gasPrice?: string | null;
                receipts?: Array<{
                    __typename: 'Receipt';
                    pc?: string | null;
                    is?: string | null;
                    toAddress?: string | null;
                    amount?: string | null;
                    assetId?: string | null;
                    gas?: string | null;
                    param1?: string | null;
                    param2?: string | null;
                    val?: string | null;
                    ptr?: string | null;
                    digest?: string | null;
                    reason?: string | null;
                    ra?: string | null;
                    rb?: string | null;
                    rc?: string | null;
                    rd?: string | null;
                    len?: string | null;
                    receiptType: GqlReceiptType;
                    result?: string | null;
                    gasUsed?: string | null;
                    data?: string | null;
                    sender?: string | null;
                    recipient?: string | null;
                    nonce?: string | null;
                    contractId?: string | null;
                    subId?: string | null;
                    contract?: {
                        __typename: 'Contract';
                        id: string;
                        bytecode: string;
                        salt: string;
                    } | null;
                    to?: {
                        __typename: 'Contract';
                        id: string;
                        bytecode: string;
                        salt: string;
                    } | null;
                }> | null;
                status?: {
                    __typename: 'FailureStatus';
                    time: any;
                    reason: string;
                    type: 'FailureStatus';
                    block: {
                        __typename: 'Block';
                        id: string;
                    };
                } | {
                    __typename: 'SqueezedOutStatus';
                    type: 'SqueezedOutStatus';
                } | {
                    __typename: 'SubmittedStatus';
                    time: any;
                    type: 'SubmittedStatus';
                } | {
                    __typename: 'SuccessStatus';
                    time: any;
                    type: 'SuccessStatus';
                    block: {
                        __typename: 'Block';
                        id: string;
                    };
                    programState?: {
                        __typename: 'ProgramState';
                        returnType: GqlReturnType;
                        data: string;
                    } | null;
                } | null;
            };
        }>;
    };
};
export type GqlGetTransactionsByOwnerQueryVariables = Exact<{
    owner: Scalars['Address'];
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
}>;
export type GqlGetTransactionsByOwnerQuery = {
    __typename: 'Query';
    transactionsByOwner: {
        __typename: 'TransactionConnection';
        pageInfo: {
            __typename: 'PageInfo';
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor?: string | null;
            endCursor?: string | null;
        };
        edges: Array<{
            __typename: 'TransactionEdge';
            node: {
                __typename: 'Transaction';
                id: string;
                rawPayload: string;
                gasPrice?: string | null;
                receipts?: Array<{
                    __typename: 'Receipt';
                    pc?: string | null;
                    is?: string | null;
                    toAddress?: string | null;
                    amount?: string | null;
                    assetId?: string | null;
                    gas?: string | null;
                    param1?: string | null;
                    param2?: string | null;
                    val?: string | null;
                    ptr?: string | null;
                    digest?: string | null;
                    reason?: string | null;
                    ra?: string | null;
                    rb?: string | null;
                    rc?: string | null;
                    rd?: string | null;
                    len?: string | null;
                    receiptType: GqlReceiptType;
                    result?: string | null;
                    gasUsed?: string | null;
                    data?: string | null;
                    sender?: string | null;
                    recipient?: string | null;
                    nonce?: string | null;
                    contractId?: string | null;
                    subId?: string | null;
                    contract?: {
                        __typename: 'Contract';
                        id: string;
                        bytecode: string;
                        salt: string;
                    } | null;
                    to?: {
                        __typename: 'Contract';
                        id: string;
                        bytecode: string;
                        salt: string;
                    } | null;
                }> | null;
                status?: {
                    __typename: 'FailureStatus';
                    time: any;
                    reason: string;
                    type: 'FailureStatus';
                    block: {
                        __typename: 'Block';
                        id: string;
                    };
                } | {
                    __typename: 'SqueezedOutStatus';
                    type: 'SqueezedOutStatus';
                } | {
                    __typename: 'SubmittedStatus';
                    time: any;
                    type: 'SubmittedStatus';
                } | {
                    __typename: 'SuccessStatus';
                    time: any;
                    type: 'SuccessStatus';
                    block: {
                        __typename: 'Block';
                        id: string;
                    };
                    programState?: {
                        __typename: 'ProgramState';
                        returnType: GqlReturnType;
                        data: string;
                    } | null;
                } | null;
            };
        }>;
    };
};
export type GqlEstimatePredicatesQueryVariables = Exact<{
    encodedTransaction: Scalars['HexString'];
}>;
export type GqlEstimatePredicatesQuery = {
    __typename: 'Query';
    estimatePredicates: {
        __typename: 'Transaction';
        id: string;
        rawPayload: string;
        gasPrice?: string | null;
        receipts?: Array<{
            __typename: 'Receipt';
            pc?: string | null;
            is?: string | null;
            toAddress?: string | null;
            amount?: string | null;
            assetId?: string | null;
            gas?: string | null;
            param1?: string | null;
            param2?: string | null;
            val?: string | null;
            ptr?: string | null;
            digest?: string | null;
            reason?: string | null;
            ra?: string | null;
            rb?: string | null;
            rc?: string | null;
            rd?: string | null;
            len?: string | null;
            receiptType: GqlReceiptType;
            result?: string | null;
            gasUsed?: string | null;
            data?: string | null;
            sender?: string | null;
            recipient?: string | null;
            nonce?: string | null;
            contractId?: string | null;
            subId?: string | null;
            contract?: {
                __typename: 'Contract';
                id: string;
                bytecode: string;
                salt: string;
            } | null;
            to?: {
                __typename: 'Contract';
                id: string;
                bytecode: string;
                salt: string;
            } | null;
        }> | null;
        status?: {
            __typename: 'FailureStatus';
            time: any;
            reason: string;
            type: 'FailureStatus';
            block: {
                __typename: 'Block';
                id: string;
            };
        } | {
            __typename: 'SqueezedOutStatus';
            type: 'SqueezedOutStatus';
        } | {
            __typename: 'SubmittedStatus';
            time: any;
            type: 'SubmittedStatus';
        } | {
            __typename: 'SuccessStatus';
            time: any;
            type: 'SuccessStatus';
            block: {
                __typename: 'Block';
                id: string;
            };
            programState?: {
                __typename: 'ProgramState';
                returnType: GqlReturnType;
                data: string;
            } | null;
        } | null;
    };
};
export type GqlGetBlockQueryVariables = Exact<{
    blockId?: InputMaybe<Scalars['BlockId']>;
    height?: InputMaybe<Scalars['U32']>;
}>;
export type GqlGetBlockQuery = {
    __typename: 'Query';
    block?: {
        __typename: 'Block';
        id: string;
        header: {
            __typename: 'Header';
            height: any;
            time: any;
        };
        transactions: Array<{
            __typename: 'Transaction';
            id: string;
        }>;
    } | null;
};
export type GqlGetBlockWithTransactionsQueryVariables = Exact<{
    blockId?: InputMaybe<Scalars['BlockId']>;
    blockHeight?: InputMaybe<Scalars['U32']>;
}>;
export type GqlGetBlockWithTransactionsQuery = {
    __typename: 'Query';
    block?: {
        __typename: 'Block';
        id: string;
        transactions: Array<{
            __typename: 'Transaction';
            id: string;
            rawPayload: string;
            gasPrice?: string | null;
            receipts?: Array<{
                __typename: 'Receipt';
                pc?: string | null;
                is?: string | null;
                toAddress?: string | null;
                amount?: string | null;
                assetId?: string | null;
                gas?: string | null;
                param1?: string | null;
                param2?: string | null;
                val?: string | null;
                ptr?: string | null;
                digest?: string | null;
                reason?: string | null;
                ra?: string | null;
                rb?: string | null;
                rc?: string | null;
                rd?: string | null;
                len?: string | null;
                receiptType: GqlReceiptType;
                result?: string | null;
                gasUsed?: string | null;
                data?: string | null;
                sender?: string | null;
                recipient?: string | null;
                nonce?: string | null;
                contractId?: string | null;
                subId?: string | null;
                contract?: {
                    __typename: 'Contract';
                    id: string;
                    bytecode: string;
                    salt: string;
                } | null;
                to?: {
                    __typename: 'Contract';
                    id: string;
                    bytecode: string;
                    salt: string;
                } | null;
            }> | null;
            status?: {
                __typename: 'FailureStatus';
                time: any;
                reason: string;
                type: 'FailureStatus';
                block: {
                    __typename: 'Block';
                    id: string;
                };
            } | {
                __typename: 'SqueezedOutStatus';
                type: 'SqueezedOutStatus';
            } | {
                __typename: 'SubmittedStatus';
                time: any;
                type: 'SubmittedStatus';
            } | {
                __typename: 'SuccessStatus';
                time: any;
                type: 'SuccessStatus';
                block: {
                    __typename: 'Block';
                    id: string;
                };
                programState?: {
                    __typename: 'ProgramState';
                    returnType: GqlReturnType;
                    data: string;
                } | null;
            } | null;
        }>;
        header: {
            __typename: 'Header';
            height: any;
            time: any;
        };
    } | null;
};
export type GqlGetBlocksQueryVariables = Exact<{
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
}>;
export type GqlGetBlocksQuery = {
    __typename: 'Query';
    blocks: {
        __typename: 'BlockConnection';
        edges: Array<{
            __typename: 'BlockEdge';
            node: {
                __typename: 'Block';
                id: string;
                header: {
                    __typename: 'Header';
                    height: any;
                    time: any;
                };
                transactions: Array<{
                    __typename: 'Transaction';
                    id: string;
                }>;
            };
        }>;
    };
};
export type GqlGetCoinQueryVariables = Exact<{
    coinId: Scalars['UtxoId'];
}>;
export type GqlGetCoinQuery = {
    __typename: 'Query';
    coin?: {
        __typename: 'Coin';
        utxoId: string;
        owner: string;
        amount: string;
        assetId: string;
        maturity: any;
        blockCreated: any;
        txCreatedIdx: string;
    } | null;
};
export type GqlGetCoinsQueryVariables = Exact<{
    filter: GqlCoinFilterInput;
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
}>;
export type GqlGetCoinsQuery = {
    __typename: 'Query';
    coins: {
        __typename: 'CoinConnection';
        edges: Array<{
            __typename: 'CoinEdge';
            node: {
                __typename: 'Coin';
                utxoId: string;
                owner: string;
                amount: string;
                assetId: string;
                maturity: any;
                blockCreated: any;
                txCreatedIdx: string;
            };
        }>;
    };
};
export type GqlGetCoinsToSpendQueryVariables = Exact<{
    owner: Scalars['Address'];
    queryPerAsset: Array<GqlSpendQueryElementInput> | GqlSpendQueryElementInput;
    excludedIds?: InputMaybe<GqlExcludeInput>;
}>;
export type GqlGetCoinsToSpendQuery = {
    __typename: 'Query';
    coinsToSpend: Array<Array<{
        __typename: 'Coin';
        utxoId: string;
        owner: string;
        amount: string;
        assetId: string;
        maturity: any;
        blockCreated: any;
        txCreatedIdx: string;
    } | {
        __typename: 'MessageCoin';
        sender: string;
        recipient: string;
        nonce: string;
        amount: string;
        assetId: string;
        daHeight: string;
    }>>;
};
export type GqlGetContractQueryVariables = Exact<{
    contractId: Scalars['ContractId'];
}>;
export type GqlGetContractQuery = {
    __typename: 'Query';
    contract?: {
        __typename: 'Contract';
        bytecode: string;
        id: string;
    } | null;
};
export type GqlGetContractBalanceQueryVariables = Exact<{
    contract: Scalars['ContractId'];
    asset: Scalars['AssetId'];
}>;
export type GqlGetContractBalanceQuery = {
    __typename: 'Query';
    contractBalance: {
        __typename: 'ContractBalance';
        contract: string;
        amount: string;
        assetId: string;
    };
};
export type GqlGetBalanceQueryVariables = Exact<{
    owner: Scalars['Address'];
    assetId: Scalars['AssetId'];
}>;
export type GqlGetBalanceQuery = {
    __typename: 'Query';
    balance: {
        __typename: 'Balance';
        owner: string;
        amount: string;
        assetId: string;
    };
};
export type GqlGetBalancesQueryVariables = Exact<{
    filter: GqlBalanceFilterInput;
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
}>;
export type GqlGetBalancesQuery = {
    __typename: 'Query';
    balances: {
        __typename: 'BalanceConnection';
        edges: Array<{
            __typename: 'BalanceEdge';
            node: {
                __typename: 'Balance';
                owner: string;
                amount: string;
                assetId: string;
            };
        }>;
    };
};
export type GqlGetMessagesQueryVariables = Exact<{
    owner: Scalars['Address'];
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    last?: InputMaybe<Scalars['Int']>;
}>;
export type GqlGetMessagesQuery = {
    __typename: 'Query';
    messages: {
        __typename: 'MessageConnection';
        edges: Array<{
            __typename: 'MessageEdge';
            node: {
                __typename: 'Message';
                amount: string;
                sender: string;
                recipient: string;
                data: string;
                nonce: string;
                daHeight: string;
            };
        }>;
    };
};
export type GqlGetMessageProofQueryVariables = Exact<{
    transactionId: Scalars['TransactionId'];
    nonce: Scalars['Nonce'];
    commitBlockId?: InputMaybe<Scalars['BlockId']>;
    commitBlockHeight?: InputMaybe<Scalars['U32']>;
}>;
export type GqlGetMessageProofQuery = {
    __typename: 'Query';
    messageProof?: {
        __typename: 'MessageProof';
        sender: string;
        recipient: string;
        nonce: string;
        amount: string;
        data: string;
        messageProof: {
            __typename: 'MerkleProof';
            proofSet: Array<string>;
            proofIndex: string;
        };
        blockProof: {
            __typename: 'MerkleProof';
            proofSet: Array<string>;
            proofIndex: string;
        };
        messageBlockHeader: {
            __typename: 'Header';
            id: string;
            daHeight: string;
            transactionsCount: string;
            transactionsRoot: string;
            height: any;
            prevRoot: string;
            time: any;
            applicationHash: string;
            messageReceiptRoot: string;
            messageReceiptCount: string;
        };
        commitBlockHeader: {
            __typename: 'Header';
            id: string;
            daHeight: string;
            transactionsCount: string;
            transactionsRoot: string;
            height: any;
            prevRoot: string;
            time: any;
            applicationHash: string;
            messageReceiptRoot: string;
            messageReceiptCount: string;
        };
    } | null;
};
export type GqlGetMessageStatusQueryVariables = Exact<{
    nonce: Scalars['Nonce'];
}>;
export type GqlGetMessageStatusQuery = {
    __typename: 'Query';
    messageStatus: {
        __typename: 'MessageStatus';
        state: GqlMessageState;
    };
};
export type GqlDryRunMutationVariables = Exact<{
    encodedTransaction: Scalars['HexString'];
    utxoValidation?: InputMaybe<Scalars['Boolean']>;
}>;
export type GqlDryRunMutation = {
    __typename: 'Mutation';
    dryRun: Array<{
        __typename: 'Receipt';
        pc?: string | null;
        is?: string | null;
        toAddress?: string | null;
        amount?: string | null;
        assetId?: string | null;
        gas?: string | null;
        param1?: string | null;
        param2?: string | null;
        val?: string | null;
        ptr?: string | null;
        digest?: string | null;
        reason?: string | null;
        ra?: string | null;
        rb?: string | null;
        rc?: string | null;
        rd?: string | null;
        len?: string | null;
        receiptType: GqlReceiptType;
        result?: string | null;
        gasUsed?: string | null;
        data?: string | null;
        sender?: string | null;
        recipient?: string | null;
        nonce?: string | null;
        contractId?: string | null;
        subId?: string | null;
        contract?: {
            __typename: 'Contract';
            id: string;
            bytecode: string;
            salt: string;
        } | null;
        to?: {
            __typename: 'Contract';
            id: string;
            bytecode: string;
            salt: string;
        } | null;
    }>;
};
export type GqlSubmitMutationVariables = Exact<{
    encodedTransaction: Scalars['HexString'];
}>;
export type GqlSubmitMutation = {
    __typename: 'Mutation';
    submit: {
        __typename: 'Transaction';
        id: string;
    };
};
export type GqlProduceBlocksMutationVariables = Exact<{
    startTimestamp?: InputMaybe<Scalars['Tai64Timestamp']>;
    blocksToProduce: Scalars['U32'];
}>;
export type GqlProduceBlocksMutation = {
    __typename: 'Mutation';
    produceBlocks: any;
};
export declare const ReceiptFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const TransactionFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const CoinFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const MessageCoinFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const MessageFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const MessageProofFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const BalanceFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const BlockFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const TxParametersFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const PredicateParametersFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const ScriptParametersFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const ContractParametersFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const FeeParametersFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const DependentCostFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const GasCostsFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const ConsensusParametersFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const ChainInfoFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const ContractBalanceFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const PageInfoFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const NodeInfoFragmentFragmentDoc: import("graphql").DocumentNode;
export declare const GetVersionDocument: import("graphql").DocumentNode;
export declare const GetNodeInfoDocument: import("graphql").DocumentNode;
export declare const GetChainDocument: import("graphql").DocumentNode;
export declare const GetTransactionDocument: import("graphql").DocumentNode;
export declare const GetTransactionWithReceiptsDocument: import("graphql").DocumentNode;
export declare const GetTransactionsDocument: import("graphql").DocumentNode;
export declare const GetTransactionsByOwnerDocument: import("graphql").DocumentNode;
export declare const EstimatePredicatesDocument: import("graphql").DocumentNode;
export declare const GetBlockDocument: import("graphql").DocumentNode;
export declare const GetBlockWithTransactionsDocument: import("graphql").DocumentNode;
export declare const GetBlocksDocument: import("graphql").DocumentNode;
export declare const GetCoinDocument: import("graphql").DocumentNode;
export declare const GetCoinsDocument: import("graphql").DocumentNode;
export declare const GetCoinsToSpendDocument: import("graphql").DocumentNode;
export declare const GetContractDocument: import("graphql").DocumentNode;
export declare const GetContractBalanceDocument: import("graphql").DocumentNode;
export declare const GetBalanceDocument: import("graphql").DocumentNode;
export declare const GetBalancesDocument: import("graphql").DocumentNode;
export declare const GetMessagesDocument: import("graphql").DocumentNode;
export declare const GetMessageProofDocument: import("graphql").DocumentNode;
export declare const GetMessageStatusDocument: import("graphql").DocumentNode;
export declare const DryRunDocument: import("graphql").DocumentNode;
export declare const SubmitDocument: import("graphql").DocumentNode;
export declare const ProduceBlocksDocument: import("graphql").DocumentNode;
export type SdkFunctionWrapper = <T>(action: (requestHeaders?: Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;
export declare function getSdk(client: GraphQLClient, withWrapper?: SdkFunctionWrapper): {
    getVersion(variables?: GqlGetVersionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetVersionQuery>;
    getNodeInfo(variables?: GqlGetNodeInfoQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetNodeInfoQuery>;
    getChain(variables?: GqlGetChainQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetChainQuery>;
    getTransaction(variables: GqlGetTransactionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetTransactionQuery>;
    getTransactionWithReceipts(variables: GqlGetTransactionWithReceiptsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetTransactionWithReceiptsQuery>;
    getTransactions(variables?: GqlGetTransactionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetTransactionsQuery>;
    getTransactionsByOwner(variables: GqlGetTransactionsByOwnerQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetTransactionsByOwnerQuery>;
    estimatePredicates(variables: GqlEstimatePredicatesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlEstimatePredicatesQuery>;
    getBlock(variables?: GqlGetBlockQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetBlockQuery>;
    getBlockWithTransactions(variables?: GqlGetBlockWithTransactionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetBlockWithTransactionsQuery>;
    getBlocks(variables?: GqlGetBlocksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetBlocksQuery>;
    getCoin(variables: GqlGetCoinQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetCoinQuery>;
    getCoins(variables: GqlGetCoinsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetCoinsQuery>;
    getCoinsToSpend(variables: GqlGetCoinsToSpendQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetCoinsToSpendQuery>;
    getContract(variables: GqlGetContractQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetContractQuery>;
    getContractBalance(variables: GqlGetContractBalanceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetContractBalanceQuery>;
    getBalance(variables: GqlGetBalanceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetBalanceQuery>;
    getBalances(variables: GqlGetBalancesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetBalancesQuery>;
    getMessages(variables: GqlGetMessagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetMessagesQuery>;
    getMessageProof(variables: GqlGetMessageProofQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetMessageProofQuery>;
    getMessageStatus(variables: GqlGetMessageStatusQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlGetMessageStatusQuery>;
    dryRun(variables: GqlDryRunMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlDryRunMutation>;
    submit(variables: GqlSubmitMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlSubmitMutation>;
    produceBlocks(variables: GqlProduceBlocksMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GqlProduceBlocksMutation>;
};
export type Sdk = ReturnType<typeof getSdk>;
export {};
//# sourceMappingURL=operations.d.ts.map