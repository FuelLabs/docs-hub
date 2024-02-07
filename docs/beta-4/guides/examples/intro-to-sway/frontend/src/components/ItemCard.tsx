/* ANCHOR: fe_item_card_all */
// ANCHOR: fe_item_card_template
import { useState } from "react";
import { ItemOutput } from "../contracts/ContractAbi";
import { ContractAbi } from "../contracts";
import { BN } from 'fuels';

interface ItemCardProps {
  contract: ContractAbi | null;
  item: ItemOutput;
}

const assetId = "0x0000000000000000000000000000000000000000000000000000000000000000"

export default function ItemCard({ item, contract }: ItemCardProps) {
  // ANCHOR_END: fe_item_card_template
  // ANCHOR: fe_item_card_status
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');
  // ANCHOR_END: fe_item_card_status
  // ANCHOR: fe_item_card_buy_item
  async function handleBuyItem() {
    if (contract !== null) {
      setStatus('loading')
      try {
        await contract.functions.buy_item(item.id)
        .txParams({ variableOutputs: 1 })
        .callParams({
            forward: [item.price, assetId],
          })
        .call()
        setStatus("success");
      } catch (e) {
        console.log("ERROR:", e);
      }
    }
  }
  // ANCHOR_END: fe_item_card_buy_item
  // ANCHOR: fe_item_cards
  return (
    <div className="item-card">
      <div>Id: {new BN(item.id).toNumber()}</div>
      <div>Metadata: {item.metadata}</div>
      <div>Price: {new BN(item.price).formatUnits()} ETH</div>
      <h3>Total Bought: {new BN(item.total_bought).toNumber()}</h3>
      {status === 'success' && <div>Purchased ✅</div>}
      {status === 'error' && <div>Something went wrong ❌</div>}
      {status === 'none' &&  <button data-testid={`buy-button-${item.id}`} onClick={handleBuyItem}>Buy Item</button>}
      {status === 'loading' && <div>Buying item..</div>}
    </div>
  );
}
// ANCHOR_END: fe_item_cards
/* ANCHOR_END: fe_item_card_all */
