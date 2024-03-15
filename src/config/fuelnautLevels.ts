import contractsIds from '../fuelnaut-api/contract-ids.json';

export interface FuelnautLevel {
  // the name of the folder in the contracts directory
  key: string;
  // the title of the level
  title: string;
  // the deployed contract address
  contractId: string;
  // the index of this level in the contract's registered_levels vector
  index: number;
  // whether or not this level has configurable constants
  hasConfigurables: boolean;
}

export interface FuelnautLevelsConfig {
  [key: string]: FuelnautLevel;
}

export const isDev =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'development';

export const FUELNAUT_CONTRACT_ID = isDev
  ? contractsIds.fuelnaut
  : '0x0738d0c30a3473e5a21910b6bcac66cdc9f84c8842c0b7e15ed346b2c32f6bcb';

export const LEVELS_CONFIG: FuelnautLevelsConfig = {
  payback: {
    key: 'payback',
    title: 'Payback',
    index: 0,
    contractId: isDev
      ? contractsIds.payback
      : '0xfb691e6337816eae2262156322771bf432a010d232cdebf5c6383e863769aaff',
    hasConfigurables: false,
  },
  ['coin-flip']: {
    key: 'coin-flip',
    title: 'Coin Flip',
    index: 1,
    contractId: isDev
      ? contractsIds.coinFlip
      : '0x9800989ac8a30b168e1a5629ad2b21fedfcfd0424d2031138e7bfcb4e98c0d7a',
    hasConfigurables: false,
  },
  vault: {
    key: 'vault',
    title: 'Vault',
    index: 2,
    contractId: isDev
      ? contractsIds.vault
      : '0x1d32d3683bedf8d956ec2f52e8baea058292494866a418e991d917fec552126c',
    hasConfigurables: true,
  },
};
