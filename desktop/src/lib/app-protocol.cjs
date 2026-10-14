"use strict";

// The window's pages are served from dimensio-app://app/ instead of file://. A privileged, standard,
// secure scheme gives both pages one real origin, so they share localStorage and IndexedDB, and
// stay off the network. Only files under the built renderer (desktop/dist) are served.
//
// Lesson videos need one more thing. YouTube's embedded player refuses to play when the request
// for it carries no Referer ("Video player configuration error", error 152 or 153), and Chromium
// sends none from a file:// page or from a custom scheme like this one. YouTube's rules for
// desktop apps (developers.google.com/youtube/terms/required-minimum-functionality, "API Client
// Identity") say to add the header yourself, as https://<app id>/. identifyToYouTube does that for
// the player's own page and nothing else. Checked in Electron 43: without it the player shows the
// error, with it the video plays.

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const APP_SCHEME = "dimensio-app";
// The app id electron-builder registers (package.json build.appId). A test keeps the two the same.
const APP_ID = "com.instrumenta.dimensio";
const EMBED_URLS = ["https://www.youtube-nocookie.com/embed/*"];
const EMBED_REFERRER = `https://${APP_ID}/`;
const APP_HOST = "app";
const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;

// For protocol.registerSchemesAsPrivileged, which takes every custom scheme in one call.
const APP_PRIVILEGES = Object.freeze({
  scheme: APP_SCHEME,
  privileges: { standard: true, secure: true, supportFetchAPI: true, codeCache: true },
});

// The file a dimensio-app:// URL names, or null when it is outside the renderer folder.
function appFile(root, url) {
  let parsed;
  try { parsed = new URL(url); } catch { return null; }
  if (parsed.protocol !== `${APP_SCHEME}:` || parsed.host !== APP_HOST) return null;
  let relative;
  try { relative = decodeURIComponent(parsed.pathname).replace(/^\/+/, ""); } catch { return null; }
  if (!relative) relative = "index.html";
  const base = path.resolve(root);
  const absolute = path.resolve(base, relative);
  if (absolute !== base && !absolute.startsWith(base + path.sep)) return null;
  return absolute;
}

function isAppUrl(url) {
  return typeof url === "string" && url.startsWith(`${APP_ORIGIN}/`);
}

// Adds Referer: https://<app id>/ to the request for YouTube's player page when it has none.
function identifyToYouTube(session) {
  session.webRequest.onBeforeSendHeaders({ urls: EMBED_URLS }, (details, callback) => {
    const headers = { ...details.requestHeaders };
    if (!Object.keys(headers).some((name) => name.toLowerCase() === "referer")) headers.Referer = EMBED_REFERRER;
    callback({ requestHeaders: headers });
  });
}

function registerAppProtocol({ protocol, net, root, session }) {
  protocol.handle(APP_SCHEME, (request) => {
    const file = appFile(root, request.url);
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) return new Response("Not found", { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  if (session) identifyToYouTube(session);
}

// Links the pages open (a teacher's video, the Blender manual) go to the system browser, and only
// when they are https.
function openHttps(shell, url) {
  let parsed;
  try { parsed = new URL(url); } catch { return false; }
  if (parsed.protocol !== "https:") return false;
  shell.openExternal(parsed.toString()).catch(() => {});
  return true;
}

module.exports = { APP_ID, APP_ORIGIN, APP_PRIVILEGES, APP_SCHEME, EMBED_REFERRER, appFile, identifyToYouTube, isAppUrl, openHttps, registerAppProtocol };
