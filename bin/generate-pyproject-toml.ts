#!/usr/bin/env ts-node-script
import { promises as fs } from "fs";

const DEST_PATH = "python/pyproject.toml";
const TEMPLATE_PATH = DEST_PATH + ".template";

async function main() {
  const packageJson = JSON.parse(await fs.readFile("./package.json", { encoding: "utf-8" }));
  const templateContents = await fs.readFile(TEMPLATE_PATH, { encoding: "utf-8" });

  // Replace all `{{ variable }}' expressions with values from package.json
  const processed = templateContents.replace(/\{\{[^}]+\}\}/g, (substring) => {
    const keyString = substring.replace(/[{}]/g, "").trim();
    const keyPath = keyString.split(".");

    let target = packageJson;
    for (const keyPart of keyPath) {
      const trimmed = keyPart.trim();
      if (trimmed == "" || trimmed != keyPart) {
        throw new Error(
          `Key paths must not contain whitespace or have duplicated dots.` +
            `Got ${JSON.stringify(keyString)} which has invalid part ${JSON.stringify(keyPart)}`,
        );
      }
      target = target[keyPart];
    }

    return target.toString();
  });

  await fs.writeFile(DEST_PATH, processed);
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  process.exit(1);
});

main();
