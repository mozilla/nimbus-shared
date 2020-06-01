# Rapid Experiments Shared ![CircleCI](https://img.shields.io/circleci/build/github/mozilla/rapid-experiments-shared)

This is a place to define data and schemas used across the rapid experiments
program.

Any data that moves between systems should have a schema defined here. Schemas
are defined using Typescript, and automatically converted to JSON Schema. Any
data that needs to be re-used by multiple systems should be stored here to be
shared.

## Working on this repo

Common tasks are defined as Make targets:

```shell
make install  # Install dependencies with NPM
make lint     # Run static analysis
make build    # Build output files
make test     # Test
```

Node 14 is required to work on this repository, though will not be required for
the eventual bundled outputs prepared for other systems.

## Using the schemas

TBD

## Adding a new schema

TBD

## Schema tests

TBD
