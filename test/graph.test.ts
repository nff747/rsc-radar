import { describe, it, expect } from 'vitest';
import { buildGraph } from '../src/graph.js';
import fs from 'fs';
import path from 'path';

describe('Graph Builder', () => {
  it('builds a tree from entry point', () => {
    // Mock the parser inside graph testing by using the mock-app
    const root = path.join(__dirname, 'mock-app');
    const entry = path.join(root, 'app', 'layout.tsx');
    const graph = buildGraph(entry, root);
    
    expect(graph.isClient).toBe(false);
    expect(graph.children.length).toBe(1);
    expect(graph.children[0].isBoundary).toBe(true);
    expect(graph.children[0].isClient).toBe(true);
  });
});
