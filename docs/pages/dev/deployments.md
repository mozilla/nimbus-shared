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

This email address is a private Google Group that several engineers from the Nimbus have access to.
The password to these accounts is not shared, and if someone who does not have the current password
needs to work with the accounts, they can use a password reset to gain access.

### How to reset account passwords

In case you need to get or reset the password for one of the accounts, use these steps:

1. Use the "reset password" option of the relevant site.
2. Reply to the mailing list thread to confirm that the password reset was legitimate, and to
   identify who did it to the rest of the team.
3. Change the password on the account. Do not share the new password with anyone.
4. Optionally, store the new password as you would any other private password.

### How to reset tokens

In case the tokens used to authenticate to the account are lost or leaked, reset them using these
steps. Consider using Firefox Containers to seperate your normal login from the shared one (for
convenience).

- NPM

  1. Log in to NPM as project-nimbus-publishing.
  2. Click on the avatar in the top right, and choose "Auth Tokens".
  3. Delete the old token with the X on the right side.
  4. Create new token with rights to both read and publish.
  5. Immediately copy that token to CircleCI as `NPM_TOKEN` (see below).
  6. Do not store the token anywhere else.

- PyPI

  1. Log in to PyPI as project-nimbus-publishing.
  2. Go to the account settings in the left-side menu.
  3. In the section labeled "API Tokens", remove the old token using the "Options" drop down.
  4. Add a new API token that has access to only the specific nimbus-shared package.
  5. Immediately copy that token to CircleCI as `PYPI_TOKEN` (see below).
  6. Do not store the token anywhere else.

- Adding Tokens to CircleCI
  1. Open [the CircleCI project][]. You can log in as any account with write access to the project.
  2. Open the project settings with the link in the top right.
  3. Open the Environment Variables section of the settings.
  4. Remove the variable old token.
  5. Add a new variable with the new token. The name should be either `NPM_TOKEN` or `PYPI_TOKEN`,
     depending on which service the token is for.

[the circleci project]: https://app.circleci.com/pipelines/github/mozilla/nimbus-shared
