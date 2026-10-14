"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const MESH_FORMATS = Object.freeze([
  { id: "blend", label: "Blender source (.blend)" },
  { id: "glb", label: "Binary glTF (.glb)" },
  { id: "gltf", label: "glTF package (.gltf)" },
  { id: "fbx", label: "FBX (.fbx)" },
  { id: "obj", label: "Wavefront OBJ (.obj)" },
  { id: "ply", label: "Polygon PLY (.ply)" },
  { id: "stl", label: "STL (.stl)" },
  { id: "usd", label: "Universal Scene Description (.usd)" },
]);
const GAUSSIAN_FORMATS = Object.freeze([
  { id: "blend", label: "Editable Blender splat package (.blend)" },
]);
const MESH_INPUTS = new Set([".blend", ".glb", ".gltf", ".fbx", ".obj", ".ply", ".stl", ".usd", ".usda", ".usdc"]);

function safeStem(value) {
  return path.basename(value, path.extname(value)).replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
}

function isGaussianArtifact(artifact) {
  const suffix = path.extname(String(artifact?.path || "")).toLowerCase();
  return artifact?.preview_role === "gaussian-splat" || [".splat", ".sog", ".spz", ".ksplat"].includes(suffix);
}

function exportFormatsForArtifact(artifact) {
  if (!artifact?.path) return [];
  if (isGaussianArtifact(artifact)) return [...GAUSSIAN_FORMATS];
  return MESH_INPUTS.has(path.extname(artifact.path).toLowerCase()) ? [...MESH_FORMATS] : [];
}

function createVersionedDirectory(runDirectory, stem, format) {
  const root = path.join(runDirectory, "exports");
  fs.mkdirSync(root, { recursive: true });
  for (let version = 1; version <= 9999; version += 1) {
    const name = `${safeStem(stem)}-${format}-v${String(version).padStart(3, "0")}`;
    const candidate = path.join(root, name);
    try {
      fs.mkdirSync(candidate);
      return candidate;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
  throw new Error("Dimensio could not reserve a versioned export folder");
}

function siblingGaussianPly(source) {
  if (path.extname(source).toLowerCase() === ".ply") return source;
  const exact = path.join(path.dirname(source), `${path.basename(source, path.extname(source))}.ply`);
  if (fs.existsSync(exact)) return exact;
  const fallback = fs.readdirSync(path.dirname(source))
    .filter((name) => path.extname(name).toLowerCase() === ".ply")
    .sort()[0];
  if (!fallback) throw new Error("This splat has no source PLY. Preserve the TripoSplat PLY output to create a Blender package.");
  return path.join(path.dirname(source), fallback);
}

function runBlender(blender, args, { spawnProcess = spawn, timeoutMs = 15 * 60 * 1000 } = {}) {
  return new Promise((resolve, reject) => {
    let output = "";
    let settled = false;
    const child = spawnProcess(blender, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    const append = (value) => { output = `${output}${String(value)}`.slice(-1024 * 1024); };
    child.stdout?.on("data", append);
    child.stderr?.on("data", append);
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(Object.assign(new Error("Blender export timed out"), { output }));
    }, timeoutMs);
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      error.output = output;
      reject(error);
    });
    child.once("exit", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) resolve(output);
      else reject(Object.assign(new Error(`Blender export exited with code ${code}`), { output }));
    });
  });
}

async function exportArtifact({ source, artifact, runDirectory, format, blender, toolkitRoot, spawnProcess = spawn }) {
  if (!blender || !fs.existsSync(blender)) throw new Error("Blender was not detected");
  const formats = exportFormatsForArtifact(artifact);
  if (!formats.some((item) => item.id === format)) throw new Error("That export format is not valid for this artifact");
  const gaussian = isGaussianArtifact(artifact);
  const input = gaussian ? siblingGaussianPly(source) : source;
  const script = path.join(toolkitRoot, "blender", gaussian ? "import_gaussian_splat.py" : "export_asset.py");
  if (!fs.existsSync(script)) throw new Error(`The reviewed Blender export script is missing: ${script}`);
  const outputDirectory = createVersionedDirectory(runDirectory, artifact.name || source, format);
  const output = path.join(outputDirectory, `${safeStem(artifact.name || source)}.${format}`);
  const report = path.join(outputDirectory, "export-report.json");
  const args = ["--background", "--python", script, "--", input, output, report];
  let log = "";
  try {
    log = await runBlender(blender, args, { spawnProcess });
  } catch (error) {
    fs.writeFileSync(path.join(outputDirectory, "export.log"), `${error.output || ""}\n${error.message}\n`, "utf8");
    throw error;
  }
  fs.writeFileSync(path.join(outputDirectory, "export.log"), log, "utf8");
  if (!fs.existsSync(output) || fs.statSync(output).size === 0) throw new Error("Blender reported success but produced no export");
  if (!fs.existsSync(report)) throw new Error("Blender reported success but produced no export report");
  let reportData;
  try { reportData = JSON.parse(fs.readFileSync(report, "utf8")); }
  catch { throw new Error("Blender produced an invalid export report"); }
  if (reportData.status !== "completed") throw new Error("Blender did not validate the exported file");
  return {
    format,
    path: output,
    relativePath: path.relative(runDirectory, output).split(path.sep).join("/"),
    report: path.relative(runDirectory, report).split(path.sep).join("/"),
  };
}

module.exports = { exportArtifact, exportFormatsForArtifact, isGaussianArtifact };
