import { Button } from '@fuel-ui/react';
import { useConnectUI } from '@fuel-wallet/react';

export function ConnectWallet() {
  const { connect, isConnecting } = useConnectUI();
  return (
    <Button
      onClick={() => {
        connect();
      }}
    >
      {isConnecting ? 'Connecting' : 'Connect Your Wallet'}
    </Button>
  );
}
