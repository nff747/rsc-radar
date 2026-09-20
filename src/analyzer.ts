import pc from 'picocolors';
import { parseFile } from './parser.js';
import { resolveImport } from './resolver.js';
import fg from 'fast-glob';
import path from 'path';

export function runAnalyzer(dir: string, entry?: string) {
  const rootDir = path.resolve(dir);
  console.log(pc.blue(`Scanning root: ${rootDir}`));

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

  console.log(pc.gray(`Found ${entryPoints.length} entry points.`));
  
  for (const entryPath of entryPoints) {
    const parsed = parseFile(entryPath);
    console.log(`Parsed ${path.relative(rootDir, parsed.filePath)}: Client=${parsed.isClient}, Imports=${parsed.imports.length}`);
  }
}
