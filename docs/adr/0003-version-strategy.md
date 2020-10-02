# Versioning for Nimbus ExperimentSchema

- Status: Draft
- Author: Kate Hudson
- Deciders: Nimbus team, Cirrus team
- Date: October 2020

## Context and Problem Statement

As per ADR-0002, we decided to use
[JSON Schema Draft-07](https://tools.ietf.org/html/draft-handrews-json-schema-01) for the Nimbus
Experiment Schema. Besides having some way of validating data across these applications, we also
have to manage the additional complexity that any given time experiments may be live that are only
compatible with a subset of clients.

In order to prevent clients from receiving experiment defitions that could cause breakage while
preserving the flexibility to update the Nimbus Experiment Schema when necessary, we need:

- A versioning strategy that can be used to express compatibility ranges between experiments and
  clients
- A better process for making changes to the schema and coordinating those changes across
  applications

## Decision Drivers

- Is the versioning strategy clearly understood and relatively simple to implement across all Nimbus
  applications?
- How much complexity does the versioning strategy introduce to manage backwards compatibilty? While
  we occasionally need to target older versions of clients, our primary use case is to be able to
  launch experiments to the most recent version of clients without causing breakage to old ones.
- Is the versioning strategy appropriate for our current early phase of development, in which we
  expect to make changes to the schema relatively frequently?

## Decision Outcome

[TBD]

## Recommendation

### Option A - Use per-record versioning

Because at any given time a Remote Settings Collection could be read by clients with multiple
versions of the SDK, using per-record versioning would allow us to update to a new schema without
breaking older clients or disrupting existing experiments. We would need to:

- associate each version of the schema with a version
- add a `schemaVersion` field to each record.
- add some logic to the client to ignore new experiments of a different major version

#### Example

Let's say the current latest version of the Nimbus Experiment schema is `2.1.2`. Applications are in
following state:

- Experimenter publishes new experiments with `schemaVersion`= `2.1.2`
- The latest version of the SDK uses schema version `2.1.2`
- Clients in Fenix release are on `2.1.2` (it has the latest version of the SDK)
- Clients in Latest Desktop Firefox 84 are on `2.0.4` (it has an older version of the SDK)
- Clients in Desktop Firefox 83 are on `2.0.0`, and Clients in Firefox 82 are on `1.0.1`.

In this example, new experiments would be accepted by Fenix, Firefox Desktop 84 and 83 but not on
Firefox 82.

#### SemVer-ish?

- Could we use
  [SchemaVer](https://snowplowanalytics.com/blog/2014/05/13/introducing-schemaver-for-semantic-versioning-of-schemas/)
  to make version updates more relevant to data models/schema changes?

#### Pros

- Allows us to introduce breaking changes without overhead of a new RS bucket
- Semver is realtively familiar, SemVer comparison implementations widely available

#### Cons

- SemVer can get confusing - hard to decide what consitutes a breaking change
- Fairly course-grained especially for something that changes often like targeting attributes; not
  as flexible as capabilities-based system
- Requires specific client logic to check major version

## Other options considered

### Option B - Use major version on API + application version ranges on records

This is what we currently do for other services in Fx Desktop like Mesasging System, including
Snippets. Applications are tied to a single major version of the service (e.g. Snippets version 5)
that is very infrequently changed. If the major version is bumped, the client throws out all cached
data and re-queries the new endpoint

Individual records have a version range (e.g. version >= Firefox 81) to avoid potential breakage on
older versions and need to be manually tested. Breaking changes require a new remote settings
collection.

#### Pros

- No additional client-side versioning logic
- Simpler to implement for Experimenter

#### Cons

- The one-version-for-all-records model doesn't work well if clients on multiple versions have to
  read the same remote settings collection.
- Having to change the remote settings collection for every breaking change adds a lot of complexity
  on both the client and the server.

### Option B - Use capabilities-based versioning

See Capabilities Proposal in[1]

## Links

- [1][versioning for nimbus proposal](https://docs.google.com/document/d/1dmO94BjFtdSzsN9z9tuRrc-QIUKC9DLQdk-66f9V3Dg/edit#)
