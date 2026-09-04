export const DEFAULT_RUN_SETTINGS = Object.freeze({
  workflow: "auto",
  quality: "production",
  target: "splat",
  tool: "auto",
  model: "auto",
  effort: "auto",
});

const ALLOWED = Object.freeze({
  workflow: new Set(["auto", "authored-blender", "image-to-mesh", "gaussian-splat", "process", "rig", "animate", "retarget", "validate"]),
  quality: new Set(["draft", "balanced", "production"]),
  target: new Set(["glb", "gltf", "blend", "fbx", "obj", "ply", "stl", "usd", "splat", "gif"]),
  tool: new Set(["auto", "blender", "triposplat", "spar3d"]),
  effort: new Set(["auto", "low", "medium", "high", "xhigh"]),
});

export function normalizeRunSettings(value = {}) {
  const result = { ...DEFAULT_RUN_SETTINGS };
  for (const key of ["workflow", "quality", "target", "tool", "effort"]) {
    if (typeof value[key] === "string" && ALLOWED[key].has(value[key])) result[key] = value[key];
  }
  if (typeof value.model === "string" && value.model.trim() && value.model.length <= 160) result.model = value.model.trim();
  return result;
}

export function readRunSettings(storage, key = "forge3d.runSettings.v1") {
  try {
    const raw = storage?.getItem?.(key);
    return normalizeRunSettings(raw ? JSON.parse(raw) : {});
  } catch {
    return { ...DEFAULT_RUN_SETTINGS };
  }
}

export function writeRunSettings(storage, value, key = "forge3d.runSettings.v1") {
  const normalized = normalizeRunSettings(value);
  try { storage?.setItem?.(key, JSON.stringify(normalized)); } catch { /* preferences are optional */ }
  return normalized;
}
