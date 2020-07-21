import json
import pkgutil
from dataclasses import dataclass
from pathlib import Path

import jsonschema


_schema_cache = {}
_data_cache = None


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


def get_data() -> dict:
    """Load all the Nimbus data"""
    global _data_cache
    if not _data_cache:
        data_text = pkgutil.get_data("mozilla_nimbus_shared", "data.json")
        _data_cache = json.loads(data_text)
    return _data_cache
