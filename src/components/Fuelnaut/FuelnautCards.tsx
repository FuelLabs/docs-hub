import { Box, Button } from '@fuel-ui/react';
import { FUELNAUT_CONTRACT_ID } from '~/src/config/fuelnautLevels';
import { FuelnautAbi__factory } from '~/src/fuelnaut-api';
import { useMemo } from 'react';
import { useConnectUI, useIsConnected, useWallet } from '@fuels/react';
import ShowFuelnautLevels from './ShowFuelnautLevels';
// import Setup from './Setup';

export function FuelnautCards() {
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnectUI();
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (wallet && isConnected && FUELNAUT_CONTRACT_ID) {
      const contract = FuelnautAbi__factory.connect(
        FUELNAUT_CONTRACT_ID,
        wallet
      );
      return contract;
    }
    return null;
  }, [wallet, isConnected, FUELNAUT_CONTRACT_ID]);

  return (
    <Box.Flex>
      {wallet && isConnected && contract ? (
        <div>
          {/* <Setup contract={contract} wallet={wallet} /> */}
          <ShowFuelnautLevels contract={contract} />
        </div>
      ) : (
        <div>
          <Button
            onClick={() => {
              connect();
            }}
          >
            {isConnecting ? 'Connecting' : 'Connect Your Wallet'}
          </Button>
        </div>
      )}
    </Box.Flex>
  );
}
