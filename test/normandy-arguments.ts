#!/usr/bin/env ts-node-script
import { promises as fs } from "fs";

import fetch from "node-fetch";
import Ajv from "ajv";

const NORMANDY_API_BASE = "https://normandy.cdn.mozilla.net/api";

async function main() {
  const ajv = new Ajv();

  for await (const recipe of fetchEnabledRecipes()) {
    const revision = recipe.approved_revision ?? recipe.latest_revision;
    const typeName = convertActionNameToTypeName(revision.action.name);
    const schema = await fs.readFile(`./schemas/normandy/${typeName}.json`);

    if (!ajv.validate(schema, revision.arguments)) {
      throw new Error(
        `Recipe ${recipe.id} does not have valid arguments: ${ajv.errors}`
      );
    } else {
      console.log(`Recipe ${recipe.id} arguments are valid ${typeName}`);
    }
  }
}

async function* fetchEnabledRecipes() {
  let url = `${NORMANDY_API_BASE}/v3/recipe/?enabled=1`;

  while (url) {
    const response = await fetch(url);
    if (response.status != 200) {
      const body = await response.text();
      throw new Error(`Error while fetching recipes: ${body}`);
    }
    const { results, next } = await response.json();
    url = next;
    yield* results;
  }
}

function convertActionNameToTypeName(actionName: string): string {
  // convert from kebob-case to lowerSnakeCase
  let typeName = actionName.replace(/-(.)/g, (_, next) => next.toUpperCase());
  // And then to UpperSnakeCase
  typeName = typeName[0].toUpperCase() + typeName.slice(1);
  // Finally mention it is just the arguments
  return typeName + "Arguments";
}

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled promise rejection:", reason);
  process.exit(1);
});

main();
