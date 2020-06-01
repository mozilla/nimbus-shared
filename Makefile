# Schemas are anything we can find in the schema directory, plus the directory itself
SCHEMAS := schemas $(shell test -d schemas && find schemas -name '*.json')
TYPES := $(shell find ./types -name '*.ts')
TS_SRC := $(shell find ./src -name '*.ts')

TIMESTAMP_DIR := ./.timestamps
TSC_STAMP := $(TIMESTAMP_DIR)/tsc-last-run
NPM_INSTALL_STAMP := $(TIMESTAMP_DIR)/npm-install

export PATH := node_modules/.bin:$(PATH)

.PHONY: install build clean test lint default

# Phony commands - commands that don't make files

default: build

install: $(NPM_INSTALL_STAMP)

build: $(TSC_STAMP) $(SCHEMAS) src/typeGuardHelpers.ts

clean:
	rm -rf dist $(SCHEMAS) $(TSC_STAMP) $(NPM_INSTALL_STAMP) node_modules $(TIMESTAMP_DIR)

test: build
	./test/normandy-arguments.ts

artifact: build
	./bin/pack-artifact.sh

lint: $(NPM_INSTALL_STAMP) build
	eslint .

# Commands that make files

$(NPM_INSTALL_STAMP): package.json package-lock.json
	npm ci
	@mkdir -p $(@D)
	@touch $@

$(TSC_STAMP): src/typeGuardHelpers.ts $(TS_SRC) $(TYPES) $(NPM_INSTALL_STAMP)
	tsc
	@mkdir -p $(@D)
	@touch $@

$(SCHEMAS): $(shell find ./types -name '*.ts') $(NPM_INSTALL_STAMP) bin/build-schemas.ts
	./bin/build-schemas.ts

src/typeGuardHelpers.ts: $(NPM_INSTALL_STAMP) $(SCHEMAS) bin/generate-type-guards.ts
	./bin/generate-type-guards.ts
