
# Non-technical Guide

## 1. Your Wallet Address Will Look Different

This is expected, and it's because Fuel Connectors use a technical tool called a predicate to interact with your wallet. The address you see is the address of the predicate.

This predicate is kind of like a post office box that automatically forwards to your home address and visa versa. Anything you send from your wallet is relayed through the predicate, and anything you receive from elsewhere you receive through predicate.

The predicate is audited for secure. And your wallet address is still your wallet address. You will just see the predicate address on Fuel.

## 2. Funds Display in Wallets

For some Ethereum VM (EVM) or Solana VM (SVM) wallets, funds will not display in your wallet directly, unless you are interacting with Fuel native applications.

If you see this, don’t panic! Your funds are there and you can move them by following the following steps.

**Step 1:** Go to [Fuel Explorer](https://app.fuel.network/)

![step one](https://raw.githubusercontent.com/FuelLabs/docs-hub/8873ef4500d88f481a73e9a08c74fcd637ef401d/docs/guides/docs/assets/fuel-connectors-step-one.png)

**Step 2:** Connect your wallet

![step two](https://raw.githubusercontent.com/FuelLabs/docs-hub/8873ef4500d88f481a73e9a08c74fcd637ef401d/docs/guides/docs/assets/fuel-connectors-step-two.png)

**Step 3:** Connect a non-native wallet

![step three](https://raw.githubusercontent.com/FuelLabs/docs-hub/8873ef4500d88f481a73e9a08c74fcd637ef401d/docs/guides/docs/assets/fuel-connectors-step-three.png)

**Step 4:** Open drop-down and select “My Account”

![step four](https://raw.githubusercontent.com/FuelLabs/docs-hub/8873ef4500d88f481a73e9a08c74fcd637ef401d/docs/guides/docs/assets/fuel-connectors-step-four.png)

**Step 5:** View your account and assets

![step five](https://raw.githubusercontent.com/FuelLabs/docs-hub/8873ef4500d88f481a73e9a08c74fcd637ef401d/docs/guides/docs/assets/fuel-connectors-step-five.png)

**Note:** This will improve over time as connections between the Fuel Network and wallets are built into the wallets themselves.

## 3. Blind Signing

Wallets that are built for other chains (EVM or SVM, for example) will use a technique called "Blind signing" to sign transactions. There is some risk to this, and you should only interact with trusted dApps using your non-native wallet.

## Conclusion

You can connect essentially any EVM or SVM wallet to Fuel via Fuel Connectors, and you can use them on the network securely. Just be aware of the above experiences as you do so.

## Other Options

If you are uncomfortable with any of these experiences or risks, you can use a Fuel Native wallet. A list of trusted [Fuel Native wallets is available here](https://app.fuel.network/ecosystem?tag=Wallet).
