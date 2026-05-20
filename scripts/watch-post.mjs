
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";
import { stat, mkdir } from "node:fs/promises";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run typst:watch -- <slug>");
  console.error("Example: npm run typst:watch -- my-post");
  process.exit(1);
}

const root = resolve(".");
const typstDir = join(root, "src/typst");
const pdfOut = join(root, "public/pdfs", `${slug}.pdf`);

// Support both flat (slug.typ) and directory-based (slug/main.typ) projects
let typFile = join(typstDir, `${slug}.typ`);
try {
  await stat(typFile);
} catch {
  const dirEntry = join(typstDir, slug, "main.typ");
  try {
    await stat(dirEntry);
    typFile = dirEntry;
  } catch {
    console.error(`File not found: tried ${join(typstDir, slug + ".typ")} and ${dirEntry}`);
    process.exit(1);
  }
}

console.log(`Watching: ${typFile}`);
console.log(`Output:   ${pdfOut}`);

await mkdir(join(root, "public/pdfs"), { recursive: true });
const typst = spawn("typst", ["watch", typFile, pdfOut], { stdio: "inherit" });

// Wait until the PDF is actually written before opening the viewer
const start = Date.now();
while (true) {
  try {
    await stat(pdfOut);
    break;
  } catch {}
  if (Date.now() - start > 10_000) {
    console.error("Timeout: PDF not generated after 10s");
    typst.kill();
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 100));
}

const zathura = spawn("zathura", [pdfOut], { stdio: "inherit" });

const cleanup = () => {
  typst.kill();
  zathura.kill();
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
