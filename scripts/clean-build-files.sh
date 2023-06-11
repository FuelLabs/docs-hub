#!/bin/bash

# Remove all other files from build folder to reduce deploy size
rm -rf ./.next/standalone/docs/builds/sway/v*
rm -rf ./.next/standalone/docs/builds/sway/latest