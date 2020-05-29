import path from "path";
import { promises as fs, Dirent } from "fs";

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
export async function* walk(
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
