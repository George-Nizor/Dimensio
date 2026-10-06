const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const desktopRoot = path.resolve(__dirname, "..");
const renderer = fs.readFileSync(path.join(desktopRoot, "src", "renderer", "main.js"), "utf8");
const styles = fs.readFileSync(path.join(desktopRoot, "src", "renderer", "style.css"), "utf8");
const icon = fs.readFileSync(path.join(desktopRoot, "assets", "icon.png"));
const ico = fs.readFileSync(path.join(desktopRoot, "assets", "icon.ico"));
const packageJson = JSON.parse(fs.readFileSync(path.join(desktopRoot, "package.json"), "utf8"));

function pngDimensions(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("the brand v2 cube is the canonical desktop identity", () => {
  assert.deepEqual(pngDimensions(icon), { width: 512, height: 512 });
  // Windows icon: reserved word 0, type 1 (icon), at least the 16 to 256 sizes.
  assert.deepEqual([ico.readUInt16LE(0), ico.readUInt16LE(2)], [0, 1]);
  assert.ok(ico.readUInt16LE(4) >= 6);
  assert.equal(packageJson.build.win.icon, "assets/icon.ico");
  assert.match(renderer, /import InstrumentaIcons from "\.\/brand\/instrumenta-icons\.js"/);
  assert.match(renderer, /InstrumentaIcons\.render\("forge3d"/);
  assert.doesNotMatch(renderer, /forge3d-mark|brand-symbol|Codex-driven asset studio|class="brand-mark">F3/);
});

test("brand v2 type and accent are vendored locally, not loaded from a CDN", () => {
  assert.equal(packageJson.dependencies["@fontsource/space-grotesk"], undefined);
  assert.match(renderer, /import "\.\/brand\/fonts\/fonts\.css"/);
  assert.match(styles, /--display: "Fraunces"/);
  assert.match(styles, /--ui: "Commissioner"/);
  assert.match(styles, /--mono: "Spline Sans Mono"/);
  assert.match(styles, /--ui-vs: "FLAR" 40/);
  assert.match(styles, /--accent: #ee7752/);
  const fonts = path.join(desktopRoot, "src", "renderer", "brand", "fonts");
  for (const name of ["fonts.css", "OFL-fraunces.txt", "OFL-commissioner.txt", "OFL-splinesansmono.txt"]) {
    assert.ok(fs.existsSync(path.join(fonts, name)), name);
  }
  assert.doesNotMatch(fs.readFileSync(path.join(fonts, "fonts.css"), "utf8"), /https?:/);
});

test("approved UI B keeps the viewport-first alignment composition", () => {
  // Instrumenta/docs/design-references/forge3d-ui-claude-alignment-reference.png
  assert.match(renderer, /class="topbar"/);
  assert.match(renderer, /class="omnibox"/);
  assert.match(renderer, /class="run-button"/);
  assert.match(renderer, /class="stage"/);
  assert.match(renderer, /id="preview" class="viewport"/);
  assert.match(renderer, /class="toolrail"/);
  assert.match(renderer, /class="panel library"/);
  assert.match(renderer, /class="panel inspector"/);
  assert.match(renderer, /class="edge-tab"/);
  assert.match(renderer, /class="dock"/);
  assert.match(renderer, /id="pipeline"/);
  assert.match(renderer, /id="filmstrip"/);
  assert.match(renderer, /class="statusbar"/);
  assert.match(renderer, /const glyphs = \{/);
  assert.doesNotMatch(renderer, /class="app-bar"|class="pane library"|class="pane inspector"|class="production-rail"/);
  assert.match(styles, /--topbar-h: 72px/);
  assert.match(styles, /grid-template-rows: var\(--topbar-h\) minmax\(0, 1fr\) var\(--dock-h\) var\(--status-h\)/);
});

test("the pipeline dock reports the four production stages", () => {
  for (const label of ["Plan", "Build", "Check", "Output"]) {
    assert.match(renderer, new RegExp(`label: "${label}"`));
  }
  assert.match(renderer, /function pipelineStages\(/);
});

test("the Windows caption is replaced by the in-app bar without weakening isolation", () => {
  const main = fs.readFileSync(path.join(desktopRoot, "src", "main.cjs"), "utf8");
  assert.match(main, /process\.platform !== "win32"/);
  assert.match(main, /titleBarStyle: "hidden"/);
  assert.match(main, /titleBarOverlay: \{/);
  assert.match(styles, /-webkit-app-region: drag/);
  assert.match(styles, /-webkit-app-region: no-drag/);
});
