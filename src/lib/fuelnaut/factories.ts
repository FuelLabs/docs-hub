import {
  CoinFlipAbi__factory,
  HelloWorldAbi__factory,
  PaybackAbi__factory,
  VaultAbi__factory,
} from '../../fuelnaut-api';

export function getLevelContractFactory(levelKey: string) {
  switch (levelKey) {
    case 'hello-world':
      return HelloWorldAbi__factory;
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
