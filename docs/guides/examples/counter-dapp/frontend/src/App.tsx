import { useEffect, useState } from "react";
import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet
} from '@fuels/react';
// Import the contract factory -- you can find the name in src/contracts/contracts/index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { CounterContractAbi__factory  } from "./sway-api"
import type { CounterContractAbi } from "./sway-api";
import { BaseAssetId } from "fuels";

const CONTRACT_ID = 
  "0x...";

export default function Home() {
  const [contract, setContract] = useState<CounterContractAbi>();
  const [counter, setCounter] = useState<number>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const { balance } = useBalance({
    address: wallet?.address.toAddress(),
    assetId: BaseAssetId,
  });

  useEffect(() => {
    async function getInitialCount(){
      if(isConnected && wallet){
        const counterContract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
        await getCount(counterContract);
        setContract(counterContract);
      }
    }
    
    getInitialCount();
  }, [isConnected, wallet]);

  const getCount = async (counterContract: CounterContractAbi) => {
    try{
      const { value } = await counterContract.functions
      .count()
      .txParams({
        gasPrice: 1,
        gasLimit: 100_000,
      })
      .get();
      setCounter(value.toNumber());
    } catch(error) {
      console.error(error);
    }
  }

  const onIncrementPressed = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      await contract.functions
      .increment()
      .txParams({
        gasPrice: 1,
        gasLimit: 100_000,
      })
      .call();
      await getCount(contract);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {isConnected ? (
          <>
            <h3 style={styles.label}>Counter</h3>
            <div style={styles.counter}>
              {counter ?? 0}
            </div>

            {balance && balance.toNumber() === 0 ? (
              <p>Get testnet funds from the <a target="_blank" rel="noopener noreferrer"  href={`https://faucet-testnet.fuel.network/?address=${wallet?.address.toAddress()}`}>Fuel Faucet</a> to increment the counter.</p>
          ) : 
          (
            <button
            onClick={onIncrementPressed}
            style={styles.button}
            >
              Increment Counter
            </button>
          )
          }
            
          <p>Your Fuel Wallet address is:</p>
          <p>{wallet?.address.toAddress()}</p>
          </>
        ) : (
          <button
          onClick={() => {
            connect();
          }}
          style={styles.button}
          >
            {isConnecting ? 'Connecting' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: "black",
  } as React.CSSProperties,
  container: {
    color: "#ffffffec",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  label: {
    fontSize: "28px",
  },
  counter: {
    color: "#a0a0a0",
    fontSize: "48px",
  },
  button: {
    borderRadius: "8px",
    margin: "24px 0px",
    backgroundColor: "#707070",
    fontSize: "16px",
    color: "#ffffffec",
    border: "none",
    outline: "none",
    height: "60px",
    padding: "0 1rem",
    cursor: "pointer"
  },
}