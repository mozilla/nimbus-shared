#!/usr/bin/env ts-node-script
import { promises as fs, Dirent } from "fs";
import * as path from "path";
import * as tsj from "ts-json-schema-generator";
import * as tjs from "typescript-json-schema";

async function main() {
  const config: tsj.Config = {
    tsconfig: "./tsconfig.json",
    encodeRefs: true,
  };

  await fs.mkdir("./schemas", { recursive: true });

  // Delete the contents of schemas, without deleting the directory itself
  for await (const entry of walk("./schemas", { includeDirs: "include" })) {
    if (entry.isDirectory()) {
      console.log("deleting directory", entry);
      await fs.rmdir(entry.path, { recursive: false });
    } else {
      console.log("deleting file", entry);
      await fs.unlink(entry.path);
    }
  }

  const program = tjs.programFromConfig("./tsconfig.json");

  for await (const { path: srcFilePath } of walk("./types/")) {
    // const schema = tjs.generateSchema(program, "*", {
    //   excludePrivate: true,
    //   include: [srcFilePath],
    //   topRef: true,
    //   defaultProps: true,
    // });

    // const { name: fileNameWithoutExtension } = path.parse(srcFilePath);
    // const outPath = `schemas/${fileNameWithoutExtension}.json`;
    // await fs.writeFile(outPath, JSON.stringify(schema, null, 2));

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
      console.log(`${srcFilePath}::${type} -> ${outPath}`);
      await fs.writeFile(outPath, JSON.stringify(typeSchema, null, 2));
    }
  }
}

interface WalkOptions {
  includeDirs?: "only" | "include" | "exclude";
}

interface WalkDirEntry extends Dirent {
  path: string;
}

/**
 * Iterate through a directory and all its descendants.
 *
 * Contents are iterated in a depth-first order, i.e. all contents of a
 * directory will be recursively yielded before the directory.
 *
 * The top level directory will not be yielded.
 *
 * @param dir
 *   The path of the directory to walk
 * @param opts.includeDirs
 *   Controls how directory entries are included in the output.
 */
async function* walk(
  dir: string,
  opts: WalkOptions = { includeDirs: "exclude" }
): AsyncGenerator<WalkDirEntry, void> {
  for await (const entry of await fs.opendir(dir)) {
    const rv = entry as WalkDirEntry;
    rv.path = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(rv.path, opts);
      if (opts.includeDirs != "exclude") {
        yield rv;
      }
    } else if (entry.isFile()) {
      if (opts.includeDirs != "only") {
        yield rv;
      }
    }
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Reject at:", promise, "reason:", reason);
  process.exit(1);
});

main();
