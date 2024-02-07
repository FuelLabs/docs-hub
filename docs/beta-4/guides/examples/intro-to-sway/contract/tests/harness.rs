// ANCHOR: rs_import
use fuels::{prelude::*, types::{Identity, SizedAsciiString}};
// ANCHOR_END: rs_import

// ANCHOR: rs_abi
// Load abi from json
abigen!(Contract(name="SwayStore", abi="out/debug/contract-abi.json"));
// ANCHOR_END: rs_abi

// ANCHOR: rs_contract_instance_parent
async fn get_contract_instance() -> (SwayStore<WalletUnlocked>, ContractId, Vec<WalletUnlocked>) {
    // Launch a local network and deploy the contract
    let wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(3),             /* Three wallets */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await;

    let wallet = wallets.get(0).unwrap().clone();
    
    // ANCHOR: rs_contract_instance_config
    let id = Contract::load_from(
        "./out/debug/contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxParameters::default())
    .await
    .unwrap();
    // ANCHOR_END: rs_contract_instance_config

    let instance = SwayStore::new(id.clone(), wallet);

    (instance, id.into(), wallets)
}
// ANCHOR_END: rs_contract_instance_parent

// ANCHOR: rs_test_set_owner
#[tokio::test]
async fn can_set_owner() {
    let (instance, _id, wallets) = get_contract_instance().await;

    // get access to a test wallet
    let wallet_1 = wallets.get(0).unwrap();

    // initialize wallet_1 as the owner
    let owner_result = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .initialize_owner()
        .call()
        .await
        .unwrap();

    // make sure the returned identity matches wallet_1
    assert!(Identity::Address(wallet_1.address().into()) == owner_result.value);
}
// ANCHOR_END: rs_test_set_owner

// ANCHOR: rs_test_set_owner_once
#[tokio::test]
#[should_panic]
async fn can_set_owner_only_once() {
    let (instance, _id, wallets) = get_contract_instance().await;

    // get access to some test wallets
    let wallet_1 = wallets.get(0).unwrap();
    let wallet_2 = wallets.get(1).unwrap();

    // initialize wallet_1 as the owner
    let _owner_result = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .initialize_owner()
        .call()
        .await
        .unwrap();

    // this should fail
    // try to set the owner from wallet_2
    let _fail_owner_result = instance
        .with_account(wallet_2.clone())
        .unwrap()
        .methods()
        .initialize_owner()
        .call()
        .await
        .unwrap();
}
// ANCHOR_END: rs_test_set_owner_once

// ANCHOR: rs_test_list_and_buy_item
#[tokio::test]
async fn can_list_and_buy_item() {
    let (instance, _id, wallets) = get_contract_instance().await;
    // Now you have an instance of your contract you can use to test each function

    // get access to some test wallets
    let wallet_1 = wallets.get(0).unwrap();
    let wallet_2 = wallets.get(1).unwrap();

    // item 1 params
    let item_1_metadata: SizedAsciiString<20> = "metadata__url__here_"
        .try_into()
        .expect("Should have succeeded");
    let item_1_price: u64 = 15;

    // list item 1 from wallet_1
    let _item_1_result = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .list_item(item_1_price, item_1_metadata)
        .call()
        .await
        .unwrap();

    // call params to send the project price in the buy_item fn
    let call_params = CallParameters::default().with_amount(item_1_price);

    // buy item 1 from wallet_2
    let _item_1_purchase = instance
        .with_account(wallet_2.clone())
        .unwrap()
        .methods()
        .buy_item(1)
        .append_variable_outputs(1)
        .call_params(call_params)
        .unwrap()
        .call()
        .await
        .unwrap();

    // check the balances of wallet_1 and wallet_2
    let balance_1: u64 = wallet_1.get_asset_balance(&BASE_ASSET_ID).await.unwrap();
    let balance_2: u64 = wallet_2.get_asset_balance(&BASE_ASSET_ID).await.unwrap();

    // make sure the price was transferred from wallet_2 to wallet_1
    assert!(balance_1 == 1000000015);
    assert!(balance_2 == 999999985);

    let item_1 = instance.methods().get_item(1).call().await.unwrap();

    assert!(item_1.value.price == item_1_price);
    assert!(item_1.value.id == 1);
    assert!(item_1.value.total_bought == 1);
}
// ANCHOR_END: rs_test_list_and_buy_item

// ANCHOR: rs_test_withdraw_funds
#[tokio::test]
async fn can_withdraw_funds() {
    let (instance, _id, wallets) = get_contract_instance().await;
    // Now you have an instance of your contract you can use to test each function

    // get access to some test wallets
    let wallet_1 = wallets.get(0).unwrap();
    let wallet_2 = wallets.get(1).unwrap();
    let wallet_3 = wallets.get(2).unwrap();

    // initialize wallet_1 as the owner
    let owner_result = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .initialize_owner()
        .call()
        .await
        .unwrap();

    // make sure the returned identity matches wallet_1
    assert!(Identity::Address(wallet_1.address().into()) == owner_result.value);

    // item 1 params
    let item_1_metadata: SizedAsciiString<20> = "metadata__url__here_"
        .try_into()
        .expect("Should have succeeded");
    let item_1_price: u64 = 150_000_000;

    // list item 1 from wallet_2
    let item_1_result = instance
        .with_account(wallet_2.clone())
        .unwrap()
        .methods()
        .list_item(item_1_price, item_1_metadata)
        .call()
        .await;
    assert!(item_1_result.is_ok());

    // make sure the item count increased
    let count = instance
        .methods()
        .get_count()
        .simulate()
        .await
        .unwrap();
    assert_eq!(count.value, 1);

    // call params to send the project price in the buy_item fn
    let call_params = CallParameters::default().with_amount(item_1_price);
    
    // buy item 1 from wallet_3
    let item_1_purchase = instance
        .with_account(wallet_3.clone())
        .unwrap()
        .methods()
        .buy_item(1)
        .append_variable_outputs(1)
        .call_params(call_params)
        .unwrap()
        .call()
        .await;
    assert!(item_1_purchase.is_ok());

     // make sure the item's total_bought count increased
     let listed_item = instance
     .methods()
     .get_item(1)
     .simulate()
     .await
     .unwrap();
 assert_eq!(listed_item.value.total_bought, 1);

    // withdraw the balance from the owner's wallet
    let withdraw = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .withdraw_funds()
        .append_variable_outputs(1)
        .call()
        .await;
    assert!(withdraw.is_ok());

    // check the balances of wallet_1 and wallet_2
    let balance_1: u64 = wallet_1.get_asset_balance(&BASE_ASSET_ID).await.unwrap();
    let balance_2: u64 = wallet_2.get_asset_balance(&BASE_ASSET_ID).await.unwrap();
    let balance_3: u64 = wallet_3.get_asset_balance(&BASE_ASSET_ID).await.unwrap();

    // println!("BALANCE 1: {:?}", balance_1);
    assert!(balance_1 == 1007500000);
    // println!("BALANCE 2: {:?}", balance_2);
    assert!(balance_2 == 1142500000);
    // println!("BALANCE 3: {:?}", balance_3);
    assert!(balance_3 == 850000000);
}
// ANCHOR_END: rs_test_withdraw_funds
