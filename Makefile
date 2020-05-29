# Schemas are anything we can find in the schema directory, plus the directory itself
TYPES ::= $(shell find ./types -name '*.ts')
TS_SRC ::= $(shell find ./src -name '*.ts')
TSC_STAMP := ./.tsc-last-run

export PATH := node_modules/.bin:$(PATH)

.PHONY: build clean test lint

build: $(TSC_STAMP) $(SCHEMAS) src/typeGuardHelpers.ts

clean:
	rm -rf dist schemas

test: build
	./test/normandy-arguments.ts

artifact: build
	./bin/pack-artifact.sh

lint:
	eslint --ignore dist .

$(TSC_STAMP): src/typeGuardHelpers.ts $(TS_SRC) $(TYPES)
	tsc
	@touch .tsc-last-run

$(SCHEMAS): $(shell find ./types -name '*.ts')
	./bin/build-schemas.ts

src/typeGuardHelpers.ts: $(SCHEMAS) bin/generate-type-guards.ts
	./bin/generate-type-guards.ts