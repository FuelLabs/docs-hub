/* ANCHOR: fe_all_items_all */
// ANCHOR: fe_all_items_template
import { useState, useEffect } from "react";
import { ContractAbi } from "../contracts";
import { ItemOutput } from "../contracts/ContractAbi";
import ItemCard from "./ItemCard";
import { BN } from 'fuels';

interface AllItemsProps {
  contract: ContractAbi | null;
}

export default function AllItems({ contract }: AllItemsProps) {
  // ANCHOR_END: fe_all_items_template
  // ANCHOR: fe_all_items_state_variables
  const [items, setItems] = useState<ItemOutput[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [status, setStatus] = useState<'success' | 'loading' | 'error'>('loading');
  // ANCHOR_END: fe_all_items_state_variables
  // ANCHOR: fe_all_items_use_effect
  useEffect(() => {
    async function getAllItems() {
      if (contract !== null) {
        try {
          let { value } = await contract.functions.get_count().simulate();
          let formattedValue = new BN(value).toNumber()
          setItemCount(formattedValue);
          let max = formattedValue + 1;
          let tempItems = [];
          for(let i=1; i < max; i++){
            let resp = await contract.functions.get_item(i).simulate();
            tempItems.push(resp.value)
          }
          setItems(tempItems)
          setStatus('success')
        } catch (e) {
          setStatus('error')
          console.log("ERROR:", e);
        }
      }
    }
    getAllItems();
  }, [contract]);
  // ANCHOR_END: fe_all_items_use_effect
  // ANCHOR: fe_all_items_cards
  return (
    <div>
      <h2>All Items</h2>
      {status === 'success' &&
        <div>
          {itemCount === 0 ? (
            <div>Uh oh! No items have been listed yet</div>
          ) : (
            <div>
              <div>Total items: {itemCount}</div>
              <div className="items-container">
                  {items.map((item) => (
                  <ItemCard key={item.id.format()} contract={contract} item={item}/>
              ))}
              </div>
          </div>
          )}
        </div>
      }
      {status === 'error' && <div>Something went wrong, try reloading the page.</div>}
      {status === 'loading' && <div>Loading...</div>}
    </div>
  );
}
// ANCHOR_END: fe_all_items_cards
/* ANCHOR_END: fe_all_items_all */
