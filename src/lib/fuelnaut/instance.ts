import type { FuelnautLevel } from '~/src/config/fuelnautLevels';
import type { FuelnautAbi } from '~/src/fuelnaut-api';
import type { ContractIdInput } from '~/src/fuelnaut-api/contracts/FuelnautAbi';
import type { JsonAbi, WalletLocked } from 'fuels';

import { getConfigurables } from './configurables';
import { deployNewInstance } from './deploy';

export async function getNewInstance(
  level: FuelnautLevel,
  contract: FuelnautAbi,
  wallet: WalletLocked,
  bytecode: string,
  abiJSON: JsonAbi
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thisWindow = window as any;
  const configurableConstants = getConfigurables(level.key);
  const newInstance = await deployNewInstance(
    wallet,
    bytecode,
    abiJSON,
    configurableConstants
  );
  const instanceId: ContractIdInput = {
    value: newInstance.id.toB256(),
  };
  if (level.hasConfigurables && configurableConstants) {
    console.log('HAS CONFIGURABLES');
    // const configurableInputs = getConfigurableInputs(configurableConstants.PASSWORD);
    // console.log("configurableInputs:", configurableInputs);
    //  await contract.functions
    //  .create_instance_with_configurables(instanceId, level.index, bytecode, configurableInputs)
    //  .txParams({ gasPrice: 1, gasLimit: 800_000 })
    //  .call();
  } else {
    await contract.functions
      .create_instance(instanceId, level.index)
      .txParams({ gasPrice: 1, gasLimit: 800_000 })
      .call();
  }
  thisWindow.instance = newInstance;
}
