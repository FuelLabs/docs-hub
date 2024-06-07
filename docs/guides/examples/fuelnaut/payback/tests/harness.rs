use fuels::{prelude::*, types::ContractId};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/payback-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId, Vec<WalletUnlocked>) {
    // Launch a local network and deploy the contract
    let asset_base = AssetConfig {
        id: Default::default(),
        num_coins: 1,
        coin_amount: 1_000_000_000,
    };
     
    let asset_id_1 = AssetId::from([2; 32]);
    let asset_1 = AssetConfig {
        id: asset_id_1,
        num_coins: 1,
        coin_amount: 2_000_000_000,
    };
     
    let assets = vec![asset_base, asset_1];
    let num_wallets = 3;
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new_multiple_assets(num_wallets, assets),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./out/debug/payback.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MyContract::new(id.clone(), wallet);

    (instance, id.into(), wallets)
}

#[tokio::test]
async fn can_attack() {
    let (instance, _id, wallets) = get_contract_instance().await;
    let wallet_1 = wallets[0].clone();

    let mut balances = wallet_1.get_balances().await.unwrap();
    println!("balances start: {:?}", balances);
    let asset_id_1 = AssetId::from([2; 32]);

    let call_params = CallParameters::default().with_amount(1_000);
    let tx_policies = TxPolicies::default();

    // instance
    // .with_account(wallet_1.clone())
    // .methods()
    // .send_funds()
    // .with_tx_policies(tx_policies.clone()) 
    // .call_params(call_params.clone())
    // .unwrap()
    // .call()
    // .await
    // .unwrap();

    // balances = wallet_1.get_balances().await.unwrap();
    // println!("balances middle: {:?}", balances);

    // let call_params_2 = CallParameters::with_asset_id(CallParameters::default(), asset_id_1).with_amount(600);

    // instance
    // .with_account(wallet_1.clone())
    // .methods()
    // .pay_back()
    // .with_tx_policies(tx_policies.clone()) 
    // .call_params(call_params_2)
    // .unwrap()
    // .append_variable_outputs(1)
    // .call()
    // .await
    // .unwrap();

    // balances = wallet_1.get_balances().await.unwrap();
    // println!("balances end: {:?}", balances);

    // let success = instance
    // .with_account(wallet_1.clone())
    // .methods()
    // .attack_success()
    // .call()
    // .await
    // .unwrap();

    // println!("success: {:?}", success.value);
    // assert_eq!(success.value, true);
}
