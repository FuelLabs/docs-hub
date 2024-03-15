import { Box, Button } from '@fuel-ui/react';
import { BaseAssetId } from 'fuels';
import type { JsonAbi } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { FUELNAUT_CONTRACT_ID } from '~/src/config/fuelnautLevels';
import { FuelnautAbi__factory } from '~/src/fuelnaut-api';
import type { AddressInput } from '~/src/fuelnaut-api/contracts/FuelnautAbi';
import { getLevelContractFactory } from '~/src/lib/fuelnaut/factories';
import type { FuelnautLevel } from '~/src/config/fuelnautLevels';
import { getNewInstance } from '~/src/lib/fuelnaut/instance';
import { useWallet, useIsConnected } from '@fuel-wallet/react';
import { ConnectWallet } from '../ConnectWallet';

interface FuelnautLevelProps {
  level: FuelnautLevel;
  description: string;
  bytecode: string;
  abiJSON: JsonAbi;
}

export function FuelnautLevel({
  level,
  description,
  bytecode,
  abiJSON,
}: FuelnautLevelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [instance, setInstance] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { wallet } = useWallet();
  const { isConnected } = useIsConnected();

  const contract = useMemo(() => {
    if (wallet) {
      const contract = FuelnautAbi__factory.connect(
        FUELNAUT_CONTRACT_ID,
        wallet
      );
      return contract;
    }
    return null;
  }, [wallet]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thisWindow = window as any;
    thisWindow.baseAssetId = BaseAssetId;
    thisWindow.player = wallet;
    const fetchInstance = async () => {
      if (contract && wallet) {
        try {
          const address: AddressInput = { value: wallet?.address.toB256() };
          const response = await contract.functions
            .get_instance_contract(address, level.index)
            .txParams({ gasPrice: 1, gasLimit: 800_000 })
            .simulate();
          if (response.value) {
            const thisInstanceId = response.value[0].value;
            const thisFactory = getLevelContractFactory(level.key);
            const thisInstance = thisFactory.connect(thisInstanceId, wallet);
            setInstance(thisInstance);
            setIsCompleted(response.value[1]);
            thisWindow.instance = thisInstance;
          }
        } catch (error) {
          // console.error("Error fetching instance:", error);
        }
      }
    };
    fetchInstance();
  }, [wallet, contract]);

  const handleNewInstance = async () => {
    try {
      if (wallet && contract) {
        const newInstance = await getNewInstance(
          level,
          contract,
          wallet,
          bytecode,
          abiJSON
        );

        setInstance(newInstance);
      } else {
        alert('Wallet not connected or contract not found.');
      }
    } catch (error) {
      console.error('Error deploying new instance:', error);
    }
  };

  const handleCheckIfCompleted = async () => {
    if (contract && wallet) {
      try {
        const address = wallet?.address.toB256();
        const addressInput: AddressInput = { value: address! };
        await contract.functions
          .complete_instance(addressInput, level.index)
          .txParams({ gasPrice: 1, gasLimit: 800_000 })
          .call();
        setIsCompleted(true);
      } catch (error) {
        alert('You have not yet completed this challenge.');
      }
    } else {
      alert('You are not connected');
    }
  };

  return (
    <Box>
      <p>{description}</p>
      {instance ? (
        <>
          {isCompleted ? (
            <div>You completed this challenge!</div>
          ) : (
            <div>
              <p>
                Type <code>instance</code> into the browser console to see more
                details.
              </p>
              <p>
                Click the button below to check if you successfully completed
                the challenge.
              </p>
              <Button onClick={handleCheckIfCompleted}>
                Check If Completed
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
        {wallet && isConnected ? (
            <Button onClick={handleNewInstance}>Deploy New Instance</Button>
        ) : (
            <ConnectWallet />
        )}
        </>
        
      )}
    </Box>
  );
}
