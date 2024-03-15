use fuels::{prelude::*, types::ContractId};

// Load abi from json
abigen!(
    Contract(name = "MyContract", abi = "out/debug/fuelnaut-abi.json"),
    Contract(
        name = "PaybackContract",
        abi = "../payback/out/debug/payback-abi.json"
    )
);

async fn get_contract_instance() -> (
    MyContract<WalletUnlocked>,
    ContractId,
    PaybackContract<WalletUnlocked>,
    ContractId,
) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from("./out/debug/fuelnaut.bin", LoadConfiguration::default())
        .unwrap()
        .deploy(&wallet, TxPolicies::default())
        .await
        .unwrap();

    let instance = MyContract::new(id.clone(), wallet.clone());

    let payback_id = Contract::load_from(
        "../payback/out/debug/payback.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let payback_instance = PaybackContract::new(payback_id.clone(), wallet);

    (instance, id.into(), payback_instance, payback_id.into())
}

#[tokio::test]
async fn can_play_game() {
    let (instance, _id, payback_instance, payback_id) = get_contract_instance().await;

    // SET CONTRACT OWNER
    instance
        .methods()
        .my_constructor()
        .call()
        .await
        .unwrap();

    let response = instance
        .methods()
        .get_bytecode_root(payback_id)
        .with_contracts(&[&payback_instance])
        .call()
        .await
        .unwrap();

    let root = response.value;
    println!("root: {:?}", root);

    let response_2 = instance
        .methods()
        .register_level(root)
        .call()
        .await
        .unwrap();

    println!("response_2: {:?}", response_2.value);

    let response_3 = instance
        .methods()
        .get_level(0)
        .call()
        .await
        .unwrap();

    println!("response_3: {:?}", response_3.value);

    assert_eq!(response_3.value, root);


}
