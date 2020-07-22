#!/usr/bin/env bash
set -eu

# Strip a leading 'python/' from files paths passed
declare -a cmd
cmd=(black)
for arg in "$@"; do
  if [[ $arg == python/* ]]; then
    cmd=("${cmd[@]}" "${arg#python/}")
  else
    cmd=("${cmd[@]}" "$arg")
  fi
done

cd python
poetry run "${cmd[@]}"