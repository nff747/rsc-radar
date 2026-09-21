import { parseFile, ParsedFile } from './parser.js';
import { resolveImport } from './resolver.js';

export interface GraphNode {
  filePath: string;
  isClient: boolean;
  children: GraphNode[];
  isBoundary: boolean;
  alreadyVisited?: boolean;
}

export function buildGraph/* Builds the dependency tree */(entryPoint: string, rootDir: string): GraphNode {
  const visited = new Set<string>();

  function walk(filePath: string, parentWasClient: boolean): GraphNode {
    if (visited.has(filePath)) {
      // We don't know if it was client when previously visited in another branch,
      // but we just mark it as visited to avoid cycles.
      return { filePath, isClient: parentWasClient, children: [], isBoundary: false, alreadyVisited: true };
    }
    visited.add(filePath);

    let parsed: ParsedFile;
    try {
      parsed = parseFile(filePath);
    } catch (e) {
      return { filePath, isClient: parentWasClient, children: [], isBoundary: false, alreadyVisited: true };
    }

    const isBoundary = parsed.isClient && !parentWasClient;
    const currentlyClient = parentWasClient || parsed.isClient;

    const node: GraphNode = {
      filePath,
      isClient: currentlyClient,
      isBoundary,
      children: [],
    };
    
    for (const imp of parsed.imports) {
      const resolved = resolveImport(filePath, imp, rootDir);
      if (resolved) {
        const childNode = walk(resolved, currentlyClient);
        node.children.push(childNode);
      }
    }

    return node;
  }

  return walk(entryPoint, false);
}
