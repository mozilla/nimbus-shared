#!/usr/bin/env ts-node-script

import fetch from "node-fetch";

import { typeGuards } from "..";

const NORMANDY_API_BASE = "https://normandy.cdn.mozilla.net/api";

describe("normandy schemas", () => {
  it("all enabled Normandy recipes should match their schemas", async () => {
    for await (const recipe of fetchEnabledRecipes()) {
      const revision = recipe.approved_revision ?? recipe.latest_revision;
      const typeName = convertActionNameToTypeName(revision.action.name);

      // eslint-disable-next-line @typescript-eslint/ban-types
      type asserterType = ((value: object) => void) | undefined;
      const asserter = (typeGuards as Record<string, asserterType>)[`normandy_assert${typeName}`];
      if (!asserter) {
        throw new Error(`Asserter not found for action ${revision.action.name}`);
      }
      asserter(revision.arguments);
    }
  });
});

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

process.on("unhandledRejection", (reason) => {
  console.log("Unhandled promise rejection:", reason);
  process.exit(1);
});
