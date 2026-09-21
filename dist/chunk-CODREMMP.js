// src/analyzer.ts
import pc3 from "picocolors";
import fg from "fast-glob";
import path3 from "path";

// src/parser.ts
import fs from "fs";
import { parseSync } from "@swc/core";
function parseFile(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  let ast;
  try {
    ast = parseSync(code, {
      syntax: "typescript",
      tsx: true,
      target: "es2022"
    });
  } catch (e) {
    return { filePath, isClient: false, imports: [] };
  }
  let isClient = false;
  for (const stmt of ast.body) {
    if (stmt.type === "ExpressionStatement" && stmt.expression.type === "StringLiteral") {
      if (stmt.expression.value === "use client") {
        isClient = true;
        break;
      }
    } else {
      break;
    }
  }
  const imports = /* @__PURE__ */ new Set();
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "ImportDeclaration") {
      imports.add(node.source.value);
    } else if (node.type === "ExportAllDeclaration") {
      imports.add(node.source.value);
    } else if (node.type === "ExportNamedDeclaration" && node.source) {
      imports.add(node.source.value);
    } else if (node.type === "CallExpression") {
      if (node.callee && node.callee.type === "Import") {
        if (node.arguments && node.arguments.length > 0) {
          const arg = node.arguments[0].expression;
          if (arg && arg.type === "StringLiteral") {
            imports.add(arg.value);
          }
        }
      }
    }
    for (const key in node) {
      if (Array.isArray(node[key])) {
        node[key].forEach(walk);
      } else if (typeof node[key] === "object") {
        walk(node[key]);
      }
    }
  }
  walk(ast);
  return { filePath, isClient, imports: Array.from(imports) };
}

// src/resolver.ts
import path from "path";
import fs2 from "fs";
function resolveImport(basePath, importPath, rootDir) {
  if (!importPath.startsWith(".") && !importPath.startsWith("@/")) {
    return null;
  }
  let targetPath = importPath;
  if (targetPath.startsWith("@/")) {
    targetPath = path.join(rootDir, targetPath.replace("@/", ""));
  } else {
    targetPath = path.resolve(path.dirname(basePath), targetPath);
  }
  const extensions = [".tsx", ".ts", ".jsx", ".js"];
  for (const ext of extensions) {
    if (fs2.existsSync(targetPath + ext)) {
      return targetPath + ext;
    }
  }
  for (const ext of extensions) {
    if (fs2.existsSync(path.join(targetPath, `index${ext}`))) {
      return path.join(targetPath, `index${ext}`);
    }
  }
  if (fs2.existsSync(targetPath) && fs2.statSync(targetPath).isFile()) {
    return targetPath;
  }
  return null;
}

// src/graph.ts
function buildGraph(entryPoint, rootDir) {
  const visited = /* @__PURE__ */ new Set();
  function walk(filePath, parentWasClient) {
    if (visited.has(filePath)) {
      return { filePath, isClient: parentWasClient, children: [], isBoundary: false, alreadyVisited: true };
    }
    visited.add(filePath);
    let parsed;
    try {
      parsed = parseFile(filePath);
    } catch (e) {
      return { filePath, isClient: parentWasClient, children: [], isBoundary: false, alreadyVisited: true };
    }
    const isBoundary = parsed.isClient && !parentWasClient;
    const currentlyClient = parentWasClient || parsed.isClient;
    const node = {
      filePath,
      isClient: currentlyClient,
      isBoundary,
      children: []
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

// src/renderer.ts
import pc from "picocolors";
import path2 from "path";
function renderNode(node, rootDir, prefix, isLast, branch) {
  const relPath = path2.relative(rootDir, node.filePath) || path2.basename(node.filePath);
  let label = "";
  if (node.alreadyVisited) {
    label = pc.dim(` (already rendered)`);
  } else if (node.isBoundary) {
    label = pc.yellow(' (Client Boundary - "use client")');
  } else if (node.isClient) {
    label = pc.red(" (Client Cascade)");
  } else {
    label = pc.cyan(" (Server)");
  }
  const nameColor = node.isBoundary ? pc.yellow : node.isClient ? pc.red : pc.cyan;
  const styledName = nameColor(relPath);
  console.log(`${prefix}${branch}${styledName}${label}`);
  const childPrefix = prefix + (isLast ? "    " : "\u2502   ");
  for (let i = 0; i < node.children.length; i++) {
    const isChildLast = i === node.children.length - 1;
    const childBranch = isChildLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
    renderNode(node.children[i], rootDir, childPrefix, isChildLast, childBranch);
  }
}
function renderGraph(node, rootDir) {
  const relPath = path2.relative(rootDir, node.filePath) || path2.basename(node.filePath);
  const nameColor = node.isClient ? pc.red : pc.cyan;
  const label = node.isClient ? pc.yellow(" (Client)") : pc.cyan(" (Server)");
  console.log(`${nameColor(relPath)}${label}`);
  for (let i = 0; i < node.children.length; i++) {
    const isLast = i === node.children.length - 1;
    const branch = isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
    renderNode(node.children[i], rootDir, "", isLast, branch);
  }
}

// src/stats.ts
import pc2 from "picocolors";
function calculateStats(node, stats = { serverNodes: 0, clientNodes: 0, boundaries: 0, total: 0 }) {
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
function renderStats(stats) {
  console.log(pc2.bold("\n--- Radar Summary ---"));
  console.log(`Total Components: ${stats.total}`);
  const serverPercentage = stats.total > 0 ? (stats.serverNodes / stats.total * 100).toFixed(1) : "0.0";
  const clientPercentage = stats.total > 0 ? (stats.clientNodes / stats.total * 100).toFixed(1) : "0.0";
  console.log(pc2.cyan(`Server-side: ${stats.serverNodes} (${serverPercentage}%)`));
  const clientStr = `Client-side: ${stats.clientNodes} (${clientPercentage}%)`;
  console.log(stats.clientNodes > 0 ? pc2.yellow(clientStr) : pc2.green(clientStr));
  console.log(`"use client" Boundaries: ${stats.boundaries}
`);
}

// src/analyzer.ts
function runAnalyzer(dir, entry) {
  const rootDir = path3.resolve(dir);
  console.log(pc3.blue(`
Scanning root: ${rootDir}`));
  let entryPoints = [];
  if (entry) {
    entryPoints = [path3.resolve(rootDir, entry)];
  } else {
    const appDir = path3.join(rootDir, "app");
    entryPoints = fg.sync(["**/page.tsx", "**/layout.tsx", "**/page.jsx", "**/layout.jsx"], {
      cwd: appDir,
      absolute: true
    });
  }
  if (entryPoints.length === 0) {
    console.error(pc3.red("No entry points found. Ensure you are in a Next.js App Router project or specify an entry point with -e."));
    return;
  }
  console.log(pc3.gray(`Found ${entryPoints.length} entry points.
`));
  const totalStats = { serverNodes: 0, clientNodes: 0, boundaries: 0, total: 0 };
  for (const entryPath of entryPoints) {
    const graph = buildGraph(entryPath, rootDir);
    renderGraph(graph, rootDir);
    calculateStats(graph, totalStats);
    console.log("\n");
  }
  renderStats(totalStats);
}

export {
  runAnalyzer
};
//# sourceMappingURL=chunk-CODREMMP.js.map