
# Building a Frontend to Interact With Your Contract

To build a frontend application for the counter contract, we'll do the following:

1. [**Install the Fuel Browser Wallet.**](#install-the-fuel-browser-wallet)
2. [**Initialize a React project.**](#initialize-a-react-project)
3. [**Install the `fuels` SDK dependency.**](#install-the-fuels-sdk-dependency)
4. [**Generate contract types.**](#generate-contract-types)
5. [**Write our frontend code.**](#modify-the-app)
6. [**Run our project.**](#run-your-project)

## Install the Fuel Browser Wallet


Our frontend application will allow users to connect with a wallet, so you'll need to have a browser wallet installed.

Before going to the next steps, install the [Fuel Wallet](https://chromewebstore.google.com/detail/fuel-wallet/dldjpboieedgcmpkchcjcbijingjcgok) extension.

Once you've setup your wallet, click the "Faucet" button in the wallet to get some testnet tokens.


## Initialize a React project

To split our project's contract from frontend code, let's initialize our frontend project: assuming that your terminal is open at your contract's folder `/home/user/path/to/counter-contract` let's go back up one directory.

```sh
cd ..
```

Now, initialize a React project with TypeScript using [`Vite`](https://vitejs.dev/).



```sh
npm create vite@latest frontend -- --template react-ts
```

The output should be similar to this:

```sh
Scaffolding project in Fuel/fuel-project/frontend...

Done. Now run:

  cd frontend
  npm install
  npm run dev
```

### Installing

Move into the `frontend` folder and install the dependencies by running:



```sh
cd frontend && npm install
```

You should now have two folders inside your `fuel-project` folder: `counter-contract` and `frontend`.

<Box.Centered>
![project folder structure](/images/quickstart-folder-structure.png)
</Box.Centered>

## Install the `fuels` SDK dependency

The `fuels` package includes all the main tools you need to interact with your Sway programs and the Fuel network.
The `@fuel-wallet` packages include everything you need to interact with user wallets.

> `fuels` requires Node version {props.nodeVersion}.

Install the following packages in your `frontend` folder:



```sh
npm install fuels @fuels/react @fuels/connectors @tanstack/react-query
```

## Generate contract types

The `fuels init` command generates a `fuels.config.ts` file that is used by the SDK to generate contract types.
Use the `contracts` flag to define where your contract folder is located, and the `output` flag to define where you want the generated files to be created.

Run the command below in your frontend folder to generate the config file:



```sh
npx fuels init --contracts ../counter-contract/ --output ./src/sway-api
```

Now that you have a `fuels.config.ts` file, you can use the `fuels build` command to rebuild your contract and generate types.
Running this command will interpret the output ABI JSON from your contract and generate the correct TypeScript definitions.
If you see the folder `fuel-project/counter-contract/out` you will be able to see the ABI JSON there.

Inside the `fuel-project/frontend` directory run:



```sh
npx fuels build
```

A successful process should print and output like the following:

```sh
Building..
Building Sway programs using source 'forc' binary
Generating types..
🎉  Build completed successfully!
```

Now you should be able to find a new folder `fuel-project/frontend/src/sway-api`.

## Modify the App

Inside the `frontend/src` folder let's add code that interacts with our contract.

Because we'll be using `@fuels/react`, first we need to wrap our app with the `FuelProvider` component.

Add the imports below to the top of your `frontend/src/main.tsx` file and setup a query client:



<CodeImport
  file="../../examples/counter-dapp/frontend/src/main.tsx"
  lang="tsx"
  lineStart="5"
  lineEnd="10"
/>

Next, modify your `frontend/src/main.tsx` file to wrap the `App` component with the `FuelProvider` and `QueryClientProvider` components.



<CodeImport
  file="../../examples/counter-dapp/frontend/src/main.tsx"
  lang="tsx"
  lineStart="11"
  lineEnd="23"
/>

Next, change the file `fuel-project/frontend/src/App.tsx` to:



<CodeImport
  file="../../examples/counter-dapp/frontend/src/App.tsx"
  lang="tsx"
/>

Finally, replace the value of the `CONTRACT_ID` variable at the top of your `App.tsx` file with the address of the contract you just deployed.



## Run your project

Inside the `fuel-project/frontend` directory run:



```sh
npm run dev
```

```sh
  VITE v5.3.5  ready in 108 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Click the "Connect" button and select the wallet you have installed to connect your wallet.

Once connected, if there are no funds in your wallet, you will see a link to get testnet funds.

If you have testnet ETH on Fuel, you should see the counter value and increment button:

<Box.Centered>
![screenshot of the UI](/images/quickstart-frontend.png)
</Box.Centered>

## You just built a fullstack dapp on Fuel! ⛽

[Here is the repo for this project](https://github.com/FuelLabs/docs-hub/tree/master/docs/guides/examples/counter-dapp).

If you run into any problems, a good first step is to compare your code to this repo and resolve any differences.

Tweet us [@fuel_network](https://twitter.com/fuel_network) letting us know you just built a dapp on Fuel, you might get invited to a private group of builders, be invited to the next Fuel dinner, get alpha on the project, or something 👀.

### Updating The Contract

To develop and test faster, we recommend using the [`fuels dev` command](/docs/fuels-ts/fuels-cli) to start a local node and automatically redeploy and generate types for your contract on each change.

Once you're ready to redeploy your contract to the testnet, here are the steps you should take to get your frontend and contract back in sync:

- In your frontend directory, re-run this command: `npx fuels build`.
- In your contract directory, redeploy the contract.
- In your frontend directory, update the contract ID in your `App.tsx` file.

## Need Help?

Get help from the team by posting your question in the [Fuel Forum](https://forum.fuel.network/).
















