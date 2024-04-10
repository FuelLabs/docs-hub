import { Address } from 'fuels';
import type { FuelnautAbi } from '../../fuelnaut-api';

export const getLevelStatuses = async (
  contract: FuelnautAbi,
  account: `fuel${string}`,
) => {
  try {
    const address = new Address(account);
    const { value } = await contract.functions
      .get_all_levels_status({ value: address.toB256() })
      .txParams({
        gasPrice: 1,
        gasLimit: 100_000,
      })
      .get();
    return value;
  } catch (error) {
    console.log('ERROR:', error);
    return null;
  }
};
