import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { parseFile } from '../src/parser.js';
import fs from 'fs';
import path from 'path';

describe('Parser', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');

  beforeAll(() => {
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
  });

  it('identifies use client directives', () => {
    const filePath = path.join(fixturesDir, 'client.tsx');
    fs.writeFileSync(filePath, `"use client";\nimport { useState } from 'react';\nexport default function Btn() { return <button/> }`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(true);
    expect(result.imports).toContain('react');
  });

  it('identifies server components', () => {
    const filePath = path.join(fixturesDir, 'server.tsx');
    fs.writeFileSync(filePath, `import { db } from '@/lib/db';\nexport default function Page() { return <div/> }`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(false);
    expect(result.imports).toContain('@/lib/db');
  });

  it('identifies dynamic imports', () => {
    const filePath = path.join(fixturesDir, 'dynamic.tsx');
    fs.writeFileSync(filePath, `export default async function Page() {\n  const dynamicModule = await import('./dynamic-module');\n  return <div/>;\n}`);
    const result = parseFile(filePath);
    expect(result.imports).toContain('./dynamic-module');
  });

  it('identifies export from', () => {
    const filePath = path.join(fixturesDir, 'export.tsx');
    fs.writeFileSync(filePath, `export * from './all';\nexport { specific } from './specific';`);
    const result = parseFile(filePath);
    expect(result.imports).toContain('./all');
    expect(result.imports).toContain('./specific');
  });

  it('ignores use client if not at top level', () => {
    const filePath = path.join(fixturesDir, 'not-client.tsx');
    fs.writeFileSync(filePath, `import 'something';\n"use client";\nexport default function Btn() { return <button/> }`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(false);
    expect(result.imports).toContain('something');
  });

  it('handles syntax errors gracefully', () => {
    const filePath = path.join(fixturesDir, 'error.tsx');
    fs.writeFileSync(filePath, `const foo = ;;;`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(false);
    expect(result.imports).toEqual([]);
  });

  it('handles comments before directives', () => {
    const filePath = path.join(fixturesDir, 'comments.tsx');
    fs.writeFileSync(filePath, `// this is a comment\n/* another comment */\n"use client";\nexport default function Btn() { return <button/> }`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(true);
  });
});
