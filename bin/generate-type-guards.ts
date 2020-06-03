#!/usr/bin/env ts-node-script
import ts from "typescript";
import { walk } from "../src/utils";
import path from "path";
import { promises as fs } from "fs";

async function main() {
  const typeScriptSource = await makeTypeScriptSource();
  await fs.mkdir("./src/_generated", { recursive: true });
  await fs.writeFile("./src/_generated/typeGuardHelpers.ts", typeScriptSource);
}

async function makeTypeScriptSource() {
  const resultFile = ts.createSourceFile(
    "src/typeGuardHelpers.ts",
    /* sourceText */ "",
    ts.ScriptTarget.Latest,
    /* setParentNodes */ false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  let typeGuardFunctions = "";

  // An import line
  const importsNeeded = [];

  /* Make 3 type checks for every JSON Schema
   *  - checkType: returns an object with details
   *  - isType: returns a boolean only (helpful with Typescript as a type guard)
   *  - assertType: throws if the value is not the correct type (helpful with Typescript as a type assertion)
   */
  for await (const { path: srcFilePath } of walk("./schemas/")) {
    const { name: fileNameWithoutExtension, dir } = path.parse(srcFilePath);
    const components = dir.split(path.sep);
    if (components[0] != "schemas") {
      throw new Error(`Expected path to start with schemas, got ${srcFilePath}`);
    }
    if (components.length > 2) {
      throw new Error("Can only handle a single level of nesting in schemas");
    }
    importsNeeded.push({
      file: components.slice(1).join(path.sep),
      type: fileNameWithoutExtension,
    });

    for (const node of makeTypeGuards(components.slice(1), fileNameWithoutExtension)) {
      typeGuardFunctions += printer.printNode(ts.EmitHint.Unspecified, node, resultFile) + "\n";
    }
    typeGuardFunctions += "\n\n";
  }

  const importLines = (await makeImports(importsNeeded))
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, resultFile))
    .join("\n");

  const eslintFix = "/* eslint-disable @typescript-eslint/ban-types */";

  return [eslintFix, importLines, typeGuardFunctions].join("\n\n");
}

/** Build a type guard function for the type specified */
function makeTypeGuards(path: Array<string>, typeName: string): Array<ts.Node> {
  /* Creates 3 functions, after some common setup.
   *  1. checkType: Checks if an object matches the given schema, and if not gives details.
   *  2. isType: Checks if an object matches the given schema, and returns a boolean.
   *  3. assertType: Checks if an object matches the given schema, and raises an exception if not.
   */

  // 0: common setup
  const paramName = ts.createIdentifier("obj");
  const parameter = ts.createParameter(
    /* decorators */ undefined,
    /* modifiers */ undefined,
    /* dotDotDotToken */ undefined,
    paramName,
    /* questionToken */ undefined,
    ts.createTypeReferenceNode("object", /* typeArguments */ []),
  );
  const assertedTypeNode = ts.createTypeReferenceNode(typeName, []);

  // 1. checkType
  let checkTypeFunc: ts.Node;
  {
    const functionName = ts.createIdentifier(path.concat([`check${typeName}`]).join("_"));
    const checkReturnType = ts.createTypeReferenceNode("SchemaResult", []);
    const checkTypeCall = ts.createCall(
      ts.createIdentifier("checkSchema"),
      /* typeArguments */ [],
      [ts.createStringLiteral(path.concat([typeName]).join("/")), paramName],
    );
    checkTypeFunc = ts.createFunctionDeclaration(
      /* decorators */ undefined, // decorators
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      /* asteriskToken */ undefined,
      functionName,
      /* typeParameters */ [],
      [parameter],
      checkReturnType,
      ts.createBlock([ts.createReturn(checkTypeCall)]),
    );
  }

  // 2: isType
  let isTypeFunc: ts.Node;
  {
    const functionName = ts.createIdentifier(path.concat([`is${typeName}`]).join("_"));
    const guardReturnType = ts.createTypePredicateNode(paramName, assertedTypeNode);
    const guardTypeCall = ts.createCall(
      ts.createIdentifier("isSchema"),
      /* typeArguments */ [],
      [ts.createStringLiteral(path.concat([typeName]).join("/")), paramName],
    );
    isTypeFunc = ts.createFunctionDeclaration(
      /* decorators */ undefined, // decorators
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      /* asteriskToken */ undefined,
      functionName,
      /* typeParameters */ [],
      [parameter],
      guardReturnType,
      ts.createBlock([ts.createReturn(guardTypeCall)]),
    );
  }

  // 3: assertType
  let assertTypeFunc: ts.Node;
  {
    const functionName = ts.createIdentifier(path.concat([`assert${typeName}`]).join("_"));
    const assertReturnType = ts.createTypePredicateNodeWithModifier(
      ts.createToken(ts.SyntaxKind.AssertsKeyword),
      paramName,
      assertedTypeNode,
    );
    const assertTypeCall = ts.createCall(
      ts.createIdentifier("assertSchema"),
      /* typeArguments */ [],
      [ts.createStringLiteral(path.concat([typeName]).join("/")), paramName],
    );
    assertTypeFunc = ts.createFunctionDeclaration(
      /* decorators */ undefined, // decorators
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      /* asteriskToken */ undefined,
      functionName,
      /* typeParameters */ [],
      [parameter],
      assertReturnType,
      ts.createBlock([ts.createReturn(assertTypeCall)]),
    );
  }

  return [isTypeFunc, checkTypeFunc, assertTypeFunc];
}

async function makeImports(
  typesNeeded: Array<{ file: string; type: string }>,
): Promise<Array<ts.Node>> {
  const typeGuardImport = ts.createImportDeclaration(
    /* decorators */ [],
    /* modifiers */ [],
    ts.createImportClause(
      undefined,
      ts.createNamedImports([
        ts.createImportSpecifier(undefined, ts.createIdentifier("checkSchema")),
        ts.createImportSpecifier(undefined, ts.createIdentifier("isSchema")),
        ts.createImportSpecifier(undefined, ts.createIdentifier("assertSchema")),
        ts.createImportSpecifier(undefined, ts.createIdentifier("SchemaResult")),
      ]),
      undefined,
    ),
    ts.createStringLiteral("../typeGuards"),
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
    typesByFile,
  ).map(([file, types]: [string, Array<string>]) =>
    ts.createImportDeclaration(
      /* decorators */ [],
      /* modifiers */ [],
      ts.createImportClause(
        /** No default import */ undefined,
        ts.createNamedImports(
          types.map((type) => ts.createImportSpecifier(undefined, ts.createIdentifier(type))),
        ),
        /* isTypeOnly */ true,
      ),
      ts.createStringLiteral(`../../types/${file}`),
    ),
  );

  return [typeGuardImport].concat(neededTypeImports);
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Reject at:", promise, "reason:", reason);
  process.exit(1);
});

main();
