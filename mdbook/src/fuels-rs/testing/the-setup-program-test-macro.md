# The setup_program_test! macro

When deploying contracts with the `abigen!` macro, as shown in the previous sections, the user can:

- change the default configuration parameters
- launch several providers
- create multiple wallets
- create specific assets, etc.

However, it is often the case that we want to quickly set up a test with default values and work directly with contract or script instances. The `setup_program_test!` can do exactly that.

---

Used to reduce boilerplate in integration tests. Accepts input in the form
of `COMMAND(ARG...)...`

`COMMAND` is either `Wallets`, `Abigen`, `LoadScript` or `Deploy`.

`ARG` is either a:

- name-value (e.g. `name="MyContract"`), or,
- a literal (e.g. `"some_str_literal"`, `true`, `5`, ...)
- a sub-command (e.g. `Abigen(Contract(name="MyContract", project="some_project"))`)

Available `COMMAND`s:

## Options

Example: `Options(profile="debug")`

Description: Sets options from `ARG`s to be used by other `COMMAND`s.

Available options:

- `profile`: sets the `cargo` build profile. Variants: `"release"` (default),  `"debug"`

Cardinality: 0 or 1.

## Wallets

Example: `Wallets("a_wallet", "another_wallet"...)`

Description: Launches a local provider and generates wallets with names taken from the provided `ARG`s.

Cardinality: 0 or 1.

## Abigen

Example:

```rust,ignore
Abigen(
    Contract(
        name = "MyContract",
        project = "some_folder"
    ),
    Script(
        name = "MyScript",
        project = "some_folder"
    ),
    Predicate(
        name = "MyPredicate",
        project = "some_folder"
    ),
)
```

Description: Generates the program bindings under the name `name`. `project` should point to root of the `forc` project. The project must be compiled in `release` mode (`--release` flag) for `Abigen` command to work.

Cardinality: 0 or N.

## Deploy

Example: `Deploy(name="instance_name", contract="MyContract", wallet="a_wallet")`

Description: Deploys the `contract` (with salt) using `wallet`. Will create a contract instance accessible via `name`. Due to salt usage, the same contract can be deployed multiple times. Requires that an `Abigen` command be present with `name` equal to `contract`. `wallet` can either be one of the wallets in the `Wallets` `COMMAND` or the name of a wallet you've previously generated yourself.

Cardinality: 0 or N.

## `LoadScript`

Example: `LoadScript(name = "script_instance", script = "MyScript", wallet = "wallet")`

Description: Creates a script instance of `script` under `name` using `wallet`.

Cardinality: 0 or N.

---

The setup code that you have seen in previous sections gets reduced to:

```rust,ignore
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
```

> **Note** The same contract can be deployed several times as the macro deploys the contracts with salt. You can also deploy different contracts to the same provider by referencing the same wallet in the `Deploy` command.

```rust,ignore
setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "LibContract",
                project = "e2e/sway/contracts/lib_contract"
            ),
            Contract(
                name = "LibContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller"
            ),
        ),
        Deploy(
            name = "lib_contract_instance",
            contract = "LibContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "LibContractCaller",
            wallet = "wallet",
        ),
        Deploy(
            name = "contract_caller_instance2",
            contract = "LibContractCaller",
            wallet = "wallet",
        ),
    );
    let lib_contract_id = lib_contract_instance.contract_id();

    let contract_caller_id = contract_caller_instance.contract_id();

    let contract_caller_id2 = contract_caller_instance2.contract_id();

    // Because we deploy with salt, we can deploy the same contract multiple times
    assert_ne!(contract_caller_id, contract_caller_id2);

    // The first contract can be called because they were deployed on the same provider
    let response = contract_caller_instance
        .methods()
        .increment_from_contract(lib_contract_id, 42)
        .with_contracts(&[&lib_contract_instance])
        .call()
        .await?;

    assert_eq!(43, response.value);

    let response = contract_caller_instance2
        .methods()
        .increment_from_contract(lib_contract_id, 42)
        .with_contracts(&[&lib_contract_instance])
        .call()
        .await?;

    assert_eq!(43, response.value);
```

In this example, three contracts are deployed on the same provider using the `wallet` generated by the `Wallets` command. The second and third macros use the same contract but have different IDs because of the deployment with salt. Both of them can call the first contract by using their ID.

In addition, you can manually create the `wallet` variable and then use it inside the macro. This is useful if you want to create custom wallets or providers but still want to use the macro to reduce boilerplate code. Below is an example of this approach.

```rust,ignore
let config = WalletsConfig::new(Some(2), Some(1), Some(DEFAULT_COIN_AMOUNT));

    let mut wallets = launch_custom_provider_and_get_wallets(config, None, None).await?;
    let wallet = wallets.pop().unwrap();
    let wallet_2 = wallets.pop().unwrap();

    setup_program_test!(
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
```
