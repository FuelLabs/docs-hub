# Running scripts

You can run a script using its JSON-ABI and the path to its binary file. You can run the scripts with arguments. For this, you have to use the `abigen!` macro seen [previously](./abigen/the-abigen-macro.md).

```rust,ignore
use std::time::Duration;

use fuel_tx::Output;
use fuels::{
    client::{PageDirection, PaginationRequest},
    core::{
        codec::{DecoderConfig, EncoderConfig},
        traits::Tokenizable,
        Configurables,
    },
    prelude::*,
    programs::{executable::Executable, DEFAULT_MAX_FEE_ESTIMATION_TOLERANCE},
    types::{Bits256, Identity},
};

#[tokio::test]
async fn main_function_arguments() -> Result<()> {
    // ANCHOR: script_with_arguments
    // The abigen is used for the same purpose as with contracts (Rust bindings)
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/arguments/out/release/arguments-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/scripts/arguments/out/release/arguments.bin";
    let script_instance = MyScript::new(wallet, bin_path);

    let bim = Bimbam { val: 90 };
    let bam = SugarySnack {
        twix: 100,
        mars: 1000,
    };

    let result = script_instance.main(bim, bam).call().await?;

    let expected = Bimbam { val: 2190 };
    assert_eq!(result.value, expected);
    // ANCHOR_END: script_with_arguments
    Ok(())
}

#[tokio::test]
async fn script_call_has_same_estimated_and_used_gas() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let tolerance = Some(0.0);
    let block_horizon = Some(1);

    let a = 4u64;
    let b = 2u32;
    let estimated_gas_used = script_instance
        .main(a, b)
        .estimate_transaction_cost(tolerance, block_horizon)
        .await?
        .gas_used;

    let gas_used = script_instance.main(a, b).call().await?.gas_used;

    assert_eq!(estimated_gas_used, gas_used);

    Ok(())
}

#[tokio::test]
async fn test_basic_script_with_tx_policies() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "bimbam_script",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "bimbam_script",
            wallet = "wallet"
        )
    );

    let a = 1000u64;
    let b = 2000u32;
    let result = script_instance.main(a, b).call().await?;
    assert_eq!(result.value, "hello");

    // ANCHOR: script_with_tx_policies
    let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
    let result = script_instance
        .main(a, b)
        .with_tx_policies(tx_policies)
        .call()
        .await?;
    // ANCHOR_END: script_with_tx_policies
    assert_eq!(result.value, "hello");

    Ok(())
}

#[tokio::test]
async fn test_output_variable_estimation() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "transfer_script",
            project = "e2e/sway/scripts/transfer_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "transfer_script",
            wallet = "wallet"
        )
    );

    let provider = wallet.try_provider()?.clone();
    let mut receiver = WalletUnlocked::new_random(None);
    receiver.set_provider(provider);

    let amount = 1000;
    let asset_id = AssetId::zeroed();
    let script_call = script_instance.main(
        amount,
        asset_id,
        Identity::Address(receiver.address().into()),
    );
    let inputs = wallet
        .get_asset_inputs_for_amount(asset_id, amount, None)
        .await?;
    let output = Output::change(wallet.address().into(), 0, asset_id);
    let _ = script_call
        .with_inputs(inputs)
        .with_outputs(vec![output])
        .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
        .call()
        .await?;

    let receiver_balance = receiver.get_asset_balance(&asset_id).await?;
    assert_eq!(receiver_balance, amount);

    Ok(())
}

#[tokio::test]
async fn test_script_struct() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_struct"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_struct = MyStruct {
        number: 42,
        boolean: true,
    };
    let response = script_instance.main(my_struct).call().await?;

    assert_eq!(response.value, 42);
    Ok(())
}

#[tokio::test]
async fn test_script_enum() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_enum"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_enum = MyEnum::Two;
    let response = script_instance.main(my_enum).call().await?;

    assert_eq!(response.value, 2);
    Ok(())
}

#[tokio::test]
async fn test_script_array() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_array"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_array: [u64; 4] = [1, 2, 3, 4];
    let response = script_instance.main(my_array).call().await?;

    assert_eq!(response.value, 10);
    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_on_script_call() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_needs_custom_decoder"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    {
        // Will fail if max_tokens too low
        script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 101,
                ..Default::default()
            })
            .call()
            .await
            .expect_err(
                "Should fail because return type has more tokens than what is allowed by default",
            );
    }
    {
        // When the token limit is bumped should pass
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?
            .value;

        assert_eq!(response, [0u8; 1000]);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_submit_and_response() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_struct"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_struct = MyStruct {
        number: 42,
        boolean: true,
    };

    // ANCHOR: submit_response_script
    let submitted_tx = script_instance.main(my_struct).submit().await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let value = submitted_tx.response().await?.value;
    // ANCHOR_END: submit_response_script

    assert_eq!(value, 42);
    Ok(())
}

#[tokio::test]
async fn test_script_transaction_builder() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );
    let provider = wallet.try_provider()?;

    // ANCHOR: script_call_tb
    let script_call_handler = script_instance.main(1, 2);

    let mut tb = script_call_handler.transaction_builder().await?;

    // customize the builder...

    wallet.adjust_for_fee(&mut tb, 0).await?;
    tb.add_signer(wallet.clone())?;

    let tx = tb.build(provider).await?;

    let tx_id = provider.send_transaction(tx).await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let tx_status = provider.tx_status(&tx_id).await?;

    let response = script_call_handler.get_response_from(tx_status)?;

    assert_eq!(response.value, "hello");
    // ANCHOR_END: script_call_tb

    Ok(())
}

#[tokio::test]
async fn script_encoder_config_is_applied() {
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/basic_script/out/release/basic_script-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await.expect("");
    let bin_path = "sway/scripts/basic_script/out/release/basic_script.bin";

    let script_instance_without_encoder_config = MyScript::new(wallet.clone(), bin_path);
    {
        let _encoding_ok = script_instance_without_encoder_config
            .main(1, 2)
            .call()
            .await
            .expect("should not fail as it uses the default encoder config");
    }
    {
        let encoder_config = EncoderConfig {
            max_tokens: 1,
            ..Default::default()
        };
        let script_instance_with_encoder_config =
            MyScript::new(wallet.clone(), bin_path).with_encoder_config(encoder_config);

        // uses 2 tokens when 1 is the limit
        let encoding_error = script_instance_with_encoder_config
            .main(1, 2)
            .call()
            .await
            .expect_err("should error");

        assert!(encoding_error.to_string().contains(
            "cannot encode script call arguments: codec: token limit `1` reached while encoding"
        ));

        let encoding_error = script_instance_with_encoder_config
            .main(1, 2)
            .simulate(Execution::Realistic)
            .await
            .expect_err("should error");

        assert!(encoding_error.to_string().contains(
            "cannot encode script call arguments: codec: token limit `1` reached while encoding"
        ));
    }
}
#[tokio::test]
async fn simulations_can_be_made_without_coins() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );
    let provider = wallet.provider().cloned();

    let no_funds_wallet = WalletUnlocked::new_random(provider);
    let script_instance = script_instance.with_account(no_funds_wallet);

    let value = script_instance
        .main(1000, 2000)
        .simulate(Execution::StateReadOnly)
        .await?
        .value;

    assert_eq!(value.as_ref(), "hello");

    Ok(())
}

#[tokio::test]
async fn can_be_run_in_blobs_builder() -> Result<()> {
    abigen!(Script(
        abi = "e2e/sway/scripts/script_blobs/out/release/script_blobs-abi.json",
        name = "MyScript"
    ));

    let binary_path = "./sway/scripts/script_blobs/out/release/script_blobs.bin";
    let wallet = launch_provider_and_get_wallet().await?;
    let provider = wallet.try_provider()?.clone();

    // ANCHOR: preload_low_level
    let regular = Executable::load_from(binary_path)?;

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let loader = regular
        .convert_to_loader()?
        .with_configurables(configurables);

    // The Blob must be uploaded manually, otherwise the script code will revert.
    loader.upload_blob(wallet.clone()).await?;

    let encoder = fuels::core::codec::ABIEncoder::default();
    let token = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    }
    .into_token();
    let data = encoder.encode(&[token])?;

    let mut tb = ScriptTransactionBuilder::default()
        .with_script(loader.code())
        .with_script_data(data);

    wallet.adjust_for_fee(&mut tb, 0).await?;

    wallet.add_witnesses(&mut tb)?;

    let tx = tb.build(&provider).await?;

    let response = provider.send_transaction_and_await_commit(tx).await?;

    response.check(None)?;
    // ANCHOR_END: preload_low_level

    Ok(())
}

#[tokio::test]
async fn can_be_run_in_blobs_high_level() -> Result<()> {
    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/script_blobs",
            name = "MyScript"
        )),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let mut my_script = my_script.with_configurables(configurables);

    let arg = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    };
    let secret = my_script
        .convert_into_loader()
        .await?
        .main(arg)
        .call()
        .await?
        .value;

    assert_eq!(secret, 10001);

    Ok(())
}

#[tokio::test]
async fn high_level_blob_upload_sets_max_fee_tolerance() -> Result<()> {
    let node_config = NodeConfig {
        starting_gas_price: 1000000000,
        ..Default::default()
    };
    let mut wallet = WalletUnlocked::new_random(None);
    let coins = setup_single_asset_coins(wallet.address(), AssetId::zeroed(), 1, u64::MAX);
    let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
    wallet.set_provider(provider.clone());

    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/script_blobs",
            name = "MyScript"
        )),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let loader = Executable::from_bytes(std::fs::read(
        "sway/scripts/script_blobs/out/release/script_blobs.bin",
    )?)
    .convert_to_loader()?;

    let zero_tolerance_fee = {
        let mut tb = BlobTransactionBuilder::default()
            .with_blob(loader.blob())
            .with_max_fee_estimation_tolerance(0.);

        wallet.adjust_for_fee(&mut tb, 0).await?;

        wallet.add_witnesses(&mut tb)?;
        let tx = tb.build(&provider).await?;
        tx.max_fee().unwrap()
    };

    let mut my_script = my_script;
    my_script.convert_into_loader().await?;

    let max_fee_of_sent_blob_tx = provider
        .get_transactions(PaginationRequest {
            cursor: None,
            results: 100,
            direction: PageDirection::Forward,
        })
        .await?
        .results
        .into_iter()
        .find_map(|tx| {
            if let TransactionType::Blob(blob_transaction) = tx.transaction {
                blob_transaction.max_fee()
            } else {
                None
            }
        })
        .unwrap();

    assert_eq!(
        max_fee_of_sent_blob_tx,
        (zero_tolerance_fee as f32 * (1.0 + DEFAULT_MAX_FEE_ESTIMATION_TOLERANCE)).ceil() as u64,
        "the blob upload tx should have had the max fee increased by the default estimation tolerance"
    );

    Ok(())
}

#[tokio::test]
async fn no_data_section_blob_run() -> Result<()> {
    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/empty",
            name = "MyScript"
        )),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let mut my_script = my_script;

    // ANCHOR: preload_high_level
    my_script.convert_into_loader().await?.main().call().await?;
    // ANCHOR_END: preload_high_level

    Ok(())
}

#[tokio::test]
async fn loader_script_calling_loader_proxy() -> Result<()> {
    setup_program_test!(
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            ),
            Contract(name = "MyProxy", project = "e2e/sway/contracts/proxy"),
            Script(name = "MyScript", project = "e2e/sway/scripts/script_proxy"),
        ),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let contract_binary = "sway/contracts/huge_contract/out/release/huge_contract.bin";

    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;

    let contract_id = contract
        .convert_to_loader(100)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;

    let contract_binary = "sway/contracts/proxy/out/release/proxy.bin";

    let proxy_id = Contract::load_from(contract_binary, LoadConfiguration::default())?
        .convert_to_loader(100)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;

    let proxy = MyProxy::new(proxy_id.clone(), wallet.clone());
    proxy
        .methods()
        .set_target_contract(contract_id.clone())
        .call()
        .await?;

    let mut my_script = my_script;
    let result = my_script
        .convert_into_loader()
        .await?
        .main(proxy_id.clone())
        .with_contract_ids(&[contract_id, proxy_id])
        .call()
        .await?;

    assert!(result.value);

    Ok(())
}

#[tokio::test]
async fn loader_can_be_presented_as_a_normal_script_with_shifted_configurables() -> Result<()> {
    abigen!(Script(
        abi = "e2e/sway/scripts/script_blobs/out/release/script_blobs-abi.json",
        name = "MyScript"
    ));

    let binary_path = "./sway/scripts/script_blobs/out/release/script_blobs.bin";
    let wallet = launch_provider_and_get_wallet().await?;
    let provider = wallet.try_provider()?.clone();

    let regular = Executable::load_from(binary_path)?;

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let loader = regular.clone().convert_to_loader()?;

    // The Blob must be uploaded manually, otherwise the script code will revert.
    loader.upload_blob(wallet.clone()).await?;

    let encoder = fuels::core::codec::ABIEncoder::default();
    let token = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    }
    .into_token();
    let data = encoder.encode(&[token])?;

    let configurables: Configurables = configurables.into();

    let shifted_configurables = configurables
        .with_shifted_offsets(-(regular.data_offset_in_code().unwrap() as i64))
        .unwrap()
        .with_shifted_offsets(loader.data_offset_in_code() as i64)
        .unwrap();

    let loader_posing_as_normal_script =
        Executable::from_bytes(loader.code()).with_configurables(shifted_configurables);

    let mut tb = ScriptTransactionBuilder::default()
        .with_script(loader_posing_as_normal_script.code())
        .with_script_data(data);

    wallet.adjust_for_fee(&mut tb, 0).await?;

    wallet.add_witnesses(&mut tb)?;

    let tx = tb.build(&provider).await?;

    let response = provider.send_transaction_and_await_commit(tx).await?;

    response.check(None)?;

    Ok(())
}
```

Furthermore, if you need to separate submission from value retrieval for any reason, you can do so as follows:

```rust,ignore
use std::time::Duration;

use fuel_tx::Output;
use fuels::{
    client::{PageDirection, PaginationRequest},
    core::{
        codec::{DecoderConfig, EncoderConfig},
        traits::Tokenizable,
        Configurables,
    },
    prelude::*,
    programs::{executable::Executable, DEFAULT_MAX_FEE_ESTIMATION_TOLERANCE},
    types::{Bits256, Identity},
};

#[tokio::test]
async fn main_function_arguments() -> Result<()> {
    // ANCHOR: script_with_arguments
    // The abigen is used for the same purpose as with contracts (Rust bindings)
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/arguments/out/release/arguments-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/scripts/arguments/out/release/arguments.bin";
    let script_instance = MyScript::new(wallet, bin_path);

    let bim = Bimbam { val: 90 };
    let bam = SugarySnack {
        twix: 100,
        mars: 1000,
    };

    let result = script_instance.main(bim, bam).call().await?;

    let expected = Bimbam { val: 2190 };
    assert_eq!(result.value, expected);
    // ANCHOR_END: script_with_arguments
    Ok(())
}

#[tokio::test]
async fn script_call_has_same_estimated_and_used_gas() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let tolerance = Some(0.0);
    let block_horizon = Some(1);

    let a = 4u64;
    let b = 2u32;
    let estimated_gas_used = script_instance
        .main(a, b)
        .estimate_transaction_cost(tolerance, block_horizon)
        .await?
        .gas_used;

    let gas_used = script_instance.main(a, b).call().await?.gas_used;

    assert_eq!(estimated_gas_used, gas_used);

    Ok(())
}

#[tokio::test]
async fn test_basic_script_with_tx_policies() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "bimbam_script",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "bimbam_script",
            wallet = "wallet"
        )
    );

    let a = 1000u64;
    let b = 2000u32;
    let result = script_instance.main(a, b).call().await?;
    assert_eq!(result.value, "hello");

    // ANCHOR: script_with_tx_policies
    let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
    let result = script_instance
        .main(a, b)
        .with_tx_policies(tx_policies)
        .call()
        .await?;
    // ANCHOR_END: script_with_tx_policies
    assert_eq!(result.value, "hello");

    Ok(())
}

#[tokio::test]
async fn test_output_variable_estimation() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "transfer_script",
            project = "e2e/sway/scripts/transfer_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "transfer_script",
            wallet = "wallet"
        )
    );

    let provider = wallet.try_provider()?.clone();
    let mut receiver = WalletUnlocked::new_random(None);
    receiver.set_provider(provider);

    let amount = 1000;
    let asset_id = AssetId::zeroed();
    let script_call = script_instance.main(
        amount,
        asset_id,
        Identity::Address(receiver.address().into()),
    );
    let inputs = wallet
        .get_asset_inputs_for_amount(asset_id, amount, None)
        .await?;
    let output = Output::change(wallet.address().into(), 0, asset_id);
    let _ = script_call
        .with_inputs(inputs)
        .with_outputs(vec![output])
        .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
        .call()
        .await?;

    let receiver_balance = receiver.get_asset_balance(&asset_id).await?;
    assert_eq!(receiver_balance, amount);

    Ok(())
}

#[tokio::test]
async fn test_script_struct() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_struct"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_struct = MyStruct {
        number: 42,
        boolean: true,
    };
    let response = script_instance.main(my_struct).call().await?;

    assert_eq!(response.value, 42);
    Ok(())
}

#[tokio::test]
async fn test_script_enum() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_enum"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_enum = MyEnum::Two;
    let response = script_instance.main(my_enum).call().await?;

    assert_eq!(response.value, 2);
    Ok(())
}

#[tokio::test]
async fn test_script_array() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_array"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_array: [u64; 4] = [1, 2, 3, 4];
    let response = script_instance.main(my_array).call().await?;

    assert_eq!(response.value, 10);
    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_on_script_call() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_needs_custom_decoder"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    {
        // Will fail if max_tokens too low
        script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 101,
                ..Default::default()
            })
            .call()
            .await
            .expect_err(
                "Should fail because return type has more tokens than what is allowed by default",
            );
    }
    {
        // When the token limit is bumped should pass
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?
            .value;

        assert_eq!(response, [0u8; 1000]);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_submit_and_response() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_struct"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_struct = MyStruct {
        number: 42,
        boolean: true,
    };

    // ANCHOR: submit_response_script
    let submitted_tx = script_instance.main(my_struct).submit().await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let value = submitted_tx.response().await?.value;
    // ANCHOR_END: submit_response_script

    assert_eq!(value, 42);
    Ok(())
}

#[tokio::test]
async fn test_script_transaction_builder() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );
    let provider = wallet.try_provider()?;

    // ANCHOR: script_call_tb
    let script_call_handler = script_instance.main(1, 2);

    let mut tb = script_call_handler.transaction_builder().await?;

    // customize the builder...

    wallet.adjust_for_fee(&mut tb, 0).await?;
    tb.add_signer(wallet.clone())?;

    let tx = tb.build(provider).await?;

    let tx_id = provider.send_transaction(tx).await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let tx_status = provider.tx_status(&tx_id).await?;

    let response = script_call_handler.get_response_from(tx_status)?;

    assert_eq!(response.value, "hello");
    // ANCHOR_END: script_call_tb

    Ok(())
}

#[tokio::test]
async fn script_encoder_config_is_applied() {
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/basic_script/out/release/basic_script-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await.expect("");
    let bin_path = "sway/scripts/basic_script/out/release/basic_script.bin";

    let script_instance_without_encoder_config = MyScript::new(wallet.clone(), bin_path);
    {
        let _encoding_ok = script_instance_without_encoder_config
            .main(1, 2)
            .call()
            .await
            .expect("should not fail as it uses the default encoder config");
    }
    {
        let encoder_config = EncoderConfig {
            max_tokens: 1,
            ..Default::default()
        };
        let script_instance_with_encoder_config =
            MyScript::new(wallet.clone(), bin_path).with_encoder_config(encoder_config);

        // uses 2 tokens when 1 is the limit
        let encoding_error = script_instance_with_encoder_config
            .main(1, 2)
            .call()
            .await
            .expect_err("should error");

        assert!(encoding_error.to_string().contains(
            "cannot encode script call arguments: codec: token limit `1` reached while encoding"
        ));

        let encoding_error = script_instance_with_encoder_config
            .main(1, 2)
            .simulate(Execution::Realistic)
            .await
            .expect_err("should error");

        assert!(encoding_error.to_string().contains(
            "cannot encode script call arguments: codec: token limit `1` reached while encoding"
        ));
    }
}
#[tokio::test]
async fn simulations_can_be_made_without_coins() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );
    let provider = wallet.provider().cloned();

    let no_funds_wallet = WalletUnlocked::new_random(provider);
    let script_instance = script_instance.with_account(no_funds_wallet);

    let value = script_instance
        .main(1000, 2000)
        .simulate(Execution::StateReadOnly)
        .await?
        .value;

    assert_eq!(value.as_ref(), "hello");

    Ok(())
}

#[tokio::test]
async fn can_be_run_in_blobs_builder() -> Result<()> {
    abigen!(Script(
        abi = "e2e/sway/scripts/script_blobs/out/release/script_blobs-abi.json",
        name = "MyScript"
    ));

    let binary_path = "./sway/scripts/script_blobs/out/release/script_blobs.bin";
    let wallet = launch_provider_and_get_wallet().await?;
    let provider = wallet.try_provider()?.clone();

    // ANCHOR: preload_low_level
    let regular = Executable::load_from(binary_path)?;

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let loader = regular
        .convert_to_loader()?
        .with_configurables(configurables);

    // The Blob must be uploaded manually, otherwise the script code will revert.
    loader.upload_blob(wallet.clone()).await?;

    let encoder = fuels::core::codec::ABIEncoder::default();
    let token = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    }
    .into_token();
    let data = encoder.encode(&[token])?;

    let mut tb = ScriptTransactionBuilder::default()
        .with_script(loader.code())
        .with_script_data(data);

    wallet.adjust_for_fee(&mut tb, 0).await?;

    wallet.add_witnesses(&mut tb)?;

    let tx = tb.build(&provider).await?;

    let response = provider.send_transaction_and_await_commit(tx).await?;

    response.check(None)?;
    // ANCHOR_END: preload_low_level

    Ok(())
}

#[tokio::test]
async fn can_be_run_in_blobs_high_level() -> Result<()> {
    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/script_blobs",
            name = "MyScript"
        )),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let mut my_script = my_script.with_configurables(configurables);

    let arg = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    };
    let secret = my_script
        .convert_into_loader()
        .await?
        .main(arg)
        .call()
        .await?
        .value;

    assert_eq!(secret, 10001);

    Ok(())
}

#[tokio::test]
async fn high_level_blob_upload_sets_max_fee_tolerance() -> Result<()> {
    let node_config = NodeConfig {
        starting_gas_price: 1000000000,
        ..Default::default()
    };
    let mut wallet = WalletUnlocked::new_random(None);
    let coins = setup_single_asset_coins(wallet.address(), AssetId::zeroed(), 1, u64::MAX);
    let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
    wallet.set_provider(provider.clone());

    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/script_blobs",
            name = "MyScript"
        )),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let loader = Executable::from_bytes(std::fs::read(
        "sway/scripts/script_blobs/out/release/script_blobs.bin",
    )?)
    .convert_to_loader()?;

    let zero_tolerance_fee = {
        let mut tb = BlobTransactionBuilder::default()
            .with_blob(loader.blob())
            .with_max_fee_estimation_tolerance(0.);

        wallet.adjust_for_fee(&mut tb, 0).await?;

        wallet.add_witnesses(&mut tb)?;
        let tx = tb.build(&provider).await?;
        tx.max_fee().unwrap()
    };

    let mut my_script = my_script;
    my_script.convert_into_loader().await?;

    let max_fee_of_sent_blob_tx = provider
        .get_transactions(PaginationRequest {
            cursor: None,
            results: 100,
            direction: PageDirection::Forward,
        })
        .await?
        .results
        .into_iter()
        .find_map(|tx| {
            if let TransactionType::Blob(blob_transaction) = tx.transaction {
                blob_transaction.max_fee()
            } else {
                None
            }
        })
        .unwrap();

    assert_eq!(
        max_fee_of_sent_blob_tx,
        (zero_tolerance_fee as f32 * (1.0 + DEFAULT_MAX_FEE_ESTIMATION_TOLERANCE)).ceil() as u64,
        "the blob upload tx should have had the max fee increased by the default estimation tolerance"
    );

    Ok(())
}

#[tokio::test]
async fn no_data_section_blob_run() -> Result<()> {
    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/empty",
            name = "MyScript"
        )),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let mut my_script = my_script;

    // ANCHOR: preload_high_level
    my_script.convert_into_loader().await?.main().call().await?;
    // ANCHOR_END: preload_high_level

    Ok(())
}

#[tokio::test]
async fn loader_script_calling_loader_proxy() -> Result<()> {
    setup_program_test!(
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            ),
            Contract(name = "MyProxy", project = "e2e/sway/contracts/proxy"),
            Script(name = "MyScript", project = "e2e/sway/scripts/script_proxy"),
        ),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let contract_binary = "sway/contracts/huge_contract/out/release/huge_contract.bin";

    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;

    let contract_id = contract
        .convert_to_loader(100)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;

    let contract_binary = "sway/contracts/proxy/out/release/proxy.bin";

    let proxy_id = Contract::load_from(contract_binary, LoadConfiguration::default())?
        .convert_to_loader(100)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;

    let proxy = MyProxy::new(proxy_id.clone(), wallet.clone());
    proxy
        .methods()
        .set_target_contract(contract_id.clone())
        .call()
        .await?;

    let mut my_script = my_script;
    let result = my_script
        .convert_into_loader()
        .await?
        .main(proxy_id.clone())
        .with_contract_ids(&[contract_id, proxy_id])
        .call()
        .await?;

    assert!(result.value);

    Ok(())
}

#[tokio::test]
async fn loader_can_be_presented_as_a_normal_script_with_shifted_configurables() -> Result<()> {
    abigen!(Script(
        abi = "e2e/sway/scripts/script_blobs/out/release/script_blobs-abi.json",
        name = "MyScript"
    ));

    let binary_path = "./sway/scripts/script_blobs/out/release/script_blobs.bin";
    let wallet = launch_provider_and_get_wallet().await?;
    let provider = wallet.try_provider()?.clone();

    let regular = Executable::load_from(binary_path)?;

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let loader = regular.clone().convert_to_loader()?;

    // The Blob must be uploaded manually, otherwise the script code will revert.
    loader.upload_blob(wallet.clone()).await?;

    let encoder = fuels::core::codec::ABIEncoder::default();
    let token = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    }
    .into_token();
    let data = encoder.encode(&[token])?;

    let configurables: Configurables = configurables.into();

    let shifted_configurables = configurables
        .with_shifted_offsets(-(regular.data_offset_in_code().unwrap() as i64))
        .unwrap()
        .with_shifted_offsets(loader.data_offset_in_code() as i64)
        .unwrap();

    let loader_posing_as_normal_script =
        Executable::from_bytes(loader.code()).with_configurables(shifted_configurables);

    let mut tb = ScriptTransactionBuilder::default()
        .with_script(loader_posing_as_normal_script.code())
        .with_script_data(data);

    wallet.adjust_for_fee(&mut tb, 0).await?;

    wallet.add_witnesses(&mut tb)?;

    let tx = tb.build(&provider).await?;

    let response = provider.send_transaction_and_await_commit(tx).await?;

    response.check(None)?;

    Ok(())
}
```

## Running scripts with transaction policies

The method for passing transaction policies is the same as [with contracts](./calling-contracts/tx-policies.md). As a reminder, the workflow would look like this:

```rust,ignore
use std::time::Duration;

use fuel_tx::Output;
use fuels::{
    client::{PageDirection, PaginationRequest},
    core::{
        codec::{DecoderConfig, EncoderConfig},
        traits::Tokenizable,
        Configurables,
    },
    prelude::*,
    programs::{executable::Executable, DEFAULT_MAX_FEE_ESTIMATION_TOLERANCE},
    types::{Bits256, Identity},
};

#[tokio::test]
async fn main_function_arguments() -> Result<()> {
    // ANCHOR: script_with_arguments
    // The abigen is used for the same purpose as with contracts (Rust bindings)
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/arguments/out/release/arguments-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/scripts/arguments/out/release/arguments.bin";
    let script_instance = MyScript::new(wallet, bin_path);

    let bim = Bimbam { val: 90 };
    let bam = SugarySnack {
        twix: 100,
        mars: 1000,
    };

    let result = script_instance.main(bim, bam).call().await?;

    let expected = Bimbam { val: 2190 };
    assert_eq!(result.value, expected);
    // ANCHOR_END: script_with_arguments
    Ok(())
}

#[tokio::test]
async fn script_call_has_same_estimated_and_used_gas() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let tolerance = Some(0.0);
    let block_horizon = Some(1);

    let a = 4u64;
    let b = 2u32;
    let estimated_gas_used = script_instance
        .main(a, b)
        .estimate_transaction_cost(tolerance, block_horizon)
        .await?
        .gas_used;

    let gas_used = script_instance.main(a, b).call().await?.gas_used;

    assert_eq!(estimated_gas_used, gas_used);

    Ok(())
}

#[tokio::test]
async fn test_basic_script_with_tx_policies() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "bimbam_script",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "bimbam_script",
            wallet = "wallet"
        )
    );

    let a = 1000u64;
    let b = 2000u32;
    let result = script_instance.main(a, b).call().await?;
    assert_eq!(result.value, "hello");

    // ANCHOR: script_with_tx_policies
    let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
    let result = script_instance
        .main(a, b)
        .with_tx_policies(tx_policies)
        .call()
        .await?;
    // ANCHOR_END: script_with_tx_policies
    assert_eq!(result.value, "hello");

    Ok(())
}

#[tokio::test]
async fn test_output_variable_estimation() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "transfer_script",
            project = "e2e/sway/scripts/transfer_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "transfer_script",
            wallet = "wallet"
        )
    );

    let provider = wallet.try_provider()?.clone();
    let mut receiver = WalletUnlocked::new_random(None);
    receiver.set_provider(provider);

    let amount = 1000;
    let asset_id = AssetId::zeroed();
    let script_call = script_instance.main(
        amount,
        asset_id,
        Identity::Address(receiver.address().into()),
    );
    let inputs = wallet
        .get_asset_inputs_for_amount(asset_id, amount, None)
        .await?;
    let output = Output::change(wallet.address().into(), 0, asset_id);
    let _ = script_call
        .with_inputs(inputs)
        .with_outputs(vec![output])
        .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
        .call()
        .await?;

    let receiver_balance = receiver.get_asset_balance(&asset_id).await?;
    assert_eq!(receiver_balance, amount);

    Ok(())
}

#[tokio::test]
async fn test_script_struct() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_struct"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_struct = MyStruct {
        number: 42,
        boolean: true,
    };
    let response = script_instance.main(my_struct).call().await?;

    assert_eq!(response.value, 42);
    Ok(())
}

#[tokio::test]
async fn test_script_enum() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_enum"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_enum = MyEnum::Two;
    let response = script_instance.main(my_enum).call().await?;

    assert_eq!(response.value, 2);
    Ok(())
}

#[tokio::test]
async fn test_script_array() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_array"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_array: [u64; 4] = [1, 2, 3, 4];
    let response = script_instance.main(my_array).call().await?;

    assert_eq!(response.value, 10);
    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_on_script_call() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_needs_custom_decoder"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    {
        // Will fail if max_tokens too low
        script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 101,
                ..Default::default()
            })
            .call()
            .await
            .expect_err(
                "Should fail because return type has more tokens than what is allowed by default",
            );
    }
    {
        // When the token limit is bumped should pass
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?
            .value;

        assert_eq!(response, [0u8; 1000]);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_submit_and_response() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_struct"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let my_struct = MyStruct {
        number: 42,
        boolean: true,
    };

    // ANCHOR: submit_response_script
    let submitted_tx = script_instance.main(my_struct).submit().await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let value = submitted_tx.response().await?.value;
    // ANCHOR_END: submit_response_script

    assert_eq!(value, 42);
    Ok(())
}

#[tokio::test]
async fn test_script_transaction_builder() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );
    let provider = wallet.try_provider()?;

    // ANCHOR: script_call_tb
    let script_call_handler = script_instance.main(1, 2);

    let mut tb = script_call_handler.transaction_builder().await?;

    // customize the builder...

    wallet.adjust_for_fee(&mut tb, 0).await?;
    tb.add_signer(wallet.clone())?;

    let tx = tb.build(provider).await?;

    let tx_id = provider.send_transaction(tx).await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let tx_status = provider.tx_status(&tx_id).await?;

    let response = script_call_handler.get_response_from(tx_status)?;

    assert_eq!(response.value, "hello");
    // ANCHOR_END: script_call_tb

    Ok(())
}

#[tokio::test]
async fn script_encoder_config_is_applied() {
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/basic_script/out/release/basic_script-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await.expect("");
    let bin_path = "sway/scripts/basic_script/out/release/basic_script.bin";

    let script_instance_without_encoder_config = MyScript::new(wallet.clone(), bin_path);
    {
        let _encoding_ok = script_instance_without_encoder_config
            .main(1, 2)
            .call()
            .await
            .expect("should not fail as it uses the default encoder config");
    }
    {
        let encoder_config = EncoderConfig {
            max_tokens: 1,
            ..Default::default()
        };
        let script_instance_with_encoder_config =
            MyScript::new(wallet.clone(), bin_path).with_encoder_config(encoder_config);

        // uses 2 tokens when 1 is the limit
        let encoding_error = script_instance_with_encoder_config
            .main(1, 2)
            .call()
            .await
            .expect_err("should error");

        assert!(encoding_error.to_string().contains(
            "cannot encode script call arguments: codec: token limit `1` reached while encoding"
        ));

        let encoding_error = script_instance_with_encoder_config
            .main(1, 2)
            .simulate(Execution::Realistic)
            .await
            .expect_err("should error");

        assert!(encoding_error.to_string().contains(
            "cannot encode script call arguments: codec: token limit `1` reached while encoding"
        ));
    }
}
#[tokio::test]
async fn simulations_can_be_made_without_coins() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/basic_script"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );
    let provider = wallet.provider().cloned();

    let no_funds_wallet = WalletUnlocked::new_random(provider);
    let script_instance = script_instance.with_account(no_funds_wallet);

    let value = script_instance
        .main(1000, 2000)
        .simulate(Execution::StateReadOnly)
        .await?
        .value;

    assert_eq!(value.as_ref(), "hello");

    Ok(())
}

#[tokio::test]
async fn can_be_run_in_blobs_builder() -> Result<()> {
    abigen!(Script(
        abi = "e2e/sway/scripts/script_blobs/out/release/script_blobs-abi.json",
        name = "MyScript"
    ));

    let binary_path = "./sway/scripts/script_blobs/out/release/script_blobs.bin";
    let wallet = launch_provider_and_get_wallet().await?;
    let provider = wallet.try_provider()?.clone();

    // ANCHOR: preload_low_level
    let regular = Executable::load_from(binary_path)?;

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let loader = regular
        .convert_to_loader()?
        .with_configurables(configurables);

    // The Blob must be uploaded manually, otherwise the script code will revert.
    loader.upload_blob(wallet.clone()).await?;

    let encoder = fuels::core::codec::ABIEncoder::default();
    let token = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    }
    .into_token();
    let data = encoder.encode(&[token])?;

    let mut tb = ScriptTransactionBuilder::default()
        .with_script(loader.code())
        .with_script_data(data);

    wallet.adjust_for_fee(&mut tb, 0).await?;

    wallet.add_witnesses(&mut tb)?;

    let tx = tb.build(&provider).await?;

    let response = provider.send_transaction_and_await_commit(tx).await?;

    response.check(None)?;
    // ANCHOR_END: preload_low_level

    Ok(())
}

#[tokio::test]
async fn can_be_run_in_blobs_high_level() -> Result<()> {
    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/script_blobs",
            name = "MyScript"
        )),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let mut my_script = my_script.with_configurables(configurables);

    let arg = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    };
    let secret = my_script
        .convert_into_loader()
        .await?
        .main(arg)
        .call()
        .await?
        .value;

    assert_eq!(secret, 10001);

    Ok(())
}

#[tokio::test]
async fn high_level_blob_upload_sets_max_fee_tolerance() -> Result<()> {
    let node_config = NodeConfig {
        starting_gas_price: 1000000000,
        ..Default::default()
    };
    let mut wallet = WalletUnlocked::new_random(None);
    let coins = setup_single_asset_coins(wallet.address(), AssetId::zeroed(), 1, u64::MAX);
    let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
    wallet.set_provider(provider.clone());

    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/script_blobs",
            name = "MyScript"
        )),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let loader = Executable::from_bytes(std::fs::read(
        "sway/scripts/script_blobs/out/release/script_blobs.bin",
    )?)
    .convert_to_loader()?;

    let zero_tolerance_fee = {
        let mut tb = BlobTransactionBuilder::default()
            .with_blob(loader.blob())
            .with_max_fee_estimation_tolerance(0.);

        wallet.adjust_for_fee(&mut tb, 0).await?;

        wallet.add_witnesses(&mut tb)?;
        let tx = tb.build(&provider).await?;
        tx.max_fee().unwrap()
    };

    let mut my_script = my_script;
    my_script.convert_into_loader().await?;

    let max_fee_of_sent_blob_tx = provider
        .get_transactions(PaginationRequest {
            cursor: None,
            results: 100,
            direction: PageDirection::Forward,
        })
        .await?
        .results
        .into_iter()
        .find_map(|tx| {
            if let TransactionType::Blob(blob_transaction) = tx.transaction {
                blob_transaction.max_fee()
            } else {
                None
            }
        })
        .unwrap();

    assert_eq!(
        max_fee_of_sent_blob_tx,
        (zero_tolerance_fee as f32 * (1.0 + DEFAULT_MAX_FEE_ESTIMATION_TOLERANCE)).ceil() as u64,
        "the blob upload tx should have had the max fee increased by the default estimation tolerance"
    );

    Ok(())
}

#[tokio::test]
async fn no_data_section_blob_run() -> Result<()> {
    setup_program_test!(
        Abigen(Script(
            project = "e2e/sway/scripts/empty",
            name = "MyScript"
        )),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let mut my_script = my_script;

    // ANCHOR: preload_high_level
    my_script.convert_into_loader().await?.main().call().await?;
    // ANCHOR_END: preload_high_level

    Ok(())
}

#[tokio::test]
async fn loader_script_calling_loader_proxy() -> Result<()> {
    setup_program_test!(
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            ),
            Contract(name = "MyProxy", project = "e2e/sway/contracts/proxy"),
            Script(name = "MyScript", project = "e2e/sway/scripts/script_proxy"),
        ),
        Wallets("wallet"),
        LoadScript(name = "my_script", script = "MyScript", wallet = "wallet")
    );

    let contract_binary = "sway/contracts/huge_contract/out/release/huge_contract.bin";

    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;

    let contract_id = contract
        .convert_to_loader(100)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;

    let contract_binary = "sway/contracts/proxy/out/release/proxy.bin";

    let proxy_id = Contract::load_from(contract_binary, LoadConfiguration::default())?
        .convert_to_loader(100)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;

    let proxy = MyProxy::new(proxy_id.clone(), wallet.clone());
    proxy
        .methods()
        .set_target_contract(contract_id.clone())
        .call()
        .await?;

    let mut my_script = my_script;
    let result = my_script
        .convert_into_loader()
        .await?
        .main(proxy_id.clone())
        .with_contract_ids(&[contract_id, proxy_id])
        .call()
        .await?;

    assert!(result.value);

    Ok(())
}

#[tokio::test]
async fn loader_can_be_presented_as_a_normal_script_with_shifted_configurables() -> Result<()> {
    abigen!(Script(
        abi = "e2e/sway/scripts/script_blobs/out/release/script_blobs-abi.json",
        name = "MyScript"
    ));

    let binary_path = "./sway/scripts/script_blobs/out/release/script_blobs.bin";
    let wallet = launch_provider_and_get_wallet().await?;
    let provider = wallet.try_provider()?.clone();

    let regular = Executable::load_from(binary_path)?;

    let configurables = MyScriptConfigurables::default().with_SECRET_NUMBER(10001)?;
    let loader = regular.clone().convert_to_loader()?;

    // The Blob must be uploaded manually, otherwise the script code will revert.
    loader.upload_blob(wallet.clone()).await?;

    let encoder = fuels::core::codec::ABIEncoder::default();
    let token = MyStruct {
        field_a: MyEnum::B(99),
        field_b: Bits256([17; 32]),
    }
    .into_token();
    let data = encoder.encode(&[token])?;

    let configurables: Configurables = configurables.into();

    let shifted_configurables = configurables
        .with_shifted_offsets(-(regular.data_offset_in_code().unwrap() as i64))
        .unwrap()
        .with_shifted_offsets(loader.data_offset_in_code() as i64)
        .unwrap();

    let loader_posing_as_normal_script =
        Executable::from_bytes(loader.code()).with_configurables(shifted_configurables);

    let mut tb = ScriptTransactionBuilder::default()
        .with_script(loader_posing_as_normal_script.code())
        .with_script_data(data);

    wallet.adjust_for_fee(&mut tb, 0).await?;

    wallet.add_witnesses(&mut tb)?;

    let tx = tb.build(&provider).await?;

    let response = provider.send_transaction_and_await_commit(tx).await?;

    response.check(None)?;

    Ok(())
}
```

## Logs

Script calls provide the same logging functions, `decode_logs()` and `decode_logs_with_type<T>()`, as contract calls. As a reminder, the workflow looks like this:

```rust,ignore
use fuels::{
    core::codec::DecoderConfig,
    prelude::*,
    types::{errors::transaction::Reason, AsciiString, Bits256, SizedAsciiString},
};

#[tokio::test]
async fn test_parse_logged_variables() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: produce_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_variables().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_bits256 = response.decode_logs_with_type::<Bits256>()?;
    let log_string = response.decode_logs_with_type::<SizedAsciiString<4>>()?;
    let log_array = response.decode_logs_with_type::<[u8; 3]>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_bits256, vec![expected_bits256]);
    assert_eq!(log_string, vec!["Fuel"]);
    assert_eq!(log_array, vec![[1, 2, 3]]);
    // ANCHOR_END: produce_logs

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_values() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_values().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_custom_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_custom_types().call().await?;

    let log_test_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_test_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_tuple = response.decode_logs_with_type::<(TestStruct, TestEnum)>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;

    assert_eq!(log_test_struct, vec![expected_struct.clone()]);
    assert_eq!(log_test_enum, vec![expected_enum.clone()]);
    assert_eq!(log_tuple, vec![(expected_struct, expected_enum)]);

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_generic_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_generic_types().call().await?;

    let log_struct = response.decode_logs_with_type::<StructWithGeneric<[_; 3]>>()?;
    let log_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_struct_nested =
        response.decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<[_; 3]>>>()?;
    let log_struct_deeply_nested = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<[_; 3]>>,
    >>()?;

    let l = [1u8, 2u8, 3u8];
    let expected_struct = StructWithGeneric {
        field_1: l,
        field_2: 64,
    };
    let expected_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_struct_nested, vec![expected_nested_struct]);
    assert_eq!(
        log_struct_deeply_nested,
        vec![expected_deeply_nested_struct]
    );

    Ok(())
}

#[tokio::test]
async fn test_decode_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: decode_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_multiple_logs().call().await?;
    let logs = response.decode_logs();
    // ANCHOR_END: decode_logs

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_generic_struct:?}"),
    ];

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
async fn test_decode_logs_with_no_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/contract_test"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let logs = contract_methods
        .initialize_counter(42)
        .call()
        .await?
        .decode_logs();

    assert!(logs.filter_succeeded().is_empty());

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    let call_handler_1 = contract_methods.produce_logs_values();
    let call_handler_2 = contract_methods.produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_multiple_contracts() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let call_handler_1 = contract_instance.methods().produce_logs_values();
    let call_handler_2 = contract_instance2.methods().produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs"),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance2",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id.clone())
        .with_contracts(&[&contract_instance]);

    let call_handler_2 = contract_caller_instance2
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

fn assert_revert_containing_msg(msg: &str, error: Error) {
    assert!(matches!(error, Error::Transaction(Reason::Reverted { .. })));
    if let Error::Transaction(Reason::Reverted { reason, .. }) = error {
        assert!(
            reason.contains(msg),
            "message: \"{msg}\" not contained in reason: \"{reason}\""
        );
    }
}

#[tokio::test]
async fn test_revert_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        ($method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .call()
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
        ($method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(require_primitive, call, "42");
        reverts_with_msg!(require_primitive, simulate, "42");

        reverts_with_msg!(require_string, call, "fuel");
        reverts_with_msg!(require_string, simulate, "fuel");

        reverts_with_msg!(require_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            require_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(require_with_additional_logs, call, "64");
        reverts_with_msg!(require_with_additional_logs, simulate, "64");
    }
    {
        reverts_with_msg!(rev_w_log_primitive, call, "42");
        reverts_with_msg!(rev_w_log_primitive, simulate, "42");

        reverts_with_msg!(rev_w_log_string, call, "fuel");
        reverts_with_msg!(rev_w_log_string, simulate, "fuel");

        reverts_with_msg!(rev_w_log_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            rev_w_log_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_multi_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let contract_methods2 = contract_instance2.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods2.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods2.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_decode_logs() -> Result<()> {
    // ANCHOR: script_logs
    abigen!(Script(
        name = "LogScript",
        abi = "e2e/sway/logs/script_logs/out/release/script_logs-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/logs/script_logs/out/release/script_logs.bin";
    let instance = LogScript::new(wallet.clone(), bin_path);

    let response = instance.main().call().await?;

    let logs = response.decode_logs();
    let log_u64 = response.decode_logs_with_type::<u64>()?;
    // ANCHOR_END: script_logs

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_tuple = (expected_struct.clone(), expected_enum.clone());
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 128u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_tuple:?}"),
        format!("{expected_generic_struct:?}"),
        format!("{expected_generic_enum:?}"),
        format!("{expected_nested_struct:?}"),
        format!("{expected_deeply_nested_struct:?}"),
    ];

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?
        .decode_logs();

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_logs_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Script(
                name = "LogScript",
                project = "e2e/sway/logs/script_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let expected_num_contract_logs = 4;

    let expected_script_logs: Vec<String> = vec![
        // Contract logs
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        // Script logs
        format!("{:?}", true),
        format!("{:?}", 42),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    // ANCHOR: instance_to_contract_id
    let contract_id: ContractId = contract_instance.id().into();
    // ANCHOR_END: instance_to_contract_id

    // ANCHOR: external_contract_ids
    let response = script_instance
        .main(contract_id)
        .with_contract_ids(&[contract_id.into()])
        .call()
        .await?;
    // ANCHOR_END: external_contract_ids

    // ANCHOR: external_contract
    let response = script_instance
        .main(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?;
    // ANCHOR_END: external_contract

    {
        let num_contract_logs = response
            .receipts
            .iter()
            .filter(|receipt| matches!(receipt, Receipt::LogData { id, .. } | Receipt::Log { id, .. } if *id == contract_id))
            .count();

        assert_eq!(num_contract_logs, expected_num_contract_logs);
    }
    {
        let logs = response.decode_logs();

        assert_eq!(logs.filter_succeeded(), expected_script_logs);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_decode_logs_with_type() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let response = script_instance.main().call().await?;

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    let log_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_generic_struct = response.decode_logs_with_type::<StructWithGeneric<TestStruct>>()?;
    let log_generic_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_nested_struct = response
        .decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<TestStruct>>>()?;
    let log_deeply_nested_struct = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<TestStruct>>,
    >>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![128, 64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_generic_struct, vec![expected_generic_struct]);
    assert_eq!(log_generic_enum, vec![expected_generic_enum]);
    assert_eq!(log_nested_struct, vec![expected_nested_struct]);
    assert_eq!(
        log_deeply_nested_struct,
        vec![expected_deeply_nested_struct]
    );
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_script_require_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_revert_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(MatchEnum::RequirePrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RequirePrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RequireString, call, "fuel");
        reverts_with_msg!(MatchEnum::RequireString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, call, "64");
        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, simulate, "64");
    }
    {
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RevWLogString, call, "fuel");
        reverts_with_msg!(MatchEnum::RevWLogString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let error = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractLogs",
                project = "e2e/sway/logs/contract_logs",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "ContractLogs",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let lib_contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_instance.methods().produce_logs_values();

    let call_handler_2 = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&lib_contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let error = multi_call_handler
        .call::<((), ())>()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_script_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_loader_script_require_from_loader_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let contract_binary = "sway/contracts/lib_contract/out/release/lib_contract.bin";
    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;
    let contract_id = contract
        .convert_to_loader(100_000)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;
    let contract_instance = MyContract::new(contract_id, wallet);

    let mut script_instance = script_instance;
    script_instance.convert_into_loader().await?;

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

fn assert_assert_eq_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left == right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

fn assert_assert_ne_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left != right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

#[tokio::test]
async fn test_contract_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/contracts/asserts"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        (($($arg: expr,)*), $method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        (($($arg: expr,)*), $method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!((32, 64,), assert_primitive, call, "assertion failed");
        reverts_with_msg!((32, 64,), assert_primitive, simulate, "assertion failed");
    }

    macro_rules! reverts_with_assert_eq_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_eq_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, call, "assertion failed");
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;
        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            simulate,
            "assertion failed"
        );
    }

    macro_rules! reverts_with_assert_ne_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_ne_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, call, "assertion failed");
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            simulate,
            "assertion failed"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_script_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_asserts"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    macro_rules! reverts_with_assert_eq_ne_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            call,
            "assertion failed"
        );
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            simulate,
            "assertion failed"
        );
    }
    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }

    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }

    Ok(())
}

#[tokio::test]
async fn contract_token_ops_error_messages() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/token_ops"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let contract_id = contract_instance.contract_id();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());
        let address = wallet.address();

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .simulate(Execution::Realistic)
            .await
            .expect_err("should return a revert error");
        assert_revert_containing_msg("failed transfer to address", error);

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .call()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("failed transfer to address", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_log_results() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let response = contract_instance
        .methods()
        .produce_bad_logs()
        .call()
        .await?;

    let log = response.decode_logs();

    let expected_err = format!(
        "codec: missing log formatter for log_id: `LogId({:?}, \"128\")`, data: `{:?}`. \
         Consider adding external contracts using `with_contracts()`",
        contract_instance.id().hash,
        [0u8; 8]
    );

    let succeeded = log.filter_succeeded();
    let failed = log.filter_failed();
    assert_eq!(succeeded, vec!["123".to_string()]);
    assert_eq!(failed.first().unwrap().to_string(), expected_err);

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_contract_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/contracts/needs_custom_decoder"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let methods = contract_instance.methods();
    {
        // Single call: decoding with too low max_tokens fails
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "Should have failed since there are more tokens than what is supported by default.",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "Should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Single call: increasing limits makes the test pass
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }
    {
        // Multi call: decoding with too low max_tokens will fail
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "should have failed since there are more tokens than what is supported by default",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Multi call: increasing limits makes the test pass
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_script_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_needs_custom_decoder_logging"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    {
        // Cannot decode the produced log with too low max_tokens
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response
            .decode_logs_with_type::<[u8; 1000]>()
            .expect_err("Cannot decode the log with default decoder config");

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty())
    }
    {
        // When the token limit is bumped log decoding succeeds
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty())
    }

    Ok(())
}

#[tokio::test]
async fn contract_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );
    let contract_methods = contract_instance.methods();

    {
        let response = contract_methods.produce_string_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let response = contract_methods.produce_string_log().call().await?;
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let response = contract_methods.produce_bytes_log().call().await?;
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let response = contract_methods.produce_raw_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let response = contract_methods.produce_vec_log().call().await?;
        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}

#[tokio::test]
async fn script_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_heap_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    let response = script_instance.main().call().await?;

    {
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}
```

## Calling contracts from scripts

Scripts use the same interfaces for setting external contracts as [contract methods](./calling-contracts/other-contracts.md).

Below is an example that uses `with_contracts(&[&contract_instance, ...])`.

```rust,ignore
use fuels::{
    core::codec::DecoderConfig,
    prelude::*,
    types::{errors::transaction::Reason, AsciiString, Bits256, SizedAsciiString},
};

#[tokio::test]
async fn test_parse_logged_variables() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: produce_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_variables().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_bits256 = response.decode_logs_with_type::<Bits256>()?;
    let log_string = response.decode_logs_with_type::<SizedAsciiString<4>>()?;
    let log_array = response.decode_logs_with_type::<[u8; 3]>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_bits256, vec![expected_bits256]);
    assert_eq!(log_string, vec!["Fuel"]);
    assert_eq!(log_array, vec![[1, 2, 3]]);
    // ANCHOR_END: produce_logs

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_values() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_values().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_custom_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_custom_types().call().await?;

    let log_test_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_test_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_tuple = response.decode_logs_with_type::<(TestStruct, TestEnum)>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;

    assert_eq!(log_test_struct, vec![expected_struct.clone()]);
    assert_eq!(log_test_enum, vec![expected_enum.clone()]);
    assert_eq!(log_tuple, vec![(expected_struct, expected_enum)]);

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_generic_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_generic_types().call().await?;

    let log_struct = response.decode_logs_with_type::<StructWithGeneric<[_; 3]>>()?;
    let log_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_struct_nested =
        response.decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<[_; 3]>>>()?;
    let log_struct_deeply_nested = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<[_; 3]>>,
    >>()?;

    let l = [1u8, 2u8, 3u8];
    let expected_struct = StructWithGeneric {
        field_1: l,
        field_2: 64,
    };
    let expected_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_struct_nested, vec![expected_nested_struct]);
    assert_eq!(
        log_struct_deeply_nested,
        vec![expected_deeply_nested_struct]
    );

    Ok(())
}

#[tokio::test]
async fn test_decode_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: decode_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_multiple_logs().call().await?;
    let logs = response.decode_logs();
    // ANCHOR_END: decode_logs

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_generic_struct:?}"),
    ];

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
async fn test_decode_logs_with_no_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/contract_test"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let logs = contract_methods
        .initialize_counter(42)
        .call()
        .await?
        .decode_logs();

    assert!(logs.filter_succeeded().is_empty());

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    let call_handler_1 = contract_methods.produce_logs_values();
    let call_handler_2 = contract_methods.produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_multiple_contracts() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let call_handler_1 = contract_instance.methods().produce_logs_values();
    let call_handler_2 = contract_instance2.methods().produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs"),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance2",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id.clone())
        .with_contracts(&[&contract_instance]);

    let call_handler_2 = contract_caller_instance2
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

fn assert_revert_containing_msg(msg: &str, error: Error) {
    assert!(matches!(error, Error::Transaction(Reason::Reverted { .. })));
    if let Error::Transaction(Reason::Reverted { reason, .. }) = error {
        assert!(
            reason.contains(msg),
            "message: \"{msg}\" not contained in reason: \"{reason}\""
        );
    }
}

#[tokio::test]
async fn test_revert_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        ($method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .call()
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
        ($method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(require_primitive, call, "42");
        reverts_with_msg!(require_primitive, simulate, "42");

        reverts_with_msg!(require_string, call, "fuel");
        reverts_with_msg!(require_string, simulate, "fuel");

        reverts_with_msg!(require_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            require_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(require_with_additional_logs, call, "64");
        reverts_with_msg!(require_with_additional_logs, simulate, "64");
    }
    {
        reverts_with_msg!(rev_w_log_primitive, call, "42");
        reverts_with_msg!(rev_w_log_primitive, simulate, "42");

        reverts_with_msg!(rev_w_log_string, call, "fuel");
        reverts_with_msg!(rev_w_log_string, simulate, "fuel");

        reverts_with_msg!(rev_w_log_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            rev_w_log_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_multi_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let contract_methods2 = contract_instance2.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods2.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods2.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_decode_logs() -> Result<()> {
    // ANCHOR: script_logs
    abigen!(Script(
        name = "LogScript",
        abi = "e2e/sway/logs/script_logs/out/release/script_logs-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/logs/script_logs/out/release/script_logs.bin";
    let instance = LogScript::new(wallet.clone(), bin_path);

    let response = instance.main().call().await?;

    let logs = response.decode_logs();
    let log_u64 = response.decode_logs_with_type::<u64>()?;
    // ANCHOR_END: script_logs

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_tuple = (expected_struct.clone(), expected_enum.clone());
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 128u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_tuple:?}"),
        format!("{expected_generic_struct:?}"),
        format!("{expected_generic_enum:?}"),
        format!("{expected_nested_struct:?}"),
        format!("{expected_deeply_nested_struct:?}"),
    ];

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?
        .decode_logs();

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_logs_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Script(
                name = "LogScript",
                project = "e2e/sway/logs/script_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let expected_num_contract_logs = 4;

    let expected_script_logs: Vec<String> = vec![
        // Contract logs
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        // Script logs
        format!("{:?}", true),
        format!("{:?}", 42),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    // ANCHOR: instance_to_contract_id
    let contract_id: ContractId = contract_instance.id().into();
    // ANCHOR_END: instance_to_contract_id

    // ANCHOR: external_contract_ids
    let response = script_instance
        .main(contract_id)
        .with_contract_ids(&[contract_id.into()])
        .call()
        .await?;
    // ANCHOR_END: external_contract_ids

    // ANCHOR: external_contract
    let response = script_instance
        .main(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?;
    // ANCHOR_END: external_contract

    {
        let num_contract_logs = response
            .receipts
            .iter()
            .filter(|receipt| matches!(receipt, Receipt::LogData { id, .. } | Receipt::Log { id, .. } if *id == contract_id))
            .count();

        assert_eq!(num_contract_logs, expected_num_contract_logs);
    }
    {
        let logs = response.decode_logs();

        assert_eq!(logs.filter_succeeded(), expected_script_logs);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_decode_logs_with_type() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let response = script_instance.main().call().await?;

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    let log_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_generic_struct = response.decode_logs_with_type::<StructWithGeneric<TestStruct>>()?;
    let log_generic_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_nested_struct = response
        .decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<TestStruct>>>()?;
    let log_deeply_nested_struct = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<TestStruct>>,
    >>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![128, 64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_generic_struct, vec![expected_generic_struct]);
    assert_eq!(log_generic_enum, vec![expected_generic_enum]);
    assert_eq!(log_nested_struct, vec![expected_nested_struct]);
    assert_eq!(
        log_deeply_nested_struct,
        vec![expected_deeply_nested_struct]
    );
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_script_require_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_revert_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(MatchEnum::RequirePrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RequirePrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RequireString, call, "fuel");
        reverts_with_msg!(MatchEnum::RequireString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, call, "64");
        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, simulate, "64");
    }
    {
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RevWLogString, call, "fuel");
        reverts_with_msg!(MatchEnum::RevWLogString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let error = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractLogs",
                project = "e2e/sway/logs/contract_logs",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "ContractLogs",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let lib_contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_instance.methods().produce_logs_values();

    let call_handler_2 = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&lib_contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let error = multi_call_handler
        .call::<((), ())>()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_script_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_loader_script_require_from_loader_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let contract_binary = "sway/contracts/lib_contract/out/release/lib_contract.bin";
    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;
    let contract_id = contract
        .convert_to_loader(100_000)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;
    let contract_instance = MyContract::new(contract_id, wallet);

    let mut script_instance = script_instance;
    script_instance.convert_into_loader().await?;

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

fn assert_assert_eq_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left == right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

fn assert_assert_ne_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left != right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

#[tokio::test]
async fn test_contract_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/contracts/asserts"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        (($($arg: expr,)*), $method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        (($($arg: expr,)*), $method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!((32, 64,), assert_primitive, call, "assertion failed");
        reverts_with_msg!((32, 64,), assert_primitive, simulate, "assertion failed");
    }

    macro_rules! reverts_with_assert_eq_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_eq_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, call, "assertion failed");
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;
        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            simulate,
            "assertion failed"
        );
    }

    macro_rules! reverts_with_assert_ne_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_ne_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, call, "assertion failed");
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            simulate,
            "assertion failed"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_script_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_asserts"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    macro_rules! reverts_with_assert_eq_ne_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            call,
            "assertion failed"
        );
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            simulate,
            "assertion failed"
        );
    }
    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }

    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }

    Ok(())
}

#[tokio::test]
async fn contract_token_ops_error_messages() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/token_ops"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let contract_id = contract_instance.contract_id();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());
        let address = wallet.address();

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .simulate(Execution::Realistic)
            .await
            .expect_err("should return a revert error");
        assert_revert_containing_msg("failed transfer to address", error);

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .call()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("failed transfer to address", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_log_results() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let response = contract_instance
        .methods()
        .produce_bad_logs()
        .call()
        .await?;

    let log = response.decode_logs();

    let expected_err = format!(
        "codec: missing log formatter for log_id: `LogId({:?}, \"128\")`, data: `{:?}`. \
         Consider adding external contracts using `with_contracts()`",
        contract_instance.id().hash,
        [0u8; 8]
    );

    let succeeded = log.filter_succeeded();
    let failed = log.filter_failed();
    assert_eq!(succeeded, vec!["123".to_string()]);
    assert_eq!(failed.first().unwrap().to_string(), expected_err);

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_contract_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/contracts/needs_custom_decoder"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let methods = contract_instance.methods();
    {
        // Single call: decoding with too low max_tokens fails
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "Should have failed since there are more tokens than what is supported by default.",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "Should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Single call: increasing limits makes the test pass
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }
    {
        // Multi call: decoding with too low max_tokens will fail
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "should have failed since there are more tokens than what is supported by default",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Multi call: increasing limits makes the test pass
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_script_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_needs_custom_decoder_logging"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    {
        // Cannot decode the produced log with too low max_tokens
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response
            .decode_logs_with_type::<[u8; 1000]>()
            .expect_err("Cannot decode the log with default decoder config");

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty())
    }
    {
        // When the token limit is bumped log decoding succeeds
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty())
    }

    Ok(())
}

#[tokio::test]
async fn contract_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );
    let contract_methods = contract_instance.methods();

    {
        let response = contract_methods.produce_string_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let response = contract_methods.produce_string_log().call().await?;
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let response = contract_methods.produce_bytes_log().call().await?;
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let response = contract_methods.produce_raw_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let response = contract_methods.produce_vec_log().call().await?;
        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}

#[tokio::test]
async fn script_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_heap_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    let response = script_instance.main().call().await?;

    {
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}
```

And this is an example that uses `with_contract_ids(&[&contract_id, ...])`.

```rust,ignore
use fuels::{
    core::codec::DecoderConfig,
    prelude::*,
    types::{errors::transaction::Reason, AsciiString, Bits256, SizedAsciiString},
};

#[tokio::test]
async fn test_parse_logged_variables() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: produce_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_variables().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_bits256 = response.decode_logs_with_type::<Bits256>()?;
    let log_string = response.decode_logs_with_type::<SizedAsciiString<4>>()?;
    let log_array = response.decode_logs_with_type::<[u8; 3]>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_bits256, vec![expected_bits256]);
    assert_eq!(log_string, vec!["Fuel"]);
    assert_eq!(log_array, vec![[1, 2, 3]]);
    // ANCHOR_END: produce_logs

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_values() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_values().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_custom_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_custom_types().call().await?;

    let log_test_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_test_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_tuple = response.decode_logs_with_type::<(TestStruct, TestEnum)>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;

    assert_eq!(log_test_struct, vec![expected_struct.clone()]);
    assert_eq!(log_test_enum, vec![expected_enum.clone()]);
    assert_eq!(log_tuple, vec![(expected_struct, expected_enum)]);

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_generic_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_generic_types().call().await?;

    let log_struct = response.decode_logs_with_type::<StructWithGeneric<[_; 3]>>()?;
    let log_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_struct_nested =
        response.decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<[_; 3]>>>()?;
    let log_struct_deeply_nested = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<[_; 3]>>,
    >>()?;

    let l = [1u8, 2u8, 3u8];
    let expected_struct = StructWithGeneric {
        field_1: l,
        field_2: 64,
    };
    let expected_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_struct_nested, vec![expected_nested_struct]);
    assert_eq!(
        log_struct_deeply_nested,
        vec![expected_deeply_nested_struct]
    );

    Ok(())
}

#[tokio::test]
async fn test_decode_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: decode_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_multiple_logs().call().await?;
    let logs = response.decode_logs();
    // ANCHOR_END: decode_logs

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_generic_struct:?}"),
    ];

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
async fn test_decode_logs_with_no_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/contract_test"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let logs = contract_methods
        .initialize_counter(42)
        .call()
        .await?
        .decode_logs();

    assert!(logs.filter_succeeded().is_empty());

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    let call_handler_1 = contract_methods.produce_logs_values();
    let call_handler_2 = contract_methods.produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_multiple_contracts() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let call_handler_1 = contract_instance.methods().produce_logs_values();
    let call_handler_2 = contract_instance2.methods().produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs"),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance2",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id.clone())
        .with_contracts(&[&contract_instance]);

    let call_handler_2 = contract_caller_instance2
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

fn assert_revert_containing_msg(msg: &str, error: Error) {
    assert!(matches!(error, Error::Transaction(Reason::Reverted { .. })));
    if let Error::Transaction(Reason::Reverted { reason, .. }) = error {
        assert!(
            reason.contains(msg),
            "message: \"{msg}\" not contained in reason: \"{reason}\""
        );
    }
}

#[tokio::test]
async fn test_revert_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        ($method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .call()
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
        ($method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(require_primitive, call, "42");
        reverts_with_msg!(require_primitive, simulate, "42");

        reverts_with_msg!(require_string, call, "fuel");
        reverts_with_msg!(require_string, simulate, "fuel");

        reverts_with_msg!(require_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            require_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(require_with_additional_logs, call, "64");
        reverts_with_msg!(require_with_additional_logs, simulate, "64");
    }
    {
        reverts_with_msg!(rev_w_log_primitive, call, "42");
        reverts_with_msg!(rev_w_log_primitive, simulate, "42");

        reverts_with_msg!(rev_w_log_string, call, "fuel");
        reverts_with_msg!(rev_w_log_string, simulate, "fuel");

        reverts_with_msg!(rev_w_log_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            rev_w_log_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_multi_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let contract_methods2 = contract_instance2.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods2.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods2.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_decode_logs() -> Result<()> {
    // ANCHOR: script_logs
    abigen!(Script(
        name = "LogScript",
        abi = "e2e/sway/logs/script_logs/out/release/script_logs-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/logs/script_logs/out/release/script_logs.bin";
    let instance = LogScript::new(wallet.clone(), bin_path);

    let response = instance.main().call().await?;

    let logs = response.decode_logs();
    let log_u64 = response.decode_logs_with_type::<u64>()?;
    // ANCHOR_END: script_logs

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_tuple = (expected_struct.clone(), expected_enum.clone());
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 128u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_tuple:?}"),
        format!("{expected_generic_struct:?}"),
        format!("{expected_generic_enum:?}"),
        format!("{expected_nested_struct:?}"),
        format!("{expected_deeply_nested_struct:?}"),
    ];

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?
        .decode_logs();

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_logs_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Script(
                name = "LogScript",
                project = "e2e/sway/logs/script_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let expected_num_contract_logs = 4;

    let expected_script_logs: Vec<String> = vec![
        // Contract logs
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        // Script logs
        format!("{:?}", true),
        format!("{:?}", 42),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    // ANCHOR: instance_to_contract_id
    let contract_id: ContractId = contract_instance.id().into();
    // ANCHOR_END: instance_to_contract_id

    // ANCHOR: external_contract_ids
    let response = script_instance
        .main(contract_id)
        .with_contract_ids(&[contract_id.into()])
        .call()
        .await?;
    // ANCHOR_END: external_contract_ids

    // ANCHOR: external_contract
    let response = script_instance
        .main(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?;
    // ANCHOR_END: external_contract

    {
        let num_contract_logs = response
            .receipts
            .iter()
            .filter(|receipt| matches!(receipt, Receipt::LogData { id, .. } | Receipt::Log { id, .. } if *id == contract_id))
            .count();

        assert_eq!(num_contract_logs, expected_num_contract_logs);
    }
    {
        let logs = response.decode_logs();

        assert_eq!(logs.filter_succeeded(), expected_script_logs);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_decode_logs_with_type() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let response = script_instance.main().call().await?;

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    let log_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_generic_struct = response.decode_logs_with_type::<StructWithGeneric<TestStruct>>()?;
    let log_generic_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_nested_struct = response
        .decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<TestStruct>>>()?;
    let log_deeply_nested_struct = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<TestStruct>>,
    >>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![128, 64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_generic_struct, vec![expected_generic_struct]);
    assert_eq!(log_generic_enum, vec![expected_generic_enum]);
    assert_eq!(log_nested_struct, vec![expected_nested_struct]);
    assert_eq!(
        log_deeply_nested_struct,
        vec![expected_deeply_nested_struct]
    );
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_script_require_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_revert_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(MatchEnum::RequirePrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RequirePrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RequireString, call, "fuel");
        reverts_with_msg!(MatchEnum::RequireString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, call, "64");
        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, simulate, "64");
    }
    {
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RevWLogString, call, "fuel");
        reverts_with_msg!(MatchEnum::RevWLogString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let error = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractLogs",
                project = "e2e/sway/logs/contract_logs",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "ContractLogs",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let lib_contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_instance.methods().produce_logs_values();

    let call_handler_2 = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&lib_contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let error = multi_call_handler
        .call::<((), ())>()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_script_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_loader_script_require_from_loader_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let contract_binary = "sway/contracts/lib_contract/out/release/lib_contract.bin";
    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;
    let contract_id = contract
        .convert_to_loader(100_000)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;
    let contract_instance = MyContract::new(contract_id, wallet);

    let mut script_instance = script_instance;
    script_instance.convert_into_loader().await?;

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

fn assert_assert_eq_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left == right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

fn assert_assert_ne_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left != right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

#[tokio::test]
async fn test_contract_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/contracts/asserts"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        (($($arg: expr,)*), $method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        (($($arg: expr,)*), $method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!((32, 64,), assert_primitive, call, "assertion failed");
        reverts_with_msg!((32, 64,), assert_primitive, simulate, "assertion failed");
    }

    macro_rules! reverts_with_assert_eq_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_eq_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, call, "assertion failed");
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;
        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            simulate,
            "assertion failed"
        );
    }

    macro_rules! reverts_with_assert_ne_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_ne_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, call, "assertion failed");
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            simulate,
            "assertion failed"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_script_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_asserts"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    macro_rules! reverts_with_assert_eq_ne_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            call,
            "assertion failed"
        );
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            simulate,
            "assertion failed"
        );
    }
    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }

    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }

    Ok(())
}

#[tokio::test]
async fn contract_token_ops_error_messages() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/token_ops"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let contract_id = contract_instance.contract_id();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());
        let address = wallet.address();

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .simulate(Execution::Realistic)
            .await
            .expect_err("should return a revert error");
        assert_revert_containing_msg("failed transfer to address", error);

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .call()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("failed transfer to address", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_log_results() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let response = contract_instance
        .methods()
        .produce_bad_logs()
        .call()
        .await?;

    let log = response.decode_logs();

    let expected_err = format!(
        "codec: missing log formatter for log_id: `LogId({:?}, \"128\")`, data: `{:?}`. \
         Consider adding external contracts using `with_contracts()`",
        contract_instance.id().hash,
        [0u8; 8]
    );

    let succeeded = log.filter_succeeded();
    let failed = log.filter_failed();
    assert_eq!(succeeded, vec!["123".to_string()]);
    assert_eq!(failed.first().unwrap().to_string(), expected_err);

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_contract_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/contracts/needs_custom_decoder"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let methods = contract_instance.methods();
    {
        // Single call: decoding with too low max_tokens fails
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "Should have failed since there are more tokens than what is supported by default.",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "Should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Single call: increasing limits makes the test pass
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }
    {
        // Multi call: decoding with too low max_tokens will fail
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "should have failed since there are more tokens than what is supported by default",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Multi call: increasing limits makes the test pass
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_script_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_needs_custom_decoder_logging"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    {
        // Cannot decode the produced log with too low max_tokens
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response
            .decode_logs_with_type::<[u8; 1000]>()
            .expect_err("Cannot decode the log with default decoder config");

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty())
    }
    {
        // When the token limit is bumped log decoding succeeds
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty())
    }

    Ok(())
}

#[tokio::test]
async fn contract_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );
    let contract_methods = contract_instance.methods();

    {
        let response = contract_methods.produce_string_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let response = contract_methods.produce_string_log().call().await?;
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let response = contract_methods.produce_bytes_log().call().await?;
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let response = contract_methods.produce_raw_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let response = contract_methods.produce_vec_log().call().await?;
        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}

#[tokio::test]
async fn script_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_heap_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    let response = script_instance.main().call().await?;

    {
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}
```

## Configurable constants

Same as contracts, you can define `configurable` constants in `scripts` which can be changed during the script execution. Here is an example how the constants are defined.

```rust,ignore
script;

#[allow(dead_code)]
enum EnumWithGeneric<D> {
    VariantOne: D,
    VariantTwo: (),
}

struct StructWithGeneric<D> {
    field_1: D,
    field_2: u64,
}

configurable {
    BOOL: bool = true,
    U8: u8 = 8,
    U16: u16 = 16,
    U32: u32 = 32,
    U64: u64 = 63,
    U256: u256 = 0x0000000000000000000000000000000000000000000000000000000000000008u256,
    B256: b256 = 0x0101010101010101010101010101010101010101010101010101010101010101,
    STR_4: str[4] = __to_str_array("fuel"),
    TUPLE: (u8, bool) = (8, true),
    ARRAY: [u32; 3] = [253, 254, 255],
    STRUCT: StructWithGeneric<u8> = StructWithGeneric {
        field_1: 8,
        field_2: 16,
    },
    ENUM: EnumWithGeneric<bool> = EnumWithGeneric::VariantOne(true),
}
//U128: u128 = 128, //TODO: add once https://github.com/FuelLabs/sway/issues/5356 is done

fn main() -> (bool, u8, u16, u32, u64, u256, b256, str[4], (u8, bool), [u32; 3], StructWithGeneric<u8>, EnumWithGeneric<bool>) {
    (BOOL, U8, U16, U32, U64, U256, B256, STR_4, TUPLE, ARRAY, STRUCT, ENUM)
}
```

Each configurable constant will get a dedicated `with` method in the SDK. For example, the constant `STR_4` will get the `with_STR_4` method which accepts the same type defined in sway. Below is an example where we chain several `with` methods and execute the script with the new constants.

```rust,ignore
use fuels::{
    core::codec::EncoderConfig,
    prelude::*,
    types::{Bits256, SizedAsciiString, U256},
};

#[tokio::test]
async fn contract_default_configurables() -> Result<()> {
    abigen!(Contract(
        name = "MyContract",
        abi = "e2e/sway/contracts/configurables/out/release/configurables-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;

    let contract_id = Contract::load_from(
        "sway/contracts/configurables/out/release/configurables.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id, wallet.clone());

    let response = contract_instance
        .methods()
        .return_configurables()
        .call()
        .await?;

    let expected_value = (
        true,
        8,
        16,
        32,
        63,
        U256::from(8),
        Bits256([1; 32]),
        "fuel".try_into()?,
        (8, true),
        [253, 254, 255],
        StructWithGeneric {
            field_1: 8u8,
            field_2: 16,
        },
        EnumWithGeneric::VariantOne(true),
    );

    assert_eq!(response.value, expected_value);

    Ok(())
}

#[tokio::test]
async fn script_default_configurables() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "MyScript",
            project = "e2e/sway/scripts/script_configurables"
        )),
        LoadScript(
            name = "script_instance",
            script = "MyScript",
            wallet = "wallet"
        )
    );

    let mut script_instance = script_instance;
    script_instance.convert_into_loader().await?;

    let response = script_instance.main().call().await?;

    let expected_value = (
        true,
        8,
        16,
        32,
        63,
        U256::from(8),
        Bits256([1; 32]),
        "fuel".try_into()?,
        (8, true),
        [253, 254, 255],
        StructWithGeneric {
            field_1: 8u8,
            field_2: 16,
        },
        EnumWithGeneric::VariantOne(true),
    );

    assert_eq!(response.value, expected_value);

    Ok(())
}

#[tokio::test]
async fn contract_configurables() -> Result<()> {
    // ANCHOR: contract_configurables
    abigen!(Contract(
        name = "MyContract",
        abi = "e2e/sway/contracts/configurables/out/release/configurables-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;

    let str_4: SizedAsciiString<4> = "FUEL".try_into()?;
    let new_struct = StructWithGeneric {
        field_1: 16u8,
        field_2: 32,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyContractConfigurables::default()
        .with_BOOL(false)?
        .with_U8(7)?
        .with_U16(15)?
        .with_U32(31)?
        .with_U64(63)?
        .with_U256(U256::from(8))?
        .with_B256(Bits256([2; 32]))?
        .with_STR_4(str_4.clone())?
        .with_TUPLE((7, false))?
        .with_ARRAY([252, 253, 254])?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let contract_id = Contract::load_from(
        "sway/contracts/configurables/out/release/configurables.bin",
        LoadConfiguration::default().with_configurables(configurables),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id, wallet.clone());
    // ANCHOR_END: contract_configurables

    let response = contract_instance
        .methods()
        .return_configurables()
        .call()
        .await?;

    let expected_value = (
        false,
        7,
        15,
        31,
        63,
        U256::from(8),
        Bits256([2; 32]),
        str_4,
        (7, false),
        [252, 253, 254],
        new_struct,
        new_enum,
    );

    assert_eq!(response.value, expected_value);

    Ok(())
}

#[tokio::test]
async fn contract_manual_configurables() -> Result<()> {
    setup_program_test!(
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/contracts/configurables"
        )),
        Wallets("wallet")
    );

    let str_4: SizedAsciiString<4> = "FUEL".try_into()?;
    let new_struct = StructWithGeneric {
        field_1: 16u8,
        field_2: 32,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyContractConfigurables::default()
        .with_BOOL(false)?
        .with_U8(7)?
        .with_U16(15)?
        .with_U32(31)?
        .with_U64(63)?
        .with_U256(U256::from(8))?
        .with_B256(Bits256([2; 32]))?
        .with_STR_4(str_4.clone())?
        .with_TUPLE((7, false))?
        .with_ARRAY([252, 253, 254])?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let contract_id = Contract::load_from(
        "sway/contracts/configurables/out/release/configurables.bin",
        LoadConfiguration::default(),
    )?
    .with_configurables(configurables)
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id, wallet.clone());

    let response = contract_instance
        .methods()
        .return_configurables()
        .call()
        .await?;

    let expected_value = (
        false,
        7,
        15,
        31,
        63,
        U256::from(8),
        Bits256([2; 32]),
        str_4,
        (7, false),
        [252, 253, 254],
        new_struct,
        new_enum,
    );

    assert_eq!(response.value, expected_value);

    Ok(())
}

#[tokio::test]
async fn script_configurables() -> Result<()> {
    // ANCHOR: script_configurables
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/script_configurables/out/release/script_configurables-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/scripts/script_configurables/out/release/script_configurables.bin";
    let instance = MyScript::new(wallet, bin_path);

    let str_4: SizedAsciiString<4> = "FUEL".try_into()?;
    let new_struct = StructWithGeneric {
        field_1: 16u8,
        field_2: 32,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyScriptConfigurables::new(EncoderConfig {
        max_tokens: 5,
        ..Default::default()
    })
    .with_BOOL(false)?
    .with_U8(7)?
    .with_U16(15)?
    .with_U32(31)?
    .with_U64(63)?
    .with_U256(U256::from(8))?
    .with_B256(Bits256([2; 32]))?
    .with_STR_4(str_4.clone())?
    .with_TUPLE((7, false))?
    .with_ARRAY([252, 253, 254])?
    .with_STRUCT(new_struct.clone())?
    .with_ENUM(new_enum.clone())?;

    let response = instance
        .with_configurables(configurables)
        .main()
        .call()
        .await?;
    // ANCHOR_END: script_configurables

    let expected_value = (
        false,
        7,
        15,
        31,
        63,
        U256::from(8),
        Bits256([2; 32]),
        str_4,
        (7, false),
        [252, 253, 254],
        new_struct,
        new_enum,
    );

    assert_eq!(response.value, expected_value);

    Ok(())
}

#[tokio::test]
async fn configurable_encoder_config_is_applied() {
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/script_configurables/out/release/script_configurables-abi.json"
    ));

    let new_struct = StructWithGeneric {
        field_1: 16u8,
        field_2: 32,
    };

    {
        let _configurables = MyScriptConfigurables::default()
            .with_STRUCT(new_struct.clone())
            .expect("no encoder config, it works");
    }
    {
        let encoder_config = EncoderConfig {
            max_tokens: 1,
            ..Default::default()
        };

        // Fails when a wrong encoder config is set
        let configurables_error = MyScriptConfigurables::new(encoder_config)
            .with_STRUCT(new_struct)
            .expect_err("should error");

        assert!(configurables_error
            .to_string()
            .contains("token limit `1` reached while encoding. Try increasing it"),)
    }
}
```
