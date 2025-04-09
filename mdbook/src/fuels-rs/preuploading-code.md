# Pre-uploading code

If you have a script or predicate that is larger than normal or which you plan
on calling often, you can pre-upload its code as a blob to the network and run a
loader script/predicate instead. The loader can be configured with the
script/predicate configurables, so you can change how the script/predicate is
configured on each run without having large transactions due to the code
duplication.

## Scripts

A high level pre-upload:

```rust,ignore
```rust\nuse std::time::Duration;

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
}\n```
```

The upload of the blob is handled inside of the `convert_into_loader` method. If you
want more fine-grained control over it, you can create the script transaction
manually:

```rust,ignore
```rust\nuse std::time::Duration;

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
}\n```
```

## Predicates

You can prepare a predicate for pre-uploading without doing network requests:

```rust,ignore
```rust\nuse std::default::Default;

use fuels::{
    core::{
        codec::{ABIEncoder, EncoderConfig},
        traits::Tokenizable,
    },
    prelude::*,
    programs::executable::Executable,
    types::{coin::Coin, coin_type::CoinType, input::Input, message::Message, output::Output},
};

async fn assert_address_balance(
    address: &Bech32Address,
    provider: &Provider,
    asset_id: AssetId,
    amount: u64,
) {
    let balance = provider
        .get_asset_balance(address, asset_id)
        .await
        .expect("Could not retrieve balance");
    assert_eq!(balance, amount);
}

fn get_test_coins_and_messages(
    address: &Bech32Address,
    num_coins: u64,
    num_messages: u64,
    amount: u64,
    start_nonce: u64,
) -> (Vec<Coin>, Vec<Message>, AssetId) {
    let asset_id = AssetId::zeroed();
    let coins = setup_single_asset_coins(address, asset_id, num_coins, amount);
    let messages = (0..num_messages)
        .map(|i| {
            setup_single_message(
                &Bech32Address::default(),
                address,
                amount,
                (start_nonce + i).into(),
                vec![],
            )
        })
        .collect();

    (coins, messages, asset_id)
}

fn get_test_message_w_data(address: &Bech32Address, amount: u64, nonce: u64) -> Message {
    setup_single_message(
        &Bech32Address::default(),
        address,
        amount,
        nonce.into(),
        vec![1, 2, 3],
    )
}

// Setup function used to assign coins and messages to a predicate address
// and create a `receiver` wallet
async fn setup_predicate_test(
    predicate_address: &Bech32Address,
    num_coins: u64,
    num_messages: u64,
    amount: u64,
) -> Result<(Provider, u64, WalletUnlocked, u64, AssetId, WalletUnlocked)> {
    let receiver_num_coins = 1;
    let receiver_amount = 1;
    let receiver_balance = receiver_num_coins * receiver_amount;

    let predicate_balance = (num_coins + num_messages) * amount;
    let mut receiver = WalletUnlocked::new_random(None);
    let mut extra_wallet = WalletUnlocked::new_random(None);

    let (mut coins, messages, asset_id) =
        get_test_coins_and_messages(predicate_address, num_coins, num_messages, amount, 0);

    coins.extend(setup_single_asset_coins(
        receiver.address(),
        asset_id,
        receiver_num_coins,
        receiver_amount,
    ));
    coins.extend(setup_single_asset_coins(
        extra_wallet.address(),
        AssetId::zeroed(),
        10_000,
        10_000,
    ));

    coins.extend(setup_single_asset_coins(
        predicate_address,
        AssetId::from([1u8; 32]),
        num_coins,
        amount,
    ));

    let provider = setup_test_provider(coins, messages, None, None).await?;
    receiver.set_provider(provider.clone());
    extra_wallet.set_provider(provider.clone());

    Ok((
        provider,
        predicate_balance,
        receiver,
        receiver_balance,
        asset_id,
        extra_wallet,
    ))
}

#[tokio::test]
async fn transfer_coins_and_messages_to_predicate() -> Result<()> {
    let num_coins = 16;
    let num_messages = 32;
    let amount = 64;
    let total_balance = (num_coins + num_messages) * amount;

    let mut wallet = WalletUnlocked::new_random(None);

    let (coins, messages, asset_id) =
        get_test_coins_and_messages(wallet.address(), num_coins, num_messages, amount, 0);

    let provider = setup_test_provider(coins, messages, None, None).await?;

    wallet.set_provider(provider.clone());

    let predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    wallet
        .transfer(
            predicate.address(),
            total_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has received the funds
    assert_address_balance(
        predicate.address(),
        &provider,
        asset_id,
        total_balance - expected_fee,
    )
    .await;
    Ok(())
}

#[tokio::test]
async fn spend_predicate_coins_messages_basic() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(4097, 4097)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn pay_with_predicate() -> Result<()> {
    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi = "e2e/sway/types/predicates/u64/out/release/u64-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(32768)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/types/predicates/u64/out/release/u64.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();
    let tx_policies = TxPolicies::default()
        .with_tip(1)
        .with_script_gas_limit(1_000_000);

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    let consensus_parameters = provider.consensus_parameters().await?;
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        192 - expected_fee
    );

    let response = contract_methods
        .initialize_counter(42) // Build the ABI call
        .with_tx_policies(tx_policies)
        .call()
        .await?;

    assert_eq!(42, response.value);
    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 2;
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        191 - expected_fee
    );

    Ok(())
}

#[tokio::test]
async fn pay_with_predicate_vector_data() -> Result<()> {
    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi =
                "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(12, 30, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();
    let tx_policies = TxPolicies::default()
        .with_tip(1)
        .with_script_gas_limit(1_000_000);

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    let consensus_parameters = provider.consensus_parameters().await?;
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        192 - expected_fee
    );

    let response = contract_methods
        .initialize_counter(42)
        .with_tx_policies(tx_policies)
        .call()
        .await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 2;
    assert_eq!(42, response.value);
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        191 - expected_fee
    );

    Ok(())
}

#[tokio::test]
async fn predicate_contract_transfer() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(2, 40, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 300;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_balances = provider.get_contract_balances(&contract_id).await?;
    assert!(contract_balances.is_empty());

    let amount = 300;
    predicate
        .force_transfer_to_contract(
            &contract_id,
            amount,
            AssetId::zeroed(),
            TxPolicies::default(),
        )
        .await?;

    let contract_balances = predicate
        .try_provider()?
        .get_contract_balances(&contract_id)
        .await?;
    assert_eq!(contract_balances.len(), 1);

    let random_asset_balance = contract_balances.get(&AssetId::zeroed()).unwrap();
    assert_eq!(*random_asset_balance, 300);

    Ok(())
}

#[tokio::test]
async fn predicate_transfer_to_base_layer() -> Result<()> {
    use std::str::FromStr;

    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(22, 20, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 300;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let amount = 1000;
    let base_layer_address =
        Address::from_str("0x4710162c2e3a95a6faff05139150017c9e38e5e280432d546fae345d6ce6d8fe")?;
    let base_layer_address = Bech32Address::from(base_layer_address);

    let (tx_id, msg_nonce, _receipts) = predicate
        .withdraw_to_base_layer(&base_layer_address, amount, TxPolicies::default())
        .await?;

    // Create the next commit block to be able generate the proof
    provider.produce_blocks(1, None).await?;

    let proof = predicate
        .try_provider()?
        .get_message_proof(&tx_id, &msg_nonce, None, Some(2))
        .await?;

    assert_eq!(proof.amount, amount);
    assert_eq!(proof.recipient, base_layer_address);

    Ok(())
}

#[tokio::test]
async fn predicate_transfer_with_signed_resources() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(2, 40, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let predicate_num_coins = 4;
    let predicate_num_messages = 3;
    let predicate_amount = 1000;
    let predicate_balance = (predicate_num_coins + predicate_num_messages) * predicate_amount;

    let mut wallet = WalletUnlocked::new_random(None);
    let wallet_num_coins = 4;
    let wallet_num_messages = 3;
    let wallet_amount = 1000;
    let wallet_balance = (wallet_num_coins + wallet_num_messages) * wallet_amount;

    let (mut coins, mut messages, asset_id) = get_test_coins_and_messages(
        predicate.address(),
        predicate_num_coins,
        predicate_num_messages,
        predicate_amount,
        0,
    );
    let (wallet_coins, wallet_messages, _) = get_test_coins_and_messages(
        wallet.address(),
        wallet_num_coins,
        wallet_num_messages,
        wallet_amount,
        predicate_num_messages,
    );

    coins.extend(wallet_coins);
    messages.extend(wallet_messages);

    let provider = setup_test_provider(coins, messages, None, None).await?;
    wallet.set_provider(provider.clone());
    predicate.set_provider(provider.clone());

    let mut inputs = wallet
        .get_asset_inputs_for_amount(asset_id, wallet_balance, None)
        .await?;
    let predicate_inputs = predicate
        .get_asset_inputs_for_amount(asset_id, predicate_balance, None)
        .await?;
    inputs.extend(predicate_inputs);

    let outputs = vec![Output::change(predicate.address().into(), 0, asset_id)];

    let mut tb = ScriptTransactionBuilder::prepare_transfer(inputs, outputs, Default::default());
    tb.add_signer(wallet.clone())?;

    let tx = tb.build(&provider).await?;

    provider.send_transaction_and_await_commit(tx).await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    assert_address_balance(
        predicate.address(),
        &provider,
        asset_id,
        predicate_balance + wallet_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn contract_tx_and_call_params_with_predicate() -> Result<()> {
    use fuels::prelude::*;

    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi =
                "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(22, 20, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 1;
    let num_messages = 1;
    let amount = 1000;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "./sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;
    println!("Contract deployed @ {contract_id}");

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();

    let tx_policies = TxPolicies::default().with_tip(100);

    let call_params_amount = 100;
    let call_params = CallParameters::default()
        .with_amount(call_params_amount)
        .with_asset_id(AssetId::zeroed());

    {
        let response = contract_methods
            .get_msg_amount()
            .with_tx_policies(tx_policies)
            .call_params(call_params.clone())?
            .call()
            .await?;

        // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
        let expected_fee = 2;
        assert_eq!(
            predicate.get_asset_balance(&AssetId::zeroed()).await?,
            1800 - expected_fee
        );
    }
    {
        let custom_asset = AssetId::from([1u8; 32]);

        let response = contract_methods
            .get_msg_amount()
            .call_params(call_params)?
            .add_custom_asset(custom_asset, 100, Some(Bech32Address::default()))
            .call()
            .await?;

        assert_eq!(predicate.get_asset_balance(&custom_asset).await?, 900);
    }

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn diff_asset_predicate_payment() -> Result<()> {
    use fuels::prelude::*;

    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi =
                "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(28, 14, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 1;
    let num_messages = 1;
    let amount = 1_000_000_000;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "./sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();

    let call_params = CallParameters::default()
        .with_amount(1_000_000)
        .with_asset_id(AssetId::from([1u8; 32]));

    let response = contract_methods
        .get_msg_amount()
        .call_params(call_params)?
        .call()
        .await?;

    Ok(())
}

#[tokio::test]
async fn predicate_default_configurables() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_struct = StructWithGeneric {
        field_1: 8u8,
        field_2: 16,
    };
    let new_enum = EnumWithGeneric::VariantOne(true);

    let predicate_data = MyPredicateEncoder::default().encode_data(
        true,
        8,
        (8, true),
        [253, 254, 255],
        new_struct,
        new_enum,
    )?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn predicate_configurables() -> Result<()> {
    // ANCHOR: predicate_configurables
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_tuple = (16, false);
    let new_array = [123, 124, 125];
    let new_struct = StructWithGeneric {
        field_1: 32u8,
        field_2: 64,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyPredicateConfigurables::default()
        .with_U8(8)?
        .with_TUPLE(new_tuple)?
        .with_ARRAY(new_array)?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let predicate_data = MyPredicateEncoder::default()
        .encode_data(true, 8u8, new_tuple, new_array, new_struct, new_enum)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?
    .with_data(predicate_data)
    .with_configurables(configurables);
    // ANCHOR_END: predicate_configurables

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn predicate_adjust_fee_persists_message_w_data() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(4097, 4097)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let amount = 1000;
    let coins = setup_single_asset_coins(predicate.address(), AssetId::zeroed(), 1, amount);
    let message = get_test_message_w_data(predicate.address(), amount, Default::default());
    let message_input = Input::resource_predicate(
        CoinType::Message(message.clone()),
        predicate.code().to_vec(),
        predicate.data().to_vec(),
    );

    let provider = setup_test_provider(coins, vec![message.clone()], None, None).await?;
    predicate.set_provider(provider.clone());

    let mut tb = ScriptTransactionBuilder::prepare_transfer(
        vec![message_input.clone()],
        vec![],
        TxPolicies::default(),
    );
    predicate.adjust_for_fee(&mut tb, 0).await?;

    let tx = tb.build(&provider).await?;

    assert_eq!(tx.inputs().len(), 2);
    assert_eq!(tx.inputs()[0].message_id().unwrap(), message.message_id());

    Ok(())
}

#[tokio::test]
async fn predicate_transfer_non_base_asset() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(32, 32)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let mut wallet = WalletUnlocked::new_random(None);

    let amount = 5;
    let non_base_asset_id = AssetId::new([1; 32]);

    // wallet has base and predicate non base asset
    let mut coins = setup_single_asset_coins(wallet.address(), AssetId::zeroed(), 1, amount);
    coins.extend(setup_single_asset_coins(
        predicate.address(),
        non_base_asset_id,
        1,
        amount,
    ));

    let provider = setup_test_provider(coins, vec![], None, None).await?;
    predicate.set_provider(provider.clone());
    wallet.set_provider(provider.clone());

    let inputs = predicate
        .get_asset_inputs_for_amount(non_base_asset_id, amount, None)
        .await?;
    let consensus_parameters = provider.consensus_parameters().await?;
    let outputs = vec![
        Output::change(wallet.address().into(), 0, non_base_asset_id),
        Output::change(
            wallet.address().into(),
            0,
            *consensus_parameters.base_asset_id(),
        ),
    ];

    let mut tb = ScriptTransactionBuilder::prepare_transfer(
        inputs,
        outputs,
        TxPolicies::default().with_tip(1),
    );

    tb.add_signer(wallet.clone())?;
    wallet.adjust_for_fee(&mut tb, 0).await?;

    let tx = tb.build(&provider).await?;

    provider
        .send_transaction_and_await_commit(tx)
        .await?
        .check(None)?;

    let wallet_balance = wallet.get_asset_balance(&non_base_asset_id).await?;

    assert_eq!(wallet_balance, amount);

    Ok(())
}

#[tokio::test]
async fn predicate_can_access_manually_added_witnesses() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_witnesses/out/release/predicate_witnesses-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(0, 1)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_witnesses/out/release/predicate_witnesses.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 0;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let amount_to_send = 12;
    let inputs = predicate
        .get_asset_inputs_for_amount(asset_id, amount_to_send, None)
        .await?;
    let outputs =
        predicate.get_asset_outputs_for_amount(receiver.address(), asset_id, amount_to_send);

    let mut tx = ScriptTransactionBuilder::prepare_transfer(
        inputs,
        outputs,
        TxPolicies::default().with_witness_limit(32),
    )
    .build(&provider)
    .await?;

    let witness = ABIEncoder::default().encode(&[64u64.into_token()])?; // u64 because this is VM memory
    let witness2 = ABIEncoder::default().encode(&[4096u64.into_token()])?;

    tx.append_witness(witness.into())?;
    tx.append_witness(witness2.into())?;

    provider.send_transaction_and_await_commit(tx).await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    // The predicate has spent the funds
    assert_address_balance(
        predicate.address(),
        &provider,
        asset_id,
        predicate_balance - amount_to_send - expected_fee,
    )
    .await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + amount_to_send,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn tx_id_not_changed_after_adding_witnesses() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_witnesses/out/release/predicate_witnesses-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(0, 1)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_witnesses/out/release/predicate_witnesses.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 0;
    let amount = 16;
    let (provider, _predicate_balance, receiver, _receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let amount_to_send = 12;
    let inputs = predicate
        .get_asset_inputs_for_amount(asset_id, amount_to_send, None)
        .await?;
    let outputs =
        predicate.get_asset_outputs_for_amount(receiver.address(), asset_id, amount_to_send);

    let mut tx = ScriptTransactionBuilder::prepare_transfer(
        inputs,
        outputs,
        TxPolicies::default().with_witness_limit(32),
    )
    .build(&provider)
    .await?;

    let consensus_parameters = provider.consensus_parameters().await?;
    let chain_id = consensus_parameters.chain_id();
    let tx_id = tx.id(chain_id);

    let witness = ABIEncoder::default().encode(&[64u64.into_token()])?; // u64 because this is VM memory
    let witness2 = ABIEncoder::default().encode(&[4096u64.into_token()])?;

    tx.append_witness(witness.into())?;
    tx.append_witness(witness2.into())?;
    let tx_id_after_witnesses = tx.id(chain_id);

    let tx_id_from_provider = provider.send_transaction(tx).await?;

    assert_eq!(tx_id, tx_id_after_witnesses);
    assert_eq!(tx_id, tx_id_from_provider);

    Ok(())
}

#[tokio::test]
async fn predicate_encoder_config_is_applied() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));
    {
        let _encoding_ok = MyPredicateEncoder::default()
            .encode_data(4097, 4097)
            .expect("should not fail as it uses the default encoder config");
    }
    {
        let encoder_config = EncoderConfig {
            max_tokens: 1,
            ..Default::default()
        };
        let encoding_error = MyPredicateEncoder::new(encoder_config)
            .encode_data(4097, 4097)
            .expect_err("should fail");

        assert!(encoding_error
            .to_string()
            .contains("token limit `1` reached while encoding"));
    }

    Ok(())
}

#[tokio::test]
async fn predicate_transfers_non_base_asset() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(4097, 4097)?;
    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_message = 6;
    let amount = 20;
    let (provider, _, receiver, _, _, _) =
        setup_predicate_test(predicate.address(), num_coins, num_message, amount).await?;
    predicate.set_provider(provider);
    let other_asset_id = AssetId::from([1u8; 32]);

    let send_amount = num_coins * amount;
    predicate
        .transfer(
            receiver.address(),
            send_amount,
            other_asset_id,
            TxPolicies::default(),
        )
        .await?;

    assert_eq!(predicate.get_asset_balance(&other_asset_id).await?, 0,);

    assert_eq!(
        receiver.get_asset_balance(&other_asset_id).await?,
        send_amount,
    );

    Ok(())
}

#[tokio::test]
async fn predicate_with_invalid_data_fails() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(0, 100)?;
    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_message = 6;
    let amount = 20;
    let (provider, _, receiver, _, _, _) =
        setup_predicate_test(predicate.address(), num_coins, num_message, amount).await?;
    predicate.set_provider(provider);
    let other_asset_id = AssetId::from([1u8; 32]);

    let send_amount = num_coins * amount;
    let error_string = predicate
        .transfer(
            receiver.address(),
            send_amount,
            other_asset_id,
            TxPolicies::default(),
        )
        .await
        .unwrap_err()
        .to_string();

    assert!(error_string.contains("PredicateVerificationFailed(Panic(PredicateReturnedNonOne))"));
    assert_eq!(receiver.get_asset_balance(&other_asset_id).await?, 0);

    Ok(())
}

#[tokio::test]
async fn predicate_blobs() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_blobs/out/release/predicate_blobs-abi.json"
    ));

    // ANCHOR: preparing_the_predicate
    let configurables = MyPredicateConfigurables::default().with_SECRET_NUMBER(10001)?;

    let predicate_data = MyPredicateEncoder::default().encode_data(1, 19)?;

    let executable =
        Executable::load_from("sway/predicates/predicate_blobs/out/release/predicate_blobs.bin")?;

    let loader = executable
        .convert_to_loader()?
        .with_configurables(configurables);

    let mut predicate: Predicate = Predicate::from_code(loader.code()).with_data(predicate_data);
    // ANCHOR_END: preparing_the_predicate

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, extra_wallet) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    // we don't want to pay with the recipient wallet so that we don't affect the assertion we're
    // gonna make later on
    // ANCHOR: uploading_the_blob
    loader.upload_blob(extra_wallet).await?;

    predicate.set_provider(provider.clone());

    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;
    // ANCHOR_END: uploading_the_blob

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn predicate_configurables_in_blobs() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_tuple = (16, false);
    let new_array = [123, 124, 125];
    let new_struct = StructWithGeneric {
        field_1: 32u8,
        field_2: 64,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyPredicateConfigurables::default()
        .with_U8(8)?
        .with_TUPLE(new_tuple)?
        .with_ARRAY(new_array)?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let predicate_data = MyPredicateEncoder::default()
        .encode_data(true, 8u8, new_tuple, new_array, new_struct, new_enum)?;

    let executable = Executable::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?;

    let loader = executable
        .convert_to_loader()?
        .with_configurables(configurables);

    let mut predicate: Predicate = Predicate::from_code(loader.code()).with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, extra_wallet) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    loader.upload_blob(extra_wallet).await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}\n```
```

Once you want to execute the predicate, you must beforehand upload the blob
containing its code:

```rust,ignore
```rust\nuse std::default::Default;

use fuels::{
    core::{
        codec::{ABIEncoder, EncoderConfig},
        traits::Tokenizable,
    },
    prelude::*,
    programs::executable::Executable,
    types::{coin::Coin, coin_type::CoinType, input::Input, message::Message, output::Output},
};

async fn assert_address_balance(
    address: &Bech32Address,
    provider: &Provider,
    asset_id: AssetId,
    amount: u64,
) {
    let balance = provider
        .get_asset_balance(address, asset_id)
        .await
        .expect("Could not retrieve balance");
    assert_eq!(balance, amount);
}

fn get_test_coins_and_messages(
    address: &Bech32Address,
    num_coins: u64,
    num_messages: u64,
    amount: u64,
    start_nonce: u64,
) -> (Vec<Coin>, Vec<Message>, AssetId) {
    let asset_id = AssetId::zeroed();
    let coins = setup_single_asset_coins(address, asset_id, num_coins, amount);
    let messages = (0..num_messages)
        .map(|i| {
            setup_single_message(
                &Bech32Address::default(),
                address,
                amount,
                (start_nonce + i).into(),
                vec![],
            )
        })
        .collect();

    (coins, messages, asset_id)
}

fn get_test_message_w_data(address: &Bech32Address, amount: u64, nonce: u64) -> Message {
    setup_single_message(
        &Bech32Address::default(),
        address,
        amount,
        nonce.into(),
        vec![1, 2, 3],
    )
}

// Setup function used to assign coins and messages to a predicate address
// and create a `receiver` wallet
async fn setup_predicate_test(
    predicate_address: &Bech32Address,
    num_coins: u64,
    num_messages: u64,
    amount: u64,
) -> Result<(Provider, u64, WalletUnlocked, u64, AssetId, WalletUnlocked)> {
    let receiver_num_coins = 1;
    let receiver_amount = 1;
    let receiver_balance = receiver_num_coins * receiver_amount;

    let predicate_balance = (num_coins + num_messages) * amount;
    let mut receiver = WalletUnlocked::new_random(None);
    let mut extra_wallet = WalletUnlocked::new_random(None);

    let (mut coins, messages, asset_id) =
        get_test_coins_and_messages(predicate_address, num_coins, num_messages, amount, 0);

    coins.extend(setup_single_asset_coins(
        receiver.address(),
        asset_id,
        receiver_num_coins,
        receiver_amount,
    ));
    coins.extend(setup_single_asset_coins(
        extra_wallet.address(),
        AssetId::zeroed(),
        10_000,
        10_000,
    ));

    coins.extend(setup_single_asset_coins(
        predicate_address,
        AssetId::from([1u8; 32]),
        num_coins,
        amount,
    ));

    let provider = setup_test_provider(coins, messages, None, None).await?;
    receiver.set_provider(provider.clone());
    extra_wallet.set_provider(provider.clone());

    Ok((
        provider,
        predicate_balance,
        receiver,
        receiver_balance,
        asset_id,
        extra_wallet,
    ))
}

#[tokio::test]
async fn transfer_coins_and_messages_to_predicate() -> Result<()> {
    let num_coins = 16;
    let num_messages = 32;
    let amount = 64;
    let total_balance = (num_coins + num_messages) * amount;

    let mut wallet = WalletUnlocked::new_random(None);

    let (coins, messages, asset_id) =
        get_test_coins_and_messages(wallet.address(), num_coins, num_messages, amount, 0);

    let provider = setup_test_provider(coins, messages, None, None).await?;

    wallet.set_provider(provider.clone());

    let predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    wallet
        .transfer(
            predicate.address(),
            total_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has received the funds
    assert_address_balance(
        predicate.address(),
        &provider,
        asset_id,
        total_balance - expected_fee,
    )
    .await;
    Ok(())
}

#[tokio::test]
async fn spend_predicate_coins_messages_basic() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(4097, 4097)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn pay_with_predicate() -> Result<()> {
    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi = "e2e/sway/types/predicates/u64/out/release/u64-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(32768)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/types/predicates/u64/out/release/u64.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();
    let tx_policies = TxPolicies::default()
        .with_tip(1)
        .with_script_gas_limit(1_000_000);

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    let consensus_parameters = provider.consensus_parameters().await?;
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        192 - expected_fee
    );

    let response = contract_methods
        .initialize_counter(42) // Build the ABI call
        .with_tx_policies(tx_policies)
        .call()
        .await?;

    assert_eq!(42, response.value);
    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 2;
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        191 - expected_fee
    );

    Ok(())
}

#[tokio::test]
async fn pay_with_predicate_vector_data() -> Result<()> {
    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi =
                "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(12, 30, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();
    let tx_policies = TxPolicies::default()
        .with_tip(1)
        .with_script_gas_limit(1_000_000);

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    let consensus_parameters = provider.consensus_parameters().await?;
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        192 - expected_fee
    );

    let response = contract_methods
        .initialize_counter(42)
        .with_tx_policies(tx_policies)
        .call()
        .await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 2;
    assert_eq!(42, response.value);
    assert_eq!(
        predicate
            .get_asset_balance(consensus_parameters.base_asset_id())
            .await?,
        191 - expected_fee
    );

    Ok(())
}

#[tokio::test]
async fn predicate_contract_transfer() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(2, 40, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 300;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_balances = provider.get_contract_balances(&contract_id).await?;
    assert!(contract_balances.is_empty());

    let amount = 300;
    predicate
        .force_transfer_to_contract(
            &contract_id,
            amount,
            AssetId::zeroed(),
            TxPolicies::default(),
        )
        .await?;

    let contract_balances = predicate
        .try_provider()?
        .get_contract_balances(&contract_id)
        .await?;
    assert_eq!(contract_balances.len(), 1);

    let random_asset_balance = contract_balances.get(&AssetId::zeroed()).unwrap();
    assert_eq!(*random_asset_balance, 300);

    Ok(())
}

#[tokio::test]
async fn predicate_transfer_to_base_layer() -> Result<()> {
    use std::str::FromStr;

    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(22, 20, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 300;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let amount = 1000;
    let base_layer_address =
        Address::from_str("0x4710162c2e3a95a6faff05139150017c9e38e5e280432d546fae345d6ce6d8fe")?;
    let base_layer_address = Bech32Address::from(base_layer_address);

    let (tx_id, msg_nonce, _receipts) = predicate
        .withdraw_to_base_layer(&base_layer_address, amount, TxPolicies::default())
        .await?;

    // Create the next commit block to be able generate the proof
    provider.produce_blocks(1, None).await?;

    let proof = predicate
        .try_provider()?
        .get_message_proof(&tx_id, &msg_nonce, None, Some(2))
        .await?;

    assert_eq!(proof.amount, amount);
    assert_eq!(proof.recipient, base_layer_address);

    Ok(())
}

#[tokio::test]
async fn predicate_transfer_with_signed_resources() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(2, 40, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let predicate_num_coins = 4;
    let predicate_num_messages = 3;
    let predicate_amount = 1000;
    let predicate_balance = (predicate_num_coins + predicate_num_messages) * predicate_amount;

    let mut wallet = WalletUnlocked::new_random(None);
    let wallet_num_coins = 4;
    let wallet_num_messages = 3;
    let wallet_amount = 1000;
    let wallet_balance = (wallet_num_coins + wallet_num_messages) * wallet_amount;

    let (mut coins, mut messages, asset_id) = get_test_coins_and_messages(
        predicate.address(),
        predicate_num_coins,
        predicate_num_messages,
        predicate_amount,
        0,
    );
    let (wallet_coins, wallet_messages, _) = get_test_coins_and_messages(
        wallet.address(),
        wallet_num_coins,
        wallet_num_messages,
        wallet_amount,
        predicate_num_messages,
    );

    coins.extend(wallet_coins);
    messages.extend(wallet_messages);

    let provider = setup_test_provider(coins, messages, None, None).await?;
    wallet.set_provider(provider.clone());
    predicate.set_provider(provider.clone());

    let mut inputs = wallet
        .get_asset_inputs_for_amount(asset_id, wallet_balance, None)
        .await?;
    let predicate_inputs = predicate
        .get_asset_inputs_for_amount(asset_id, predicate_balance, None)
        .await?;
    inputs.extend(predicate_inputs);

    let outputs = vec![Output::change(predicate.address().into(), 0, asset_id)];

    let mut tb = ScriptTransactionBuilder::prepare_transfer(inputs, outputs, Default::default());
    tb.add_signer(wallet.clone())?;

    let tx = tb.build(&provider).await?;

    provider.send_transaction_and_await_commit(tx).await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    assert_address_balance(
        predicate.address(),
        &provider,
        asset_id,
        predicate_balance + wallet_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn contract_tx_and_call_params_with_predicate() -> Result<()> {
    use fuels::prelude::*;

    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi =
                "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(22, 20, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 1;
    let num_messages = 1;
    let amount = 1000;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "./sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;
    println!("Contract deployed @ {contract_id}");

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();

    let tx_policies = TxPolicies::default().with_tip(100);

    let call_params_amount = 100;
    let call_params = CallParameters::default()
        .with_amount(call_params_amount)
        .with_asset_id(AssetId::zeroed());

    {
        let response = contract_methods
            .get_msg_amount()
            .with_tx_policies(tx_policies)
            .call_params(call_params.clone())?
            .call()
            .await?;

        // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
        let expected_fee = 2;
        assert_eq!(
            predicate.get_asset_balance(&AssetId::zeroed()).await?,
            1800 - expected_fee
        );
    }
    {
        let custom_asset = AssetId::from([1u8; 32]);

        let response = contract_methods
            .get_msg_amount()
            .call_params(call_params)?
            .add_custom_asset(custom_asset, 100, Some(Bech32Address::default()))
            .call()
            .await?;

        assert_eq!(predicate.get_asset_balance(&custom_asset).await?, 900);
    }

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn diff_asset_predicate_payment() -> Result<()> {
    use fuels::prelude::*;

    abigen!(
        Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ),
        Predicate(
            name = "MyPredicate",
            abi =
                "e2e/sway/types/predicates/predicate_vector/out/release/predicate_vector-abi.json"
        )
    );

    let predicate_data = MyPredicateEncoder::default().encode_data(28, 14, vec![2, 4, 42])?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/types/predicates/predicate_vector/out/release/predicate_vector.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 1;
    let num_messages = 1;
    let amount = 1_000_000_000;
    let (provider, _predicate_balance, _receiver, _receiver_balance, _asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let contract_id = Contract::load_from(
        "./sway/contracts/contract_test/out/release/contract_test.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&predicate, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id.clone(), predicate.clone()).methods();

    let call_params = CallParameters::default()
        .with_amount(1_000_000)
        .with_asset_id(AssetId::from([1u8; 32]));

    let response = contract_methods
        .get_msg_amount()
        .call_params(call_params)?
        .call()
        .await?;

    Ok(())
}

#[tokio::test]
async fn predicate_default_configurables() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_struct = StructWithGeneric {
        field_1: 8u8,
        field_2: 16,
    };
    let new_enum = EnumWithGeneric::VariantOne(true);

    let predicate_data = MyPredicateEncoder::default().encode_data(
        true,
        8,
        (8, true),
        [253, 254, 255],
        new_struct,
        new_enum,
    )?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn predicate_configurables() -> Result<()> {
    // ANCHOR: predicate_configurables
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_tuple = (16, false);
    let new_array = [123, 124, 125];
    let new_struct = StructWithGeneric {
        field_1: 32u8,
        field_2: 64,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyPredicateConfigurables::default()
        .with_U8(8)?
        .with_TUPLE(new_tuple)?
        .with_ARRAY(new_array)?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let predicate_data = MyPredicateEncoder::default()
        .encode_data(true, 8u8, new_tuple, new_array, new_struct, new_enum)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?
    .with_data(predicate_data)
    .with_configurables(configurables);
    // ANCHOR_END: predicate_configurables

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn predicate_adjust_fee_persists_message_w_data() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(4097, 4097)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let amount = 1000;
    let coins = setup_single_asset_coins(predicate.address(), AssetId::zeroed(), 1, amount);
    let message = get_test_message_w_data(predicate.address(), amount, Default::default());
    let message_input = Input::resource_predicate(
        CoinType::Message(message.clone()),
        predicate.code().to_vec(),
        predicate.data().to_vec(),
    );

    let provider = setup_test_provider(coins, vec![message.clone()], None, None).await?;
    predicate.set_provider(provider.clone());

    let mut tb = ScriptTransactionBuilder::prepare_transfer(
        vec![message_input.clone()],
        vec![],
        TxPolicies::default(),
    );
    predicate.adjust_for_fee(&mut tb, 0).await?;

    let tx = tb.build(&provider).await?;

    assert_eq!(tx.inputs().len(), 2);
    assert_eq!(tx.inputs()[0].message_id().unwrap(), message.message_id());

    Ok(())
}

#[tokio::test]
async fn predicate_transfer_non_base_asset() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(32, 32)?;

    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let mut wallet = WalletUnlocked::new_random(None);

    let amount = 5;
    let non_base_asset_id = AssetId::new([1; 32]);

    // wallet has base and predicate non base asset
    let mut coins = setup_single_asset_coins(wallet.address(), AssetId::zeroed(), 1, amount);
    coins.extend(setup_single_asset_coins(
        predicate.address(),
        non_base_asset_id,
        1,
        amount,
    ));

    let provider = setup_test_provider(coins, vec![], None, None).await?;
    predicate.set_provider(provider.clone());
    wallet.set_provider(provider.clone());

    let inputs = predicate
        .get_asset_inputs_for_amount(non_base_asset_id, amount, None)
        .await?;
    let consensus_parameters = provider.consensus_parameters().await?;
    let outputs = vec![
        Output::change(wallet.address().into(), 0, non_base_asset_id),
        Output::change(
            wallet.address().into(),
            0,
            *consensus_parameters.base_asset_id(),
        ),
    ];

    let mut tb = ScriptTransactionBuilder::prepare_transfer(
        inputs,
        outputs,
        TxPolicies::default().with_tip(1),
    );

    tb.add_signer(wallet.clone())?;
    wallet.adjust_for_fee(&mut tb, 0).await?;

    let tx = tb.build(&provider).await?;

    provider
        .send_transaction_and_await_commit(tx)
        .await?
        .check(None)?;

    let wallet_balance = wallet.get_asset_balance(&non_base_asset_id).await?;

    assert_eq!(wallet_balance, amount);

    Ok(())
}

#[tokio::test]
async fn predicate_can_access_manually_added_witnesses() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_witnesses/out/release/predicate_witnesses-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(0, 1)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_witnesses/out/release/predicate_witnesses.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 0;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let amount_to_send = 12;
    let inputs = predicate
        .get_asset_inputs_for_amount(asset_id, amount_to_send, None)
        .await?;
    let outputs =
        predicate.get_asset_outputs_for_amount(receiver.address(), asset_id, amount_to_send);

    let mut tx = ScriptTransactionBuilder::prepare_transfer(
        inputs,
        outputs,
        TxPolicies::default().with_witness_limit(32),
    )
    .build(&provider)
    .await?;

    let witness = ABIEncoder::default().encode(&[64u64.into_token()])?; // u64 because this is VM memory
    let witness2 = ABIEncoder::default().encode(&[4096u64.into_token()])?;

    tx.append_witness(witness.into())?;
    tx.append_witness(witness2.into())?;

    provider.send_transaction_and_await_commit(tx).await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    // The predicate has spent the funds
    assert_address_balance(
        predicate.address(),
        &provider,
        asset_id,
        predicate_balance - amount_to_send - expected_fee,
    )
    .await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + amount_to_send,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn tx_id_not_changed_after_adding_witnesses() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_witnesses/out/release/predicate_witnesses-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(0, 1)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_witnesses/out/release/predicate_witnesses.bin",
    )?
    .with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 0;
    let amount = 16;
    let (provider, _predicate_balance, receiver, _receiver_balance, asset_id, _) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    let amount_to_send = 12;
    let inputs = predicate
        .get_asset_inputs_for_amount(asset_id, amount_to_send, None)
        .await?;
    let outputs =
        predicate.get_asset_outputs_for_amount(receiver.address(), asset_id, amount_to_send);

    let mut tx = ScriptTransactionBuilder::prepare_transfer(
        inputs,
        outputs,
        TxPolicies::default().with_witness_limit(32),
    )
    .build(&provider)
    .await?;

    let consensus_parameters = provider.consensus_parameters().await?;
    let chain_id = consensus_parameters.chain_id();
    let tx_id = tx.id(chain_id);

    let witness = ABIEncoder::default().encode(&[64u64.into_token()])?; // u64 because this is VM memory
    let witness2 = ABIEncoder::default().encode(&[4096u64.into_token()])?;

    tx.append_witness(witness.into())?;
    tx.append_witness(witness2.into())?;
    let tx_id_after_witnesses = tx.id(chain_id);

    let tx_id_from_provider = provider.send_transaction(tx).await?;

    assert_eq!(tx_id, tx_id_after_witnesses);
    assert_eq!(tx_id, tx_id_from_provider);

    Ok(())
}

#[tokio::test]
async fn predicate_encoder_config_is_applied() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));
    {
        let _encoding_ok = MyPredicateEncoder::default()
            .encode_data(4097, 4097)
            .expect("should not fail as it uses the default encoder config");
    }
    {
        let encoder_config = EncoderConfig {
            max_tokens: 1,
            ..Default::default()
        };
        let encoding_error = MyPredicateEncoder::new(encoder_config)
            .encode_data(4097, 4097)
            .expect_err("should fail");

        assert!(encoding_error
            .to_string()
            .contains("token limit `1` reached while encoding"));
    }

    Ok(())
}

#[tokio::test]
async fn predicate_transfers_non_base_asset() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(4097, 4097)?;
    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_message = 6;
    let amount = 20;
    let (provider, _, receiver, _, _, _) =
        setup_predicate_test(predicate.address(), num_coins, num_message, amount).await?;
    predicate.set_provider(provider);
    let other_asset_id = AssetId::from([1u8; 32]);

    let send_amount = num_coins * amount;
    predicate
        .transfer(
            receiver.address(),
            send_amount,
            other_asset_id,
            TxPolicies::default(),
        )
        .await?;

    assert_eq!(predicate.get_asset_balance(&other_asset_id).await?, 0,);

    assert_eq!(
        receiver.get_asset_balance(&other_asset_id).await?,
        send_amount,
    );

    Ok(())
}

#[tokio::test]
async fn predicate_with_invalid_data_fails() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
    ));

    let predicate_data = MyPredicateEncoder::default().encode_data(0, 100)?;
    let mut predicate: Predicate =
        Predicate::load_from("sway/predicates/basic_predicate/out/release/basic_predicate.bin")?
            .with_data(predicate_data);

    let num_coins = 4;
    let num_message = 6;
    let amount = 20;
    let (provider, _, receiver, _, _, _) =
        setup_predicate_test(predicate.address(), num_coins, num_message, amount).await?;
    predicate.set_provider(provider);
    let other_asset_id = AssetId::from([1u8; 32]);

    let send_amount = num_coins * amount;
    let error_string = predicate
        .transfer(
            receiver.address(),
            send_amount,
            other_asset_id,
            TxPolicies::default(),
        )
        .await
        .unwrap_err()
        .to_string();

    assert!(error_string.contains("PredicateVerificationFailed(Panic(PredicateReturnedNonOne))"));
    assert_eq!(receiver.get_asset_balance(&other_asset_id).await?, 0);

    Ok(())
}

#[tokio::test]
async fn predicate_blobs() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_blobs/out/release/predicate_blobs-abi.json"
    ));

    // ANCHOR: preparing_the_predicate
    let configurables = MyPredicateConfigurables::default().with_SECRET_NUMBER(10001)?;

    let predicate_data = MyPredicateEncoder::default().encode_data(1, 19)?;

    let executable =
        Executable::load_from("sway/predicates/predicate_blobs/out/release/predicate_blobs.bin")?;

    let loader = executable
        .convert_to_loader()?
        .with_configurables(configurables);

    let mut predicate: Predicate = Predicate::from_code(loader.code()).with_data(predicate_data);
    // ANCHOR_END: preparing_the_predicate

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, extra_wallet) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    // we don't want to pay with the recipient wallet so that we don't affect the assertion we're
    // gonna make later on
    // ANCHOR: uploading_the_blob
    loader.upload_blob(extra_wallet).await?;

    predicate.set_provider(provider.clone());

    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;
    // ANCHOR_END: uploading_the_blob

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}

#[tokio::test]
async fn predicate_configurables_in_blobs() -> Result<()> {
    abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_tuple = (16, false);
    let new_array = [123, 124, 125];
    let new_struct = StructWithGeneric {
        field_1: 32u8,
        field_2: 64,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyPredicateConfigurables::default()
        .with_U8(8)?
        .with_TUPLE(new_tuple)?
        .with_ARRAY(new_array)?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let predicate_data = MyPredicateEncoder::default()
        .encode_data(true, 8u8, new_tuple, new_array, new_struct, new_enum)?;

    let executable = Executable::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?;

    let loader = executable
        .convert_to_loader()?
        .with_configurables(configurables);

    let mut predicate: Predicate = Predicate::from_code(loader.code()).with_data(predicate_data);

    let num_coins = 4;
    let num_messages = 8;
    let amount = 16;
    let (provider, predicate_balance, receiver, receiver_balance, asset_id, extra_wallet) =
        setup_predicate_test(predicate.address(), num_coins, num_messages, amount).await?;

    predicate.set_provider(provider.clone());

    loader.upload_blob(extra_wallet).await?;

    // TODO: https://github.com/FuelLabs/fuels-rs/issues/1394
    let expected_fee = 1;
    predicate
        .transfer(
            receiver.address(),
            predicate_balance - expected_fee,
            asset_id,
            TxPolicies::default(),
        )
        .await?;

    // The predicate has spent the funds
    assert_address_balance(predicate.address(), &provider, asset_id, 0).await;

    // Funds were transferred
    assert_address_balance(
        receiver.address(),
        &provider,
        asset_id,
        receiver_balance + predicate_balance - expected_fee,
    )
    .await;

    Ok(())
}\n```
```

By pre-uploading the predicate code, you allow for cheaper calls to the predicate
from subsequent callers.
