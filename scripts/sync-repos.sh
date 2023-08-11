#!/bin/bash

git submodule update --init

# TODO: Remove after fuels-rs version updated past 43
cd docs/fuels-rs
git cherry-pick 989026923b7cca989bf93a7aae481b04e7be915a
