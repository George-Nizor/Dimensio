"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const dir = path.join(__dirname, "../src/renderer/brand-icons");
const load = () => import(path.join(dir, "forge-icons.mjs"));

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
