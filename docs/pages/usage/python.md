# Python

Basic native support is available via the PyPI package
[`mozilla-nimbus-shared`](https://pypi.org/project/mozilla-nimbus-shared/). A function is exposed to
validate an object against a named schema.

```python
from mozilla_nimbus_shared import check_schema

# Throws an error with details of the problems
check_schema("normandy/ConsoleLogArguments", {})

# Returns True
check_schema("normandy/ConsoleLogArguments", {"message": "hello, world!"})
```

Data can be accessed as a `dict` with the function `get_data`

```python
from mozilla_nimbus_shared import get_data, check_schema

data = get_data()
print(data["Audiences"])
# {"all_english": { ... }, "us_only": { ... }, ... }

# returns True
check_schema(data["experiment-recipe-samples"]["pull-factor"], "experiments/NimbusExperiment")
```

> Note that you should not need to validate that the data in the library matches the expected
> schema. That is validated when the package is built.
