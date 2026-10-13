"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

async function view() {
  return import(pathToFileURL(path.join(__dirname, "..", "src", "renderer", "project-view.mjs")).href);
}

const recent = [
  { path: "C:\\Users\\G\\Documents\\Forge3D\\Projects\\Bottle\\Bottle.forge3d", name: "Bottle", folder: "C:\\Users\\G\\Documents\\Forge3D\\Projects\\Bottle", missing: false },
  { path: "D:\\Art\\Pod\\Pod.forge3d", name: "Pod", folder: "D:\\Art\\Pod", missing: true },
];

test("the File menu offers New, Open, recent projects, Save, Save as and Close", async () => {
  const { fileMenuModel } = await view();
  const items = fileMenuModel({ project: { name: "Spoon", file: "D:\\Spoon\\Spoon.forge3d" }, recent });
  const ids = items.filter((item) => item !== "-" && !item.heading).map((item) => item.id);
  assert.deepEqual(ids.filter((id) => !id.startsWith("recent:")), ["new", "open", "clear-recent", "save", "save-as", "reveal", "close"]);
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
  const items = fileMenuModel({ project: { name: "Spoon", file: "D:\\Spoon\\Spoon.forge3d" }, recent, busy: true });
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
  assert.equal(projectTitle(null), "Forge3D");
  assert.equal(projectTitle({ name: "Untitled project", dirty: true }), "● Untitled project — Forge3D");
  assert.equal(displayFolder("C:\\Users\\George\\Documents\\Forge3D"), "~\\Documents\\Forge3D");
  assert.equal(displayFolder("D:\\Art"), "D:\\Art");
});
