import fs from "fs";
export * from "./typeGuardHelpers";

import Ajv from "ajv";
import { isBoolean } from "util";

export function checkSchema(
  schemaName: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: object
): boolean {
  const ajv = new Ajv();

  const schemaText = fs.readFileSync(`schemas/${schemaName}.json`, {
    encoding: "utf8",
  });
  const schema = JSON.parse(schemaText);

  const validationResult = ajv.validate(schema, obj);
  if (!isBoolean(validationResult)) {
    throw new Error(
      "Schema validation cannot be async, but AJV returned an async result"
    );
  }
  if (!validationResult) {
    console.error(ajv.errors);
  }
  return validationResult;
}
