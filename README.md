# Nimbus Shared ![CircleCI](https://img.shields.io/circleci/build/github/mozilla/nimbus-shared) ![npm (scoped)](https://img.shields.io/npm/v/@mozilla/nimbus-shared)

This is a place to define data and schemas used across Project Nimbus.

Any data that moves between systems should have Typescript types defined here, which will be
automatically converted to JSON Schema. Any data that needs to be re-used by multiple systems should
be stored here to be shared.

## Using the schemas

### Javascript

Install this package

```shell
$ npm install --save @mozilla/nimbus-shared
```

Import it.

```js
import nimbus from "@mozilla/nimbus-shared";
```

JSON Schemas can be accessed in `nimbus.schemas`:

```js
import { schemas } from "@mozilla.nimbus-shared";
schemas.normandy.ConsoleLogArguments;
// {"$schema": "http://json-schema.org/draft-07/schema#", ...}
```

Helper functions to validate objects against those schemas can be found in `nimbus.typeGuards`.

```js
import { typeGuards } from "@mozilla/nimbus-shared";
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

As well as everything available from JS, the original types the schemas are generated from are
available in the `types` export of the library. Additionally, well-typed guards and assertions are
available in `typeGuards`.

```typescript
import { types, typeGuards } from "@mozilla/nimbus-shared";

let incomingJson: object = { message: "json from the server" };
// incoming JSON is a generic object with no type information
if (typeGuards.normandy_isConsoleLogArguments(incomingJson)) {
  // incomingJson has been narrowed to `types.normandy.ConsoleLogArguments
} else {
  // Something is wrong, and the types don't match what we expected.
}

const message: types.messaging.SimpleCFRMessage = { id: "incomplete-message" };
// Error: missing the following properties from type 'SimpleCFRMessage': template, trigger, content

const userInput = { arbitrary: "json" };
typeGuards.normandy_assertAddonRollbackArguments(userInput);
// userInput has now been asserted to be of type `normandy.AddonRollbackArguments`.
// If it wasn't the previous line would have thrown an error.
```

### Python

Basic native support is available via the PyPI package `mozilla-nimbus-shared`. The only function is
exposed is one to validate an object against a named schema.

```python
from mozilla_nimbus_shared import check_schema

# Throws an error with details of the problems
check_schema("normandy/ConsoleLogArguments", {})

# Returns True
check_schema("normandy/ConsoleLogArguments", {"message": "hello, world!"})
```

### Other

For other applications, consider using the NPM package and loading the schemas directly from the
filesystem. After installing this package via `npm`, the schemas will be available at
`node_modules/@mozilla/nimbus-shared/schemas/<group>/<type>.json`. Please leave an issue on this
repository if you have a use case not covered by the above.

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
