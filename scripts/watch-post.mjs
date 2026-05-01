
import { resolve, join, dirname } from "node:path";
import { spawn } from "node:child_process";
import { access, mkdir } from "node:fs/promises";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run typst:watch -- <slug>");
  console.error("Example: npm run typst:watch -- my-post");
  process.exit(1);
}

const root = resolve(".");
const typFile = join(root, "src/typst/", `${slug}.typ`);
const pdfOut = join(root, "public/pdfs/", `${slug}.pdf`);

try {
  await access(typFile);
} catch {
  console.error(`File not found: ${typFile}`);
  process.exit(1);
}

console.log(`Watching: ${typFile}`);
console.log(`Output:   ${pdfOut}`);

await mkdir(dirname(pdfOut), { recursive: true });
const typst = spawn("typst", ["watch", typFile, pdfOut], { stdio: "inherit" });

// await new Promise((res, rej) => {
//   const start = Date.now();
//   const check = () => {
//     if (existsSync(pdfOut)) return res();
//     if (Date.now() - start > 10_000) return rej(new Error("Timeout: PDF not generated after 10s"));
//     setTimeout(check, 100);
//   };
//   check();
// });
await new Promise((res) => setTimeout(res, 1500));

const zathura = spawn("zathura", [pdfOut], { stdio: "inherit" });

const cleanup = () => {
  typst.kill();
  zathura.kill();
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
