# Rapid Experiments Shared ![CircleCI](https://img.shields.io/circleci/build/github/mozilla/rapid-experiments-shared)

This is a place to define data and schemas used across the rapid experiments program.

Any data that moves between systems should have a schema defined here. Schemas are defined using
Typescript, and automatically converted to JSON Schema. Any data that needs to be re-used by
multiple systems should be stored here to be shared.

## Using the schemas

### Javascript

Install this package

```shell
$ npm install --save @mozilla/rapid-experiments-shared
```

Import it.

```js
import mers from "@mozilla/rapid-experiments-shared";
```

JSON Schemas can be accessed in `mers.schemas` from JS, or in
`node_modules/@mozilla/rapid-experiments-shared/schemas` if file system access is more convenient.
Helper functions to validate objects against those schemas can be found in `mers.typeGuards`.

```js
import { typeGuards } from "@mozilla/rapid-experiments-shared";
typeGuards.normandy_checkConsoleLogArguments({});
/*
 * {
 *   ok: false,
 *   errors: [
 *     {
 *       keyword: 'required',
 *       dataPath: '',
 *       schemaPath: '#/definitions/ConsoleLogArguments/required',
 *       params: [Object],
 *       message: "should have required property 'message'"
 *     }
 *   ]
 * }
 */

typeGuards.normandy_checkConsoleLogArguments({ message: "It works!" });
/*
 * {
 *   ok: true,
 *   errors: null
 * }
 */
```

### Typescript

Everything from JS. Soon the original types will also be published, as will type guards and type
assertions.

### Python

Native support coming soon. For now, consider using the NPM package and loading the schemas directly
from `node_modules`.

---

## Working on this repo

Node 14 is required to work on this repository, though will not be required for the eventual bundled
outputs prepared for other systems.

Common tasks are defined as Make targets:

```shell
make install  # Install dependencies with NPM
make lint     # Run static analysis
make build    # Build output files
make test     # Test
```

Dependencies are managed with npm. Use `npm install --save` and `npm install --save-dev` to add new
dependencies.

## Adding a new schema

TBD
