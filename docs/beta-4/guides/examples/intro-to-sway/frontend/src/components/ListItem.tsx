/* ANCHOR: fe_list_items_all */
// ANCHOR: fe_list_items_import
import { useState } from "react";
import { ContractAbi } from "../contracts";
import { bn } from "fuels";
// ANCHOR_END: fe_list_items_import

// ANCHOR: fe_list_items_interface
interface ListItemsProps {
  contract: ContractAbi | null;
}
// ANCHOR_END: fe_list_items_interface

// ANCHOR: fe_list_items_function
export default function ListItem({contract}: ListItemsProps){
// ANCHOR_END: fe_list_items_function
    // ANCHOR: fe_list_items_state_variables
    const [metadata, setMetadata] = useState<string>("");
    const [price, setPrice] = useState<string>("0");
    const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');
    // ANCHOR_END: fe_list_items_state_variables
    // ANCHOR: fe_list_items_handle_submit
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setStatus('loading')
        if(contract !== null){
            try {
                const priceInput = bn.parseUnits(price.toString());
                await contract.functions.list_item(priceInput, metadata).call();
                setStatus('success')
            } catch (e) {
                console.log("ERROR:", e);
                setStatus('error')
            }
        } else {
            console.log("ERROR: Contract is null");
        }
    }
    // ANCHOR_END: fe_list_items_handle_submit
    // ANCHOR: fe_list_items_form
    return (
        <div>
            <h2>List an Item</h2>
            {status === 'none' &&
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="metadata">Item Metadata:</label>
                    <input 
                        id="metadata" 
                        type="text" 
                        pattern="\w{20}" 
                        title="The metatdata must be 20 characters"
                        required 
                        onChange={(e) => setMetadata(e.target.value)}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="price">Item Price:</label>
                    <input
                        id="price"
                        type="number"
                        required
                        min="0"
                        step="any"
                        inputMode="decimal"
                        placeholder="0.00"
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                      />
                </div>

                <div className="form-control">
                    <button type="submit">List item</button>
                </div>
            </form>
            }

            {status === 'success' && <div>Item successfully listed!</div>}
            {status === 'error' && <div>Error listing item. Please try again.</div>}
            {status === 'loading' && <div>Listing item...</div>}
            
        </div>
    )
}
// ANCHOR_END: fe_list_items_form
/* ANCHOR_END: fe_list_items_all */
