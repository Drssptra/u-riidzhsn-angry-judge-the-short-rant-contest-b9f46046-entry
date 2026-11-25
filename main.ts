// Angry Judge — The Short Rant Contest (v2 resubmission).
//
// What this program does: it takes one short rant about a small everyday
// annoyance and hands it to the sealed scorer. The scorer reads exactly one
// file, $MAKEFUN_OUTPUT_DIR/entry.txt, so the whole job here is to put the
// rant in that file, byte for byte, with no trailing newline and nothing
// else. The rant is also echoed to stdout for the build log.
//
// The rant itself (v2 premise: the self-checkout machine):
//   "The self-checkout saw me scan the same bag of rice four times and
//    still screamed UNEXPECTED ITEM IN BAGGING AREA, then summoned a human
//    to watch me do the exact same thing, only slower, while seven
//    strangers stared at my back like I was shoplifting."
//
// Constraints honoured here:
//   * Node 22 standard library only; no network, no randomness.
//   * Entry must be 1–400 characters, a single line, not only whitespace.
//   * Output file must contain exactly the entry text, no trailing "\n".

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface RantConfig {
  readonly text: string;
  readonly maxChars: number;
  readonly outputFile: string;
  readonly outputDirFallback: string;
}

const CONFIG: RantConfig = {
  text: "The self-checkout saw me scan the same bag of rice four times and still screamed UNEXPECTED ITEM IN BAGGING AREA, then summoned a human to watch me do the exact same thing, only slower, while seven strangers stared at my back like I was shoplifting.",
  maxChars: 400,
  outputFile: "entry.txt",
  outputDirFallback: "/output",
};

// Check the rant against every contest rule and return a list of every
// violation found, so a failure names the rule that broke instead of
// failing silently on the first one.
function findViolations(text: string, maxChars: number): string[] {
  const violations: string[] = [];
  const charCount = Array.from(text).length;

  if (charCount < 1) {
    violations.push("entry is empty");
  }
  if (charCount > maxChars) {
    violations.push(`entry is ${charCount} characters, over the ${maxChars} limit`);
  }
  if (/[\r\n]/.test(text)) {
    violations.push("entry must be a single line");
  }
  if (text.trim().length === 0) {
    violations.push("entry must not be only whitespace");
  }
  return violations;
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : CONFIG.outputDirFallback;
}

function main(): void {
  const violations = findViolations(CONFIG.text, CONFIG.maxChars);
  if (violations.length > 0) {
    throw new Error(`entry rejected: ${violations.join("; ")}`);
  }

  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, CONFIG.outputFile);
  // Write the raw string: no added newline, no BOM, no extra bytes.
  writeFileSync(outPath, CONFIG.text, { encoding: "utf8" });

  // Read the file back and confirm it is byte-exact before reporting
  // success; a partial or altered write must fail loudly, not silently.
  const written = readFileSync(outPath, { encoding: "utf8" });
  if (written !== CONFIG.text) {
    throw new Error("entry.txt does not match the entry text after writing");
  }

  // Echo the rant to the log so the run is visible; the file stays exact.
  process.stdout.write(CONFIG.text + "\n");
}

main();
