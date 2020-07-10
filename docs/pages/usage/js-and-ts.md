# Using this library from JavaScript and TypeScript

The schemas and data are published in the NPM package
[`@mozilla/nimbus-shared`](https://www.npmjs.com/package/@mozilla/nimbus-shared). It contains helper
methods to validate data by the schemas, all of the schemas directly. For TypeScript, it also
includes the original type definitions and helpers for TypeScript usage, such as type assertions.

## JavaScript

```js
import nimbus from "@mozilla/nimbus-shared";
```

JSON Schemas can be accessed in `nimbus.schemas`. Each schema group is an object under this export,
and the schemas are identified by their type name.

```js
import { schemas } from "@mozilla/nimbus-shared";
schemas.normandy.ConsoleLogArguments;
// {"$schema": "http://json-schema.org/draft-07/schema#", ...}
```

Helper functions to validate objects against those schemas can be found in in the `typeGuards`
package export.

```js
import { typeGuards } from "@mozilla/nimbus-shared";
typeGuards.normandy_checkConsoleLogArguments({});
/*
 * {
 *   ok: false,
 *   errors: [{message: "should have required property 'message'", ...}]
 * }
 */

typeGuards.normandy_checkConsoleLogArguments({ message: "It works!" });
/*
 * {
 *   ok: true,
 *   errors: []
 * }
 */
```

Shared data can be accessed by importing `data` from the package:

```js
import { data } from "@mozilla/nimbus-shared";
console.log(data.Audiences);
// { all_english: { ... }, us_only: { ... }, ... }
```

## TypeScript

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
