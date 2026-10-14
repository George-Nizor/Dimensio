// Screenshot harness for the Forge3D renderer. It serves a built desktop/dist (or SITE), injects a mocked
// window.dimensio bridge with invented runs, and shoots named scenes in headless Chromium (SwiftShader WebGL).
// It is a visual check, not a test: the data shapes are guesses from main.js. See README.md.
//
//   node test-tools/screenshots/harness.cjs [scene,scene,...]
//   env: SITE (built renderer, default ../../dist), OUT (default ./shots), THEME (dark|light, default dark),
//        W/H (default 1540x900), P (file name prefix), CHROMIUM (browser executable), PLAYWRIGHT_CORE (module path)
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

function loadPlaywright() {
  for (const id of [process.env.PLAYWRIGHT_CORE, "playwright-core"]) {
    if (!id) continue;
    try { return require(id); } catch { /* try the next */ }
  }
  console.error("playwright-core not found. Run: npm i --no-save --no-package-lock playwright-core (in desktop/)");
  process.exit(2);
}
function findChromium() {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const base = path.join(os.homedir(), ".cache", "ms-playwright");
  const dirs = fs.existsSync(base) ? fs.readdirSync(base).filter((n) => n.startsWith("chromium_headless_shell-")).sort().reverse() : [];
  for (const d of dirs) {
    const exe = path.join(base, d, "chrome-headless-shell-linux64", "chrome-headless-shell");
    if (fs.existsSync(exe)) return exe;
  }
  console.error("No chromium_headless_shell under ~/.cache/ms-playwright (npx playwright-core install chromium-headless-shell, or set CHROMIUM).");
  process.exit(2);
}

const { chromium } = loadPlaywright();
const root = path.resolve(__dirname, "..", "..", "..");           // repository root
const refs = path.join(root, "references");
const dir = path.resolve(process.env.SITE || path.join(__dirname, "..", "..", "dist"));
const out = path.resolve(process.env.OUT || path.join(__dirname, "shots"));
const work = fs.mkdtempSync(path.join(os.tmpdir(), "forge3d-shots-"));
fs.mkdirSync(out, { recursive: true });

// A small neutral-grey pedestal with a taller block on it, as a GLB, so the viewport lighting is judged on a
// material that has no colour of its own.
function makeGlb(file) {
  const boxes = [[-0.7, 0, -0.7, 0.7, 0.18, 0.7], [-0.3, 0.18, -0.3, 0.3, 1.1, 0.3]];
  const pos = [], nor = [], idx = [];
  for (const [x0, y0, z0, x1, y1, z1] of boxes) {
    const faces = [
      [[0, 0, 1], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
      [[0, 0, -1], [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]],
      [[1, 0, 0], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],
      [[-1, 0, 0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]],
      [[0, 1, 0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]],
      [[0, -1, 0], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
    ];
    for (const [n, ...v] of faces) {
      const b = pos.length / 3;
      for (const p of v) { pos.push(...p); nor.push(...n); }
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
  }
  const posB = Buffer.from(new Float32Array(pos).buffer), norB = Buffer.from(new Float32Array(nor).buffer), idxB = Buffer.from(new Uint16Array(idx).buffer);
  const bin = Buffer.concat([posB, norB, idxB]);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], pos[i + k]); max[k] = Math.max(max[k], pos[i + k]); }
  const json = {
    asset: { version: "2.0" }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
    materials: [{ pbrMetallicRoughness: { baseColorFactor: [0.8, 0.8, 0.8, 1], metallicFactor: 0, roughnessFactor: 0.6 } }],
    buffers: [{ byteLength: bin.length }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: posB.length }, { buffer: 0, byteOffset: posB.length, byteLength: norB.length }, { buffer: 0, byteOffset: posB.length + norB.length, byteLength: idxB.length }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: pos.length / 3, type: "VEC3", min, max },
      { bufferView: 1, componentType: 5126, count: nor.length / 3, type: "VEC3" },
      { bufferView: 2, componentType: 5123, count: idx.length, type: "SCALAR" },
    ],
  };
  let j = Buffer.from(JSON.stringify(json)); j = Buffer.concat([j, Buffer.alloc((4 - (j.length % 4)) % 4, 0x20)]);
  const b = Buffer.concat([bin, Buffer.alloc((4 - (bin.length % 4)) % 4)]);
  const head = Buffer.alloc(12); head.write("glTF", 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + j.length + 8 + b.length, 8);
  const jh = Buffer.alloc(8); jh.writeUInt32LE(j.length, 0); jh.write("JSON", 4);
  const bh = Buffer.alloc(8); bh.writeUInt32LE(b.length, 0); bh.write("BIN\0", 4);
  fs.writeFileSync(file, Buffer.concat([head, jh, j, bh, b]));
}
makeGlb(path.join(work, "model.glb"));
fs.writeFileSync(path.join(work, "val.json"), JSON.stringify({ manifold: true, triangle_budget: true, uv_overlap: false, scale_m: 1.8 }, null, 1));
fs.writeFileSync(path.join(work, "log.txt"), "[blender] building pedestal\n[blender] decimate 0.42\n[export] model.glb 4.0 KiB\n");

const types = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html", ".woff2": "font/woff2", ".png": "image/png", ".glb": "model/gltf-binary", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".map": "application/json" };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]);
  if (p === "/") p = "/workshop.html"; // the Workshop; index.html is the course app
  let f;
  if (p.startsWith("/artifacts/")) {
    const e = path.extname(p);
    f = e === ".png" ? path.join(refs, p.includes("controller") ? "game-controller-v001" : "medical-pod-v001", "reference.png")
      : e === ".glb" ? path.join(work, "model.glb") : e === ".json" ? path.join(work, "val.json") : path.join(work, "log.txt");
  } else f = path.join(dir, p);
  if (!f.startsWith(dir) && !f.startsWith(work) && !f.startsWith(refs) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(r);
});

srv.listen(0, "127.0.0.1", async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const W = +process.env.W || 1540, H = +process.env.H || 900;
  const theme = process.env.THEME === "light" ? "light" : "dark";
  const context = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: theme, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
  const page = await context.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await page.addInitScript(() => {
    const q = new URLSearchParams(location.search);
    const sc = q.get("s") || "first";
    const now = Date.now();
    const iso = (m) => new Date(now - m * 60000).toISOString();
    const arts = [
      { path: "renders/hero.png", name: "hero.png", preview_role: "primary-image", size_bytes: 812331, media_type: "image/png" },
      { path: "model.glb", name: "model.glb", preview_role: "model", size_bytes: 4008, media_type: "model/gltf-binary" },
      { path: "validation.json", name: "validation.json", preview_role: "validation", size_bytes: 220, media_type: "application/json" },
      { path: "build.log.txt", name: "build.log.txt", preview_role: "text", size_bytes: 120, media_type: "text/plain" },
      { path: "controller.png", name: "controller.png", preview_role: "image", size_bytes: 512000, media_type: "image/png" }];
    const done = { run_id: "r1", name: "Medical pod", prompt: "A sci-fi medical pod, game-ready, under 20k tris, PBR", status: "completed", workflow_route: "authored-blender", created_at: iso(90), updated_at: iso(70), artifacts: arts,
      steps: [{ name: "Route request", status: "completed" }, { name: "Model in Blender", status: "completed" }, { name: "Export GLB", status: "completed" }, { name: "Validate", status: "completed" }], validation: { manifold: true, triangle_budget: true, uv_overlap: false },
      transcript: [{ kind: "user", at: iso(90), text: "A sci-fi medical pod, game-ready" }, { kind: "agent", at: iso(80), text: "Routing to authored Blender. I will block out the pod shell first." }, { kind: "log", at: iso(75), text: "[blender] decimate 0.42" }, { kind: "error", at: iso(72), text: "UV overlap detected on lid_inner" }] };
    const running = { run_id: "r2", name: "Controller", prompt: "Game controller from this reference photo", status: "running", workflow_route: "image-to-mesh", created_at: iso(4), updated_at: iso(1), artifacts: [arts[4]],
      steps: [{ name: "Route request", status: "completed" }, { name: "Generate mesh with SPAR3D", status: "running", detail: "spar3d inference" }], transcript: [{ kind: "agent", at: iso(3), text: "Running SPAR3D on the reference." }] };
    const failed = { run_id: "r3", name: "Stump", prompt: "Mossy tree stump as a gaussian splat", status: "failed", workflow_route: "gaussian-splat", failure: "TripoSplat exited with code 1 (CUDA out of memory)", created_at: iso(60 * 26), updated_at: iso(60 * 26), artifacts: [],
      steps: [{ name: "Route request", status: "completed" }, { name: "Generate splat", status: "failed" }], transcript: [{ kind: "error", at: iso(60 * 26), text: "CUDA out of memory. Tried to allocate 2.00 GiB" }] };
    // Capability reports in the shape of docs/capabilities.md (schema 1). Each scene picks one.
    const cap = (id, label, state, extra = {}) => ({ id, label, state, reason: state === "ready" ? "" : extra.reason || "", fix: state === "ready" ? "" : extra.fix || "", version: extra.version ?? null, path: null, detail: {}, gates: extra.gates || [], optional: Boolean(extra.optional) });
    const report = (over = {}) => {
      const capabilities = {
        agent: cap("agent", "Claude Code", "ready", { version: "2.1.299", gates: ["splat", "blender"] }),
        blender: cap("blender", "Blender", "ready", { version: "5.0.1", gates: ["blender", "export"] }),
        kiri: cap("kiri", "KIRI Engine extension", "ready", { version: "3.1.0", gates: ["export"] }),
        blender_mcp: cap("blender_mcp", "Blender MCP add-on", "ready", { optional: true, gates: ["blender"] }),
        uv: cap("uv", "uv", "ready", { version: "0.8.3", optional: true, gates: ["blender"] }),
        node: cap("node", "Node.js", "ready", { version: "22.1.0", optional: true, gates: ["godot"] }),
        godot: cap("godot", "Godot 4", "ready", { version: "4.6.2", optional: true, gates: ["godot"] }),
        wsl: cap("wsl", "WSL", "ready", { version: "Ubuntu-24.04", gates: ["splat"] }),
        wsl_tools: cap("wsl_tools", "uv and git in WSL", "ready", { gates: ["splat"] }),
        cuda: cap("cuda", "NVIDIA GPU in WSL", "ready", { version: "12.9", gates: ["splat"] }),
        triposplat: cap("triposplat", "TripoSplat", "ready", { version: "a1b2c3d4e5f6", gates: ["splat"] }),
        triposplat_weights: cap("triposplat_weights", "TripoSplat weights", "ready", { gates: ["splat"] }),
        ...(over.capabilities || {}),
      };
      const route = (label, state, blocked_by = [], degraded_by = [], optional = false) => ({ label, state, optional, reason: state === "ready" ? "" : (capabilities[(blocked_by[0] || degraded_by[0])] || {}).reason || "", requires: [], soft: [], blocked_by, degraded_by });
      return { ok: true, schema: 1, forge3d_version: "0.3.0", generated_at: new Date().toISOString(), platform: { system: "windows" }, agent: { id: "claude", name: "Claude Code" }, capabilities,
        routes: over.routes || { splat: route("Gaussian splat", "ready"), blender: route("Blender", "ready"), export: route("Export", "ready"), godot: route("Godot", "ready", [], [], true) },
        versions: { forge3d: "0.3.0", agent: "2.1.299", blender: "5.0.1", godot: "4.6.2", uv: "0.8.3", node: "22.1.0", cuda: "12.9", wsl_distro: "Ubuntu-24.04", ...(over.versions || {}) } };
    };
    const route = (label, state, blocked_by = [], degraded_by = [], reason = "", optional = false) => ({ label, state, optional, reason, requires: [], soft: [], blocked_by, degraded_by });
    let capsResult = report();
    let runs = [], tools = { codex: true, blender: true, godot: true, wsl: true }, active = null, err = "", skill = { state: "ready" };
    if (["done", "image", "model", "checks", "logs", "menu", "dialog", "approval", "settings", "text"].includes(sc)) runs = [done, failed];
    if (sc === "checking") tools = {};
    if (sc === "offline") { err = "Claude Code stopped before the run finished (exit 1)."; tools = { codex: false, blender: true, godot: false, wsl: true }; }
    if (sc === "running") { runs = [{ ...running, created_at: iso(3), steps: [{ name: "Route request", status: "completed", started_at: iso(3), completed_at: iso(2.8) }, { name: "Generate mesh with SPAR3D", status: "running", detail: "spar3d inference", started_at: iso(2.6) }], artifacts: [] }, done, failed]; active = { runId: "r2" }; }
    if (sc === "failed") runs = [failed, done];
    if (sc === "blocked") {
      // Gaussian splat chosen in Run settings, and TripoSplat is not installed in WSL.
      localStorage.setItem("forge3d.runSettings.v1", JSON.stringify({ workflow: "gaussian-splat" }));
      runs = [done];
      capsResult = report({
        capabilities: {
          cuda: cap("cuda", "NVIDIA GPU in WSL", "degraded", { version: "12.9", reason: "Only 3.1 GB of VRAM is free right now (8 GB needed).", fix: "Close other GPU programs, then check again.", gates: ["splat"] }),
          triposplat: cap("triposplat", "TripoSplat", "missing", { reason: "TripoSplat is not installed in WSL.", fix: "Run `forge3d models install triposplat` in a terminal, then check again.", gates: ["splat"] }),
          triposplat_weights: cap("triposplat_weights", "TripoSplat weights", "missing", { reason: "No model weights found under TripoSplat/ckpts.", fix: "Install TripoSplat first; it downloads the weights.", gates: ["splat"] }),
          godot: cap("godot", "Godot 4", "optional_missing", { optional: true, reason: "Godot 4 was not found.", fix: "Install it from godotengine.org if you want to review assets in a game scene.", gates: ["godot"] }),
        },
        routes: { splat: route("Gaussian splat", "blocked", ["triposplat", "triposplat_weights"], ["cuda"], "TripoSplat is not installed in WSL."), blender: route("Blender", "ready"), export: route("Export", "ready"), godot: route("Godot", "blocked", ["godot"], [], "Godot 4 was not found.", true) },
        versions: { godot: null },
      });
    }
    if (sc === "signedout") {
      runs = [done];
      capsResult = report({
        capabilities: { agent: cap("agent", "Claude Code", "signed_out", { version: "2.1.299", reason: "Claude Code is installed but not signed in.", fix: "Run `claude` in a terminal and sign in with your Claude account, then press Check again.", gates: ["splat", "blender"] }) },
        routes: { splat: route("Gaussian splat", "blocked", ["agent"], [], "Claude Code is installed but not signed in."), blender: route("Blender", "blocked", ["agent"], [], "Claude Code is installed but not signed in."), export: route("Export", "ready"), godot: route("Godot", "ready", [], [], "", true) },
      });
    }
    if (sc === "degraded") {
      runs = [done];
      localStorage.setItem("forge3d.runSettings.v1", JSON.stringify({ workflow: "authored-blender" }));
      capsResult = report({
        capabilities: { blender: cap("blender", "Blender", "degraded", { version: "4.0.2", reason: "Blender 4.0.2 is older than 4.2, so extensions such as KIRI cannot load.", fix: "Install Blender 4.2 or later from blender.org.", gates: ["blender", "export"] }) },
        routes: { splat: route("Gaussian splat", "ready"), blender: route("Blender", "degraded", [], ["blender"], "Blender 4.0.2 is older than 4.2."), export: route("Export", "degraded", [], ["blender"], "Blender 4.0.2 is older than 4.2."), godot: route("Godot", "ready", [], [], "", true) },
        versions: { blender: "4.0.2" },
      });
    }
    if (sc === "ready") { runs = []; }
    if (sc === "blockedrun") { localStorage.setItem("forge3d.runSettings.v1", JSON.stringify({ workflow: "gaussian-splat" })); capsResult = report({ capabilities: { triposplat: cap("triposplat", "TripoSplat", "missing", { reason: "TripoSplat is not installed in WSL.", fix: "Run `forge3d models install triposplat` in a terminal.", gates: ["splat"] }) }, routes: { splat: route("Gaussian splat", "blocked", ["triposplat"], [], "TripoSplat is not installed in WSL."), blender: route("Blender", "ready"), export: route("Export", "ready"), godot: route("Godot", "ready", [], [], "", true) } }); runs = [done]; }
    if (sc === "capserror") {
      runs = [done];
      capsResult = { ok: false, error: "The capability check failed: 'forge3d' is not recognized as an internal or external command.", fix: "Reinstall Forge3D, or run `forge3d capabilities --json` in a terminal to see the error." };
    }
    if (sc === "stopped") { runs = [{ ...failed, run_id: "r4", status: "interrupted", failure: null, name: "Pod", prompt: "A sci-fi medical pod" }, done]; }
    if (sc === "plugin") { runs = [done]; skill = { state: "version-mismatch", installedVersion: "0.2.0", bundledVersion: "0.2.2" }; tools = { codex: true, blender: true, godot: false, wsl: true }; }
    localStorage.setItem("forge3d.panels", JSON.stringify({ library: !["first", "checking", "offline", "ready", "blockedrun"].includes(sc), inspector: true }));
    // The app loads artifacts from dimensio-artifact://<run>/<path>, a scheme only Electron serves. Map it onto the
    // harness's /artifacts/ route for fetch() (models, text) and for <img> (thumbnails, previews).
    const mapUrl = (u) => (typeof u === "string" && u.startsWith("dimensio-artifact://") ? "/artifacts/" + u.split("/").slice(3).join("/") : u);
    const realFetch = window.fetch.bind(window);
    window.fetch = (input, init) => realFetch(mapUrl(typeof input === "string" ? input : input.url ?? String(input)), init);
    const fixImg = (img) => { const m = mapUrl(img.getAttribute("src")); if (m !== img.getAttribute("src")) img.setAttribute("src", m); };
    new MutationObserver((list) => { for (const r of list) { if (r.type === "attributes") fixImg(r.target); else r.addedNodes.forEach((n) => { if (n.nodeType === 1) { if (n.tagName === "IMG") fixImg(n); n.querySelectorAll?.("img").forEach(fixImg); } }); } })
      .observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });
    const noop = () => () => {};
    // Projects: the start screen has none open; every other scene works inside one.
    const home = "C:\\Users\\George\\Documents\\Forge3D";
    const recent = [
      { path: `${home}\\Projects\\Medical pod\\Medical pod.forge3d`, name: "Medical pod", folder: `${home}\\Projects\\Medical pod`, opened_at: iso(70), missing: false },
      { path: `${home}\\Earlier runs.forge3d`, name: "Earlier runs", folder: home, opened_at: iso(60 * 30), missing: false },
      { path: "D:\\Art\\Controller\\Controller.forge3d", name: "Controller", folder: "D:\\Art\\Controller", opened_at: iso(60 * 24 * 6), missing: true },
    ];
    const project = ["start", "startempty"].includes(sc) ? null
      : { id: "p1", name: sc === "untitled" ? "Untitled project" : "Medical pod", file: sc === "untitled" ? null : recent[0].path, folder: recent[0].folder, untitled: sc === "untitled", dirty: ["untitled", "filemenu"].includes(sc), settings: {}, view: {} };
    if (sc === "untitled") runs = [done];
    const projectState = () => ({ project, runs, recent: sc === "startempty" ? [] : recent, recoverable: sc === "start" ? [{ id: "20261009T221500Z-1a2b3c4d", modified_at: iso(60 * 14) }] : [], preferences: { reopenLast: false } });
    const projectApi = { create: async () => projectState(), open: async () => projectState(), openRecovered: async () => projectState(), save: async () => projectState(), saveAs: async () => projectState(),
      close: async () => projectState(), reveal: async () => ({}), setSettings: async () => project, setView: async () => null, removeRecent: async () => projectState(), clearRecent: async () => projectState(), setPreferences: async () => projectState() };
    const agentStatuses = { agent: "claude", statuses: {
      claude: { id: "claude", name: "Claude Code", imageGeneration: false, installed: true, signedIn: sc !== "signedout", version: "2.1.299", reason: sc === "signedout" ? "Claude Code is installed but not signed in." : "", fix: sc === "signedout" ? "Run `claude` in a terminal and sign in with your Claude account, then press Check again." : "" },
      codex: { id: "codex", name: "Codex", imageGeneration: true, installed: false, signedIn: false, version: "", reason: "Codex was not found.", fix: "Install the Codex app or CLI (https://developers.openai.com/codex) and sign in, then press Check again." },
    } };
    window.dimensio = { bootstrap: async () => ({ version: "0.2.2", agent: { id: "claude", name: "Claude Code" }, activeJob: active, appServerError: err, skill, tools, runs, models: [{ id: "opus", label: "Opus" }, { id: "sonnet", label: "Sonnet" }, { id: "haiku", label: "Haiku" }], modelDefaults: { model: "opus", effort: "medium" }, ...projectState() }),
      agentStatus: async () => agentStatuses, models: async () => ({ models: [{ id: "opus", label: "Opus" }], defaultModel: "opus", defaultEffort: "medium" }), setAgent: async (id) => ({ agent: id, name: id === "codex" ? "Codex" : "Claude Code" }),
      project: projectApi, onState: noop, onEvent: noop, onApproval: (cb) => { window.__approve = cb; return () => {}; }, onError: noop, refreshTools: async () => projectState(), capabilities: async () => { await new Promise((r) => setTimeout(r, sc === "checkingcaps" ? 60000 : 150)); return capsResult; }, artifactAction: async () => ({}), pickAttachments: async () => [], continueRun: async () => ({}) };
  });
  const sel = async (s) => { await page.click(s).catch(() => console.log("miss", s)); };
  const scenes = {
    start: async () => {}, startempty: async () => {}, untitled: async () => {},
    filemenu: async () => { await sel("#file-menu"); },
    first: async () => {}, checking: async () => {}, offline: async () => {}, plugin: async () => {}, done: async () => {},
    image: async () => { await sel('[data-tab="artifacts"]'); await sel('[data-artifact-path="renders/hero.png"]'); },
    model: async () => { await sel('[data-tab="artifacts"]'); await sel('[data-artifact-path="model.glb"]'); await page.waitForTimeout(2500); },
    checks: async () => { await sel('[data-tab="validation"]'); },
    text: async () => { await sel('[data-tab="artifacts"]'); await sel('[data-artifact-path="validation.json"]'); await page.waitForTimeout(500); },
    logs: async () => { await sel('[data-tab="logs"]'); },
    running: async () => {},
    failed: async () => { await sel('[data-tab="logs"]'); },
    menu: async () => { await page.hover(".run-card"); await sel(".run-more"); },
    dialog: async () => { await page.hover(".run-card"); await sel(".run-more"); await sel('[data-menu-action="continue"]'); },
    settings: async () => { await sel("#settings-toggle"); },
    blocked: async () => { await sel("#new-run"); }, signedout: async () => { await sel("#new-run"); }, capserror: async () => { await sel("#new-run"); },
    degraded: async () => { await sel("#gate-chip"); },
    ready: async () => {}, stopped: async () => {}, checkingcaps: async () => { await sel("#new-run"); },
    blockedrun: async () => { await page.fill("#prompt", "A mossy tree stump as a gaussian splat"); await page.dispatchEvent("#send", "click"); await page.waitForTimeout(300); },
    focus: async () => { for (let i = 0; i < 4; i++) await page.keyboard.press("Tab"); },
    approval: async () => { await page.evaluate(() => window.__approve({ requestId: 1, method: "item/commandExecution/requestApproval", params: { command: "blender --background --python build_pod.py", reason: "Codex wants to run Blender headless to build the pod." } })); },
  };
  const only = process.argv[2] ? process.argv[2].split(",") : Object.keys(scenes);
  for (const n of only) {
    if (!scenes[n]) { console.log("unknown scene", n); continue; }
    await page.goto(`http://127.0.0.1:${port}/?s=${n}`);
    await page.waitForTimeout(900);
    await scenes[n]();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(out, `${process.env.P || ""}${n}.png`) });
  }
  console.log("errors", [...new Set(errs)].slice(0, 10));
  await browser.close();
  srv.close();
  fs.rmSync(work, { recursive: true, force: true });
});
