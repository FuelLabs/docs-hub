import { Box, Spinner } from '@fuel-ui/react';
import { useIsConnected, useNetwork, useWallet } from '@fuel-wallet/react';
import { useMemo } from 'react';
import { FUELNAUT_CONTRACT_ID } from '~/src/config/fuelnautLevels';
import { FuelnautAbi__factory } from '~/src/fuelnaut-api';
import { ConnectWallet } from '../ConnectWallet';
// import Setup from './Setup';
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
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

  const testnetNetwork = 'https://beta-5.fuel.network/graphql';

  return (
    <Box.Flex>
      {isConnected ? (
        <div>
          {contract && wallet ? (
            <>
              {/* <Setup contract={contract} wallet={wallet} /> */}
              <ShowFuelnautLevels contract={contract} />
            </>
          ) : (
            <>
              {isProdOrPreview && network!.url === testnetNetwork ? (
                <>
                  Loading contract...
                  <Spinner />
                </>
              ) : (
                <>
                  Change to the testnet network in your wallet to interact with
                  the Fuelnaut contract.
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
