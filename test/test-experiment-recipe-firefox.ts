import { typeGuards } from "..";
import { assert } from "chai";
import TEST_LEGACY_EXPERIMENT from "../data/experiment-recipe-samples/desktop-90.json";
import TEST_EXPERIMENT from "../data/experiment-recipe-samples/desktop-98.json";
import TEST_EXPERIMENT_FEATURE_VALIDATION_OPT_OUT from "../data/experiment-recipe-samples/desktop-107-featureValidationOptOut.json";
import TEST_EXPERIMENT_LOCALIZATIONS from "../data/experiment-recipe-samples/desktop-113-localizations.json";
import TEST_EXPERIMENT_LOCALES from "../data/experiment-recipe-samples/desktop-115-locales.json";

describe("experiment schemas legacy", () => {
  it("should validate an existing onboarding experiment", async () => {
    typeGuards.experiments_assertNimbusExperiment(TEST_LEGACY_EXPERIMENT);
  });
});

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
    assert.propertyVal(result.errors[0], "message", 'should match format "date"');
  });
  it("should fail on a non-boolean for a boolean", async () => {
    const result = typeGuards.experiments_checkNimbusExperiment({
      ...TEST_EXPERIMENT,
      isRollout: "foo",
    });
    assert.equal(result.ok, false, "validation should fail");
    assert.propertyVal(result.errors[0], "message", "should be boolean");
  });
  it("should fail on a non-integer value for a number", async () => {
    const result = typeGuards.experiments_checkNimbusExperiment({
      ...TEST_EXPERIMENT,
      proposedEnrollment: 7.1,
    });
    assert.equal(result.ok, false, "validation should fail");
    assert.propertyVal(result.errors[0], "message", "should be integer");
  });
});

describe("featureValidationOptOut", () => {
  it("is supported", async () => {
    typeGuards.experiments_assertNimbusExperiment(TEST_EXPERIMENT_FEATURE_VALIDATION_OPT_OUT);
  });
});

describe("localizations", () => {
  it("is supported", () => {
    typeGuards.experiments_assertNimbusExperiment(TEST_EXPERIMENT_LOCALIZATIONS);
  });
});

describe("locales field", () => {
  it("is supported", () => {
    typeGuards.experiments_assertNimbusExperiment(TEST_EXPERIMENT_LOCALES);
  });
});
