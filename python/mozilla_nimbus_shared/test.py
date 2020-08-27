import pytest

import mozilla_nimbus_shared


class TestCheckSchema:
    def test_schema_check_passes(self):
        data = {"message": "test"}
        assert mozilla_nimbus_shared.check_schema("normandy/ConsoleLogArguments", data)

    def test_schema_check_fails(self):
        data = {}
        with pytest.raises(mozilla_nimbus_shared.NimbusValidationError) as excinfo:
            mozilla_nimbus_shared.check_schema("normandy/ConsoleLogArguments", data)

        assert "Data does not match schema" in str(excinfo.value)
        errors = list(excinfo.value.errors)
        assert len(errors) == 1
        assert "'message' is a required property" in str(errors[0])

    def test_missing_schema_throws_the_right_error(self):
        with pytest.raises(mozilla_nimbus_shared.NimbusSchemaNotFoundError):
            mozilla_nimbus_shared.check_schema("Bogus/Schema", {})


def test_data_is_available():
    data = mozilla_nimbus_shared.get_data()
    assert data
    assert isinstance(data, dict)
