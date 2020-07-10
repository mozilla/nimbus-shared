# Python

Basic native support is available via the PyPI package
[`mozilla-nimbus-shared`](https://pypi.org/project/mozilla-nimbus-shared/). The only function
exposed is one to validate an object against a named schema.

```python
from mozilla_nimbus_shared import check_schema

# Throws an error with details of the problems
check_schema("normandy/ConsoleLogArguments", {})

# Returns True
check_schema("normandy/ConsoleLogArguments", {"message": "hello, world!"})
```
