import fs from 'fs';
import { parseSync } from '@swc/core';

export interface ParsedFile {
  filePath: string;
  isClient: boolean;
  imports: string[];
}

export function parseFile(filePath: string): ParsedFile {
  const code = fs.readFileSync(filePath, 'utf-8');
  
  let ast;
  try {
    ast = parseSync(code, {
      syntax: "typescript",
      tsx: true,
      target: "es2022",
    });
  } catch (e) {
    // If parsing fails (e.g. syntax error), return empty
    return { filePath, isClient: false, imports: [] };
  }
  
  let isClient = false;
  
  // React requires "use client" to be at the top level, 
  // before any imports or exports, possibly after other string literals (like "use strict").
  for (const stmt of ast.body) {
    if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'StringLiteral') {
      if (stmt.expression.value === 'use client') {
        isClient = true;
        break;
      }
    } else {
      // Directives must be at the top. If we hit a non-string literal, stop checking.
      break;
    }
  }

  const imports = new Set<string>();

  function walk(node: any) {
    if (!node || typeof node !== 'object') return;
    
    if (node.type === 'ImportDeclaration') {
      imports.add(node.source.value);
    } else if (node.type === 'ExportAllDeclaration') {
      imports.add(node.source.value);
    } else if (node.type === 'ExportNamedDeclaration' && node.source) {
      imports.add(node.source.value);
    } else if (node.type === 'CallExpression') {
      if (node.callee && node.callee.type === 'Import') {
        if (node.arguments && node.arguments.length > 0) {
          const arg = node.arguments[0].expression;
          if (arg && arg.type === 'StringLiteral') {
            imports.add(arg.value);
          }
        }
      }
    }
    
    for (const key in node) {
      if (Array.isArray(node[key])) {
        node[key].forEach(walk);
      } else if (typeof node[key] === 'object') {
        walk(node[key]);
      }
    }
  }

  walk(ast);

  return { filePath, isClient, imports: Array.from(imports) };
}
