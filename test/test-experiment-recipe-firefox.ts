import { typeGuards } from "..";
import { assert } from "chai";
import TEST_EXPERIMENT from "../data/experiment-recipe-samples/pull-factor.json";
import TEST_82_83 from "../data/experiment-recipe-samples/cfr-82-83.json";

describe("experiment schemas", () => {
  it("should validate an existing onboarding experiment", async () => {
    typeGuards.experiments_assertNimbusExperiment(TEST_EXPERIMENT);
  });
  it("should fail on a non-ISO date", async () => {
    const result = typeGuards.experiments_checkNimbusExperiment({
      ...TEST_EXPERIMENT,
      startDate: "foo",
    });
    assert.equal(result.ok, false, "validation should fail");
    assert.propertyVal(result.errors[0], "message", 'should match format "date-time"');
  });
  it("should fail on a non-integer value for a number", async () => {
    const result = typeGuards.experiments_checkNimbusExperiment({
      ...TEST_EXPERIMENT,
      proposedEnrollment: 7.1,
    });
    assert.equal(result.ok, false, "validation should fail");
    assert.propertyVal(result.errors[0], "message", "should be integer");
  });
  it("should validate an existing 82-83 experiment with arguments", async () => {
    typeGuards.experiments_checkNimbusExperiment(TEST_82_83);
  });
});
