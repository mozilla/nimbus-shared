import pytest
import jsonschema

import mozilla_nimbus_shared


def test_data_is_available():
    data = mozilla_nimbus_shared.get_data()
    assert data
    assert isinstance(data, dict)


def test_schema_check_passes():
    data = {"message": "test"}
    assert mozilla_nimbus_shared.check_schema("normandy/ConsoleLogArguments", data)


def test_schema_check_fails():
    data = {}
    with pytest.raises(jsonschema.exceptions.ValidationError):
        mozilla_nimbus_shared.check_schema("normandy/ConsoleLogArguments", data)
