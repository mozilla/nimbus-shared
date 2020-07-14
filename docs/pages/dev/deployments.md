# Deployment

Deploys of the NPM and PyPI packages are handled automatically. CircleCI is configured to
automatically deploy packages from tagged commits that start with `v`. The packages will be built
automatically and pushed to the relevant package indexes.

## Release Issues

That's not all that there is to making a release though. The tag needs made, the changelog updated,
and other manual tasks need done. To ensure consistency we use release issues on GitHub to plan,
assign, and execute on new releases. You can see examples of existing release issues
[here][release issues].

The last step in each release bug is to create a new issue based on the current [release
template][]. Any changes that need to be made to the deploy process should happen as pull requests
that update that template.

[release issues]:
  https://github.com/mozilla/nimbus-shared/issues?q=is%3Aissue+label%3Areleases+sort%3Acreated-desc
[release template]:
  https://github.com/mozilla/nimbus-shared/issues/new?assignees=&labels=&template=release-checklist.md&title=Release+VERSION

## Credentials

The credentials that are used for deployments are linked to an account named
`project-nimbus-publishing` on both NPM and PyPI, and those accounts are tied to the email address
project-nimbus-publishing@mozilla.com. Each of the PyPI and NPM accounts have an API key that is
given to CircleCI for deployments.

This address is a private Google Group that several engineers from the Nimbus have access to. The
password to these accounts is not shared, and if someone who does not have the current password
needs to work with the accounts, they can use a password reset to gain access.
