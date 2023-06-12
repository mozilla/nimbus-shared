# Changelog

# Verison 2.4.0

- Allow locales to be null [#251](https://github.com/mozilla/nimbus-shared/pull/251)

## Version 2.3.0

- Remove l10n string id validation [#248](https://github.com/mozilla/nimbus-shared/pull/248)

## Version 2.2.1

- Make sure to run `make pack` before `npm publish`

## Version 2.2.0

- Constrain l10n string ids [#243](https://github.com/mozilla/nimbus-shared/pull/243)
- Add locales field. [#245](https://github.com/mozilla/nimbus-shared/pull/245)

## Version 2.1.0

- Make localizations field nullable. [#241](https://github.com/mozilla/nimbus-shared/pull/241)

## Version 2.0.1

- Schemas for the Python package are now packaged in the correct location.
  [#237](https://github.com/mozilla/nimbus-shared/pull/237)

## Version 2.0.0

### Major Changes

- Python 3.7+ is now required. [#234](https://github.com/mozilla/nimbus-shared/pull/234).
- jsonschema dependency updated to 4.17.3+
  [#234](https://github.com/mozilla/nimbus-shared/pull/234).
- Added localization field to Nimbus Experiment schema
  [#232](https://github.com/mozilla/nimbus-shared/pull/232).

## Version 1.10.0

### Major Changes

- Added `Experiment.featureValidationOptOut`
  [#213](https://github.com/mozilla/nimbus-shared/pull/213).

## Version 1.9.0

### Major Changes

- Removed `Experiment.filter_expression`
  [#208](https://github.com/mozilla/nimbus-shared/issues/208).
- Removed `ExperimentFeature.enabled` [#184](https://github.com/mozilla/nimbus-shared/issues/184).
- Removed Firefox Messaging System types [#206](https://github.com/mozilla/nimbus-shared/pull/206).

## Version 1.8.0

### Major Changes

- Add `isRollout` boolean property to Experiment type
  [#183](https://github.com/mozilla/nimbus-shared/issues/183)

## Version 1.7.0

### Major Changes

- Multifeature support in Desktop and Mobile including Legacy Desktop

## Version 1.6.2

### Minor Changes

- Updating package.json

## Version 1.6.1

### Minor Changes

- Prettier formatting

## Version 1.6.0

### Minor Changes

- Support multifeature

## Version 1.5.0

### Minor Changes

- Make `featureConfig` required

## Version 1.4.0

### Minor Changes

- Add `outcomes` key to the Experiment DTO.
- Deprecated `probeSets`.

## Version 1.3.0

### Minor Changes

- Add `featureIds` at the top level to support the SDK filtering experiments by `featureId` more
  easily.
- Add `app_id` and `app_name` at the top level for automated analysis and for filtering in the
  nimbus-sdk
- Deprecated `application`

## Version 1.2.0

### Minor Changes

- Add `channel` for jetstream to use during the analysis phase (no impact to SDK consumers)

## Version 1.1.0

### Minor Changes

- Allow `additionalProperties` on all schemas to support non-breaking minor changes.

## Version 1.0.0

### Major Changes

- New schema format that corresponds to a per-record `schemaVersion`

## Version 0.1.0

### Minor Changes

- Added platforms field to Experiment type
  ([#113](https://github.com/mozilla/nimbus-shared/issues/113))
- Removed userId from randomization unit choices
  ([#110](https://github.com/mozilla/nimbus-shared/issues/110))

## Version 0.0.9

### Library Changes

- Templated string for slug in audiences
  ([#102](https://github.com/mozilla/nimbus-shared/issues/102))

## Version 0.0.8

### Library Changes

- Changed audiences to allow a variable firefox_release
  ([#98](https://github.com/mozilla/nimbus-shared/issues/98))

## Version 0.0.7

### Library Changes

- Fix a bug preventing data from being accessible in Python
  ([#91](https://github.com/mozilla/nimbus-shared/pull/91))

## Version 0.0.6

### Content Changes

- Add count to AA preset ([#69](https://github.com/mozilla/nimbus-shared/pull/69))
- Add Proposed duration to Experiment ([#68](https://github.com/mozilla/nimbus-shared/pull/68))
- Add Firefox channel to audiences ([#60](https://github.com/mozilla/nimbus-shared/pull/60))
- Add filter_expression and targeting to AA preset fixes
  ([#73](https://github.com/mozilla/nimbus-shared/pull/73))
- Compatibility of messaging schema with Mozilla-Central

### Library Changes

- Show schemas and data in docs ([#70](https://github.com/mozilla/nimbus-shared/pull/70))
- Add heading links to docs ([#70](https://github.com/mozilla/nimbus-shared/pull/70))
- Docs are compatible with more browsers ([#78](https://github.com/mozilla/nimbus-shared/pull/78))

### Minor changes

- Format with Prettier ([#67](https://github.com/mozilla/nimbus-shared/pull/67))
- Automatic publishing of the library ([#82](https://github.com/mozilla/nimbus-shared/pull/82),
  [#84](https://github.com/mozilla/nimbus-shared/pull/84))

## Version 0.0.5

### Library Changes

- Data is now included, type checked, and translated into native formats in Node and Python
  packages. ([#43](https://github.com/mozilla/nimbus-shared/pull/43))

## Version 0.0.4

### Content Changes

- Added Experiment schema and preset for A/A
  ([#44](https://github.com/mozilla/nimbus-shared/pull/44))
- Add Audience schema and data definitions ([#45](https://github.com/mozilla/nimbus-shared/pull/45))
- Add Features schema and data definitions ([#55](https://github.com/mozilla/nimbus-shared/pull/55))

### Minor Changes

- Rename the default branch of the Github repo to main

## Version 0.0.3

### Major Changes

- Added a Python package `mozilla-nimbus-shared` published on PyPI

## Version 0.0.2

### Major Changes

- Schema checks now includes an empty list of errors when schemas match, instead of null
- Rename to nimbus-shared

### Minor Changes

- Add CFR schemas
- Add docs for JS and TS usage
- Expose types for TS usage
- Return all errors from schema validation

## Version 0.0.1

- Initial release on NPM
