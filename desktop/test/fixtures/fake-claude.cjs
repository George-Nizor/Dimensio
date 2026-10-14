#!/usr/bin/env node
"use strict";

// A stand-in for `claude` that replays a recorded stream-json session (fixtures/claude/*.json). Steps:
//   { "emit": {...} }        write one stdout line
//   { "await": "user" }      wait for the next stdin line
//   { "await": "eof" }       wait until stdin closes
//   { "stderr": "text" }     write to stderr
//   { "exit": 0 }            exit with that code
//   { "hang": true }         stop and wait to be killed
// A scenario may hold "whenResume": [steps] used instead when --resume is on the command line.
// FAKE_CLAUDE_LOG names a file that gets the argv, the working directory and every stdin line.

const fs = require("node:fs");
const readline = require("node:readline");

const argv = process.argv.slice(2);
const log = process.env.FAKE_CLAUDE_LOG;
const record = (entry) => { if (log) fs.appendFileSync(log, `${JSON.stringify(entry)}\n`); };

if (argv[0] === "--version") {
  process.stdout.write("2.1.299 (Claude Code)\n");
  process.exit(0);
}
if (argv[0] === "auth" && argv[1] === "status") {
  const signedIn = process.env.FAKE_CLAUDE_SIGNED_IN !== "0";
  process.stdout.write(`${JSON.stringify({ loggedIn: signedIn, authMethod: signedIn ? "claude.ai" : "none" }, null, 2)}\n`);
  process.exit(signedIn ? 0 : 1);
}

record({ argv, cwd: process.cwd() });
const scenario = JSON.parse(fs.readFileSync(process.env.FAKE_CLAUDE_SCENARIO, "utf8"));
const steps = argv.includes("--resume") && scenario.whenResume ? scenario.whenResume : scenario.steps;

const received = [];
let eof = false;
let wake = null;
const notify = () => { const callback = wake; wake = null; callback?.(); };
const input = readline.createInterface({ input: process.stdin });
input.on("line", (line) => { received.push(line); record({ stdin: JSON.parse(line) }); notify(); });
input.on("close", () => { eof = true; notify(); });
const until = (test) => new Promise((resolve) => {
  const check = () => (test() ? resolve() : (wake = check));
  check();
});

(async () => {
  let consumed = 0;
  for (const step of steps) {
    if (step.await === "user") {
      await until(() => received.length > consumed);
      consumed += 1;
    } else if (step.await === "eof") {
      await until(() => eof);
    } else if (step.emit) {
      process.stdout.write(`${JSON.stringify(step.emit)}\n`);
    } else if (step.stderr) {
      process.stderr.write(step.stderr);
    } else if (step.exit !== undefined) {
      process.exit(step.exit);
    } else if (step.hang) {
      setInterval(() => {}, 1000);
      return;
    }
  }
  process.exit(0);
})();
