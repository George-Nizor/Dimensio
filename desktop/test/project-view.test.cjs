"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

async function view() {
  return import(pathToFileURL(path.join(__dirname, "..", "src", "renderer", "project-view.mjs")).href);
}

const recent = [
  { path: "C:\\Users\\G\\Documents\\Dimensio\\Projects\\Bottle\\Bottle.dimensio", name: "Bottle", folder: "C:\\Users\\G\\Documents\\Dimensio\\Projects\\Bottle", missing: false },
  { path: "D:\\Art\\Pod\\Pod.dimensio", name: "Pod", folder: "D:\\Art\\Pod", missing: true },
];

test("the File menu offers New, Open, recent projects, Save, Save as and Close", async () => {
  const { fileMenuModel } = await view();
  const items = fileMenuModel({ project: { name: "Spoon", file: "D:\\Spoon\\Spoon.dimensio" }, recent });
  const ids = items.filter((item) => item !== "-" && !item.heading).map((item) => item.id);
  assert.deepEqual(ids.filter((id) => !id.startsWith("recent:")), ["new", "open", "clear-recent", "save", "save-as", "rename", "reveal", "close", "delete"]);
  assert.equal(items.find((item) => item.id === "new").hint, "Ctrl+N");
  assert.equal(items.find((item) => item.id === "save-as").hint, "Ctrl+Shift+S");
  assert.equal(items.find((item) => item.label === "Pod").disabled, true, "a missing project cannot be opened");
});

test("with no project open, only New, Open and the recent list work", async () => {
  const { fileMenuModel } = await view();
  const items = fileMenuModel({ project: null, recent: [] });
  const enabled = items.filter((item) => item !== "-" && !item.heading && !item.disabled).map((item) => item.id);
  assert.deepEqual(enabled, ["new", "open"]);
  assert.equal(items.some((item) => item.heading), false, "no empty Open recent section");
});

test("a run in flight blocks switching projects but not saving", async () => {
  const { fileMenuModel } = await view();
  const items = fileMenuModel({ project: { name: "Spoon", file: "D:\\Spoon\\Spoon.dimensio" }, recent, busy: true });
  const state = Object.fromEntries(items.filter((item) => item.id).map((item) => [item.id, Boolean(item.disabled)]));
  assert.equal(state.new, true);
  assert.equal(state.open, true);
  assert.equal(state["save-as"], true);
  assert.equal(state.close, true);
  assert.equal(state.save, false);
});

test("the open project is left out of its own recent list", async () => {
  const { recentEntries } = await view();
  const project = { file: recent[0].path.toUpperCase() };
  assert.deepEqual(recentEntries(recent, project).map((item) => item.name), ["Pod"]);
});

test("Ctrl+N, Ctrl+O, Ctrl+S and Ctrl+Shift+S are the project shortcuts", async () => {
  const { shortcutCommand } = await view();
  assert.equal(shortcutCommand({ key: "n", ctrlKey: true }), "new");
  assert.equal(shortcutCommand({ key: "O", ctrlKey: true }), "open");
  assert.equal(shortcutCommand({ key: "s", metaKey: true }), "save");
  assert.equal(shortcutCommand({ key: "S", ctrlKey: true, shiftKey: true }), "save-as");
  assert.equal(shortcutCommand({ key: "s" }), null);
  assert.equal(shortcutCommand({ key: "n", ctrlKey: true, shiftKey: true }), null);
  assert.equal(shortcutCommand({ key: "s", ctrlKey: true, altKey: true }), null);
  assert.equal(shortcutCommand({ key: "k", ctrlKey: true }), null);
});

test("titles and folders read the way the main process writes them", async () => {
  const { displayFolder, projectTitle } = await view();
  assert.equal(projectTitle(null), "Dimensio");
  assert.equal(projectTitle({ name: "Untitled project", dirty: true }), "● Untitled project — Dimensio");
  assert.equal(displayFolder("C:\\Users\\George\\Documents\\Dimensio"), "~\\Documents\\Dimensio");
  assert.equal(displayFolder("D:\\Art"), "D:\\Art");
});

test("rename and delete are for a saved project with no run in flight", async () => {
  const { fileMenuModel } = await view();
  const state = (options) => Object.fromEntries(fileMenuModel(options).filter((item) => item.id).map((item) => [item.id, Boolean(item.disabled)]));
  const saved = { name: "Spoon", file: "D:\\Spoon\\Spoon.dimensio", untitled: false };
  assert.deepEqual([state({ project: saved }).rename, state({ project: saved }).delete], [false, false]);
  const untitled = { name: "Untitled project", file: null, untitled: true };
  assert.deepEqual([state({ project: untitled }).rename, state({ project: untitled }).delete], [true, true]);
  assert.equal(fileMenuModel({ project: untitled }).find((item) => item.id === "rename").title, "Save the project first");
  assert.deepEqual([state({ project: saved, busy: true }).rename, state({ project: saved, busy: true }).delete], [true, true]);
  assert.equal(fileMenuModel({ project: null }).find((item) => item.id === "delete").disabled, true);
});

test("workshop.html#setup opens the setup card, which the start screen does not cover", async () => {
  const { setupRequested, startScreenVisible } = await view();
  assert.equal(setupRequested("#setup"), true);
  assert.equal(setupRequested("setup"), true);
  assert.equal(setupRequested(""), false);
  assert.equal(setupRequested("#/settings"), false);
  assert.equal(startScreenVisible({ project: null }), true);
  assert.equal(startScreenVisible({ project: null, setupOpen: true }), false);
  assert.equal(startScreenVisible({ project: undefined }), false, "nothing is known yet");
  assert.equal(startScreenVisible({ project: { name: "Spoon" } }), false);
});

test("the Workshop opens its setup card when it loads with #setup", () => {
  const fs = require("node:fs");
  const renderer = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "main.js"), "utf8");
  assert.match(renderer, /if \(setupRequested\(location\.hash\)\) openSetup\(true\);/);
  assert.match(renderer, /addEventListener\("hashchange"/);
  const settings = fs.readFileSync(path.join(__dirname, "..", "src", "course", "places", "Settings.tsx"), "utf8");
  assert.match(settings, /href="\.\/workshop\.html#setup"/);
});
