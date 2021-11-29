---
name: Schema Change Checklist
about: The checklist for making a schema change
title: Schema Change for <changes>
labels: ""
assignees: ""
---

Welcome Change Captain! ⛵️

When making schema changes, follow this guidance to avoid breaking changes:

- Rather than modifying an existing field, consider adding a new field with a new name and later
  deprecating the old field when it is no longer used

  - When modifying a field by adding and deprecating, document:
    - The expected behaviour of the old field in terms of the new
    - The expected behaviour when both fields are present. (e.g. in the presence of both fields, the
      new old field should be ignored)

- When deprecating an existing field, consider making it optional/nullable rather than removing it
  altogether and then removing it entirely when all clients/active experiments no longer depend on
  it

### Proposing Schema Changes

- [ ] Assign this issue to yourself
- [ ] Add a comment below describing the changes at a high level, including all new/deprecated
      fields, their types, and their uses
  - [ ] Link to any related proposal documentation
- [ ] Create a PR which introduces the schema changes and includes the following
  - [ ] Changes to [relevant types](https://github.com/mozilla/nimbus-shared/tree/main/types)
  - [ ] Changes to their [associated tests](https://github.com/mozilla/nimbus-shared/tree/main/test)
  - [ ] New [sample data](https://github.com/mozilla/nimbus-shared/tree/main/data) demonstrating
        their use for each of desktop/mobile
- [ ] Send an email to the [Services RFCs Mailing List](mailto:services-rfcs@mozilla.com) with a
      link to the PR requesting feedback
- [ ] Receive feedback, update the PR as necessary, and commit it
- [ ] Create a [release](https://mozilla.github.io/nimbus-shared/dev/deployments) including the new
      changes
- [ ] File tickets/epics for all Nimbus clients to implement the changes
  - [ ] [Nimbus Desktop](https://bugzilla.mozilla.org/enter_bug.cgi?product=Firefox&component=Nimbus%20Desktop%20Client)
  - [ ] [Nimbus Mobile](https://mozilla-hub.atlassian.net/jira/software/c/projects/SDK/boards/154/backlog)
  - [ ] Add all filed tickets/epics in a comment below
- [ ] For deprecated fields, file a ticket in
      [Nimbus Engineering](https://mozilla-hub.atlassian.net/jira/software/c/projects/EXP/boards/222/backlog)
      to add a warning to the Nimbus UI that the field will be deprecated and provide guidance about
      how experiment/feature owners should migrate away from their dependence on the deprecated
      field

### When Client Changes Are Complete

- [ ] File tickets/epics for all Nimbus Clients for the new changes to be QAed by supplying the new
      sample data to the relevant (desktop/mobile) client(s) and verifying the intended behaviour
  - [ ] [Nimbus Desktop](https://bugzilla.mozilla.org/enter_bug.cgi?product=Firefox&component=Nimbus%20Desktop%20Client)
  - [ ] [Nimbus Mobile](https://mozilla-hub.atlassian.net/jira/software/c/projects/SDK/boards/154/backlog)
  - [ ] Add all filed tickets/epics in a comment below

### When Client QA is Complete

- [ ] Add a comment below with a QA report that includes
  - [ ] Which version of each client application was tested
  - [ ] Link to any bugs which were detected in testing

### When Bugs Are Resolved and Clients Are Released

- [ ] Comment below indicating which version of each client application includes the changes
  - Hint: this is much easier to do by noting the last version of the client application that didn't
    have the change at the time of making the change
- [ ] File tickets/epics in
      [Nimbus Engineering](https://mozilla-hub.atlassian.net/jira/software/c/projects/EXP/boards/222/backlog)
      to implement the changes in Experimenter and add them in a comment below, including:

  - [ ] Changes to relevant APIs
  - [ ] Changes to UI
  - Note for deprecated fields
    - [ ] First prevent the usage of deprecated fields in experiments targeting versions where those
          fields are no longer supported
    - [ ] Then make sure no currently active experiments still depend on them before removing them
          from UI/APIs
    - Leave the fields in the database so that historical data is preserved and the change can be
      easily reverted if necessary

- [ ] File tickets/epics in [Jetstream](https://github.com/mozilla/jetstream/issues/new) to adapt it
      to any incoming changes that affect its analysis
  - Note changing Jetstream and Experimenter may cause conflicts so try to coordinate both changes
    to go out as close together as possible

### When Experimenter Changes Are Complete

- [ ] You're done! Close this ticket.
