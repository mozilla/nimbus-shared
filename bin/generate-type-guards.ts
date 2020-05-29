#!/usr/bin/env ts-node-script
import ts from "typescript";
import { walk } from "../src/utils";
import path from "path";
import { promises as fs } from "fs";

/** Build a type guard function for the type specified */
function makeTypeGuard(path: Array<string>, typeName: string): ts.Node {
  const functionName = ts.createIdentifier(
    path.concat([`is${typeName}`]).join("_")
  );
  const paramName = ts.createIdentifier("obj");
  const parameter = ts.createParameter(
    /* decorators */ undefined,
    /* modifiers */ undefined,
    /* dotDotDotToken */ undefined,
    paramName,
    /* questionToken */ undefined,
    ts.createTypeReferenceNode("object", /* typeArguments */ [])
  );

  const assertedTypeNode = ts.createTypeReferenceNode(typeName, []);
  const returnType = ts.createTypePredicateNode(paramName, assertedTypeNode);

  const funcCall = ts.createCall(
    ts.createIdentifier("checkSchema"),
    /* typeArguments */ [],
    [ts.createStringLiteral(typeName), paramName]
  );
  const returnNode = ts.createReturn(funcCall);

  return ts.createFunctionDeclaration(
    /* decorators */ undefined, // decorators
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    /* asteriskToken */ undefined,
    functionName,
    /* typeParameters */ [],
    [parameter],
    returnType,
    ts.createBlock([returnNode], /* multiline */ true)
  );
}

async function makeImports(
  typesNeeded: Array<{ file: string; type: string }>
): Promise<Array<ts.Node>> {
  const typeGuardImport = ts.createImportDeclaration(
    /* decorators */ [],
    /* modifiers */ [],
    ts.createImportClause(
      undefined,
      ts.createNamedImports([
        ts.createImportSpecifier(undefined, ts.createIdentifier("checkSchema")),
      ]),
      undefined
    ),
    ts.createStringLiteral("./typeGuards")
  );

  // Create a mapping that groups imports by the file they come from
  const typesByFile: { [file: string]: Array<string> } = {};
  const typesSeen = new Set();
  for (const entry of typesNeeded) {
    if (typesSeen.has(entry.type)) {
      console.warn(`Warning: duplicate type ${entry.type}`);
      continue;
    }
    if (!typesByFile[entry.file]) {
      typesByFile[entry.file] = [];
    }
    typesByFile[entry.file].push(entry.type);
    typesSeen.add(entry.type);
  }

  // Generate one import per file that imports everything needed from that file
  const neededTypeImports = Object.entries(
    typesByFile
  ).map(([file, types]: [string, Array<string>]) =>
    ts.createImportDeclaration(
      /* decorators */ [],
      /* modifiers */ [],
      ts.createImportClause(
        /** No default import */ undefined,
        ts.createNamedImports(
          types.map((type) =>
            ts.createImportSpecifier(undefined, ts.createIdentifier(type))
          )
        ),
        /* isTypeOnly */ true
      ),
      ts.createStringLiteral(`../types/${file}`)
    )
  );

  return [typeGuardImport].concat(neededTypeImports);
}

async function makeTypeScriptSource() {
  const resultFile = ts.createSourceFile(
    "src/typeGuardHelpers.ts",
    /* sourceText */ "",
    ts.ScriptTarget.Latest,
    /* setParentNodes */ false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  let typeGuardFunctions = "";

  // An import line
  const importsNeeded = [];

  // Make a type guard for every JSON Schema
  for await (const { path: srcFilePath } of walk("./schemas/")) {
    const { name: fileNameWithoutExtension, dir } = path.parse(srcFilePath);
    const components = dir.split(path.sep);
    if (components[0] != "schemas") {
      throw new Error(
        `Expected path to start with schemas, got ${srcFilePath}`
      );
    }
    if (components.length > 2) {
      throw new Error("Can only handle a single level of nesting in schemas");
    }
    importsNeeded.push({
      file: components.slice(1).join(path.sep),
      type: fileNameWithoutExtension,
    });

    typeGuardFunctions += printer.printNode(
      ts.EmitHint.Unspecified,
      makeTypeGuard(components.slice(1), fileNameWithoutExtension),
      resultFile
    );
    typeGuardFunctions += "\n\n";
  }

  const importLines = (await makeImports(importsNeeded))
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, resultFile))
    .join("\n");

  const eslintFix = "/* eslint-disable @typescript-eslint/ban-types */";

  return [eslintFix, importLines, typeGuardFunctions].join("\n\n");
}

async function main() {
  const typeScriptSource = await makeTypeScriptSource();
  await fs.writeFile("./src/typeGuardHelpers.ts", typeScriptSource);
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  process.exit(1);
});

main();
