# Transaction policies

<!-- This section should explain what tx policies are and how to configure them -->
<!-- tx_policies:example:start -->
Transaction policies are defined as follows:

```rust,ignore
```rust\nuse std::{collections::HashMap, fmt::Debug};

use async_trait::async_trait;
use fuel_crypto::{Message, Signature};
use fuel_tx::{
    field::{
        Inputs, Maturity, MintAmount, MintAssetId, Outputs, Policies as PoliciesField,
        Script as ScriptField, ScriptData, ScriptGasLimit, WitnessLimit, Witnesses,
    },
    input::{
        coin::{CoinPredicate, CoinSigned},
        message::{
            MessageCoinPredicate, MessageCoinSigned, MessageDataPredicate, MessageDataSigned,
        },
    },
    policies::PolicyType,
    Blob, Bytes32, Cacheable, Chargeable, ConsensusParameters, Create, FormatValidityChecks, Input,
    Mint, Output, Salt as FuelSalt, Script, StorageSlot, Transaction as FuelTransaction,
    TransactionFee, UniqueIdentifier, Upgrade, Upload, Witness,
};
use fuel_types::{bytes::padded_len_usize, AssetId, ChainId};
use itertools::Itertools;

use crate::{
    traits::Signer,
    types::{
        bech32::Bech32Address,
        errors::{error, error_transaction, Error, Result},
        DryRunner,
    },
    utils::{calculate_witnesses_size, sealed},
};

#[derive(Default, Debug, Clone)]
pub struct Transactions {
    fuel_transactions: Vec<FuelTransaction>,
}

impl Transactions {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn insert(mut self, tx: impl Into<FuelTransaction>) -> Self {
        self.fuel_transactions.push(tx.into());

        self
    }

    pub fn as_slice(&self) -> &[FuelTransaction] {
        &self.fuel_transactions
    }
}

#[derive(Default, Debug, Clone, PartialEq, Eq)]
pub struct MintTransaction {
    tx: Box<Mint>,
}

impl From<MintTransaction> for FuelTransaction {
    fn from(mint: MintTransaction) -> Self {
        (*mint.tx).into()
    }
}

impl From<MintTransaction> for Mint {
    fn from(tx: MintTransaction) -> Self {
        *tx.tx
    }
}

impl From<Mint> for MintTransaction {
    fn from(tx: Mint) -> Self {
        Self { tx: Box::new(tx) }
    }
}

impl MintTransaction {
    pub fn check_without_signatures(
        &self,
        block_height: u32,
        consensus_parameters: &ConsensusParameters,
    ) -> Result<()> {
        Ok(self
            .tx
            .check_without_signatures(block_height.into(), consensus_parameters)?)
    }
    #[must_use]
    pub fn id(&self, chain_id: ChainId) -> Bytes32 {
        self.tx.id(&chain_id)
    }

    #[must_use]
    pub fn mint_asset_id(&self) -> &AssetId {
        self.tx.mint_asset_id()
    }

    #[must_use]
    pub fn mint_amount(&self) -> u64 {
        *self.tx.mint_amount()
    }
}

#[derive(Default, Debug, Copy, Clone)]
// ANCHOR: tx_policies_struct
pub struct TxPolicies {
    tip: Option<u64>,
    witness_limit: Option<u64>,
    maturity: Option<u64>,
    max_fee: Option<u64>,
    script_gas_limit: Option<u64>,
}
// ANCHOR_END: tx_policies_struct

impl TxPolicies {
    pub fn new(
        tip: Option<u64>,
        witness_limit: Option<u64>,
        maturity: Option<u64>,
        max_fee: Option<u64>,
        script_gas_limit: Option<u64>,
    ) -> Self {
        Self {
            tip,
            witness_limit,
            maturity,
            max_fee,
            script_gas_limit,
        }
    }

    pub fn with_tip(mut self, tip: u64) -> Self {
        self.tip = Some(tip);
        self
    }

    pub fn tip(&self) -> Option<u64> {
        self.tip
    }

    pub fn with_witness_limit(mut self, witness_limit: u64) -> Self {
        self.witness_limit = Some(witness_limit);
        self
    }

    pub fn witness_limit(&self) -> Option<u64> {
        self.witness_limit
    }

    pub fn with_maturity(mut self, maturity: u64) -> Self {
        self.maturity = Some(maturity);
        self
    }

    pub fn maturity(&self) -> Option<u64> {
        self.maturity
    }

    pub fn with_max_fee(mut self, max_fee: u64) -> Self {
        self.max_fee = Some(max_fee);
        self
    }

    pub fn max_fee(&self) -> Option<u64> {
        self.max_fee
    }

    pub fn with_script_gas_limit(mut self, script_gas_limit: u64) -> Self {
        self.script_gas_limit = Some(script_gas_limit);
        self
    }

    pub fn script_gas_limit(&self) -> Option<u64> {
        self.script_gas_limit
    }
}

use fuel_tx::field::{BytecodeWitnessIndex, Salt, StorageSlots};

use crate::types::coin_type_id::CoinTypeId;

#[derive(Debug, Clone)]
pub enum TransactionType {
    Script(ScriptTransaction),
    Create(CreateTransaction),
    Mint(MintTransaction),
    Upload(UploadTransaction),
    Upgrade(UpgradeTransaction),
    Blob(BlobTransaction),
    Unknown,
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
pub trait EstimablePredicates: sealed::Sealed {
    /// If a transaction contains predicates, we have to estimate them
    /// before sending the transaction to the node. The estimation will check
    /// all predicates and set the `predicate_gas_used` to the actual consumed gas.
    async fn estimate_predicates(
        &mut self,
        provider: impl DryRunner,
        latest_chain_executor_version: Option<u32>,
    ) -> Result<()>;
}

pub trait GasValidation: sealed::Sealed {
    fn validate_gas(&self, _gas_used: u64) -> Result<()>;
}

pub trait ValidatablePredicates: sealed::Sealed {
    /// If a transaction contains predicates, we can verify that these predicates validate, ie
    /// that they return `true`
    fn validate_predicates(
        self,
        consensus_parameters: &ConsensusParameters,
        block_height: u32,
    ) -> Result<()>;
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
pub trait Transaction:
    TryFrom<FuelTransaction, Error = Error>
    + Into<FuelTransaction>
    + EstimablePredicates
    + ValidatablePredicates
    + GasValidation
    + Clone
    + Debug
    + sealed::Sealed
{
    fn fee_checked_from_tx(
        &self,
        consensus_parameters: &ConsensusParameters,
        gas_price: u64,
    ) -> Option<TransactionFee>;

    fn max_gas(&self, consensus_parameters: &ConsensusParameters) -> u64;

    /// Performs all stateless transaction validity checks. This includes the validity
    /// of fields according to rules in the specification and validity of signatures.
    /// <https://github.com/FuelLabs/fuel-specs/blob/master/src/tx-format/transaction.md>
    fn check(&self, block_height: u32, consensus_parameters: &ConsensusParameters) -> Result<()>;

    fn id(&self, chain_id: ChainId) -> Bytes32;

    fn maturity(&self) -> u32;

    fn with_maturity(self, maturity: u32) -> Self;

    fn metered_bytes_size(&self) -> usize;

    fn inputs(&self) -> &Vec<Input>;

    fn outputs(&self) -> &Vec<Output>;

    fn witnesses(&self) -> &Vec<Witness>;

    fn max_fee(&self) -> Option<u64>;

    fn size(&self) -> usize;

    fn witness_limit(&self) -> Option<u64>;

    fn tip(&self) -> Option<u64>;

    fn is_using_predicates(&self) -> bool;

    /// Precompute transaction metadata. The metadata is required for
    /// `check_without_signatures` validation.
    fn precompute(&mut self, chain_id: &ChainId) -> Result<()>;

    /// Append witness and return the corresponding witness index
    fn append_witness(&mut self, witness: Witness) -> Result<usize>;

    fn used_coins(
        &self,
        base_asset_id: &AssetId,
    ) -> HashMap<(Bech32Address, AssetId), Vec<CoinTypeId>>;

    async fn sign_with(
        &mut self,
        signer: &(impl Signer + Send + Sync),
        chain_id: ChainId,
    ) -> Result<Signature>;
}

impl TryFrom<TransactionType> for FuelTransaction {
    type Error = Error;
    fn try_from(value: TransactionType) -> Result<Self> {
        match value {
            TransactionType::Script(tx) => Ok(tx.into()),
            TransactionType::Create(tx) => Ok(tx.into()),
            TransactionType::Mint(tx) => Ok(tx.into()),
            TransactionType::Upload(tx) => Ok(tx.into()),
            TransactionType::Upgrade(tx) => Ok(tx.into()),
            TransactionType::Blob(tx) => Ok(tx.into()),
            TransactionType::Unknown => Err(error_transaction!(Other, "`Unknown` transaction")),
        }
    }
}

fn extract_coin_type_id(input: &Input) -> Option<CoinTypeId> {
    if let Some(utxo_id) = input.utxo_id() {
        return Some(CoinTypeId::UtxoId(*utxo_id));
    } else if let Some(nonce) = input.nonce() {
        return Some(CoinTypeId::Nonce(*nonce));
    }

    None
}

pub fn extract_owner_or_recipient(input: &Input) -> Option<Bech32Address> {
    let addr = match input {
        Input::CoinSigned(CoinSigned { owner, .. })
        | Input::CoinPredicate(CoinPredicate { owner, .. }) => Some(owner),
        Input::MessageCoinSigned(MessageCoinSigned { recipient, .. })
        | Input::MessageCoinPredicate(MessageCoinPredicate { recipient, .. })
        | Input::MessageDataSigned(MessageDataSigned { recipient, .. })
        | Input::MessageDataPredicate(MessageDataPredicate { recipient, .. }) => Some(recipient),
        Input::Contract(_) => None,
    };

    addr.map(|addr| Bech32Address::from(*addr))
}

macro_rules! impl_tx_wrapper {
    ($wrapper: ident, $wrapped: ident) => {
        #[derive(Debug, Clone)]
        pub struct $wrapper {
            pub(crate) tx: $wrapped,
            pub(crate) is_using_predicates: bool,
        }

        impl From<$wrapper> for $wrapped {
            fn from(tx: $wrapper) -> Self {
                tx.tx
            }
        }

        impl From<$wrapper> for FuelTransaction {
            fn from(tx: $wrapper) -> Self {
                tx.tx.into()
            }
        }

        impl TryFrom<FuelTransaction> for $wrapper {
            type Error = Error;

            fn try_from(tx: FuelTransaction) -> Result<Self> {
                match tx {
                    FuelTransaction::$wrapped(tx) => Ok(tx.into()),
                    _ => Err(error_transaction!(
                        Other,
                        "couldn't convert Transaction into a wrapper of type $wrapper"
                    )),
                }
            }
        }

        impl From<$wrapped> for $wrapper {
            fn from(tx: $wrapped) -> Self {
                let is_using_predicates = tx.inputs().iter().any(|input| {
                    matches!(
                        input,
                        Input::CoinPredicate { .. }
                            | Input::MessageCoinPredicate { .. }
                            | Input::MessageDataPredicate { .. }
                    )
                });

                $wrapper {
                    tx,
                    is_using_predicates,
                }
            }
        }

        impl ValidatablePredicates for $wrapper {
            fn validate_predicates(
                self,
                _consensus_parameters: &ConsensusParameters,
                _block_height: u32,
            ) -> Result<()> {
                // Can no longer validate predicates locally due to the need for blob storage

                Ok(())
            }
        }

        impl sealed::Sealed for $wrapper {}

        #[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
        #[cfg_attr(not(target_arch = "wasm32"), async_trait)]
        impl Transaction for $wrapper {
            fn max_gas(&self, consensus_parameters: &ConsensusParameters) -> u64 {
                self.tx.max_gas(
                    consensus_parameters.gas_costs(),
                    consensus_parameters.fee_params(),
                )
            }

            fn fee_checked_from_tx(
                &self,
                consensus_parameters: &ConsensusParameters,
                gas_price: u64,
            ) -> Option<TransactionFee> {
                TransactionFee::checked_from_tx(
                    &consensus_parameters.gas_costs(),
                    consensus_parameters.fee_params(),
                    &self.tx,
                    gas_price,
                )
            }

            fn check(
                &self,
                block_height: u32,
                consensus_parameters: &ConsensusParameters,
            ) -> Result<()> {
                Ok(self.tx.check(block_height.into(), consensus_parameters)?)
            }

            fn id(&self, chain_id: ChainId) -> Bytes32 {
                self.tx.id(&chain_id)
            }

            fn maturity(&self) -> u32 {
                (*self.tx.maturity()).into()
            }

            fn with_maturity(mut self, maturity: u32) -> Self {
                self.tx.set_maturity(maturity.into());
                self
            }

            fn metered_bytes_size(&self) -> usize {
                self.tx.metered_bytes_size()
            }

            fn inputs(&self) -> &Vec<Input> {
                self.tx.inputs()
            }

            fn outputs(&self) -> &Vec<Output> {
                self.tx.outputs()
            }

            fn witnesses(&self) -> &Vec<Witness> {
                self.tx.witnesses()
            }

            fn is_using_predicates(&self) -> bool {
                self.is_using_predicates
            }

            fn precompute(&mut self, chain_id: &ChainId) -> Result<()> {
                Ok(self.tx.precompute(chain_id)?)
            }

            fn max_fee(&self) -> Option<u64> {
                self.tx.policies().get(PolicyType::MaxFee)
            }

            fn size(&self) -> usize {
                use fuel_types::canonical::Serialize;
                self.tx.size()
            }

            fn witness_limit(&self) -> Option<u64> {
                self.tx.policies().get(PolicyType::WitnessLimit)
            }

            fn tip(&self) -> Option<u64> {
                self.tx.policies().get(PolicyType::Tip)
            }

            fn append_witness(&mut self, witness: Witness) -> Result<usize> {
                let witness_size = calculate_witnesses_size(
                    self.tx.witnesses().iter().chain(std::iter::once(&witness)),
                );
                let new_witnesses_size = padded_len_usize(witness_size)
                    .ok_or_else(|| error!(Other, "witness size overflow: {witness_size}"))?
                    as u64;

                if new_witnesses_size > self.tx.witness_limit() {
                    Err(error_transaction!(
                        Validation,
                        "Witness limit exceeded. Consider setting the limit manually with \
                        a transaction builder. The new limit should be: `{new_witnesses_size}`"
                    ))
                } else {
                    let idx = self.tx.witnesses().len();
                    self.tx.witnesses_mut().push(witness);

                    Ok(idx)
                }
            }

            fn used_coins(
                &self,
                base_asset_id: &AssetId,
            ) -> HashMap<(Bech32Address, AssetId), Vec<CoinTypeId>> {
                self.inputs()
                    .iter()
                    .filter_map(|input| match input {
                        Input::Contract { .. } => None,
                        _ => {
                            // Not a contract, it's safe to expect.
                            let owner = extract_owner_or_recipient(input).expect("has owner");
                            let asset_id = input
                                .asset_id(base_asset_id)
                                .expect("has `asset_id`")
                                .to_owned();

                            let id = extract_coin_type_id(input).unwrap();
                            Some(((owner, asset_id), id))
                        }
                    })
                    .into_group_map()
            }

            async fn sign_with(
                &mut self,
                signer: &(impl Signer + Send + Sync),
                chain_id: ChainId,
            ) -> Result<Signature> {
                let tx_id = self.id(chain_id);
                let message = Message::from_bytes(*tx_id);
                let signature = signer.sign(message).await?;

                self.append_witness(signature.as_ref().into())?;

                Ok(signature)
            }
        }
    };
}

impl_tx_wrapper!(ScriptTransaction, Script);
impl_tx_wrapper!(CreateTransaction, Create);
impl_tx_wrapper!(UploadTransaction, Upload);
impl_tx_wrapper!(UpgradeTransaction, Upgrade);
impl_tx_wrapper!(BlobTransaction, Blob);

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl EstimablePredicates for UploadTransaction {
    async fn estimate_predicates(
        &mut self,
        provider: impl DryRunner,
        latest_chain_executor_version: Option<u32>,
    ) -> Result<()> {
        let tx = provider
            .estimate_predicates(&self.tx.clone().into(), latest_chain_executor_version)
            .await?;

        tx.as_upload().expect("is upload").clone_into(&mut self.tx);

        Ok(())
    }
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl EstimablePredicates for UpgradeTransaction {
    async fn estimate_predicates(
        &mut self,
        provider: impl DryRunner,
        latest_chain_executor_version: Option<u32>,
    ) -> Result<()> {
        let tx = provider
            .estimate_predicates(&self.tx.clone().into(), latest_chain_executor_version)
            .await?;

        tx.as_upgrade()
            .expect("is upgrade")
            .clone_into(&mut self.tx);

        Ok(())
    }
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl EstimablePredicates for CreateTransaction {
    async fn estimate_predicates(
        &mut self,
        provider: impl DryRunner,
        latest_chain_executor_version: Option<u32>,
    ) -> Result<()> {
        let tx = provider
            .estimate_predicates(&self.tx.clone().into(), latest_chain_executor_version)
            .await?;

        tx.as_create().expect("is create").clone_into(&mut self.tx);

        Ok(())
    }
}

impl CreateTransaction {
    pub fn salt(&self) -> &FuelSalt {
        self.tx.salt()
    }

    pub fn bytecode_witness_index(&self) -> u16 {
        *self.tx.bytecode_witness_index()
    }

    pub fn storage_slots(&self) -> &Vec<StorageSlot> {
        self.tx.storage_slots()
    }
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl EstimablePredicates for ScriptTransaction {
    async fn estimate_predicates(
        &mut self,
        provider: impl DryRunner,
        latest_chain_executor_version: Option<u32>,
    ) -> Result<()> {
        let tx = provider
            .estimate_predicates(&self.tx.clone().into(), latest_chain_executor_version)
            .await?;

        tx.as_script().expect("is script").clone_into(&mut self.tx);

        Ok(())
    }
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl EstimablePredicates for BlobTransaction {
    async fn estimate_predicates(
        &mut self,
        provider: impl DryRunner,
        latest_chain_executor_version: Option<u32>,
    ) -> Result<()> {
        let tx = provider
            .estimate_predicates(&self.tx.clone().into(), latest_chain_executor_version)
            .await?;

        tx.as_blob().expect("is blob").clone_into(&mut self.tx);

        Ok(())
    }
}

impl GasValidation for CreateTransaction {
    fn validate_gas(&self, _gas_used: u64) -> Result<()> {
        Ok(())
    }
}

impl GasValidation for UploadTransaction {
    fn validate_gas(&self, _gas_used: u64) -> Result<()> {
        Ok(())
    }
}

impl GasValidation for UpgradeTransaction {
    fn validate_gas(&self, _gas_used: u64) -> Result<()> {
        Ok(())
    }
}

impl GasValidation for BlobTransaction {
    fn validate_gas(&self, _gas_used: u64) -> Result<()> {
        Ok(())
    }
}

impl GasValidation for ScriptTransaction {
    fn validate_gas(&self, gas_used: u64) -> Result<()> {
        if gas_used > *self.tx.script_gas_limit() {
            return Err(error_transaction!(
                Validation,
                "script_gas_limit({}) is lower than the estimated gas_used({})",
                self.tx.script_gas_limit(),
                gas_used
            ));
        }

        Ok(())
    }
}

impl ScriptTransaction {
    pub fn script(&self) -> &Vec<u8> {
        self.tx.script()
    }

    pub fn script_data(&self) -> &Vec<u8> {
        self.tx.script_data()
    }

    pub fn gas_limit(&self) -> u64 {
        *self.tx.script_gas_limit()
    }

    pub fn with_gas_limit(mut self, gas_limit: u64) -> Self {
        *self.tx.script_gas_limit_mut() = gas_limit;
        self
    }
}

#[cfg(test)]
mod test {

    use fuel_tx::policies::Policies;

    use super::*;

    #[test]
    fn append_witnesses_returns_error_when_limit_exceeded() {
        let mut tx = ScriptTransaction {
            tx: FuelTransaction::script(
                0,
                vec![],
                vec![],
                Policies::default(),
                vec![],
                vec![],
                vec![],
            ),
            is_using_predicates: false,
        };

        let witness = vec![0, 1, 2].into();
        let err = tx.append_witness(witness).expect_err("should error");

        let expected_err_str = "transaction validation: Witness limit exceeded. \
                                Consider setting the limit manually with a transaction builder. \
                                The new limit should be: `16`";

        assert_eq!(&err.to_string(), expected_err_str);
    }
}\n```
```

Where:

1. **Tip** - amount to pay the block producer to prioritize the transaction.
2. **Witness Limit** - The maximum amount of witness data allowed for the transaction.
3. **Maturity** - Block until which the transaction cannot be included.
4. **Max Fee** - The maximum fee payable by this transaction.
5. **Script Gas Limit** - The maximum amount of gas the transaction may consume for executing its script code.

When the **Script Gas Limit** is not set, the Rust SDK will estimate the consumed gas in the background and set it as the limit.

If the **Witness Limit** is not set, the SDK will set it to the size of all witnesses and signatures defined in the transaction builder.

You can configure these parameters by creating an instance of `TxPolicies` and passing it to a chain method called `with_tx_policies`:
<!-- tx_policies:example:end-->

```rust,ignore
```rust\n#[cfg(test)]
mod tests {
    use std::{collections::HashSet, time::Duration};

    use fuels::{
        core::codec::{encode_fn_selector, ABIFormatter, DecoderConfig, EncoderConfig},
        crypto::SecretKey,
        prelude::{LoadConfiguration, NodeConfig, StorageConfiguration},
        programs::debug::ScriptType,
        test_helpers::{ChainConfig, StateConfig},
        types::{
            errors::{transaction::Reason, Result},
            Bits256,
        },
    };
    use rand::Rng;

    #[tokio::test]
    async fn instantiate_client() -> Result<()> {
        // ANCHOR: instantiate_client
        use fuels::prelude::{FuelService, Provider};

        // Run the fuel node.
        let server = FuelService::start(
            NodeConfig::default(),
            ChainConfig::default(),
            StateConfig::default(),
        )
        .await?;

        // Create a client that will talk to the node created above.
        let client = Provider::from(server.bound_address()).await?;
        assert!(client.healthy().await?);
        // ANCHOR_END: instantiate_client
        Ok(())
    }

    #[tokio::test]
    async fn deploy_contract() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract
        // This helper will launch a local node and provide a test wallet linked to it
        let wallet = launch_provider_and_get_wallet().await?;

        // This will load and deploy your contract binary to the chain so that its ID can
        // be used to initialize the instance
        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR_END: deploy_contract

        Ok(())
    }

    #[tokio::test]
    async fn setup_program_test_example() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract_setup_macro_short
        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: deploy_contract_setup_macro_short

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_cost_estimation
        let contract_instance = MyContract::new(contract_id, wallet);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: contract_call_cost_estimation

        let expected_gas = 2816;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_parameters() -> std::result::Result<(), Box<dyn std::error::Error>> {
        use fuels::{prelude::*, tx::StorageSlot, types::Bytes32};
        use rand::prelude::{Rng, SeedableRng, StdRng};

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");

        // ANCHOR: deploy_with_parameters
        // Optional: Add `Salt`
        let rng = &mut StdRng::seed_from_u64(2322u64);
        let salt: [u8; 32] = rng.gen();

        // Optional: Configure storage
        let key = Bytes32::from([1u8; 32]);
        let value = Bytes32::from([2u8; 32]);
        let storage_slot = StorageSlot::new(key, value);
        let storage_configuration =
            StorageConfiguration::default().add_slot_overrides([storage_slot]);
        let configuration = LoadConfiguration::default()
            .with_storage_configuration(storage_configuration)
            .with_salt(salt);

        // Optional: Configure deployment parameters
        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            configuration,
        )?
        .deploy(&wallet, tx_policies)
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        // ANCHOR_END: deploy_with_parameters

        assert_ne!(contract_id_1, contract_id_2);

        // ANCHOR: use_deployed_contract
        // This will generate your contract's methods onto `MyContract`.
        // This means an instance of `MyContract` will have access to all
        // your contract's methods that are running on-chain!
        // ANCHOR: abigen_example
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        // ANCHOR_END: abigen_example

        // This is an instance of your contract which you can use to make calls to your functions
        let contract_instance = MyContract::new(contract_id_2, wallet);

        let response = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call() // Perform the network call
            .await?;

        assert_eq!(42, response.value);

        let response = contract_instance
            .methods()
            .increment_counter(10)
            .call()
            .await?;

        assert_eq!(52, response.value);
        // ANCHOR_END: use_deployed_contract

        // ANCHOR: submit_response_contract
        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .submit()
            .await?;

        tokio::time::sleep(Duration::from_millis(500)).await;
        let value = response.response().await?.value;

        // ANCHOR_END: submit_response_contract
        assert_eq!(42, value);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_multiple_wallets() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallets =
            launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None).await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallets[0], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");
        let contract_instance_1 = MyContract::new(contract_id_1, wallets[0].clone());

        let response = contract_instance_1
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default().with_salt([1; 32]),
        )?
        .deploy(&wallets[1], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        let contract_instance_2 = MyContract::new(contract_id_2, wallets[1].clone());

        let response = contract_instance_2
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call()
            .await?;

        assert_eq!(42, response.value);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn contract_tx_and_call_params() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR: tx_policies
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();

        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let response = contract_methods
            .initialize_counter(42) // Our contract method
            .with_tx_policies(tx_policies) // Chain the tx policies
            .call() // Perform the contract call
            .await?; // This is an async call, `.await` it.
                     // ANCHOR_END: tx_policies

        // ANCHOR: tx_policies_default
        let response = contract_methods
            .initialize_counter(42)
            .with_tx_policies(TxPolicies::default())
            .call()
            .await?;
        // ANCHOR_END: tx_policies_default

        // ANCHOR: call_parameters
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let tx_policies = TxPolicies::default();

        // Forward 1_000_000 coin amount of base asset_id
        // this is a big number for checking that amount can be a u64
        let call_params = CallParameters::default().with_amount(1_000_000);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_parameters

        // ANCHOR: call_parameters_default
        let response = contract_methods
            .initialize_counter(42)
            .call_params(CallParameters::default())?
            .call()
            .await?;
        // ANCHOR_END: call_parameters_default
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn token_ops_tests() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/token_ops/out/release/token_ops-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/token_ops/out/release/token_ops\
        .bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();
        // ANCHOR: simulate
        // you would mint 100 coins if the transaction wasn't simulated
        let counter = contract_methods
            .mint_coins(100)
            .simulate(Execution::Realistic)
            .await?;
        // ANCHOR_END: simulate

        {
            let contract_id = contract_id.clone();
            // ANCHOR: simulate_read_state
            // you don't need any funds to read state
            let balance = contract_methods
                .get_balance(contract_id, AssetId::zeroed())
                .simulate(Execution::StateReadOnly)
                .await?
                .value;
            // ANCHOR_END: simulate_read_state
        }

        let response = contract_methods.mint_coins(1_000_000).call().await?;
        // ANCHOR: variable_outputs
        let address = wallet.address();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());

        // withdraw some tokens to wallet
        let response = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await?;
        // ANCHOR_END: variable_outputs
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn dependency_estimation() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let called_contract_id: ContractId = Contract::load_from(
            "../../e2e/sway/contracts/lib_contract/out/release/lib_contract.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?
        .into();

        let bin_path =
            "../../e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller.bin";
        let caller_contract_id = Contract::load_from(bin_path, LoadConfiguration::default())?
            .deploy(&wallet, TxPolicies::default())
            .await?;

        let contract_methods =
            MyContract::new(caller_contract_id.clone(), wallet.clone()).methods();

        // ANCHOR: dependency_estimation_fail
        let address = wallet.address();
        let amount = 100;

        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .call()
            .await;

        assert!(matches!(
            response,
            Err(Error::Transaction(Reason::Reverted { .. }))
        ));
        // ANCHOR_END: dependency_estimation_fail

        // ANCHOR: dependency_estimation_manual
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .with_contract_ids(&[called_contract_id.into()])
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation_manual

        let asset_id = caller_contract_id.asset_id(&Bits256::zeroed());
        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, amount);

        // ANCHOR: dependency_estimation
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
            .determine_missing_contracts(Some(2))
            .await?
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation

        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, 2 * amount);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn get_contract_outputs() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deployed_contracts
        abigen!(Contract(
            name = "MyContract",
            // Replace with your contract ABI.json path
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        let wallet_original = launch_provider_and_get_wallet().await?;

        let wallet = wallet_original.clone();
        // Your bech32m encoded contract ID.
        let contract_id: Bech32ContractId =
            "fuel1vkm285ypjesypw7vhdlhnty3kjxxx4efckdycqh3ttna4xvmxtfs6murwy".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // You can now use the `connected_contract_instance` just as you did above!
        // ANCHOR_END: deployed_contracts

        let wallet = wallet_original;
        // ANCHOR: deployed_contracts_hex
        let contract_id: ContractId =
            "0x65b6a3d081966040bbccbb7f79ac91b48c635729c59a4c02f15ae7da999b32d3".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // ANCHOR_END: deployed_contracts_hex

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn call_params_gas() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: call_params_gas
        // Set the transaction `gas_limit` to 1_000_000 and `gas_forwarded` to 4300 to specify that
        // the contract call transaction may consume up to 1_000_000 gas, while the actual call may
        // only use 4300 gas
        let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
        let call_params = CallParameters::default().with_gas_forwarded(4300);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_params_gas
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_example() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: multi_call_prepare
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);
        // ANCHOR_END: multi_call_prepare

        // ANCHOR: multi_call_build
        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);
        // ANCHOR_END: multi_call_build
        let multi_call_handler_tmp = multi_call_handler.clone();

        // ANCHOR: multi_call_values
        let (counter, array): (u64, [u64; 2]) = multi_call_handler.call().await?.value;
        // ANCHOR_END: multi_call_values

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: multi_contract_call_response
        let response = multi_call_handler.call::<(u64, [u64; 2])>().await?;
        // ANCHOR_END: multi_contract_call_response

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: submit_response_multicontract
        let submitted_tx = multi_call_handler.submit().await?;
        tokio::time::sleep(Duration::from_millis(500)).await;
        let (counter, array): (u64, [u64; 2]) = submitted_tx.response().await?.value;
        // ANCHOR_END: submit_response_multicontract

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: multi_call_cost_estimation
        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);

        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = multi_call_handler
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: multi_call_cost_estimation

        let expected_gas = 4402;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn connect_wallet() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let config = WalletsConfig::new(Some(2), Some(1), Some(DEFAULT_COIN_AMOUNT));
        let mut wallets = launch_custom_provider_and_get_wallets(config, None, None).await?;
        let wallet_1 = wallets.pop().unwrap();
        let wallet_2 = wallets.pop().unwrap();

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet_1, TxPolicies::default())
        .await?;

        // ANCHOR: connect_wallet
        // Create contract instance with wallet_1
        let contract_instance = MyContract::new(contract_id, wallet_1.clone());

        // Perform contract call with wallet_2
        let response = contract_instance
            .with_account(wallet_2) // Connect wallet_2
            .methods() // Get contract methods
            .get_msg_amount() // Our contract method
            .call() // Perform the contract call.
            .await?; // This is an async call, `.await` for it.
                     // ANCHOR_END: connect_wallet

        Ok(())
    }

    #[tokio::test]
    async fn custom_assets_example() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let other_wallet = WalletUnlocked::new_random(None);

        // ANCHOR: add_custom_assets
        let amount = 1000;
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .add_custom_asset(
                AssetId::zeroed(),
                amount,
                Some(other_wallet.address().clone()),
            )
            .call()
            .await?;
        // ANCHOR_END: add_custom_assets

        Ok(())
    }

    #[tokio::test]
    async fn low_level_call_example() -> Result<()> {
        use fuels::{core::codec::calldata, prelude::*, types::SizedAsciiString};

        setup_program_test!(
            Wallets("wallet"),
            Abigen(
                Contract(
                    name = "MyCallerContract",
                    project = "e2e/sway/contracts/low_level_caller"
                ),
                Contract(
                    name = "MyTargetContract",
                    project = "e2e/sway/contracts/contract_test"
                ),
            ),
            Deploy(
                name = "caller_contract_instance",
                contract = "MyCallerContract",
                wallet = "wallet"
            ),
            Deploy(
                name = "target_contract_instance",
                contract = "MyTargetContract",
                wallet = "wallet"
            ),
        );

        // ANCHOR: low_level_call
        let function_selector = encode_fn_selector("set_value_multiple_complex");
        let call_data = calldata!(
            MyStruct {
                a: true,
                b: [1, 2, 3],
            },
            SizedAsciiString::<4>::try_from("fuel")?
        )?;

        caller_contract_instance
            .methods()
            .call_low_level_call(
                target_contract_instance.id(),
                Bytes(function_selector),
                Bytes(call_data),
            )
            .determine_missing_contracts(None)
            .await?
            .call()
            .await?;
        // ANCHOR_END: low_level_call

        let result_uint = target_contract_instance
            .methods()
            .get_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_bool = target_contract_instance
            .methods()
            .get_bool_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_str = target_contract_instance
            .methods()
            .get_str_value()
            .call()
            .await
            .unwrap()
            .value;

        assert_eq!(result_uint, 2);
        assert!(result_bool);
        assert_eq!(result_str, "fuel");

        Ok(())
    }

    #[tokio::test]
    async fn configure_the_return_value_decoder() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_decoder_config
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .with_decoder_config(DecoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .call()
            .await?;
        // ANCHOR_END: contract_decoder_config

        Ok(())
    }

    #[tokio::test]
    async fn storage_slots_override() -> Result<()> {
        {
            // ANCHOR: storage_slots_override
            use fuels::{programs::contract::Contract, tx::StorageSlot};
            let slot_override = StorageSlot::new([1; 32].into(), [2; 32].into());
            let storage_config =
                StorageConfiguration::default().add_slot_overrides([slot_override]);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_override
        }

        {
            // ANCHOR: storage_slots_disable_autoload
            use fuels::programs::contract::Contract;
            let storage_config = StorageConfiguration::default().with_autoload(false);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_disable_autoload
        }

        Ok(())
    }

    #[tokio::test]
    async fn contract_custom_call() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );
        let provider = wallet.try_provider()?;

        let counter = 42;

        // ANCHOR: contract_call_tb
        let call_handler = contract_instance.methods().initialize_counter(counter);

        let mut tb = call_handler.transaction_builder().await?;

        // customize the builder...

        wallet.adjust_for_fee(&mut tb, 0).await?;
        tb.add_signer(wallet.clone())?;

        let tx = tb.build(provider).await?;

        let tx_id = provider.send_transaction(tx).await?;
        tokio::time::sleep(Duration::from_millis(500)).await;

        let tx_status = provider.tx_status(&tx_id).await?;

        let response = call_handler.get_response_from(tx_status)?;

        assert_eq!(counter, response.value);
        // ANCHOR_END: contract_call_tb

        Ok(())
    }

    #[tokio::test]
    async fn configure_encoder_config() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_encoder_config
        let _ = contract_instance
            .with_encoder_config(EncoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .methods()
            .initialize_counter(42)
            .call()
            .await?;
        // ANCHOR_END: contract_encoder_config

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_impersonation() -> Result<()> {
        use std::str::FromStr;

        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let node_config = NodeConfig {
            utxo_validation: false,
            ..Default::default()
        };
        let mut wallet = WalletUnlocked::new_from_private_key(
            SecretKey::from_str(
                "0x4433d156e8c53bf5b50af07aa95a29436f29a94e0ccc5d58df8e57bdc8583c32",
            )?,
            None,
        );
        let coins = setup_single_asset_coins(
            wallet.address(),
            AssetId::zeroed(),
            DEFAULT_NUM_COINS,
            DEFAULT_COIN_AMOUNT,
        );
        let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
        wallet.set_provider(provider.clone());

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_impersonation
        // create impersonator for an address
        let address =
            Address::from_str("0x17f46f562778f4bb5fe368eeae4985197db51d80c83494ea7f84c530172dedd1")
                .unwrap();
        let address = Bech32Address::from(address);
        let impersonator = ImpersonatedAccount::new(address, Some(provider.clone()));

        let contract_instance = MyContract::new(contract_id, impersonator.clone());

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: contract_call_impersonation

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn deploying_via_loader() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            )),
            Wallets("main_wallet")
        );
        let contract_binary =
            "../../e2e/sway/contracts/huge_contract/out/release/huge_contract.bin";

        let provider: Provider = main_wallet.try_provider()?.clone();

        let random_salt = || Salt::new(rand::thread_rng().gen());
        // ANCHOR: show_contract_is_too_big
        let contract = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?;
        let max_allowed = provider
            .consensus_parameters()
            .await?
            .contract_params()
            .contract_max_size();

        assert!(contract.code().len() as u64 > max_allowed);
        // ANCHOR_END: show_contract_is_too_big

        let wallet = main_wallet.clone();

        // ANCHOR: manual_blob_upload_then_deploy
        let max_words_per_blob = 10_000;
        let blobs = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .blobs()
        .to_vec();

        let mut all_blob_ids = vec![];
        let mut already_uploaded_blobs = HashSet::new();
        for blob in blobs {
            let blob_id = blob.id();
            all_blob_ids.push(blob_id);

            // uploading the same blob twice is not allowed
            if already_uploaded_blobs.contains(&blob_id) {
                continue;
            }

            let mut tb = BlobTransactionBuilder::default().with_blob(blob);
            wallet.adjust_for_fee(&mut tb, 0).await?;
            wallet.add_witnesses(&mut tb)?;

            let tx = tb.build(&provider).await?;
            provider
                .send_transaction_and_await_commit(tx)
                .await?
                .check(None)?;

            already_uploaded_blobs.insert(blob_id);
        }

        let contract_id = Contract::loader_from_blob_ids(all_blob_ids, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blob_upload_then_deploy

        // ANCHOR: deploy_via_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: deploy_via_loader

        // ANCHOR: auto_convert_to_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .smart_deploy(&wallet, TxPolicies::default(), max_words_per_blob)
        .await?;
        // ANCHOR_END: auto_convert_to_loader

        // ANCHOR: upload_blobs_then_deploy
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .upload_blobs(&wallet, TxPolicies::default())
        .await?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: upload_blobs_then_deploy

        let wallet = main_wallet.clone();
        // ANCHOR: use_loader
        let contract_instance = MyContract::new(contract_id, wallet);
        let response = contract_instance.methods().something().call().await?.value;
        assert_eq!(response, 1001);
        // ANCHOR_END: use_loader

        // ANCHOR: show_max_tx_size
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_size();
        // ANCHOR_END: show_max_tx_size

        // ANCHOR: show_max_tx_gas
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_gas_per_tx();
        // ANCHOR_END: show_max_tx_gas

        let wallet = main_wallet;
        // ANCHOR: manual_blobs_then_deploy
        let chunk_size = 100_000;
        assert!(
            chunk_size % 8 == 0,
            "all chunks, except the last, must be word-aligned"
        );
        let blobs = contract
            .code()
            .chunks(chunk_size)
            .map(|chunk| Blob::new(chunk.to_vec()))
            .collect();

        let contract_id = Contract::loader_from_blobs(blobs, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blobs_then_deploy

        // ANCHOR: estimate_max_blob_size
        let max_blob_size = BlobTransactionBuilder::default()
            .estimate_max_blob_size(&provider)
            .await?;
        // ANCHOR_END: estimate_max_blob_size

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn decoding_script_transactions() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Wallets("wallet"),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let tx_id = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?
            .tx_id
            .unwrap();

        let provider: &Provider = wallet.try_provider()?;

        // ANCHOR: decoding_script_transactions
        let TransactionType::Script(tx) = provider
            .get_transaction_by_id(&tx_id)
            .await?
            .unwrap()
            .transaction
        else {
            panic!("Transaction is not a script transaction");
        };

        let ScriptType::ContractCall(calls) = ScriptType::detect(tx.script(), tx.script_data())?
        else {
            panic!("Script is not a contract call");
        };

        let json_abi = std::fs::read_to_string(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test-abi.json",
        )?;
        let abi_formatter = ABIFormatter::from_json_abi(json_abi)?;

        let call = &calls[0];
        let fn_selector = call.decode_fn_selector()?;
        let decoded_args =
            abi_formatter.decode_fn_args(&fn_selector, call.encoded_args.as_slice())?;

        eprintln!(
            "The script called: {fn_selector}({})",
            decoded_args.join(", ")
        );

        // ANCHOR_END: decoding_script_transactions
        Ok(())
    }
}\n```
```

<!-- This section should explain how to use the default tx policy -->
<!-- tx_policies_default:example:start -->
You can also use `TxPolicies::default()` to use the default values.
<!-- tx_policies_default:example:end -->

This way:

```rust,ignore
```rust\n#[cfg(test)]
mod tests {
    use std::{collections::HashSet, time::Duration};

    use fuels::{
        core::codec::{encode_fn_selector, ABIFormatter, DecoderConfig, EncoderConfig},
        crypto::SecretKey,
        prelude::{LoadConfiguration, NodeConfig, StorageConfiguration},
        programs::debug::ScriptType,
        test_helpers::{ChainConfig, StateConfig},
        types::{
            errors::{transaction::Reason, Result},
            Bits256,
        },
    };
    use rand::Rng;

    #[tokio::test]
    async fn instantiate_client() -> Result<()> {
        // ANCHOR: instantiate_client
        use fuels::prelude::{FuelService, Provider};

        // Run the fuel node.
        let server = FuelService::start(
            NodeConfig::default(),
            ChainConfig::default(),
            StateConfig::default(),
        )
        .await?;

        // Create a client that will talk to the node created above.
        let client = Provider::from(server.bound_address()).await?;
        assert!(client.healthy().await?);
        // ANCHOR_END: instantiate_client
        Ok(())
    }

    #[tokio::test]
    async fn deploy_contract() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract
        // This helper will launch a local node and provide a test wallet linked to it
        let wallet = launch_provider_and_get_wallet().await?;

        // This will load and deploy your contract binary to the chain so that its ID can
        // be used to initialize the instance
        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR_END: deploy_contract

        Ok(())
    }

    #[tokio::test]
    async fn setup_program_test_example() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract_setup_macro_short
        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: deploy_contract_setup_macro_short

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_cost_estimation
        let contract_instance = MyContract::new(contract_id, wallet);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: contract_call_cost_estimation

        let expected_gas = 2816;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_parameters() -> std::result::Result<(), Box<dyn std::error::Error>> {
        use fuels::{prelude::*, tx::StorageSlot, types::Bytes32};
        use rand::prelude::{Rng, SeedableRng, StdRng};

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");

        // ANCHOR: deploy_with_parameters
        // Optional: Add `Salt`
        let rng = &mut StdRng::seed_from_u64(2322u64);
        let salt: [u8; 32] = rng.gen();

        // Optional: Configure storage
        let key = Bytes32::from([1u8; 32]);
        let value = Bytes32::from([2u8; 32]);
        let storage_slot = StorageSlot::new(key, value);
        let storage_configuration =
            StorageConfiguration::default().add_slot_overrides([storage_slot]);
        let configuration = LoadConfiguration::default()
            .with_storage_configuration(storage_configuration)
            .with_salt(salt);

        // Optional: Configure deployment parameters
        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            configuration,
        )?
        .deploy(&wallet, tx_policies)
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        // ANCHOR_END: deploy_with_parameters

        assert_ne!(contract_id_1, contract_id_2);

        // ANCHOR: use_deployed_contract
        // This will generate your contract's methods onto `MyContract`.
        // This means an instance of `MyContract` will have access to all
        // your contract's methods that are running on-chain!
        // ANCHOR: abigen_example
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        // ANCHOR_END: abigen_example

        // This is an instance of your contract which you can use to make calls to your functions
        let contract_instance = MyContract::new(contract_id_2, wallet);

        let response = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call() // Perform the network call
            .await?;

        assert_eq!(42, response.value);

        let response = contract_instance
            .methods()
            .increment_counter(10)
            .call()
            .await?;

        assert_eq!(52, response.value);
        // ANCHOR_END: use_deployed_contract

        // ANCHOR: submit_response_contract
        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .submit()
            .await?;

        tokio::time::sleep(Duration::from_millis(500)).await;
        let value = response.response().await?.value;

        // ANCHOR_END: submit_response_contract
        assert_eq!(42, value);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_multiple_wallets() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallets =
            launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None).await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallets[0], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");
        let contract_instance_1 = MyContract::new(contract_id_1, wallets[0].clone());

        let response = contract_instance_1
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default().with_salt([1; 32]),
        )?
        .deploy(&wallets[1], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        let contract_instance_2 = MyContract::new(contract_id_2, wallets[1].clone());

        let response = contract_instance_2
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call()
            .await?;

        assert_eq!(42, response.value);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn contract_tx_and_call_params() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR: tx_policies
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();

        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let response = contract_methods
            .initialize_counter(42) // Our contract method
            .with_tx_policies(tx_policies) // Chain the tx policies
            .call() // Perform the contract call
            .await?; // This is an async call, `.await` it.
                     // ANCHOR_END: tx_policies

        // ANCHOR: tx_policies_default
        let response = contract_methods
            .initialize_counter(42)
            .with_tx_policies(TxPolicies::default())
            .call()
            .await?;
        // ANCHOR_END: tx_policies_default

        // ANCHOR: call_parameters
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let tx_policies = TxPolicies::default();

        // Forward 1_000_000 coin amount of base asset_id
        // this is a big number for checking that amount can be a u64
        let call_params = CallParameters::default().with_amount(1_000_000);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_parameters

        // ANCHOR: call_parameters_default
        let response = contract_methods
            .initialize_counter(42)
            .call_params(CallParameters::default())?
            .call()
            .await?;
        // ANCHOR_END: call_parameters_default
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn token_ops_tests() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/token_ops/out/release/token_ops-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/token_ops/out/release/token_ops\
        .bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();
        // ANCHOR: simulate
        // you would mint 100 coins if the transaction wasn't simulated
        let counter = contract_methods
            .mint_coins(100)
            .simulate(Execution::Realistic)
            .await?;
        // ANCHOR_END: simulate

        {
            let contract_id = contract_id.clone();
            // ANCHOR: simulate_read_state
            // you don't need any funds to read state
            let balance = contract_methods
                .get_balance(contract_id, AssetId::zeroed())
                .simulate(Execution::StateReadOnly)
                .await?
                .value;
            // ANCHOR_END: simulate_read_state
        }

        let response = contract_methods.mint_coins(1_000_000).call().await?;
        // ANCHOR: variable_outputs
        let address = wallet.address();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());

        // withdraw some tokens to wallet
        let response = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await?;
        // ANCHOR_END: variable_outputs
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn dependency_estimation() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let called_contract_id: ContractId = Contract::load_from(
            "../../e2e/sway/contracts/lib_contract/out/release/lib_contract.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?
        .into();

        let bin_path =
            "../../e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller.bin";
        let caller_contract_id = Contract::load_from(bin_path, LoadConfiguration::default())?
            .deploy(&wallet, TxPolicies::default())
            .await?;

        let contract_methods =
            MyContract::new(caller_contract_id.clone(), wallet.clone()).methods();

        // ANCHOR: dependency_estimation_fail
        let address = wallet.address();
        let amount = 100;

        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .call()
            .await;

        assert!(matches!(
            response,
            Err(Error::Transaction(Reason::Reverted { .. }))
        ));
        // ANCHOR_END: dependency_estimation_fail

        // ANCHOR: dependency_estimation_manual
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .with_contract_ids(&[called_contract_id.into()])
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation_manual

        let asset_id = caller_contract_id.asset_id(&Bits256::zeroed());
        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, amount);

        // ANCHOR: dependency_estimation
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
            .determine_missing_contracts(Some(2))
            .await?
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation

        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, 2 * amount);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn get_contract_outputs() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deployed_contracts
        abigen!(Contract(
            name = "MyContract",
            // Replace with your contract ABI.json path
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        let wallet_original = launch_provider_and_get_wallet().await?;

        let wallet = wallet_original.clone();
        // Your bech32m encoded contract ID.
        let contract_id: Bech32ContractId =
            "fuel1vkm285ypjesypw7vhdlhnty3kjxxx4efckdycqh3ttna4xvmxtfs6murwy".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // You can now use the `connected_contract_instance` just as you did above!
        // ANCHOR_END: deployed_contracts

        let wallet = wallet_original;
        // ANCHOR: deployed_contracts_hex
        let contract_id: ContractId =
            "0x65b6a3d081966040bbccbb7f79ac91b48c635729c59a4c02f15ae7da999b32d3".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // ANCHOR_END: deployed_contracts_hex

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn call_params_gas() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: call_params_gas
        // Set the transaction `gas_limit` to 1_000_000 and `gas_forwarded` to 4300 to specify that
        // the contract call transaction may consume up to 1_000_000 gas, while the actual call may
        // only use 4300 gas
        let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
        let call_params = CallParameters::default().with_gas_forwarded(4300);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_params_gas
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_example() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: multi_call_prepare
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);
        // ANCHOR_END: multi_call_prepare

        // ANCHOR: multi_call_build
        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);
        // ANCHOR_END: multi_call_build
        let multi_call_handler_tmp = multi_call_handler.clone();

        // ANCHOR: multi_call_values
        let (counter, array): (u64, [u64; 2]) = multi_call_handler.call().await?.value;
        // ANCHOR_END: multi_call_values

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: multi_contract_call_response
        let response = multi_call_handler.call::<(u64, [u64; 2])>().await?;
        // ANCHOR_END: multi_contract_call_response

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: submit_response_multicontract
        let submitted_tx = multi_call_handler.submit().await?;
        tokio::time::sleep(Duration::from_millis(500)).await;
        let (counter, array): (u64, [u64; 2]) = submitted_tx.response().await?.value;
        // ANCHOR_END: submit_response_multicontract

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: multi_call_cost_estimation
        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);

        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = multi_call_handler
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: multi_call_cost_estimation

        let expected_gas = 4402;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn connect_wallet() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let config = WalletsConfig::new(Some(2), Some(1), Some(DEFAULT_COIN_AMOUNT));
        let mut wallets = launch_custom_provider_and_get_wallets(config, None, None).await?;
        let wallet_1 = wallets.pop().unwrap();
        let wallet_2 = wallets.pop().unwrap();

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet_1, TxPolicies::default())
        .await?;

        // ANCHOR: connect_wallet
        // Create contract instance with wallet_1
        let contract_instance = MyContract::new(contract_id, wallet_1.clone());

        // Perform contract call with wallet_2
        let response = contract_instance
            .with_account(wallet_2) // Connect wallet_2
            .methods() // Get contract methods
            .get_msg_amount() // Our contract method
            .call() // Perform the contract call.
            .await?; // This is an async call, `.await` for it.
                     // ANCHOR_END: connect_wallet

        Ok(())
    }

    #[tokio::test]
    async fn custom_assets_example() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let other_wallet = WalletUnlocked::new_random(None);

        // ANCHOR: add_custom_assets
        let amount = 1000;
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .add_custom_asset(
                AssetId::zeroed(),
                amount,
                Some(other_wallet.address().clone()),
            )
            .call()
            .await?;
        // ANCHOR_END: add_custom_assets

        Ok(())
    }

    #[tokio::test]
    async fn low_level_call_example() -> Result<()> {
        use fuels::{core::codec::calldata, prelude::*, types::SizedAsciiString};

        setup_program_test!(
            Wallets("wallet"),
            Abigen(
                Contract(
                    name = "MyCallerContract",
                    project = "e2e/sway/contracts/low_level_caller"
                ),
                Contract(
                    name = "MyTargetContract",
                    project = "e2e/sway/contracts/contract_test"
                ),
            ),
            Deploy(
                name = "caller_contract_instance",
                contract = "MyCallerContract",
                wallet = "wallet"
            ),
            Deploy(
                name = "target_contract_instance",
                contract = "MyTargetContract",
                wallet = "wallet"
            ),
        );

        // ANCHOR: low_level_call
        let function_selector = encode_fn_selector("set_value_multiple_complex");
        let call_data = calldata!(
            MyStruct {
                a: true,
                b: [1, 2, 3],
            },
            SizedAsciiString::<4>::try_from("fuel")?
        )?;

        caller_contract_instance
            .methods()
            .call_low_level_call(
                target_contract_instance.id(),
                Bytes(function_selector),
                Bytes(call_data),
            )
            .determine_missing_contracts(None)
            .await?
            .call()
            .await?;
        // ANCHOR_END: low_level_call

        let result_uint = target_contract_instance
            .methods()
            .get_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_bool = target_contract_instance
            .methods()
            .get_bool_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_str = target_contract_instance
            .methods()
            .get_str_value()
            .call()
            .await
            .unwrap()
            .value;

        assert_eq!(result_uint, 2);
        assert!(result_bool);
        assert_eq!(result_str, "fuel");

        Ok(())
    }

    #[tokio::test]
    async fn configure_the_return_value_decoder() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_decoder_config
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .with_decoder_config(DecoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .call()
            .await?;
        // ANCHOR_END: contract_decoder_config

        Ok(())
    }

    #[tokio::test]
    async fn storage_slots_override() -> Result<()> {
        {
            // ANCHOR: storage_slots_override
            use fuels::{programs::contract::Contract, tx::StorageSlot};
            let slot_override = StorageSlot::new([1; 32].into(), [2; 32].into());
            let storage_config =
                StorageConfiguration::default().add_slot_overrides([slot_override]);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_override
        }

        {
            // ANCHOR: storage_slots_disable_autoload
            use fuels::programs::contract::Contract;
            let storage_config = StorageConfiguration::default().with_autoload(false);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_disable_autoload
        }

        Ok(())
    }

    #[tokio::test]
    async fn contract_custom_call() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );
        let provider = wallet.try_provider()?;

        let counter = 42;

        // ANCHOR: contract_call_tb
        let call_handler = contract_instance.methods().initialize_counter(counter);

        let mut tb = call_handler.transaction_builder().await?;

        // customize the builder...

        wallet.adjust_for_fee(&mut tb, 0).await?;
        tb.add_signer(wallet.clone())?;

        let tx = tb.build(provider).await?;

        let tx_id = provider.send_transaction(tx).await?;
        tokio::time::sleep(Duration::from_millis(500)).await;

        let tx_status = provider.tx_status(&tx_id).await?;

        let response = call_handler.get_response_from(tx_status)?;

        assert_eq!(counter, response.value);
        // ANCHOR_END: contract_call_tb

        Ok(())
    }

    #[tokio::test]
    async fn configure_encoder_config() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_encoder_config
        let _ = contract_instance
            .with_encoder_config(EncoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .methods()
            .initialize_counter(42)
            .call()
            .await?;
        // ANCHOR_END: contract_encoder_config

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_impersonation() -> Result<()> {
        use std::str::FromStr;

        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let node_config = NodeConfig {
            utxo_validation: false,
            ..Default::default()
        };
        let mut wallet = WalletUnlocked::new_from_private_key(
            SecretKey::from_str(
                "0x4433d156e8c53bf5b50af07aa95a29436f29a94e0ccc5d58df8e57bdc8583c32",
            )?,
            None,
        );
        let coins = setup_single_asset_coins(
            wallet.address(),
            AssetId::zeroed(),
            DEFAULT_NUM_COINS,
            DEFAULT_COIN_AMOUNT,
        );
        let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
        wallet.set_provider(provider.clone());

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_impersonation
        // create impersonator for an address
        let address =
            Address::from_str("0x17f46f562778f4bb5fe368eeae4985197db51d80c83494ea7f84c530172dedd1")
                .unwrap();
        let address = Bech32Address::from(address);
        let impersonator = ImpersonatedAccount::new(address, Some(provider.clone()));

        let contract_instance = MyContract::new(contract_id, impersonator.clone());

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: contract_call_impersonation

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn deploying_via_loader() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            )),
            Wallets("main_wallet")
        );
        let contract_binary =
            "../../e2e/sway/contracts/huge_contract/out/release/huge_contract.bin";

        let provider: Provider = main_wallet.try_provider()?.clone();

        let random_salt = || Salt::new(rand::thread_rng().gen());
        // ANCHOR: show_contract_is_too_big
        let contract = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?;
        let max_allowed = provider
            .consensus_parameters()
            .await?
            .contract_params()
            .contract_max_size();

        assert!(contract.code().len() as u64 > max_allowed);
        // ANCHOR_END: show_contract_is_too_big

        let wallet = main_wallet.clone();

        // ANCHOR: manual_blob_upload_then_deploy
        let max_words_per_blob = 10_000;
        let blobs = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .blobs()
        .to_vec();

        let mut all_blob_ids = vec![];
        let mut already_uploaded_blobs = HashSet::new();
        for blob in blobs {
            let blob_id = blob.id();
            all_blob_ids.push(blob_id);

            // uploading the same blob twice is not allowed
            if already_uploaded_blobs.contains(&blob_id) {
                continue;
            }

            let mut tb = BlobTransactionBuilder::default().with_blob(blob);
            wallet.adjust_for_fee(&mut tb, 0).await?;
            wallet.add_witnesses(&mut tb)?;

            let tx = tb.build(&provider).await?;
            provider
                .send_transaction_and_await_commit(tx)
                .await?
                .check(None)?;

            already_uploaded_blobs.insert(blob_id);
        }

        let contract_id = Contract::loader_from_blob_ids(all_blob_ids, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blob_upload_then_deploy

        // ANCHOR: deploy_via_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: deploy_via_loader

        // ANCHOR: auto_convert_to_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .smart_deploy(&wallet, TxPolicies::default(), max_words_per_blob)
        .await?;
        // ANCHOR_END: auto_convert_to_loader

        // ANCHOR: upload_blobs_then_deploy
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .upload_blobs(&wallet, TxPolicies::default())
        .await?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: upload_blobs_then_deploy

        let wallet = main_wallet.clone();
        // ANCHOR: use_loader
        let contract_instance = MyContract::new(contract_id, wallet);
        let response = contract_instance.methods().something().call().await?.value;
        assert_eq!(response, 1001);
        // ANCHOR_END: use_loader

        // ANCHOR: show_max_tx_size
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_size();
        // ANCHOR_END: show_max_tx_size

        // ANCHOR: show_max_tx_gas
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_gas_per_tx();
        // ANCHOR_END: show_max_tx_gas

        let wallet = main_wallet;
        // ANCHOR: manual_blobs_then_deploy
        let chunk_size = 100_000;
        assert!(
            chunk_size % 8 == 0,
            "all chunks, except the last, must be word-aligned"
        );
        let blobs = contract
            .code()
            .chunks(chunk_size)
            .map(|chunk| Blob::new(chunk.to_vec()))
            .collect();

        let contract_id = Contract::loader_from_blobs(blobs, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blobs_then_deploy

        // ANCHOR: estimate_max_blob_size
        let max_blob_size = BlobTransactionBuilder::default()
            .estimate_max_blob_size(&provider)
            .await?;
        // ANCHOR_END: estimate_max_blob_size

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn decoding_script_transactions() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Wallets("wallet"),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let tx_id = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?
            .tx_id
            .unwrap();

        let provider: &Provider = wallet.try_provider()?;

        // ANCHOR: decoding_script_transactions
        let TransactionType::Script(tx) = provider
            .get_transaction_by_id(&tx_id)
            .await?
            .unwrap()
            .transaction
        else {
            panic!("Transaction is not a script transaction");
        };

        let ScriptType::ContractCall(calls) = ScriptType::detect(tx.script(), tx.script_data())?
        else {
            panic!("Script is not a contract call");
        };

        let json_abi = std::fs::read_to_string(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test-abi.json",
        )?;
        let abi_formatter = ABIFormatter::from_json_abi(json_abi)?;

        let call = &calls[0];
        let fn_selector = call.decode_fn_selector()?;
        let decoded_args =
            abi_formatter.decode_fn_args(&fn_selector, call.encoded_args.as_slice())?;

        eprintln!(
            "The script called: {fn_selector}({})",
            decoded_args.join(", ")
        );

        // ANCHOR_END: decoding_script_transactions
        Ok(())
    }
}\n```
```

As you might have noticed, `TxPolicies` can also be specified when deploying contracts or transferring assets by passing it to the respective methods.
