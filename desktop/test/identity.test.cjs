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

test("the sheet is restylable from :root: no colour literal outside the token blocks", () => {
  const body = styles.slice(styles.indexOf("/* ── primitives"));
  const withoutUrls = body.replace(/url\([^)]*\)/g, "");
  assert.deepEqual(withoutUrls.match(/rgba?\(|hsla?\(|(?<![\w%-])#[0-9a-fA-F]{3,8}\b(?=[;\s,)])/g) || [], []);
});

test("brand v2 surfaces: opaque ink-outlined objects with a hard extrusion, no glass, glow, gradient or ambient motion", () => {
  assert.doesNotMatch(styles, /backdrop-filter/);
  assert.doesNotMatch(styles, /(?<!-)(?:linear|radial|conic)-gradient\((?![^;]*var\(--muted\))/);
  assert.doesNotMatch(styles, /animation:[^;]*infinite/);
  assert.doesNotMatch(styles, /text-transform:\s*uppercase/);
  assert.doesNotMatch(styles, /letter-spacing:\s*\.(?:[1-9]\d?)em/);
  assert.match(styles, /--obj-border: 2px solid var\(--outline\)/);
  assert.match(styles, /--obj-shadow: 3px 4px 0 var\(--extrude\)/);
  assert.match(styles, /translate\(3px, 4px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /:focus-visible \{ outline: 2px solid var\(--accent-text\)/);
  assert.doesNotMatch(renderer, /toUpperCase\(\)\}|empty-glow/);
});

test("themes: dark default on the family neutrals, a derived light, following the system until chosen", () => {
  assert.match(styles, /color-scheme: light dark/);
  assert.match(styles, /--fam-ink: #0d0c0a/);
  assert.match(styles, /--fam-surface: #141210/);
  assert.match(styles, /--fam-raised: #1d1a17/);
  assert.match(styles, /--fam-line: #352f29/);
  assert.match(styles, /--fam-text: #f2ede6/);
  assert.match(styles, /--fam-muted: #a39a90/);
  assert.match(styles, /--accent-deep: #7d331b/);
  assert.match(styles, /--accent-text: light-dark\(var\(--accent-deep\), var\(--accent\)\)/);
  assert.match(styles, /:root\[data-theme="light"\] \{ color-scheme: light; \}/);
  assert.match(renderer, /forge3d\.theme/);
  assert.match(renderer, /id="theme-toggle"/);
});

test("body text meets 4.5:1 on every surface in both themes", () => {
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  const token = (name, side) => {
    const value = styles.match(new RegExp(`--${name}: light-dark\\(([^;]+)\\);`))[1];
    const [light, dark] = value.split(/,(?![^(]*\))/).map((part) => part.trim());
    const pick = side === "light" ? light : dark;
    return pick.startsWith("var(--") ? styles.match(new RegExp(`--${pick.slice(6, -1)}: (#[0-9a-f]{6})`))[1] : pick;
  };
  const surfaces = ["bar", "panel", "well", "raised", "raised-hover"];
  for (const side of ["light", "dark"]) {
    for (const text of ["text", "text-2", "muted", "ok", "warn", "danger"]) {
      for (const surface of surfaces) {
        assert.ok(ratio(token(text, side), token(surface, side)) >= 4.5, `${side}: ${text} on ${surface}`);
      }
    }
  }
  assert.ok(ratio(token("accent-text", "light") , token("panel", "light")) >= 4.5);
  assert.ok(ratio("#ee7752", token("panel", "dark")) >= 4.5);
});

test("no invented tool versions in the status bar", () => {
  assert.doesNotMatch(renderer, /" 4\.5"|" 4\.4"/);
  assert.match(renderer, /state\.toolVersions\?\./);
});
