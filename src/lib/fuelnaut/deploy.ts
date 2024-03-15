import { ContractFactory, randomBytes } from 'fuels';
import type { JsonAbi, BytesLike, WalletLocked } from 'fuels';

export async function deployNewInstance(
  wallet: WalletLocked,
  bytecodeString: string,
  abiJSON: JsonAbi,
  configurableConstants: undefined | {
    [name: string]: unknown;
  },
) {
  const bytecode: BytesLike = Uint8Array.from(
    Buffer.from(bytecodeString, 'base64'),
  );
  const factory = new ContractFactory(bytecode, abiJSON, wallet);
  const { minGasPrice: gasPrice } = wallet.provider.getGasConfig();
  const salt = randomBytes(32);

  const contract = await factory.deployContract({
    configurableConstants,
    gasPrice,
    salt,
  });
  return contract;
}
