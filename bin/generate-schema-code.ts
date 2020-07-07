#!/usr/bin/env ts-node-script

/** Translate the schemas into JS code so they can be easily imported. */

import ts from "typescript";
import { walk } from "../src/utils";
import path from "path";
import { promises as fs } from "fs";

async function main() {
  const typeScriptSource = await makeTypeScriptSource();
  await fs.mkdir("./src/_generated", { recursive: true });
  await fs.writeFile("./src/_generated/schemas.ts", typeScriptSource);
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Schema extends Record<string, unknown> {}

async function makeTypeScriptSource(): Promise<string> {
  // Gather schemas
  const schemaGroups: Record<string, Record<string, Schema>> = {};
  const tasks = [];

  for await (const { path: srcFilePath } of walk("./schemas/")) {
    const { name: typeName, dir } = path.parse(srcFilePath);
    const components = dir.split(path.sep);
    if (components[0] != "schemas") {
      throw new Error(`Expected path to start with schemas, got ${srcFilePath}`);
    }
    if (components.length > 2) {
      throw new Error("Can only handle a single level of nesting in schemas");
    }

    const groupName = components[1];
    if (!(groupName in schemaGroups)) {
      schemaGroups[groupName] = {};
    }
    tasks.push(
      (async () => {
        const schemaText = await fs.readFile(srcFilePath, {
          encoding: "utf-8",
        });
        const group = schemaGroups[groupName];
        if (!group) {
          throw new Error(`Schema group ${groupName} not found`);
        }
        group[typeName] = JSON.parse(schemaText);
      })(),
    );
  }

  await Promise.all(tasks);

  const resultFile = ts.createSourceFile(
    "src/typeGuardHelpers.ts",
    /* sourceText */ "",
    ts.ScriptTarget.Latest,
    /* setParentNodes */ false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return Object.entries(schemaGroups)
    .map(([groupName, schemaGroup]) => makeSchemaExport(groupName, schemaGroup))
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, resultFile))
    .join("\n\n");
}

function makeSchemaExport(groupName: string, schemaGroup: Record<string, Schema>): ts.Node {
  // A recursive object literal generator would be a pain, so this cheats. It
  // stringifies the object to JSON, then treats that string as TypeScript
  // source which it pulls the expression out of.

  const text = JSON.stringify(schemaGroup, null, 2);
  const sourceFile = ts.createSourceFile("json.json", text, ts.ScriptTarget.ES2020, false);
  if (sourceFile.statements.length !== 1) {
    throw new Error("There should only be one statement");
  }

  const expressionStatement = sourceFile.statements[0];
  if (!ts.isExpressionStatement(expressionStatement)) {
    throw new Error("Object must be an expression");
  }

  return ts.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(groupName, undefined, expressionStatement.expression)],
      ts.NodeFlags.Const,
    ),
  );
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  process.exit(1);
});

main();
