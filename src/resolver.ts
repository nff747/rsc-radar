import path from 'path';
import fs from 'fs';

export function resolveImport(basePath: string, importPath: string, rootDir: string): string | null {
  // Ignore external modules
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return null;
  }

  let targetPath = importPath;
  if (targetPath.startsWith('@/')) {
    // TODO: read tsconfig paths for complete accuracy
    targetPath = path.join(rootDir, targetPath.replace('@/', ''));
  } else {
    targetPath = path.resolve(path.dirname(basePath), targetPath);
  }

  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  for (const ext of extensions) {
    if (fs.existsSync(targetPath + ext)) {
      return targetPath + ext;
    }
  }

  for (const ext of extensions) {
    if (fs.existsSync(path.join(targetPath, `index${ext}`))) {
      return path.join(targetPath, `index${ext}`);
    }
  }

  // Maybe the target path itself is a file without extension check needed
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    return targetPath;
  }

  return null;
}
