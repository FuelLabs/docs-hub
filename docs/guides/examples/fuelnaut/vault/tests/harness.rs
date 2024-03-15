use fuels::{
    prelude::*,
    types::{Bits256, ContractId},
};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/vault-abi.json"
));

fn get_password() -> Bits256 {
    let hex_str = "0101010101010101010101010101010101010101010101010101010101010101";
    Bits256::from_hex_str(hex_str).unwrap()
}

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

    let password = get_password();

    let configurables = MyContractConfigurables::new().with_PASSWORD(password);

    let id = Contract::load_from(
        "./out/debug/vault.bin",
        LoadConfiguration::default().with_configurables(configurables),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MyContract::new(id.clone(), wallet);

    (instance, id.into())
}

#[tokio::test]
async fn can_get_contract_id() {
    let (instance, _id) = get_contract_instance().await;

    let password = get_password();

    instance.methods().unlock(password).call().await.unwrap();

    let response = instance.methods().attack_success().call().await.unwrap();

    assert_eq!(response.value, true);
}
