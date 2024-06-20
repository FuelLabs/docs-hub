import { Box, Button, Spinner, toast } from '@fuel-ui/react';
import { useIsConnected, useWallet } from '@fuels/react';
import { Wallet } from 'fuels';
import type { BytesLike, JsonAbi } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { FUELNAUT_CONTRACT_ID } from '~/src/config/fuelnautLevels';
import type { IFuelnautLevel } from '~/src/config/fuelnautLevels';
import { FuelnautAbi__factory } from '~/src/fuelnaut-api';
import type { AddressInput } from '~/src/fuelnaut-api/contracts/FuelnautAbi';
import { getLevelContractFactory } from '~/src/lib/fuelnaut/factories';
import { getNewInstance } from '~/src/lib/fuelnaut/instance';
import { ConnectWallet } from '../ConnectWallet';

interface FuelnautLevelProps {
  children: React.ReactNode;
  level: IFuelnautLevel;
  description: string;
  bytecode: string;
  abiJSON: JsonAbi;
}

export function FuelnautLevel({
  children,
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
    if (wallet) {
      thisWindow.player = wallet;
      thisWindow.baseAssetId = wallet.provider.getBaseAssetId();
      thisWindow.getBalance = (address: string, assetId: string) => {
        const thisWallet = Wallet.fromAddress(address, wallet?.provider);
        return thisWallet.getBalance(assetId);
      };
      thisWindow.getBalances = (address: string) => {
        const thisWallet = Wallet.fromAddress(address, wallet?.provider);
        return thisWallet.getBalances();
      };
      thisWindow.getContractBalance = (
        contractId: string,
        assetId: BytesLike,
      ) => {
        return wallet?.provider.getContractBalance(contractId, assetId);
      };
      thisWindow.getBlockNumber = () => {
        return wallet?.provider.getBlockNumber();
      };
      thisWindow.getNetwork = () => {
        return wallet?.provider.url;
      };
      thisWindow.help = () => {
        console.table({
          player: "the current player's wallet",
          instance: "the current level's contract instance, if deployed",
          baseAssetId: 'the base asset id (ETH)',
          'getBalance(address, assetId)':
            'gets the balance of a given assetId for an address',
          'getBalances(address)':
            'gets the balances of all assets for a given address',
          'getContractBalance(contractId, assetId)':
            'gets the balance of a given assetId for a contract',
          'getBlockNumber()': 'gets the current block number',
          'getNetwork()':
            'gets the current network provider for the connected wallet',
        });
      };
    } else {
      thisWindow.help = () =>
        console.log('Connect your wallet to see the full list of options.');
    }
    const fetchInstance = async () => {
      if (contract && wallet) {
        try {
          const address: AddressInput = { bits: wallet?.address.toB256() };
          const response = await contract.functions
            .get_instance_contract(address, level.index)
            .get();
          if (response.value) {
            const thisInstanceId = response.value[0].bits;
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
        const addressInput: AddressInput = { bits: address! };
        await contract.functions
          .complete_instance(addressInput, level.index)
          .call();
        setIsCompleted(true);
        toast.success('Challenge completed!');
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
      {children && children}
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
              {isLoading ? (
                <Spinner />
              ) : (
                <Button onClick={handleCheckIfCompleted}>
                  Check If Completed
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {wallet && isConnected ? (
            <>
              {isLoading ? (
                <Spinner />
              ) : (
                <Button onClick={handleNewInstance}>Deploy New Instance</Button>
              )}
            </>
          ) : (
            <ConnectWallet />
          )}
        </>
      )}
    </Box>
  );
}
