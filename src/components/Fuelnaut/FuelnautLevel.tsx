import { Box, Button, Spinner, toast } from '@fuel-ui/react';
import { useIsConnected, useWallet } from '@fuel-wallet/react';
import { BaseAssetId } from 'fuels';
import type { JsonAbi } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { set } from 'react-hook-form';
import { FUELNAUT_CONTRACT_ID } from '~/src/config/fuelnautLevels';
import type { IFuelnautLevel } from '~/src/config/fuelnautLevels';
import { FuelnautAbi__factory } from '~/src/fuelnaut-api';
import type { AddressInput } from '~/src/fuelnaut-api/contracts/FuelnautAbi';
import { getLevelContractFactory } from '~/src/lib/fuelnaut/factories';
import { getNewInstance } from '~/src/lib/fuelnaut/instance';
import { ConnectWallet } from '../ConnectWallet';

interface FuelnautLevelProps {
  level: IFuelnautLevel;
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
  // biome-ignore lint/suspicious/noExplicitAny:
  const [instance, setInstance] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { wallet } = useWallet();
  const { isConnected } = useIsConnected();

  const contract = useMemo(() => {
    if (wallet) {
      const contract = FuelnautAbi__factory.connect(
        FUELNAUT_CONTRACT_ID,
        wallet,
      );
      return contract;
    }
    return null;
  }, [wallet]);

  useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny:
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
    setIsLoading(true);
    try {
      if (wallet && contract) {
        const newInstance = await getNewInstance(
          level,
          contract,
          wallet,
          bytecode,
          abiJSON,
        );

        setInstance(newInstance);
        toast.success('New instance created.');
      } else {
        toast.error('Wallet or contract not found.');
      }
    } catch (error) {
      toast.error('Oops! Something went wrong.');
      console.error('Error deploying new instance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIfCompleted = async () => {
    setIsLoading(true);
    try {
    if (contract && wallet) {
        const address = wallet?.address.toB256();
        const addressInput: AddressInput = { value: address! };
        await contract.functions
          .complete_instance(addressInput, level.index)
          .txParams({ gasPrice: 1, gasLimit: 800_000 })
          .call();
        setIsCompleted(true);
        toast.success("Challenge completed!")
      } else {
        toast.error('You are not connected');
      }
    } catch (error) {
      toast.error('You have not yet completed this challenge.');
      } finally {
        setIsLoading(false);
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
              {isLoading ? <Spinner /> : <Button onClick={handleCheckIfCompleted}>
                Check If Completed
              </Button>
              }
            </div>
          )}
        </>
      ) : (
        <>
          {wallet && isConnected ? (
            <>
            {isLoading ? <Spinner /> : 
            <Button onClick={handleNewInstance}>Deploy New Instance</Button>
            }
            </>
          ) : (
            <ConnectWallet />
          )}
        </>
      )}
    </Box>
  );
}
