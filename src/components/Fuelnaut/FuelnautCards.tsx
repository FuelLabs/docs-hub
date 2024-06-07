import { Alert, Box, Spinner } from '@fuel-ui/react';
import { useIsConnected, useNetwork, useWallet } from '@fuels/react';
import { useMemo } from 'react';
import { FUELNAUT_CONTRACT_ID, VERCEL_ENV } from '~/src/config/fuelnautLevels';
import { FuelnautAbi__factory } from '~/src/fuelnaut-api';
import { ConnectWallet } from '../ConnectWallet';
import Setup from './Setup';
import ShowFuelnautLevels from './ShowFuelnautLevels';

export function FuelnautCards() {
  const { isConnected } = useIsConnected();
  const { network } = useNetwork();
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (wallet && isConnected && FUELNAUT_CONTRACT_ID) {
      const contract = FuelnautAbi__factory.connect(
        FUELNAUT_CONTRACT_ID,
        wallet,
      );
      return contract;
    }
    return null;
  }, [wallet, isConnected, FUELNAUT_CONTRACT_ID]);

  const isProdOrPreview =
    VERCEL_ENV === 'production' || VERCEL_ENV === 'preview';

  const testnetNetwork = 'https://testnet.fuel.network/v1/graphql';

  return (
    <Box.Flex>
      {isConnected ? (
        <div>
          You are connected
          {contract && wallet ? (
            <>
              <Setup contract={contract} wallet={wallet} />
              <ShowFuelnautLevels contract={contract} />
            </>
          ) : (
            <>
              {isProdOrPreview && network?.url !== testnetNetwork ? (
                <>
                  <Alert direction='row' status='error'>
                    <Alert.Description>
                      Wrong network. Change to the testnet network in your
                      wallet.
                    </Alert.Description>
                  </Alert>
                </>
              ) : (
                <>
                  Loading contract...
                  <Spinner />
                  {wallet?.address}
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          <ConnectWallet />
        </div>
      )}
    </Box.Flex>
  );
}
