import Ajv from "ajv";

import * as schemas from "./_generated/schemas";

const _cachedAjv = new Ajv({ allErrors: true });

export type SchemaResult = { ok: false; errors: Array<Ajv.ErrorObject> } | { ok: true; errors: [] };

// eslint-disable-next-line @typescript-eslint/ban-types
export function checkSchema(schemaKey: string, obj: object): SchemaResult {
  if (_cachedAjv.getSchema(schemaKey) === undefined) {
    const parts = schemaKey.split("/");
    let pointer: Record<string, unknown> = schemas;
    for (const part of parts) {
      pointer = pointer[part] as Record<string, unknown>;
      if (!pointer) {
        throw new Error(`Could not find schema with key ${schemaKey}`);
      }
    }
    _cachedAjv.addSchema(pointer, schemaKey);
  }

  const validationResult = _cachedAjv.validate(schemaKey, obj);
  if (typeof validationResult !== "boolean") {
    throw new Error("Schema validation cannot be async, but AJV returned an async result");
  }
  if (validationResult) {
    if (_cachedAjv.errors?.length) {
      throw new Error(
        "Object matches schema, but errors are listed. " +
          "This is very likely a bug in nimbus-shared or AJV. " +
          "Errors reported: " +
          JSON.stringify(_cachedAjv.errors),
      );
    }
    return { ok: true, errors: [] };
  } else {
    if (!_cachedAjv.errors) {
      throw new Error("Object did not match schema, but no errors listed");
    }
    return { ok: false, errors: _cachedAjv.errors };
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isSchema(schemaKey: string, obj: object): boolean {
  return checkSchema(schemaKey, obj).ok;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function assertSchema(schemaKey: string, obj: object): void {
  const { ok, errors } = checkSchema(schemaKey, obj);
  if (!ok) {
    throw new Error(`Object does not match schema: ${JSON.stringify(errors)}`);
  }
}
