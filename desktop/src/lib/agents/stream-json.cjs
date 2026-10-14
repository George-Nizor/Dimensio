"use strict";

// Reads `claude -p --output-format stream-json --verbose --replay-user-messages` output. One line in, a list of
// small normalised events out; anything Dimensio does not use becomes []. The shapes are the ones recorded from
// Claude Code 2.1.299 in test/fixtures/claude/*.json:
//
//   {"type":"system","subtype":"init","session_id","model","tools":[...],"mcp_servers":[{name,status}],"plugins":[...]}
//   {"type":"user","isReplay":true,"message":{"content":...}}          an echo of a message Dimensio wrote to stdin
//   {"type":"assistant","message":{"content":[{type:"text"|"tool_use"|"thinking",...}]}}
//   {"type":"user","message":{"content":[{type:"tool_result",tool_use_id,is_error,content}]}}
//   {"type":"system","subtype":"permission_denied","tool_name","tool_use_id","message"}
//   {"type":"result","subtype":"success"|"error_...","is_error","result","session_id","total_cost_usd",
//    "num_turns","duration_ms","usage":{...},"queued_turn_count","uuid","permission_denials":[...]}
//
// Hook, thinking-token, task-summary and post-turn-summary system events are ignored.

const SIGNED_OUT = /not logged in|please run \/login|invalid api key|oauth token|authentication[_ ]error|sign(?:ed)?[- ]?in required/i;

function textOf(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.filter((block) => block?.type === "text" && typeof block.text === "string").map((block) => block.text).join("\n");
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function interpretLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return [];
  }
  if (!message || typeof message !== "object") return [];
  const events = [];
  if (message.type === "system") {
    if (message.subtype === "init") {
      events.push({
        kind: "init",
        sessionId: typeof message.session_id === "string" ? message.session_id : null,
        model: typeof message.model === "string" ? message.model : "",
        version: typeof message.claude_code_version === "string" ? message.claude_code_version : "",
        tools: Array.isArray(message.tools) ? message.tools : [],
        mcpServers: Array.isArray(message.mcp_servers) ? message.mcp_servers : [],
        plugins: Array.isArray(message.plugins) ? message.plugins.map((plugin) => plugin?.name).filter(Boolean) : [],
        skills: Array.isArray(message.skills) ? message.skills : [],
      });
    } else if (message.subtype === "permission_denied") {
      events.push({ kind: "denied", tool: String(message.tool_name || "a tool"), toolUseId: message.tool_use_id || null, text: String(message.message || "") });
    }
    return events;
  }
  if (message.type === "assistant") {
    const content = message.message?.content;
    if (typeof content === "string") {
      if (content.trim()) events.push({ kind: "text", text: content });
      return events;
    }
    for (const block of Array.isArray(content) ? content : []) {
      if (block?.type === "text" && typeof block.text === "string" && block.text.trim()) events.push({ kind: "text", text: block.text });
      else if (block?.type === "tool_use") events.push({ kind: "tool_use", id: String(block.id || ""), name: String(block.name || ""), input: block.input && typeof block.input === "object" ? block.input : {} });
    }
    return events;
  }
  if (message.type === "user") {
    const content = message.message?.content;
    if (message.isReplay) {
      events.push({ kind: "echo", text: textOf(content), uuid: message.uuid || null });
      return events;
    }
    for (const block of Array.isArray(content) ? content : []) {
      if (block?.type === "tool_result") {
        events.push({ kind: "tool_result", toolUseId: String(block.tool_use_id || ""), isError: Boolean(block.is_error), text: textOf(block.content) });
      }
    }
    return events;
  }
  if (message.type === "result") {
    const usage = message.usage || {};
    events.push({
      kind: "result",
      sessionId: typeof message.session_id === "string" ? message.session_id : null,
      uuid: typeof message.uuid === "string" ? message.uuid : null,
      subtype: String(message.subtype || ""),
      isError: Boolean(message.is_error) || String(message.subtype || "").startsWith("error"),
      text: typeof message.result === "string" ? message.result : "",
      costUsd: number(message.total_cost_usd),
      durationMs: number(message.duration_ms),
      turns: number(message.num_turns),
      queued: number(message.queued_turn_count),
      denials: Array.isArray(message.permission_denials) ? message.permission_denials.length : 0,
      usage: {
        inputTokens: number(usage.input_tokens),
        outputTokens: number(usage.output_tokens),
        cacheReadTokens: number(usage.cache_read_input_tokens),
        cacheCreationTokens: number(usage.cache_creation_input_tokens),
      },
    });
    return events;
  }
  if (message.type === "rate_limit_event") {
    const info = message.rate_limit_info || {};
    events.push({ kind: "rate_limit", status: String(info.status || ""), resetsAt: number(info.resetsAt) || null });
  }
  return events;
}

// A Claude Code tool call as one of the step items main.cjs already draws (the Codex item vocabulary): shell
// commands are commandExecution, MCP calls are mcpToolCall, file writes are fileChange. Reading, searching and
// loading the skill are "agentTool", which the run view does not count as a production step.
function toolItem(name, input = {}, id = "") {
  const base = { id, name };
  if (name === "Bash" || name === "PowerShell") return { ...base, type: "commandExecution", command: typeof input.command === "string" ? input.command : "" };
  const mcp = /^mcp__([^_].*?)__(.+)$/.exec(name);
  if (mcp) return { ...base, type: "mcpToolCall", server: mcp[1], tool: mcp[2] };
  if (name === "Write" || name === "Edit" || name === "NotebookEdit") {
    const file = input.file_path || input.notebook_path;
    return { ...base, type: "fileChange", changes: file ? [{ path: String(file) }] : [] };
  }
  if (name === "WebSearch") return { ...base, type: "webSearch" };
  return { ...base, type: "agentTool" };
}

module.exports = { SIGNED_OUT, interpretLine, textOf, toolItem };
