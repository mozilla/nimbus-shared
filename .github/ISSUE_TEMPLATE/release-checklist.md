---
name: Release checklist
about: The checklist for making a new release
title: Release VERSION
labels: ""
assignees: ""
---

Welcome Release Captain! ⛵️

Before you start, you'll need to make sure you have credentials to make a new release of the NPM and
PyPI packages.

- [ ] Assign this issue to yourself
- [ ] Check the [VERSION Milestone](LINK TO MILESTONE)
  - Any still open issues (except this one) should be merged or moved to a future milestone.
- [ ] Checkout and update the `main` branch locally
- [ ] Update `CHANGELOG.md` and commit the changes
  - `git log vPREVIOUS_VERSION..`
  - [ ] Note any major changes to the data and schemas
  - [ ] Note any major changes to the library
  - [ ] Add any relevant minor changes
- [ ] Use npm to bump the version: `npm version patch`
- [ ] `git push; git push --tags`
- [ ] `make pack`
- [ ] `npm publish`
- [ ] `cd python; poetry publish`
- [ ] In #project-nimbus on Slack, write:
      `@here Version VERSION of nimbus-shared has been released on NPM and PyPI`
- [ ] Create milestone (if needed) and a release issue for vNEXT_VERSION
- [ ] Close this issue and the milestone
