import { parseSync } from '@swc/core';
const ast = parseSync("// comment\n'use client';\nimport a from 'b';", { syntax: "typescript", tsx: true });
console.log(JSON.stringify(ast.body[0], null, 2));
