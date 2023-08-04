#!/bin/bash

# Remove all other files from build folder to reduce deploy size
rm -rf ./docs/builds/sway/v*
rm -rf ./docs/builds/sway/latest

# generate sidebar links
pnpm generate:links

sway_path="docs/sway/docs/book/src"
fuels_rs_path="docs/fuels-rs/docs/src"
file_to_rename="README.md"

# rename Sway & Fuels-rs README.md files to index.md
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