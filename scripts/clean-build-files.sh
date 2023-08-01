#!/bin/bash

# Remove all other files from build folder to reduce deploy size
rm -rf ./docs/builds/sway/v*
rm -rf ./docs/builds/sway/latest

# generate sidebar links
pnpm generate:links
