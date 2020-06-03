# Rapid Experiments Shared ![CircleCI](https://img.shields.io/circleci/build/github/mozilla/rapid-experiments-shared)

This is a place to define data and schemas used across the rapid experiments program.

Any data that moves between systems should have Typescript types defined here, which will be
automatically converted to JSON Schema. Any data that needs to be re-used by multiple systems should
be stored here to be shared.

## Using the schemas

### Javascript

Install this package

```shell
$ npm install --save @mozilla/rapid-experiments-shared
```

Import it.

```js
import mres from "@mozilla/rapid-experiments-shared";
```

JSON Schemas can be accessed in `mres.schemas`:

```js
import { schemas } from "@mozilla.rapid-experiments-shared";
schemas.normandy.ConsoleLogArguments;
// {"$schema": "http://json-schema.org/draft-07/schema#", ...}
```

Helper functions to validate objects against those schemas can be found in `mres.typeGuards`.

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
from the filesystem. After installing this package via `npm`, the schemas will be available aty
`node_modules/@mozilla/rapid-experiments-shared/schemas/<group>/<type>.json`.

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
