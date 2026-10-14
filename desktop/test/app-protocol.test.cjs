"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { APP_ID, APP_PRIVILEGES, EMBED_REFERRER, appFile, identifyToYouTube, isAppUrl, openHttps } = require("../src/lib/app-protocol.cjs");
const pkg = require("../package.json");

const root = path.resolve("/srv/dist");

test("the app scheme is standard and secure, so pages keep storage and send a referrer", () => {
  assert.equal(APP_PRIVILEGES.scheme, "dimensio-app");
  assert.equal(APP_PRIVILEGES.privileges.standard, true);
  assert.equal(APP_PRIVILEGES.privileges.secure, true);
  assert.equal(APP_PRIVILEGES.privileges.supportFetchAPI, true);
});

test("app URLs map to files inside the renderer folder only", () => {
  assert.equal(appFile(root, "dimensio-app://app/index.html"), path.join(root, "index.html"));
  assert.equal(appFile(root, "dimensio-app://app/"), path.join(root, "index.html"));
  assert.equal(appFile(root, "dimensio-app://app/assets/index-1.js?x=1#y"), path.join(root, "assets", "index-1.js"));
  assert.equal(appFile(root, "dimensio-app://app/workshop.html"), path.join(root, "workshop.html"));
  // The URL parser folds an encoded "..", so it stays inside; an encoded slash cannot climb out.
  assert.equal(appFile(root, "dimensio-app://app/%2e%2e/secret.txt"), path.join(root, "secret.txt"));
  assert.equal(appFile(root, "dimensio-app://app/..%2fsecret.txt"), null);
  assert.equal(appFile(root, "dimensio-app://other/index.html"), null);
  assert.equal(appFile(root, "file:///srv/dist/index.html"), null);
  assert.equal(appFile(root, "not a url"), null);
});

test("only the app's own pages count as the app", () => {
  assert.equal(isAppUrl("dimensio-app://app/index.html#/course"), true);
  assert.equal(isAppUrl("dimensio-app://app.evil/index.html"), false);
  assert.equal(isAppUrl("https://www.youtube-nocookie.com/embed/x"), false);
});

test("links open in the system browser only when they are https", () => {
  const opened = [];
  const shell = { openExternal: (url) => { opened.push(url); return Promise.resolve(); } };
  assert.equal(openHttps(shell, "https://docs.blender.org/manual/en/5.2/"), true);
  assert.equal(openHttps(shell, "http://example.com/"), false);
  assert.equal(openHttps(shell, "file:///C:/Windows/System32/calc.exe"), false);
  assert.equal(openHttps(shell, "javascript:alert(1)"), false);
  assert.equal(openHttps(shell, "nonsense"), false);
  assert.deepEqual(opened, ["https://docs.blender.org/manual/en/5.2/"]);
});

test("YouTube's player page is told which app embeds it, as YouTube asks of desktop apps", () => {
  assert.equal(APP_ID, pkg.build.appId);
  assert.equal(EMBED_REFERRER, `https://${pkg.build.appId}/`);
  let filter = null;
  let listener = null;
  identifyToYouTube({ webRequest: { onBeforeSendHeaders: (f, l) => { filter = f; listener = l; } } });
  assert.deepEqual(filter.urls, ["https://www.youtube-nocookie.com/embed/*"]);
  const send = (requestHeaders) => new Promise((resolve) => listener({ requestHeaders }, (answer) => resolve(answer.requestHeaders)));
  return Promise.all([
    send({ Accept: "text/html" }).then((headers) => assert.equal(headers.Referer, "https://com.instrumenta.forge3d/")),
    send({ referer: "https://example.org/" }).then((headers) => { assert.equal(headers.referer, "https://example.org/"); assert.equal(headers.Referer, undefined); }),
  ]);
});
