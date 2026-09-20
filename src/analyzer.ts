import pc from 'picocolors';
import fg from 'fast-glob';
import path from 'path';
import { buildGraph } from './graph.js';
import { renderGraph } from './renderer.js';

export function runAnalyzer(dir: string, entry?: string) {
  const rootDir = path.resolve(dir);
  console.log(pc.blue(`\nScanning root: ${rootDir}`));

  let entryPoints: string[] = [];
  if (entry) {
    entryPoints = [path.resolve(rootDir, entry)];
  } else {
    const appDir = path.join(rootDir, 'app');
    entryPoints = fg.sync(['**/page.tsx', '**/layout.tsx', '**/page.jsx', '**/layout.jsx'], {
      cwd: appDir,
      absolute: true,
    });
  }

  if (entryPoints.length === 0) {
    console.error(pc.red('No entry points found. Ensure you are in a Next.js App Router project or specify an entry point with -e.'));
    return;
  }

  console.log(pc.gray(`Found ${entryPoints.length} entry points.\n`));
  
  for (const entryPath of entryPoints) {
    const graph = buildGraph(entryPath, rootDir);
    renderGraph(graph, rootDir);
    console.log('\n');
  }
}
