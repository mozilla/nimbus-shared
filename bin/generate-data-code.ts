#!/usr/bin/env ts-node-script

/** Translate the schemas into JS code so they can be easily imported. */

import ts from "typescript";
import { promises as fs } from "fs";

async function main() {
  const typeScriptSource = await makeTypeScriptSource();
  await fs.mkdir("./src/_generated", { recursive: true });
  await fs.writeFile("./src/_generated/data.ts", typeScriptSource);
}

async function makeTypeScriptSource(): Promise<string> {
  const dataText = await fs.readFile("./dist/data.json", { encoding: "utf8" });
  const data = JSON.parse(dataText);

  const resultFile = ts.createSourceFile(
    "src/_generated/data.ts",
    /* sourceText */ "",
    ts.ScriptTarget.Latest,
    /* setParentNodes */ false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const node = objectToVariableDeclaration("data", data);
  return printer.printNode(ts.EmitHint.Unspecified, node, resultFile);
}

function objectToVariableDeclaration(name: string, object: Record<string, unknown>): ts.Node {
  // A recursive object literal generator would be a pain, so this cheats. It
  // stringifies the object to JSON, then treats that string as Typescript
  // source which it pulls the expression out of.

  const text = JSON.stringify(object, null, 2);
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
      [ts.createVariableDeclaration(name, undefined, expressionStatement.expression)],
      ts.NodeFlags.Const,
    ),
  );
}

process.on("unhandledRejection", (reason: Error, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  console.error(reason.stack);
  process.exit(1);
});

main();
