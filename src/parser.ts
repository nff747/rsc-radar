import ts from 'typescript';
import fs from 'fs';

export interface ParsedFile {
  filePath: string;
  isClient: boolean;
  imports: string[];
}

export function parseFile(filePath: string): ParsedFile {
  const code = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true
  );

  let isClient = false;
  const imports: string[] = [];

  for (const statement of sourceFile.statements) {
    // Detect "use client" directive
    if (ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression)) {
      if (statement.expression.text === 'use client') {
        isClient = true;
      }
    }
    
    // Detect imports
    if (ts.isImportDeclaration(statement)) {
      if (ts.isStringLiteral(statement.moduleSpecifier)) {
        imports.push(statement.moduleSpecifier.text);
      }
    }
  }

  return { filePath, isClient, imports };
}
