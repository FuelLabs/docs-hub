#!/bin/sh
# Writes .submodule-pins: one "<path> <commit> <url>" line per submodule.
# The Railway build has no .git directory, so the Dockerfile reads this file
# instead of running `git submodule update`. Run it before `railway up`.
set -eu
cd "$(dirname "$0")/../.."
: > .submodule-pins
git config -f .gitmodules --get-regexp '^submodule\..*\.path$' | while read -r key path; do
  name=${key#submodule.}
  name=${name%.path}
  url=$(git config -f .gitmodules --get "submodule.$name.url")
  commit=$(git ls-tree HEAD "$path" | awk '$2 == "commit" { print $3 }')
  if [ -z "$commit" ]; then
    echo "no gitlink for $path in HEAD" >&2
    exit 1
  fi
  echo "$path $commit $url" >> .submodule-pins
done
sort -o .submodule-pins .submodule-pins
wc -l .submodule-pins
