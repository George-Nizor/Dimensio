"use strict";

// The content build's own rules, on small courses written to a temporary folder.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");

const script = path.join(__dirname, "..", "scripts", "build-content.mjs");
const lib = path.join(__dirname, "..", "..", "content", "diagrams", "lib.mjs");

const LESSON = (title, exercise, diagram) => `---
needs: []
exercise: ${exercise}
watch: [manual]
sources:
  - Blender 5.2 Manual (https://docs.blender.org/manual/en/5.2/), read 2026-10-15
---

# ${title}

In this lesson you'll learn to press a key in Blender.

## Steps

1. **Press.** Press \`G\` to move the cube.
${diagram ? `\n   ![The cube moving to the right.](${diagram})\n` : ""}
2. **Move.** Move the mouse to the right.

3. **Confirm.** Left click to put the cube down.

## Checking your model

1. The cube sits to the right of where it started.
2. The cube is still on the floor.
3. Nothing else in the scene moved.
`;

function practice(id, measure = "") {
  return `- id: ${id}
  main: true
  title: Move the cube
  kind: drill
  minutes: 5
  text: Move the cube 2 m to the right and save the file.
  timer: { minutes: 5 }
${measure}`;
}

function course(lessons, { folders, measure, diagram } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-content-"));
  const content = path.join(dir, "content");
  fs.mkdirSync(path.join(content, "diagrams"), { recursive: true });
  fs.copyFileSync(lib, path.join(content, "diagrams", "lib.mjs"));
  fs.writeFileSync(path.join(content, "course.yaml"), `parts:\n  - title: Basics\n    lessons:\n${lessons.map((slug) => `      - { slug: ${slug}, title: "Moving ${slug}", summary: "Moving the cube with a key." }`).join("\n")}\n`);
  fs.writeFileSync(path.join(content, "resources.yaml"), "- { id: manual, title: Move, teacher: Blender Manual, url: \"https://docs.blender.org/manual/en/5.2/\", kind: written page, cost: free, checked: 2026-10-15 }\n");
  fs.writeFileSync(path.join(content, "prompts.yaml"), ["subjects", "twists", "limits"].map((key) => `${key}: [one, two, three, four, five]`).join("\n"));
  for (const [folder, slug] of folders || lessons.map((slug, i) => [`${String(i + 1).padStart(3, "0")}-${slug}`, slug])) {
    const lessonDir = path.join(content, "lessons", folder);
    fs.mkdirSync(path.join(lessonDir, "diagrams"), { recursive: true });
    fs.writeFileSync(path.join(lessonDir, "lesson.md"), LESSON(`Moving ${slug}`, `${slug}-drill`, diagram));
    fs.writeFileSync(path.join(lessonDir, "practice.yaml"), practice(`${slug}-drill`, measure));
    fs.writeFileSync(path.join(lessonDir, "diagrams", "cube.mjs"), "export default ({ svg, rect }) => svg({ width: 10, height: 10 }, rect(1, 1, 8, 8));\n");
  }
  return content;
}

function check(content) {
  const result = spawnSync(process.execPath, [script, "--check", "--content", content], { encoding: "utf8" });
  return { ok: result.status === 0, output: `${result.stdout}${result.stderr}` };
}

test("lesson folders are NNN-slug, numbered by their place in course.yaml", () => {
  const good = check(course(["alpha", "beta"]));
  assert.equal(good.ok, true, good.output);
  assert.match(good.output, /2 lessons in 1 parts, 2 written/);

  const two = check(course(["alpha"], { folders: [["01-alpha", "alpha"]] }));
  assert.equal(two.ok, false);
  assert.match(two.output, /content\/lessons\/01-alpha: a lesson folder is named NNN-slug, with three digits/);

  const misplaced = check(course(["alpha", "beta"], { folders: [["001-alpha", "alpha"], ["003-beta", "beta"]] }));
  assert.equal(misplaced.ok, false);
  assert.match(misplaced.output, /003-beta: this is lesson 2 in course\.yaml, so the folder is 002-beta/);

  const stray = check(course(["alpha"], { folders: [["001-alpha", "alpha"], ["002-gamma", "gamma"]] }));
  assert.match(stray.output, /002-gamma: folder has no entry in course\.yaml/);
});

test("a diagram is found by its name or by its lesson folder and name", () => {
  assert.equal(check(course(["alpha"], { diagram: "cube" })).ok, true);
  assert.equal(check(course(["alpha"], { diagram: "001-alpha/cube" })).ok, true);
  assert.equal(check(course(["alpha"], { diagram: "001-alpha/diagrams/cube.mjs" })).ok, true);
  const missing = check(course(["alpha"], { diagram: "001-alpha/sphere" }));
  assert.equal(missing.ok, false);
  assert.match(missing.output, /diagram "001-alpha\/sphere" has no diagrams\/sphere\.mjs/);
});

test("measures name a metric from the report, before modifiers with base.", () => {
  const measure = (line) => `  measure:\n    - ${line}\n`;
  assert.equal(check(course(["alpha"], { measure: measure('{ metric: ngons, max: 0, label: "No n-gons" }') })).ok, true);
  assert.equal(check(course(["alpha"], { measure: measure('{ metric: base.ngons, max: 0, label: "No n-gons before modifiers" }') })).ok, true);
  const flag = check(course(["alpha"], { measure: measure('{ metric: base.scaleApplied, equals: true, label: "Scale applied" }') }));
  assert.match(flag.output, /unknown metric "base\.scaleApplied"/);
  const unknown = check(course(["alpha"], { measure: measure('{ metric: polygons, max: 10, label: "Few polygons" }') }));
  assert.match(unknown.output, /unknown metric "polygons"/);
  const limit = check(course(["alpha"], { measure: measure('{ metric: scaleApplied, max: 1, label: "Scale applied" }') }));
  assert.match(limit.output, /takes equals: true or equals: false/);
});
