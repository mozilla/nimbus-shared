NPM_PKGNAME := $(shell cat package.json | jq -r .name)
PYTHON_PKGNAME := mozilla_nimbus_shared
VERSION := $(shell cat package.json | jq -r .version)
PY_VERSION := $(shell cat package.json | jq -r .version | sed -e 's/-dev/.dev0/')

MOCHA := ./node_modules/.bin/mocha
ESLINT := ./node_modules/.bin/eslint
TSC := ./node_modules/.bin/tsc
TS_NODE := ./node_modules/.bin/ts-node-script

# Schemas are anything we can find in the schema directory, plus the directory itself
TYPES := $(shell find ./types -name '*.ts')
TS_SRC := index.ts $(shell find ./src -name '*.ts')
PY_SRC := $(shell find ./python/mozilla_nimbus_shared -name '*.py')
NPM_PACK_FILE := $(shell echo $(NPM_PKGNAME) | sed -e 's/@//' -e 's_/_-_')-$(VERSION).tgz

PYTHON_SDIST := python/dist/$(PYTHON_PKGNAME)-$(PY_VERSION).tar.gz
PYTHON_WHEEL := python/dist/$(PYTHON_PKGNAME)-$(PY_VERSION)-py3-none-any.whl
PYTHON_PACK_FILE := $(PYTHON_SDIST) $(PYTHON_WHEEL)

GENERATED_TS := ./src/_generated/typeGuardHelpers.ts ./src/_generated/schemas.ts
GENERATED_PYTHON := ./python/pyproject.toml
GENERATED := $(GENERATED_TS) $(GENERATED_PYTHON)
TEST_FILES := $(shell find ./test -name 'test-*')

TIMESTAMP_DIR := ./.timestamps
TSC_STAMP := $(TIMESTAMP_DIR)/tsc-last-run
NPM_INSTALL_STAMP := $(TIMESTAMP_DIR)/npm-install
PYTHON_INSTALL_STAMP := $(TIMESTAMP_DIR)/poetry-install
SCHEMA_STAMP := $(TIMESTAMP_DIR)/schemas

# Phony targets - commands that don't make files
.PHONY: install build clean test lint default pack

default: build

install: $(NPM_INSTALL_STAMP) $(PYTHON_INSTALL_STAMP)

build: $(TSC_STAMP) $(SCHEMA_STAMP) $(GENERATED)

clean:
	rm -rf dist schemas $(TSC_STAMP) $(NPM_INSTALL_STAMP) node_modules $(TIMESTAMP_DIR) $(GENERATED)

test: build $(NPM_INSTALL_STAMP) $(TEST_FILES)
	$(MOCHA) -r ts-node/register $(TEST_FILES)

artifact: build pack
	./bin/pack-artifact.sh
	mkdir -p artifacts/python
	mv $(PYTHON_SDIST) $(PYTHON_WHEEL) artifacts/python/
	mkdir -p artifacts/npm
	mv mozilla-nimbus-shared-$(VERSION).tgz artifacts/npm/

lint: $(NPM_INSTALL_STAMP) build
	$(ESLINT) .

pack: $(NPM_PACK_FILE) $(PYTHON_PACK_FILE)

# Commands that make files. None of these should depend on phony targets

$(NPM_INSTALL_STAMP): package.json package-lock.json
	npm ci
	@mkdir -p $(@D)
	@touch $@

$(PYTHON_INSTALL_STAMP): python/pyproject.toml
	cd python; poetry install
	@mkdir -p $(TIMESTAMP_DIR)
	@touch $(PYTHON_INSTALL_STAMP)

$(TSC_STAMP): $(GENERATED_TS) $(TS_SRC) $(TYPES) $(NPM_INSTALL_STAMP) tsconfig.json
	@mkdir -p $(@D)
	$(TSC)
	@touch $@

$(SCHEMA_STAMP): $(TYPES) $(NPM_INSTALL_STAMP) bin/build-schemas.ts
	$(TS_NODE) ./bin/build-schemas.ts
	@touch $@

src/_generated/typeGuardHelpers.ts: $(NPM_INSTALL_STAMP) $(SCHEMA_STAMP) bin/generate-type-guards.ts
	$(TS_NODE) ./bin/generate-type-guards.ts

src/_generated/schemas.ts: $(NPM_INSTALL_STAMP) $(SCHEMA_STAMP) bin/generate-schema-code.ts
	$(TS_NODE) ./bin/generate-schema-code.ts

$(NPM_PACK_FILE): package.json $(TSC_STAMP) $(SCHEMA_STAMP) $(GENERATED)
	npm pack

python/pyproject.toml: python/pyproject.toml.template bin/generate-pyproject-toml.ts $(NPM_INSTALL_STAMP)
	$(TS_NODE) ./bin/generate-pyproject-toml.ts

$(PYTHON_SDIST): python/pyproject.toml $(PY_SRC) $(SCHEMA_STAMP) $(PYTHON_INSTALL_STAMP)
	cd python; poetry build --format sdist

$(PYTHON_WHEEL): python/pyproject.toml $(PY_SRC) $(SCHEMA_STAMP) $(PYTHON_INSTALL_STAMP)
	cd python; poetry build --format wheel