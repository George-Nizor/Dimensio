// Renders docs/review-2026-10/icon-contact-sheet.{html,png}: every brand icon at 16/24/48 px on dark
// and light. Usage (see test-tools/screenshots/README.md for the WSL Chromium libraries):
//   node test-tools/icon-contact-sheet.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { render, names, glyphHue } from "../src/renderer/brand-icons/forge-icons.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../docs/review-2026-10");
const css = fs.readFileSync(path.resolve(here, "../src/renderer/brand-icons/forge-icons.css"), "utf8");
const sizes = [16, 24, 48];
const stoneToo = new Set(["orbit", "pan", "frame", "grid", "wire", "capture"]);

const panel = (cls, name, extra) =>
  `<div class="panel ${cls}">${sizes.map((s) => `<span class="cell">${render(name, { size: s, ...extra })}</span>`).join("")}</div>`;
const rows = names
  .map((n) => {
    const hue = glyphHue(n);
    const stone = stoneToo.has(n) ? `<span class="tag">+ stone</span>` : "";
    const row = (extra) => `<div class="pair">${panel("dark", n, extra)}${panel("light", n, extra)}</div>`;
    return `<div class="row"><div class="name"><b>${n}</b><i>${hue}</i></div>${row({})}${stoneToo.has(n) ? `<div class="pair stone">${panel("dark", n, { hue: "stone" })}${panel("light", n, { hue: "stone" })}</div>` : ""}${stone}</div>`;
  })
  .join("");

const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Workshop icons: contact sheet</title>
<style>${css}
body{margin:0;background:#1b1815;color:#d9d3cc;font:13px/1.3 system-ui,sans-serif;padding:18px}
h1{font:600 18px system-ui;margin:0 0 4px}p{margin:0 0 14px;color:#a9a29a}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 24px}
.row{display:flex;align-items:center;gap:10px;background:#221e1a;border-radius:8px;padding:6px 8px}
.name{width:92px;flex:none}.name b{display:block;font-weight:600}.name i{color:#8d867e;font-style:normal;font-size:11px}
.pair{display:flex;gap:4px}
.panel{display:flex;align-items:center;gap:12px;padding:6px 10px;border-radius:6px;min-height:52px}
.panel.dark{background:#141210;color:#e8e2da}.panel.light{background:#fbf7f1;color:#2b2520}
.cell{display:inline-flex;align-items:center}
.tag{color:#8d867e;font-size:11px}
.legend{display:flex;gap:16px;margin:0 0 14px;font-size:12px;color:#a9a29a}
</style><body><h1>Workshop interface icons, brand v2</h1>
<p>${names.length} glyphs at 16 / 24 / 48 px, dark (#141210) then light. Rail glyphs repeat in stone, the inactive state. Line utilities use currentColor.</p>
<div class="grid">${rows}</div></body></html>`;
fs.writeFileSync(path.join(out, "icon-contact-sheet.html"), html);

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const base = path.join(process.env.HOME, ".cache/ms-playwright");
const shell = fs.readdirSync(base).filter((d) => d.startsWith("chromium_headless_shell-")).sort().pop();
const exe = process.env.CHROMIUM || path.join(base, shell, "chrome-headless-shell-linux64", "chrome-headless-shell");
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 2 });
await page.goto("file://" + path.join(out, "icon-contact-sheet.html"));
await page.screenshot({ path: path.join(out, "icon-contact-sheet.png"), fullPage: true });
await browser.close();
console.log("wrote", path.join(out, "icon-contact-sheet.png"));
