import { parseSync } from '@swc/core';
const ast = parseSync("const a = import('dynamic'); export * from 'bar';", { syntax: "typescript", tsx: true });
console.log(JSON.stringify(ast.body[0], null, 2));
console.log(JSON.stringify(ast.body[1], null, 2));
