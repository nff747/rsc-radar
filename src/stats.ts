import { GraphNode } from './graph.js';
import pc from 'picocolors';

export interface Stats {
  serverNodes: number;
  clientNodes: number;
  boundaries: number;
  total: number;
}

export function calculateStats(node: GraphNode, stats: Stats = { serverNodes: 0, clientNodes: 0, boundaries: 0, total: 0 }): Stats {
  if (node.alreadyVisited) return stats;

  stats.total++;
  if (node.isClient) {
    stats.clientNodes++;
  } else {
    stats.serverNodes++;
  }

  if (node.isBoundary) {
    stats.boundaries++;
  }

  for (const child of node.children) {
    calculateStats(child, stats);
  }

  return stats;
}

export function renderStats(stats: Stats) {
  console.log(pc.bold('\n--- Radar Summary ---'));
  console.log(`Total Components: ${stats.total}`);
  
  const serverPercentage = stats.total > 0 ? ((stats.serverNodes / stats.total) * 100).toFixed(1) : '0.0';
  const clientPercentage = stats.total > 0 ? ((stats.clientNodes / stats.total) * 100).toFixed(1) : '0.0';

  console.log(pc.cyan(`Server-side: ${stats.serverNodes} (${serverPercentage}%)`));
  
  const clientStr = `Client-side: ${stats.clientNodes} (${clientPercentage}%)`;
  console.log(stats.clientNodes > 0 ? pc.yellow(clientStr) : pc.green(clientStr));
  
  console.log(`"use client" Boundaries: ${stats.boundaries}\n`);
}
