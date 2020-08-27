NPM_PKGNAME := $(shell cat package.json | jq -r .name)
PYTHON_PKGNAME := mozilla_nimbus_shared
VERSION := $(shell cat package.json | jq -r .version)
PY_VERSION := $(shell cat package.json | jq -r .version | sed -e 's/-dev/.dev0/')

MOCHA := ./node_modules/.bin/mocha
ESLINT := ./node_modules/.bin/eslint
TSC := ./node_modules/.bin/tsc
TS_NODE := ./node_modules/.bin/ts-node-script
PRETTIER := ./node_modules/.bin/prettier
PYTEST := poetry run pytest

TYPES := $(shell find ./types -name '*.ts')
DATA_SOURCES := $(shell find ./data)
TS_SRC := index.ts $(shell find ./src -name '*.ts')
PY_SRC := $(shell find ./python/mozilla_nimbus_shared -name '*.py')
NPM_PACK_FILE := $(shell echo $(NPM_PKGNAME) | sed -e 's/@//' -e 's_/_-_')-$(VERSION).tgz

PYTHON_SDIST := python/dist/$(PYTHON_PKGNAME)-$(PY_VERSION).tar.gz
PYTHON_WHEEL := python/dist/$(PYTHON_PKGNAME)-$(PY_VERSION)-py3-none-any.whl
PYTHON_PACK_FILE := $(PYTHON_SDIST) $(PYTHON_WHEEL)

GENERATED_TS := ./src/_generated/typeGuardHelpers.ts ./src/_generated/schemas.ts ./src/_generated/data.ts
GENERATED_PYTHON := ./python/pyproject.toml
GENERATED_DATA := ./dist/data.json
GENERATED := $(GENERATED_TS) $(GENERATED_PYTHON) $(GENERATED_DATA)
JS_TEST_FILES := $(shell find ./test -name 'test-*')
PY_TEST_FILES = python/mozilla_nimbus_shared/test.py

TIMESTAMP_DIR := ./.timestamps
TSC_STAMP := $(TIMESTAMP_DIR)/tsc-last-run
NPM_INSTALL_STAMP := $(TIMESTAMP_DIR)/npm-install
SCHEMA_STAMP := $(TIMESTAMP_DIR)/schemas
PYTHON_INSTALL_STAMP := $(TIMESTAMP_DIR)/poetry-install
DATA_STAMP := $(TIMESTAMP_DIR)/data
DOCS_NPM_INSTALL_STAMP := $(TIMESTAMP_DIR)/docs-npm-install
DOCS_BUILT_STAMP := $(TIMESTAMP_DIR)/docs-built

DOC_SOURCES := $(shell find docs/pages -type f) $(shell find docs/public -type f) docs/global_style.scss

# Phony targets - commands that don't make files
.PHONY: default install build clean test artifact lint pack docs

default: build

install: $(NPM_INSTALL_STAMP) $(PYTHON_INSTALL_STAMP) $(DOCS_NPM_INSTALL_STAMP)

build: $(TSC_STAMP) $(SCHEMA_STAMP) $(GENERATED_CODE) $(GENERATED_DATA)

clean:
	rm -rf dist schemas $(TSC_STAMP) $(NPM_INSTALL_STAMP) node_modules $(TIMESTAMP_DIR) $(GENERATED) \
		artifacts python/dist python/mozilla_nimbus_shared.egg-info python/poetry.lock src/_generated \
		docs/out docs/node_modules docs/.next $(shell cd python; poetry env info -p) python/README.md

test: build $(NPM_INSTALL_STAMP) $(PYTHON_INSTALL_STAMP) $(JS_TEST_FILES) $(PY_TEST_FILES)
	$(MOCHA) -r ts-node/register $(JS_TEST_FILES)
	cd python; $(PYTEST) mozilla_nimbus_shared/test.py

artifact: build pack docs
	./bin/pack-artifact.sh
	mkdir -p artifacts/python
	cp $(PYTHON_SDIST) $(PYTHON_WHEEL) artifacts/python/
	mkdir -p artifacts/npm
	cp mozilla-nimbus-shared-$(VERSION).tgz artifacts/npm/
	cp -r docs/out artifacts/docs

lint: $(NPM_INSTALL_STAMP) $(PYTHON_INSTALL_STAMP) build
	$(ESLINT) .
	$(TSC) --noEmit --project tsconfig.json
	$(PRETTIER) --check .
	cd python; poetry run black --check .

lint-fix:
	$(ESLINT) --fix .
	$(TSC) --noEmit --project tsconfig.json
	$(PRETTIER) --write .
	cd python; poetry run black .

pack: $(NPM_PACK_FILE) $(PYTHON_PACK_FILE)

docs: $(DOCS_BUILT_STAMP)

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
	$(TSC)
	@mkdir -p $(@D)
	@touch $@

$(SCHEMA_STAMP): $(TYPES) $(NPM_INSTALL_STAMP) bin/build-schemas.ts
	$(TS_NODE) ./bin/build-schemas.ts
	@mkdir -p $(@D)
	@touch $@

$(GENERATED_DATA): $(DATA_SOURCES) $(NPM_INSTALL_STAMP) ./src/_generated/schemas.ts ./src/_generated/typeGuardHelpers.ts bin/translate-data.ts
	$(TS_NODE) ./bin/translate-data.ts
	@touch $@

src/_generated/typeGuardHelpers.ts: $(NPM_INSTALL_STAMP) $(SCHEMA_STAMP) bin/generate-type-guards.ts
	$(TS_NODE) ./bin/generate-type-guards.ts

src/_generated/schemas.ts: $(NPM_INSTALL_STAMP) $(SCHEMA_STAMP) bin/generate-schema-code.ts
	$(TS_NODE) ./bin/generate-schema-code.ts

src/_generated/data.ts: $(NPM_INSTALL_STAMP) $(GENERATED_DATA) bin/generate-data-code.ts
	$(TS_NODE) ./bin/generate-data-code.ts

$(NPM_PACK_FILE): package.json $(TSC_STAMP) $(SCHEMA_STAMP) $(GENERATED_DATA) $(GENERATED_TS)
	npm pack

python/pyproject.toml: python/pyproject.toml.template bin/generate-pyproject-toml.ts $(NPM_INSTALL_STAMP) python/README.md
	$(TS_NODE) ./bin/generate-pyproject-toml.ts

$(PYTHON_SDIST): python/pyproject.toml $(PY_SRC) $(SCHEMA_STAMP) $(GENERATED_DATA) $(GENERATED_PYTHON) $(PYTHON_INSTALL_STAMP)
	cd python; poetry build --format sdist

$(PYTHON_WHEEL): $(PYTHON_SDIST)
	cd python; poetry build --format wheel

$(DOCS_NPM_INSTALL_STAMP): docs/package.json docs/package-lock.json
	cd docs; npm ci
	@mkdir -p $(@D)
	@touch $@

$(DOCS_BUILT_STAMP): $(DOCS_NPM_INSTALL_STAMP) docs/next.config.js $(DOC_SOURCES) $(TSC_STAMP)
	cd docs; npm run build
	@mkdir -p $(@D)
	@touch $@

python/README.md: README.md
	cp README.md $@