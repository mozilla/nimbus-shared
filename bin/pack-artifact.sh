#!/usr/bin/env bash
set -eu

# Prepare a directory for artifacts
BUNDLE_NAME="nimbus-shared-$(cat package.json | jq -r '.version')"
OUTDIR="artifacts/$BUNDLE_NAME"
mkdir -p $OUTDIR

# Copy all artifacts into it
cp -r ./schemas $OUTDIR

# Bundle it
tar -czvf $OUTDIR.tar.gz $OUTDIR
