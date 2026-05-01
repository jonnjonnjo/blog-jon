
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

const root = resolve(".");
const typstDir = join(root, "src/typst/");
const pdfsDir = join(root, "public/pdfs");
const dataDir = join(root, "src/data");
const outFile = join(dataDir, "posts.json");

await mkdir(pdfsDir, { recursive: true });
await mkdir(dataDir, { recursive: true });

async function findEntries(dir) {
  const entries = [];
  const items = await readdir(dir);

  for (const item of items) {
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

const entries = await findEntries(typstDir);

const posts = await Promise.all(
  entries.map(async ({ slug, typFile }) => {
    const pdfOut = join(pdfsDir, `${slug}.pdf`);
    const src = await readFile(typFile, "utf-8");

    const titleMatch = src.match(/title\s*:\s*"([^"]+)"/);
    const dateMatch = src.match(/date\s*:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : slug.replace(/[-_]/g, " ");
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

    console.log(`compiling ${slug}...`);
    execSync(`typst compile ${typFile} ${pdfOut}`);

    return { title, date, pdf: `/pdfs/${slug}.pdf` };
  })
);

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
await writeFile(outFile, JSON.stringify(posts, null, 2));
console.log(`wrote ${posts.length} posts to src/data/posts.json`);
