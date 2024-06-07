import { ContractFactory, randomBytes } from 'fuels';
import type { Account, BytesLike, JsonAbi } from 'fuels';

export async function deployNewInstance(
  wallet: Account,
  bytecodeString: string,
  abiJSON: JsonAbi,
  configurableConstants:
    | undefined
    | {
        [name: string]: unknown;
      },
) {
  const bytecode: BytesLike = Uint8Array.from(
    Buffer.from(bytecodeString, 'base64'),
  );
  const factory = new ContractFactory(bytecode, abiJSON, wallet);
  const salt = randomBytes(32);

  const contract = await factory.deployContract({
    configurableConstants,
    salt,
  });
  return contract;
}
