# Nimbus Shared ![CircleCI](https://img.shields.io/circleci/build/github/mozilla/nimbus-shared) ![npm (scoped)](https://img.shields.io/npm/v/@mozilla/nimbus-shared)

This is a place to define data and schemas used across Project Nimbus.

Any data that moves between systems should have TypeScript types defined here, which will be
automatically converted to JSON Schema. Any data that needs to be re-used by multiple systems should
be stored here to be shared.

For more information on the data and schemas included here, how to use them, and how to add to them,
see the documentation at https://mozilla.github.io/nimbus-shared
