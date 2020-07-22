import json
import pkgutil
from dataclasses import dataclass
from pathlib import Path

import jsonschema


_validator_cache = {}
_data_cache = None


NimbusSchemaNotFoundError = FileNotFoundError


class NimbusValidationError(Exception):
    def __init__(self, error_iterator):
        super().__init__("Data does not match schema")
        self.errors = error_iterator


def check_schema(schema_name: str, instance: any) -> bool:
    """
    Check if `instance` matches the schema named `schema_name`.

    Returns `True` if it does. If it does not match the schema,
    `mozilla_nimbus_shared.NimbusValidationError` is thrown. It contains an
    attribute `.errors` that detail all the ways the data does not match the
    schema.

    If the schema name given does not refer to a known schema, then a
    `mozilla_nimbus_shared.NimbusSchemaNotFoundError` exception is thrown.
    """

    if schema_name not in _validator_cache:
        schema_path = "schemas/" + schema_name + ".json"
        schema_text = pkgutil.get_data("mozilla_nimbus_shared", schema_path)
        schema = json.loads(schema_text)
        _validator_cache[schema_name] = jsonschema.Draft7Validator(schema)

    validator = _validator_cache[schema_name]
    try:
        validator.validate(instance)
    except jsonschema.exceptions.ValidationError:
        raise NimbusValidationError(validator.iter_errors(instance))
    return True


def get_data() -> dict:
    """Load all the Nimbus data"""
    global _data_cache
    if not _data_cache:
        data_text = pkgutil.get_data("mozilla_nimbus_shared", "data.json")
        _data_cache = json.loads(data_text)
    return _data_cache
