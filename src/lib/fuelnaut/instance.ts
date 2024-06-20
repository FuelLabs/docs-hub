import { type Account, type BigNumberish, type JsonAbi, arrayify, bn } from 'fuels';
import type { IFuelnautLevel } from '~/src/config/fuelnautLevels';
import type { FuelnautAbi } from '~/src/fuelnaut-api';
import type { ContractIdInput } from '~/src/fuelnaut-api/contracts/FuelnautAbi';

import { getConfigurables } from './configurables';
import { deployNewInstance } from './deploy';
import { getLevelContractFactory } from './factories';

export async function getNewInstance(
  level: IFuelnautLevel,
  contract: FuelnautAbi,
  wallet: Account,
  bytecode: string,
  abiJSON: JsonAbi,
) {
  // biome-ignore lint/suspicious/noExplicitAny:
  const thisWindow = window as any;
  const configurableConstants = getConfigurables(level.key);
  const newInstance = await deployNewInstance(
    wallet,
    bytecode,
    abiJSON,
    configurableConstants,
  );
  const instanceId: ContractIdInput = {
    bits: newInstance.id.toB256(),
  };
  const factory = getLevelContractFactory(level.key);
  const levelContract = factory.connect(instanceId.bits, wallet);

  // without this, the newly deployed contract instance may not be found
  await timeout(2000);

  if (level.hasConfigurables) {
    console.log('HAS CONFIGURABLES');
    // // hardcoded for testing
    const configurableInputs = buildConfigurables(
      1220,
      1,
    );
    const bytecodeBuffer = Buffer.from(bytecode, 'base64');
    const bytecodeInput = arrayify(bytecodeBuffer) as unknown as number[];

    // console.log('CALLING VERIFY INSTANCE WITH CONFIGURABLES...');

    // // await contract.functions
    // //   .create_instance_with_configurables(
    // //     instanceId,
    // //     level.index,
    // //     bytecodeInput,
    // //     configurableInputs,
    // //   )
    // //   .addContracts([levelContract])
    // //   .call();

    console.log("BYTECODE INPUT:", bytecodeInput)
    console.log("configurableInputs:", configurableInputs)

  //   const { logs } = await contract.functions
  // .verify_bytecode_test(bytecodeInput)
  // .call();
    const { logs } = await contract.functions
  .verify_instance_with_configurables(bytecodeInput, configurableInputs)
  .call();

  console.log("LOGS:", logs)
  } else {
  await contract.functions
      .create_instance(instanceId, level.index)
      .addContracts([levelContract])
      .call();
  }
  thisWindow.instance = newInstance;
  return newInstance;
}

// "configurables": [
//   {
//     "name": "PASSWORD",
//     "configurableType": {
//       "name": "",
//       "type": 3,
//       "typeArguments": null
//     },
//     "offset": 1220
//   }
// ]

function buildConfigurables(offset: number, configValue: number): [number, number[]][] {
  const myConfigurables: [number, number[]][] = [];
  const data: number[] = [];
  data.push(0, 0, 0, 0, 0, 0, 0, configValue);
  myConfigurables.push([offset, data]);
  return myConfigurables;
}


function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}