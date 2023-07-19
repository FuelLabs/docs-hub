#!/bin/bash

git submodule update --init

sway_path="docs/sway/docs/book/src"
fuels_rs_path="docs/fuels-rs/docs/src"
file_to_rename="README.md"

# Specify the new filename
new_filename="index.md"

# Navigate to the sway folder
cd "$sway_path" || exit 1

# Check if the file exists
if [[ -f "$file_to_rename" ]]; then
    # Rename the file
    mv "$file_to_rename" "$new_filename"
fi

# Navigate to the fuels-rs folder
cd ../../../../../
cd "$fuels_rs_path" || exit 1

# Check if the file exists
if [[ -f "$file_to_rename" ]]; then
    # Rename the file
    mv "$file_to_rename" "$new_filename"
fi