# Run Sequencer Node

## Prerequisites

This guide assumes that Golang is installed to run Cosmovisor. We recommend using version **1.21 or later**. You can download it [here](https://go.dev/dl/).

## Run the Node

Obtain binary and genesis from this repository:

- Binary from: https://github.com/FuelLabs/fuel-sequencer-deployments/releases/tag/seq-mainnet-1.2-improved-sidecar
  - For example:
    - `fuelsequencerd-seq-mainnet-1.2-improved-sidecar-darwin-arm64` for Apple Silicon
    - `fuelsequencerd-seq-mainnet-1.2-improved-sidecar-darwin-amd64` for Linux x64
- Genesis from: https://github.com/FuelLabs/fuel-sequencer-deployments/blob/main/seq-mainnet-1/genesis.json

Download the right binary based on your architecture to `$GOPATH/bin/` with the name `fuelsequencerd`:

- `echo $GOPATH` to ensure it exists. If not, `go` might not be installed.
- Make sure that your `GOPATH` is set properly in your `.bashrc` or `.zshrc` file. Run `source ~/.bashrc` or `source ~/.zshrc` to apply the changes.

```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

- `mkdir $GOPATH/bin/` if the directory does not exist.
- `wget <url/to/binary>` to download the binary, or any equivalent approach. For example:

```bash
wget https://github.com/FuelLabs/fuel-sequencer-deployments/releases/download/seq-mainnet-1.2-improved-sidecar/fuelsequencerd-seq-mainnet-1.2-improved-sidecar-darwin-arm64
```

- `cp <binary> $GOPATH/bin/fuelsequencerd` to copy the binary to the `GOPATH/bin/` directory.
- `chmod +x $GOPATH/bin/fuelsequencerd` to make the binary executable.
- `fuelsequencerd version` to verify that the binary is working.

Try the binary:

```sh
fuelsequencerd version  # expect seq-mainnet-1.2-improved-sidecar
```

Initialise the node directory, giving your node a meaningful name:

```sh
fuelsequencerd init <node-name> --chain-id seq-mainnet-1
```

Copy the downloaded genesis file to `~/.fuelsequencer/config/genesis.json`:

```sh
cp <path/to/genesis.json> ~/.fuelsequencer/config/genesis.json
```

Configure the node (part 1: `~/.fuelsequencer/config/app.toml`):

- Set `minimum-gas-prices = "10fuel"`.
- Configure `[sidecar]`:
  - Ensure that `enabled = false`.

Configure the node (part 2: `~/.fuelsequencer/config/config.toml`):

- Configure `[p2p]`:
  - Set `persistent_peers = "fc5fd264190e4a78612ec589994646268b81f14e@80.64.208.207:26656"`.
- Configure `[mempool]`:
  - Set `max_tx_bytes = 1258291` (1.2MiB)
  - Set `max_txs_bytes = 23068672` (22MiB)
- Configure `[rpc]`:
  - Set `max_body_bytes = 1153434` (optional - relevant for public RPC).

> Note: Ensuring consistent CometBFT mempool parameters across all network nodes is important to reduce transaction delays. This includes `mempool.size`, `mempool.max_txs_bytes`, and `mempool.max_tx_bytes` in [config.toml](https://docs.cometbft.com/v0.38/core/configuration) and `minimum-gas-prices` in [app.toml](https://docs.cosmos.network/main/learn/advanced/config), as pointed out above.

### Install Cosmovisor

To install Cosmovisor, run `go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@latest`

Set the environment variables:

<details>
  <summary>If you're running on a zsh terminal...</summary>

  ```zsh
  echo "# Setup Cosmovisor" >> ~/.zshrc
  echo "export DAEMON_NAME=fuelsequencerd" >> ~/.zshrc
  echo "export DAEMON_HOME=$HOME/.fuelsequencer" >> ~/.zshrc
  echo "export DAEMON_ALLOW_DOWNLOAD_BINARIES=true" >> ~/.zshrc
  echo "export DAEMON_LOG_BUFFER_SIZE=512" >> ~/.zshrc
  echo "export DAEMON_RESTART_AFTER_UPGRADE=true" >> ~/.zshrc
  echo "export UNSAFE_SKIP_BACKUP=true" >> ~/.zshrc
  echo "export DAEMON_SHUTDOWN_GRACE=15s" >> ~/.zshrc
  
  # You can check https://docs.cosmos.network/main/tooling/cosmovisor for more configuration options.
  ```

  Apply to your current session: `source ~/.zshrc`
</details>

<details>
  <summary>If you're running on a bash terminal...</summary>

  ```zsh
  echo "# Setup Cosmovisor" >> ~/.bashrc
  echo "export DAEMON_NAME=fuelsequencerd" >> ~/.bashrc
  echo "export DAEMON_HOME=$HOME/.fuelsequencer" >> ~/.bashrc
  echo "export DAEMON_ALLOW_DOWNLOAD_BINARIES=true" >> ~/.bashrc
  echo "export DAEMON_LOG_BUFFER_SIZE=512" >> ~/.bashrc
  echo "export DAEMON_RESTART_AFTER_UPGRADE=true" >> ~/.bashrc
  echo "export UNSAFE_SKIP_BACKUP=true" >> ~/.bashrc
  echo "export DAEMON_SHUTDOWN_GRACE=15s" >> ~/.bashrc
  
  # You can check https://docs.cosmos.network/main/tooling/cosmovisor for more configuration options.
  ```

  Apply to your current session: `source ~/.bashrc`
</details>

You can now test that cosmovisor was installed properly:

```sh
cosmovisor version
```

Initialise Cosmovisor directories (hint: `whereis fuelsequencerd` for the path):

```sh
cosmovisor init <path/to/fuelsequencerd>
```

At this point `cosmovisor run` will be the equivalent of running `fuelsequencerd`, however you should _not_ run the node for now.

### Configure State Sync

State Sync allows a node to get synced up quickly.

To configure State Sync, you will need to set these values in `~/.fuelsequencer/config/config.toml` under `[statesync]`:

- `enable = true` to enable State Sync
- `rpc_servers = ...`
- `trust_height = ...`
- `trust_hash = ...`

The last three values can be obtained from [the explorer](https://fuel-seq.simplystaking.xyz/fuel-mainnet/statesync).

You will need to specify at least two comma-separated RPC servers in `rpc_servers`. You can either refer to the list of alternate RPC servers above or use the same one twice.

### Running the Sequencer

At this point you should already be able to run `cosmovisor run start` to run the Sequencer. However, **it is highly recommended to run the Sequencer as a background service**.

Some examples are provided below for Linux and Mac. You will need to replicate the environment variables defined when setting up Cosmovisor.

#### Linux

On Linux, you can use `systemd` to run the Sequencer in the background. Knowledge of how to use `systemd` is assumed here.

Here's an example service file with some placeholder (`<...>`) values that must be filled-in:

<details>
  <summary>Click me...</summary>

```sh
[Unit]
Description=Sequencer Node
After=network.target

[Service]
Type=simple
User=<USER>
ExecStart=/home/<USER>/go/bin/cosmovisor run start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

Environment="DAEMON_NAME=fuelsequencerd"
Environment="DAEMON_HOME=/home/<USER>/.fuelsequencer"
Environment="DAEMON_ALLOW_DOWNLOAD_BINARIES=true"
Environment="DAEMON_LOG_BUFFER_SIZE=512"
Environment="DAEMON_RESTART_AFTER_UPGRADE=true"
Environment="UNSAFE_SKIP_BACKUP=true"
Environment="DAEMON_SHUTDOWN_GRACE=15s"

[Install]
WantedBy=multi-user.target
```

</details>

#### Mac

On Mac, you can use `launchd` to run the Sequencer in the background. Knowledge of how to use `launchd` is assumed here.

Here's an example plist file with some placeholder (`[...]`) values that must be filled-in:

<details>
  <summary>Click me...</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>fuel.sequencer</string>

    <key>ProgramArguments</key>
    <array>
        <string>/Users/[User]/go/bin/cosmovisor</string>
        <string>run</string>
        <string>start</string>
    </array>

    <key>UserName</key>
    <string>[User]</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>DAEMON_NAME</key>
        <string>fuelsequencerd</string>
        <key>DAEMON_HOME</key>
        <string>/Users/[User]/.fuelsequencer</string>
        <key>DAEMON_ALLOW_DOWNLOAD_BINARIES</key>
        <string>true</string>
        <key>DAEMON_LOG_BUFFER_SIZE</key>
        <string>512</string>
        <key>DAEMON_RESTART_AFTER_UPGRADE</key>
        <string>true</string>
        <key>UNSAFE_SKIP_BACKUP</key>
        <string>true</string>
        <key>DAEMON_SHUTDOWN_GRACE</key>
        <string>15s</string>
    </dict>

    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
    </dict>

    <key>HardResourceLimits</key>
    <dict>
        <key>NumberOfFiles</key>
        <integer>4096</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>/Users/[User]/Library/Logs/fuel-sequencer.out</string>
    <key>StandardErrorPath</key>
    <string>/Users/[User]/Library/Logs/fuel-sequencer.err</string>
</dict>
</plist>
```

</details>

## References

Based on material from:

- https://docs.cosmos.network/main/tooling/cosmovisor
- https://docs.osmosis.zone/overview/validate/joining-mainnet#set-up-cosmovisor
