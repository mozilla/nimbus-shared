# Use JSON Schema generated in nimbus-shared for cross-platform validation of Experiment data

- Status: Accepted
- Author: Kate Hudson
- Deciders: Nimbus team, Cirrus team
- Date: H1 2020

## Context and Problem Statement

Nimbus Experiment configurations are stored in the Experiment Console (Experimenter), sychronized to
clients via Remote Settings and interpreted by the Nimbus SDK, which as of current writing, includes
both a JS implementation in Firefox Desktop and a Rust implementation that will eventually replace
it. Jetstream must also call the Experimenter API in order to read metadata about live experiments.

We need some way to validate data across multiple applications and languages (Python, Rust, JS) and
a process for publishing changes.

## Decision Outcome

### Format and Language

We decided to use [JSON Schema Draft-07](https://tools.ietf.org/html/draft-handrews-json-schema-01)
for cross-platform validation of the experiment schema since validators are available in many
languages, including Python, Rust, and JS.

However, because JSON Schema is difficult to read and write directly, we decided to use Typescript
as the source for Experiment schemas and generate JSON Schema from them using
`ts-json-schema-generator`. This library allows us add validations and annotations outside of what
Typescript provides in its type system (e.g. integers, default and min values, description).

### Publishing changes across the system

The source code for the schema lives in a cental repository
([mozilla/nimbus-shared](https://github.com/mozilla/nimbus-shared/blob/9a74dde37cbfb73dacd49e8daa66b66cb013619b/types/experiments.ts)).
Schemas are generated on CircleCI and clients can install the `nimbus-shared` package to access them
(as well as some utility methods) from [npm](https://www.npmjs.com/package/@mozilla/nimbus-shared)
or [PyPI](https://pypi.org/project/mozilla-nimbus-shared/).

### Process for introducing updates to the schema

1. Create a PR on the nimbus-shared repo, cc teach leads from other projects.
2. Use the nimbus-shared
   [release process](https://github.com/mozilla/nimbus-shared/blob/main/.github/ISSUE_TEMPLATE/release-checklist.md)
   to tag and release a new version of the schema to npm/PyPI.
3. Bump the version in clients using package managers (Experimenter, Jetstream,
   mozilla-inflight-assets) to upgrade to the new version of the schema.
4. Manually update Firefox Desktop by copying the latest schema and creating a phabricator patch.

## Other Options considered

### Format and Language (v.s. JSON Schema v7 generated from Typescript)

- Write JSON schema directly (Hard to read/write)
- Use JSON schema compatible with MC's
  [JsonSchemaValidator](https://searchfox.org/mozilla-central/rev/222e4f64b769413ac1a1991d2397b13a0acb5d9d/toolkit/components/utils/JsonSchemaValidator.jsm)
  (Missing a lot of features like anyOf, non-standard)

### Publishing changes across the system (v.s. nimbus shared)

- SDK is the source of truth (SDK may have breaking changes that do not necessitate a schema change,
  so they must be versioned separately)
- Use an HTTP endpoint for the accessing schema (requires creating custom server-side infra for
  versioning)
