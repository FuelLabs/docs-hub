import type { WalletLocked } from 'fuels';
import { BN } from 'fuels';

import { getLevelContractFactory } from './factories';
import type { FuelnautLevel } from '~/src/config/fuelnautLevels';
import { LEVELS_CONFIG } from '~/src/config/fuelnautLevels';
import type { FuelnautAbi } from '~/src/fuelnaut-api';

export async function setup(contract: FuelnautAbi, wallet: WalletLocked) {
  try {
    await contract.functions
      .my_constructor()
      .txParams({ gasPrice: 1, gasLimit: 800_000 })
      .call();

    for (const key of Object.keys(LEVELS_CONFIG)) {
      const level = LEVELS_CONFIG[key];
      await setupLevel(contract, wallet, level);
    }

    console.log('Successfully set up game.');
  } catch (e) {
    console.log('ERROR:', e);
  }
}

async function setupLevel(
  contract: FuelnautAbi,
  wallet: WalletLocked,
  level: FuelnautLevel
) {
  const factory = getLevelContractFactory(level.key);
  const levelContract = factory.connect(level.contractId, wallet);

  const response = await contract.functions
    .get_bytecode_root({ value: level.contractId })
    .addContracts([levelContract])
    .txParams({
      gasPrice: 1,
      gasLimit: 800_000,
    })
    .simulate();

  const contractRoot = response.value;
  console.log('CONTRACT ROOT:', contractRoot);

  const { value } = await contract.functions
    .register_level(contractRoot)
    .txParams({
      gasPrice: 1,
      gasLimit: 800_000,
    })
    .call();
  const formattedValue = new BN(value).toNumber();
  console.log('INDEX VALUE:', formattedValue);
}
