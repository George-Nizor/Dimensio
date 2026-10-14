"use strict";

const { execFile } = require("node:child_process");

const STATES = new Set(["ready", "missing", "signed_out", "degraded", "optional_missing"]);
const OFFLINE_FIX = "Reinstall Dimensio, or run `dimensio capabilities --json` in a terminal to see the error.";

// Wraps `dimensio capabilities --json`: asynchronous (a cold WSL boot takes seconds, so it must
// never run on the main thread), cached, and de-duplicated while a probe is in flight. A failed
// probe never throws; it resolves to `{ ok: false, error, fix }` so the renderer can say so. `args` may be a function,
// read at each probe, so the report can follow the chosen agent (`--agent claude`).
function createCapabilitiesService({
  command,
  args = ["capabilities", "--json"],
  env = process.env,
  cwd,
  ttlMs = 60_000,
  timeoutMs = 90_000,
  execFileImpl = execFile,
  now = Date.now,
} = {}) {
  let cache = null;
  let inflight = null;

  function run() {
    return new Promise((resolve) => {
      execFileImpl(command, typeof args === "function" ? args() : args, { env, cwd, timeout: timeoutMs, windowsHide: true, maxBuffer: 4 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          const detail = String(stderr || error.message || "").trim().split(/\r?\n/).slice(-3).join(" ");
          resolve({ ok: false, error: error.killed ? "The capability check timed out." : `The capability check failed: ${detail}`, fix: OFFLINE_FIX });
          return;
        }
        try {
          resolve({ ok: true, ...validate(JSON.parse(stdout)) });
        } catch (parseError) {
          resolve({ ok: false, error: `The capability report was not valid: ${parseError.message}`, fix: OFFLINE_FIX });
        }
      });
    });
  }

  async function get({ force = false } = {}) {
    if (!force && cache && now() - cache.at < ttlMs) return cache.value;
    if (!inflight) {
      inflight = run().then((value) => {
        if (value.ok) cache = { at: now(), value };
        inflight = null;
        return value;
      });
    }
    return inflight;
  }

  return { get, invalidate: () => { cache = null; } };
}

function validate(report) {
  if (!report || report.schema !== 1 || typeof report.capabilities !== "object" || typeof report.routes !== "object") {
    throw new Error("unexpected schema");
  }
  for (const item of Object.values(report.capabilities)) {
    if (!STATES.has(item.state)) throw new Error(`unknown state ${item.state}`);
  }
  return report;
}

module.exports = { createCapabilitiesService, validate };
