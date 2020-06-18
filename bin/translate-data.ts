#!/usr/bin/env ts-node-script

/** Translate all of the files in `./data/` into properly tagged files in `./dist/data/` */

import path from "path";
import { promises as fs } from "fs";

import toml from "@iarna/toml";

async function main() {
  const allData = await DataGroup.gatherFromDir("./data");
  await allData.writeToDir("./dist/data");
}

class DataGroup {
  typeAnnotation: string | null;
  entries: Array<DataEntry>;
  children: Record<string, DataGroup>;

  constructor() {
    this.typeAnnotation = null;
    this.entries = [];
    this.children = {};
  }

  static async gatherFromDir(sourcePath: string): Promise<DataGroup> {
    const gathered = new DataGroup();

    for (const entry of await fs.readdir(sourcePath, { encoding: "utf-8", withFileTypes: true })) {
      const fullPath = path.join(sourcePath, entry.name);
      const { base: nameWithExtension } = path.parse(fullPath);

      if (entry.isDirectory()) {
        gathered.children[nameWithExtension] = await DataGroup.gatherFromDir(fullPath);
      } else if (entry.isFile()) {
        if (nameWithExtension == "_type") {
          gathered.typeAnnotation = (await fs.readFile(fullPath, { encoding: "utf-8" })).trim();
          continue;
        }

        gathered.entries.push(await DataEntry.fromFile(fullPath));
      }
    }

    return gathered;
  }

  async writeToDir(destPath: string): Promise<void> {
    await fs.mkdir(destPath, { recursive: true });

    for (const entry of this.entries) {
      await entry.writeIntoDir(destPath);
    }

    for (const [name, group] of Object.entries(this.children)) {
      const subdir = path.join(destPath, name);
      await group.writeToDir(subdir);
    }
  }
}

class DataEntry {
  name: string;
  contents: unknown;

  constructor(name: string, contents: unknown) {
    this.name = name;
    this.contents = contents;
  }

  static async fromFile(fullPath: string): Promise<DataEntry> {
    const { name: nameWithoutExtension, ext } = path.parse(fullPath);

    const fileContents = await fs.readFile(fullPath, { encoding: "utf-8" });

    let parsedContents: unknown;
    switch (ext) {
      case ".json": {
        try {
          parsedContents = JSON.parse(fileContents);
        } catch (err) {
          console.error(`Error: Could not read JSON from ${fullPath}:`);
          throw err;
        }
        break;
      }

      case ".toml": {
        try {
          parsedContents = toml.parse(fileContents);
        } catch (err) {
          console.error(`Error: Could not read TOML from ${fullPath}:`);
          throw err;
        }
        break;
      }

      default: {
        throw new Error(`Don't yet know how to process ${JSON.stringify(ext)} files`);
      }
    }

    return new DataEntry(nameWithoutExtension, parsedContents);
  }

  async writeIntoDir(dirPath: string): Promise<void> {
    const dest = path.join(dirPath, this.name + ".json");
    await fs.writeFile(dest, JSON.stringify(this.contents));
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  process.exit(1);
});

main();
