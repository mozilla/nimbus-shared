# Schemas are anything we can find in the schema directory, plus the directory itself
SCHEMAS := schemas $(shell test -d schemas && find schemas -name '*.json')
TYPES := $(shell find ./types -name '*.ts')
TS_SRC := $(shell find ./src -name '*.ts')
TSC_STAMP := ./.tsc-last-run
YARN_STAMP := ./.yarn-last-run

export PATH := node_modules/.bin:$(PATH)

.PHONY: install  build clean test lint

install: $(YARN_STAMP)

build: $(TSC_STAMP) $(SCHEMAS) src/typeGuardHelpers.ts $(YARN_STAMP)

$(YARN_STAMP): package.json yarn.lock
	yarn install
	@touch $(YARN_STAMP)

clean:
	rm -rf dist schemas $(TSC_STAMP) node_modules

test: build
	./test/normandy-arguments.ts

artifact: build
	./bin/pack-artifact.sh

lint: $(YARN_STAMP)
	eslint --ignore dist .

$(TSC_STAMP): src/typeGuardHelpers.ts $(TS_SRC) $(TYPES) $(YARN_STAMP)
	tsc
	@touch $(TSC_STAMP)

$(SCHEMAS): $(shell find ./types -name '*.ts') $(YARN_STAMP)
	./bin/build-schemas.ts

src/typeGuardHelpers.ts: $(SCHEMAS) bin/generate-type-guards.ts
	./bin/generate-type-guards.ts