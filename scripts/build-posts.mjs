
import { readdir, readFile, writeFile, mkdir, stat, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = resolve(".");
const typstDir = join(root, "src/typst/");
const fontsDir = join(typstDir, "_fonts");
const pdfsDir = join(root, "public/pdfs");
const dataDir = join(root, "src/data");
const outFile = join(dataDir, "posts.json");

await mkdir(pdfsDir, { recursive: true });
await mkdir(dataDir, { recursive: true });

async function findEntries(dir) {
  const entries = [];
  const items = await readdir(dir);

  for (const item of items) {
    // Skip underscore-prefixed files/dirs (partials, shared modules)
    if (item.startsWith("_")) continue;

    const fullPath = join(dir, item);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      // Nested project from typst init — look for main.typ
      const mainTyp = join(fullPath, "main.typ");
      try {
        await stat(mainTyp);
        entries.push({ slug: item, typFile: mainTyp });
      } catch {
        // No main.typ, recurse deeper
        entries.push(...(await findEntries(fullPath)));
      }
    } else if (item.endsWith(".typ")) {
      // Flat single file
      const slug = item.replace(/\.typ$/, "");
      entries.push({ slug, typFile: fullPath });
    }
  }

  return entries;
}

async function findPartials(dir) {
  const partials = [];
  const items = await readdir(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const info = await stat(fullPath);
    if (info.isDirectory()) {
      partials.push(...(await findPartials(fullPath)));
    } else if (item.startsWith("_") && item.endsWith(".typ")) {
      partials.push(fullPath);
    }
  }
  return partials;
}

const entries = await findEntries(typstDir);
const partials = await findPartials(typstDir);
const newestPartialMtime = partials.length
  ? Math.max(...(await Promise.all(partials.map(async (p) => (await stat(p)).mtimeMs))))
  : 0;

const posts = await Promise.all(
  entries.map(async ({ slug, typFile }) => {
    const pdfOut = join(pdfsDir, `${slug}.pdf`);
    const src = await readFile(typFile, "utf-8");

    const titleMatch = src.match(/title\s*:\s*"([^"]+)"/);
    const dateMatch = src.match(/date\s*:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : slug.replace(/[-_]/g, " ");
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

    let needsCompile = true;
    try {
      const [srcStat, pdfStat] = await Promise.all([stat(typFile), stat(pdfOut)]);
      const newestSrc = Math.max(srcStat.mtimeMs, newestPartialMtime);
      needsCompile = newestSrc > pdfStat.mtimeMs;
    } catch { /* pdf doesn't exist yet */ }

    if (needsCompile) {
      console.log(`compiling ${slug}...`);
      await execFileAsync("typst", ["compile", "--font-path", fontsDir, typFile, pdfOut]);
    } else {
      console.log(`skipping ${slug} (unchanged)`);
    }

    return { title, date, pdf: `/pdfs/${slug}.pdf` };
  })
);

const validPdfs = new Set(entries.map(({ slug }) => `${slug}.pdf`));
const existingPdfs = await readdir(pdfsDir).catch(() => []);
for (const file of existingPdfs) {
  if (file.endsWith(".pdf") && !validPdfs.has(file)) {
    await unlink(join(pdfsDir, file));
    console.log(`removed orphaned ${file}`);
  }
}

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
await writeFile(outFile, JSON.stringify(posts, null, 2));
console.log(`wrote ${posts.length} posts to src/data/posts.json`);
