# Requirements and Setup

Node 14 is required to work on this library, though is not required for bundled outputs prepared for
other systems.

Common tasks are defined as Make targets:

```shell
make install  # Install dependencies with NPM
make lint     # Run static analysis
make build    # Build output files
make test     # Test
```

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
