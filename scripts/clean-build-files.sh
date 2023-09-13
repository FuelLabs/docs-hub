#!/bin/bash

# Remove all unused files from build folder to reduce deploy size

# function to delete folders with exclusions
delete_with_exclusions() {
    local TARGET_DIR="$1"
    shift
    local EXCLUSIONS=("$@")

    # Loop through all items in the directory
    for ITEM in "$TARGET_DIR"/*; do
        # If the item is a directory
        if [[ -d "$ITEM" ]]; then
            # By default, assume that the directory is to be deleted
            DELETE=true
            # Loop through the exclusion list
            for EXCLUDE in "${EXCLUSIONS[@]}"; do
                # If the directory matches an exclusion
                if [[ "$(basename "$ITEM")" == "$EXCLUDE" ]]; then
                    DELETE=false
                    break
                fi
            done
            # If the directory was not in the exclusion list, delete it
            if $DELETE; then
                rm -rf "$ITEM"
                echo "Deleted: $ITEM"
            fi
        fi
    done
}

# List of target directories and their respective exclusions
declare -A DIRECTORIES=(
    ["/docs/sway"]=("book" "examples")
    ["/docs/builds/sway"]=("master")
    ["/docs/fuel-indexer"]=("docs" "examples")
    ["/docs/fuels-rs"]=("docs" "examples")
    ["/docs/fuels-ts"]=("apps" "versions")
    ["/docs/fuels-wallet"]=("docs")
    ["/docs/fuelup"]=("docs")
    ["/docs/latest/sway"]=("book" "examples")
    ["/docs/latest/builds/sway"]=("master")
    ["/docs/latest/fuel-indexer"]=("docs" "examples")
    ["/docs/latest/fuels-rs"]=("docs" "examples")
    ["/docs/latest/fuels-ts"]=("apps" "versions")
    ["/docs/latest/fuels-wallet"]=("docs")
    ["/docs/latest/fuelup"]=("docs")
)

# delete all unnecessary folders in each directory
for DIR in "${!DIRECTORIES[@]}"; do
    delete_with_exclusions "$DIR" "${DIRECTORIES[$DIR]}"
done

