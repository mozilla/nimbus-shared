#!/usr/bin/env ts-node-script

/**
 * For every file in the `../types` directory, create a corresponding JSON Schema
 * in the `../schemas` directory.
 */

import { promises as fs } from "fs";
import * as path from "path";
import * as tsj from "ts-json-schema-generator";

import { walk } from "../src/utils";

async function main() {
  const config: tsj.Config = {
    tsconfig: "./tsconfig.json",
    encodeRefs: true,
  };

  await fs.mkdir("./schemas", { recursive: true });

  // Delete the contents of schemas, without deleting the directory itself
  for await (const entry of walk("./schemas", { includeDirs: "include" })) {
    if (entry.isDirectory()) {
      await fs.rmdir(entry.path, { recursive: false });
    } else {
      await fs.unlink(entry.path);
    }
  }

  // Make a JSON schema file for every type
  for await (const { path: srcFilePath } of walk("./types/")) {
    // process only .ts files and not .d.ts files.
    if (!srcFilePath.endsWith(".ts") || srcFilePath.endsWith(".d.ts")) {
      continue;
    }
    const generator = tsj.createGenerator({ ...config, path: srcFilePath });
    const schema = generator.createSchema();
    const { name: fileNameWithoutExtension } = path.parse(srcFilePath);
    if (!schema.definitions) {
      continue;
    }

    for (const type of Object.keys(schema.definitions)) {
      const typeSchema = generator.createSchema(type);
      const dirPath = `./schemas/${fileNameWithoutExtension}`;
      await fs.mkdir(dirPath, { recursive: true });
      const outPath = `${dirPath}/${type}.json`;
      await fs.writeFile(outPath, JSON.stringify(typeSchema, null, 2));
    }
  }
}

process.on("unhandledRejection", (reason: Error, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  console.error(reason.stack);
  process.exit(1);
});

main();
