import { typeGuards } from "..";
import { assert } from "chai";

const TEST_EXPERIMENT = {
  slug: "bug-1637316-message-aboutwelcome-pull-factor-reinforcement-76-rel-release-76-77",
  application: "firefox-desktop",
  channels: ["nightly"],
  userFacingName: "About:Welcome Pull Factor Reinforcement",
  userFacingDescription:
    "4 branch experiment different variants of about:welcome with a goal of testing new experiment framework and get insights on whether reinforcing pull-factors improves retention. Test deployment of multiple branches using new experiment framework",
  isEnrollmentPaused: true,
  bucketConfig: {
    randomizationUnit: "normandy_id",
    namespace: "bug-1637316-message-aboutwelcome-pull-factor-reinforcement-76-rel-release-76-77",
    start: 0,
    count: 2000,
    total: 10000,
  },
  startDate: null,
  endDate: null,
  proposedEnrollment: 7,
  referenceBranch: "control",
  probeSets: [],
  branches: [
    {
      slug: "control",
      ratio: 1,
      feature: {
        featureId: "cfr",
        enabled: true,
        value: null,
      },
    },
    {
      slug: "treatment-variation-b",
      ratio: 1,
      feature: {
        featureId: "cfr",
        enabled: true,
        value: null,
      },
    },
  ],
};

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
});
