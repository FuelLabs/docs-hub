# Fuel Docs Hub

## Running locally

### Requirements

To begin, make sure you have installed the following dependencies:

- [Node.js 18.14.1 or latest stable](https://nodejs.org/en/). We recommend using [nvm](https://github.com/nvm-sh/nvm) to install.
- [PNPM v7.18.2 or latest stable](https://pnpm.io/installation/)

### Cloning the Repository

```sh
git clone --recursive https://github.com/FuelLabs/docs-hub
cd docs-hub
```

If your project's documentation does not reside on the default branch, open the `.gitmodules` file and add/change the `branch = ...` field to point to the corresponding branch. Make sure you update the submodules by using the new branch:

```sh
git submodule update --recursive --remote
```

### Install Dependencies

```sh
pnpm install
```

### Run Web App

Start a local development frontend. After running the below command you can open [http://localhost:3000](http://localhost:3000) in your browser to view the frontend.

```sh
pnpm dev
```
