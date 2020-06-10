import { assert } from "chai";
import { schemas, typeGuards } from "../";

describe("checkSchema", () => {
  it("should show all errors", () => {
    // First make sure that we have the schema we are testing with
    assert.exists(schemas.normandy.AddonRolloutArguments);

    // Now test it against an empty object, which should produce two errors
    const { ok, errors } = typeGuards.normandy_checkAddonRolloutArguments({});
    assert.isFalse(ok);
    assert.lengthOf(errors, 2, "Errors for two fields should be reported");
  });
});
