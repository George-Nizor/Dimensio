"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { resolveContained } = require("./path-policy.cjs");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const MEDIA_TYPES = new Map([
  [".blend", "application/x-blender"],
  [".gif", "image/gif"],
  [".fbx", "application/octet-stream"],
  [".glb", "model/gltf-binary"],
  [".gltf", "model/gltf+json"],
  [".json", "application/json"],
  [".obj", "model/obj"],
  [".log", "text/plain"],
  [".md", "text/markdown"],
  [".ply", "application/x-ply"],
  [".sog", "application/x-gaussian-splat"],
  [".splat", "application/x-gaussian-splat"],
  [".spz", "application/x-gaussian-splat"],
  [".ksplat", "application/x-gaussian-splat"],
  [".stl", "model/stl"],
  [".txt", "text/plain"],
  [".usd", "model/vnd.usd"],
  [".usda", "model/vnd.usda"],
  [".usdc", "model/vnd.usdc"],
  [".webp", "image/webp"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
]);

function isGaussianPly(absolutePath) {
  if (!absolutePath || !fs.existsSync(absolutePath)) return false;
  const descriptor = fs.openSync(absolutePath, "r");
  try {
    const buffer = Buffer.alloc(65536);
    const length = fs.readSync(descriptor, buffer, 0, buffer.length, 0);
    const header = buffer.subarray(0, length).toString("ascii").split("end_header", 1)[0];
    return /property float opacity/m.test(header)
      && /property float scale_0/m.test(header)
      && /property float rot_0/m.test(header)
      && /property float f_dc_0/m.test(header);
  } finally {
    fs.closeSync(descriptor);
  }
}

function classify(relativePath, absolutePath = null) {
  const extension = path.extname(relativePath).toLowerCase();
  const lower = relativePath.toLowerCase();
  let previewRole = "metadata";
  if (IMAGE_EXTENSIONS.has(extension)) previewRole = lower.includes("preview") ? "primary-image" : "image";
  else if (extension === ".gif") previewRole = "animation";
  else if ([".splat", ".sog", ".spz", ".ksplat"].includes(extension) || (extension === ".ply" && isGaussianPly(absolutePath))) previewRole = "gaussian-splat";
  else if ([".blend", ".glb", ".gltf", ".fbx", ".obj", ".ply", ".stl", ".usd", ".usda", ".usdc"].includes(extension)) previewRole = "model";
  else if (extension === ".json" && lower.includes("validation")) previewRole = "validation";
  else if ([".json", ".log", ".md", ".txt"].includes(extension)) previewRole = "text";
  return {
    media_type: MEDIA_TYPES.get(extension) || "application/octet-stream",
    preview_role: previewRole,
  };
}

function walk(root, current = root, depth = 0) {
  if (depth > 8) return [];
  const files = [];
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (["attachments", ".archive", ".trash"].includes(entry.name)) continue;
    const absolute = resolveContained(root, path.join(path.relative(root, current), entry.name));
    const stat = fs.lstatSync(absolute);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) files.push(...walk(root, absolute, depth + 1));
    else if (stat.isFile() && entry.name !== "run.json" && !/^run\.json\..*\.tmp$/i.test(entry.name) && !/\.(tmp|partial)$/i.test(entry.name)) files.push(absolute);
  }
  return files;
}

function scanArtifacts(runRoot, workflowRoute = "prompt") {
  const root = path.resolve(runRoot);
  const files = walk(root);
  const artifacts = files.map((absolute) => {
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    return {
      name: path.basename(relative),
      path: relative,
      workflow_route: workflowRoute,
      size_bytes: fs.statSync(absolute).size,
      ...classify(relative, absolute),
    };
  });

  const groups = new Map();
  for (const artifact of artifacts) {
    if (!IMAGE_EXTENSIONS.has(path.extname(artifact.path).toLowerCase())) continue;
    const directory = path.posix.dirname(artifact.path);
    if (directory === ".") continue;
    if (!groups.has(directory)) groups.set(directory, []);
    groups.get(directory).push(artifact.path);
  }
  for (const [directory, frames] of groups) {
    if (frames.length < 2) continue;
    frames.sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
    artifacts.unshift({
      name: `${path.posix.basename(directory)} sequence`,
      path: frames[0],
      frames,
      media_type: "application/x-image-sequence",
      preview_role: "image-sequence",
      workflow_route: workflowRoute,
      size_bytes: frames.reduce((total, frame) => total + fs.statSync(resolveContained(root, frame)).size, 0),
    });
  }
  return artifacts;
}

module.exports = { classify, scanArtifacts };