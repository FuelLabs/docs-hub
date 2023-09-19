#!/bin/bash

# List of directories to delete unused files from
TARGET_DIRS=(
"./docs/sway" 
"./docs/latest/sway" 
"./docs/builds/sway" 
"./docs/latest/builds/sway" 
"./docs/fuel-indexer"
"./docs/latest/fuel-indexer"
"./docs/fuelup"
"./docs/latest/fuelup"
"./docs/fuels-rs"
"./docs/latest/fuels-rs"
"./docs/fuels-ts"
"./docs/latest/fuels-ts"
"./docs/fuels-wallet"
"./docs/latest/fuels-wallet"
)

# File/folder names to exclude from deletion
EXCLUSIONS=("book" "docs" "examples" "apps" "fuels" "Cargo.toml" "package.json")


for TARGET_DIR in "${TARGET_DIRS[@]}"; do
    # Check if directory exists
    if [[ ! -d "$TARGET_DIR" ]]; then
        echo "Warning: Target directory $TARGET_DIR does not exist. Skipping..."
        continue
    fi

    # Change to the target directory, pushing to directory stack
    pushd "$TARGET_DIR" > /dev/null

    for item in *; do
        should_delete=true

        for exclusion in "${EXCLUSIONS[@]}"; do
            if [[ "$item" == "$exclusion" ]]; then
                should_delete=false
                break
            fi
        done

        if $should_delete; then
            rm -rf "$item"
            # echo "DELETED: $item"
        fi
    done

    echo "Cleanup done for $TARGET_DIR!"

    # Return to the original directory, popping from directory stack
    popd > /dev/null
done
