// Entry program for the gta6-meme-x-01 bounty ("Post a GTA 6 meme on X").
//
// The entry itself is a post on X; this repository only has to hand the
// house the post's address. So the whole job of this program is: take
// POST.json from the bot directory and place a copy of it in the output
// directory, byte for byte. Nothing else is written.
//
//   MAKEFUN_BOT_DIR    where POST.json lives   (default: /bot)
//   MAKEFUN_OUTPUT_DIR where the copy goes     (default: /output)

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");
const destination = join(outputDir, "POST.json");

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(source, destination);
} catch (err) {
  console.error(`gta6-meme-x-01: could not copy ${source} to ${destination}`);
  console.error(`reason: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

console.log(`gta6-meme-x-01: copied POST.json to ${destination}`);

// Read the copy back and prove it names a post before reporting success:
// a POST.json that does not parse, or that carries no url string, would be
// refused by the house, so fail loudly here instead of handing it over.
let named: unknown;
try {
  named = JSON.parse(readFileSync(destination, "utf8"));
} catch (err) {
  console.error(`gta6-meme-x-01: the copied POST.json does not parse as JSON`);
  console.error(`reason: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

const url =
  named !== null && typeof named === "object"
    ? (named as { url?: unknown }).url
    : undefined;
if (typeof url !== "string" || url.length === 0) {
  console.error(`gta6-meme-x-01: the copied POST.json names no post url`);
  process.exit(1);
}

console.log(`gta6-meme-x-01: entry post is ${url}`);
