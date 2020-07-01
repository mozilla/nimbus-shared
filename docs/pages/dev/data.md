# Adding data

To add data to this repository, create a file in the `./data` directory. The path of the file will
be used to place the new item in the combined data exported to packages. For example, the file
`./data/experiment-recipe-samples/pull-factor.json` would be available in TypeScript as
`nimbusShared.data["experiment-recipe-samples"]["pull-factor"]`.

Files can be TOML, JSON, or TypeScript. For TOML and JSON, the file is used as-is, for TypeScript
the default export of the file is used. Regardless of the input format, the exported data will be in
JSON and native formats for the exported package.

TOML and JSON files are checked against a schema that can be declared in one of two ways. The first
option is to add a key `__nimbusMeta.type` to the data object, which must be the path to one of the
schemas (ie `experiments/ExperimentRecipe`). This metadata will not be included in the exported
version of the data. Alternatively a file `__nimbusMeta.toml` can be added next to the file that
contains a TOML object with a key `type` with the same kind of schema path.

Additionally, objects defined in TOML or JSON may have an automatically derived slug. If the
metadata of the object (as described above) includes a key `useFilenameForSlug`, then the name of
the file without the extension will be filled in as a top level key `slug`. This must be accepted by
the type of the object.
