#!/usr/bin/env node
import {
  runAnalyzer
} from "./chunk-CODREMMP.js";

// src/cli.ts
import { Command } from "commander";
import pc from "picocolors";
import { readFileSync } from "fs";
var getVersion = () => {
  try {
    const pkgPath = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.version;
  } catch (e) {
    return "0.1.0";
  }
};
var program = new Command();
program.name("rsc-radar").description("Visualizes React Server Component boundaries in Next.js applications.").version(getVersion()).argument("[directory]", "The directory to scan (defaults to current directory)", ".").option("-e, --entry <path>", "Custom entry point (e.g. app/page.tsx)").action((dir, options) => {
  console.log(pc.cyan(`
Radar scanning: ${dir}...
`));
  try {
    runAnalyzer(dir, options.entry);
  } catch (err) {
    console.error(pc.red(`
Error: ${err instanceof Error ? err.message : String(err)}
`));
    process.exit(1);
  }
});
program.parse();
//# sourceMappingURL=cli.js.map