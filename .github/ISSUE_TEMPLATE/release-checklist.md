---
name: Release checklist
about: The checklist for making a new release
title: Release VERSION
labels: ""
assignees: ""
---

Welcome Release Captain! ⛵️

<!-- Note to release captains: while filing this issue, replace ALL_CAPS words with their appropriate
values and then delete this instruction. -->

- [ ] Assign this issue to yourself.
- [ ] Set up your workspace as described
      [in the docs](https://mozilla.github.io/nimbus-shared/dev/setup) including the pre-commit
      hook.
- [ ] Check the [VERSION Milestone](LINK_TO_MILESTONE)
  - Any still open issues (except this one) should be merged or moved to a future milestone.
- [ ] Checkout and update the `main` branch locally.
- [ ] Update `CHANGELOG.md` and commit the changes.
  - Use the command `git log vPREVIOUS_VERSION..` to see commits between then and now.
  - [ ] Note any major changes to the data and schemas.
  - [ ] Note any major changes to the library.
  - [ ] Add any relevant minor changes.
- [ ] Use npm to bump the version. Use one of the following, depending on the version difference:
  - `npm version patch` - Bug fixes, doc updates, and other small changes.
  - `npm version minor` - Backwards compatible changes to library features, schemas, or data.
  - `npm version major` - Breaking changes to library features, schemas, or data.
- [ ] Use the commands `git push UPSTREAM_REMOTE main; git push UPSTREAM_REMOTE main --tags` to push
      your changes to GitHub.
- [ ] Wait for the CI job to publish the new version.
  - https://app.circleci.com/pipelines/github/mozilla/nimbus-shared
- [ ] In #project-nimbus on Slack, write:
      `@here Version VERSION of nimbus-shared has been released on NPM and PyPI`.
- [ ] Create a milestone, and a release issue for vNEXT_VERSION with the [release issue template][].
- [ ] Update the
      [DTO documentation](https://mana.mozilla.org/wiki/pages/viewpage.action?pageId=130920248) with
      the new version and any schema changes.
- [ ] Close this issue and the milestone.

[release issue template]:
  https://github.com/mozilla/nimbus-shared/issues/new?assignees=&labels=&template=release-checklist.md&title=Release+VERSION
