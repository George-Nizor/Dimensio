"use strict";

const { execFile, spawnSync } = require("node:child_process");

function running(child) {
  return Boolean(child && child.pid && child.exitCode === null && child.signalCode === null);
}

// Ends a process and everything it started (MCP servers, shell commands, Blender). On Windows that is
// `taskkill /T /F`; elsewhere the process was spawned in its own group (detached), so the group gets SIGTERM and,
// if it is still there after `graceMs`, SIGKILL. Resolves once the process has exited, or after `timeoutMs`.
function killTree(child, { platform = process.platform, execFileImpl = execFile, graceMs = 3000, timeoutMs = 8000 } = {}) {
  if (!running(child)) return Promise.resolve(false);
  return new Promise((resolve) => {
    let settled = false;
    const timers = [];
    const finish = (value) => {
      if (settled) return;
      settled = true;
      timers.forEach(clearTimeout);
      resolve(value);
    };
    child.once("exit", () => finish(true));
    timers.push(setTimeout(() => finish(false), timeoutMs));
    if (platform === "win32") {
      execFileImpl("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true }, (error) => {
        if (error && running(child)) {
          try { child.kill(); } catch { /* already gone */ }
        }
      });
      return;
    }
    const signal = (name) => {
      try { process.kill(-child.pid, name); } catch {
        try { child.kill(name); } catch { /* already gone */ }
      }
    };
    signal("SIGTERM");
    timers.push(setTimeout(() => { if (running(child)) signal("SIGKILL"); }, graceMs));
  });
}

// The same, without waiting, for when the app is quitting and nothing after this line will run.
function killTreeSync(child, { platform = process.platform, spawnSyncImpl = spawnSync } = {}) {
  if (!running(child)) return false;
  if (platform === "win32") {
    const result = spawnSyncImpl("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, timeout: 5000 });
    if (result.status !== 0) { try { child.kill(); } catch { /* already gone */ } }
    return true;
  }
  try { process.kill(-child.pid, "SIGTERM"); } catch {
    try { child.kill("SIGTERM"); } catch { /* already gone */ }
  }
  return true;
}

module.exports = { killTree, killTreeSync, running };
