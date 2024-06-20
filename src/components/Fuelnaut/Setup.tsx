import { Button } from '@fuel-ui/react';
import type { Account } from 'fuels';
import type { FuelnautAbi } from '~/src/fuelnaut-api';
import { setup } from '~/src/lib/fuelnaut/setup';

export interface SetupProps {
  contract: FuelnautAbi | null;
  wallet?: Account;
}

export default function Setup({ contract, wallet }: SetupProps) {
  async function handleSubmit() {
    if (contract && wallet) {
      await setup(contract, wallet);
    } else {
      console.log('MISSING CONTRACT OR WALLET');
    }
  }
  return (
    <div>
      <Button onClick={handleSubmit}>Setup</Button>
    </div>
  );
}
