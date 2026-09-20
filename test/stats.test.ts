import { describe, it, expect } from 'vitest';
import { calculateStats, Stats } from '../src/stats.js';

describe('Stats', () => {
  it('calculates correct percentages', () => {
    const node = {
      filePath: 'a',
      isClient: false,
      isBoundary: false,
      children: [
        { filePath: 'b', isClient: true, isBoundary: true, children: [] }
      ]
    };
    const stats: Stats = { serverNodes: 0, clientNodes: 0, boundaries: 0, total: 0 };
    calculateStats(node, stats);
    expect(stats.total).toBe(2);
    expect(stats.serverNodes).toBe(1);
    expect(stats.clientNodes).toBe(1);
    expect(stats.boundaries).toBe(1);
  });
});
