// Pre-commit: stamp today's date into any new/changed post that lacks one.
// Publish date freezes at first commit; later edits never touch it.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const staged = execSync("git diff --cached --name-only --diff-filter=ACM", {
  encoding: "utf8",
})
  .split("\n")
  .filter((f) => f.startsWith("src/content/posts/") && f.endsWith(".md"));

const today = new Date().toISOString().split("T")[0];

for (const file of staged) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue; // no frontmatter block — skip
  if (/^date\s*:/m.test(fm[1])) continue; // already dated — leave it alone

  const stamped = `---\n${fm[1]}\ndate: ${today}\n---`;
  // Function replacement avoids `$` in the body being treated as a backref.
  writeFileSync(file, src.replace(fm[0], () => stamped));
  execSync(`git add ${JSON.stringify(file)}`);
  console.log(`stamped date ${today} → ${file}`);
}
