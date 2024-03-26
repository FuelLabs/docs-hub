import type { FuelnautAbi } from '../../fuelnaut-api';
import { Address } from 'fuels';

export const getLevelStatuses = async (
  contract: FuelnautAbi,
  account: `fuel${string}`
) => {
  try {
    const address = new Address(account);
    const { value } = await contract.functions
      .get_all_levels_status({ value: address.toB256() })
      .txParams({
        gasPrice: 1,
        gasLimit: 100_000,
      })
      .simulate();
    return value;
  } catch (error) {
    console.log('ERROR:', error);
    return null;
  }
};