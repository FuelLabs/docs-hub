#!/bin/sh
# Shallow-fetches every submodule listed in .submodule-pins at its pinned
# commit. Replaces `git submodule update --init` inside the Docker build,
# where the repository's .git directory is not available.
set -eu
cd "$(dirname "$0")/../.."
[ -s .submodule-pins ] || { echo ".submodule-pins is missing; run scripts/railway/submodule-pins.sh" >&2; exit 1; }
while read -r path commit url; do
  [ -n "$path" ] || continue
  if [ -d "$path" ] && [ -n "$(ls -A "$path")" ]; then
    echo "skip $path (already present)"
    continue
  fi
  echo "fetch $path @ $commit"
  rm -rf "$path"
  mkdir -p "$path"
  git -C "$path" init -q
  git -C "$path" remote add origin "$url"
  git -C "$path" fetch -q --depth 1 origin "$commit"
  git -C "$path" checkout -q FETCH_HEAD
  rm -rf "$path/.git"
done < .submodule-pins
