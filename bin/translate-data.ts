#!/usr/bin/env ts-node-script

/** Translate all of the files in `./data/` into a single file, `dist/data.json` */

import path from "path";
import { promises as fs } from "fs";
import { strict as assert } from "assert";

import toml from "@iarna/toml";

import { assertSchema } from "../src/typeGuards";

const config = {
  verbose: false,
};

async function main() {
  config.verbose = "-v" in process.argv;
  fs.mkdir("./dist", { recursive: true });
  const allData = await DataGroup.gatherFromDir("./data");
  fs.writeFile("./dist/data.json", JSON.stringify(allData.toOutputObject(), null, 2));
}

/** An object that can be loaded from the data dir and serialized into the output. */
interface DataLink {
  toOutputObject(): Record<string, unknown>;
}

/** A group of data links, possibly with nested subgroups */
class DataGroup implements DataLink {
  entries: Record<string, DataLink> = {};

  private sourcePath?: string;
  private metadata: NimbusMetadata | null = null;

  /** Gather data entries from all files in a directory, recursively */
  static async gatherFromDir(sourcePath: string): Promise<DataGroup> {
    const gathered = new DataGroup();
    gathered.sourcePath = sourcePath;
    const meta = await gathered.getMetadata();

    for (const entry of await fs.readdir(sourcePath, { encoding: "utf-8", withFileTypes: true })) {
      if (entry.name == "__nimbusMeta.toml") {
        continue;
      }

      const fullPath = path.join(sourcePath, entry.name);

      if (entry.isDirectory()) {
        gathered.entries[entry.name] = await DataGroup.gatherFromDir(fullPath);
      } else if (entry.isFile()) {
        const { name: nameWithoutExtension } = path.parse(fullPath);
        gathered.entries[nameWithoutExtension] = await DataFile.fromFile(fullPath, meta);
      }
    }

    return gathered;
  }

  /** Convert this group into a format suitable for output */
  toOutputObject(): Record<string, unknown> {
    const output: Record<string, unknown> = {};

    for (const [name, entry] of Object.entries(this.entries)) {
      assert(!(name in output));
      output[name] = entry.toOutputObject();
    }

    return output;
  }

  /**
   * Get the metadata of this group by reading a __nimbusMeta.toml file if one
   * exists. Otherwise returns an empty metadata object.
   */
  async getMetadata(): Promise<NimbusMetadata> {
    if (this.metadata) {
      return this.metadata;
    }
    if (this.sourcePath) {
      try {
        const filePath = path.join(this.sourcePath, "__nimbusMeta.toml");
        const fileContents = (await fs.readFile(filePath, { encoding: "utf-8" })).trim();
        try {
          this.metadata = toml.parse(fileContents);
        } catch (err) {
          console.warn(
            `Warning: __nimbusMeta.toml file found, but could not be parsed at ${this.sourcePath}: ${err}`,
          );
        }
      } catch (err) {
        this.metadata = {};
      }
    }
    assertNimbusMetadata(this.metadata);
    return this.metadata;
  }
}

/** The metadata that can be loaded for a file or directory */
interface NimbusMetadata {
  type?: string;
  useFilenameForSlug?: boolean;
}

/** Validate that an object implements `NimbusMetadata`. If not, throw an error. */
function assertNimbusMetadata(obj: unknown): asserts obj is NimbusMetadata {
  assert(obj instanceof Object);
  const expectedKeys: { [key: string]: (v: unknown) => void } = {
    type: (v) => assert(typeof v == "string"),
    useFilenameForSlug: (v) => assert(typeof v == "boolean"),
  };
  for (const [key, value] of Object.entries(obj)) {
    const validator = expectedKeys[key];
    if (!validator) {
      throw new Error(`Unexpected metadata key ${key}`);
    }
    validator(value);
  }
}

/** The type of data that can be loaded from a file  */
interface NimbusDataContents {
  [key: string]: unknown;
  __nimbusMeta?: NimbusMetadata;
}

/** An individual data item that can be loaded from a file and serialized for output. */
class DataFile implements DataLink {
  name: string;
  contents: NimbusDataContents;

  constructor(name: string, contents: NimbusDataContents) {
    this.name = name;
    this.contents = contents;
  }

  /**
   * Load a DataFile from an object. Validates that the data loaded matches the expected type.
   *
   * The file can be any recognized type. That currently is JSON files, TOML
   * files, and Typescript files. If the file type is unrecognized, an error
   * will be thrown.
   *
   * The expected type is determined by the first item to match from this list:
   *   - If the file is a Typescript file, the Typescript compiler validates the
   *     types.
   *   - If the file contains a __nimbusMeta key at the top level and
   *     __nimbusMeta.type exists, it will be used.
   *   - Otherwise the type passed as `groupType` will be used.
   *
   * If the object does not match the expected type, or none of these sources
   * specify a type, an error is thrown.
   **/
  static async fromFile(fullPath: string, groupMeta: NimbusMetadata): Promise<DataFile> {
    const { name: nameWithoutExtension, ext } = path.parse(fullPath);

    let parsedContents: NimbusDataContents;
    let suppressTypeCheck = false;

    switch (ext) {
      case ".json": {
        try {
          const fileContents = await fs.readFile(fullPath, { encoding: "utf-8" });
          parsedContents = JSON.parse(fileContents);
        } catch (err) {
          console.error(`Error: Could not read JSON from ${fullPath}:`);
          throw err;
        }
        break;
      }

      case ".toml": {
        try {
          const fileContents = await fs.readFile(fullPath, { encoding: "utf-8" });
          parsedContents = toml.parse(fileContents);
        } catch (err) {
          console.error(`Error: Could not read TOML from ${fullPath}:`);
          throw err;
        }
        break;
      }

      case ".ts": {
        /*
         * The parent directory `..` is used because imports are relative to
         * the path of this file, unlike file IO.
         */
        parsedContents = (await import(`../${fullPath}`)).default;

        /*
         * Importing this will automatically type check the file, so we know
         * that the value will already match the schema defined.
         */
        suppressTypeCheck = true;
        break;
      }

      default: {
        throw new Error(`Don't yet know how to process ${JSON.stringify(ext)} files`);
      }
    }

    let debugMessage = `Loaded ${nameWithoutExtension} from ${fullPath}`;

    if (!suppressTypeCheck) {
      const meta: NimbusMetadata = { ...groupMeta, ...parsedContents.__nimbusMeta };

      assertNimbusMetadata(meta);
      if (meta.useFilenameForSlug) {
        parsedContents.slug = nameWithoutExtension;
      }

      const expectedType = meta.type;
      assert(expectedType);
      const { __nimbusMeta: _omit, ...cleanedData } = parsedContents;
      try {
        assertSchema(expectedType, cleanedData);
      } catch (err) {
        console.error(`Data from ${fullPath} did not match expected schema ${expectedType}`);
        throw err;
      }
      debugMessage += ` and validated it as ${expectedType}`;
    }

    if (config.verbose) {
      console.log(debugMessage);
    }

    return new DataFile(nameWithoutExtension, parsedContents);
  }

  /**
   * Convert this data item to a format suitable for output.comment
   *
   * Any keys that start with __nimbus are removed from the output.
   */
  toOutputObject(): Record<string, unknown> {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.contents)) {
      if (!key.startsWith("__nimbus")) {
        output[key] = value;
      }
    }
    return output;
  }
}

process.on("unhandledRejection", (reason: Error, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  console.error(reason.stack);
  process.exit(1);
});

main();
