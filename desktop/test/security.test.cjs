"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const main = fs.readFileSync(path.join(__dirname, "..", "src", "main.cjs"), "utf8");
const preload = fs.readFileSync(path.join(__dirname, "..", "src", "preload.cjs"), "utf8");
// workshop.html is the Workshop; index.html is the course app.
const html = fs.readFileSync(path.join(__dirname, "..", "workshop.html"), "utf8");
const courseHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const renderer = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "main.js"), "utf8");

test("Electron renderer is isolated and permissions default to deny", () => {
  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /sandbox:\s*true/);
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /corsEnabled:\s*true/);
  assert.match(main, /setPermissionRequestHandler\([^\n]+callback\(false\)/);
  // No window is ever opened; an https link is handed to the system browser and the request denied.
  assert.match(main, /setWindowOpenHandler\(\(\{ url \}\) => \{ openHttps\(shell, url\); return \{ action: "deny" \}; \}\)/);
});

test("preload exposes narrow named operations without raw ipcRenderer", () => {
  assert.match(preload, /contextBridge\.exposeInMainWorld\("dimensio"/);
  // One object for both pages: the Workshop's calls and the course bridge.
  assert.equal(preload.match(/exposeInMainWorld\(/g).length, 1);
  assert.doesNotMatch(preload, /exposeInMainWorld\([^]*ipcRenderer\s*[,}]/);
  assert.doesNotMatch(preload, /\b(readFile|writeFile|rename|rm|unlink)\s*:/);
});

test("desktop runs are local-only and expose no cloud provider controls", () => {
  const codex = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "agents", "codex.cjs"), "utf8");
  assert.equal(codex.includes("allowNetwork: false"), true);
  // Claude Code gets no web tools: --tools names only the shell, the file tools and Skill.
  const { buildClaudeArgs } = require("../src/lib/agents/claude.cjs");
  const args = buildClaudeArgs({ model: "opus", effort: "medium", mcpConfigFile: "m", pluginDir: "p", runDir: "/r", sessionId: "s", platform: "win32" });
  assert.doesNotMatch(args[args.indexOf("--tools") + 1], /Web/);
  assert.doesNotMatch(args[args.indexOf("--allowedTools") + 1], /Web/);
  assert.doesNotMatch(renderer, /tripo-cloud|cloud-approved|cloud execution/i);
});

test("CSP rejects remote scripts and allows only the contained artifact scheme", () => {
  assert.match(html, /script-src 'self'/);
  assert.match(html, /object-src 'none'/);
  assert.match(html, /dimensio-artifact:/);
  assert.doesNotMatch(html, /https:/);
});

test("the course app's policy allows YouTube's privacy-enhanced player and nothing else remote", () => {
  const policy = courseHtml.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.match(policy, /script-src 'self';/);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /frame-src https:\/\/www\.youtube-nocookie\.com;/);
  assert.equal(policy.match(/https?:/g).length, 1);
  assert.doesNotMatch(policy, /'unsafe-eval'|'wasm-unsafe-eval'|dimensio-artifact|data:/);
});

test("pages are served from the app scheme, not from files, and lesson videos are told the app id", () => {
  assert.match(main, /APP_PRIVILEGES/);
  assert.match(main, /registerAppProtocol\(\{ protocol, net, session: session\.defaultSession,/);
  assert.match(main, /loadURL\(`\$\{APP_ORIGIN\}\/index\.html`\)/);
  assert.doesNotMatch(main, /loadFile\(/);
});

test("the WebAssembly grant stays narrow enough for the bundled splat renderer only", () => {
  // Assert the policy itself, not the surrounding markup, so comments cannot mask a widened grant.
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  // Spark compiles its inlined WASM from a data: URL, which needs both grants below.
  assert.match(policy, /script-src 'self' 'wasm-unsafe-eval'/);
  assert.match(policy, /connect-src 'self' data:/);
  // The narrow WASM grant must never become a general eval grant, and nothing may go remote.
  assert.doesNotMatch(policy, /'unsafe-eval'/);
  assert.doesNotMatch(policy, /script-src[^;]*(http:|https:|\*)/);
  assert.doesNotMatch(policy, /connect-src[^;]*(https:|http:\/\/(?!127\.0\.0\.1))/);
});