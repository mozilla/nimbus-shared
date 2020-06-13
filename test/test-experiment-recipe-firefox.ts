import {typeGuards} from "..";

const TEST_EXPERIMENT = {
  "id": "ABOUTWELCOME-PULL-FACTOR-REINFORCEMENT-76-RELEASE",
  "enabled": true,
  "filter_expression": "(env.version >= '76.' && env.version < '77.' && env.channel == 'release' && !(env.telemetry.main.environment.profile.creationDate < ('2020-05-13'|date / 1000 / 60 / 60 / 24))) || (locale == 'en-US' && [userId, \"aboutwelcome-pull-factor-reinforcement-76-release\"]|bucketSample(0, 2000, 10000) && (!('trailhead.firstrun.didSeeAboutWelcome'|preferenceValue) || 'bug-1637316-message-aboutwelcome-pull-factor-reinforcement-76-rel-release-76-77' in activeExperiments))",
  "arguments": {
    "slug": "bug-1637316-message-aboutwelcome-pull-factor-reinforcement-76-rel-release-76-77",
    "userFacingName": "About:Welcome Pull Factor Reinforcement",
    "experimentDocumentUrl": "https://experimenter.services.mozilla.com/experiments/aboutwelcome-pull-factor-reinforcement-76-release/",
    "userFacingDescription": "4 branch experiment different variants of about:welcome with a goal of testing new experiment framework and get insights on whether reinforcing pull-factors improves retention. Test deployment of multiple branches using new experiment framework",
    "isEnrollmentPaused": true,
    "active": true,
    "bucketConfig": {
      "randomizationUnit": "normandy_id",
      "namespace": "bug-1637316-message-aboutwelcome-pull-factor-reinforcement-76-rel-release-76-77",
      "start": 0,
      "count": 2000,
      "total": 10000
    },
    "startDate": new Date(),
    "endDate": null,
    "proposedEnrollment": 7,
    "referenceBranch": "control",
    "features": [],
    "branches": [
      {
        "slug": "control",
        "ratio": 1,
        "value": {}
      },
      {
        "slug": "treatment-variation-b",
        "ratio": 1,
        "value": {}
      }
    ],
  },
};


describe("experiment schemas", () => {
  it("should validate an existing onboarding experiment", async () => {
    const result = typeGuards.experiments_checkExperimentRecipe(TEST_EXPERIMENT);
    if (!result.ok) {
      throw new Error(JSON.stringify(result.errors, null, 2));
    }
  });
});
