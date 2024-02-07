/* ANCHOR: fe_app_all */
// ANCHOR: fe_app_template
import { useState, useMemo } from "react";
// ANCHOR: fe_import_hooks
import { useFuel, useIsConnected, useAccount, useWallet } from '@fuel-wallet/react';
// ANCHOR_END: fe_import_hooks
import { ContractAbi__factory } from "./contracts"
import AllItems from "./components/AllItems";
import ListItem from "./components/ListItem";
import "./App.css";

// ANCHOR: fe_contract_id
const CONTRACT_ID = "0x1f5f2d8b03c1f8d111fe1b3790bacd78255e91d30026f0bbc9f588c9bb6a056b"
// ANCHOR_END: fe_contract_id

function App() {
// ANCHOR_END: fe_app_template
  // ANCHOR: fe_state_active
  const [active, setActive] = useState<'all-items' | 'list-item'>('all-items');
  // ANCHOR_END: fe_state_active
  // ANCHOR: fe_call_hooks
  const { isConnected } = useIsConnected();
  const { fuel } = useFuel();
  const { account } = useAccount();
  // ANCHOR: fe_wallet
  const { wallet } = useWallet({ address: account });
  // ANCHOR_END: fe_wallet
  // ANCHOR_END: fe_call_hooks
  
  // ANCHOR: fe_use_memo
  const contract = useMemo(() => {
    if (wallet) {
      const contract = ContractAbi__factory.connect(CONTRACT_ID, wallet);
      return contract;
    }
    return null;
  }, [wallet]);
  // ANCHOR_END: fe_use_memo

  return (
    <div className="App">
      <header>
        <h1>Sway Marketplace</h1>
      </header>
      {/* // ANCHOR: fe_ui_state_active */}
      <nav>
        <ul>
          <li 
          className={active === 'all-items' ? "active-tab" : ""} 
          onClick={() => setActive('all-items')}
          >
            See All Items
          </li>
          <li 
          className={active === 'list-item' ? "active-tab" : ""} 
          onClick={() => setActive('list-item')}
          >
            List an Item
          </li>
        </ul>
      </nav>
      {/* // ANCHOR: fe_ui_state_active */}
      {/* // ANCHOR: fe_fuel_obj */}
      {fuel ? (
        <div>
          { isConnected ? (
            <div>
              {active === 'all-items' && <AllItems contract={contract} />}
              {active === 'list-item' && <ListItem contract={contract} />}
              </div>
          ) : (
            <div>
              <button onClick={() => fuel?.connect()}>
                Connect Wallet
              </button>
          </div>
          )}
        </div>
      ) : (
        <div>
          Download the{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://wallet.fuel.network/"
          >
            Fuel Wallet
          </a>{" "}
          to use the app.
        </div>
      )}
      {/* // ANCHOR_END: fe_fuel_obj */}
    </div>
  );
}

export default App;
/* ANCHOR_END: fe_app_all */
