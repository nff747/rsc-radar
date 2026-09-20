import { describe, it, expect } from 'vitest';
import { resolveImport } from '../src/resolver.js';
import path from 'path';

describe('Resolver', () => {
  it('ignores external imports', () => {
    expect(resolveImport('/app/page.tsx', 'react', '/app')).toBeNull();
  });
});
