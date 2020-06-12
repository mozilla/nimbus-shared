import json
import pkgutil
from dataclasses import dataclass
from pathlib import Path

import jsonschema

_schema_cache = {}


def check_schema(schema_name: str, instance: any) -> bool:
    """
    Check if `instance` matches the schema named `schema_name`.

    Returns `True` if it does, or throws an error explaning the ways the
    schema is not adhered to.
    """

    if schema_name not in _schema_cache:
        schema_path = "schemas/" + schema_name + ".json"
        schema_text = pkgutil.get_data("mozilla_nimbus_shared", schema_path)
        _schema_cache[schema_name] = json.loads(schema_text)

    schema = _schema_cache[schema_name]
    # Will throw if there is a problem
    jsonschema.validate(instance, schema)
    return True
