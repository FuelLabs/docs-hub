#!/bin/bash

# List of directories to delete unused files from
TARGET_DIRS=(
"./docs/sway" 
"./docs/nightly/sway" 
"./docs/builds/sway" 
"./docs/nightly/builds/sway" 
"./docs/fuels-rs"
"./docs/nightly/fuels-rs"
"./docs/fuels-ts"
"./docs/nightly/fuels-ts"
"./docs/fuels-wallet"
"./docs/nightly/fuels-wallet"
)

# File/folder names to exclude from deletion in each book
EXCLUSIONS_sway=("Cargo.toml" "forc-pkg" "sway-lib-std" "docs" "examples" "master" "test")
EXCLUSIONS_fuels_rs=("Cargo.toml" "docs" "examples" "packages")
EXCLUSIONS_fuels_ts=("apps" "packages" "package.json", "demo-wallet-sdk-react")
EXCLUSIONS_fuels_wallet=("package.json" "packages")

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

       dir_basename=$(basename "$TARGET_DIR" | tr '-' '_')
       current_exclusions="EXCLUSIONS_$dir_basename[@]"

        for exclusion in "${!current_exclusions}"; do
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


TARGET_SUB_DIRS=(
"./docs/sway/test/src" 
)

EXCLUSIONS_test=("sdk-harness")


for TARGET_DIR in "${TARGET_SUB_DIRS[@]}"; do
    # Check if directory exists
    if [[ ! -d "$TARGET_DIR" ]]; then
        echo "Warning: Target directory $TARGET_DIR does not exist. Skipping..."
        continue
    fi

    # Change to the target directory, pushing to directory stack
    pushd "$TARGET_DIR" > /dev/null

    for item in *; do
        should_delete=true

       dir_basename=$(basename "$TARGET_DIR" | tr '-' '_')
       current_exclusions="EXCLUSIONS_$dir_basename[@]"

        for exclusion in "${!current_exclusions}"; do
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
