// Angry Judge: The Short Rant Contest
// One short, funny rant about a small everyday annoyance, printed to stdout
// and written to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline,
// so the sealed scorer reads exactly the text below, nothing more.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RANT =
  "The office printer never jams on a quiet Tuesday, only when the deadline is five minutes away — then it spits out one blank page, smug as a cat, and dares you to call IT, who will tell you to turn it off and on again as if you had not already tried that twelve times.";

// The gate allows 1 to 400 characters, one line, not only whitespace.
if ([...RANT].length < 1 || [...RANT].length > 400 || RANT.includes("\n")) {
  throw new Error("entry violates the 1-400 character, one-line gate");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), RANT, "utf8");
process.stdout.write(RANT + "\n");
