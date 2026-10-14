"use strict";

// How an agent's tool calls become the run's steps. Both drivers report tool calls in the Codex item vocabulary
// (commandExecution, mcpToolCall, fileChange, ...), so one mapping serves both. Pure, so it is tested directly.

const VISIBLE_ITEM_TYPES = new Set(["commandExecution", "mcpToolCall", "fileChange", "dynamicToolCall", "imageGeneration", "webSearch"]);

function describeItem(item) {
  if (Array.isArray(item.command)) return item.command.join(" ");
  if (typeof item.command === "string") return item.command;
  if (item.type === "mcpToolCall") return [item.server, item.tool].filter(Boolean).join(" · ") || "MCP tool";
  if (item.type === "fileChange") return `${item.changes?.length || 0} file change${item.changes?.length === 1 ? "" : "s"}`;
  return item.name || item.type || "Work";
}

function presentItem(item) {
  const raw = describeItem(item);
  const lower = raw.toLowerCase();
  if (item.type === "imageGeneration") return { phase: "reference", name: "Prepare reference", detail: "Creating the source image" };
  if (item.type === "fileChange") return { phase: "package", name: "Package deliverables", detail: "Saving generated files" };
  if (/triposplat|models run|gaussian|candidate\.(splat|ply)/.test(lower)) return { phase: "generate", name: "Generate asset", detail: "Generating the Gaussian splat locally" };
  if (/validat|report|quality check|doctor/.test(lower)) return { phase: "validate", name: "Check quality", detail: "Checking output quality" };
  if (/export|proxy|collision|save|convert/.test(lower)) return { phase: "package", name: "Package deliverables", detail: "Preparing reusable output files" };
  if (/blender|procedural|dimensio_task/.test(lower)) return { phase: "generate", name: "Generate asset", detail: "Building the asset in Blender" };
  return { phase: "local", name: "Local processing", detail: item.type === "mcpToolCall" ? "Using a local 3D tool" : "Running a local production task" };
}

// Applies one tool event to a run manifest's steps. phase is "started" or "completed". Returns false for items
// the run view does not show (reading files, loading the skill), so the caller can skip them.
function applyStep(manifest, phase, item, at = new Date().toISOString()) {
  if (!item?.id || !VISIBLE_ITEM_TYPES.has(item.type)) return false;
  manifest.steps ||= [];
  let step = manifest.steps.find((candidate) => candidate.item_id === item.id);
  if (!step) {
    step = { item_id: item.id, name: item.type || "work", status: "running", started_at: at };
    manifest.steps.push(step);
  }
  const presented = presentItem(item);
  step.status = phase === "completed" ? (item.status || "completed") : (item.status || "running");
  step.phase = presented.phase;
  step.name = presented.name;
  step.detail = presented.detail;
  if (phase === "completed") step.completed_at = at;
  return true;
}

module.exports = { VISIBLE_ITEM_TYPES, applyStep, describeItem, presentItem };
