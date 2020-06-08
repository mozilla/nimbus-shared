PKGNAME := $(shell cat package.json | jq -r .name)
VERSION := $(shell cat package.json | jq -r .version)

# Schemas are anything we can find in the schema directory, plus the directory itself
SCHEMAS := schemas $(shell test -d schemas && find schemas -name '*.json')
TYPES := $(shell find ./types -name '*.ts')
TS_SRC := index.ts $(shell find ./src -name '*.ts')
PACK_FILE := $(PKGNAME)-$(VERSION).tgz
GENERATED_TS := ./src/_generated/typeGuardHelpers.ts ./src/_generated/schemas.ts

TIMESTAMP_DIR := ./.timestamps
TSC_STAMP := $(TIMESTAMP_DIR)/tsc-last-run
NPM_INSTALL_STAMP := $(TIMESTAMP_DIR)/npm-install

export PATH := node_modules/.bin:$(PATH)

# Phony commands - commands that don't make files
.PHONY: install build clean test lint default clean-build pack

default: build

install: $(NPM_INSTALL_STAMP)

build: $(TSC_STAMP) $(SCHEMAS)

clean:
	rm -rf dist $(SCHEMAS) $(TSC_STAMP) $(NPM_INSTALL_STAMP) node_modules
	rm -rf $(TIMESTAMP_DIR) $(GENERATED_TS)

test: build
	./test/normandy-arguments.ts

artifact: build
	./bin/pack-artifact.sh

lint: $(NPM_INSTALL_STAMP) build
	eslint .

clean-build: clean build

pack: $(PACK_FILE)

# Commands that make files

$(NPM_INSTALL_STAMP): package.json package-lock.json
	npm ci
	@mkdir -p $(@D)
	@touch $@

$(TSC_STAMP): $(GENERATED_TS) $(TS_SRC) $(TYPES) $(NPM_INSTALL_STAMP) tsconfig.json
	tsc
	@mkdir -p $(@D)
	@touch $@

$(SCHEMAS): $(TYPES) $(NPM_INSTALL_STAMP) bin/build-schemas.ts
	./bin/build-schemas.ts

src/_generated/typeGuardHelpers.ts: $(NPM_INSTALL_STAMP) $(SCHEMAS) bin/generate-type-guards.ts
	./bin/generate-type-guards.ts

src/_generated/schemas.ts: $(NPM_INSTALL_STAMP) $(SCHEMAS) bin/generate-schema-code.ts
	./bin/generate-schema-code.ts

$(PACK_FILE): clean build package.json
	npm pack
