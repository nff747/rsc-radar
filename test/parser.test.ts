import { describe, it, expect } from 'vitest';
import { parseFile } from '../src/parser.js';
import fs from 'fs';
import path from 'path';

describe('Parser', () => {
  it('identifies use client directives', () => {
    const filePath = path.join(__dirname, 'fixtures', 'client.tsx');
    fs.writeFileSync(filePath, `"use client";\nimport { useState } from 'react';\nexport default function Btn() { return <button/> }`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(true);
    expect(result.imports).toContain('react');
  });

  it('identifies server components', () => {
    const filePath = path.join(__dirname, 'fixtures', 'server.tsx');
    fs.writeFileSync(filePath, `import { db } from '@/lib/db';\nexport default function Page() { return <div/> }`);
    const result = parseFile(filePath);
    expect(result.isClient).toBe(false);
    expect(result.imports).toContain('@/lib/db');
  });
});
