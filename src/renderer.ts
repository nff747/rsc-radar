import { GraphNode } from './graph.js';
import pc from 'picocolors';
import path from 'path';

function renderNode(node: GraphNode, rootDir: string, prefix: string, isLast: boolean, branch: string) {
  const relPath = path.relative(rootDir, node.filePath) || path.basename(node.filePath);
  
  let label = '';
  if (node.alreadyVisited) {
    label = pc.dim(` (already rendered)`);
  } else if (node.isBoundary) {
    label = pc.yellow(' (Client Boundary - "use client")');
  } else if (node.isClient) {
    label = pc.red(' (Client Cascade)');
  } else {
    label = pc.cyan(' (Server)');
  }

  const nameColor = node.isBoundary ? pc.yellow : (node.isClient ? pc.red : pc.cyan);
  const styledName = nameColor(relPath);

  console.log(`${prefix}${branch}${styledName}${label}`);

  const childPrefix = prefix + (isLast ? '    ' : '│   ');
  for (let i = 0; i < node.children.length; i++) {
    const isChildLast = i === node.children.length - 1;
    const childBranch = isChildLast ? '└── ' : '├── ';
    renderNode(node.children[i], rootDir, childPrefix, isChildLast, childBranch);
  }
}

export function renderGraph(node: GraphNode, rootDir: string) {
  const relPath = path.relative(rootDir, node.filePath) || path.basename(node.filePath);
  const nameColor = node.isClient ? pc.red : pc.cyan;
  const label = node.isClient ? pc.yellow(' (Client)') : pc.cyan(' (Server)');
  
  console.log(`${nameColor(relPath)}${label}`);
  
  for (let i = 0; i < node.children.length; i++) {
    const isLast = i === node.children.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    renderNode(node.children[i], rootDir, '', isLast, branch);
  }
}
