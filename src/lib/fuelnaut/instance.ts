import type { FuelnautLevel } from '~/src/config/fuelnautLevels';
import type { FuelnautAbi } from '~/src/fuelnaut-api';
import type { ContractIdInput } from '~/src/fuelnaut-api/contracts/FuelnautAbi';
import { type JsonAbi, type Account, type BigNumberish, BN } from 'fuels';

import { getConfigurables } from './configurables';
import { deployNewInstance } from './deploy';
import type { Vec } from '~/src/fuelnaut-api/contracts/common';

export async function getNewInstance(
  level: FuelnautLevel,
  contract: FuelnautAbi,
  wallet: Account,
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
    const configurableInputs = buildConfigurables(new BN(1288), new BN(17));
    // getConfigurableInputs(configurableConstants.PASSWORD);
    console.log('configurableInputs:', configurableInputs);
    const bytecodeBuffer = Buffer.from(bytecode, 'base64');

    // Parse the bytecode and convert to BN instances
    const bytecodeInput: Vec<BigNumberish> = [];
    for (let i = 0; i < bytecodeBuffer.length; i += 32) {
      // Extract a 32-byte segment and convert to a hex string
      const segment = bytecodeBuffer.subarray(i, i + 32);
      const number = new BN(segment.toString('hex'), 'hex');
      // Convert the hex string to a BN and add it to the array
      bytecodeInput.push(number);
    }

    await contract.functions
      .create_instance_with_configurables(
        instanceId,
        level.index,
        bytecodeInput,
        configurableInputs
      )
      .txParams({ gasPrice: 1, gasLimit: 800_000 })
      .call();
  } else {
    await contract.functions
      .create_instance(instanceId, level.index)
      .txParams({ gasPrice: 1, gasLimit: 800_000 })
      .call();
  }
  thisWindow.instance = newInstance;
}

// "configurables": [
//   {
//     "name": "PASSWORD",
//     "configurableType": {
//       "name": "",
//       "type": 1,
//       "typeArguments": null
//     },
//     "offset": 1288
//   }
// ]

function buildConfigurables(
  offset: BigNumberish,
  configValue: BigNumberish
): Vec<[BigNumberish, Vec<BigNumberish>]> {
  const myConfigurables: Vec<[BigNumberish, Vec<BigNumberish>]> = [];
  const data: Vec<BigNumberish> = [];

  // Assuming configValue is a single byte and we want to prepend it with seven 0 bytes
  data.push(
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    new BN(0),
    configValue
  );
  myConfigurables.push([offset, data]);

  return myConfigurables;
}
