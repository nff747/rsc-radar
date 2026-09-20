#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { runAnalyzer } from './analyzer.js';
import { readFileSync } from 'fs';

const getVersion = () => {
  try {
    const pkgPath = new URL('../package.json', import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.version;
  } catch (e) {
    return '0.1.0';
  }
};

const program = new Command();

program
  .name('rsc-radar')
  .description('Visualizes React Server Component boundaries in Next.js applications.')
  .version(getVersion())
  .argument('[directory]', 'The directory to scan (defaults to current directory)', '.')
  .option('-e, --entry <path>', 'Custom entry point (e.g. app/page.tsx)')
  .action((dir, options) => {
    console.log(pc.cyan(`\nRadar scanning: ${dir}...\n`));
    try {
      runAnalyzer(dir, options.entry);
    } catch (err) {
      console.error(pc.red(`\nError: ${err instanceof Error ? err.message : String(err)}\n`));
      process.exit(1);
    }
  });

program.parse();
