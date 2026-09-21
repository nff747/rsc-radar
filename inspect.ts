import { parseSync } from '@swc/core';
const ast = parseSync("'use client';\nimport a from 'b'; export {a};", { syntax: "typescript", tsx: true });
console.log(JSON.stringify(ast.body[0], null, 2));
console.log(JSON.stringify(ast.body[1], null, 2));
