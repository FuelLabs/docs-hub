var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/cli.ts
import { configureCliOptions as configureTypegenCliOptions } from "@fuel-ts/abi-typegen/cli";
import { versions } from "@fuel-ts/versions";
import { runVersions } from "@fuel-ts/versions/cli";
import { Command, Option } from "commander";

// src/cli/utils/logger.ts
import chalk from "chalk";
var loggingConfig = {
  isDebugEnabled: false,
  isLoggingEnabled: true
};
function configureLogging(params) {
  loggingConfig.isLoggingEnabled = params.isLoggingEnabled;
  loggingConfig.isDebugEnabled = params.isDebugEnabled && loggingConfig.isLoggingEnabled;
}
function log(...data) {
  if (loggingConfig.isLoggingEnabled) {
    process.stdout.write(`${data.join(" ")}
`);
  }
}
function debug(...data) {
  if (loggingConfig.isDebugEnabled) {
    log(data);
  }
}
function error(...data) {
  process.stderr.write(`${chalk.red(data.join(" "))}
`);
}

// src/cli/config/forcUtils.ts
import { readFileSync, existsSync } from "fs";
import camelCase from "lodash.camelcase";
import { join } from "path";
import toml from "toml";
var forcFiles = /* @__PURE__ */ new Map();
var swayFiles = /* @__PURE__ */ new Map();
function readForcToml(path) {
  const forcPath = join(path, "./Forc.toml");
  if (!existsSync(forcPath)) {
    throw new Error(`Toml file not found:
  ${forcPath}`);
  }
  if (!forcFiles.has(forcPath)) {
    const forcFile = readFileSync(forcPath, "utf8");
    const tomlParsed = toml.parse(forcFile);
    forcFiles.set(forcPath, tomlParsed);
  }
  const tomlContents = forcFiles.get(forcPath);
  return tomlContents;
}
function readSwayType(path) {
  const forcToml = readForcToml(path);
  const entryFile = forcToml.project.entry || "main.sw";
  const swayEntryPath = join(path, "src", entryFile);
  if (!swayFiles.has(swayEntryPath)) {
    const swayFile = readFileSync(swayEntryPath, "utf8");
    const [swayType] = swayFile.split(";\n");
    swayFiles.set(swayEntryPath, swayType);
  }
  return swayFiles.get(swayEntryPath);
}
function getContractName(contractPath) {
  const { project } = readForcToml(contractPath);
  return project.name;
}
function getContractCamelCase(contractPath) {
  const projectName = getContractName(contractPath);
  return camelCase(projectName);
}
function getBinaryPath(contractPath) {
  const projectName = getContractName(contractPath);
  return join(contractPath, `/out/debug/${projectName}.bin`);
}
function getABIPath(contractPath) {
  const projectName = getContractName(contractPath);
  return join(contractPath, `/out/debug/${projectName}-abi.json`);
}
function getABIPaths(paths) {
  return Promise.all(paths.map((path) => getABIPath(path)));
}
var getStorageSlotsPath = (contractPath) => {
  const projectName = getContractName(contractPath);
  return join(contractPath, `/out/debug/${projectName}-storage_slots.json`);
};

// src/cli/commands/deploy/createWallet.ts
import { Provider } from "@fuel-ts/providers";
import { Wallet } from "@fuel-ts/wallet";
async function createWallet(providerUrl, privateKey) {
  let pvtKey;
  if (privateKey) {
    pvtKey = privateKey;
  } else if (process.env.PRIVATE_KEY) {
    pvtKey = process.env.PRIVATE_KEY;
  } else {
    throw new Error("You must provide a privateKey via config.privateKey or env PRIVATE_KEY");
  }
  const provider = await Provider.create(providerUrl);
  return Wallet.fromPrivateKey(pvtKey, provider);
}

// src/cli/commands/deploy/deployContract.ts
import { ContractFactory } from "@fuel-ts/contract";
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "fs";
async function deployContract(wallet, binaryPath, abiPath, storageSlotsPath, deployConfig) {
  debug(`Deploying contract for ABI: ${abiPath}`);
  const bytecode = readFileSync2(binaryPath);
  if (existsSync2(storageSlotsPath)) {
    const storageSlots = JSON.parse(readFileSync2(storageSlotsPath, "utf-8"));
    deployConfig.storageSlots = storageSlots;
  }
  const { minGasPrice: gasPrice } = wallet.provider.getGasConfig();
  const abi = JSON.parse(readFileSync2(abiPath, "utf-8"));
  const contractFactory = new ContractFactory(bytecode, abi, wallet);
  deployConfig.gasPrice = deployConfig.gasPrice ?? gasPrice;
  const contract = await contractFactory.deployContract(deployConfig);
  return contract.id.toB256();
}

// src/cli/commands/deploy/getDeployConfig.ts
async function getDeployConfig(deployConfig, options) {
  let config;
  if (typeof deployConfig === "function") {
    config = await deployConfig(options);
  } else {
    config = deployConfig;
  }
  return config;
}

// src/cli/commands/deploy/saveContractIds.ts
import { writeFile, mkdir } from "fs/promises";
import { resolve } from "path";
async function saveContractIds(contracts, output) {
  const contractsMap = contracts.reduce(
    (cConfig, { name, contractId }) => ({
      ...cConfig,
      [name]: contractId
    }),
    {}
  );
  const filePath = resolve(output, "contract-ids.json");
  await mkdir(output, { recursive: true });
  await writeFile(filePath, JSON.stringify(contractsMap, null, 2));
  log(`Contract IDs saved at: ${filePath}`);
}

// src/cli/commands/deploy/index.ts
async function deploy(config) {
  const contracts = [];
  const wallet = await createWallet(config.providerUrl, config.privateKey);
  log(`Deploying contracts to: ${wallet.provider.url}`);
  const contractsLen = config.contracts.length;
  for (let i = 0; i < contractsLen; i++) {
    const contractPath = config.contracts[i];
    const binaryPath = getBinaryPath(contractPath);
    const abiPath = getABIPath(contractPath);
    const storageSlotsPath = getStorageSlotsPath(contractPath);
    const projectName = getContractName(contractPath);
    const contractName = getContractCamelCase(contractPath);
    const deployConfig = await getDeployConfig(config.deployConfig, {
      contracts: Array.from(contracts),
      contractName,
      contractPath
    });
    const contractId = await deployContract(
      wallet,
      binaryPath,
      abiPath,
      storageSlotsPath,
      deployConfig
    );
    debug(`Contract deployed: ${projectName} - ${contractId}`);
    contracts.push({
      name: contractName,
      contractId
    });
  }
  await saveContractIds(contracts, config.output);
  return contracts;
}

// src/cli/commands/dev/startFuelCore.ts
import { spawn } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join as join3 } from "path";
import { getPortPromise } from "portfinder";
import treeKill from "tree-kill";

// src/cli/utils/findBinPath.ts
import { existsSync as existsSync3 } from "fs";
import { join as join2 } from "path";
var npmWhich = __require("npm-which")(__dirname);
function findBinPath(binCommandName) {
  let binPath = npmWhich.sync(binCommandName);
  if (!existsSync3(binPath)) {
    binPath = join2("node_modules", ".bin", binCommandName);
  }
  return binPath;
}

// src/cli/utils/getBinarySource.ts
import chalk2 from "chalk";
var getBinarySource = (useBuiltIn) => ({
  true: chalk2.cyan("built-in"),
  false: chalk2.green("source")
})[`${useBuiltIn}`];

// src/cli/commands/dev/defaultChainConfig.ts
var defaultConsensusKey = "0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298";
var defaultChainConfig = {
  chain_name: "local_testnet",
  block_gas_limit: 5e9,
  initial_state: {
    coins: [
      {
        owner: "0x94ffcc53b892684acefaebc8a3d4a595e528a8cf664eeb3ef36f1020b0809d0d",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x5d99ee966b42cd8fc7bdd1364b389153a9e78b42b7d4a691470674e817888d4e",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x5d99ee966b42cd8fc7bdd1364b389153a9e78b42b7d4a691470674e817888d4e",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x5d99ee966b42cd8fc7bdd1364b389153a9e78b42b7d4a691470674e817888d4e",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0xbdaad6a89e073e177895b3e5a9ccd15806749eda134a6438dae32fc5b6601f3f",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0xbdaad6a89e073e177895b3e5a9ccd15806749eda134a6438dae32fc5b6601f3f",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0xbdaad6a89e073e177895b3e5a9ccd15806749eda134a6438dae32fc5b6601f3f",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x95a7aa6cc32743f8706c40ef49a7423b47da763bb4bbc055b1f07254dc729036",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x95a7aa6cc32743f8706c40ef49a7423b47da763bb4bbc055b1f07254dc729036",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x95a7aa6cc32743f8706c40ef49a7423b47da763bb4bbc055b1f07254dc729036",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0xcee104acd38b940c8f1c62c6d7ea00a0ad2241d6dee0509a4bf27297508870d3",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0xcee104acd38b940c8f1c62c6d7ea00a0ad2241d6dee0509a4bf27297508870d3",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0xcee104acd38b940c8f1c62c6d7ea00a0ad2241d6dee0509a4bf27297508870d3",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x7e3626e306588eba79cafab73f0709e55ab8f4bdfe8c8b75034a430fc56ece89",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x7e3626e306588eba79cafab73f0709e55ab8f4bdfe8c8b75034a430fc56ece89",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x7e3626e306588eba79cafab73f0709e55ab8f4bdfe8c8b75034a430fc56ece89",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x1c31df52b6df56407dd95f83082e8beb9cfc9532ac111d5bd8491651d95ba775",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x1c31df52b6df56407dd95f83082e8beb9cfc9532ac111d5bd8491651d95ba775",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x1c31df52b6df56407dd95f83082e8beb9cfc9532ac111d5bd8491651d95ba775",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x09dd7a49174d6fcc9f4c6f7942c18060a935ddd03ee69b594189b8c3581276ea",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x09dd7a49174d6fcc9f4c6f7942c18060a935ddd03ee69b594189b8c3581276ea",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x09dd7a49174d6fcc9f4c6f7942c18060a935ddd03ee69b594189b8c3581276ea",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x86604282dc604481b809845be49667607c470644f6822fc01eb0d22f167e08cf",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x86604282dc604481b809845be49667607c470644f6822fc01eb0d22f167e08cf",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x86604282dc604481b809845be49667607c470644f6822fc01eb0d22f167e08cf",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0xbca334a06d19db5041c78fe2f465b07be5bec828f38b7796b2877e7d1542c950",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0xbca334a06d19db5041c78fe2f465b07be5bec828f38b7796b2877e7d1542c950",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0xbca334a06d19db5041c78fe2f465b07be5bec828f38b7796b2877e7d1542c950",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0xbd9a1dc8d3ec3521c43f6c2c01611b4d0204c7610204ff0178488c8738a30bd2",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0xbd9a1dc8d3ec3521c43f6c2c01611b4d0204c7610204ff0178488c8738a30bd2",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0xbd9a1dc8d3ec3521c43f6c2c01611b4d0204c7610204ff0178488c8738a30bd2",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0xb32197cf75efe05bf453c26178139f09b391582065549c1422bc92555ecffb64",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0xb32197cf75efe05bf453c26178139f09b391582065549c1422bc92555ecffb64",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0xb32197cf75efe05bf453c26178139f09b391582065549c1422bc92555ecffb64",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x3b24509ed4ab3c7959f5c9391c1445c59290cdb5f13d6f780922f376b7029f30",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x3b24509ed4ab3c7959f5c9391c1445c59290cdb5f13d6f780922f376b7029f30",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x3b24509ed4ab3c7959f5c9391c1445c59290cdb5f13d6f780922f376b7029f30",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x77c6f40b7da70d885f68efaad7c661327482a63ea10dcb4271de819438254ae1",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x77c6f40b7da70d885f68efaad7c661327482a63ea10dcb4271de819438254ae1",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x77c6f40b7da70d885f68efaad7c661327482a63ea10dcb4271de819438254ae1",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x6a2c4691c547c43924650dbd30620b184b5fe3fb6dbe5c4446110b08f6f405bf",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x6a2c4691c547c43924650dbd30620b184b5fe3fb6dbe5c4446110b08f6f405bf",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x6a2c4691c547c43924650dbd30620b184b5fe3fb6dbe5c4446110b08f6f405bf",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      },
      {
        owner: "0x49075a7538e2c88ebe1926ce4d898198a2a4e790d14512943a9864bc536b3c82",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        owner: "0x49075a7538e2c88ebe1926ce4d898198a2a4e790d14512943a9864bc536b3c82",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0101010101010101010101010101010101010101010101010101010101010101"
      },
      {
        owner: "0x49075a7538e2c88ebe1926ce4d898198a2a4e790d14512943a9864bc536b3c82",
        amount: "0xFFFFFFFFFFFFFFFF",
        asset_id: "0x0202020202020202020202020202020202020202020202020202020202020202"
      }
    ],
    messages: [
      {
        sender: "0xc43454aa38dd91f88109a4b7aef5efb96ce34e3f24992fe0f81d233ca686f80f",
        recipient: "0x69a2b736b60159b43bb8a4f98c0589f6da5fa3a3d101e8e269c499eb942753ba",
        nonce: "0101010101010101010101010101010101010101010101010101010101010101",
        amount: "0x000000000000FFFF",
        data: "",
        da_height: "0x00"
      },
      {
        sender: "0x69a2b736b60159b43bb8a4f98c0589f6da5fa3a3d101e8e269c499eb942753ba",
        recipient: "0xc43454aa38dd91f88109a4b7aef5efb96ce34e3f24992fe0f81d233ca686f80f",
        nonce: "0e1ef2963832068b0e1ef2963832068b0e1ef2963832068b0e1ef2963832068b",
        amount: "0xb04f3c08f59b309e",
        data: "",
        da_height: "0x00"
      }
    ]
  },
  consensus_parameters: {
    tx_params: {
      max_inputs: 255,
      max_outputs: 255,
      max_witnesses: 255,
      max_gas_per_tx: 1e7,
      max_size: 17825792
    },
    predicate_params: {
      max_predicate_length: 1048576,
      max_predicate_data_length: 1048576,
      max_gas_per_predicate: 1e7,
      max_message_data_length: 1048576
    },
    script_params: {
      max_script_length: 1048576,
      max_script_data_length: 1048576
    },
    contract_params: {
      contract_max_size: 16777216,
      max_storage_slots: 255
    },
    fee_params: {
      gas_price_factor: 92,
      gas_per_byte: 4
    }
  },
  gas_costs: {
    add: 1,
    addi: 1,
    aloc: 1,
    and: 1,
    andi: 1,
    bal: 13,
    bhei: 1,
    bhsh: 1,
    burn: 132,
    cb: 1,
    cfei: 1,
    cfsi: 1,
    croo: 16,
    div: 1,
    divi: 1,
    ecr1: 3e3,
    eck1: 951,
    ed19: 3e3,
    eq: 1,
    exp: 1,
    expi: 1,
    flag: 1,
    gm: 1,
    gt: 1,
    gtf: 1,
    ji: 1,
    jmp: 1,
    jne: 1,
    jnei: 1,
    jnzi: 1,
    jmpf: 1,
    jmpb: 1,
    jnzf: 1,
    jnzb: 1,
    jnef: 1,
    jneb: 1,
    lb: 1,
    log: 9,
    lt: 1,
    lw: 1,
    mint: 135,
    mlog: 1,
    modOp: 1,
    modi: 1,
    moveOp: 1,
    movi: 1,
    mroo: 2,
    mul: 1,
    muli: 1,
    mldv: 1,
    noop: 1,
    not: 1,
    or: 1,
    ori: 1,
    poph: 2,
    popl: 2,
    pshh: 2,
    pshl: 2,
    ret: 13,
    rvrt: 13,
    sb: 1,
    sll: 1,
    slli: 1,
    srl: 1,
    srli: 1,
    srw: 12,
    sub: 1,
    subi: 1,
    sw: 1,
    sww: 67,
    time: 1,
    tr: 105,
    tro: 60,
    wdcm: 1,
    wqcm: 1,
    wdop: 1,
    wqop: 1,
    wdml: 1,
    wqml: 1,
    wddv: 1,
    wqdv: 2,
    wdmd: 3,
    wqmd: 4,
    wdam: 2,
    wqam: 3,
    wdmm: 3,
    wqmm: 3,
    xor: 1,
    xori: 1,
    call: {
      LightOperation: {
        base: 144,
        units_per_gas: 214
      }
    },
    ccp: {
      LightOperation: {
        base: 15,
        units_per_gas: 103
      }
    },
    csiz: {
      LightOperation: {
        base: 17,
        units_per_gas: 790
      }
    },
    k256: {
      LightOperation: {
        base: 11,
        units_per_gas: 214
      }
    },
    ldc: {
      LightOperation: {
        base: 15,
        units_per_gas: 272
      }
    },
    logd: {
      LightOperation: {
        base: 26,
        units_per_gas: 64
      }
    },
    mcl: {
      LightOperation: {
        base: 1,
        units_per_gas: 3333
      }
    },
    mcli: {
      LightOperation: {
        base: 1,
        units_per_gas: 3333
      }
    },
    mcp: {
      LightOperation: {
        base: 1,
        units_per_gas: 2e3
      }
    },
    mcpi: {
      LightOperation: {
        base: 3,
        units_per_gas: 2e3
      }
    },
    meq: {
      LightOperation: {
        base: 1,
        units_per_gas: 2500
      }
    },
    retd: {
      LightOperation: {
        base: 29,
        units_per_gas: 62
      }
    },
    s256: {
      LightOperation: {
        base: 2,
        units_per_gas: 214
      }
    },
    scwq: {
      LightOperation: {
        base: 13,
        units_per_gas: 5
      }
    },
    smo: {
      LightOperation: {
        base: 209,
        units_per_gas: 55
      }
    },
    srwq: {
      LightOperation: {
        base: 47,
        units_per_gas: 5
      }
    },
    swwq: {
      LightOperation: {
        base: 44,
        units_per_gas: 5
      }
    },
    contract_root: {
      LightOperation: {
        base: 75,
        units_per_gas: 1
      }
    },
    state_root: {
      LightOperation: {
        base: 412,
        units_per_gas: 1
      }
    },
    vm_initialization: {
      HeavyOperation: {
        base: 2e3,
        gas_per_unit: 0
      }
    },
    new_storage_per_byte: 1
  },
  consensus: {
    PoA: {
      signing_key: "0x94ffcc53b892684acefaebc8a3d4a595e528a8cf664eeb3ef36f1020b0809d0d"
    }
  }
};

// src/cli/commands/dev/startFuelCore.ts
var killNode = (params) => () => {
  const { core, state, killFn } = params;
  if (core.pid && !state.isDead) {
    state.isDead = true;
    killFn(Number(core.pid));
  }
};
var createTempChainConfig = (coreDir) => {
  const chainConfigPath = join3(coreDir, "chainConfig.json");
  const chainConfigJson = JSON.stringify(defaultChainConfig, null, 2);
  mkdirSync(dirname(chainConfigPath), { recursive: true });
  writeFileSync(chainConfigPath, chainConfigJson);
  return chainConfigPath;
};
var startFuelCore = async (config) => {
  log(`Starting ${getBinarySource(config.useBuiltinFuelCore)} 'fuel-core' node..`);
  const coreDir = join3(config.basePath, ".fuels");
  const bindIp = "0.0.0.0";
  const accessIp = "127.0.0.1";
  const chainConfig = config.chainConfig ?? createTempChainConfig(coreDir);
  const port = config.fuelCorePort ?? await getPortPromise({ port: 4e3 });
  const providerUrl = `http://${accessIp}:${port}/graphql`;
  const flags = [
    "run",
    ["--ip", bindIp],
    ["--port", port.toString()],
    ["--db-path", coreDir],
    ["--min-gas-price", "0"],
    ["--poa-instant", "true"],
    ["--consensus-key", defaultConsensusKey],
    ["--chain", chainConfig],
    "--vm-backtrace",
    "--utxo-validation",
    "--debug"
  ].flat();
  return new Promise((resolve4, reject) => {
    const builtInFuelsCorePath = findBinPath("fuels-core");
    const command = config.useBuiltinFuelCore ? builtInFuelsCorePath : "fuel-core";
    const core = spawn(command, flags, { stdio: "pipe" });
    if (loggingConfig.isLoggingEnabled) {
      core.stderr.pipe(process.stderr);
    }
    if (loggingConfig.isDebugEnabled) {
      core.stdout.pipe(process.stdout);
    }
    const state = { isDead: false };
    const killChildProcess = killNode({ core, state, killFn: treeKill });
    process.on("beforeExit", killChildProcess);
    process.on("uncaughtException", killChildProcess);
    core.stderr?.on("data", (data) => {
      if (/Binding GraphQL provider to/.test(data)) {
        resolve4({
          bindIp,
          accessIp,
          port,
          providerUrl,
          killChildProcess,
          chainConfig
        });
      }
      if (/error/i.test(data)) {
        error(
          `Some error occurred. Please, check to see if you have another instance running locally.`
        );
        reject(data.toString());
      }
    });
    core.on("error", reject);
  });
};
var autoStartFuelCore = async (config) => {
  let fuelCore;
  if (config.autoStartFuelCore) {
    fuelCore = await startFuelCore(config);
    config.providerUrl = fuelCore.providerUrl;
    config.privateKey = defaultConsensusKey;
  }
  return fuelCore;
};

// src/cli/commands/build/buildSwayPrograms.ts
import { spawn as spawn2 } from "child_process";
var onForcExit = (onResultFn, onErrorFn) => (code) => {
  if (code) {
    onErrorFn(code);
  } else {
    onResultFn();
  }
};
var onForcError = (onError) => (err) => {
  error(err);
  onError(err);
};
var buildSwayProgram = async (config, path) => {
  debug("Building Sway program", path);
  return new Promise((resolve4, reject) => {
    const builtInForcPath = findBinPath("fuels-forc");
    const command = config.useBuiltinForc ? builtInForcPath : "forc";
    const forc = spawn2(command, ["build", "-p", path], { stdio: "pipe" });
    if (loggingConfig.isLoggingEnabled) {
      forc.stderr?.pipe(process.stderr);
    }
    if (loggingConfig.isDebugEnabled) {
      forc.stdout?.pipe(process.stdout);
    }
    const onExit = onForcExit(resolve4, reject);
    const onError = onForcError(reject);
    forc.on("exit", onExit);
    forc.on("error", onError);
  });
};
async function buildSwayPrograms(config) {
  log(`Building Sway programs using ${getBinarySource(config.useBuiltinFuelCore)} 'forc' binary`);
  const paths = config.workspace ? [config.workspace] : [config.contracts, config.predicates, config.scripts].flat();
  await Promise.all(paths.map((path) => buildSwayProgram(config, path)));
}

// src/cli/commands/build/generateTypes.ts
import { ProgramTypeEnum } from "@fuel-ts/abi-typegen";
import { runTypegen } from "@fuel-ts/abi-typegen/runTypegen";
import { writeFileSync as writeFileSync2, mkdirSync as mkdirSync2 } from "fs";
import { join as join4 } from "path";

// src/cli/templates/index.ts
import { compile } from "handlebars";

// src/cli/templates/index.hbs
var templates_default = "{{#each paths}}\nexport * from './{{this}}';\n{{/each}}\n";

// src/cli/templates/index.ts
function renderIndexTemplate(paths) {
  const renderTemplate = compile(templates_default, {
    strict: true,
    noEscape: true
  });
  return renderTemplate({
    paths
  });
}

// src/cli/commands/build/generateTypes.ts
async function generateTypesForProgramType(config, paths, programType) {
  debug("Generating types..");
  const filepaths = await getABIPaths(paths);
  const pluralizedDirName = `${String(programType).toLocaleLowerCase()}s`;
  runTypegen({
    programType,
    cwd: config.basePath,
    filepaths,
    output: join4(config.output, pluralizedDirName),
    silent: !loggingConfig.isDebugEnabled
  });
  return pluralizedDirName;
}
async function generateTypes(config) {
  log("Generating types..");
  const { contracts, scripts, predicates, output } = config;
  mkdirSync2(output, { recursive: true });
  const members = [
    { type: ProgramTypeEnum.CONTRACT, programs: contracts },
    { type: ProgramTypeEnum.SCRIPT, programs: scripts },
    { type: ProgramTypeEnum.PREDICATE, programs: predicates }
  ];
  const pluralizedDirNames = await Promise.all(
    members.filter(({ programs }) => !!programs.length).map(({ programs, type }) => generateTypesForProgramType(config, programs, type))
  );
  const indexFile = await renderIndexTemplate(pluralizedDirNames);
  writeFileSync2(join4(config.output, "index.ts"), indexFile);
}

// src/cli/commands/build/index.ts
async function build(config, program) {
  log("Building..");
  await buildSwayPrograms(config);
  await generateTypes(config);
  const options = program?.opts();
  if (options?.deploy) {
    const fuelCore = await autoStartFuelCore(config);
    await deploy(config);
    fuelCore?.killChildProcess();
  }
}

// src/cli/commands/dev/index.ts
import { watch } from "chokidar";
import { globSync } from "glob";

// src/cli/config/loadConfig.ts
import { FUEL_NETWORK_URL } from "@fuel-ts/wallet/configs";
import { bundleRequire } from "bundle-require";
import JoyCon from "joycon";
import { resolve as resolve2, parse } from "path";

// src/cli/commands/init/shouldUseBuiltinForc.ts
import { getSystemForc } from "@fuel-ts/versions/cli";
var shouldUseBuiltinForc = () => {
  const { systemForcVersion } = getSystemForc();
  if (systemForcVersion !== null) {
    return false;
  }
  return true;
};

// src/cli/commands/init/shouldUseBuiltinFuelCore.ts
import { getSystemFuelCore } from "@fuel-ts/versions/cli";
var shouldUseBuiltinFuelCore = () => {
  const { systemFuelCoreVersion } = getSystemFuelCore();
  if (systemFuelCoreVersion !== null) {
    return false;
  }
  return true;
};

// src/cli/config/validateConfig.ts
import * as yup from "yup";
var schema = yup.object({
  workspace: yup.string(),
  contracts: yup.array(yup.string()),
  scripts: yup.array(yup.string()),
  predicates: yup.array(yup.string()),
  output: yup.string().required("config.output should be a valid string")
}).required();
async function validateConfig(config) {
  return schema.validate(config);
}

// src/cli/config/loadConfig.ts
async function loadConfig(cwd) {
  const configJoycon = new JoyCon();
  const configPath = await configJoycon.resolve({
    files: ["ts", "js", "cjs", "mjs"].map((e) => `fuels.config.${e}`),
    cwd,
    stopDir: parse(cwd).root
  });
  if (!configPath) {
    throw new Error("Config file not found!");
  }
  const esbuildOptions = {
    target: "ES2021",
    platform: "node",
    format: "esm"
  };
  const result = await bundleRequire({
    filepath: configPath,
    esbuildOptions,
    cwd
  });
  const userConfig = result.mod.default;
  await validateConfig(userConfig);
  const useBuiltinForc = userConfig.useBuiltinForc ?? shouldUseBuiltinForc();
  const useBuiltinFuelCore = userConfig.useBuiltinFuelCore ?? shouldUseBuiltinFuelCore();
  const config = {
    contracts: [],
    scripts: [],
    predicates: [],
    deployConfig: {},
    autoStartFuelCore: true,
    fuelCorePort: 4e3,
    providerUrl: FUEL_NETWORK_URL,
    privateKey: defaultConsensusKey,
    ...userConfig,
    basePath: cwd,
    useBuiltinForc,
    useBuiltinFuelCore,
    configPath
  };
  config.output = resolve2(cwd, config.output);
  config.autoStartFuelCore = userConfig.autoStartFuelCore ?? true;
  if (!userConfig.workspace) {
    const { contracts, predicates, scripts } = userConfig;
    config.contracts = (contracts || []).map((c) => resolve2(cwd, c));
    config.scripts = (scripts || []).map((s) => resolve2(cwd, s));
    config.predicates = (predicates || []).map((p) => resolve2(cwd, p));
  } else {
    const workspace = resolve2(cwd, userConfig.workspace);
    const forcToml = readForcToml(workspace);
    if (!forcToml.workspace) {
      const workspaceMsg = `Forc workspace not detected in:
  ${workspace}/Forc.toml`;
      const swayProgramType = readSwayType(workspace);
      const exampleMsg = `Try using '${swayProgramType}s' instead of 'workspace' in:
  ${configPath}`;
      throw new Error([workspaceMsg, exampleMsg].join("\n\n"));
    }
    const swayMembers = forcToml.workspace.members.map((member) => resolve2(workspace, member));
    swayMembers.forEach((path) => {
      const type = readSwayType(path);
      config[`${type}s`].push(path);
    });
    config.workspace = workspace;
  }
  return config;
}

// src/cli/commands/withConfig.ts
import { capitalizeString } from "@fuel-ts/utils";
var withConfigErrorHandler = async (err, config) => {
  error(err);
  if (config) {
    await config.onFailure?.(err, config);
  }
};
function withConfig(program, command, fn) {
  return async () => {
    const options = program.opts();
    let config;
    try {
      config = await loadConfig(options.path);
    } catch (err) {
      await withConfigErrorHandler(err);
      return;
    }
    try {
      const eventData = await fn(config, program);
      config.onSuccess?.(
        {
          type: command,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: eventData
        },
        config
      );
      log(`\u{1F389}  ${capitalizeString(command)} completed successfully!`);
    } catch (err) {
      await withConfigErrorHandler(err, config);
    }
  };
}

// src/cli/commands/dev/index.ts
var closeAllFileHandlers = (handlers) => {
  handlers.forEach((h) => h.close());
};
var buildAndDeploy = async (config) => {
  await build(config);
  return deploy(config);
};
var getConfigFilepathsToWatch = (config) => {
  const configFilePathsToWatch = [config.configPath];
  if (config.chainConfig) {
    configFilePathsToWatch.push(config.chainConfig);
  }
  return configFilePathsToWatch;
};
var workspaceFileChanged = (state) => async (_event, path) => {
  log(`
File changed: ${path}`);
  await buildAndDeploy(state.config);
};
var configFileChanged = (state) => async (_event, path) => {
  log(`
File changed: ${path}`);
  closeAllFileHandlers(state.watchHandlers);
  state.fuelCore?.killChildProcess();
  try {
    await dev(await loadConfig(state.config.basePath));
  } catch (err) {
    await withConfigErrorHandler(err, state.config);
  }
};
var dev = async (config) => {
  const fuelCore = await autoStartFuelCore(config);
  const configFilePaths = getConfigFilepathsToWatch(config);
  const { contracts, scripts, predicates, basePath: cwd } = config;
  const workspaceFilePaths = [contracts, predicates, scripts].flat().flatMap((dir) => [
    dir,
    globSync(`${dir}/**/*.toml`, { cwd }),
    globSync(`${dir}/**/*.sw`, { cwd })
  ]).flat();
  try {
    await buildAndDeploy(config);
    const watchHandlers = [];
    const options = { persistent: true, ignoreInitial: true, ignored: "**/out/**" };
    const state = { config, watchHandlers, fuelCore };
    watchHandlers.push(watch(configFilePaths, options).on("all", configFileChanged(state)));
    watchHandlers.push(watch(workspaceFilePaths, options).on("all", workspaceFileChanged(state)));
  } catch (err) {
    error(err);
    throw err;
  }
};

// src/cli/commands/init/index.ts
import { existsSync as existsSync4, writeFileSync as writeFileSync3 } from "fs";
import { globSync as globSync2 } from "glob";
import { join as join5, relative, resolve as resolve3 } from "path";

// src/cli/templates/fuels.config.ts
import Handlebars, { compile as compile2 } from "handlebars";

// src/cli/templates/fuels.config.hbs
var fuels_config_default = "import { createConfig } from 'fuels';\n\nexport default createConfig({\n  {{#if (isDefined workspace)}}\n  workspace: '{{workspace}}',\n  {{else}}\n    {{#if (isDefined contracts)}}\n  contracts: [\n      {{#each contracts}}\n        '{{this}}',\n      {{/each}}\n  ],\n    {{/if}}\n    {{#if (isDefined predicates)}}\n  predicates: [\n      {{#each predicates}}\n        '{{this}}',\n      {{/each}}\n  ],\n    {{/if}}\n    {{#if (isDefined scripts)}}\n  scripts: [\n      {{#each scripts}}\n        '{{this}}',\n      {{/each}}\n  ],\n    {{/if}}\n  {{/if}}\n  output: '{{output}}',\n  {{#if (isDefined useBuiltinForc)}}\n  useBuiltinForc: {{useBuiltinForc}},\n  {{/if}}\n  {{#if (isDefined useBuiltinFuelCore)}}\n  useBuiltinFuelCore: {{useBuiltinFuelCore}},\n  {{/if}}\n  {{#if (isDefined autoStartFuelCore)}}\n  autoStartFuelCore: {{autoStartFuelCore}},\n  {{/if}}\n});\n\n/**\n * Check the docs:\n * https://fuellabs.github.io/fuels-ts/guide/cli/config-file\n */\n";

// src/cli/templates/fuels.config.ts
Handlebars.registerHelper("isDefined", (v) => v !== void 0);
function renderFuelsConfigTemplate(props) {
  const renderTemplate = compile2(fuels_config_default, {
    strict: true,
    noEscape: true
  });
  return renderTemplate(props);
}

// src/cli/commands/init/index.ts
function init(program) {
  const options = program.opts();
  const { path, autoStartFuelCore: autoStartFuelCore2, useBuiltinForc, useBuiltinFuelCore } = options;
  let workspace;
  let absoluteWorkspace;
  if (options.workspace) {
    absoluteWorkspace = resolve3(path, options.workspace);
    workspace = `./${relative(path, absoluteWorkspace)}`;
  }
  const absoluteOutput = resolve3(path, options.output);
  const output = `./${relative(path, absoluteOutput)}`;
  const [contracts, scripts, predicates] = ["contracts", "scripts", "predicates"].map(
    (optionName) => {
      const pathOrGlob = options[optionName];
      if (!pathOrGlob) {
        return void 0;
      }
      const expanded = globSync2(pathOrGlob, { cwd: path });
      const relatives = expanded.map((e) => relative(path, e));
      return relatives;
    }
  );
  const noneIsInformed = ![workspace, contracts, scripts, predicates].find((v) => v !== void 0);
  if (noneIsInformed) {
    process.stdout.write(`error: required option '-w, --workspace <path>' not specified\r`);
    process.exit(1);
  }
  const fuelsConfigPath = join5(path, "fuels.config.ts");
  if (existsSync4(fuelsConfigPath)) {
    throw new Error(`Config file exists, aborting.
  ${fuelsConfigPath}`);
  }
  const renderedConfig = renderFuelsConfigTemplate({
    workspace,
    contracts,
    scripts,
    predicates,
    output,
    useBuiltinForc,
    useBuiltinFuelCore,
    autoStartFuelCore: autoStartFuelCore2
  });
  writeFileSync3(fuelsConfigPath, renderedConfig);
  log(`Config file created at:

 ${fuelsConfigPath}
`);
}

// src/cli/commands/withProgram.ts
function withProgram(program, _command, fn) {
  return async () => {
    try {
      await fn(program);
    } catch (err) {
      error(err);
    }
  };
}

// src/cli.ts
var onPreAction = (command) => {
  const opts = command.opts();
  configureLogging({
    isDebugEnabled: opts.debug,
    isLoggingEnabled: !opts.silent
  });
};
var configureCli = () => {
  const program = new Command();
  program.name("fuels");
  program.option("-D, --debug", "Enables verbose logging", false);
  program.option("-S, --silent", "Omit output messages", false);
  program.version(versions.FUELS, "-v, --version", "Output the version number");
  program.helpOption("-h, --help", "Display help");
  program.addHelpCommand("help [command]", "Display help for command");
  program.enablePositionalOptions(true);
  program.hook("preAction", onPreAction);
  const pathOption = new Option("-p, --path <path>", "Path to project root").default(process.cwd());
  let command;
  const desc = `Relative path/globals to `;
  const arg = `<path|global>`;
  (command = program.command("init" /* init */)).description("Create a sample `fuel.config.ts` file").addOption(pathOption).option("-w, --workspace <path>", "Relative dir path to Forc workspace").addOption(new Option(`-c, --contracts ${arg}`, `${desc} Contracts`).conflicts("workspace")).addOption(new Option(`-s, --scripts ${arg}`, `${desc} Scripts`).conflicts("workspace")).addOption(new Option(`-p, --predicates ${arg}`, `${desc} Predicates`).conflicts("workspace")).requiredOption("-o, --output <path>", "Relative dir path for Typescript generation output").option("--use-builtin-forc", "Use buit-in `forc` to build Sway programs").option("--use-builtin-fuel-core", "Use buit-in `fuel-core` when starting a Fuel node").option("--auto-start-fuel-core", "Auto-starts a `fuel-core` node during `dev` command").action(withProgram(command, "init" /* init */, init));
  (command = program.command("dev" /* dev */)).description("Start a Fuel node and run build + deploy on every file change").addOption(pathOption).action(withConfig(command, "dev" /* dev */, dev));
  (command = program.command("build" /* build */)).description("Build Sway programs and generate Typescript for them").addOption(pathOption).option(
    "-d, --deploy",
    "Deploy contracts after build (auto-starts a `fuel-core` node if needed)"
  ).action(withConfig(command, "build" /* build */, build));
  (command = program.command("deploy" /* deploy */)).description("Deploy contracts to the Fuel network").addOption(pathOption).action(withConfig(command, "deploy" /* deploy */, deploy));
  configureTypegenCliOptions(
    program.command("typegen").description(`Generate Typescript from Sway ABI JSON files`)
  );
  program.command("versions").description("Check for version incompatibilities").action(runVersions);
  program.command("core", "Wrapper around Fuel Core binary", {
    executableFile: findBinPath("fuels-core")
  });
  program.command("forc", "Wrapper around Forc binary", {
    executableFile: findBinPath("fuels-forc")
  });
  return program;
};
var run = async (argv) => {
  const program = configureCli();
  return program.parseAsync(argv);
};
export {
  configureCli,
  onPreAction,
  run
};
//# sourceMappingURL=cli.mjs.map