
// scripts/build-posts.mjs
// Run via: npm run typst:build
// Reads all .typ files from src/typst/, compiles to public/pdfs/,
// and writes src/data/posts.json with title + date metadata.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

const root = resolve(".");
const typstDir = join(root, "src/typst/");
const pdfsDir = join(root, "public/pdfs");
const dataDir = join(root, "src/data");
const outFile = join(dataDir, "posts.json");

await mkdir(pdfsDir, { recursive: true });
await mkdir(dataDir, { recursive: true });

const files = (await readdir(typstDir)).filter((f) => f.endsWith(".typ"));

const posts = await Promise.all(
  files.map(async (file) => {
    const slug = file.replace(/\.typ$/, "");
    const typFile = join(typstDir, file);
    const pdfOut = join(pdfsDir, `${slug}.pdf`);

    const src = await readFile(typFile, "utf-8");

    const titleMatch = src.match(/title\s*:\s*"([^"]+)"/);
    const dateMatch = src.match(/date\s*:\s*"([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : slug.replace(/[-_]/g, " ");
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

    console.log(`compiling ${file}...`);
    execSync(`typst compile ${typFile} ${pdfOut}`);

    return { title, date, pdf: `/pdfs/${slug}.pdf` };
  })
);

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

await writeFile(outFile, JSON.stringify(posts, null, 2));
console.log(`wrote ${posts.length} posts to src/data/posts.json`);
