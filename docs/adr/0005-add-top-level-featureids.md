- Status: accepted
- Deciders: @k88hudson, @jaredlockhart
- Date: 2021-01-22

# Decision

In order to future-proof the DTO to support multiple feature configurations per experiment and
simplify looking up experiments by `featureId`, we will add a top-level `featureIds` property that
contains an array of `featureId`s:

```json
{
  "schemaVersion": "0.1.0",
  "id": "mobile-a-a-example",
  "slug": "mobile-a-a-example",
  "application": "reference_browser",
  "appId": "org.mozilla.reference.browser",
  "appName": "reference_browser",
  "featureIds": ["bookmark-icon"],
  "channel": "nightly",
  "userFacingName": "Mobile A/A Example",
  "userFacingDescription": "An A/A Test to validate the Rust SDK",
  "isEnrollmentPaused": false,
  "bucketConfig": {
    "randomizationUnit": "nimbus_id",
    "namespace": "mobile-a-a-example",
    "start": 0,
    "count": 5000,
    "total": 10000
  },
  "startDate": null,
  "endDate": null,
  "proposedEnrollment": 7,
  "referenceBranch": "control",
  "probeSets": [],
  "branches": [
    {
      "slug": "control",
      "ratio": 1,
      "feature": {
        "featureId": "bookmarkId",
        "enabled": true,
        "value": null
      }
    },
    {
      "slug": "treatment-variation-b",
      "ratio": 1,
      "feature": {
        "featureId": "bookmarkId",
        "enabled": true,
        "value": null
      }
    }
  ]
}
```

For now, branches will continue to include only one feature (no changes to the DTO).
