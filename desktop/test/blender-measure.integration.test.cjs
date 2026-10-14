"use strict";

// Runs Dimensio's Blender scripts against a real Blender 5.2: builds every
// starter scene and measures known models. On Windows it uses findBlender;
// under WSL it runs the Windows Blender and hands it Windows paths through
// wslpath. It skips when no Blender 5.2 is found. Set DIMENSIO_TEST_BLENDER
// to point at one, DIMENSIO_SKIP_BLENDER=1 to skip, and
// DIMENSIO_KEEP_ARTIFACTS=1 to keep the files it makes and print where.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const zlib = require("node:zlib");
const { execFileSync, spawnSync } = require("node:child_process");
const { findBlender, makeStarter, measure } = require("../src/lib/blender-measure.cjs");

const WSL_BLENDER = "/mnt/c/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe";

function blenderVersion(executable) {
  const result = spawnSync(executable, ["--version"], { encoding: "utf8", timeout: 30000 });
  const match = /Blender\s+(\d+)\.(\d+)/.exec(`${result.stdout || ""}`);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function locateBlender() {
  if (process.env.DIMENSIO_SKIP_BLENDER === "1") return null;
  if (process.platform === "win32") {
    const found = findBlender();
    return found.ok ? { path: found.path, translate: (value) => value } : null;
  }
  const wsl = spawnSync("wslpath", ["-w", "/"], { encoding: "utf8" });
  if (wsl.status !== 0) return null;
  const candidate = [process.env.DIMENSIO_TEST_BLENDER, WSL_BLENDER].find((item) => item && fs.existsSync(item));
  if (!candidate) return null;
  const version = blenderVersion(candidate);
  if (!version || version[0] < 5 || (version[0] === 5 && version[1] < 2)) return null;
  const translate = (value) => {
    if (fs.existsSync(value)) return execFileSync("wslpath", ["-w", value], { encoding: "utf8" }).trim();
    const folder = execFileSync("wslpath", ["-w", path.dirname(value)], { encoding: "utf8" }).trim();
    return `${folder}\\${path.basename(value)}`;
  };
  return { path: candidate, translate };
}

const blender = locateBlender();
const skip = blender ? false : "no Blender 5.2 here (set DIMENSIO_TEST_BLENDER to blender.exe)";

// A plain RGBA PNG, for the reference pictures.
function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function writePng(file, width, height, paint) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) raw.set(paint(x, y), y * (width * 4 + 1) + 1 + x * 4);
  }
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 6, 0, 0, 0], 8);
  fs.writeFileSync(file, Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]));
}

function figure(file, width, height, across) {
  writePng(file, width, height, (x, y) => {
    const inside = ((x - width / 2) / (across * width)) ** 2 + ((y - height * 0.55) / (0.42 * height)) ** 2 < 1;
    return inside ? [60, 70, 90, 255] : [255, 255, 255, 255];
  });
}

// Blender's 2 m cube as a Y-up OBJ, which the importer turns Z-up.
function writeCubeObj(file) {
  const corners = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push([x, y, z]);
  const index = (x, y, z) => corners.findIndex((c) => c[0] === x && c[1] === y && c[2] === z) + 1;
  const faces = [
    [index(-1, -1, -1), index(1, -1, -1), index(1, 1, -1), index(-1, 1, -1)],
    [index(-1, -1, 1), index(-1, 1, 1), index(1, 1, 1), index(1, -1, 1)],
    [index(-1, -1, -1), index(-1, -1, 1), index(1, -1, 1), index(1, -1, -1)],
    [index(-1, 1, -1), index(1, 1, -1), index(1, 1, 1), index(-1, 1, 1)],
    [index(-1, -1, -1), index(-1, 1, -1), index(-1, 1, 1), index(-1, -1, 1)],
    [index(1, -1, -1), index(1, -1, 1), index(1, 1, 1), index(1, 1, -1)],
  ];
  const lines = ["o ReferenceCube", ...corners.map(([x, y, z]) => `v ${x} ${z} ${-y}`), ...faces.map((face) => `f ${face.join(" ")}`)];
  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

function isPng(file) {
  return fs.readFileSync(file).subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
}

function mesh(report, name) {
  const found = report.objects.find((item) => item.name === name);
  assert.ok(found, `no object ${name} in ${report.objects.map((item) => item.name).join(", ")}`);
  return found;
}

test("Dimensio's Blender scripts against a real Blender", { skip, timeout: 10 * 60 * 1000 }, async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio blender "));
  if (process.env.DIMENSIO_KEEP_ARTIFACTS === "1") t.diagnostic(`artifacts kept in ${root}`);
  else t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const common = { blenderPath: blender.path, translatePath: blender.translate, timeoutMs: 180 * 1000 };
  const starters = path.join(root, "starters");
  const starter = (starterId, options = {}) => makeStarter({ ...common, starterId, outFile: path.join(starters, `${starterId}.blend`), options });
  const check = (file, name, extra = {}) => measure({ ...common, file, outDir: path.join(root, "checks", name), ...extra });

  const front = path.join(root, "pictures", "front view.png");
  const side = path.join(root, "pictures", "side view.png");
  fs.mkdirSync(path.dirname(front), { recursive: true });
  figure(front, 128, 256, 0.4);
  figure(side, 96, 256, 0.3);
  const cubeObj = path.join(root, "models", "reference cube.obj");
  fs.mkdirSync(path.dirname(cubeObj), { recursive: true });
  writeCubeObj(cubeObj);

  await t.test("builds every starter", async () => {
    const built = [
      await starter("empty-scene"),
      await starter("fix-ngons"),
      await starter("unapplied-scale"),
      await starter("reference-images", { imageFront: front, imageSide: side, height: 1.8 }),
      await starter("copy-reference", { reference: cubeObj }),
    ];
    for (const file of built) assert.ok(fs.statSync(file).size > 1000, `${file} is empty`);
    await assert.rejects(starter("fix-ngons"), { code: "exists" });
    await assert.rejects(
      makeStarter({ ...common, starterId: "reference-images", outFile: path.join(starters, "no-pictures.blend") }),
      (error) => error.code === "starter-error" && /needs --image-front, --image-side or both/.test(error.message),
    );
  });

  await t.test("measures the fix-ngons stool", async () => {
    const report = await check(path.join(starters, "fix-ngons.blend"), "fix-ngons", { views: ["persp"] });
    const stool = mesh(report, "Stool");
    assert.deepEqual(
      [stool.verts, stool.edges, stool.faces, stool.tris, stool.quads, stool.ngons],
      [56, 84, 39, 86, 37, 2],
    );
    assert.equal(stool.nonManifoldEdges, 4);
    assert.equal(stool.doubles, 8);
    assert.equal(stool.looseVerts, 0);
    assert.equal(stool.looseEdges, 0);
    assert.equal(stool.flippedFaces, 0);
    assert.equal(stool.shading, "flat");
    assert.equal(report.totals.ngons, 2);
    assert.equal(report.totals.meshes, 1);
    assert.ok(isPng(report.renders.persp));
  });

  await t.test("measures the default cube and renders four views", async () => {
    const report = await check(path.join(starters, "empty-scene.blend"), "cube");
    assert.equal(report.format, 1);
    assert.match(report.blender, /^5\.2\./);
    assert.equal(report.units.system, "METRIC");
    const cube = mesh(report, "Cube");
    assert.equal(cube.verts, 8);
    assert.equal(cube.quads, 6);
    assert.equal(cube.tris, 12);
    assert.equal(cube.ngons, 0);
    assert.equal(cube.nonManifoldEdges, 0);
    assert.equal(cube.scaleApplied, true);
    assert.equal(cube.rotationApplied, true);
    assert.deepEqual(cube.dimensions, [2, 2, 2]);
    assert.deepEqual(mesh(report, "Camera"), { name: "Camera", type: "CAMERA" });
    for (const view of ["front", "right", "top", "persp"]) {
      assert.ok(path.isAbsolute(report.renders[view]));
      assert.ok(isPng(report.renders[view]), `${view} render is not a PNG`);
    }
    assert.equal(report.silhouette, undefined);
    t.diagnostic(`cube check took ${report.timing.total} s inside Blender`);
  });

  await t.test("reads the other starters as their docstrings say", async () => {
    const shelf = mesh(await check(path.join(starters, "unapplied-scale.blend"), "unapplied-scale", { views: ["persp"] }), "Shelf");
    assert.equal(shelf.scaleApplied, false);
    assert.deepEqual(shelf.modifiers, ["BEVEL"]);
    assert.deepEqual(shelf.dimensions, [2, 0.6, 0.24]);
    const pictures = await check(path.join(starters, "reference-images.blend"), "reference-images", { views: ["front"] });
    assert.deepEqual(pictures.objects.map((item) => item.name).sort(), ["Camera", "Cube", "Light"]);
    const copy = await check(path.join(starters, "copy-reference.blend"), "copy-reference", { views: ["front"] });
    assert.equal(copy.totals.meshes, 0);
    assert.deepEqual(copy.renders, {});
  });

  const cube = path.join(starters, "empty-scene.blend");

  await t.test("a cube twice the size matches the cube far below 1", async () => {
    const doubled = path.join(root, "models", "cube x2.blend");
    const made = spawnSync(blender.path, [
      "-b", "--factory-startup", blender.translate(cube), "--python-expr",
      "import bpy, sys; bpy.data.objects['Cube'].scale = (2, 2, 2); bpy.ops.wm.save_as_mainfile(filepath=sys.argv[sys.argv.index('--') + 1])",
      "--", blender.translate(doubled),
    ], { encoding: "utf8", timeout: 120000 });
    assert.equal(made.status, 0, made.stdout + made.stderr);
    const report = await check(doubled, "cube-x2", { reference: cube, views: ["front", "right", "top"] });
    assert.equal(mesh(report, "Cube").scaleApplied, false);
    assert.ok(report.silhouette.front.match < 0.5, `front match ${report.silhouette.front.match}`);
    assert.ok(Math.abs(report.silhouette.front.match - 0.25) < 0.03, `front match ${report.silhouette.front.match}`);
    for (const view of ["front", "right", "top"]) assert.ok(isPng(report.silhouette[view].overlay));
    assert.deepEqual(report.reference.size, [2, 2, 2]);
  });

  await t.test("the cube matches itself", async () => {
    const report = await check(cube, "cube-self", { reference: cube, views: ["front", "right", "top"] });
    for (const view of ["front", "right", "top"]) {
      assert.ok(report.silhouette[view].match > 0.98, `${view} match ${report.silhouette[view].match}`);
    }
  });

  await t.test("the cube matches the same cube imported from an OBJ", async () => {
    const report = await check(cube, "cube-obj", { reference: cubeObj, views: ["front", "top"] });
    for (const view of ["front", "top"]) {
      assert.ok(report.silhouette[view].match > 0.98, `${view} match ${report.silhouette[view].match}`);
    }
  });
});
