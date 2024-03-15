import {
  PaybackAbi__factory,
  CoinFlipAbi__factory,
  VaultAbi__factory,
} from '../../fuelnaut-api';

export function getLevelContractFactory(levelKey: string) {
  switch (levelKey) {
    case 'payback':
      return PaybackAbi__factory;
    case 'coin-flip':
      return CoinFlipAbi__factory;
    case 'vault':
      return VaultAbi__factory;
    default:
      throw new Error('Invalid level key');
  }
}
