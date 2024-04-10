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
  console.log("isConnected", isConnected)
  console.log("wallet", wallet)
  console.log("network", network)

  const contract = useMemo(() => {
    console.log("CALCULATING CONTRACT MEMO")
    if (wallet && isConnected && FUELNAUT_CONTRACT_ID) {
      const contract = FuelnautAbi__factory.connect(
        FUELNAUT_CONTRACT_ID,
        wallet,
      );
      return contract;
    }
    return null;
  }, [wallet, isConnected, FUELNAUT_CONTRACT_ID]);

  console.log("CONTRACT:", contract)

  const isProdOrPreview =
    VERCEL_ENV === 'production' || VERCEL_ENV === 'preview';

  const testnetNetwork = 'https://beta-5.fuel.network/graphql';

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
