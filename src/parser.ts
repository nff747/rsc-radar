import fs from 'fs';

export interface ParsedFile {
  filePath: string;
  isClient: boolean;
  imports: string[];
}

export function parseFile/* Parses a file using regex */(filePath: string): ParsedFile {
  const code = fs.readFileSync(filePath, 'utf-8');
  
  // Remove block comments and single line comments for safer regex
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '');

  const isClient = /^\s*(['"])use client\1/m.test(cleanCode);
  
  const imports: string[] = [];
  
  const importRegex = /(?:import|export)\s+(?:[^'"]*?)\s*from\s+(['"])([^'"]+)\1/g;
  let match;
  while ((match = importRegex.exec(cleanCode)) !== null) {
    imports.push(match[2]);
  }

  const dynamicImportRegex = /import\s*\(\s*(['"])([^'"]+)\1\s*\)/g;
  while ((match = dynamicImportRegex.exec(cleanCode)) !== null) {
    imports.push(match[2]);
  }

  return { filePath, isClient, imports };
}
