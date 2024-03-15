use fuels::{prelude::*, types::ContractId};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/coin-flip-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId) {
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

    let id = Contract::load_from("./out/debug/coin-flip.bin", LoadConfiguration::default())
        .unwrap()
        .deploy(&wallet, TxPolicies::default())
        .await
        .unwrap();

    let instance = MyContract::new(id.clone(), wallet);

    (instance, id.into())
}

#[tokio::test]
async fn can_play() {
    let (instance, _id) = get_contract_instance().await;

    let mut count = 0;

    while count < 10 {
        let mut guess = false;
        let response = instance
            .methods()
            .coin_flip(guess)
            .simulate()
            .await
            .unwrap();

        let logs = response.decode_logs();
        if response.value == false {
            guess = true;
        }

        let call_response = instance.methods().coin_flip(guess).call().await.unwrap();

        if call_response.value == true {
            count += 1;
        }
    }

    let attack_response = instance
        .methods()
        .attack_success()
        .simulate()
        .await
        .unwrap();

    assert_eq!(attack_response.value, true);
}
