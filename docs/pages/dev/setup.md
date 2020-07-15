# Requirements and Setup

Node 14 is required to work on this library, though is not required for bundled outputs prepared for
other systems.

Common tasks are defined as Make targets:

```shell
make install    # Install dependencies with NPM
make lint       # Run static analysis
make lint-fix   # Run static analysis, and fix any auto-fixable problems
make build      # Build output files
make test       # Test
```

## Pre-commit Hook

Code is required to match all the lint checks, including ESLint and Prettier. You can run the
linters directly with `make lint` and `make lint-fix`. To better integrate these tools though,
github is provided via [`Therapist`](https://therapist.readthedocs.io/en/latest/overview.html).

To install Therapist use [pipx](https://pipxproject.github.io/pipx/), or your preferred Python
program manager. Then install Therapist's Git hooks into this repo. You have the option of having
Therapist automatically fix problems for you, or only showing that there are problems.

```shell
# Install Therapist globally
pipx install therapist

# Set up the Therapist Git hooks
therapist install
# OR
therapist install --fix
```

It is recommended to also set up your editor to
[run Prettier automatically](https://prettier.io/docs/en/editors.html).

## Dependencies

Node dependencies are managed with npm. Use `npm install --save` and `npm install --save-dev` to add
new dependencies.

There is a Python module located in the `python` subdirectory. Python dependencies are managed with
Poetry. Care must be taken when adding Python dependencies, since `pyproject.toml` is generated from
`pyproject.toml.template`. For best results,

1. Run `make build` to generate all files.
2. Use `poetry add` to add the dependencies to `pyproject.toml`.
3. Copy the package as added to `pyproject.toml` to `pyproject.toml.template`.
4. Run `make clean` and then `make build` to verify the addition

Note that the default branch for this repo is named `main`. If you have an existing clone of the
repository that uses another name, you can update it using
[the commands found here](https://twitter.com/xunit/status/1269881005877256192).
