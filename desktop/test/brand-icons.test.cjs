"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

const dir = path.join(__dirname, "../src/renderer/brand-icons");
const load = () => import(pathToFileURL(path.join(dir, "forge-icons.mjs")).href);

test("every glyph renders at 16, 24 and 48 px with presentation attributes only", async () => {
  const { render, names, HUES } = await load();
  assert.ok(names.length >= 34);
  for (const name of names) {
    for (const size of [16, 24, 48]) {
      const svg = render(name, { size });
      assert.match(svg, new RegExp(`^<svg class="fi (fi-line )?fi-${name}[ "]`), name);
      assert.ok(svg.includes(`width="${size}"`), name);
      assert.doesNotMatch(svg, /\sstyle=|<script|<foreignObject|\shref=|\son\w+=|javascript:/i, name);
      assert.ok(svg.length > 100, name);
    }
    for (const hue of Object.keys(HUES)) render(name, { size: 24, hue });
  }
});

test("unknown names and hues throw", async () => {
  const { render } = await load();
  assert.throws(() => render("nope"));
  assert.throws(() => render("hammer", { hue: "nope" }));
});

test("README mapping names all exist", async () => {
  const { names } = await load();
  const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
  const rows = [...readme.matchAll(/^\| `([A-Za-z]+)` \|/gm)].map((m) => m[1]);
  assert.ok(rows.length >= 34);
  for (const n of rows) assert.ok(names.includes(n), `README names unknown icon ${n}`);
});

test("motion CSS honours reduced motion", () => {
  const css = fs.readFileSync(path.join(dir, "forge-icons.css"), "utf8");
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(css, /@import|url\(/);
});

const renderer = path.join(__dirname, "../src/renderer");
const mainJs = fs.readFileSync(path.join(renderer, "main.js"), "utf8");
const styleCss = fs.readFileSync(path.join(renderer, "style.css"), "utf8");

test("the renderer draws every icon from the brand set and keeps no old line-glyph table", async () => {
  const { names } = await load();
  assert.doesNotMatch(mainJs, /\bglyph\(|const glyphs\b|shade-dot/);
  // names passed to icon("...") and icon: "..." must exist in the set
  const used = new Set([...mainJs.matchAll(/\bicon\("([A-Za-z]+)"/g)].map((m) => m[1]));
  for (const m of mainJs.matchAll(/\bicon: "([A-Za-z]+)"/g)) used.add(m[1]);
  for (const m of mainJs.matchAll(/return "([A-Za-z]+)";/g)) if (names.includes(m[1])) used.add(m[1]);
  for (const name of used) assert.ok(names.includes(name), `main.js uses unknown icon ${name}`);
  for (const name of ["hammer", "send", "stop", "gear", "plan", "anvil", "shield", "crate", "done", "alert", "failed", "teapot", "splat", "render", "film", "page", "folder", "copy", "archive", "trash", "resume", "open", "export", "blender", "gamepad", "orbit", "pan", "frame", "grid", "clay", "rendered", "wire", "capture"]) {
    assert.ok(used.has(name) || mainJs.includes(`"${name}"`), `mapped icon ${name} is not wired`);
  }
});

test("the icon CSS rides the Vite build through icons.mjs, and the module output stays CSP-safe", () => {
  const icons = fs.readFileSync(path.join(renderer, "icons.mjs"), "utf8");
  assert.match(icons, /import "\.\/brand-icons\/forge-icons\.css"/);
  assert.match(mainJs, /from "\.\/icons\.mjs"/);
  assert.doesNotMatch(icons, /\.style|setAttribute\("style"|innerHTML\s*=/);
});

test("motion moments are wired and every one stops under reduced motion", () => {
  assert.match(mainJs, /strikeHammer/);
  assert.match(mainJs, /working: stage\.state === "active"/);
  assert.match(mainJs, /stagePlaying/);
  const css = fs.readFileSync(path.join(renderer, "brand-icons/forge-icons.css"), "utf8");
  assert.match(css, /prefers-reduced-motion: reduce\)\s*\{[^}]*\.fi \[class\^="m-"\]\s*\{\s*animation: none !important/s);
  assert.match(css, /html\[data-motion="reduced"\]/);
  // style.css adds the only extra animation (hover lid lift); it names .fi .m-lid, which the rule above overrides
  assert.match(styleCss, /\.fi \.m-lid[^{]*\{\s*animation: fi-lid/);
});

test("inactive rail tools are stone; stop, failed and trash are the only rose", () => {
  assert.match(mainJs, /hue: on \? undefined : "stone"/);
  assert.match(mainJs, /icon\("stop", 24\)/);
  assert.match(mainJs, /alert: warn|warn: "alert"/);
});
