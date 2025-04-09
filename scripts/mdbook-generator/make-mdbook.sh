#!/bin/bash

# Set -e flag to exit on any error
set -e

echo "Starting mdbook generation process..."

# Make the mdbook generator script executable
chmod +x ./scripts/mdbook-generator/generate-mdbook.mjs

# Remove existing mdbook directory if it exists
if [ -d "./mdbook" ]; then
  echo "Removing existing mdbook directory..."
  rm -rf ./mdbook
fi

# Create mdbook directory structure
echo "Creating mdbook directory structure..."
mkdir -p ./mdbook/src

# Run the generator script
echo "Running generator script..."
node ./scripts/mdbook-generator/generate-mdbook.mjs

# Check if the source directory was generated
if [ ! -d "./mdbook/src" ]; then
  echo "Error: mdbook src directory was not generated. Please check the script output."
  exit 1
fi

# Check if book.toml exists
if [ ! -f "./mdbook/book.toml" ]; then
  echo "Warning: book.toml not found, creating a basic one..."
  cat > ./mdbook/book.toml << EOL
[book]
title = "Fuel Documentation Hub"
authors = ["Fuel Labs"]
description = "Comprehensive documentation for the Fuel ecosystem"
src = "src"

[output.html]
git-repository-url = "https://github.com/FuelLabs"
EOL
fi

# Check if mdbook is installed
if ! command -v mdbook &> /dev/null
then
    echo "mdbook could not be found. Installing mdbook..."
    cargo install mdbook
fi

# Build the mdbook (if mdbook is installed)
if command -v mdbook &> /dev/null
then
    cd ./mdbook && mdbook build
    if [ $? -eq 0 ]; then
        echo "✓ MdBook successfully built at ./mdbook/book/"
        echo "✓ View the book by opening ./mdbook/book/index.html in your browser"
    else
        echo "Error: mdbook build failed. Please check the error output above."
        exit 1
    fi
else
    echo "Unable to build mdbook. Please install mdbook manually with 'cargo install mdbook'"
    exit 1
fi 