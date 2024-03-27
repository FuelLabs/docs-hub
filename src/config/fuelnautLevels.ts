import contractsIds from '../fuelnaut-api/contract-ids.json';

export interface IFuelnautLevel {
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
  [key: string]: IFuelnautLevel;
}

export const VERCEL_ENV = 
  process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';

export const FUELNAUT_CONTRACT_ID =
  VERCEL_ENV === 'production' || VERCEL_ENV === 'preview'
    ? 
    '0x13c8eafb002820d38c6b30d838a993e4bd81a585382f68a2cd44015181db17da'
    : contractsIds.fuelnaut;

export const LEVELS_CONFIG: FuelnautLevelsConfig = {
  'hello-world': {
    key: 'hello-world',
    title: 'Hello World',
    index: 0,
    contractId:
      VERCEL_ENV === 'development'
        ? contractsIds.helloWorld
        : '0xb3b99987a8d22824c27438dcf4d0f72328a0bda273c05d03ca6f889e47155a0c',
    hasConfigurables: false,
  },
  payback: {
    key: 'payback',
    title: 'Payback',
    index: 1,
    contractId:
      VERCEL_ENV === 'development'
        ? contractsIds.payback
        : '0x46d81687ec5db87c50cb0e49cb6c68c02da7dabc0b87f6fa62ad56dcc720f81b',
    hasConfigurables: false,
  },
  'coin-flip': {
    key: 'coin-flip',
    title: 'Coin Flip',
    index: 2,
    contractId:
      VERCEL_ENV === 'development'
        ? contractsIds.coinFlip
        : '0x02fd424a8732e43c34f87cd4d231a761cfc8941775ba8bd752f478e46efe027a',
    hasConfigurables: false,
  },
  vault: {
    key: 'vault',
    title: 'Vault',
    index: 3,
    contractId:
      VERCEL_ENV === 'development'
        ? contractsIds.vault
        : '0x1d32d3683bedf8d956ec2f52e8baea058292494866a418e991d917fec552126c',
    hasConfigurables: true,
  },
};
