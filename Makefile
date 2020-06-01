# Schemas are anything we can find in the schema directory, plus the directory itself
SCHEMAS := schemas $(shell test -d schemas && find schemas -name '*.json')
TYPES := $(shell find ./types -name '*.ts')
TS_SRC := $(shell find ./src -name '*.ts')

TIMESTAMP_DIR := ./.timestamps
TSC_STAMP := $(TIMESTAMP_DIR)/tsc-last-run
NPM_INSTALL_STAMP := $(TIMESTAMP_DIR)/npm-install

export PATH := node_modules/.bin:$(PATH)

.PHONY: install build clean test lint default

default: build

install: $(NPM_INSTALL_STAMP)

build: $(TSC_STAMP) $(SCHEMAS) src/typeGuardHelpers.ts $(NPM_INSTALL_STAMP)

$(NPM_INSTALL_STAMP): package.json package-lock.json $(TIMESTAMP_DIR)
	npm ci
	@touch $(NPM_INSTALL_STAMP)

clean:
	rm -rf dist $(SCHEMAS) $(TSC_STAMP) $(NPM_INSTALL_STAMP) node_modules

test: build
	./test/normandy-arguments.ts

artifact: build
	./bin/pack-artifact.sh

lint: $(NPM_INSTALL_STAMP) build
	eslint .

$(TSC_STAMP): src/typeGuardHelpers.ts $(TS_SRC) $(TYPES) $(NPM_INSTALL_STAMP) $(TIMESTAMP_DIR)
	tsc
	@touch $(TSC_STAMP)

$(SCHEMAS): $(shell find ./types -name '*.ts') $(NPM_INSTALL_STAMP) bin/build-schemas.ts
	./bin/build-schemas.ts

src/typeGuardHelpers.ts: $(NPM_INSTALL_STAMP) $(SCHEMAS) bin/generate-type-guards.ts
	./bin/generate-type-guards.ts

$(TIMESTAMP_DIR):
	mkdir $(TIMESTAMP_DIR)