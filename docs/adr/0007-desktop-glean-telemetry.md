# Nimbus Desktop Glean Instrumentation

- Status: Accepted
- Author: Travis Long
- Deciders: Nimbus team, Anna Scholtz (Data Engineering), Daniel Berry (Data Science)
- Date: H1 2022

## Context and Problem Statement

The current Nimbus Desktop implementation relies on Legacy Telemetry events borrowed from Normandy.
As components migrate to Glean with their metrics recorded in Glean, it will become necessary to
have Nimbus events and experiments also recorded in Glean for the purpose of analysis.

Adding further complication to instrumenting these events in Glean, the Nimbus Rust SDK used on
mobile has some minor differences in the telemetry implementation. The current Legacy events include
“enroll”, “unenroll”, and “expose”, which compare to “enrollement”, “unenrollment”, and “exposure”
Glean events in the Nimbus SDK used on mobile. The Nimbus Rust SDK also includes a
“disqualification” event that has no current Desktop equivalent while Desktop includes "failure"
events for both enrollment and unenrollment.

## Considered Options

- Option A - Status quo (Nimbus Desktop will continue to use only Legacy Telemetry)
- Option B - New Glean events that are exact duplicates of existing Legacy Telemetry events
- Option C - Glean Events that match the mobile SDK collection, mapped to legacy events as close as
  possible
- Option D - Merge existing mobile SDK events and Desktop events, preferring SDK names to ensure
  that if and when Desktop migrates to the Rust SDK that there is continuity in the data collection

Due to needing to support components running experiments that might be using either Legacy only,
Legacy and Glean simultaneously, or just Glean, we will continue to record data in Legacy Telemetry
until it is deprecated and removed, or all components/measurements have migrated to Glean.

## Decision Outcome

There are Firefox Desktop components that have already migrated to Glean, as well as components that
are instrumenting critical new metrics in Glean, we cannot simply rely on the current Legacy
Telemetry events as instrumented in Nimbus Desktop. The components that have or will migrate to
Glean will benefit from having experiment metrics recorded in Glean alongside the guardrail and
interesting metrics that they may wish to monitor while running a Nimbus experiment. Because the
long-term goal is to eventually migrate Firefox Desktop to use the Nimbus SDK that is currently
being used on mobile devices, instrumenting metrics that match the existing Legacy metrics could
potentially create collisions, conflicts or issues when that migration occurs. Legacy telemetry also
includes metrics not currently instrumented in the Rust SDK used on mobile, specifically the
"enroll_failed" and "unenroll_failed" events.

For those reasons, and to ensure continuity of existing experiments, Option D is the preferred
approach. Each of the Nimbus Rust SDK “enrollment”, “unenrollment”, and “exposure” events that have
direct parallels in Firefox Desktop telemetry will be recorded with the same information and in the
same manner as the existing Legacy Telemetry instrumentation, to ensure continuity and to aid in
verification of migration of any analysis tooling that relies upon those events. The Nimbus SDK
“disqualification” event, which has no current analog in Nimbus Desktop and overlaps with how the
the "unenroll" telemetry is recorded in Nimbus Desktop currently, will be removed. The
disqualification event in the Nimbus SDK is already treated as an "unenrollment" by the monitoring.
Finally, the "enroll_failed" and "unenroll_failed" events will be instrumented as Glean events in
Firefox Desktop and also be added to the Nimbus Rust SDK for consistency.

Below is a table that shows the merged set of events that will be instrumented in Firefox Desktop,
including the "failure" events, which will be implemented in the Nimbus SDK. The "reason" and
"experimentType" extras will also be implemented in the Nimbus SDK.

| Nimbus Desktop  | Nimbus SDK       | Merged          |
| --------------- | ---------------- | --------------- |
| enroll          | enrollment       | enrollment      |
| unenroll        | unenrollment     | unenrollment    |
| expose          | exposure         | exposure        |
| N/A             | disqualification | N/A (removing)  |
| enroll_failed   | N/A              | enroll_failed   |
| unenroll_failed | N/A              | unenroll_failed |

Existing Desktop events appear in the following structure:

```
{
  category: "normandy"
  method: "<enroll/unenroll/expose/enroll_failed/unenroll_failed>"
  object: "nimbus_experiment"
  value: <experiment-slug>
  extra: {
    branch: <branch-slug>  // Included in all events
    enrollment_id: <enrollment-id> // Included in all events
    reason: <reason> // Included in failure and unenroll events
    experimentType: <type> // Included in enroll event
    featureId: <feature-id> // Included in exposure events
  }
}
```

Glean events will have a slightly different structure, but contain the same information:

```
{
  name: nimbus_events.<enrollment/unenrollment/exposure/etc.>
  extra_keys: {
    experiment: <experiment-slug> // Included in all events
    branch: <branch-slug> // Included in all events
    enrollment_id: <enrollment-id> // Included in all events
    reason: <reason> // Included in failure and unenrollment events
    experiment_type: <type> // Included in enrollment events
    feature_id: <feature-id> // Included in exposure events
  }
}
```
